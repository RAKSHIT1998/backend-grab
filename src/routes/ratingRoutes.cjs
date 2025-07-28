
const { Router } = require("express");
const auth = require("../middleware/auth.cjs");
let ratingModel;
async function getRatingModel() {
  if (!ratingModel) {
    const mod = await import("../models/ratingModel.js");
    ratingModel = mod.default || mod;
  }
  return ratingModel;
}
let menuModel;
async function getMenuModel() {
  if (!menuModel) {
    const mod = await import("../models/menuModel.js");
    menuModel = mod.default || mod;
  }
  return menuModel;
}
const ratingRouter = Router();

ratingRouter.use(auth);

// GET - Fetch all ratings for a specific menu item
ratingRouter.get("/:itemId", async (req, res) => {
  try {
    const Rating = await getRatingModel();
    const { itemId } = req.params;
    const userId = req.user._id
    const ratings = await Rating.find({ itemId });
    const userRating = await Rating.findOne({ itemId, userId });

    
    if (ratings.length === 0) {
      return res.status(200).json({ averageRating: 0, totalRatings: 0, userRating: 0, ratings: [] });
    }

    const totalRatings = ratings.length;
    const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings;

    return res.status(200).json({
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalRatings,
      userRating: userRating ? userRating.rating : 0,
      ratings
    });
  } catch (err) {
    console.error("Error fetching ratings:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST - Add/Update rating for a menu item
ratingRouter.post("/", async (req, res) => {
  const { itemId, rating } = req.body;
  const userId = req.user._id;

  try {
    const Rating = await getRatingModel();
    const Menu = await getMenuModel();
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if menu item exists
    const menuItem = await Menu.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    

    // Check if this session/IP already rated this item
    let existingRating = await Rating.findOne({ itemId, userId });
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      // Create new rating
      await Rating.create({
        itemId,
        userId,
        rating,
      });
    }

    // Recalculate average rating for the menu item
    const allRatings = await Rating.find({ itemId });
    const totalRatings = allRatings.length;
    const averageRating = totalRatings > 0 ? allRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings : 0;

    // Update menu item with new average
    const updatedMenuItem = await Menu.findByIdAndUpdate(
      itemId,
      { 
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings 
      },
      { new: true }
    );

    // Emit real-time update
    req.io.emit("ratingUpdated", {
      itemId,
      averageRating: updatedMenuItem.averageRating,
      totalRatings: updatedMenuItem.totalRatings,
      action: existingRating ? "updated" : "added"
    });

    return res.status(200).json({
      message: existingRating ? "Rating updated successfully" : "Rating added successfully",
      averageRating: updatedMenuItem.averageRating,
      totalRatings: updatedMenuItem.totalRatings,
      userRating: rating
    });

  } catch (err) {
    console.error("Error adding/updating rating:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET - Get average rating for multiple items (for menu display)
ratingRouter.get("/", async (req, res) => {
  try {
    const Rating = await getRatingModel();
    const Menu = await getMenuModel();
    const userId = req.user._id;
    const menuItems = await Menu.find({}, {
      _id: 1,
      itemName: 1,
      averageRating: 1,
      totalRatings: 1
    });
     const userRatings = await Rating.find({ userId });
    const userRatingsMap = {};
    userRatings.forEach(rating => {
      userRatingsMap[rating.itemId.toString()] = rating.rating;
    });

    // Combine menu items with user ratings
    const itemsWithUserRatings = menuItems.map(item => ({
      ...item.toObject(),
      userRating: userRatingsMap[item._id.toString()] || 0
    }));
    
    return res.status(200).json(itemsWithUserRatings);
  } catch (err) {
    console.error("Error fetching menu ratings:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = ratingRouter;

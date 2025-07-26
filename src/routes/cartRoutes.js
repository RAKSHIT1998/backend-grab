
import { Router } from 'express';
import auth from '../middleware/auth.cjs';
import cartModel from '../models/cartModel.js';
import menuModel from '../models/menuModel.js';
const cartRouter = Router();

cartRouter.use(auth);

// GET - Fetch all cart items for logged-in user
cartRouter.get("/", async (req, res) => {
  try {
    const userId = req.user._id; // Assuming auth middleware adds user to req
    const cartItems = await cartModel.find({ userId }).populate("itemId");
    return res.status(200).send(cartItems);
  } catch (err) {
    console.error("Error fetching cart items:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST - Add item to cart
cartRouter.post("/", async (req, res) => {
  const { itemId, quantity = 1 } = req.body;
  const userId = req.user._id;

  try {
    // Check if menu item exists and is available
    const menuItem = await menuModel.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (!menuItem.availability) {
      return res.status(400).json({ message: "Item is out of stock" });
    }

     if (menuItem.quantity < quantity) {
      return res.status(400).json({ message: `Only ${menuItem.quantity} ${menuItem.itemName}(s) available` });
    }


    // Check if item already exists in cart
    const existingCartItem = await cartModel.findOne({ userId, itemId });

    if (existingCartItem) {
      const totalRequested = existingCartItem.quantity + quantity;
      if (menuItem.quantity < totalRequested) {
        return res.status(400).json({ 
          message: `Only ${menuItem.quantity} ${menuItem.itemName}(s) available. You already have ${existingCartItem.quantity} in cart.` 
        });
      }
      // Update quantity if item already exists
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      req.io.emit("cartItemAdded", { userId, itemId, action: "added" });
      return res.status(200).send(existingCartItem);
    } else {
      // Create new cart item
      const cartItem = await cartModel.create({
        userId,
        itemId,
        itemName: menuItem.itemName,
        categoryName: menuItem.categoryName,
        price: menuItem.price,
        quantity,
        description:
          menuItem.description ||
          `Delicious ${menuItem.itemName} from our ${menuItem.categoryName} collection`,
      });
      req.io.emit("cartItemAdded", { userId, itemId, action: "added" });
      return res.status(201).send(cartItem);
    }
  } catch (err) {
    console.error("Error adding to cart:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Item already in cart" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH - Update cart item quantity
cartRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const userId = req.user._id;

  try {
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cartItem = await cartModel.findOne({ _id: id, userId });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Check if the menu item is still available
    const menuItem = await menuModel.findById(cartItem.itemId);
    if (!menuItem || !menuItem.availability) {
      return res.status(400).json({ message: "Item is no longer available" });
    }

     if (menuItem.quantity < quantity) {
      return res.status(400).json({ message: `Only ${menuItem.quantity} ${menuItem.itemName}(s) available` });
    }


    cartItem.quantity = quantity;
    await cartItem.save();
    req.io.emit("cartItemUpdated", {
      userId,
      itemId: cartItem.itemId,
      quantity,
      action: "updated",
      cartItemId: cartItem._id
    });
    return res.status(200).send(cartItem);
  } catch (err) {
    console.error("Error updating cart item:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE - Remove item from cart
cartRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const cartItem = await cartModel.findOne({ _id: id, userId });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartModel.findByIdAndDelete(id);
    req.io.emit("cartItemRemoved", {
      userId,
      itemId: cartItem.itemId,
      action: "removed",
      cartItemId: id
    });
    return res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Error removing cart item:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE - Clear entire cart for user
cartRouter.delete("/", async (req, res) => {
  const userId = req.user._id;

  try {
    await cartModel.deleteMany({ userId });
    req.io.emit("cartCleared", { userId, action: "cleared" });
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET - Get cart summary (total items and total price)
cartRouter.get("/summary", async (req, res) => {
  try {
    const userId = req.user._id;
    const cartItems = await cartModel.find({ userId });

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const summaryData = {
      totalItems,
      totalPrice,
      itemCount: cartItems.length,
    };
    req.io.emit("cartSummaryUpdated", { userId, summary: summaryData });
    return res.status(200).json(summaryData);
  } catch (err) {
    console.error("Error fetching cart summary:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default cartRouter;


import { Router } from 'express';
import auth from '../middleware/auth.cjs';
import menuModel from '../models/menuModel.js';
const menuRouter = Router();
menuRouter.use(auth);

menuRouter.get("/", async (req, res) => {
  try {
    const event = await menuModel.find({});
    return res.status(200).send(event);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
menuRouter.post("/", async (req, res) => {
  const { itemName, categoryName, price, quantity, availability } = req.body;
  try {
    const event = await menuModel.create({
      itemName: itemName,
      categoryName: categoryName,
      price: price,
      quantity: quantity,
      availability: availability,
    });
    req.io.emit("menuItemAdded", event);
    return res.status(201).send(event);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
menuRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const event = await menuModel.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await menuModel.findByIdAndDelete(id);
     const cartModel = (await import("../models/cartModel.js")).default;
    const removedCartItems = await cartModel.find({ itemId: id });
    await cartModel.deleteMany({ itemId: id });
    req.io.emit("menuItemDeleted", id);
     removedCartItems.forEach((cartItem) => {
      req.io.emit("cartItemRemovedByAdmin", {
        userId: cartItem.userId,
        itemId: id,
        cartItemId: cartItem._id,
        action: "removed_by_deletion",
      });
    });
    return res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

menuRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { itemName, categoryName, price, quantity, availability } = req.body;
  try {
    const updatedMenuItem = await menuModel.findByIdAndUpdate(
      id,
      { itemName, categoryName, price, quantity, availability },
      { new: true }
    );
    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    req.io.emit("menuItemUpdated", updatedMenuItem);
    const cartModel = (await import("../models/cartModel.js")).default;
    if (!updatedMenuItem.availability) {
      // Remove this item from all users' carts when it goes out of stock
      const removedCartItems = await cartModel.find({ itemId: id });
      await cartModel.deleteMany({ itemId: id });
      // Emit cart removal events for each affected user
      removedCartItems.forEach((cartItem) => {
        req.io.emit("cartItemRemovedByAdmin", {
          userId: cartItem.userId,
          itemId: id,
          cartItemId: cartItem._id,
          action: "removed_by_admin",
        });
      });
    } else {
      await cartModel.updateMany(
        { itemId: id },
        {
          itemName: updatedMenuItem.itemName,
          categoryName: updatedMenuItem.categoryName,
          price: updatedMenuItem.price,
          // Note: Don't update quantity as that's user-specific cart quantity
        }
      );
         const affectedCartItems = await cartModel.find({ itemId: id });
      affectedCartItems.forEach((cartItem) => {
        req.io.emit("cartItemUpdatedByAdmin", {
          userId: cartItem.userId,
          itemId: id,
          cartItemId: cartItem._id,
          updatedData: {
            itemName: updatedMenuItem.itemName,
            categoryName: updatedMenuItem.categoryName,
            price: updatedMenuItem.price,
          },
          action: "updated_by_admin",
        });
      });
    }

    req.io.emit("menuItemAvailabilityChanged", {
      itemId: id,
      availability: updatedMenuItem.availability,
    });
    return res.status(200).send(updatedMenuItem);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default menuRouter;

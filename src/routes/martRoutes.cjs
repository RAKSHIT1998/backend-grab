// src/routes/martRoutes.js
const express = require("express");
let Mart;
async function getMartModel() {
  if (!Mart) {
    const mod = await import("../models/martModel.js");
    Mart = mod.default;
  }
  return Mart;
}
const auth = require("../middleware/auth.cjs");
const { v4: uuidv4 } = require("uuid");

const martRouter = express.Router();

// Add new mart item (admin/partner)
martRouter.post("/", auth, async (req, res) => {
  try {
    const Mart = await getMartModel();
    const { name, description, price, image, stock, category } = req.body;
    const newItem = await Mart.create({
      itemId: uuidv4(),
      name,
      description,
      price,
      image,
      stock,
      category,
      addedBy: req.user.id,
    });
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (err) {
    console.error("Add item error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all mart items
martRouter.get("/", async (req, res) => {
  try {
    const Mart = await getMartModel();
    const items = await Mart.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// Get single item
martRouter.get("/:id", async (req, res) => {
  try {
    const Mart = await getMartModel();
    const item = await Mart.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error fetching item" });
  }
});

// Update item
martRouter.patch("/:id", auth, async (req, res) => {
  try {
    const Mart = await getMartModel();
    const updated = await Mart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item updated", item: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// Delete item
martRouter.delete("/:id", auth, async (req, res) => {
  try {
    const Mart = await getMartModel();
    const deleted = await Mart.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = martRouter;

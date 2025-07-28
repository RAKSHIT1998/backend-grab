import express from 'express';
import Destination from '../models/destinationModel.js';

const router = express.Router();

// Get all destinations
router.get('/', async (req, res) => {
  const destinations = await Destination.find().sort({ createdAt: -1 });
  res.json(destinations);
});

// Create destination
router.post('/', async (req, res) => {
  try {
    const dest = await Destination.create(req.body);
    res.status(201).json(dest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get single destination
router.get('/:id', async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Not found' });
    res.json(dest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update destination
router.put('/:id', async (req, res) => {
  try {
    const dest = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!dest) return res.status(404).json({ message: 'Not found' });
    res.json(dest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete destination
router.delete('/:id', async (req, res) => {
  try {
    const dest = await Destination.findByIdAndDelete(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

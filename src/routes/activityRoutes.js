import express from 'express';
import Activity from '../models/activityModel.js';

const router = express.Router();

// Get all activities
router.get('/', async (req, res) => {
  const activities = await Activity.find().sort({ createdAt: -1 });
  res.json(activities);
});

// Create an activity
router.post('/', async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

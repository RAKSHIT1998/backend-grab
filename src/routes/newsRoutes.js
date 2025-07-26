import express from 'express';
import News from '../models/newsModel.js';

const router = express.Router();

// Get all news
router.get('/', async (req, res) => {
  const news = await News.find().sort({ createdAt: -1 });
  res.json(news);
});

// Create news entry
router.post('/', async (req, res) => {
  try {
    const created = await News.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

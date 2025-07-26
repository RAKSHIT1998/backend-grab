import express from 'express';
import Movie from '../models/movieModel.js';

const router = express.Router();

// Get all movies
router.get('/', async (req, res) => {
  const movies = await Movie.find().sort({ createdAt: -1 });
  res.json(movies);
});

// Create a movie entry
router.post('/', async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

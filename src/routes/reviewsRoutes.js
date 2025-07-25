import express from 'express';
const router = express.Router();
import Review from '../models/Review.js';

// User posts a review
router.post('/', async (req, res) => {
  const { restaurantId, userId, rating, text } = req.body;
  const review = new Review({ restaurantId, userId, rating, text });
  await review.save();
  res.json(review);
});

// Get reviews for restaurant
router.get('/restaurant/:id', async (req, res) => {
  const reviews = await Review.find({ restaurantId: req.params.id }).populate('userId', 'name');
  res.json(reviews);
});

// Admin get all
router.get('/all', async (req, res) => {
  const reviews = await Review.find().populate('restaurantId', 'name').populate('userId', 'name');
  res.json(reviews);
});
export default router;

import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

router.post('/register', async (req, res) => {
  // userType: "customer", "driver", "vendor"
  // hash password, save user
});
router.post('/login', async (req, res) => {
  // check by email/phone, compare password, return JWT
});
export default router;

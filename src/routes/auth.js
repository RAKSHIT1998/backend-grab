const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  // userType: "customer", "driver", "vendor"
  // hash password, save user
});
router.post('/login', async (req, res) => {
  // check by email/phone, compare password, return JWT
});
module.exports = router;
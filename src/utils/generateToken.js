// src/utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role, // optional
    },
    process.env.JWT_SECRET || '#479@/^5149*@123',
    {
      expiresIn: '30d',
    }
  );
};

export default generateToken;

import jwt from 'jsonwebtoken';
import Partner from '../models/partnerModel.js';

const JWT_SECRET = process.env.JWT_SECRET || '#479@/^5149*@123';

export const protectPartner = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const partner = await Partner.findById(decoded.id);
    if (!partner) return res.status(404).json({ message: 'Partner not found' });
    req.partner = partner;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default protectPartner;

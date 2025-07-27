import express from 'express';
import { createTicket, getMyTickets } from '../controllers/supportController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protectUser);

router.post('/', createTicket);
router.get('/my', getMyTickets);

export default router;

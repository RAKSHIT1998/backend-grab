import asyncHandler from 'express-async-handler';
import SupportTicket from '../models/supportTicketModel.js';

// Submit a new support ticket
export const createTicket = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  const ticket = await SupportTicket.create({
    user: req.user._id,
    subject,
    message,
  });
  res.status(201).json(ticket);
});

// Get all tickets for logged in user
export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(tickets);
});

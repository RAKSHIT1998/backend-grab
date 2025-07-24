// src/controllers/taxiSocketController.js
import TaxiRequest from '../models/taxiRequestModel.js';
import Bid from '../models/bidModel.js';
import { getETA } from '../utils/etaHelper.js';

export const handleTaxiRequest = async (socket, data) => {
  const { userId, pickup, drop } = data;
  const eta = await getETA(pickup, drop);
  const newRequest = await TaxiRequest.create({ userId, pickup, drop, eta });

  socket.broadcast.emit('newTaxiRequest', newRequest);
};

export const handleNewBid = async (socket, data) => {
  const { driverId, requestId, amount } = data;
  const bid = await Bid.create({ driverId, requestId, amount });

  socket.broadcast.emit('bidPlaced', { requestId, bid });
};

export const handleBidUpdate = async (socket, data) => {
  const { bidId, newAmount } = data;
  const bid = await Bid.findByIdAndUpdate(bidId, { amount: newAmount }, { new: true });

  socket.broadcast.emit('bidUpdated', bid);
};

export const handleBidAccept = async (socket, data) => {
  const { bidId } = data;
  const bid = await Bid.findById(bidId).populate('driverId');
  if (!bid) return;

  // Notify both customer and driver
  socket.to(bid.driverId.socketId).emit('bidAccepted', bid);
  socket.emit('confirmBidAccepted', bid);
};

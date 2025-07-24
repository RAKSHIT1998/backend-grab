// src/socket/taxiNamespace.js
import { Server } from 'socket.io';
import {
  handleTaxiRequest,
  handleNewBid,
  handleBidUpdate,
  handleBidAccept,
} from '../controllers/taxiSocketController.js';

export const initTaxiNamespace = (io) => {
  const taxiNamespace = io.of('/taxi');

  taxiNamespace.on('connection', (socket) => {
    console.log(`🟢 Taxi client connected: ${socket.id}`);

    socket.on('taxiRequest', (data) => handleTaxiRequest(socket, data));
    socket.on('newBid', (data) => handleNewBid(socket, data));
    socket.on('updateBid', (data) => handleBidUpdate(socket, data));
    socket.on('acceptBid', (data) => handleBidAccept(socket, data));

    socket.on('disconnect', () => {
      console.log(`🔴 Taxi client disconnected: ${socket.id}`);
    });
  });
};

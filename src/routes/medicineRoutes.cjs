const express = require('express');
let Medicine;
async function getMedicineModel() {
  if (!Medicine) {
    const mod = await import('../models/medicineModel.js');
    Medicine = mod.default;
  }
  return Medicine;
}
const auth = require('../middleware/auth.cjs');
const { v4: uuidv4 } = require('uuid');
let getIO;
async function loadSocket() {
  if (!getIO) {
    const mod = await import('../socket/socket.js');
    getIO = mod.getIO;
  }
  return getIO();
}
const medicineRouter = express.Router();

medicineRouter.post('/', auth, async (req, res) => {
  try {
    const Medicine = await getMedicineModel();
    const { pickupLocation, dropLocation, items, phoneNumber } = req.body;
    const order = await Medicine.create({
      orderId: uuidv4(),
      user: req.user.id,
      pickupLocation,
      dropLocation,
      items,
      phoneNumber,
      status: 'Pending',
    });

    const io = await loadSocket();
    if (io) {
      io.of('/driver').emit('medicine-delivery-request', {
        orderId: order.orderId,
        userId: req.user.id,
        pickupLocation,
        dropLocation,
        items,
        phoneNumber,
      });
    }

    res.status(201).json({ message: 'Medicine order created', order });
  } catch (err) {
    console.error('Medicine order error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = medicineRouter;

import Bid from '../models/bidModel.js';
import Ride from '../models/Ride.js';
import { getIO } from '../socket/socket.js';

// Driver places a bid on a ride
export const createBid = async (req, res) => {
  try {
    const { rideId, amount } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    const bid = await Bid.create({
      ride: rideId,
      driver: req.driver._id,
      user: ride.customerId,
      amount,
    });

    ride.bids.push({ driverId: req.driver._id.toString(), amount, status: 'bid' });
    await ride.save();

    const io = getIO();
    if (io) {
      io.of('/user').emit('driver-bid', { rideId, driverId: req.driver._id, amount });
    }

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: 'Failed to place bid' });
  }
};

// User accepts a bid
export const acceptBid = async (req, res) => {
  try {
    const { bidId } = req.body;
    const bid = await Bid.findById(bidId).populate('ride');
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    const ride = bid.ride;
    if (ride.customerId.toString() !== req.userDetails._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    bid.status = 'accepted';
    await bid.save();

    ride.assignedDriver = bid.driver.toString();
    ride.fare = bid.amount;
    ride.status = 'assigned';
    await ride.save();

    await Bid.updateMany({ ride: ride._id, _id: { $ne: bidId } }, { status: 'rejected' });

    const io = getIO();
    if (io) {
      io.of('/driver').emit('bid-accepted', { rideId: ride._id, driverId: bid.driver });
    }

    res.json({ message: 'Bid accepted', rideId: ride._id, driverId: bid.driver });
  } catch (err) {
    res.status(500).json({ message: 'Failed to accept bid' });
  }
};

// Get bids for a ride
export const getBidsByRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const bids = await Bid.find({ ride: rideId }).populate('driver', 'name');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bids' });
  }
};

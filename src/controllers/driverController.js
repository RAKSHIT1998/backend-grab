import Driver from '../models/driverModel.js';
import generateToken from '../utils/generateToken.js';

// Register a new driver
export const registerDriver = async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    vehicleType,
    licenseNumber,
    photo,
    vehicleBrand,
    vehicleModel,
    vehicleNumber,
  } = req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !password ||
    !vehicleType ||
    !vehicleNumber ||
    !licenseNumber
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const driverExists = await Driver.findOne({ email });
  if (driverExists) {
    return res.status(400).json({ message: 'Driver already exists' });
  }

  const driver = await Driver.create({
    name,
    email,
    phone,
    password,
    photo,
    vehicleType,
    vehicleBrand,
    vehicleModel,
    vehicleNumber,
    licenseNumber,
  });

  if (driver) {
    res.status(201).json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      token: generateToken(driver._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid driver data' });
  }
};

// Login driver
export const loginDriver = async (req, res) => {
  const { email, password } = req.body;

  const driver = await Driver.findOne({ email });

  if (driver && (await driver.matchPassword(password))) {
    res.json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      token: generateToken(driver._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// Get driver profile
export const getDriverProfile = async (req, res) => {
  const driver = await Driver.findById(req.driver._id).select('-password');

  if (driver) {
    res.json(driver);
  } else {
    res.status(404).json({ message: 'Driver not found' });
  }
};

// Update driver profile
export const updateDriverProfile = async (req, res) => {
  const driver = await Driver.findById(req.driver._id);
  if (!driver) return res.status(404).json({ message: 'Driver not found' });

  driver.name = req.body.name || driver.name;
  driver.phone = req.body.phone || driver.phone;
  driver.photo = req.body.photo || driver.photo;
  driver.vehicleBrand = req.body.vehicleBrand || driver.vehicleBrand;
  driver.vehicleModel = req.body.vehicleModel || driver.vehicleModel;
  driver.vehicleNumber = req.body.vehicleNumber || driver.vehicleNumber;
  driver.licenseNumber = req.body.licenseNumber || driver.licenseNumber;

  if (req.body.password) {
    driver.password = req.body.password;
  }

  const updated = await driver.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    phone: updated.phone,
    vehicleNumber: updated.vehicleNumber,
  });
};

// Update availability
export const toggleDriverAvailability = async (req, res) => {
  const driver = await Driver.findById(req.driver._id);
  if (!driver) return res.status(404).json({ message: 'Driver not found' });

  driver.isAvailable = !driver.isAvailable;
  await driver.save();

  res.json({ message: `Availability toggled to ${driver.isAvailable}` });
};

// Update driver's current location
export const updateDriverLocation = async (req, res) => {
  const driver = await Driver.findById(req.driver._id);
  if (!driver) return res.status(404).json({ message: 'Driver not found' });

  driver.location = {
    lat: req.body.lat,
    lng: req.body.lng,
    updatedAt: new Date(),
  };

  await driver.save();
  res.json({ message: 'Location updated' });
};

// Get all drivers (admin)
export const getAllDrivers = async (req, res) => {
  const drivers = await Driver.find().select('-password');
  res.json(drivers);
};

// Approve driver (admin)
export const approveDriver = async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).json({ message: 'Driver not found' });

  driver.isApproved = true;
  await driver.save();

  res.json({ message: 'Driver approved' });
};

// Delete driver (admin)
export const deleteDriver = async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).json({ message: 'Driver not found' });

  await driver.remove();
  res.json({ message: 'Driver deleted' });
};

// Fetch open taxi requests for drivers
export const getOpenTaxiRequests = async (req, res) => {
  try {
    const { default: Taxi } = await import('../models/taxiModel.js');
    const requests = await Taxi.find({ status: { $in: ['requested', 'Pending', 'bidding'] } })
      .select('rideId pickupLocation dropLocation estimatedFare rideType');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

// Fetch rides assigned to the logged in driver
export const getActiveDriverRides = async (req, res) => {
  try {
    const { default: Taxi } = await import('../models/taxiModel.js');
    const rides = await Taxi.find({
      driver: req.driver._id,
      status: { $nin: ['completed', 'cancelled'] },
    });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rides' });
  }
};

// Basic earnings analytics for a driver
export const getDriverAnalytics = async (req, res) => {
  try {
    const { default: Taxi } = await import('../models/taxiModel.js');
    const completed = await Taxi.find({ driver: req.driver._id, status: 'completed' });
    const totalEarnings = completed.reduce(
      (sum, r) => sum + ((r.finalFare || r.estimatedFare || 0) - (r.commission || 0)),
      0,
    );
    res.json({ completedRides: completed.length, totalEarnings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

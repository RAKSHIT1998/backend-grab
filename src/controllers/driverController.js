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

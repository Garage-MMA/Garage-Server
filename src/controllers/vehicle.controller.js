import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

const getMyVehicles = async (req, res) => {
  try {
    // Verify JWT token and get user ID
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Check customer role
    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: "Access denied: Customer role required" });
    }

    // Find user and select vehicles field
    const user = await User.findById(decoded.userId).select('vehicles');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Successfully retrieved vehicle list",
      vehicles: user.vehicles || []
    });
  } catch (error) {
    console.error("Error retrieving vehicle list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addVehicle = async (req, res) => {
  try {
    // Verify JWT token and get user ID
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Check customer role
    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: "Access denied: Customer role required" });
    }

    // Get vehicle data from body
    const { licensePlate, brand, model, year, color } = req.body;

    // Validation
    if (!licensePlate) {
      return res.status(400).json({ message: "License plate is required" });
    }

    // Validate license plate format (example regex for Vietnamese plates)
    const licensePlateRegex = /^[0-9]{2}[A-Z]{1,2}-[0-9]{4,5}$/;
    if (!licensePlateRegex.test(licensePlate)) {
      return res.status(400).json({ message: "Invalid license plate format" });
    }

    if (!brand || brand.trim().length === 0) {
      return res.status(400).json({ message: "Brand is required" });
    }

    if (!model || model.trim().length === 0) {
      return res.status(400).json({ message: "Model is required" });
    }

    if (!year || typeof year !== 'number' || year < 1900 || year > new Date().getFullYear() + 1) {
      return res.status(400).json({ message: "Year must be a valid number between 1900 and next year" });
    }

    if (!color || color.trim().length === 0) {
      return res.status(400).json({ message: "Color is required" });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if license plate already exists
    if (user.vehicles.some(vehicle => vehicle.licensePlate === licensePlate)) {
      return res.status(400).json({ message: "License plate already exists" });
    }

    // Add new vehicle
    const newVehicle = {
      licensePlate: licensePlate.trim(),
      brand: brand.trim(),
      model: model.trim(),
      year,
      color: color.trim()
    };
    user.vehicles.push(newVehicle);

    await user.save();

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle: newVehicle
    });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateVehicle = async (req, res) => {
  try {
    // Verify JWT token and get user ID
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Check customer role
    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: "Access denied: Customer role required" });
    }

    // Get license plate from params and update data from body
    const { licensePlate } = req.params;
    const { brand, model, year, color, newLicensePlate } = req.body;

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find vehicle to update
    const vehicle = user.vehicles.find(v => v.licensePlate === licensePlate);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Validate new license plate if provided
    if (newLicensePlate && newLicensePlate !== licensePlate) {
      const licensePlateRegex = /^[0-9]{2}[A-Z]{1,2}-[0-9]{4,5}$/;
      if (!licensePlateRegex.test(newLicensePlate)) {
        return res.status(400).json({ message: "Invalid new license plate format" });
      }
      if (user.vehicles.some(v => v.licensePlate === newLicensePlate)) {
        return res.status(400).json({ message: "New license plate already exists" });
      }
      vehicle.licensePlate = newLicensePlate.trim();
    }

    // Validate other fields if provided
    if (brand !== undefined) {
      if (typeof brand !== 'string' || brand.trim().length === 0) {
        return res.status(400).json({ message: "Brand must be a non-empty string" });
      }
      vehicle.brand = brand.trim();
    }

    if (model !== undefined) {
      if (typeof model !== 'string' || model.trim().length === 0) {
        return res.status(400).json({ message: "Model must be a non-empty string" });
      }
      vehicle.model = model.trim();
    }

    if (year !== undefined) {
      if (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear() + 1) {
        return res.status(400).json({ message: "Year must be a valid number between 1900 and next year" });
      }
      vehicle.year = year;
    }

    if (color !== undefined) {
      if (typeof color !== 'string' || color.trim().length === 0) {
        return res.status(400).json({ message: "Color must be a non-empty string" });
      }
      vehicle.color = color.trim();
    }

    await user.save();

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    // Verify JWT token and get user ID
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Check customer role
    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: "Access denied: Customer role required" });
    }

    // Get license plate from params
    const { licensePlate } = req.params;

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find and delete vehicle
    const vehicleIndex = user.vehicles.findIndex(v => v.licensePlate === licensePlate);
    if (vehicleIndex === -1) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    user.vehicles.splice(vehicleIndex, 1);
    await user.save();

    res.status(200).json({
      message: "Vehicle deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { getMyVehicles, addVehicle, updateVehicle, deleteVehicle };
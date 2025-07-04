import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js"; 

const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, role, vehicles } = req.body;

    if (!fullName || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let vehicleData = [];
    if (Array.isArray(vehicles)) {
      vehicleData = vehicles.map((vehicle) => ({
        licensePlate: vehicle.licensePlate?.trim(),
        brand: vehicle.brand?.trim(),
        model: vehicle.model?.trim(),
        year: vehicle.year,
        color: vehicle.color?.trim()
      }));
    }

    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      vehicles: vehicleData
    });

    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({
      message: "Registration successful",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export default {register, login}
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ===============================
// 🟢 REGISTER USER CONTROLLER
// ===============================
module.exports.registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the user's password for security
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
    });
    console.log(user);

    // Generate JWT token with user ID and username
    const token = jwt.sign({ 
        id: user._id, 
        name: user.username 
      },
      process.env.JWT_TOKEN
    );

    return res.status(200).json({ 
      token, 
      user,
      message: "User registered successfully",
      sucess: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      sucess: false,
      message: "Failed to register user",
      message: error.message,
    });
  }
};

// ===============================
// 🟡 LOGIN USER CONTROLLER
// ===============================
module.exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "password is required" });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ 
      id: user._id, 
      name: user.username 
    },
      process.env.JWT_TOKEN
    );

    return res.status(200).json({ 
      token, 
      user,
      message: "User logged in successfully",
      sucess: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      sucess: false,
      message: "Failed to login user",
      message: error.message 
    });
  }
};

// ===============================
// 🔴 LOGOUT USER CONTROLLER
// ===============================
module.exports.logoutController = (req, res) => {
  // Clear cookie and send success message
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully" });
};


// ===============================
// 🟢 CHECK AUTH (used for protected routes)
// ===============================
module.exports.checkAuth = (req, res) => {
  try {
    // If the request reaches here, the user is authenticated (thanks to authMiddleware)
    return res.status(200).json({ 
      message: "Authenticated", 
      userId: req.user._id,
      username: req.user.name,
      email: req.user.email,
    });
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

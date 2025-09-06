const express = require("express");
const { registerController, loginController, logoutController, checkAuth } = require("../controllers/user.controller");
const router = express.Router();

const { authMiddleware } = require("../middleware/user.middleware");

// Route for user registration
router.post("/register", registerController);

// Route for user login
router.post("/login", loginController); 

// Route for logging out
router.post("/logout", logoutController);

// Route to check if a user is authenticated (protected by middleware)
router.get("/check-auth", authMiddleware, checkAuth);

module.exports = router;

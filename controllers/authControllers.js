const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");
 
// Generate JWT

const generateToken = (userId) => {

  return jwt.sign(

    {

      userId: userId,

    },

    process.env.JWT_SECRET,

    {

      expiresIn: process.env.JWT_EXPIRES_IN || "1d",

    }

  );

};
 
// ============================

// SIGNUP

// ============================
 
const signup = async (req, res) => {

  try {
    console.log(req.bodys)
    const { username, email, password } = req.body;
 
    // Validate input

    if (!username || !email || !password) {

      return res.status(400).json({

        success: false,

        message: "Name, email and password are required",

      });

    }
 
    // Check if user already exists

    const existingUser = await User.findOne({

      email: email.toLowerCase(),

    });
 
    if (existingUser) {

      return res.status(409).json({

        success: false,

        message: "User already exists",

      });

    }
 
    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);
 
    // Create user

    const user = await User.create({

      username,

      email: email.toLowerCase(),

      password: hashedPassword,

    });
 
    // Generate token

    const token = generateToken(user._id);
 
    return res.status(201).json({

      success: true,

      message: "User registered successfully",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

      },

    });

  } catch (error) {

    console.error("Signup error:", error);
 
    return res.status(500).json({

      success: false,

      message: "Server error",

    });

  }

};
 
// ============================

// LOGIN

// ============================
 
const login = async (req, res) => {

  try {

    const { email, password } = req.body;
 
    // Validate input

    if (!email || !password) {

      return res.status(400).json({

        success: false,

        message: "Email and password are required",

      });

    }
 
    // Find user

    const user = await User.findOne({

      email: email.toLowerCase(),

    });
 
    if (!user) {

      return res.status(401).json({

        success: false,

        message: "Invalid email or password",

      });

    }
 
    // Compare password

    const isPasswordValid = await bcrypt.compare(

      password,

      user.password

    );
 
    if (!isPasswordValid) {

      return res.status(401).json({

        success: false,

        message: "Invalid email or password",

      });

    }
 
    // Generate token

    const token = generateToken(user._id);
 
    return res.status(200).json({

      success: true,

      message: "Login successful",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

      },

    });

  } catch (error) {

    console.error("Login error:", error);
 
    return res.status(500).json({

      success: false,

      message: "Server error",

    });

  }

};
 
// ============================

// GET PROFILE

// ============================
 
const getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user.userId).select("-password");
 
    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }
 
    return res.status(200).json({

      success: true,

      user,

    });

  } catch (error) {

    console.error("Profile error:", error);
 
    return res.status(500).json({

      success: false,

      message: "Server error",

    });

  }

};
 
module.exports = {

  signup,

  login,

  getProfile,

};
 
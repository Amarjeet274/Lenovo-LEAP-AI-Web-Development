import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// GENERATE JWT
const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
      _id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


// REGISTER
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      educationLevel,
      interests,
      skills,
      learningGoals,
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,

      educationLevel:
        educationLevel || "",

      interests: Array.isArray(interests)
        ? interests
        : [],

      skills: Array.isArray(skills)
        ? skills
        : [],

      learningGoals:
        Array.isArray(learningGoals)
          ? learningGoals
          : [],
    });

    // Generate token
    const token = generateToken(
      newUser._id.toString()
    );

    // Response
    return res.status(201).json({
      success: true,
      message: "Registration successful.",

      token,

      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        educationLevel:
          newUser.educationLevel,
        interests: newUser.interests,
        skills: newUser.skills,
        learningGoals:
          newUser.learningGoals,
      },
    });
  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during registration.",
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // Password has select:false in User model,
    // so explicitly include it here.
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const token = generateToken(
      user._id.toString()
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        educationLevel:
          user.educationLevel,
        interests: user.interests,
        skills: user.skills,
        learningGoals:
          user.learningGoals,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during login.",
    });
  }
};

// CURRENT USER
export const getCurrentUser = async (
  req,
  res
) => {
  try {
    const currentUser =
      await User.findById(
        req.user.userId
      ).select("-password");

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};
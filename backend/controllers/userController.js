import User from "../models/User.js";

// ==========================================
// GET MY PROFILE
// ==========================================

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load profile.",
    });
  }
};

// ==========================================
// UPDATE MY PROFILE
// ==========================================

export const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      educationLevel,
      interests,
      skills,
      learningGoals,
      avatar,
    } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (name !== undefined) {
      if (name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Name must contain at least 2 characters.",
        });
      }

      user.name = name.trim();
    }

    if (educationLevel !== undefined) {
      user.educationLevel = educationLevel;
    }

    if (interests !== undefined) {
      user.interests = Array.isArray(interests)
        ? interests
        : [];
    }

    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills
        : [];
    }

    if (learningGoals !== undefined) {
      user.learningGoals = Array.isArray(learningGoals)
        ? learningGoals
        : [];
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    const updatedUser = await User.findById(
      user._id
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};
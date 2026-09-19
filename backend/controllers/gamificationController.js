import Notification from "../models/Notification.js";

import {
  getGamificationData,
} from "../services/gamificationService.js";

export const getGamification = async (
  req,
  res
) => {
  try {
    const data =
      await getGamificationData(
        req.user._id
      );

    return res.status(200).json(data);
  } catch (error) {
    console.error(
      "Gamification Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load gamification data",
    });
  }
};

export const markNotificationRead = async (
  req,
  res
) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        {
          read: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        message:
          "Notification not found",
      });
    }

    return res.status(200).json({
      notification,
    });
  } catch (error) {
    console.error(
      "Notification Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update notification",
    });
  }
};

export const markAllNotificationsRead =
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          user: req.user._id,
          read: false,
        },
        {
          read: true,
        }
      );

      return res.status(200).json({
        message:
          "Notifications marked as read",
      });
    } catch (error) {
      console.error(
        "Notification Error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update notifications",
      });
    }
  };
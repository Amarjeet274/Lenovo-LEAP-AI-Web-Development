import Roadmap from "../models/Roadmap.js";
import User from "../models/User.js";
import { recordActivity } from "../services/activityService.js";

import {
  generateLearningRoadmap,
} from "../services/aiService.js";

// GENERATE ROADMAP
export const createRoadmap = async (
  req,
  res
) => {
  try {
    const {
      goal,
      currentLevel,
      currentSkills,
    } = req.body;

    if (!goal || goal.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid learning goal.",
      });
    }

    const validLevels = [
      "beginner",
      "intermediate",
      "advanced",
    ];

    const level = validLevels.includes(
      currentLevel
    )
      ? currentLevel
      : "beginner";

    const skills = Array.isArray(
      currentSkills
    )
      ? currentSkills
        .map((skill) =>
          String(skill).trim()
        )
        .filter(Boolean)
      : [];

    const user = await User.findById(
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const roadmapData =
      await generateLearningRoadmap({
        goal: goal.trim(),
        currentLevel: level,
        currentSkills: skills,
      });

    if (
      !roadmapData ||
      !Array.isArray(roadmapData.phases)
    ) {
      return res.status(500).json({
        success: false,
        message:
          "AI generated an invalid roadmap.",
      });
    }

    const roadmap = await Roadmap.create({
      user: user._id,
      goal: goal.trim(),
      currentLevel: level,
      currentSkills: skills,
      phases: roadmapData.phases,
      totalEstimatedWeeks:
        Number(
          roadmapData.totalEstimatedWeeks
        ) || 0,
      aiGenerated: true,
    });

    await recordActivity({
      userId: req.user._id,
      type: "roadmap_generated",
      title: "Learning roadmap generated",
      description:
        "You generated a personalized AI learning roadmap.",
      metadata: {
        roadmapId: roadmap._id,
      },
    });

    return res.status(201).json({
      success: true,
      message:
        "Learning roadmap generated successfully.",
      roadmap,
    });
  } catch (error) {
    console.error(
      "Create roadmap error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate roadmap.",
    });
  }
};

// GET ALL MY ROADMAPS
export const getMyRoadmaps = async (
  req,
  res
) => {
  try {
    const roadmaps =
      await Roadmap.find({
        user: req.user.userId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      roadmaps,
    });
  } catch (error) {
    console.error(
      "Get roadmaps error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load roadmaps.",
    });
  }
};

// GET LATEST ROADMAP
export const getLatestRoadmap = async (
  req,
  res
) => {
  try {
    const roadmap =
      await Roadmap.findOne({
        user: req.user.userId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    console.error(
      "Get latest roadmap error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load latest roadmap.",
    });
  }
};

// UPDATE TOPIC COMPLETION
export const updateTopicCompletion = async (
  req,
  res
) => {
  try {
    const {
      roadmapId,
      phaseId,
      topicId,
    } = req.params;

    const { completed } = req.body;

    if (
      typeof completed !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Completed must be a boolean.",
      });
    }

    const roadmap =
      await Roadmap.findOne({
        _id: roadmapId,
        user: req.user.userId,
      });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found.",
      });
    }

    const phase =
      roadmap.phases.id(phaseId);

    if (!phase) {
      return res.status(404).json({
        success: false,
        message: "Phase not found.",
      });
    }

    const topic =
      phase.topics.id(topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    const wasCompleted = topic.completed;

    topic.completed = completed;

    await roadmap.save();

    if (
      completed &&
      !wasCompleted
    ) {
      await recordActivity({
        userId: req.user._id,
        type: "roadmap_topic_completed",
        title: `Completed: ${topic.title}`,
        description:
          "You completed a roadmap learning topic.",
        metadata: {
          roadmapId: roadmap._id,
          phaseId: phase._id,
          topicId: topic._id,
        },
      });
    }

    await roadmap.save();

    if (
      completed &&
      !wasCompleted
    ) {
      await recordActivity({
        userId: req.user._id,
        type: "roadmap_topic_completed",
        title: `Completed: ${topic.title}`,
        description:
          "You completed a roadmap learning topic.",
        metadata: {
          roadmapId: roadmap._id,
          phaseId: phase._id,
          topicId: topic._id,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Topic progress updated.",
      roadmap,
    });
  } catch (error) {
    console.error(
      "Update topic error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update topic progress.",
    });
  }
};
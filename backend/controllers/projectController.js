import User from "../models/User.js";
import ProjectRecommendation from "../models/ProjectRecommendation.js";
import { generateProjectRecommendations } from "../services/projectService.js";
import { recordActivity } from "../services/activityService.js";

export const generateProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const skills = user.skills || [];
    const interests = user.interests || [];
    const learningGoals = user.learningGoals || [];
    const educationLevel = user.educationLevel || "";

    const projects = await generateProjectRecommendations({
      skills,
      interests,
      learningGoals,
      educationLevel,
    });

    const recommendation = await ProjectRecommendation.create({
      user: user._id,

      profileSnapshot: {
        skills,
        interests,
        learningGoals,
        educationLevel,
      },

      projects,

      aiGenerated: true,
    });

    await recordActivity({
      userId: user._id,
      type: "projects_generated",
      title: "Project recommendations generated",
      description:
        "AI generated personalized portfolio projects.",
      metadata: {
        recommendationId:
          recommendation._id,
      },
    });

    return res.status(201).json({
      message: "Project recommendations generated successfully",
      recommendation,
    });
  } catch (error) {
    console.error("Project Recommendation Error:", error);

    return res.status(500).json({
      message: "Failed to generate project recommendations",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

//Get latest recommendations
export const getLatestProjects = async (req, res) => {
  try {
    const recommendation =
      await ProjectRecommendation.findOne({
        user: req.user._id,
      }).sort({ createdAt: -1 });

    return res.status(200).json({
      recommendation,
    });
  } catch (error) {
    console.error("Get Projects Error:", error);

    return res.status(500).json({
      message: "Failed to fetch project recommendations",
    });
  }
};

//Get recommendation history
export const getProjectHistory = async (req, res) => {
  try {
    const recommendations =
      await ProjectRecommendation.find({
        user: req.user._id,
      })
        .sort({ createdAt: -1 })
        .select(
          "profileSnapshot projects createdAt updatedAt aiGenerated"
        );

    return res.status(200).json({
      recommendations,
    });
  } catch (error) {
    console.error("Project History Error:", error);

    return res.status(500).json({
      message: "Failed to fetch project history",
    });
  }
};

//project progress update
export const updateProjectStatus = async (req, res) => {
  try {
    const {
      recommendationId,
      projectId,
    } = req.params;

    const { started, completed } = req.body;

    const recommendation =
      await ProjectRecommendation.findOne({
        _id: recommendationId,
        user: req.user._id,
      });

    if (!recommendation) {
      return res.status(404).json({
        message: "Recommendation not found",
      });
    }

    const project = recommendation.projects.id(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (typeof started === "boolean") {
      project.started = started;
    }

    if (typeof completed === "boolean") {
      project.completed = completed;

      if (completed) {
        project.started = true;
      }
    }

    const wasStarted = project.started;
    const wasCompleted = project.completed;

    await recommendation.save();

    if (
      project.started &&
      !wasStarted
    ) {
      await recordActivity({
        userId: req.user._id,
        type: "project_started",
        title: `Started: ${project.title}`,
        description:
          "You started a recommended project.",
        metadata: {
          recommendationId:
            recommendation._id,
          projectId: project._id,
        },
      });
    }

    if (
      project.completed &&
      !wasCompleted
    ) {
      await recordActivity({
        userId: req.user._id,
        type: "project_completed",
        title: `Completed: ${project.title}`,
        description:
          "You completed a recommended project.",
        metadata: {
          recommendationId:
            recommendation._id,
          projectId: project._id,
        },
      });
    }

    return res.status(200).json({
      message: "Project status updated",
      project,
    });
  } catch (error) {
    console.error("Project Status Error:", error);

    return res.status(500).json({
      message: "Failed to update project status",
    });
  }
};
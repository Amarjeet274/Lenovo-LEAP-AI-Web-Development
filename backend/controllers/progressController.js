import Roadmap from "../models/Roadmap.js";
import ProjectRecommendation from "../models/ProjectRecommendation.js";

export const getMyProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get latest roadmap
    const roadmap = await Roadmap.findOne({
      user: userId,
    }).sort({ createdAt: -1 });

    // Get latest project recommendations
    const projectRecommendation =
      await ProjectRecommendation.findOne({
        user: userId,
      }).sort({ createdAt: -1 });

    // -----------------------------------------
    // ROADMAP PROGRESS
    // -----------------------------------------

    let roadmapStats = {
      totalPhases: 0,
      completedPhases: 0,
      totalTopics: 0,
      completedTopics: 0,
      percentage: 0,
      phases: [],
    };

    if (roadmap) {
      const phases = roadmap.phases || [];

      let totalTopics = 0;
      let completedTopics = 0;

      const phaseProgress = phases.map((phase) => {
        const topics = phase.topics || [];

        const phaseTotal = topics.length;

        const phaseCompleted = topics.filter(
          (topic) => topic.completed
        ).length;

        totalTopics += phaseTotal;
        completedTopics += phaseCompleted;

        const percentage =
          phaseTotal > 0
            ? Math.round(
                (phaseCompleted / phaseTotal) * 100
              )
            : 0;

        return {
          phaseId: phase._id,
          phaseNumber: phase.phaseNumber,
          title: phase.title,
          totalTopics: phaseTotal,
          completedTopics: phaseCompleted,
          percentage,
        };
      });

      const completedPhases = phaseProgress.filter(
        (phase) =>
          phase.totalTopics > 0 &&
          phase.completedTopics === phase.totalTopics
      ).length;

      roadmapStats = {
        totalPhases: phases.length,
        completedPhases,
        totalTopics,
        completedTopics,
        percentage:
          totalTopics > 0
            ? Math.round(
                (completedTopics / totalTopics) * 100
              )
            : 0,
        phases: phaseProgress,
      };
    }

    // -----------------------------------------
    // PROJECT PROGRESS
    // -----------------------------------------

    let projectStats = {
      totalProjects: 0,
      startedProjects: 0,
      completedProjects: 0,
      percentage: 0,
    };

    if (projectRecommendation) {
      const projects =
        projectRecommendation.projects || [];

      const startedProjects = projects.filter(
        (project) => project.started
      ).length;

      const completedProjects = projects.filter(
        (project) => project.completed
      ).length;

      projectStats = {
        totalProjects: projects.length,
        startedProjects,
        completedProjects,
        percentage:
          projects.length > 0
            ? Math.round(
                (completedProjects /
                  projects.length) *
                  100
              )
            : 0,
      };
    }

    // -----------------------------------------
    // OVERALL PROGRESS
    // -----------------------------------------

    const progressParts = [];

    if (roadmap) {
      progressParts.push(roadmapStats.percentage);
    }

    if (projectRecommendation) {
      progressParts.push(projectStats.percentage);
    }

    const overallPercentage =
      progressParts.length > 0
        ? Math.round(
            progressParts.reduce(
              (sum, value) => sum + value,
              0
            ) / progressParts.length
          )
        : 0;

    // -----------------------------------------
    // RECENT ACTIVITY
    // -----------------------------------------

    const activities = [];

    if (roadmap) {
      activities.push({
        type: "roadmap",
        title: "Learning roadmap generated",
        date: roadmap.createdAt,
      });

      if (roadmap.updatedAt !== roadmap.createdAt) {
        activities.push({
          type: "roadmap",
          title: "Learning roadmap updated",
          date: roadmap.updatedAt,
        });
      }
    }

    if (projectRecommendation) {
      activities.push({
        type: "project",
        title: "Project recommendations generated",
        date: projectRecommendation.createdAt,
      });

      if (
        projectRecommendation.updatedAt !==
        projectRecommendation.createdAt
      ) {
        activities.push({
          type: "project",
          title: "Project progress updated",
          date: projectRecommendation.updatedAt,
        });
      }
    }

    activities.sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    return res.status(200).json({
      overallPercentage,

      roadmap: roadmapStats,

      projects: projectStats,

      activities: activities.slice(0, 10),

      hasRoadmap: Boolean(roadmap),

      hasProjects: Boolean(
        projectRecommendation
      ),
    });
  } catch (error) {
    console.error(
      "Progress Controller Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch progress",
    });
  }
};
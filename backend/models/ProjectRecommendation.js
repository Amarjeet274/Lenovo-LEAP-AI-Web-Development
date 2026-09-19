import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "documentation",
        "tutorial",
        "video",
        "github",
        "article",
        "other",
      ],
      default: "other",
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    estimatedWeeks: {
      type: Number,
      default: 2,
    },

    skills: {
      type: [String],
      default: [],
    },

    technologies: {
      type: [String],
      default: [],
    },

    learningOutcomes: {
      type: [String],
      default: [],
    },

    features: {
      type: [String],
      default: [],
    },

    resources: {
      type: [resourceSchema],
      default: [],
    },

    reason: {
      type: String,
      default: "",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    started: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const projectRecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    profileSnapshot: {
      skills: [String],
      interests: [String],
      learningGoals: [String],
      educationLevel: String,
    },

    projects: {
      type: [projectSchema],
      default: [],
    },

    aiGenerated: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectRecommendation = mongoose.model(
  "ProjectRecommendation",
  projectRecommendationSchema
);

export default ProjectRecommendation;
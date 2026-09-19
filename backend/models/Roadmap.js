import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    estimatedHours: {
      type: Number,
      default: 1,
      min: 1,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    resources: {
      type: [
        {
          title: {
            type: String,
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
              "video",
              "article",
              "course",
              "practice",
              "other",
            ],
            default: "other",
          },
        },
      ],
      default: [],
    },
  },
  {
    _id: true,
  }
);

const phaseSchema = new mongoose.Schema(
  {
    phaseNumber: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    estimatedWeeks: {
      type: Number,
      default: 1,
      min: 1,
    },

    topics: {
      type: [topicSchema],
      default: [],
    },
  },
  {
    _id: true,
  }
);

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    goal: {
      type: String,
      required: true,
      trim: true,
    },

    currentLevel: {
      type: String,
      enum: [
        "beginner",
        "intermediate",
        "advanced",
      ],
      default: "beginner",
    },

    currentSkills: {
      type: [String],
      default: [],
    },

    phases: {
      type: [phaseSchema],
      default: [],
    },

    totalEstimatedWeeks: {
      type: Number,
      default: 0,
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

const Roadmap = mongoose.model(
  "Roadmap",
  roadmapSchema
);

export default Roadmap;
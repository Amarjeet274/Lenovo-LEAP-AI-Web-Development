import mongoose from "mongoose";

const learningActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "roadmap_topic_completed",
        "project_started",
        "project_completed",
        "doubt_asked",
        "roadmap_generated",
        "projects_generated",
        "profile_updated",
      ],
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
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const LearningActivity = mongoose.model(
  "LearningActivity",
  learningActivitySchema
);

export default LearningActivity;
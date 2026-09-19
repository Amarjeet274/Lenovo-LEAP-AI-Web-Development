import LearningActivity from "../models/LearningActivity.js";

export const recordActivity = async ({
  userId,
  type,
  title,
  description = "",
  metadata = {},
}) => {
  try {
    return await LearningActivity.create({
      user: userId,
      type,
      title,
      description,
      metadata,
    });
  } catch (error) {
    console.error(
      "Activity recording error:",
      error
    );

    return null;
  }
};
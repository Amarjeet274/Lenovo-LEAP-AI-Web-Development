import LearningActivity from "../models/LearningActivity.js";
import Achievement from "../models/Achievement.js";
import Notification from "../models/Notification.js";

const achievementDefinitions = [
  {
    code: "FIRST_ROADMAP",
    title: "Roadmap Explorer",
    description:
      "Generated your first personalized learning roadmap.",
    icon: "🗺️",
  },

  {
    code: "FIRST_DOUBT",
    title: "Curious Learner",
    description:
      "Asked your first question to SkillPath AI.",
    icon: "🤔",
  },

  {
    code: "FIRST_PROJECT",
    title: "Project Builder",
    description:
      "Started your first recommended project.",
    icon: "🚀",
  },

  {
    code: "FIRST_COMPLETION",
    title: "Milestone Achiever",
    description:
      "Completed your first learning milestone.",
    icon: "🎯",
  },

  {
    code: "THREE_TOPICS",
    title: "Learning Momentum",
    description:
      "Completed three roadmap topics.",
    icon: "📚",
  },

  {
    code: "THREE_PROJECTS",
    title: "Portfolio Builder",
    description:
      "Completed three recommended projects.",
    icon: "💼",
  },

  {
    code: "SEVEN_DAY_STREAK",
    title: "7 Day Learner",
    description:
      "Maintained a seven-day learning streak.",
    icon: "🔥",
  },
];

const getDistinctActivityDates = (activities) => {
  const dates = new Set();

  activities.forEach((activity) => {
    const date = new Date(activity.createdAt);

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;

    dates.add(key);
  });

  return [...dates].sort().reverse();
};

const calculateStreak = (activities) => {
  if (!activities.length) {
    return {
      current: 0,
      longest: 0,
      activeToday: false,
    };
  }

  const dates = getDistinctActivityDates(
    activities
  );

  const dateObjects = dates.map(
    (date) => new Date(`${date}T00:00:00`)
  );

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  const todayKey = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

  const yesterdayKey = `${yesterday.getFullYear()}-${String(
    yesterday.getMonth() + 1
  ).padStart(2, "0")}-${String(
    yesterday.getDate()
  ).padStart(2, "0")}`;

  const activeToday =
    dates.includes(todayKey);

  if (
    !dates.includes(todayKey) &&
    !dates.includes(yesterdayKey)
  ) {
    return {
      current: 0,
      longest: calculateLongestStreak(
        dateObjects
      ),
      activeToday: false,
    };
  }

  let current = 0;

  const startingDate = activeToday
    ? today
    : yesterday;

  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(
      startingDate
    );

    expected.setDate(
      startingDate.getDate() - i
    );

    expected.setHours(0, 0, 0, 0);

    const expectedKey = `${expected.getFullYear()}-${String(
      expected.getMonth() + 1
    ).padStart(2, "0")}-${String(
      expected.getDate()
    ).padStart(2, "0")}`;

    if (dates.includes(expectedKey)) {
      current++;
    } else {
      break;
    }
  }

  return {
    current,
    longest: calculateLongestStreak(
      dateObjects
    ),
    activeToday,
  };
};

const calculateLongestStreak = (
  dateObjects
) => {
  if (!dateObjects.length) {
    return 0;
  }

  const sorted = [...dateObjects].sort(
    (a, b) => a - b
  );

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const difference =
      (sorted[i] - sorted[i - 1]) /
      (1000 * 60 * 60 * 24);

    if (difference === 1) {
      current++;
      longest = Math.max(
        longest,
        current
      );
    } else if (difference > 1) {
      current = 1;
    }
  }

  return longest;
};

export const getStreak = async (userId) => {
  const activities =
    await LearningActivity.find({
      user: userId,
    })
      .select("createdAt")
      .sort({ createdAt: -1 });

  return calculateStreak(activities);
};

export const checkAchievements = async (
  userId
) => {
  const activities =
    await LearningActivity.find({
      user: userId,
    }).sort({ createdAt: 1 });

  const activityCounts = {};

  activities.forEach((activity) => {
    activityCounts[activity.type] =
      (activityCounts[activity.type] || 0) + 1;
  });

  const completedTopics =
    activityCounts.roadmap_topic_completed || 0;

  const startedProjects =
    activityCounts.project_started || 0;

  const completedProjects =
    activityCounts.project_completed || 0;

  const streak = calculateStreak(
    activities
  );

  const eligible = [];

  if (
    activityCounts.roadmap_generated >= 1
  ) {
    eligible.push("FIRST_ROADMAP");
  }

  if (
    activityCounts.doubt_asked >= 1
  ) {
    eligible.push("FIRST_DOUBT");
  }

  if (startedProjects >= 1) {
    eligible.push("FIRST_PROJECT");
  }

  if (completedTopics >= 1) {
    eligible.push("FIRST_COMPLETION");
  }

  if (completedTopics >= 3) {
    eligible.push("THREE_TOPICS");
  }

  if (completedProjects >= 3) {
    eligible.push("THREE_PROJECTS");
  }

  if (streak.current >= 7) {
    eligible.push("SEVEN_DAY_STREAK");
  }

  const existing =
    await Achievement.find({
      user: userId,
    });

  const existingCodes = new Set(
    existing.map(
      (achievement) => achievement.code
    )
  );

  const newAchievements = [];

  for (const code of eligible) {
    if (existingCodes.has(code)) {
      continue;
    }

    const definition =
      achievementDefinitions.find(
        (item) => item.code === code
      );

    if (!definition) {
      continue;
    }

    const achievement =
      await Achievement.create({
        user: userId,
        ...definition,
      });

    newAchievements.push(achievement);

    await Notification.create({
      user: userId,
      title: `Achievement Unlocked: ${definition.title}`,
      message: definition.description,
      type: "achievement",
      metadata: {
        achievementCode: code,
      },
    });
  }

  return newAchievements;
};

export const getGamificationData = async (
  userId
) => {
  await checkAchievements(userId);

  const [
    streak,
    achievements,
    notifications,
  ] = await Promise.all([
    getStreak(userId),

    Achievement.find({
      user: userId,
    }).sort({ earnedAt: -1 }),

    Notification.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(20),
  ]);

  return {
    streak,
    achievements,
    notifications,
  };
};
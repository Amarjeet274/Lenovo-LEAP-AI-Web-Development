import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AchievementsPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/gamification"
      );

      setData(response.data);
    } catch (error) {
      console.error(
        "Failed to load achievements:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const markNotificationRead = async (
    id
  ) => {
    try {
      await api.patch(
        `/gamification/notifications/${id}/read`
      );

      setData((previous) => ({
        ...previous,

        notifications:
          previous.notifications.map(
            (notification) =>
              notification._id === id
                ? {
                    ...notification,
                    read: true,
                  }
                : notification
          ),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch(
        "/gamification/notifications/read-all"
      );

      setData((previous) => ({
        ...previous,

        notifications:
          previous.notifications.map(
            (notification) => ({
              ...notification,
              read: true,
            })
          ),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-indigo-500" />

          <p className="text-slate-400">
            Loading achievements...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const unreadCount =
    data.notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-6">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="mb-3 text-sm text-slate-400 hover:text-white"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold">
            Achievements & Activity
          </h1>

          <p className="mt-2 text-slate-400">
            Build consistent learning habits and
            celebrate your milestones.
          </p>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">

        {/* Streak */}
        <section className="mb-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">

            <p className="text-sm text-orange-300">
              Current Streak
            </p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-bold">
                {data.streak.current}
              </span>

              <span className="mb-2 text-slate-400">
                days
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {data.streak.activeToday
                ? "🔥 You learned today."
                : "Complete a learning activity today to continue your streak."}
            </p>

          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">

            <p className="text-sm text-indigo-300">
              Longest Streak
            </p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-bold">
                {data.streak.longest}
              </span>

              <span className="mb-2 text-slate-400">
                days
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Your best learning streak so far.
            </p>

          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

            <p className="text-sm text-emerald-300">
              Achievements
            </p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-bold">
                {data.achievements.length}
              </span>

              <span className="mb-2 text-slate-400">
                unlocked
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Keep learning to unlock more.
            </p>

          </div>

        </section>

        {/* Achievements */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold">
                Your Achievements
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Milestones earned through real learning
                activity.
              </p>
            </div>

          </div>

          {data.achievements.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-white/10 p-10 text-center">
              <div className="text-4xl">
                🏆
              </div>

              <p className="mt-3 text-slate-400">
                No achievements yet.
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Start learning to unlock your first
                achievement.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {data.achievements.map(
                (achievement) => (
                  <div
                    key={achievement._id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >

                    <div className="text-4xl">
                      {achievement.icon}
                    </div>

                    <h3 className="mt-4 font-bold">
                      {achievement.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {achievement.description}
                    </p>

                    <p className="mt-4 text-xs text-slate-600">
                      Earned{" "}
                      {new Date(
                        achievement.earnedAt
                      ).toLocaleDateString()}
                    </p>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <h2 className="text-xl font-bold">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {unreadCount} unread notification
                {unreadCount === 1
                  ? ""
                  : "s"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/[0.05]"
              >
                Mark all as read
              </button>
            )}

          </div>

          <div className="mt-6 space-y-3">

            {data.notifications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                <p className="text-slate-500">
                  No notifications yet.
                </p>
              </div>
            ) : (
              data.notifications.map(
                (notification) => (
                  <div
                    key={notification._id}
                    className={`flex items-start gap-4 rounded-xl border p-4 ${
                      notification.read
                        ? "border-white/5 bg-white/[0.02]"
                        : "border-indigo-500/20 bg-indigo-500/5"
                    }`}
                  >

                    <div className="mt-1 text-xl">
                      {notification.type ===
                      "achievement"
                        ? "🏆"
                        : notification.type ===
                          "milestone"
                        ? "🎯"
                        : "🔔"}
                    </div>

                    <div className="flex-1">

                      <div className="flex flex-col justify-between gap-2 sm:flex-row">

                        <h3 className="font-semibold">
                          {notification.title}
                        </h3>

                        <span className="text-xs text-slate-600">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </span>

                      </div>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {notification.message}
                      </p>

                      {!notification.read && (
                        <button
                          onClick={() =>
                            markNotificationRead(
                              notification._id
                            )
                          }
                          className="mt-3 text-xs font-medium text-indigo-400 hover:text-indigo-300"
                        >
                          Mark as read
                        </button>
                      )}

                    </div>

                  </div>
                )
              )
            )}

          </div>

        </section>

      </main>
    </div>
  );
};

export default AchievementsPage;
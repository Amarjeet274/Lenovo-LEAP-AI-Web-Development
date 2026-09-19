import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardCard from "../components/dashboard/DashboardCard";
import api from "../services/api";

function DashboardPage() {
  const navigate = useNavigate();

  const { user, logout, } = useAuth();

  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await api.get("/progress");

        setProgress(response.data);
      } catch (error) {
        console.error(
          "Failed to load dashboard progress:",
          error
        );
      }
    };

    loadProgress();
  }, []);

  const [gamification, setGamification] =
    useState(null);

  useEffect(() => {
    const loadGamification = async () => {
      try {
        const response = await api.get(
          "/gamification"
        );

        setGamification(response.data);
      } catch (error) {
        console.error(
          "Failed to load gamification:",
          error
        );
      }
    };

    loadGamification();
  }, []);

  const firstName =
    user?.name?.split(" ")[0] ||
    "Learner";

  const overallProgress =
    progress?.overallProgress ??
    progress?.percentage ??
    progress?.progress ??
    0;


  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm text-gray-500">
              SkillPath AI
            </p>

            <h1 className="text-2xl font-bold">
              Student Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                navigate("/profile")
              }
              className="rounded-xl border px-4 py-2 text-sm font-semibold"
            >
              Profile
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/*  MAIN*/}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}

        <section className="rounded-3xl bg-black p-8 text-white shadow-lg">
          <p className="text-sm text-gray-300">
            Welcome back
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Hi, {firstName} 👋
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-gray-300">
            SkillPath AI helps you build a
            personalized learning journey based on
            your skills, interests and goals.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/profile")
            }
            className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-black"
          >
            Complete My Profile
          </button>
        </section>

        {/* PROFILE SUMMARY*/}
        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-gray-500">
              Education
            </p>

            <h3 className="mt-2 text-xl font-bold capitalize">
              {user?.educationLevel ||
                "Not specified"}
            </h3>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-gray-500">
              Skills
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {user?.skills?.length || 0}
            </h3>

            <p className="text-sm text-gray-500">
              skills added
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-gray-500">
              Learning Goals
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {user?.learningGoals?.length || 0}
            </h3>

            <p className="text-sm text-gray-500">
              goals added
            </p>
          </div>


          {/* new add */}

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-orange-300">
                  Learning Streak
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {gamification?.streak?.current ?? 0}
                  <span className="ml-1 text-sm text-slate-500">
                    days
                  </span>
                </p>
              </div>

              <div className="text-3xl">
                🔥
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-500">
              {gamification?.streak?.activeToday
                ? "Learning activity recorded today."
                : "Complete a learning activity today."}
            </p>

          </div>
        </section>

        {/* QUICK FEATURES*/}
        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Your Learning Tools
            </h2>

            <p className="mt-1 text-gray-500">
              Personalized tools to support your
              learning journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              icon="🧭"
              title="AI Learning Roadmap"
              description="Generate a structured learning path based on your goals and current skills."
              onClick={() =>
                navigate("/roadmap")
              }
            />

            <DashboardCard
              icon="🤖"
              title="AI Doubt Assistant"
              description="Ask learning questions and receive AI-powered explanations."
              onClick={() => navigate("/doubt-assistant")}
            />

            <DashboardCard
              icon="💡"
              title="Project Recommendations"
              description="Discover practical projects that match your skills and learning level."
              onClick={() =>
                navigate("/projects")
              }
            />

            <DashboardCard
              icon="📊"
              title="Progress Tracker"
              description="Track your learning progress and completed learning activities."
              onClick={() =>
                navigate("/progress")
              }
            />

            <DashboardCard
              icon="👤"
              title="My Profile"
              description="Update your skills, interests, education and learning goals."
              onClick={() =>
                navigate("/profile")
              }
            />

            <DashboardCard
              icon="🏆"
              title="Achievements & Streak"
              description="Track your learning streaks and unlock achievements."
              onClick={() => navigate("/achievements")}
            />
          </div>
        </section>

        {/* CURRENT STATUS*/}
        <section className="mt-10 rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold">
            Learning Progress
          </h2>

          <p className="mt-2 text-gray-500">
            Track your learning progress and completed
            learning activities.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-black"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
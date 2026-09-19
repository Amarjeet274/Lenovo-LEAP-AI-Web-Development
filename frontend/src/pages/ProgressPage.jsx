import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ProgressPage = () => {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProgress = async () => {
    try {
      setLoading(true);

      const response = await api.get("/progress");

      setProgress(response.data);
    } catch (error) {
      console.error(
        "Failed to load progress:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    api
      .get("/progress")
      .then((response) => {
        if (!cancelled) {
          setProgress(response.data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Failed to load progress:", error);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-indigo-500" />

          <p className="text-slate-400">
            Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Unable to load progress
          </h1>

          <button
            onClick={loadProgress}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-6">

          <button
            onClick={() => navigate("/dashboard")}
            className="mb-3 text-sm text-slate-400 hover:text-white"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>
              <h1 className="text-3xl font-bold">
                Your Learning Progress
              </h1>

              <p className="mt-2 text-slate-400">
                Track your roadmap and project
                completion in one place.
              </p>
            </div>

            <button
              onClick={loadProgress}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium hover:bg-white/[0.06]"
            >
              ↻ Refresh
            </button>

          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">

        {/* Overall Progress */}
        <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-6 md:p-8">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  Learning Progress
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Roadmap + project progress
                </p>
              </div>

              <span className="text-2xl font-bold text-indigo-400">
                {progress?.overallPercentage ?? 0}%
              </span>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                style={{
                  width: `${progress?.overallPercentage ?? 0}%`,
                }}
              />
            </div>

            <div className="mt-4 flex justify-between text-xs text-slate-500">
              <span>
                {progress?.roadmap?.completedTopics ?? 0} roadmap topics
              </span>

              <span>
                {progress?.projects?.completedProjects ?? 0} projects
              </span>
            </div>

            <button
              onClick={() => navigate("/progress")}
              className="mt-5 w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/[0.05]"
            >
              View Full Progress
            </button>

          </div>
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-500">
              Roadmap Topics
            </p>

            <p className="mt-2 text-3xl font-bold">
              {progress.roadmap.completedTopics}
              <span className="text-lg text-slate-500">
                {" "}
                / {progress.roadmap.totalTopics}
              </span>
            </p>

            <p className="mt-1 text-xs text-slate-500">
              completed
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-500">
              Roadmap Phases
            </p>

            <p className="mt-2 text-3xl font-bold">
              {progress.roadmap.completedPhases}
              <span className="text-lg text-slate-500">
                {" "}
                / {progress.roadmap.totalPhases}
              </span>
            </p>

            <p className="mt-1 text-xs text-slate-500">
              completed
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-500">
              Projects Started
            </p>

            <p className="mt-2 text-3xl font-bold">
              {progress.projects.startedProjects}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              in progress
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-500">
              Projects Completed
            </p>

            <p className="mt-2 text-3xl font-bold">
              {progress.projects.completedProjects}
              <span className="text-lg text-slate-500">
                {" "}
                / {progress.projects.totalProjects}
              </span>
            </p>

            <p className="mt-1 text-xs text-slate-500">
              completed
            </p>
          </div>

        </section>

        {/* Main Grid */}
        <section className="grid gap-6 lg:grid-cols-3">

          {/* Roadmap */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Roadmap Progress
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track your progress through each
                  learning phase.
                </p>
              </div>

              <span className="rounded-lg bg-indigo-500/10 px-3 py-2 text-sm font-semibold text-indigo-400">
                {progress.roadmap.percentage}%
              </span>
            </div>

            <div className="mt-7 space-y-6">

              {progress.roadmap.phases.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                  <p className="text-slate-400">
                    No roadmap available yet.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/roadmap")
                    }
                    className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500"
                  >
                    Create Roadmap
                  </button>
                </div>
              ) : (
                progress.roadmap.phases.map(
                  (phase) => (
                    <div key={phase.phaseId}>

                      <div className="mb-2 flex items-center justify-between gap-4">

                        <div>
                          <p className="font-semibold">
                            Phase{" "}
                            {phase.phaseNumber}:{" "}
                            {phase.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {phase.completedTopics}{" "}
                            of{" "}
                            {phase.totalTopics}{" "}
                            topics completed
                          </p>
                        </div>

                        <span className="text-sm font-semibold text-slate-300">
                          {phase.percentage}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                          style={{
                            width: `${phase.percentage}%`,
                          }}
                        />
                      </div>

                    </div>
                  )
                )
              )}

            </div>
          </div>

          {/* Project Progress */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <h2 className="text-xl font-bold">
              Project Progress
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your portfolio-building journey.
            </p>

            <div className="mt-7 flex justify-center">

              <div className="relative h-40 w-40">

                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      rgb(16 185 129)
                      ${progress.projects.percentage * 3.6}deg,
                      rgba(255,255,255,0.08)
                      0deg
                    )`,
                  }}
                />

                <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-slate-950">

                  <span className="text-3xl font-bold">
                    {progress.projects.percentage}%
                  </span>

                  <span className="text-xs text-slate-500">
                    completed
                  </span>

                </div>
              </div>

            </div>

            <div className="mt-7 space-y-3">

              <div className="flex justify-between rounded-xl bg-white/[0.03] p-3">
                <span className="text-sm text-slate-400">
                  Total Projects
                </span>

                <span className="font-semibold">
                  {progress.projects.totalProjects}
                </span>
              </div>

              <div className="flex justify-between rounded-xl bg-white/[0.03] p-3">
                <span className="text-sm text-slate-400">
                  Started
                </span>

                <span className="font-semibold text-yellow-400">
                  {progress.projects.startedProjects}
                </span>
              </div>

              <div className="flex justify-between rounded-xl bg-white/[0.03] p-3">
                <span className="text-sm text-slate-400">
                  Completed
                </span>

                <span className="font-semibold text-emerald-400">
                  {progress.projects.completedProjects}
                </span>
              </div>

            </div>

            <button
              onClick={() =>
                navigate("/projects")
              }
              className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold hover:bg-white/[0.06]"
            >
              View Projects
            </button>

          </div>
        </section>

        {/* Recent Activity */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <h2 className="text-xl font-bold">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recent changes to your learning journey.
          </p>

          <div className="mt-6">

            {progress.activities.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                <p className="text-slate-500">
                  No activity yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                {progress.activities.map(
                  (activity, index) => (
                    <div
                      key={`${activity.type}-${activity.date}-${index}`}
                      className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10">
                        {activity.type ===
                          "roadmap"
                          ? "📚"
                          : "🚀"}
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {activity.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(
                            activity.date
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                )}

              </div>
            )}

          </div>
        </section>

      </main>
    </div>
  );
};

export default ProgressPage;
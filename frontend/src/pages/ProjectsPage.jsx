import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const difficultyStyles = {
  beginner:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",

  intermediate:
    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

  advanced:
    "bg-red-500/10 text-red-400 border-red-500/20",
};

const ProjectsPage = () => {
  const navigate = useNavigate();

  const [recommendation, setRecommendation] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await api.get(
          "/projects/latest"
        );

        setRecommendation(
          response.data.recommendation
        );
      } catch (error) {
        console.error(
          "Failed to load projects:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const generateProjects = async () => {
    try {
      setGenerating(true);

      const response = await api.post(
        "/projects/generate"
      );

      setRecommendation(
        response.data.recommendation
      );
    } catch (error) {
      console.error(
        "Project generation error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to generate projects"
      );
    } finally {
      setGenerating(false);
    }
  };

  const updateStatus = async (
    projectId,
    status
  ) => {
    if (!recommendation) return;

    try {
      const response = await api.patch(
        `/projects/${recommendation._id}/projects/${projectId}`,
        status
      );

      const updatedProject =
        response.data.project;

      setRecommendation((previous) => {
        if (!previous) return previous;

        return {
          ...previous,

          projects: previous.projects.map(
            (project) =>
              project._id === updatedProject._id
                ? updatedProject
                : project
          ),
        };
      });
    } catch (error) {
      console.error(
        "Project status update error:",
        error
      );
    }
  };

  const getProgress = () => {
    if (!recommendation?.projects?.length) {
      return 0;
    }

    const completed =
      recommendation.projects.filter(
        (project) => project.completed
      ).length;

    return Math.round(
      (completed /
        recommendation.projects.length) *
        100
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">

          <div>
            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="mb-2 text-sm text-slate-400 hover:text-white"
            >
              ← Back to Dashboard
            </button>

            <h1 className="text-2xl font-bold md:text-3xl">
              AI Project Recommendations
            </h1>

            <p className="mt-2 text-slate-400">
              Build projects that match your
              learning journey.
            </p>
          </div>

          <button
            onClick={generateProjects}
            disabled={generating}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating
              ? "Generating..."
              : "Generate Projects"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-indigo-500" />

              <p className="text-slate-400">
                Loading your projects...
              </p>
            </div>
          </div>
        ) : !recommendation ? (
          /* Empty state */
          <div className="flex min-h-[60vh] items-center justify-center">

            <div className="max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">

              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-4xl">
                🚀
              </div>

              <h2 className="text-3xl font-bold">
                Discover Your Next Project
              </h2>

              <p className="mt-4 text-slate-400">
                SkillPath AI will analyze your
                skills, interests and learning goals
                to recommend practical projects
                for your portfolio.
              </p>

              <button
                onClick={generateProjects}
                disabled={generating}
                className="mt-8 rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50"
              >
                {generating
                  ? "Generating..."
                  : "Generate My Projects"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress */}
            <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                <div>
                  <h2 className="text-xl font-bold">
                    Your Project Journey
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Complete projects to strengthen
                    your portfolio.
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-2xl font-bold">
                    {getProgress()}%
                  </p>

                  <p className="text-xs text-slate-500">
                    completed
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{
                    width: `${getProgress()}%`,
                  }}
                />
              </div>
            </section>

            {/* Projects */}
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {recommendation.projects.map(
                (project) => (
                  <article
                    key={project._id}
                    className={`flex flex-col rounded-2xl border p-6 transition ${
                      project.completed
                        ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                        : "border-white/10 bg-white/[0.03] hover:border-indigo-500/30"
                    }`}
                  >

                    <div className="flex items-start justify-between gap-3">

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          difficultyStyles[
                            project.difficulty
                          ] || ""
                        }`}
                      >
                        {project.difficulty}
                      </span>

                      <span className="text-xs text-slate-500">
                        {project.estimatedWeeks}{" "}
                        weeks
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {project.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {project.description}
                    </p>

                    {/* Why */}
                    <div className="mt-5 rounded-xl bg-indigo-500/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                        Why this project?
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {project.reason}
                      </p>
                    </div>

                    {/* Technologies */}
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Technologies
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.map(
                          (technology) => (
                            <span
                              key={technology}
                              className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                            >
                              {technology}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Features
                      </p>

                      <ul className="space-y-1 text-sm text-slate-400">
                        {project.features
                          ?.slice(0, 4)
                          .map((feature) => (
                            <li key={feature}>
                              ✓ {feature}
                            </li>
                          ))}
                      </ul>
                    </div>

                    {/* Learning outcomes */}
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        What you'll learn
                      </p>

                      <ul className="space-y-1 text-sm text-slate-400">
                        {project.learningOutcomes
                          ?.slice(0, 3)
                          .map((outcome) => (
                            <li key={outcome}>
                              • {outcome}
                            </li>
                          ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-6">

                      {!project.started &&
                        !project.completed && (
                          <button
                            onClick={() =>
                              updateStatus(
                                project._id,
                                {
                                  started: true,
                                }
                              )
                            }
                            className="w-full rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/20"
                          >
                            Start Project
                          </button>
                        )}

                      {project.started &&
                        !project.completed && (
                          <button
                            onClick={() =>
                              updateStatus(
                                project._id,
                                {
                                  completed: true,
                                }
                              )
                            }
                            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold hover:bg-emerald-500"
                          >
                            Mark as Completed
                          </button>
                        )}

                      {project.completed && (
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-sm font-semibold text-emerald-400">
                          ✓ Project Completed
                        </div>
                      )}
                    </div>

                  </article>
                )
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default ProjectsPage;
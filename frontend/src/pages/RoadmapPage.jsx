import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function RoadmapPage() {
    const navigate = useNavigate();

    useAuth();

    const [goal, setGoal] =
        useState("");

    const [currentLevel, setCurrentLevel] =
        useState("beginner");

    const [skills, setSkills] =
        useState("");

    const [roadmap, setRoadmap] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [loadingRoadmap, setLoadingRoadmap] =
        useState(true);

    const [error, setError] =
        useState("");

    // ==========================================
    // LOAD LATEST ROADMAP
    // ==========================================

    useEffect(() => {
        const loadRoadmap = async () => {
            try {
                const response =
                    await api.get(
                        "/roadmaps/latest"
                    );

                setRoadmap(
                    response.data.roadmap
                );

                if (
                    response.data.roadmap
                ) {
                    setGoal(
                        response.data.roadmap.goal
                    );

                    setCurrentLevel(
                        response.data.roadmap
                            .currentLevel
                    );

                    setSkills(
                        response.data.roadmap
                            .currentSkills
                            .join(", ")
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load roadmap:",
                    error
                );
            } finally {
                setLoadingRoadmap(false);
            }
        };

        loadRoadmap();
    }, []);

    // ==========================================
    // GENERATE ROADMAP
    // ==========================================

    const handleGenerate = async (
        event
    ) => {
        event.preventDefault();

        setError("");

        if (!goal.trim()) {
            setError(
                "Please enter your learning goal."
            );

            return;
        }

        setLoading(true);

        try {
            const currentSkills = skills
                .split(",")
                .map((skill) =>
                    skill.trim()
                )
                .filter(Boolean);

            const response =
                await api.post(
                    "/roadmaps/generate",
                    {
                        goal,
                        currentLevel,
                        currentSkills,
                    }
                );

            setRoadmap(
                response.data.roadmap
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data
                    ?.message ||
                "Failed to generate roadmap."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // MARK TOPIC COMPLETE
    // ==========================================

    const handleTopicToggle =
        async (
            phase,
            topic
        ) => {
            if (!roadmap) return;

            const newCompleted =
                !topic.completed;

            try {
                await api.patch(
                    `/roadmaps/${roadmap._id}/phases/${phase._id}/topics/${topic._id}`,
                    {
                        completed:
                            newCompleted,
                    }
                );

                setRoadmap((previous) => {
                    if (!previous) return previous;

                    return {
                        ...previous,

                        phases:
                            previous.phases.map(
                                (currentPhase) => {
                                    if (
                                        currentPhase._id !==
                                        phase._id
                                    ) {
                                        return currentPhase;
                                    }

                                    return {
                                        ...currentPhase,

                                        topics:
                                            currentPhase.topics.map(
                                                (currentTopic) => {
                                                    if (
                                                        currentTopic._id !==
                                                        topic._id
                                                    ) {
                                                        return currentTopic;
                                                    }

                                                    return {
                                                        ...currentTopic,
                                                        completed:
                                                            newCompleted,
                                                    };
                                                }
                                            ),
                                    };
                                }
                            ),
                    };
                });
            } catch (error) {
                console.error(
                    "Failed to update topic:",
                    error
                );
            }
        };

    // ==========================================
    // CALCULATE PROGRESS
    // ==========================================

    const getProgress = () => {
        if (!roadmap?.phases) {
            return 0;
        }

        const topics =
            roadmap.phases.flatMap(
                (phase) =>
                    phase.topics
            );

        if (!topics.length) {
            return 0;
        }

        const completed =
            topics.filter(
                (topic) =>
                    topic.completed
            ).length;

        return Math.round(
            (completed /
                topics.length) *
            100
        );
    };

    const progress =
        getProgress();

    if (loadingRoadmap) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>
                    Loading your roadmap...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-6xl">

                {/* ==================================
            HEADER
        ================================== */}

                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="mb-4 text-sm font-semibold"
                    >
                        ← Back to Dashboard
                    </button>

                    <h1 className="text-4xl font-bold">
                        AI Learning Roadmap
                    </h1>

                    <p className="mt-2 max-w-2xl text-gray-500">
                        Generate a personalized learning
                        path based on your current skills
                        and career goals.
                    </p>
                </div>

                {/* ==================================
            GENERATOR
        ================================== */}

                <section className="rounded-3xl border bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-bold">
                        Create Your Roadmap
                    </h2>

                    <form
                        onSubmit={handleGenerate}
                        className="mt-6 grid gap-6"
                    >
                        <div>
                            <label className="mb-2 block font-semibold">
                                What do you want to learn?
                            </label>

                            <input
                                value={goal}
                                onChange={(event) =>
                                    setGoal(
                                        event.target.value
                                    )
                                }
                                placeholder="Example: Become a Full Stack Developer"
                                className="w-full rounded-xl border px-4 py-3"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold">
                                Current Level
                            </label>

                            <select
                                value={currentLevel}
                                onChange={(event) =>
                                    setCurrentLevel(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-xl border px-4 py-3"
                            >
                                <option value="beginner">
                                    Beginner
                                </option>

                                <option value="intermediate">
                                    Intermediate
                                </option>

                                <option value="advanced">
                                    Advanced
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold">
                                Current Skills
                            </label>

                            <input
                                value={skills}
                                onChange={(event) =>
                                    setSkills(
                                        event.target.value
                                    )
                                }
                                placeholder="HTML, CSS, JavaScript, React"
                                className="w-full rounded-xl border px-4 py-3"
                            />

                            <p className="mt-1 text-xs text-gray-500">
                                Separate skills with commas.
                            </p>
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-100 px-4 py-3 text-red-700">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-black px-6 py-3 font-semibold text-white disabled:opacity-50"
                        >
                            {loading
                                ? "Generating with AI..."
                                : "Generate AI Roadmap"}
                        </button>
                    </form>
                </section>

                {/* ==================================
            ROADMAP
        ================================== */}

                {roadmap && (
                    <section className="mt-10">

                        {/* Summary */}

                        <div className="rounded-3xl bg-black p-8 text-white">
                            <p className="text-sm text-gray-300">
                                Personalized Roadmap
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {roadmap.goal}
                            </h2>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Level
                                    </p>

                                    <p className="mt-1 font-semibold capitalize">
                                        {roadmap.currentLevel}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-400">
                                        Duration
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {
                                            roadmap.totalEstimatedWeeks
                                        }{" "}
                                        weeks
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-400">
                                        Progress
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {progress}%
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="mb-2 flex justify-between text-sm">
                                    <span>
                                        Learning Progress
                                    </span>

                                    <span>
                                        {progress}%
                                    </span>
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-white/20">
                                    <div
                                        className="h-full rounded-full bg-white transition-all"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phases */}

                        <div className="mt-8 space-y-6">
                            {roadmap.phases.map(
                                (phase) => (
                                    <div
                                        key={phase._id}
                                        className="rounded-3xl border bg-white p-6 shadow-sm"
                                    >
                                        <div className="flex flex-col justify-between gap-4 sm:flex-row">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-500">
                                                    Phase{" "}
                                                    {
                                                        phase.phaseNumber
                                                    }
                                                </p>

                                                <h3 className="mt-1 text-2xl font-bold">
                                                    {phase.title}
                                                </h3>

                                                <p className="mt-2 text-gray-500">
                                                    {
                                                        phase.description
                                                    }
                                                </p>
                                            </div>

                                            <div className="whitespace-nowrap rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold">
                                                {
                                                    phase.estimatedWeeks
                                                }{" "}
                                                weeks
                                            </div>
                                        </div>

                                        {/* Topics */}

                                        <div className="mt-6 space-y-3">
                                            {phase.topics.map(
                                                (topic) => (
                                                    <div
                                                        key={
                                                            topic._id
                                                        }
                                                        className={`rounded-2xl border p-4 transition ${topic.completed
                                                                ? "bg-gray-50 opacity-70"
                                                                : "bg-white"
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleTopicToggle(
                                                                        phase,
                                                                        topic
                                                                    )
                                                                }
                                                                className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border ${topic.completed
                                                                        ? "bg-black text-white"
                                                                        : "bg-white"
                                                                    }`}
                                                            >
                                                                {topic.completed
                                                                    ? "✓"
                                                                    : ""}
                                                            </button>

                                                            <div className="flex-1">
                                                                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                                                                    <h4
                                                                        className={`font-bold ${topic.completed
                                                                                ? "line-through"
                                                                                : ""
                                                                            }`}
                                                                    >
                                                                        {
                                                                            topic.title
                                                                        }
                                                                    </h4>

                                                                    <span className="text-xs text-gray-500">
                                                                        {
                                                                            topic.estimatedHours
                                                                        }{" "}
                                                                        hours
                                                                    </span>
                                                                </div>

                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    {
                                                                        topic.description
                                                                    }
                                                                </p>

                                                                {topic
                                                                    .resources
                                                                    ?.length >
                                                                    0 && (
                                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                                            {topic.resources.map(
                                                                                (
                                                                                    resource,
                                                                                    index
                                                                                ) => (
                                                                                    <a
                                                                                        key={`${resource.title}-${index}`}
                                                                                        href={
                                                                                            resource.url
                                                                                        }
                                                                                        target="_blank"
                                                                                        rel="noreferrer"
                                                                                        className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-gray-50"
                                                                                    >
                                                                                        {
                                                                                            resource.title
                                                                                        }
                                                                                    </a>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </section>
                )}

                {/* ==================================
            EMPTY STATE
        ================================== */}

                {!roadmap && (
                    <section className="mt-10 rounded-3xl border bg-white p-10 text-center">
                        <div className="text-5xl">
                            🧭
                        </div>

                        <h2 className="mt-4 text-2xl font-bold">
                            Build Your Learning Journey
                        </h2>

                        <p className="mx-auto mt-2 max-w-xl text-gray-500">
                            Enter your goal and current skills
                            above. SkillPath AI will create a
                            personalized roadmap for you.
                        </p>
                    </section>
                )}
            </div>
        </div>
    );
}

export default RoadmapPage;
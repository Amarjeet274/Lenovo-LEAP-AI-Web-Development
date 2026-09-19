import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const navigate = useNavigate();

  const {
    user,
    updateUser,
  } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    educationLevel: user?.educationLevel || "",
    skills: user?.skills?.join(", ") || "",
    interests: user?.interests?.join(", ") || "",
    learningGoals: user?.learningGoals?.join(", ") || "",
  });

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  };

  const convertToArray = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.put(
        "/users/me",
        {
          name: form.name,
          educationLevel:
            form.educationLevel,

          skills: convertToArray(
            form.skills
          ),

          interests: convertToArray(
            form.interests
          ),

          learningGoals:
            convertToArray(
              form.learningGoals
            ),
        }
      );

      updateUser(response.data.user);

      setMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() =>
            navigate("/dashboard")
          }
          className="mb-6 text-sm font-semibold"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Keep your learning information updated
            so SkillPath AI can personalize your
            learning experience.
          </p>

          {message && (
            <div className="mt-6 rounded-lg bg-green-100 px-4 py-3 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-lg bg-red-100 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >
            <div>
              <label className="mb-2 block font-semibold">
                Full Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Email
              </label>

              <input
                value={user?.email || ""}
                disabled
                className="w-full cursor-not-allowed rounded-xl border bg-gray-100 px-4 py-3 text-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Education Level
              </label>

              <select
                name="educationLevel"
                value={
                  form.educationLevel
                }
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="">
                  Select education level
                </option>

                <option value="school">
                  School Student
                </option>

                <option value="college">
                  College Student
                </option>

                <option value="graduate">
                  Graduate
                </option>

                <option value="self-learner">
                  Self Learner
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Skills
              </label>

              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
                placeholder="JavaScript, React, HTML, CSS"
              />

              <p className="mt-1 text-xs text-gray-500">
                Separate multiple skills with commas.
              </p>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Interests
              </label>

              <input
                name="interests"
                value={form.interests}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
                placeholder="Web Development, AI, Data Science"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Learning Goals
              </label>

              <input
                name="learningGoals"
                value={form.learningGoals}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
                placeholder="Become a Full Stack Developer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-black px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
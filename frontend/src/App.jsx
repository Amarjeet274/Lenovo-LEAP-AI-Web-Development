import {
  Routes,
  Route,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import AchievementsPage from "./pages/AchievementsPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import RoadmapPage from "./pages/RoadmapPage";
import DoubtAssistantPage from "./pages/DoubtAssistantPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProgressPage from "./pages/ProgressPage";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES*/}
      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/about"
        element={<AboutPage />}
      />

      <Route
        path="/contact"
        element={<ContactPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* PROTECTED ROUTES*/}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />
        <Route
          path="/roadmap"
          element={<RoadmapPage />}
        />
        <Route
          path="/doubt-assistant"
          element={<DoubtAssistantPage />}
        />
        <Route
          path="/projects"
          element={<ProjectsPage />}
        />

        <Route
          path="/progress"
          element={<ProgressPage />}
        />
        <Route
          path="/achievements"
          element={<AchievementsPage />}
        />
      </Route>


      {/* Steps 3-6 */}
      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}

export default App;
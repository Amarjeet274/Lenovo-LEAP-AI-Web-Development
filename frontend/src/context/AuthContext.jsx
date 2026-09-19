/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOGIN
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem(
      "skillpath_token",
      token
    );

    setUser(user);

    return response.data;
  };

  // REGISTER
  const register = async (userData) => {
    const response = await api.post(
      "/auth/register",
      userData
    );

    const { token, user } = response.data;

    localStorage.setItem(
      "skillpath_token",
      token
    );

    setUser(user);

    return response.data;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem(
      "skillpath_token"
    );

    setUser(null);
  };

  // LOAD CURRENT USER
  const loadCurrentUser = async () => {
    const token = localStorage.getItem(
      "skillpath_token"
    );

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(
        "/auth/me"
      );

      setUser(response.data.user);
    } catch (error) {
      console.error(
        "Session restore failed:",
        error
      );

      localStorage.removeItem(
        "skillpath_token"
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE USER IN CONTEXT
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadCurrentUser();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
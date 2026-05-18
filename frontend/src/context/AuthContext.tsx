import type { ReactNode } from "react";
import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

type User = {
  email: string;
};

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

const parseJwtPayload = (token: string) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const isTokenValid = (token: string | null) => {
  if (!token) return false;
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  return Date.now() < payload.exp * 1000;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState<string | null>(() => {
    const stored = sessionStorage.getItem("gigflow_token");
    if (!stored || !isTokenValid(stored)) {
      sessionStorage.removeItem("gigflow_token");
      sessionStorage.removeItem("gigflow_user");
      return null;
    }
    return stored;
  });

  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem("gigflow_user");
    return stored ? JSON.parse(stored) : null;
  });

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("gigflow_token");
    sessionStorage.removeItem("gigflow_user");
    navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    // Allow public pages (/ and /register) without token
    const isPublicPage = location.pathname === "/" || location.pathname === "/register";

    if (token && !isTokenValid(token)) {
      logout();
      return;
    }

    if (!token && !isPublicPage) {
      navigate("/", { replace: true });
    }
    if (token && location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    }
  }, [token, location.pathname, navigate, logout]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const newToken = response.data?.data?.token ?? response.data?.token;
      const responseUser = response.data?.data?.user ?? response.data?.user;

      if (!newToken) {
        throw new Error(response.data?.message || "Authentication failed");
      }

      const newUser = responseUser ? { email: responseUser.email } : { email };
      setToken(newToken);
      setUser(newUser);
      sessionStorage.setItem("gigflow_token", newToken);
      sessionStorage.setItem("gigflow_user", JSON.stringify(newUser));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err instanceof Error ? err : new Error("Authentication failed");
    }
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, logout }),
    [user, token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

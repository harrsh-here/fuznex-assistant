import React, { useState, useEffect } from "react";
import api from "./api/api";
import AppShell from "./components/AppShell";
import HomeScreen from "./features/Home/HomeScreen";
import PlansScreen from "./features/Plans/PlansScreen";
import FitnessScreen from "./features/Fitness/FitnessScreen";
import HistoryScreen from "./features/History/HistoryScreen";
import ChatScreen from "./features/Home/ChatScreen";
import NotificationsScreen from "./features/Notifications/NotificationsScreen";
import ProfileScreen from "./features/Profile/ProfileScreen";
import EditProfileScreen from "./features/Profile/EditProfileScreen";
import LoginSignupScreen from "./features/Auth/LoginSignupScreen";
import AuthSuccess from "./features/Auth/AuthSuccess";

export default function App() {
  const [activePath, setActivePath] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authTransition, setAuthTransition] = useState(false);
  const [refreshIntervalId, setRefreshIntervalId] = useState(null);

  // 🔁 Central login checker (called on load + network restore)
  const checkLogin = async () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token && !refreshToken) {
      setIsAuthenticated(false);
      setUser(null);
      setCheckingAuth(false);
      return;
    }

    try {
      const { data } = await api.get("/users/profile");
      setUser(data);
      setIsAuthenticated(true);
    } catch (err) {
      // Try to refresh if profile failed
      if (refreshToken) {
        try {
          const { data } = await api.post("/users/refresh", { refreshToken });
          localStorage.setItem("token", data.accessToken);
          const { data: newProfile } = await api.get("/users/profile");
          setUser(newProfile);
          setIsAuthenticated(true);
        } catch (refreshErr) {
          console.error("🔁 Refresh failed:", refreshErr);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setCheckingAuth(false);
    }
  };

  // 🔃 On mount: check tokens + login
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    checkLogin();
  }, []);

  // 🌐 Handle user returning after internet loss
  useEffect(() => {
    const handleOnline = () => {
      console.log("[Network] Online again. Retrying login...");
      checkLogin();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  // ⏳ Token auto-refresh every 55 minutes
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Missing refresh token");

        const { data } = await api.post("/users/refresh", { refreshToken });
        localStorage.setItem("token", data.accessToken);
        console.log("[Auto Refresh] Token updated");
      } catch (err) {
        console.error("[Auto Refresh Failed]", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
        setUser(null);
      }
    }, 55 * 60 * 1000);

    setRefreshIntervalId(interval);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // 🔀 OAuth cleanup
  useEffect(() => {
    if (isAuthenticated && window.location.pathname === "/auth/success") {
      window.history.replaceState({}, document.title, "/");
      setActivePath("home");
    }
  }, [isAuthenticated]);

  const navigateTo = (path) => setActivePath(path);

  const handleLogin = (userData) => {
    setAuthTransition(true);
    setTimeout(() => {
      setUser(userData);
      setIsAuthenticated(true);
      setAuthTransition(false);
    }, 600);
  };

  const handleRegister = handleLogin;

  const handleLogout = () => {
    setAuthTransition(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      clearInterval(refreshIntervalId);
      setIsAuthenticated(false);
      setUser(null);
      setActivePath("home");
      setAuthTransition(false);
    }, 600);
  };

  const renderScreen = () => {
    switch (activePath) {
      case "plans":
        return <PlansScreen />;
      case "chat":
        return <ChatScreen />;
      case "home":
        return <HomeScreen onNavigate={navigateTo} user={user} />;
      case "fitness":
        return <FitnessScreen />;
      case "history":
        return <HistoryScreen />;
      case "profile":
        return (
          <ProfileScreen
            user={user}
            onLogout={handleLogout}
            onEditProfile={() => navigateTo("edit-profile")}
          />
        );
      case "edit-profile":
        return <EditProfileScreen user={user} onBack={() => navigateTo("profile")} />;
      case "notifications":
        return <NotificationsScreen onNavigate={navigateTo} />;
      default:
        return <HomeScreen onNavigate={navigateTo} />;
    }
  };

  if (checkingAuth || authTransition) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
      <div className="w-[375px] h-[812px] border-[14px] border-black rounded-[50px] shadow-2xl overflow-hidden relative bg-black">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10" />
        {window.location.pathname === "/auth/success" && !isAuthenticated ? (
          <AuthSuccess onAuth={handleLogin} />
        ) : !isAuthenticated ? (
          <LoginSignupScreen onLogin={handleLogin} onRegister={handleRegister} />
        ) : (
          <AppShell activePath={activePath} onNavigate={navigateTo} onLogout={handleLogout}>
            {renderScreen()}
          </AppShell>
        )}
      </div>
    </div>
  );
}

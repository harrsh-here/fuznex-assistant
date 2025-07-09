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
import ErrorBoundary from "./features/Fitness/ErrorBoundary";


export default function App() {
  const [activePath, setActivePath] = useState("home");
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
const [lastScreen, setLastScreen] = useState(null);


  const isAuthenticated = !!user;

  const applyAccessToken = (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    }
  };


  
  const checkLogin = async () => {
    const accessToken = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken && !refreshToken) return logoutImmediately();

    try {
      applyAccessToken(accessToken);
      const { data } = await api.get("/users/profile");
      setUser(data);
    } catch {
      if (!refreshToken) return logoutImmediately();

      try {
        const { data } = await api.post("/users/refresh", { refreshToken });
        applyAccessToken(data.accessToken);
        const { data: userData } = await api.get("/users/profile");
        setUser(userData);
      } catch (err) {
        console.error("[Refresh Error]", err);
        logoutImmediately();
      }
    } finally {
      setCheckingAuth(false);
    }
  };

  const logoutImmediately = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setCheckingAuth(false);
  };

  // 📌 First-load + URL token extractor
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      applyAccessToken(accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      window.history.replaceState({}, document.title, "/");
    }

    checkLogin();
  }, []);

  // 🔁 Refresh token every 45 minutes
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Missing refresh token");

        const { data } = await api.post("/users/refresh", { refreshToken });
        applyAccessToken(data.accessToken);
        console.log("[Token Auto-Refreshed]");
      } catch (err) {
        console.error("[Auto Refresh Error]:", err);
        logoutImmediately();
      }
    }, 45 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // 🌐 Retry login on internet reconnect
  useEffect(() => {
    const retry = () => {
      if (!isAuthenticated) {
        console.log("[Reconnect] Retrying auth...");
        checkLogin();
      }
    };
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, [isAuthenticated]);

  const handleLogin = (userData, tokens) => {
    if (tokens?.token) applyAccessToken(tokens.token);
    if (tokens?.refreshToken) localStorage.setItem("refreshToken", tokens.refreshToken);
    setUser(userData);
  };

  const handleLogout = () => {
    logoutImmediately();
    setActivePath("home");
  };

  const navigateTo = (path, extras = {}) => {
  setLastScreen(activePath);
  setActivePath(path);
};
  const renderScreen = () => {
    switch (activePath) {
      case "plans": return <ErrorBoundary><PlansScreen /></ErrorBoundary>;
      case "chat": return <ErrorBoundary><ChatScreen /></ErrorBoundary>;
      case "home": return<ErrorBoundary><HomeScreen onNavigate={navigateTo} user={user} /></ErrorBoundary>;
      case "fitness": return<ErrorBoundary>
  <FitnessScreen />
</ErrorBoundary>;
//homescreen
      case "history": return <ErrorBoundary><HistoryScreen   navigate={navigateTo}
        from={lastScreen || "home"} /></ErrorBoundary>;


      case "profile": return <ErrorBoundary><ProfileScreen user={user} onLogout={handleLogout} onEditProfile={() => navigateTo("edit-profile")} onNavigate={navigateTo} /></ErrorBoundary>;
      case "edit-profile": return <ErrorBoundary><EditProfileScreen user={user} onBack={() => navigateTo("profile")} /></ErrorBoundary>;
      case "notifications": return<ErrorBoundary> <NotificationsScreen onNavigate={navigateTo} from={lastScreen || "home"} /></ErrorBoundary>;
      default: return <ErrorBoundary><HomeScreen onNavigate={navigateTo} /></ErrorBoundary>;
    }
  };

  if (checkingAuth) {
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
          <LoginSignupScreen onLogin={handleLogin} onRegister={handleLogin} />
        ) : (
          <AppShell activePath={activePath} onNavigate={navigateTo} onLogout={handleLogout}>
            {renderScreen()}
          </AppShell>
        )}
      </div>
    </div>
  );
}

// src/App.jsx
import React, { useState, useEffect } from "react";
import api from "./api/api";
import AppShell from "./components/AppShell";
import HomeScreen from "./features/Home/HomeScreen";
import TasksScreen from "./features/Tasks/TasksScreen";
import FitnessScreen from "./features/Fitness/FitnessScreen";
import HistoryScreen from "./features/History/HistoryScreen";
import ProfileScreen from "./features/Profile/ProfileScreen";
import LoginSignupScreen from "./features/Auth/LoginSignupScreen";
import ChatScreen from "./features/Home/ChatScreen";
import NotificationsScreen from "./features/Notifications/NotificationsScreen";
import EditProfileScreen from "./features/Profile/EditProfileScreen";

export default function App() {
  const [activePath, setActivePath] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authTransition, setAuthTransition] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCheckingAuth(false);
      return;
    }
    api.get("/users/profile")
      .then(({ data }) => {
        setUser(data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  const handleLogin = (userData) => {
    setAuthTransition(true);
    setTimeout(() => {
      setUser(userData);
      setIsAuthenticated(true);
      setAuthTransition(false);
    }, 600);
  };

  const handleRegister = (userData) => {
    setAuthTransition(true);
    setTimeout(() => {
      setUser(userData);
      setIsAuthenticated(true);
      setAuthTransition(false);
    }, 600);
  };

  const handleLogout = () => {
    setAuthTransition(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      setUser(null);
      setActivePath("home");
      setAuthTransition(false);
    }, 600);
  };

  const renderScreen = () => {
    switch (activePath) {
      case "tasks": return <TasksScreen />;
      case "chat": return <ChatScreen />;
      case "home": return <HomeScreen onNavigate={navigateTo} />;
      case "fitness": return <FitnessScreen />;
      case "history": return <HistoryScreen />;
      case "profile": return <ProfileScreen user={user} onLogout={handleLogout} onEditProfile={() => navigateTo("edit-profile")} />;
      case "edit-profile": return <EditProfileScreen user={user} onBack={() => navigateTo("profile")} />;
      case "notifications": return <NotificationsScreen onNavigate={navigateTo} />;
      default: return <HomeScreen onNavigate={navigateTo} />;
    }
  };

  const navigateTo = (path) => {
    setActivePath(path);
  };

  if (checkingAuth || authTransition) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
      <div className="w-[375px] h-[812px] border-[14px] border-black rounded-[50px] shadow-2xl overflow-hidden relative bg-black">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10" />
        {!isAuthenticated ? (
          <LoginSignupScreen onLogin={handleLogin} onRegister={handleRegister} />
        ) : (
          <AppShell activePath={activePath} onNavigate={navigateTo}>
            {renderScreen()}
          </AppShell>
        )}
      </div>
    </div>
  );
}

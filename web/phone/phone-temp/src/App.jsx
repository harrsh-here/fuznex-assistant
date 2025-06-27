import React, { useState, useEffect } from "react";
import api from "./api/api";
import AppShell from "./components/AppShell";
import HomeScreen from "./features/Home/HomeScreen";
import TasksScreen from "./features/Tasks/TasksScreen";
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      console.log("[OAuth] Tokens received, saving to localStorage");
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    api.get('/users/profile')
      .then(({ data }) => {
        console.log("[Auth] Logged in as", data.name);
        setUser(data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  const navigateTo = (path) => setActivePath(path);

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
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      setUser(null);
      setActivePath('home');
      setAuthTransition(false);
    }, 600);
  };

  const renderScreen = () => {
    switch (activePath) {
      case 'tasks': return <TasksScreen />;
      case 'chat': return <ChatScreen />;
      case 'home': return <HomeScreen onNavigate={navigateTo} />;
      case 'fitness': return <FitnessScreen />;
      case 'history': return <HistoryScreen />;
      case 'profile': return <ProfileScreen user={user} onLogout={handleLogout} onEditProfile={() => navigateTo('edit-profile')} />;
      case 'edit-profile': return <EditProfileScreen user={user} onBack={() => navigateTo('profile')} />;
      case 'notifications': return <NotificationsScreen onNavigate={navigateTo} />;
      default: return <HomeScreen onNavigate={navigateTo} />;
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
        {window.location.pathname === '/auth/success' ? (
          <AuthSuccess onAuth={(user) => {
            setUser(user);
            setIsAuthenticated(true);
          }} />
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

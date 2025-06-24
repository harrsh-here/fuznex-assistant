import React, { useState } from "react";
import AppShell from "./components/AppShell";

import HomeScreen from "./features/Home/HomeScreen";
import TasksScreen from "./features/Tasks/TasksScreen";
import FitnessScreen from "./features/Fitness/FitnessScreen";
import HistoryScreen from "./features/History/HistoryScreen";
import ProfileScreen from "./features/Profile/ProfileScreen";
import LoginSignupScreen from "./features/Auth/LoginSignupScreen";
import ChatScreen from "./features/Home/ChatScreen";
import NotificationsScreen from "./features/Notifications/NotificationsScreen";



export default function App() {
  const [activePath, setActivePath] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Toggle for testing auth

  const handleLogin = (credentials) => {
    console.log("Logging in:", credentials);
    setIsAuthenticated(true);
  };

  const handleRegister = (credentials) => {
    console.log("Registering:", credentials);
    setIsAuthenticated(true);
  };

  const renderScreen = () => {
    switch (activePath) {
      case "tasks":
        return <TasksScreen />;  
          case "chat":
      return <ChatScreen />;
        case "home":
        return <HomeScreen onNavigate={setActivePath} />
        case "fitness":
     
        return <FitnessScreen />;
      case "history":
        return <HistoryScreen />;
      case "profile":
        return <ProfileScreen />;
      case "notifications":
  return <NotificationsScreen onNavigate={setActivePath} />;
  
      default:
        return <HomeScreen onNavigate={setActivePath} />;
    }
  };

  return (
    
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
      <div className="w-[375px] h-[812px] border-[14px] border-black rounded-[50px] shadow-2xl overflow-hidden relative bg-black">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10" />

        {/* Auth or Main App */}
        {!isAuthenticated ? (
          <LoginSignupScreen onLogin={handleLogin} onRegister={handleRegister} />
        ) : (
          <AppShell activePath={activePath} onNavigate={setActivePath}>
            {renderScreen()}
          </AppShell>
          
        )}
      </div>
    </div>
  );
}

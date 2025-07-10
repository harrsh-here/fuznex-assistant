import React, { useState } from "react";
import {
  Home,
  Dumbbell,
  MessageSquare,
  User,
} from "lucide-react";
import { NotePencil, Microphone } from "phosphor-react";
import MicOverlay from "./MicOverlay";


const tabs = [
  { path: "home", icon: Home, label: "Home" },
  { path: "plans", icon: NotePencil, label: "Planner" },
  { path: "", icon: null, label: "" }, // Empty for center mic button
  { path: "chat", icon: MessageSquare, label: "Chat" },
  { path: "profile", icon: User, label: "Profile" },
];

export default function AppShell({ activePath, onNavigate, children }) {
  const [micOpen, setMicOpen] = useState(false);

  const handleMicClick = () => {
    setMicOpen(true);
  };

  const closeMic = () => {
    setMicOpen(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-[#0f0f0f] via-[#181818] to-[#0b0b0b] text-white relative overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">{children}</div>

      {/* Bottom Navbar */}
      <div className="relative">
        {/* Bottom Nav Icons */}
        <div className="grid grid-cols-5 items-center px-2 py-1.5 border-t border-[#2a2a2a] bg-[#0f0f0f] text-gray-400 z-60">
          {tabs.map((tab, index) => (
            <div key={index} className="flex flex-col items-center justify-center">
              {tab.icon && (
                <button
                  onClick={() => onNavigate(tab.path)}
                  className={`flex flex-col items-center text-[11px] transition-all duration-200 bg-transparent shadow-none ${
                    activePath === tab.path ? "text-purple-500" : "text-gray-400"
                  }`}
                >
                  <tab.icon className="w-5 h-5 mb-0.5" />
                  {tab.label}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Floating Mic Button - Glassmorphic Style */}
       {/* Floating Mic Button - Enhanced Gradient Glow */}
{/* Floating Mic Button - With Animated Listening Ring */}
<div className="absolute left-1/2 transform -translate-x-1/2 -top-6 z-[50]">
  <div className="relative flex items-center justify-center">
    {/* Animated Ring */}
    <span className="absolute w-[3.79rem] h-[3.79rem] rounded-full border-2 border-indigo-400 animate-ping-slow opacity-50"></span>

    {/* Gradient Glow Behind */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 blur-md opacity-60 animate-pulse"></div>

    {/* Mic Button */}
    <button
      onClick={handleMicClick}
      className="relative p-4 rounded-full bg-gradient-to-br from-purple-600 via-violet-700 to-blue-600 text-white shadow-lg hover:scale-105 transition-all duration-300"
    >
      <Microphone size={24} className="text-white drop-shadow-md" />
    </button>
  </div>
</div>



      </div>
{/* Mic Listening Overlay - Glassmorphic Style */}
{/* Mic Listening Overlay - Glassmorphic Style with Animation */}
{micOpen && <MicOverlay onClose={closeMic} />}



    </div>
  );
}

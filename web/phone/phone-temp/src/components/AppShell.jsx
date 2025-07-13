import React, { useState } from "react";
import {
  Home,
  Dumbbell,
  MessageSquare,
  User,
} from "lucide-react";
import { NotePencil, Microphone } from "phosphor-react";
import MicOverlay from "./MicOverlay";
// test

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
<div className="absolute top-[-27px] left-1/2 -ml-[48px] w-[96px] h-[24px]  z-60">
  <div className="relative flex items-center justify-center">
    

    {/* Gradient Blur Behind */}
    <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-700 via-indigo-500 to-pink-300 blur-md opacity-60"></div>

    {/* Mic Button (Inner Core) */}
    <button
  onClick={handleMicClick}
  className="relative z-50 mt-[-7px] w-[4.0rem] h-[4.0rem] flex items-center justify-center rounded-full text-white shadow-lg border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105 "
  style={{
    background: "linear-gradient(330deg, #4f46e5 30%, #7e22ce 70%)",
    boxShadow: "0 0 55px 0px rgba(168, 85, 247, 0.5)", // glow
  }}
>
  <Microphone size={30} className="text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.3)] "  />
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

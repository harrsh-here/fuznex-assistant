import React from "react";
import {
  Home,
  CheckSquare,
  Dumbbell,
  MessageSquare,
  History,
  User,
} from "lucide-react";
import { NotePencil } from "phosphor-react";

const tabs = [
  { path: "home", icon: Home, label: "Home" },
  { path: "chat", icon: MessageSquare, label: "Chat" },
  { path: "plans", icon: NotePencil, label: "Planner" },
  { path: "fitness", icon: Dumbbell, label: "Fitness" },
  { path: "history", icon: History, label: "History" },
  { path: "profile", icon: User, label: "Profile" },
];

export default function AppShell({ activePath, onNavigate, children }) {
  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-[#0f0f0f] via-[#181818] to-[#0b0b0b] text-white">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>

    {/* Bottom Navigation (non-floating) */}
{/* Bottom Navigation (fixed layout, icon spacing corrected) */}
<div className="grid grid-cols-6 items-center px-2 py-1.5 border-t border-[#2a2a2a] bg-transparent text-gray-400">
  {tabs.map((tab) => (
    <button
      key={tab.path}
      onClick={() => onNavigate(tab.path)}
      className={`flex flex-col items-center text-[11px] transition-all duration-200 bg-transparent ${
        activePath === tab.path ? "text-purple-500" : "text-gray-400"
      }`}
    >
      <tab.icon className="w-5 h-5 mb-0.5 bg-transparent" />
      {tab.label}
    </button>
  ))}
</div>

    </div>
  );
}

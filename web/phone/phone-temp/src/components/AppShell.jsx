import React from "react";
import {
  Home,
  CheckSquare,
  Dumbbell,
  History,
  User,
} from "lucide-react";

const tabs = [
  { path: "home", icon: Home, label: "Home" },
  { path: "tasks", icon: CheckSquare, label: "Tasks" },
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
      <div className="w-full border-t border-[#2a2a2a] bg-[#101010] px-4 py-2 flex justify-around items-center text-gray-400">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => onNavigate(tab.path)}
            className={`flex flex-col items-center text-[11px] transition-all duration-200 ${
              activePath === tab.path ? "text-purple-500" : "text-gray-400"
            }`}
          >
            <tab.icon className="w-5 h-5 mb-0.5" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

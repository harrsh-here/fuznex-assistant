// src/features/Home/components/FitnessMiniBox.jsx
import React from "react";

export default function FitnessMiniBox() {
  const todayStats = {
    steps: 5260,
    calories: 230,
    distance: 3.8, // in kilometers
  };

  return (
    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-2">
      <div className="text-sm font-semibold text-gray-300 mb-1">
        🏃‍♂️ Today's Fitness
      </div>
      <div className="text-xs text-gray-400">
        {todayStats.steps.toLocaleString()} steps • {todayStats.calories} cal • {todayStats.distance} km
      </div>
    </div>
  );
}
    
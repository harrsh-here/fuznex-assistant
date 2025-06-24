// src/features/Fitness/FitnessScreen.jsx
import React from "react";

export default function FitnessScreen() {
  const stepPercentage = 0.65; // 65% of 10,000 steps
  const circleRadius = 40;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const progressStroke = circleCircumference * (1 - stepPercentage);

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white overflow-hidden">
      <h2 className="text-2xl font-semibold mb-6">Your Fitness Summary</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Steps */}
        <div className="flex flex-col items-center justify-between bg-[#1e1e1e] rounded-2xl p-4 border border-[#2a2a2a] shadow w-40 h-40">
          <div className="relative w-24 h-24">
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={circleRadius}
                stroke="#2a2a2a"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={circleRadius}
                stroke="#a855f7"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circleCircumference}
                strokeDashoffset={progressStroke}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-gray-300">👣 Steps</p>
            </div>
          </div>
          <p className="text-sm font-bold text-white text-center">6,500 / 10,000</p>
        </div>

        {/* Calories */}
        <div className="flex flex-col items-center justify-center bg-[#1e1e1e] rounded-2xl p-4 border border-[#2a2a2a] shadow w-40 h-40">
          <p className="text-4xl">🔥</p>
          <p className="text-xs text-gray-400 mt-1">Calories Burned</p>
          <p className="text-sm font-bold text-white mt-1">320 kcal</p>
        </div>

        {/* Water */}
        <div className="flex flex-col items-center justify-center bg-[#1e1e1e] rounded-2xl p-4 border border-[#2a2a2a] shadow w-40 h-40">
          <p className="text-4xl">💧</p>
          <p className="text-xs text-gray-400 mt-1">Water Intake</p>
          <p className="text-sm font-bold text-white mt-1">1.5 L</p>
        </div>

        {/* Sleep */}
        <div className="flex flex-col items-center justify-center bg-[#1e1e1e] rounded-2xl p-4 border border-[#2a2a2a] shadow w-40 h-40">
          <p className="text-4xl">🛌</p>
          <p className="text-xs text-gray-400 mt-1">Sleep</p>
          <p className="text-sm font-bold text-white mt-1">7.2 hrs</p>
        </div>
      </div>
    </div>
  );
}

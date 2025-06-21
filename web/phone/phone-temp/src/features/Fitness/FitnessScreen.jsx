// src/features/Fitness/FitnessScreen.jsx
import React from "react";

export default function FitnessScreen() {
  return (
    <div className="flex flex-col gap-4 text-sm text-gray-800">
      {/* Header */}
      <h2 className="text-base font-semibold">Fitness Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">3,212</div>
          <div className="text-xs">Steps</div>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">245</div>
          <div className="text-xs">Calories</div>
        </div>
        <div className="bg-purple-100 text-purple-800 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">32</div>
          <div className="text-xs">Active mins</div>
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">82</div>
          <div className="text-xs">Heart Rate</div>
        </div>
      </div>

      {/* Workout Button */}
      <button className="bg-black text-white w-full py-2 rounded-xl mt-4">
        Start Workout
      </button>
    </div>
  );
}

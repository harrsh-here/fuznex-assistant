import React from "react";
import { Microphone } from "phosphor-react";

export default function MicOverlay({ onClose }) {
  return (
    <div className="absolute inset-0 bg-gray/10 backdrop-blur-xl border border-black/10 flex flex-col items-center justify-center z-50 animate-squeeze transition-all duration-300">
      <div className="relative mb-6">
        {/* Animated Listening Ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="absolute w-24 h-24 rounded-full border-2 border-indigo-400 animate-ping-slow opacity-60"></span>
        </div>

        {/* Glowing Gradient Pulse */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 blur-md opacity-100 animate-pulse"></div>

        {/* Mic Button */}
        <div className="relative p-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-pop">
          <Microphone size={36} className="text-white" />
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-2 text-indigo-200">Listening...</h2>
      <p className="text-sm text-pink-200">{"(Speech input will appear here...)"}</p>

      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-red-600 hover:text-white p-2 rounded-full transition"
        title="Close Mic"
      >
        ×
      </button>
    </div>
  );
}

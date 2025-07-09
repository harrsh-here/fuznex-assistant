// MicOverlay.jsx
import React, { useState } from "react";
import { Mic, Keyboard, X } from "lucide-react";
import TypingInputBox from "./TypingInputBox";

export default function MicOverlay({ onClose }) {
  const [textMode, setTextMode] = useState(false);

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-xl border border-white/10 flex flex-col z-50 px-4 pt-6 pb-3 text-white transition-all duration-300 overflow-hidden">
      {!textMode && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white text-xl bg-white/10 border border-white/20 hover:bg-red-600 hover:text-white p-2 rounded-full transition"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {!textMode ? (
        <div className="flex flex-col items-center justify-center space-y-6 flex-grow px-4">
          <div className="relative">
            <span className="absolute w-24 h-24 rounded-full border-2 border-purple-400 animate-ping-slow opacity-60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
            <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 opacity-100 animate-pulse top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

            <div className="relative p-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-pop z-10">
              <Mic size={36} className="text-white animate-pulse-glow" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-indigo-200">Listening...</h2>
          <p className="text-sm text-pink-200">(Speech input will appear here...)</p>

          <button
            onClick={() => setTextMode(true)}
            className="flex items-center text-sm text-white/80 hover:text-purple-300 transition"
          >
            <Keyboard className="w-4 h-4 mr-2" />
            Prefer typing instead?
          </button>
        </div>
      ) : (
        <TypingInputBox onClose={onClose} onBack={() => setTextMode(false)} />
      )}
    </div>
  );
}

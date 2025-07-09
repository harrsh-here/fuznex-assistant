import React, { useState } from "react";
import { Mic, Keyboard, X } from "lucide-react";
import TypingInputBox from "./TypingInputBox";
import MicSpeechCapture from "./MicSpeechCapture";

export default function MicOverlay({ onClose }) {
  const [textMode, setTextMode] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState(null);
  const [hasSent, setHasSent] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSpeechComplete = (text) => {
    if (!text.trim()) return;

    setTranscript(text);
    setTimeout(() => {
      setHasSent(true);
      setResponse({
        user: text,
        ai: "This is F.R.I.D.A.Y.'s response to your voice query.",
      });
    }, 1000);
  };

  const handleReset = () => {
    setTranscript("");
    setHasSent(false);
    setResponse(null);
    setIsListening(false); // ✅ Stop mic cleanly
  };

  const handleClose = () => {
    setIsListening(false); // ✅ Stop mic first
    onClose(); // ✅ Then close the overlay
  };

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-xl border border-white/10 flex flex-col z-50 px-4 pt-6 pb-3 text-white transition-all duration-300 overflow-hidden">
      {!textMode && !hasSent && (
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-white text-xl bg-white/10 border border-white/20 hover:bg-red-600 hover:text-white p-2 rounded-full transition"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {!textMode && !hasSent && (
        <div className="flex flex-col items-center justify-center space-y-6 flex-grow px-4">
          <div
            className="relative cursor-pointer"
            onClick={() => setIsListening((prev) => !prev)}
          >
            <span
              className={`absolute w-24 h-24 rounded-full border-2 ${
                isListening
                  ? "border-purple-400 animate-ping-slow opacity-60"
                  : "border-white/10 opacity-20"
              } top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
            ></span>
            <div
              className={`absolute w-24 h-24 rounded-full ${
                isListening
                  ? "bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 animate-pulse"
                  : "bg-white/10"
              } top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
            ></div>

            <div className="relative p-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-pop z-10">
              <Mic
                size={36}
                className={`text-white ${
                  isListening ? "animate-pulse-glow" : ""
                }`}
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-indigo-200">
            {isListening ? "Listening..." : "Tap mic to speak"}
          </h2>

          <MicSpeechCapture
            isListening={isListening}
            onStop={handleSpeechComplete}
            showTranscript
          />

          <button
            onClick={() => setTextMode(true)}
            className="flex items-center text-sm text-white/80 hover:text-purple-300 transition"
          >
            <Keyboard className="w-4 h-4 mr-2" />
            Prefer typing instead?
          </button>
        </div>
      )}

      {textMode && (
        <TypingInputBox
          onClose={handleClose}
          onBack={() => {
            setTextMode(false);
            handleReset();
          }}
        />
      )}

      {hasSent && response && (
        <div className="mt-auto space-y-4 pb-4 animate-fade-in-up">
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="bg-[#181818] border border-[#2c2c2c] rounded-xl p-3 max-w-[75%]">
                <p className="text-xs text-gray-500 mb-1 text-right">You</p>
                <p className="text-sm text-gray-300 whitespace-pre-wrap text-right">
                  {response.user}
                </p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-3 max-w-[85%]">
                <p className="text-xs text-purple-400 mb-1">F.R.I.D.A.Y.</p>
                <p className="text-sm text-white whitespace-pre-wrap">
                  {response.ai}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

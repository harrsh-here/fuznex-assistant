import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Send,
  Keyboard,
  X
} from "lucide-react";

export default function MicOverlay({ onClose }) {
  const [textMode, setTextMode] = useState(false);
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [micClicked, setMicClicked] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [boxMoved, setBoxMoved] = useState(false);
  const [boxAnimating, setBoxAnimating] = useState(false);
  const [startSlide, setStartSlide] = useState(false);
  const [startClear, setStartClear] = useState(false);
  const inputRef = useRef(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    setStartSlide(true);
    setBoxAnimating(true);

    setTimeout(() => setStartClear(true), 50);
    setTimeout(() => setExpanded(false), 100);

    setTimeout(() => {
      setInputText("");
      setBoxMoved(true);
      setStartSlide(false);
      setStartClear(false);
    }, 2000);

    setTimeout(() => {
      setHasSent(true);
      setBoxAnimating(false);
      setResponse({
        user: userText,
        ai: "This is F.R.I.D.A.Y.'s response to your query.",
      });
    }, 2200);
  };

  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
  const wordLimit = 500;

  useEffect(() => {
    if (expanded && inputRef.current) inputRef.current.focus();
  }, [expanded]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };
    const node = inputRef.current;
    if (node) node.addEventListener("keydown", handleKeyDown);
    return () => node?.removeEventListener("keydown", handleKeyDown);
  }, [inputText]);

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-xl border border-white/10 flex flex-col z-50 px-4 pt-6 pb-3 text-white transition-all duration-300 overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-xl bg-white/10 border border-white/20 hover:bg-red-600 hover:text-white p-2 rounded-full transition"
        title="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {!textMode && (
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

          {!expanded && (
            <button
              onClick={() => setTextMode(true)}
              className="flex items-center text-sm text-white/80 hover:text-purple-300 transition"
            >
              <Keyboard className="w-4 h-4 mr-2" />
              Prefer typing instead?
            </button>
          )}
        </div>
      )}

      {textMode && (
        <div
          className={`w-full max-w-md mx-auto flex flex-col transform transition-all duration-[2000ms] ease-in-out ${
            boxMoved ? "translate-y-0 justify-end" : "justify-center"
          } flex-grow`}
        >
          {!hasSent && (
            <div
              className={`relative glassmorphic border border-[#333] rounded-xl px-3 py-2 shadow-inner transition-transform duration-[2000ms] ease-in-out ${
                startSlide ? "translate-y-36" : "translate-y-0"
              } flex items-center gap-2 ${
                expanded && !startSlide ? "min-h-[120px]" : "h-[56px]"
              } animate-slide-down-glow`}
            >
              <button
                onClick={() => {
                  setMicClicked(true);
                  setTimeout(() => {
                    setMicClicked(false);
                    setTextMode(false);
                    setInputText("");
                    setResponse(null);
                    setExpanded(false);
                    setHasSent(false);
                    setBoxMoved(false);
                    setBoxAnimating(false);
                    setStartSlide(false);
                  }, 500);
                }}
                className={`p-2 rounded-full bg-[#2a2a2a] text-purple-400 flex-shrink-0 ${
                  micClicked ? "mic-glow" : ""
                }`}
                title="Return to mic mode"
              >
                <Mic className="w-5 h-5" />
              </button>

              <textarea
                ref={inputRef}
                rows={expanded ? 3 : 1}
                value={startClear ? "" : inputText}
                placeholder="Type your message here..."
                onChange={(e) => {
                  if (wordCount <= wordLimit) {
                    setInputText(e.target.value);
                  }
                }}
                onFocus={() => setExpanded(true)}
                className="flex-1 bg-transparent resize-none text-white text-sm placeholder-gray-400 outline-none scrollbar-hide pt-1"
              />

              <button
                onClick={handleSend}
                className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition transform hover:scale-110 shadow-md"
                disabled={!inputText.trim()}
              >
                <Send className="w-5 h-5 text-white animate-glow" />
              </button>
            </div>
          )}

          {hasSent && (
            <div className="mt-auto space-y-4 pb-2">
              {!boxAnimating && response && (
                <div className="space-y-4 animate-fade-in-up">
                  <div className="flex justify-end">
                    <div className="bg-[#181818] border border-[#2c2c2c] rounded-xl p-3 max-w-[75%]">
                      <p className="text-xs text-gray-500 mb-1 text-right">You</p>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap text-right">{response.user}</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-[#1e1e1e] border border-[#333] rounded-xl p-3 max-w-[85%]">
                      <p className="text-xs text-purple-400 mb-1">F.R.I.D.A.Y.</p>
                      <p className="text-sm text-white whitespace-pre-wrap">{response.ai}</p>
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`relative glassmorphic border border-[#333] rounded-xl px-3 py-2 shadow-inner transition-all duration-700 flex items-center gap-2 animate-fade-in-up ${
                  expanded ? "min-h-[120px]" : "h-[56px]"
                }`}
              >
                <button
                  onClick={() => {
                    setMicClicked(true);
                    setTimeout(() => {
                      setMicClicked(false);
                      setTextMode(false);
                      setInputText("");
                      setResponse(null);
                      setExpanded(false);
                      setHasSent(false);
                      setBoxMoved(false);
                      setBoxAnimating(false);
                      setStartSlide(false);
                    }, 500);
                  }}
                  className={`p-2 rounded-full bg-[#2a2a2a] text-purple-400 flex-shrink-0 ${
                    micClicked ? "mic-glow" : ""
                  }`}
                  title="Return to mic mode"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <textarea
                  ref={inputRef}
                  rows={expanded ? 3 : 1}
                  value={inputText}
                  placeholder="Type your message here..."
                  onChange={(e) => {
                    if (wordCount <= wordLimit) {
                      setInputText(e.target.value);
                    }
                  }}
                  onFocus={() => setExpanded(true)}
                  className="flex-1 bg-transparent resize-none text-white text-sm placeholder-gray-400 outline-none scrollbar-hide pt-1"
                />

                <button
                  onClick={handleSend}
                  className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition transform hover:scale-110 shadow-md"
                  disabled={!inputText.trim()}
                >
                  <Send className="w-5 h-5 text-white animate-glow" />
                </button>
              </div>
              <p className="text-xs text-gray-400 text-right mt-1">
                {wordCount}/{wordLimit} words
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
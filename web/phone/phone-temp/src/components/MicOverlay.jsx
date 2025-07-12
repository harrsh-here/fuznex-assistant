import React, { useState, useEffect, useRef } from "react";
import { Mic, Keyboard, X } from "lucide-react";
import TypingInputBox from "./TypingInputBox";
import MicSpeechCapture from "./MicSpeechCapture";

export default function MicOverlay({ onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [hasSent, setHasSent] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");

  // 👂 Live speech recognition setup
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join("");
      setLiveTranscript(transcript);
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
    };

    recognitionRef.current = recognition;
  }, []);
  // 🔁 Start/stop speech recognition based on listening state
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const handleTranscript = (text) => {
    setIsListening(false);
    const finalText = text || liveTranscript;
    setTranscript(finalText);
    setLiveTranscript("");
    if (!finalText.trim()) return;
    setHasSent(true);
    setTimeout(() => setResponse(`You said: ${finalText}`), 500);
  };

  const resetAll = () => {
    setIsListening(false);
    setTranscript("");
    setResponse("");
    setHasSent(false);
    setTextMode(false);
    setLiveTranscript("");
  };

  const close = () => {
    resetAll();
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-xl flex flex-col z-[60] px-4 pb-4 pt-[env(safe-area-inset-top)] text-white">
      {/* Close Button */}
      {!textMode && !hasSent && (
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 bg-white/10 rounded-full transition"
        >
          <X size={20} />
        </button>
      )}

      {/* Voice Mode */}
      {!textMode && !hasSent && (
        <div className="flex flex-col flex-1 items-center justify-center space-y-6">
     {/* Mic Button + Glow */}
<div
  onClick={() => setIsListening((v) => !v)}
  className="relative flex items-center justify-center w-24 h-24 cursor-pointer"
>
  {isListening && (
    <>
      <span className="absolute w-full h-full rounded-full border-2 border-purple-400 animate-ping opacity-100" />
<div className="absolute w-full h-full rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(216,180,254,0.5)_55%,_rgba(147,197,255,0.9)_70%,_rgba(251,113,133,0.9)_90%)] blur-2xl animate-pulse opacity-100" />



    </>
  )}
  <div className="relative z-10 w-16 h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-md transition-all duration-300 animate-pop">
    <Mic
      size={32}
      className={isListening ? "text-white animate-pulse-glow" : "text-white"}
    />
  </div>
</div>


          {/* Prompt + Transcript */}
          <div className="flex flex-col items-center space-y-1">
            <h2 className="text-lg font-semibold text-indigo-200 text-center">
              {isListening ? "Recording…" : "Tap mic to speak"}
            </h2>
            {liveTranscript && (
              <p className="text-sm text-white/70 text-center max-w-xs px-4 break-words">
                <span className="text-purple-400">Listening:</span> {liveTranscript}
              </p>
            )}
          </div>

          <MicSpeechCapture
            isListening={isListening}
            onTranscript={handleTranscript}
            showTranscript
          />

          <button
            onClick={() => { resetAll(); setTextMode(true); }}
            className="flex items-center text-sm text-white/80 hover:text-purple-300 transition"
          >
            <Keyboard size={16} className="mr-1" />
            Prefer typing instead?
          </button>
        </div>
      )}

      {/* Typing Mode */}
      {textMode && (
        <TypingInputBox
          onClose={close}
          onBack={resetAll}
          presetText={transcript}
        />
      )}

      {/* Response Mode */}
      {hasSent && (
        <div className="flex flex-col flex-grow justify-center items-center space-y-4 px-2">
          <div className="self-end bg-[#181818] border border-[#2c2c2c] rounded-xl p-3 max-w-[75%]">
            <p className="text-xs text-gray-500 mb-1 text-right">You</p>
            <p className="text-sm text-gray-300 text-right">{transcript}</p>
          </div>
          <div className="self-start bg-[#1e1e1e] border border-[#333] rounded-xl p-3 max-w-[85%]">
            <p className="text-xs text-purple-400 mb-1">F.R.I.D.A.Y.</p>
            <p className="text-sm text-white">{response}</p>
          </div>
        </div>
      )}
    </div>
  );
}

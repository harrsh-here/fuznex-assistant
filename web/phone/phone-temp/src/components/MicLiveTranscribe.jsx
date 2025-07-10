// components/MicLiveTranscribe.jsx
import React, { useEffect, useRef, useState } from "react";

export default function MicLiveTranscribe({ onTranscription }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition. Try Chrome.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN"; // Hindi, use "en-IN" for Hinglish or "en-US" for English
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
        onTranscription(finalTranscript.trim());
      }
    };

    recognitionRef.current = recognition;
  }, [onTranscription]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`px-4 py-2 rounded-full ${
          isListening ? "bg-red-500" : "bg-blue-500"
        } text-white font-semibold`}
      >
        {isListening ? "Stop" : "Start"} Listening
      </button>
      <div className="text-sm text-gray-700 max-w-xs text-center mt-2">
        {transcript || "Say something..."}
      </div>
    </div>
  );
}

import React, { useEffect, useState, useRef } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default function MicSpeechCapture({ isListening, onStop, showTranscript }) {
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser");
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-IN";

    recog.onresult = (event) => {
      const result = Array.from(event.results)
        .map((res) => res[0].transcript)
        .join("");
      setTranscript(result);
      console.log("Transcript updated:", result);
    };

    recog.onerror = (e) => {
      console.error("Speech error:", e.error);
      if (e.error === "aborted" || e.error === "not-allowed" || e.error === "service-not-allowed") {
        console.warn("Aborted or permission error. Stopping.");
        recog.stop();
      }
    };

    recog.onend = () => {
      if (recognitionRef.current && isListening) {
        console.log("Speech ended unexpectedly. Restarting...");
        try {
          recog.start();
        } catch (err) {
          console.warn("Could not restart:", err.message);
        }
      } else {
        console.log("Speech ended normally.");
        if (transcript.trim()) onStop(transcript.trim());
      }
    };

    recognitionRef.current = recog;

    return () => {
      recog.stop();
      recog.abort();
      recognitionRef.current = null;
      console.log("Speech recognition cleanup done.");
    };
  }, []);

  useEffect(() => {
    const recog = recognitionRef.current;
    if (!recog) return;

    if (isListening) {
      setTranscript("");
      try {
        recog.start();
        console.log("Speech recognition started.");
      } catch (err) {
        console.warn("Already started:", err.message);
      }
    } else {
      recog.stop();
      recog.abort();
      console.log("Speech recognition stopped.");
    }
  }, [isListening]);

  return showTranscript ? (
    <p className="text-sm text-green-300 text-center">{transcript}</p>
  ) : null;
}

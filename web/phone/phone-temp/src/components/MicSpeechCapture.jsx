// MicSpeechCapture.jsx
import React, { useEffect, useRef, useState } from "react";

export default function MicSpeechCapture({ isListening, onTranscript, showTranscript }) {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!isListening) {
      // stop recording if it’s running
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
        setStatus("Stopping…");
      }
      return;
    }

    // start recording
    setStatus("Recording…");
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        const chunks = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = async () => {
          setStatus("Processing…");
          // assemble into WAV-compatible Blob
          const blob = new Blob(chunks, { type: "audio/webm" });
          const file = new File([blob], "speech.webm", { type: blob.type });
          const form = new FormData();
          form.append("audio", file);

          try {
            const res = await fetch("http://localhost:5001/speech-to-text", {
              method: "POST",
              body: form,
            });
            const data = await res.json();
            onTranscript(data.transcript || "");
            setStatus("");
          } catch (err) {
            console.error("Speech-to-text error:", err);
            setStatus("Error");
            onTranscript("");
          }

          // cleanup mic
          streamRef.current.getTracks().forEach((t) => t.stop());
        };

        recorder.start();
      })
      .catch((err) => {
        console.error("Microphone error:", err);
        setStatus("Mic Error");
        onTranscript("");
      });

    return () => {
      // cleanup on unmount
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [isListening, onTranscript]);

  if (!showTranscript) return null;
  return (
    <p className="text-sm text-green-300 text-center mt-2">
      {status}
    </p>
  );
}

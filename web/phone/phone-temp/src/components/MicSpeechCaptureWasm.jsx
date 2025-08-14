// MicSpeechCaptureWasm.jsx
import React, { useEffect, useRef, useState } from "react";
import { Vosk } from "vosk-browser";

export default function MicSpeechCaptureWasm({ isListening, onTranscript }) {
  const [status, setStatus] = useState("Loading model...");
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const procRef = useRef(null);
  const recognizerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 1. Load the model (public/vosk-model/model.tar.gz)
        const model = await Vosk.createModel("/vosk-model/model.tar.gz");
        if (!mounted) return;
        setStatus("Model loaded");

        // 2. Create recognizer
        const recognizer = new model.KaldiRecognizer(16000);
        recognizer.setWords(true);
        recognizerRef.current = recognizer;

        recognizer.on("result", (msg) => {
          onTranscript(msg.result.text || "", true);
          setStatus("Listening…");
        });
        recognizer.on("partialresult", (msg) => {
          onTranscript(msg.result.partial || "", false);
          setStatus("Listening…");
        });

        setStatus("Ready");
      } catch (e) {
        console.error("Vosk init error", e);
        setStatus("Error loading model");
      }
    })();

    return () => {
      mounted = false;
      // Clean up audio context if created
      if (procRef.current) {
        procRef.current.disconnect();
        sourceRef.current.disconnect();
        audioCtxRef.current.close();
      }
    };
  }, [onTranscript]);

  useEffect(() => {
    const recognizer = recognizerRef.current;
    if (!recognizer) return;

    if (isListening) {
      (async () => {
        setStatus("Initializing mic…");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtxRef.current = new AudioContext({ sampleRate: 16000 });
        sourceRef.current = audioCtxRef.current.createMediaStreamSource(stream);
        procRef.current = audioCtxRef.current.createScriptProcessor(4096, 1, 1);

        procRef.current.onaudioprocess = (e) => {
          try {
            recognizer.acceptWaveform(e.inputBuffer);
          } catch (_) {}
        };

        sourceRef.current.connect(procRef.current);
        procRef.current.connect(audioCtxRef.current.destination);
        setStatus("Listening…");
      })();
    } else {
      setStatus("Stopped");
      if (procRef.current) {
        procRef.current.disconnect();
        sourceRef.current.disconnect();
      }
      audioCtxRef.current?.close();
    }
  }, [isListening]);

  return (
    <div className="text-center mt-2">
      <p className="text-sm text-green-300">{status}</p>
    </div>
  );
}

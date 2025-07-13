// src/components/MicLiveTranscribe.jsx

import React, { useEffect, useRef, useState } from "react";
import Vosk from "vosk-browser";


export default function MicLiveTranscribe({ onResult, onStop }) {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(true);
  const modelRef = useRef(null);
  const recognizerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);

  // Load Vosk model once
  useEffect(() => {
    const loadModel = async () => {
      const model = new Model(
        "/models/vosk-model-small-en-us-0.15" // Relative to public/
      );
      await model.init();
      modelRef.current = model;
      setLoading(false);
    };

    loadModel();

    return () => {
      stopRecognition(); // clean up
    };
  }, []);

  const startRecognition = async () => {
    if (!modelRef.current) return;
    const model = modelRef.current;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    const recognizer = new KaldiRecognizer(model, 16000);
    recognizer.setWords(true);
    recognizerRef.current = recognizer;

    processor.onaudioprocess = async (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const result = recognizer.acceptWaveform(input);

      if (result) {
        const res = recognizer.result();
        const text = res?.text || "";
        setTranscript(text);
        if (onResult) onResult(text);
      } else {
        const partial = recognizer.partialResult();
        setTranscript(partial.partial);
      }
    };

    source.connect(processor);
    processor.connect(audioContext.destination);
  };

  const stopRecognition = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
    }

    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    const finalResult = recognizerRef.current?.finalResult()?.text || "";
    if (onStop) onStop(finalResult);
  };

  // Auto start on mount
  useEffect(() => {
    if (!loading) {
      startRecognition();
    }
  }, [loading]);

  return (
    <div className="text-white text-sm text-center px-4 py-2">
      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading voice model...</p>
      ) : (
        <p className="animate-fadeInUpSlow">{transcript || "Listening..."}</p>
      )}
    </div>
  );
}

// src/components/MicOverlay.jsx

import React, { useState, useEffect, useRef } from "react";
import { Mic, Keyboard, X, ArrowLeft } from "lucide-react";
import TypingInputBox from "./TypingInputBox";
import { uploadAudioAndTranscribe } from "../utils/uploadAudioAndTranscribe";
import { abortUpload } from "@/utils/uploadAudioAndTranscribe";

// WAV encoder utility function
const encodeWAV = (samples, sampleRate = 44100) => {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  
  // WAV header
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  
  // Convert float samples to 16-bit PCM
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }
  
  return buffer;
};

export default function MicOverlay({ onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [hasSent, setHasSent] = useState(false);
  const [textMode, setTextMode] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const recordedSamplesRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      streamRef.current = stream;

      // Initialize Web Audio API for WAV processing
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 44100
      });
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      // Create ScriptProcessorNode for audio processing
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      recordedSamplesRef.current = [];
      
      processorRef.current.onaudioprocess = (event) => {
        const inputBuffer = event.inputBuffer;
        const inputData = inputBuffer.getChannelData(0);
        
        // Copy samples to our recording buffer
        const samples = new Float32Array(inputData.length);
        samples.set(inputData);
        recordedSamplesRef.current.push(samples);
      };
      
      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      // Fallback MediaRecorder for browsers that don't support ScriptProcessorNode well
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus") 
          ? "audio/webm;codecs=opus" 
          : "audio/webm"
      });

      const chunks = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("🛑 Recording stopped.");
        setIsProcessing(true);

        let audioBlob;

        // Try to create WAV from Web Audio API samples first
        if (recordedSamplesRef.current.length > 0) {
          try {
            // Combine all sample chunks
            const totalLength = recordedSamplesRef.current.reduce((acc, chunk) => acc + chunk.length, 0);
            const combinedSamples = new Float32Array(totalLength);
            
            let offset = 0;
            recordedSamplesRef.current.forEach(chunk => {
              combinedSamples.set(chunk, offset);
              offset += chunk.length;
            });

            // Encode to WAV
            const wavBuffer = encodeWAV(combinedSamples, 44100);
            audioBlob = new Blob([wavBuffer], { type: "audio/wav" });
            console.log("✅ Created WAV from Web Audio API samples");
          } catch (error) {
            console.warn("⚠️ WAV encoding failed, falling back to MediaRecorder:", error);
            audioBlob = chunks.length > 0 ? new Blob(chunks, { type: "audio/webm" }) : null;
          }
        } else {
          // Fallback to MediaRecorder blob
          audioBlob = chunks.length > 0 ? new Blob(chunks, { type: "audio/webm" }) : null;
        }

        if (!audioBlob) {
          console.error("❌ No audio data recorded");
          setIsProcessing(false);
          return;
        }

        try {
          console.log(`📤 Uploading ${audioBlob.type} audio (${audioBlob.size} bytes)`);
          const text = await uploadAudioAndTranscribe(audioBlob);
          console.log("📄 Transcribed text:", text);
          handleTranscript(text);
        } catch (error) {
          console.error("Transcription error:", error);
          setIsProcessing(false);
        }

        // Cleanup
        stream.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorder.start();
      setIsListening(true);
      console.log("▶️ Recording in WAV format...");
    } catch (err) {
      console.error("Mic error:", err);
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    
    if (processorRef.current) {
      processorRef.current.disconnect();
    }
    
    setIsListening(false);
  };

  const toggleMic = () => {
    isListening ? stopRecording() : startRecording();
  };

  const cancelProcessing = () => {
    setIsProcessing(false);
    setTranscript("");
    recordedSamplesRef.current = [];
    startRecording();
    abortUpload();
  };

  const handleTranscript = (text) => {
    setIsProcessing(false);
    const finalText = text || "";
    setTranscript(finalText);
    if (!finalText.trim()) return;
    setHasSent(true);

    setTimeout(() => {
      setResponse("Understood. How can I assist further?");
    }, 800);
  };

  const resetAll = () => {
    setIsListening(false);
    setIsProcessing(false);
    setTranscript("");
    setResponse("");
    setHasSent(false);
    setTextMode(false);
    recordedSamplesRef.current = [];
    
    // Cleanup audio resources
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  const close = () => {
    resetAll();
    onClose();
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-xl flex flex-col z-65 px-4 pb-4 pt-[env(safe-area-inset-top)] text-white">
      
      {/* ❌ Close Button */}
      { (
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 bg-white/10 rounded-full transition"
        >
          <X size={20} />
        </button>
      )}

      {/* 🎤 Voice Mode */}
      {!textMode && !hasSent && !isProcessing && (
        <div className="flex flex-col flex-1 items-center justify-center space-y-6">
          <div
            onClick={toggleMic}
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

          <div className="flex flex-col items-center space-y-1 w-full">
            <h2 className="text-lg font-semibold text-indigo-200 text-center">
              {isListening ? "Recording…" : "Tap mic to start speaking"}
            </h2>
            <p className="text-sm text-gray-300 mt-4">
              {isListening ? "Listening..." : transcript || "Waiting for input..."}
            </p>
              <p className="text-xs text-gray-400 mt-4">
                 Tap MIC to Start and Stop Recording!
              </p>
          </div>

          <button
            onClick={() => {
              resetAll();
              setTextMode(true);
            }}
            className="flex items-center text-sm text-white/80 hover:text-purple-300 transition"
          >
            <Keyboard size={16} className="mr-1" />
            Prefer typing instead?
          </button>
        </div>
      )}

      {/* 🔄 Processing Mode */}
      {isProcessing && (
        <div className="flex flex-col flex-1 items-center justify-center space-y-6 animate-fade-in">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-indigo-300 text-lg font-medium">Processing your voice...</p>
          <button
            onClick={cancelProcessing}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
          >
            Cancel Processing
          </button>
        </div>
      )}

      {/* ⌨️ Typing Mode */}
      {textMode && (
        <TypingInputBox
          onClose={close}
          onBack={resetAll}
          presetText={transcript}
        />
      )}

      {/* ✅ Transcript & Response Mode */}
      {hasSent && (
        <div className="flex flex-col flex-grow justify-center items-center space-y-4 px-2">
          <div className="self-end bg-[#181818] border border-[#2c2c2c] rounded-xl p-3 max-w-[75%] animate-slide-in-right">
            <p className="text-xs text-gray-500 mb-1 text-right">You</p>
            <p className="text-sm text-gray-300 text-right animate-fade-in-text">{transcript}</p>
          </div>
          <div className="self-start bg-[#1e1e1e] border border-[#333] rounded-xl p-3 max-w-[85%] animate-slide-in-left">
            <p className="text-xs text-purple-400 mb-1">F.R.I.D.A.Y.</p>
            <p className="text-sm text-white animate-fade-in-text">{response}</p>
          </div>

          <button
            onClick={() => {
              resetAll();
              startRecording();
            }}
            className="flex items-center mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition"
          >
            <ArrowLeft size={16} className="mr-2" />
            Return to Mic
          </button>
        </div>
      )}
    </div>
  );
}
// src/utils/uploadAudioAndTranscribe.js

let controller = null;

export function abortUpload() {
  if (controller) {
    controller.abort();
    console.log("⛔ Upload aborted by user.");
  }
}

export async function uploadAudioAndTranscribe(audioBlob) {
  controller = new AbortController();
  const signal = controller.signal;

  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");

  try {
    const res = await fetch("http://127.0.0.1:8000/transcribe/", {
      method: "POST",
      body: formData,
      signal,
    });

    if (!res.ok) throw new Error("Transcription failed");

    const data = await res.json();

    console.log("🧠 Backend transcription response:", data);

    return data.text || "";
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("❌ Upload aborted by user.");
    } else {
      console.error("❌ Error uploading audio:", err);
    }
    return "";
  }
}

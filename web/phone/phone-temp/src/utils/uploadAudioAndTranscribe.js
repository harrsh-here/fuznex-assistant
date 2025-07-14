export async function uploadAudioAndTranscribe(audioBlob) {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.wav");

  try {
    const res = await fetch("http://127.0.0.1:8000/transcribe/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Transcription failed");
    const data = await res.json();
    return data.text;
  } catch (err) {
    console.error("Error uploading audio:", err);
    return null;
  }
}

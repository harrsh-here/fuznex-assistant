import Recorder from "recorder-js";

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let recorder = new Recorder(audioContext);
let stream = null;

export async function startRecording() {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  recorder.init(stream);
  recorder.start();
}

export async function stopRecording() {
  const { blob } = await recorder.stop();
  stream.getTracks().forEach(track => track.stop()); // Clean up
  return blob;
}

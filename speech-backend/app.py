from flask import Flask, request, jsonify
from flask_cors import CORS
from vosk import Model, KaldiRecognizer
import os
import wave
import json

app = Flask(__name__)

CORS(app)  # 👈 Enable CORS for all routes

# Path to your downloaded Vosk model (adjust if needed)
MODEL_PATH = "model/vosk-model-small-en-in-0.4"

# Load the model
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at: {MODEL_PATH}")
model = Model(MODEL_PATH)

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']

    # Save the uploaded file temporarily
    temp_path = "temp.wav"
    audio_file.save(temp_path)

    # Open the wave file
    wf = wave.open(temp_path, "rb")
    if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != "NONE":
        wf.close()
        os.remove(temp_path)
        return jsonify({"error": "Audio must be WAV format mono PCM."}), 400

    # Initialize recognizer
    rec = KaldiRecognizer(model, wf.getframerate())

    # Read data and recognize
    results = []
    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            res = json.loads(rec.Result())
            results.append(res.get("text", ""))
    final_res = json.loads(rec.FinalResult())
    results.append(final_res.get("text", ""))

    wf.close()
    os.remove(temp_path)

    return jsonify({
        "transcript": " ".join(results).strip()
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)

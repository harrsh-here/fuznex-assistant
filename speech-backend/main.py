from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import whisper
import os
import uuid

app = FastAPI()

# CORS (optional: allow frontend dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model once
model = whisper.load_model("base")  # or "small", "medium", "large"

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    # Save the uploaded file temporarily
    temp_filename = f"temp_{uuid.uuid4().hex}.mp3"
    with open(temp_filename, "wb") as f:
        content = await file.read()
        f.write(content)

    # Transcribe with Whisper
    try:
        result = model.transcribe(temp_filename)
        text = result["text"]
    except Exception as e:
        text = f"Error during transcription: {str(e)}"

    # Clean up
    os.remove(temp_filename)

    return {"transcript": text}

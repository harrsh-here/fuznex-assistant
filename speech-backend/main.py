from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import whisper
import os

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 👇 Add this after `app = FastAPI()`
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = whisper.load_model("tiny")  # or "small" / "medium"
model_dir = model.model_path  # this gives the path to the downloaded model file 
print(f"Model downloaded to: {model_dir}")

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        # ✅ Step 1: Save file temporarily
        contents = await file.read()
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(contents)
       # print("🧠 File saved to:", temp_path)

        # ✅ Step 2: Transcribe
        result = model.transcribe(temp_path)
       # print("📝 Transcription result:", result)

        # ✅ Step 3: Cleanup and return
        os.remove(temp_path)
       # return {"text": result.get("text", "")}
    
    except Exception as e:
        print("❌ Error in transcription:", str(e))
        return JSONResponse(status_code=500, content={"error": str(e)})

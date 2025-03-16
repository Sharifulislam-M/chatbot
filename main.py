from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("API_KEY")

# FastAPI অ্যাপ তৈরি
app = FastAPI()

# রিকোয়েস্ট মডেল
class ChatRequest(BaseModel):
    message: str

# চ্যাটবট API
@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": request.message}]
        )
        return {"reply": response["choices"][0]["message"]["content"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Root endpoint
@app.get("/")
def root():
    return {"message": "Chatbot API is running!"}

# API Key validation (optional)
if openai.api_key:
    try:
        openai.Model.list()
        print("✅ API Key is valid!")
    except openai.OpenAIError:
        print("❌ Invalid API Key!")
else:
    raise ValueError("API_KEY is missing! Please set it in the .env file.")

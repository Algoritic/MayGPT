# Import necessary modules
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from enum import Enum

from llm import AzureOpenAIChatClient

# Define your FastAPI app
app = FastAPI()

# Enum for agent selection if you plan to extend functionality to support more agents in the future
class AssistantName(str, Enum):
    azure_openai = "AzureOpenAI"

# Request model to structure the input data
class ChatRequest(BaseModel):
    agent: AssistantName
    query: str

# Initialize your chat client (could be extended to support multiple clients)
chat_client = AzureOpenAIChatClient()

@app.get("/")
async def test_api():
    return {"message": "Welcome to MayGPT Backend API Service!"}

@app.post("/chat/")
async def chat_with_agent(chat_request: ChatRequest):
    # Based on the agent selected, you can route the query accordingly
    if chat_request.agent == AssistantName.azure_openai:
        response = chat_client.get_chat_response(chat_request.query)
        return {"response": response}
    else:
        raise HTTPException(status_code=400, detail="Unsupported assistant")

# Main function is not needed in FastAPI as it uses uvicorn to run the server
# To run the server, use the following command in the terminal:
# uvicorn filename:app --reload --port 8001
# Replace 'filename' with the name of your Python file without the '.py' extension

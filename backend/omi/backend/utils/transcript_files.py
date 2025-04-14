import os
import asyncio
from datetime import datetime
from pathlib import Path

# Define transcript directory
TRANSCRIPT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "transcripts")

# Create the directory if it doesn't exist
os.makedirs(TRANSCRIPT_DIR, exist_ok=True)

# Lock for file operations to prevent race conditions
file_lock = asyncio.Lock()

async def save_transcript_line(uid: str, conversation_id: str, segment_text: str):
    """
    Save the latest transcript line to a file.
    This file will be overwritten with each new line.
    """
    async with file_lock:
        # Create user directory if it doesn't exist
        user_dir = os.path.join(TRANSCRIPT_DIR, uid)
        os.makedirs(user_dir, exist_ok=True)
        
        # Path for the latest line file
        latest_line_path = os.path.join(user_dir, f"{conversation_id}_latest.txt")
        
        # Write the latest line to the file
        with open(latest_line_path, "w") as f:
            f.write(segment_text)
            
        return latest_line_path

async def append_to_full_transcript(uid: str, conversation_id: str, segment_text: str):
    """
    Append a new transcript line to the full transcript file.
    This file will contain the entire conversation history.
    """
    async with file_lock:
        # Create user directory if it doesn't exist
        user_dir = os.path.join(TRANSCRIPT_DIR, uid)
        os.makedirs(user_dir, exist_ok=True)
        
        # Path for the full transcript file
        full_transcript_path = os.path.join(user_dir, f"{conversation_id}_full.txt")
        
        # Append the line to the full transcript file
        with open(full_transcript_path, "a") as f:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"[{timestamp}] {segment_text}\n")
            
        return full_transcript_path

async def save_transcript(uid: str, conversation_id: str, segment_text: str):
    """
    Save transcript to both files - latest line and full transcript.
    """
    latest_path = await save_transcript_line(uid, conversation_id, segment_text)
    full_path = await append_to_full_transcript(uid, conversation_id, segment_text)
    return latest_path, full_path 
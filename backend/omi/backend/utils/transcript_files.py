import os
import asyncio
from datetime import datetime
from pathlib import Path

# Define transcript directory
TRANSCRIPT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "transcripts")

# Define transcript file path
TRANSCRIPT_FILE = os.path.join(TRANSCRIPT_DIR, "transcript.txt")

# Create the directory if it doesn't exist
os.makedirs(TRANSCRIPT_DIR, exist_ok=True)

# Lock for file operations to prevent race conditions
file_lock = asyncio.Lock()

async def clear_transcript_file():
    """
    Clear the transcript file and add a header.
    """
    async with file_lock:
        # Clear the transcript file
        with open(TRANSCRIPT_FILE, "w", encoding="utf-8") as file:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            file.write(f"# Transcript started at {timestamp}\n\n")
        
        print(f"Cleared transcript file: {TRANSCRIPT_FILE}")
        return TRANSCRIPT_FILE

async def update_transcript(segment_text, is_bot=False):
    """
    Update the transcript file with a new message.
    """
    async with file_lock:
        # Append to the transcript file
        with open(TRANSCRIPT_FILE, "a", encoding="utf-8") as file:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            prefix = "Bot: " if is_bot else "User: "
            file.write(f"[{timestamp}] {prefix}{segment_text}\n")
            
        return TRANSCRIPT_FILE

async def save_transcript(uid: str, conversation_id: str, segment_text: str):
    """
    Save transcript to the transcript file.
    This function maintains compatibility with existing code by accepting uid and conversation_id,
    but those parameters are not used in the new implementation.
    """
    # Simply pass to update_transcript
    return await update_transcript(segment_text) 
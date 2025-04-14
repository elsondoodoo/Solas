import os
import time
import sys
import asyncio
from datetime import datetime

# Add parent directory to path so we can import from omi package
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Path for the transcripts directory
TRANSCRIPT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "omi", "backend", "transcripts")
os.makedirs(TRANSCRIPT_DIR, exist_ok=True)

# Transcript file path - using a consistent name across all modules
TRANSCRIPT_FILE = os.path.join(TRANSCRIPT_DIR, "transcript.txt")

# Input and output files
INPUT_FILE = "user_input.txt"
OUTPUT_FILE = "bot_responses.txt"
PAUSE_DURATION = 2.0

async def update_transcript(message, is_bot=False):
    """
    Update the transcript file with a new message.
    """
    try:
        # Append to the transcript file
        with open(TRANSCRIPT_FILE, "a", encoding="utf-8") as file:
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
            prefix = "Bot: " if is_bot else "User: "
            file.write(f"[{timestamp}] {prefix}{message}\n")
            
        print(f"Transcript file updated: {TRANSCRIPT_FILE}")
    except Exception as e:
        print(f"Error updating transcript file: {e}")

async def process_message(message):
    """
    Process a user message and save it to transcript file.
    """
    print(f"Processing message: {message}")
    # Update transcript file with user message
    await update_transcript(message)
    print(f"Transcript saved to {TRANSCRIPT_FILE}")

def get_new_lines(file_path, last_processed_count):
    """
    Get new lines from the input file since last processing.
    """
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            lines = file.readlines()
            total_lines = len(lines)

            if total_lines <= last_processed_count:
                return []

            # Get all new lines since last processing
            new_lines = lines[last_processed_count:]
            return [line.strip() for line in new_lines if line.strip()]
    except Exception as e:
        print(f"Error reading file: {e}")
        return []

async def main():
    # Clear the transcript file at startup
    with open(TRANSCRIPT_FILE, "w", encoding="utf-8") as f:
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"# Transcript started at {timestamp}\n\n")
    print(f"Cleared transcript file: {TRANSCRIPT_FILE}")
    
    # Create the input file if it doesn't exist
    if not os.path.exists(INPUT_FILE):
        with open(INPUT_FILE, "w", encoding="utf-8") as f:
            f.write("# Write your messages here. Each line will be processed as a transcript.\n")
    
    # Initialize line counter
    last_processed_count = 0
    try:
        with open(INPUT_FILE, "r", encoding="utf-8") as file:
            last_processed_count = len(file.readlines())
    except Exception as e:
        print(f"Error counting initial lines: {e}")
    
    print(f"Monitoring {INPUT_FILE} for changes. Press Ctrl+C to stop.")
    print(f"Transcript will be saved to: {TRANSCRIPT_FILE}")
    
    try:
        while True:
            # Check for new lines
            new_messages = get_new_lines(INPUT_FILE, last_processed_count)
            
            if new_messages:
                # Process each new message
                for message in new_messages:
                    await process_message(message)
                
                # Update the line counter
                with open(INPUT_FILE, "r", encoding="utf-8") as file:
                    last_processed_count = len(file.readlines())
            
            # Wait before checking again
            await asyncio.sleep(PAUSE_DURATION)
    except KeyboardInterrupt:
        print("\nApplication stopped by user")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 
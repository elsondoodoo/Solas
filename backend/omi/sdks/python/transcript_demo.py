import asyncio
import os
import sys
from asyncio import Queue
from datetime import datetime

from omi.transcribe import save_transcript_line, append_to_full_transcript, TRANSCRIPTS_DIR

# Get API key from environment variable or command line argument
api_key = os.environ.get("DEEPGRAM_API_KEY")
if not api_key and len(sys.argv) > 1:
    api_key = sys.argv[1]
if not api_key:
    print("Please provide your Deepgram API key as an environment variable DEEPGRAM_API_KEY")
    print("Or pass it as a command line argument: python transcript_demo.py YOUR_API_KEY")
    sys.exit(1)

# Create a unique ID for this conversation
conversation_id = datetime.now().strftime("%Y%m%d_%H%M%S")
print(f"Starting new conversation with ID: {conversation_id}")
print(f"Transcripts will be saved to: {os.path.join(TRANSCRIPTS_DIR, conversation_id)}")

# Example function to simulate receiving transcripts
async def simulate_transcripts():
    # Sample phrases to simulate transcription
    phrases = [
        "Hello, this is a test of the transcription system.",
        "The transcript should be saved to files in real time.",
        "One file contains only the latest line.",
        "The other file contains the entire conversation history.",
        "This is the end of the test. Thank you!"
    ]
    
    # Process each phrase
    for phrase in phrases:
        print(f"\nTranscript: {phrase}")
        
        # Save to both files
        save_transcript_line(conversation_id, phrase)
        append_to_full_transcript(conversation_id, phrase)
        
        # Wait 2 seconds between phrases
        await asyncio.sleep(2)
    
    print("\nDemo completed!")
    print(f"You can find the transcript files in: {os.path.join(TRANSCRIPTS_DIR, conversation_id)}")
    print(f"Latest line: {os.path.join(TRANSCRIPTS_DIR, conversation_id, 'latest.txt')}")
    print(f"Full transcript: {os.path.join(TRANSCRIPTS_DIR, conversation_id, 'full.txt')}")

if __name__ == "__main__":
    try:
        asyncio.run(simulate_transcripts())
    except KeyboardInterrupt:
        print("\nDemo stopped by user.")
    except Exception as e:
        print(f"Error: {e}") 
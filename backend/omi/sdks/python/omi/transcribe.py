import websockets
import json
import asyncio
import os
from datetime import datetime

# Create transcripts directory in the SDK folder
TRANSCRIPTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "transcripts")
os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)

# Single transcript file path
TRANSCRIPT_FILE = os.path.join(TRANSCRIPTS_DIR, "transcript.txt")

# File locks for concurrent access
import threading
file_lock = threading.Lock()

def clear_transcript_file():
    """Clear the transcript file and add a header."""
    with file_lock:
        with open(TRANSCRIPT_FILE, "w") as f:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"# Transcript started at {timestamp}\n\n")
        print(f"Cleared transcript file: {TRANSCRIPT_FILE}")

def update_transcript(text):
    """Update the transcript file with new text."""
    with file_lock:
        # Append the text to the transcript file
        with open(TRANSCRIPT_FILE, "a") as f:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"[{timestamp}] {text}\n")
        return TRANSCRIPT_FILE

# For backward compatibility
def save_transcript_line(conversation_id, text):
    """Save transcript line (updated to use single file)."""
    return update_transcript(text)

# For backward compatibility
def append_to_full_transcript(conversation_id, text):
    """Append to transcript (updated to use single file)."""
    return update_transcript(text)

async def transcribe(audio_queue, api_key):
    url = "wss://api.deepgram.com/v1/listen?punctuate=true&model=nova&language=en-US&encoding=linear16&sample_rate=16000&channels=1"
    headers = {
        "Authorization": f"Token {api_key}"
    }

    # Clear the transcript file at the start
    clear_transcript_file()
    
    # Display info
    print(f"Transcript will be saved to: {TRANSCRIPT_FILE}")

    while True:
        try:
            async with websockets.connect(url, extra_headers=headers) as ws:
                print("Connected to Deepgram WebSocket")

                async def send_audio():
                    while True:
                        try:
                            chunk = await audio_queue.get()
                            await ws.send(chunk)
                        except Exception as e:
                            print(f"Error sending audio: {e}")
                            break

                async def receive_transcripts():
                    try:
                        async for msg in ws:
                            try:
                                response = json.loads(msg)
                                if "error" in response:
                                    print(f"Deepgram Error: {response['error']}")
                                    continue
                                    
                                # Extract transcript from the response
                                if "channel" in response and "alternatives" in response["channel"]:
                                    transcript = response["channel"]["alternatives"][0].get("transcript", "")
                                    if transcript and transcript.strip():
                                        clean_transcript = transcript.strip()
                                        print("\nTranscript:", clean_transcript)
                                        
                                        # Save transcript to the single file
                                        update_transcript(clean_transcript)
                            except json.JSONDecodeError as e:
                                print(f"Error decoding response: {e}")
                            except Exception as e:
                                print(f"Error processing transcript: {e}")
                    except websockets.exceptions.ConnectionClosed:
                        print("Connection to Deepgram closed")
                    except Exception as e:
                        print(f"Error in receive_transcripts: {e}")

                try:
                    await asyncio.gather(send_audio(), receive_transcripts())
                except Exception as e:
                    print(f"Error in transcribe: {e}")
                    
        except Exception as e:
            print(f"Connection error: {e}")
            print("Retrying connection in 5 seconds...")
            await asyncio.sleep(5)

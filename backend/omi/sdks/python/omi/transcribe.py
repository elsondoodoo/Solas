import websockets
import json
import asyncio
import os
from datetime import datetime

# Create transcripts directory in the SDK folder
TRANSCRIPTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "transcripts")
os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)

# File locks for concurrent access
import threading
file_lock = threading.Lock()

def save_transcript_line(conversation_id, text):
    """Save the latest transcript line to a file."""
    with file_lock:
        # Create conversation directory if it doesn't exist
        conversation_dir = os.path.join(TRANSCRIPTS_DIR, conversation_id)
        os.makedirs(conversation_dir, exist_ok=True)
        
        # Path for the latest line file
        latest_line_path = os.path.join(conversation_dir, "latest.txt")
        
        # Write the latest line to the file
        with open(latest_line_path, "w") as f:
            f.write(text)
            
        return latest_line_path

def append_to_full_transcript(conversation_id, text):
    """Append a new transcript line to the full transcript file."""
    with file_lock:
        # Create conversation directory if it doesn't exist
        conversation_dir = os.path.join(TRANSCRIPTS_DIR, conversation_id)
        os.makedirs(conversation_dir, exist_ok=True)
        
        # Path for the full transcript file
        full_transcript_path = os.path.join(conversation_dir, "full.txt")
        
        # Append the line to the full transcript file
        with open(full_transcript_path, "a") as f:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"[{timestamp}] {text}\n")
            
        return full_transcript_path

async def transcribe(audio_queue, api_key):
    url = "wss://api.deepgram.com/v1/listen?punctuate=true&model=nova&language=en-US&encoding=linear16&sample_rate=16000&channels=1"
    headers = {
        "Authorization": f"Token {api_key}"
    }

    # Create a unique ID for this conversation
    conversation_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    print(f"Starting new conversation with ID: {conversation_id}")
    print(f"Transcripts will be saved to: {os.path.join(TRANSCRIPTS_DIR, conversation_id)}")

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
                                        
                                        # Save transcript to files
                                        save_transcript_line(conversation_id, clean_transcript)
                                        append_to_full_transcript(conversation_id, clean_transcript)
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

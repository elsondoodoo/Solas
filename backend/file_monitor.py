import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import chatbot
import json

# Configuration
OUTPUT_FILE = "bot_responses.txt"
TRANSCRIPT_DIR = "omi/sdks/python/transcripts"
TRANSCRIPT_FILE = os.path.join(TRANSCRIPT_DIR, "transcript.txt")
PAUSE_DURATION = 5.0

# Create transcript directory if it doesn't exist
os.makedirs(TRANSCRIPT_DIR, exist_ok=True)

class TranscriptFileHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_modified = time.time()
        self.last_processed_line_count = 0

    def on_modified(self, event):
        # Check if the modified file is our transcript file
        if os.path.abspath(event.src_path) == os.path.abspath(TRANSCRIPT_FILE):
            # Add a longer delay to ensure file is completely written
            time.sleep(PAUSE_DURATION)

            # Avoid duplicate events (some systems trigger multiple events)
            current_time = time.time()
            if current_time - self.last_modified < 1:
                return
            self.last_modified = current_time

            print(f"File {TRANSCRIPT_FILE} has been modified")
            process_input_file(self.last_processed_line_count)

            # Update the last processed line count
            try:
                with open(TRANSCRIPT_FILE, "r", encoding="utf-8") as file:
                    self.last_processed_line_count = len(file.readlines())
            except Exception as e:
                print(f"Error updating line count: {e}")


def get_new_lines(file_path, last_processed_count):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            lines = file.readlines()
            total_lines = len(lines)

            if total_lines <= last_processed_count:
                return []

            # Get all new lines since last processing
            new_lines = lines[last_processed_count:]
            return [line.strip() for line in new_lines if line.strip() and not line.strip().startswith('#')]
    except Exception as e:
        print(f"Error reading file: {e}")
        return []


def append_to_output(message):
    """
    Append only the chatbot's response to the output file.
    No timestamps, separators, or function call info.
    """
    try:
        with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
            # Write only the message text without any additional formatting
            file.write(message)
            file.write("\n")
    except Exception as e:
        print(f"Error writing to output file: {e}")


def process_input_file(last_processed_count):
    # Get all new lines from the transcript file
    new_messages = get_new_lines(TRANSCRIPT_FILE, last_processed_count)

    if not new_messages:
        print("No new messages found in transcript file")
        return

    # Combine all new messages into a single message
    # Extract actual user messages (remove timestamps and prefixes)
    cleaned_messages = []
    for message in new_messages:
        # Check if it's a user message, not a bot response
        if "] User: " in message or ("] " in message and "Bot: " not in message):
            # Extract just the content after the timestamp and prefix
            parts = message.split("] ", 1)
            if len(parts) > 1:
                if "User: " in parts[1]:
                    content = parts[1].replace("User: ", "", 1)
                else:
                    content = parts[1]
                cleaned_messages.append(content)

    if not cleaned_messages:
        print("No user messages found in the new lines")
        return

    combined_message = "\n".join(cleaned_messages)
    print(f"Processing combined user message:\n{combined_message}")

    # Use the chatbot to process the combined message
    response = chatbot.chat.next(combined_message)

    # Write the response to the output file
    append_to_output(response.message)

    print(f"Bot response: {response.message}")
    if response.function_call:
        print(f"Function call: {response.function_call.fn_name}")


def start_monitoring():
    # Clear the output file at startup
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("")
    print(f"Cleared {OUTPUT_FILE}")

    # Make sure transcript file exists
    if not os.path.exists(TRANSCRIPT_FILE):
        os.makedirs(os.path.dirname(TRANSCRIPT_FILE), exist_ok=True)
        with open(TRANSCRIPT_FILE, "w", encoding="utf-8") as f:
            f.write("# Transcript file - write your messages here or use the recording app.\n")

    # Count initial lines in the transcript file
    initial_line_count = 0
    try:
        with open(TRANSCRIPT_FILE, "r", encoding="utf-8") as file:
            initial_line_count = len(file.readlines())
    except Exception as e:
        print(f"Error counting initial lines: {e}")

    # Set up the file observer
    event_handler = TranscriptFileHandler()
    event_handler.last_processed_line_count = initial_line_count
    observer = Observer()
    
    # Watch the directory containing the transcript file
    transcript_dir_path = os.path.dirname(os.path.abspath(TRANSCRIPT_FILE))
    observer.schedule(event_handler, path=transcript_dir_path, recursive=False)
    observer.start()

    print(f"Monitoring {TRANSCRIPT_FILE} for changes. Press Ctrl+C to stop.")
    print(f"Initial line count: {initial_line_count}")
    print(f"Responses will be saved to: {OUTPUT_FILE}")

    try:
        # Process any new content at startup
        process_input_file(initial_line_count)

        # Keep the script running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == "__main__":
    start_monitoring()

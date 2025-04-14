import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import chatbot
import json

# Configuration
INPUT_FILE = "user_input.txt"
OUTPUT_FILE = "bot_responses.txt"
PAUSE_DURATION = 2.0


class InputFileHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_modified = time.time()
        self.last_processed_line_count = 0

    def on_modified(self, event):
        if event.src_path.endswith(INPUT_FILE):
            # Add a longer delay to ensure file is completely written
            time.sleep(PAUSE_DURATION)

            # Avoid duplicate events (some systems trigger multiple events)
            current_time = time.time()
            if current_time - self.last_modified < 1:
                return
            self.last_modified = current_time

            print(f"File {INPUT_FILE} has been modified")
            process_input_file(self.last_processed_line_count)

            # Update the last processed line count
            try:
                with open(INPUT_FILE, "r", encoding="utf-8") as file:
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
            return [line.strip() for line in new_lines if line.strip()]
    except Exception as e:
        print(f"Error reading file: {e}")
        return []


def append_to_output(message, function_call=None):
    try:
        with open(OUTPUT_FILE, "a", encoding="utf-8") as file:
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
            output = f"[{timestamp}] Bot: {message}\n"

            if function_call:
                function_info = (
                    f"[{timestamp}] Function Call: {function_call.fn_name}\n"
                )
                file.write(function_info)

            file.write(output)
            file.write("-" * 50 + "\n")
    except Exception as e:
        print(f"Error writing to output file: {e}")


def process_input_file(last_processed_count):
    # Get all new lines from the input file
    new_messages = get_new_lines(INPUT_FILE, last_processed_count)

    if not new_messages:
        print("No new messages found in input file")
        return

    # Combine all new messages into a single message
    combined_message = "\n".join(new_messages)
    print(f"Processing combined user message:\n{combined_message}")

    # Use the chatbot to process the combined message
    response = chatbot.chat.next(combined_message)

    # Write the response to the output file
    append_to_output(response.message, response.function_call)

    print(f"Bot response: {response.message}")
    if response.function_call:
        print(f"Function call: {response.function_call.fn_name}")


def start_monitoring():
    # Clear the output file at startup
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("# Bot responses will appear here.\n")
    print(f"Cleared {OUTPUT_FILE}")

    # Create the input file if it doesn't exist
    if not os.path.exists(INPUT_FILE):
        with open(INPUT_FILE, "w", encoding="utf-8") as f:
            f.write(
                "# Write your messages here. All new lines will be combined and sent to the chatbot.\n"
            )

    # Count initial lines in the input file
    initial_line_count = 0
    try:
        with open(INPUT_FILE, "r", encoding="utf-8") as file:
            initial_line_count = len(file.readlines())
    except Exception as e:
        print(f"Error counting initial lines: {e}")

    # Set up the file observer
    event_handler = InputFileHandler()
    event_handler.last_processed_line_count = initial_line_count
    observer = Observer()
    observer.schedule(event_handler, path=".", recursive=False)
    observer.start()

    print(f"Monitoring {INPUT_FILE} for changes. Press Ctrl+C to stop.")
    print(f"Initial line count: {initial_line_count}")

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

# Solas

let there be light

GAME python sdk:
https://github.com/game-by-virtuals/game-python

OMI docs:
https://docs.omi.me/docs/get_started/introduction

# File-Based Chatbot Interface

This system allows you to interact with the chatbot by writing messages to a text file.

## How to Use

1. Run the file monitoring script:

   ```
   python file_monitor.py
   ```

2. Open the `user_input.txt` file in any text editor.

3. Add your message as a new line at the end of the file and save.

4. The chatbot will process your message and write its response to `bot_responses.txt`.

5. To send another message, simply add a new line to `user_input.txt` and save again.

## Files

- `user_input.txt`: Write your messages here. The chatbot reads the last line.
- `bot_responses.txt`: Contains all responses from the chatbot.
- `file_monitor.py`: The script that monitors the input file and triggers the chatbot.
- `chatbot.py`: The main chatbot implementation.

## Notes

- Each time you save `user_input.txt`, the last line is treated as a new message.
- The system adds timestamps to all responses in the output file.
- Function calls made by the chatbot are also recorded in the output file.

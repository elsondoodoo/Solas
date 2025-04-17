import asyncio
import os
import sys
from omi.bluetooth import listen_to_omi
from omi.transcribe import transcribe, TRANSCRIPTS_DIR, TRANSCRIPT_FILE
from omi.decoder import OmiOpusDecoder
from asyncio import Queue

# Default Omi MAC address - you should replace this with your device's address
OMI_MAC = "D4:5E:89:C0:DD:A8"
OMI_CHAR_UUID = "0000180a-0000-1000-8000-00805f9b34fb"

def main():
    # Get API key from environment variable or command-line argument
    api_key = os.getenv("DEEPGRAM_API_KEY")
    if not api_key and len(sys.argv) > 1:
        api_key = sys.argv[1]

    if not api_key:
        print("Please provide your Deepgram API key:")
        print("Option 1: Set the DEEPGRAM_API_KEY environment variable")
        print(
            "Option 2: Pass it as a command-line argument: python main.py YOUR_API_KEY"
        )
        return

    # Check if MAC address was provided as a second argument
    mac_address = OMI_MAC
    if len(sys.argv) > 2:
        mac_address = sys.argv[2]
        print(f"Using custom MAC address: {mac_address}")
    else:
        print(f"Using default MAC address: {mac_address}")
        print("To use a different MAC address: python main.py API_KEY MAC_ADDRESS")

    print(f"Transcript will be saved to: {TRANSCRIPT_FILE}")
    print("Starting Omi listening service...")
    print("Press Ctrl+C to stop")

    audio_queue = Queue()
    decoder = OmiOpusDecoder()

    def handle_ble_data(sender, data):
        decoded_pcm = decoder.decode_packet(data)
        if decoded_pcm:
            try:
                audio_queue.put_nowait(decoded_pcm)
            except Exception as e:
                print("Queue Error:", e)

    async def run():
        try:
            await asyncio.gather(
                listen_to_omi(mac_address, OMI_CHAR_UUID, handle_ble_data),
                transcribe(audio_queue, api_key),
            )
        except Exception as e:
            print(f"Error during execution: {e}")
            print("If you're having trouble connecting to your Bluetooth device, try:")
            print("1. Make sure your device is turned on and in range")
            print("2. Check that the MAC address is correct")
            print("3. Run 'python scan.py' to see available Bluetooth devices")
            print(
                "4. Try again with the correct MAC address: python main.py API_KEY MAC_ADDRESS"
            )

    try:
        asyncio.run(run())
    except KeyboardInterrupt:
        print("\nApplication stopped by user")
    except Exception as e:
        print(f"Fatal error: {e}")


if __name__ == "__main__":
    main()

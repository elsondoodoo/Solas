from opuslib.api import encoder

def test_opus():
    try:
        # Try initializing an Opus encoder (mono, 48000 Hz, audio)
        enc = encoder.Encoder(48000, 1, 'audio')
        print("✅ Opus encoder initialized successfully!")
        print("Application:", enc.application)
    except Exception as e:
        print("❌ Failed to initialize Opus encoder.")
        print("Error:", e)

if __name__ == "__main__":
    test_opus()
    
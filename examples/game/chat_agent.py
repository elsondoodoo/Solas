from dotenv import load_dotenv
import random
import os
from typing import Any, Tuple
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from game_sdk.game.chat_agent import ChatAgent
from game_sdk.game.custom_types import Argument, Function, FunctionResultStatus

load_dotenv()
api_key = os.getenv("GAME_SDK_API")
client_id = os.getenv("SPOTIFY_CLIENT_ID")
client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
# ACTION SPACE

def generate_picture(prompt: str) -> Tuple[FunctionResultStatus, str, dict[str, Any]]:
    print(f"Generated picture with prompt: {prompt}")
    return FunctionResultStatus.DONE, "Picture generated and presented to the user", {}


def tell_joke(prompt: str) -> Tuple[FunctionResultStatus, str, dict[str, Any]]:
    # Define a bank of jokes
    jokes_bank = [
        "I'm reading a book on anti-gravity. It's impossible to put down!",
        "Did you hear about the mathematician who’s afraid of negative numbers? He'll stop at nothing to avoid them.",
        "I used to play piano by ear, but now I use my hands.",
        "What do you call fake spaghetti? An impasta!"
    ]
    # Check if the user input indicates sadness
    if "sad" in prompt.lower():
        selected_joke = random.choice(jokes_bank)
        print(f"User feels sad. Selected joke: {selected_joke}")
        return FunctionResultStatus.DONE, f"Don't be sad, here's a joke to cheer you up: {selected_joke}", {}
    else:
        print("No sadness detected in the prompt.")
        # Optionally, you can choose to always return a joke, or return a different message
        selected_joke = random.choice(jokes_bank)
        return FunctionResultStatus.DONE, f"It doesn't seem like you're feeling sad, but here's a joke anyway: {selected_joke}", {}

def stream_music_by_artist(artist: str) -> Tuple[FunctionResultStatus, str, dict[str, Any]]:
    """
    Streams a music preview from Spotify by searching for the given artist.
    
    This function uses Spotify's API to search for the artist, retrieves the top track,
    and returns the preview URL (if available) as a simulation of streaming.
    """
    # Retrieve Spotify API credentials from environment variables

    if not client_id or not client_secret:
        return (
            FunctionResultStatus.FAILED,
            "Spotify API credentials are not set. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.",
            {},
        )

    # Set up the Spotify client using client credentials flow.
    try:
        sp = spotipy.Spotify(
            client_credentials_manager=SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
        )
    except Exception as e:
        return FunctionResultStatus.FAILED, f"Failed to authenticate with Spotify: {str(e)}", {}
    
    # Search for the artist on Spotify
    search_results = sp.search(q=f"artist:{artist}", type="artist", limit=1)
    artists = search_results.get("artists", {}).get("items", [])
    if not artists:
        return FunctionResultStatus.FAILED, f"No artist found for '{artist}'.", {}

    # Get the first matching artist's ID
    artist_info = artists[0]
    artist_id = artist_info.get("id")
    
    # Retrieve the artist's top tracks (using a country code, e.g., "US")
    top_tracks_data = sp.artist_top_tracks(artist_id, country="US")
    top_tracks = top_tracks_data.get("tracks", [])
    if not top_tracks:
        return FunctionResultStatus.FAILED, f"No top tracks found for '{artist}'.", {}
    
    # Select the first top track and extract its preview URL
    top_track = top_tracks[0]
    track_name = top_track.get("name", "Unknown Title")
    preview_url = top_track.get("preview_url")
    
    # Simulate streaming by using the preview URL.
    if preview_url:
        message = (
            f"Streaming preview of '{track_name}' by {artist}. "
            f"Listen here: {preview_url}"
        )
        print(f"Streaming preview: {track_name} by {artist} | Preview URL: {preview_url}")
        return FunctionResultStatus.DONE, message, {}
    else:
        return FunctionResultStatus.FAILED, f"Preview not available for '{track_name}' by {artist}.", {}
    
def check_crypto_price(currency: str):
    prices = {
        "bitcoin": 100000,
        "ethereum": 20000,
    }
    result = prices[currency.lower()]
    if result is None:
        return FunctionResultStatus.FAILED, "The price of the currency is not available", {}
    return FunctionResultStatus.DONE, f"The price of {currency} is {result}", {}


action_space = [
    Function(
        fn_name="generate_picture",
        fn_description="Generate a picture",
        args=[Argument(name="prompt", description="The prompt for the picture")],
        executable=generate_picture,
    ),
    Function(
        fn_name="stream_music_by_artist",
        fn_description="Play Songs by Artist",
        args=[Argument(name="prompt", description="The prompt for the artist")],
        executable=stream_music_by_artist,
    ),
        Function(
        fn_name="tell_joke",
        fn_description="tell me a joke",
        args=[Argument(name="prompt", description="The prompt for the music")],
        executable=tell_joke,
    ),
    Function(
        fn_name="check_crypto_price",
        fn_description="Check the price of a crypto currency",
        args=[Argument(name="currency", description="The currency to check the price of")],
        executable=check_crypto_price,
    ),
]


if not api_key:
    raise ValueError("GAME_API_KEY is not set")


# CREATE AGENT
agent = ChatAgent(
    prompt="Your name Solas. You are an empathetic companion that understands emotional states through voice \
        analysis and provides therapeutic interventions. ",
    api_key=api_key
)

chat = agent.create_chat(
    partner_id="elson",
    partner_name="Elson",
    action_space=action_space,
)

chat_continue = True
while chat_continue:

    user_message = input("Enter a message: ")

    response = chat.next(user_message)

    if response.function_call:
        print(f"Function call: {response.function_call.fn_name}")

    if response.message:
        print(f"Response: {response.message}")

    if response.is_finished:
        chat_continue = False
        break

print("Chat ended")
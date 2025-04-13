import React, { useState, useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

// Spotify configuration
const SPOTIFY_CLIENT_ID = '69d2974f22784f4fb24d0bde09e48a04';
const REDIRECT_URI = 'http://localhost:3000';
const SCOPES = [
  'user-library-read',
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state'
].join(' ');

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

export default function Home() {
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isMoodPickerOpen, setIsMoodPickerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [agentMessage, setAgentMessage] = useState('');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [currentJournal, setCurrentJournal] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const widgetRef = useRef(null);
  const iframeRef = useRef(null);
  const [isEmergencyContactsVisible, setIsEmergencyContactsVisible] = useState(false);
  const [emergencyContacts] = useState([
    { name: 'Crisis Lifeline', number: '988', description: '24/7 Crisis Support', facetime: null, emoji: '🆘' },
    { name: 'Kelly', number: 'kellyzhiying@hotmail.com', description: 'Available 24/7', facetime: 'kellyzhiying@hotmail.com', emoji: '👩‍⚕️' },
    { name: 'Best Friend', number: '(555) 987-6543', description: 'Available evenings', facetime: null, emoji: '🤗' },
    { name: 'Therapist', number: '(555) 234-5678', description: 'Available Mon-Fri', facetime: null, emoji: '🧠' }
  ]);

  const [currentTrack, setCurrentTrack] = useState({
    title: 'Safe With Me',
    artist: 'Gryffin, Audrey Mika',
    artwork: 'https://i.imgur.com/bFIvfe2.png',
    soundCloudUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/931781749&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false'
  });

  const [playlist, setPlaylist] = useState([
    {
      title: 'Safe With Me',
      artist: 'Gryffin, Audrey Mika',
      artwork: 'https://i.imgur.com/bFIvfe2.png',
      soundCloudUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/931781749&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false'
    }
  ]);

  // Mood states
  const moods = {
    "😊": "Happy",
    "😔": "Sad",
    "😌": "Calm",
    "😤": "Frustrated",
    "🥰": "Loved",
    "😴": "Tired"
  };

  const [weekMoods, setWeekMoods] = useState({
    'S': '',
    'M': '',
    'T': '',
    'W': '',
    'T': '',
    'F': '',
    'S': ''
  });

  const [selectedContact, setSelectedContact] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [spotifyToken, setSpotifyToken] = useState(null);
  const [spotifyPlayer, setSpotifyPlayer] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [isSpotifyMode, setIsSpotifyMode] = useState(false);
  const [spotifyError, setSpotifyError] = useState(null);

  // Update Spotify authentication effect
  useEffect(() => {
    // Check if we're returning from Spotify auth
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const error = params.get('error');
      const token = params.get('access_token');

      if (error) {
        setSpotifyError(error);
        console.error('Spotify auth error:', error);
        return;
      }

      if (token) {
        setSpotifyToken(token);
        window.location.hash = '';
      }
    }
  }, []);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    if (!spotifyToken) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Solace Web Player',
        getOAuthToken: cb => cb(spotifyToken),
      });

      player.connect();
      setSpotifyPlayer(player);
    };

    // Fetch liked songs
    fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
      headers: {
        'Authorization': `Bearer ${spotifyToken}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setLikedSongs(data.items.map(item => ({
        title: item.track.name,
        artist: item.track.artists[0].name,
        artwork: item.track.album.images[0].url,
        uri: item.track.uri
      })));
    });

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [spotifyToken]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (iframeRef.current) {
        widgetRef.current = window.SC.Widget(iframeRef.current);
        
        widgetRef.current.bind(window.SC.Widget.Events.READY, () => {
          console.log('SoundCloud widget is ready');
        });

        widgetRef.current.bind(window.SC.Widget.Events.PLAY, () => {
          setIsPlaying(true);
        });

        widgetRef.current.bind(window.SC.Widget.Events.PAUSE, () => {
          setIsPlaying(false);
        });

        widgetRef.current.bind(window.SC.Widget.Events.FINISH, () => {
          setIsPlaying(false);
          playNext();
        });
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const togglePlay = () => {
    if (!widgetRef.current) return;
    if (isPlaying) {
      widgetRef.current.pause();
    } else {
      widgetRef.current.play();
    }
  };

  const playNext = () => {
    const currentIndex = playlist.findIndex(
      track => track.soundCloudUrl === currentTrack.soundCloudUrl
    );
    
    if (currentIndex < playlist.length - 1) {
      setCurrentTrack(playlist[currentIndex + 1]);
      setIsPlaying(true);
    }
  };

  const handleDragStart = (e, emoji) => {
    e.dataTransfer.setData('emoji', emoji);
  };

  const recommendAndPlayMusic = (mood) => {
    if (mood === '😔') {
      setCurrentTrack(playlist[0]);
      setTimeout(() => {
        if (widgetRef.current) {
          widgetRef.current.play();
          setIsPlaying(true);
        }
      }, 500);

      setAgentMessage("I noticed you're feeling down. Let me play a song that might help lift your spirits.");
      setIsAgentSpeaking(true);
      setTimeout(() => setIsAgentSpeaking(false), 5000);
    }
  };

  const triggerAgentResponse = (mood) => {
    setIsAgentSpeaking(true);
    
    const comfortMessages = {
      "😊": "I'm so happy to see you feeling good today! Your joy brightens up our conversations.",
      "😔": "I notice you're feeling down. Remember, it's okay to not be okay. I'm here to listen.",
      "😌": "That peaceful state of mind suits you well. Let's maintain this calm energy together.",
      "😤": "I can sense your frustration. Would you like to talk about what's bothering you?",
      "🥰": "It warms my heart to see you feeling loved. You deserve all the love in the world!",
      "😴": "Feeling tired is natural. Maybe we can focus on some relaxing activities together."
    };

    const message = comfortMessages[mood] || "I'm here to support you, no matter how you're feeling.";
    setAgentMessage(message);
    setTimeout(() => setIsAgentSpeaking(false), 5000);
  };

  const handleDrop = (e, day) => {
    e.preventDefault();
    const emoji = e.dataTransfer.getData('emoji');
    setWeekMoods(prev => ({
      ...prev,
      [day]: emoji
    }));
    
    if (emoji === '😔') {
      recommendAndPlayMusic(emoji);
    } else {
      triggerAgentResponse(emoji);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJournalChange = (e) => {
    const text = e.target.value;
    setCurrentJournal(text);
    
    // Check for concerning words in the text
    const emergencyWords = ['suicide', 'kill myself', 'end it all', 'give up', "can't take it", 'depression', 'depressed'];
    const hasEmergencyWords = emergencyWords.some(word => text.toLowerCase().includes(word));
    
    if (hasEmergencyWords) {
      setIsEmergencyContactsVisible(true);
      setAgentMessage("I'm very concerned about what you're saying. Please know that you're not alone. Here are some people who care about you and are ready to help. Would you like to reach out to someone?");
      setIsAgentSpeaking(true);
    }
  };

  const handleEmergencyCall = (contact) => {
    setSelectedContact(contact);
    setShowConfirmation(true);
  };

  const initiateCall = () => {
    if (selectedContact) {
      if (selectedContact.facetime) {
        // Use FaceTime Audio for contacts with FaceTime
        window.location.href = `facetime-audio://${selectedContact.facetime}`;
      } else {
        // Fall back to regular phone call for other contacts
        const cleanNumber = selectedContact.number.replace(/[^0-9]/g, '');
        window.location.href = `tel:${cleanNumber}`;
      }
      setShowConfirmation(false);
      setSelectedContact(null);
    }
  };

  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: 'url(https://i.imgur.com/qmi9Jcw.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Header with logo */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 2
      }}>
        <img 
          src="https://i.imgur.com/gmHTE3o.png" 
          alt="Solace Logo" 
          style={{ 
            height: '50px',
            objectFit: 'contain',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => window.location.href = '/'}
        />
      </div>

      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <Spline
          scene="https://prod.spline.design/GaMQ4Yii7PdYXTAq/scene.splinecode"
          onMouseDown={(e) => {
            if (e.target.name === 'Agent') {
              setIsAgentSpeaking(true);
              setAgentMessage("Hi there! I'm here to help you track your moods and find the perfect music for your emotions. How are you feeling today?");
              setTimeout(() => setIsAgentSpeaking(false), 5000);
            }
          }}
        />
      </div>

      {/* Mood Tracker */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '40px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '15px',
        width: '300px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Mood Tracker</h2>
          <button
            onClick={() => setIsMoodPickerOpen(!isMoodPickerOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#4a7c59',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            {isMoodPickerOpen ? '✕' : '🎨'}
          </button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          {Object.entries(weekMoods).map(([day, mood]) => (
            <div
              key={day}
              onDrop={(e) => handleDrop(e, day)}
              onDragOver={handleDragOver}
              style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                background: mood ? 'rgba(74, 124, 89, 0.1)' : '#f5f5f5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#333',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '12px', marginBottom: '2px' }}>{day}</div>
              <div style={{ fontSize: '16px' }}>{mood}</div>
            </div>
          ))}
        </div>

        {isMoodPickerOpen && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            padding: '15px',
            background: '#f5f5f5',
            borderRadius: '10px'
          }}>
            {Object.entries(moods).map(([emoji, mood]) => (
              <div
                key={emoji}
                draggable
                onDragStart={(e) => handleDragStart(e, emoji)}
                style={{
                  fontSize: '24px',
                  cursor: 'grab',
                  textAlign: 'center',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'transform 0.2s ease',
                  ':hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#333' }}>Today's Journal</h3>
          <textarea
            placeholder="How are you feeling today?"
            value={currentJournal}
            onChange={handleJournalChange}
            style={{
              width: '100%',
              height: '100px',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              resize: 'none',
              fontSize: '14px',
              marginBottom: '15px'
            }}
          />
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div 
              onClick={() => document.getElementById('imageUpload').click()}
              style={{
                width: '120px',
                background: '#fff',
                padding: '10px 10px 30px 10px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: 'rotate(-3deg)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                ':hover': {
                  transform: 'rotate(-3deg) scale(1.02)'
                }
              }}
            >
              <div style={{
                width: '100px',
                height: '100px',
                background: selectedImage ? `url(${selectedImage})` : '#f5f5f5',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
              }}>
                {!selectedImage && (
                  <div style={{
                    color: '#999',
                    fontSize: '24px'
                  }}>+</div>
                )}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                Add a happy moment
              </div>
            </div>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <div style={{ flex: 1, marginTop: '20px' }}>
              <button
                style={{
                  background: '#4a7c59',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  width: '100%',
                  fontWeight: '500',
                  boxShadow: '0 2px 8px rgba(74, 124, 89, 0.2)',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(74, 124, 89, 0.3)'
                  }
                }}
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Message */}
      {isAgentSpeaking && (
        <div style={{
          position: 'fixed',
          left: '50%',
          top: '30%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '15px 20px',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '300px',
          zIndex: 10,
          color: '#333',
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          {agentMessage}
        </div>
      )}

      {/* Modified Music Player */}
      <div style={{
        position: 'fixed',
        bottom: '40px',
        right: '40px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '15px',
        width: '300px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        zIndex: 900
      }}>
        {!spotifyToken ? (
          <div style={{ textAlign: 'center' }}>
            {spotifyError && (
              <div style={{
                color: '#e55',
                fontSize: '12px',
                marginBottom: '10px'
              }}>
                {spotifyError === 'invalid_client' ? 
                  'Please set up Spotify Client ID in the code' : 
                  `Error connecting to Spotify: ${spotifyError}`}
              </div>
            )}
            <button
              onClick={() => {
                if (SPOTIFY_CLIENT_ID === 'YOUR_SPOTIFY_CLIENT_ID') {
                  setSpotifyError('Please set up Spotify Client ID first');
                  return;
                }
                window.location.href = SPOTIFY_AUTH_URL;
              }}
              style={{
                background: '#1DB954',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '10px 20px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                transition: 'all 0.2s ease'
              }}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png" 
                alt="Spotify"
                style={{ width: '20px', height: '20px' }}
              />
              Connect Spotify
            </button>
          </div>
        ) : (
          <>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <div style={{ 
                display: 'flex', 
                gap: '10px'
              }}>
                <button
                  onClick={() => setIsSpotifyMode(false)}
                  style={{
                    background: !isSpotifyMode ? '#4a7c59' : 'transparent',
                    color: !isSpotifyMode ? 'white' : '#666',
                    border: '1px solid #4a7c59',
                    borderRadius: '15px',
                    padding: '5px 10px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Solace
                </button>
                <button
                  onClick={() => setIsSpotifyMode(true)}
                  style={{
                    background: isSpotifyMode ? '#1DB954' : 'transparent',
                    color: isSpotifyMode ? 'white' : '#666',
                    border: '1px solid #1DB954',
                    borderRadius: '15px',
                    padding: '5px 10px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Spotify
                </button>
              </div>
            </div>

            {isSpotifyMode ? (
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <img 
                    src={currentTrack.artwork} 
                    alt="Album Art" 
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '10px',
                      objectFit: 'cover'
                    }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      color: '#333',
                      marginBottom: '4px'
                    }}>
                      {currentTrack.title}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#666' 
                    }}>
                      {currentTrack.artist}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  maxHeight: '200px', 
                  overflowY: 'auto',
                  marginTop: '10px',
                  padding: '5px'
                }}>
                  {likedSongs.map((song, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (spotifyPlayer) {
                          spotifyPlayer.play({ uris: [song.uri] });
                          setCurrentTrack(song);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        ':hover': {
                          background: 'rgba(74, 124, 89, 0.1)'
                        }
                      }}
                    >
                      <img 
                        src={song.artwork} 
                        alt={song.title}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '6px'
                        }}
                      />
                      <div>
                        <div style={{ 
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#333'
                        }}>
                          {song.title}
                        </div>
                        <div style={{ 
                          fontSize: '12px',
                          color: '#666'
                        }}>
                          {song.artist}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Original Solace player content
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={currentTrack.artwork} alt="Album Art" style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '10px',
                  objectFit: 'cover'
                }} />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{currentTrack.title}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{currentTrack.artist}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                  <button onClick={togglePlay} style={{
                    background: 'none',
                    border: 'none',
                    color: '#4a7c59',
                    cursor: 'pointer',
                    fontSize: '24px'
                  }}>
                    {isPlaying ? '⏸️' : '▶️'}
                  </button>
                  <button onClick={playNext} style={{
                    background: 'none',
                    border: 'none',
                    color: '#4a7c59',
                    cursor: 'pointer',
                    fontSize: '24px'
                  }}>
                    ⏭️
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {!isSpotifyMode && (
          <iframe
            ref={iframeRef}
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={currentTrack.soundCloudUrl}
            style={{ display: 'none' }}
          />
        )}
      </div>

      {/* Emergency Contacts */}
      {isEmergencyContactsVisible && (
        <div style={{
          position: 'fixed',
          top: '100px',
          left: '40px',
          background: 'rgba(255, 255, 255, 0.98)',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15)',
          width: '320px',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              margin: 0,
              color: '#333',
              fontSize: '18px'
            }}>
              Here for You
            </h3>
            <button
              onClick={() => setIsEmergencyContactsVisible(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              ✕
            </button>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: 'rgba(74, 124, 89, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(74, 124, 89, 0.1)',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4a7c59 0%, #5b9c6f 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(74, 124, 89, 0.2)',
                }}>
                  {contact.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {contact.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    <span style={{ color: '#4a7c59', fontWeight: '500' }}>{contact.number}</span>
                    <span style={{ color: '#999' }}>•</span>
                    <span>{contact.description}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleEmergencyCall(contact)}
                  style={{
                    background: '#4a7c59',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    ':hover': {
                      background: '#3a6249'
                    }
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📱</span>
                  Call
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && selectedContact && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '15px',
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h4 style={{ 
              margin: '0 0 15px 0',
              color: '#333',
              fontSize: '18px'
            }}>
              Start FaceTime Audio Call?
            </h4>
            <p style={{
              margin: '0 0 20px 0',
              color: '#666',
              fontSize: '14px'
            }}>
              Would you like to call {selectedContact.name} via FaceTime Audio?
            </p>
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowConfirmation(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  ':hover': {
                    background: '#f5f5f5'
                  }
                }}
              >
                Cancel
              </button>
              <button
                onClick={initiateCall}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#4a7c59',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  ':hover': {
                    background: '#3a6249'
                  }
                }}
              >
                Call Now
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 
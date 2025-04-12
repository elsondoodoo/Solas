import React, { useState, useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

export default function Home() {
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isMoodPickerOpen, setIsMoodPickerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const widgetRef = useRef(null);
  const iframeRef = useRef(null);

  const [currentTrack, setCurrentTrack] = useState({
    title: 'Safe With Me',
    artist: 'Gryffin, Audrey Mika',
    artwork: 'https://i.imgur.com/bFIvfe2.png',
    soundCloudUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/931781749'
  });

  const [playlist, setPlaylist] = useState([
    {
      title: 'Safe With Me',
      artist: 'Gryffin, Audrey Mika',
      artwork: 'https://i.imgur.com/bFIvfe2.png',
      soundCloudUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/931781749'
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

  const [displayedText1, setDisplayedText1] = useState('');
  const [displayedText2, setDisplayedText2] = useState('');
  const [displayedText3, setDisplayedText3] = useState('');

  // Add these new states near the top with other states
  const [journalEntries, setJournalEntries] = useState({});
  const [currentJournal, setCurrentJournal] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Add these new states at the top with other states
  const [agentMessage, setAgentMessage] = useState('');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const splineRef = useRef(null);

  useEffect(() => {
    // Load the SoundCloud Widget API
    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize the widget when the API is loaded
      if (iframeRef.current) {
        widgetRef.current = window.SC.Widget(iframeRef.current);
        
        // Add event listeners
        widgetRef.current.bind(window.SC.Widget.Events.FINISH, () => {
          setIsPlaying(false);
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const text1 = "Hey Kelly...";
    const text2 = "I'm Solace, your emotional companion.";
    const text3 = "It's time for your daily check-in.";
    
    let i = 0;
    const type1 = () => {
      if (i < text1.length) {
        setDisplayedText1(text1.slice(0, i + 1));
        i++;
        setTimeout(type1, 100);
      } else {
        i = 0;
        setTimeout(type2, 500);
      }
    };

    let j = 0;
    const type2 = () => {
      if (j < text2.length) {
        setDisplayedText2(text2.slice(0, j + 1));
        j++;
        setTimeout(type2, 50);
      } else {
        j = 0;
        setTimeout(type3, 500);
      }
    };

    let k = 0;
    const type3 = () => {
      if (k < text3.length) {
        setDisplayedText3(text3.slice(0, k + 1));
        k++;
        setTimeout(type3, 50);
      }
    };

    setTimeout(type1, 1000);
  }, []);

  const togglePlay = () => {
    if (!widgetRef.current) return;

    if (isPlaying) {
      widgetRef.current.pause();
    } else {
      widgetRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    // Find current track index
    const currentIndex = playlist.findIndex(
      track => track.soundCloudUrl === currentTrack.soundCloudUrl
    );
    
    // Play next track if available
    if (currentIndex < playlist.length - 1) {
      setCurrentTrack(playlist[currentIndex + 1]);
      setIsPlaying(true);
    }
  };

  // Handle drag start
  const handleDragStart = (e, emoji) => {
    e.dataTransfer.setData('emoji', emoji);
  };

  // Handle drop
  const handleDrop = (e, day) => {
    e.preventDefault();
    const emoji = e.dataTransfer.getData('emoji');
    setWeekMoods(prev => ({
      ...prev,
      [day]: emoji
    }));
    triggerAgentResponse(emoji);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Add this function before the return statement
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

  // Add this function after other functions
  const onSplineLoad = (splineApp) => {
    splineRef.current = splineApp;
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

    // Trigger Spline animation if available
    if (splineRef.current) {
      try {
        splineRef.current.emitEvent('mouseDown', 'Agent'); // Replace 'Agent' with your Spline object name
      } catch (e) {
        console.log('Animation trigger attempted');
      }
    }

    setAgentMessage('');
    let message = comfortMessages[mood] || "I'm here to support you, no matter how you're feeling.";
    let i = 0;
    
    const typeMessage = () => {
      if (i < message.length) {
        setAgentMessage(prev => prev + message.charAt(i));
        i++;
        setTimeout(typeMessage, 30);
      } else {
        setTimeout(() => setIsAgentSpeaking(false), 5000);
      }
    };

    typeMessage();
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      background: `url('https://i.imgur.com/qmi9Jcw.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 2,
        display: 'flex',
        justifyContent: 'space-between',
        width: 'calc(100% - 40px)'
      }}>
        <a href="/" style={{ fontSize: '24px', color: '#333', textDecoration: 'none' }}>Solace</a>
        <div style={{ 
          display: 'flex',
          alignItems: 'flex-start',
          gap: '20px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '800px',
            padding: '20px',
            marginTop: '40px',
            marginRight: '400px'
          }}>
            <div style={{
              fontSize: '2em',
              fontWeight: '600',
              color: '#ffffff',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '0.2px',
              lineHeight: '1',
              opacity: displayedText1 ? '1' : '0',
              transform: displayedText1 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              height: '50px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {displayedText1}
            </div>
            <div style={{
              fontSize: '2em',
              fontWeight: '600',
              color: '#ffffff',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '0.2px',
              lineHeight: '1',
              opacity: displayedText2 ? '1' : '0',
              transform: displayedText2 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              height: '50px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {displayedText2}
            </div>
            <div style={{
              fontSize: '2em',
              fontWeight: '600',
              color: '#ffffff',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '0.2px',
              lineHeight: '1',
              opacity: displayedText3 ? '1' : '0',
              transform: displayedText3 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              height: '50px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {displayedText3}
            </div>
          </div>
          <div style={{ cursor: 'pointer', fontSize: '24px' }}>⚙️</div>
        </div>
      </div>

      <main style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
        <Spline
          scene="https://prod.spline.design/GaMQ4Yii7PdYXTAq/scene.splinecode"
          onLoad={onSplineLoad}
        />
      </main>

      <div style={{
        position: 'absolute',
        bottom: '40px',
        right: '40px',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxHeight: 'calc(100vh - 300px)',
        overflowY: 'auto'
      }}>
        {/* Music Player */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '25px',
          borderRadius: '20px',
          width: '340px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: isPlaylistOpen ? '20px' : '0' }}>
            <div 
              style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '8px',
                backgroundImage: `url(${currentTrack.artwork})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
            ></div>
            <div>
              <div style={{ fontWeight: '500' }}>{currentTrack.title}</div>
              <div style={{ color: '#666', fontSize: '0.9em' }}>{currentTrack.artist}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <button 
                onClick={togglePlay}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button 
                onClick={playNext}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >⏭️</button>
            </div>
          </div>

          {/* Playlist Dropdown */}
          {isPlaylistOpen && (
            <div style={{
              borderTop: '1px solid rgba(0,0,0,0.1)',
              paddingTop: '20px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '10px',
                alignItems: 'center'
              }}>
                <h3 style={{ margin: 0, fontSize: '0.9em' }}>Your Playlist</h3>
                <button 
                  style={{
                    background: '#4a7c59',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: 'white',
                    fontSize: '0.8em',
                    cursor: 'pointer'
                  }}
                >Add Song</button>
              </div>
              
              {/* Playlist Items */}
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {playlist.map((track, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 0',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(0,0,0,0.05)'
                    }}
                    onClick={() => setCurrentTrack(track)}
                  >
                    <img 
                      src={track.artwork} 
                      alt={track.title}
                      style={{ width: '30px', height: '30px', borderRadius: '4px' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.9em' }}>{track.title}</div>
                      <div style={{ fontSize: '0.8em', color: '#666' }}>{track.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Updated SoundCloud iframe with ref */}
          <iframe 
            ref={iframeRef}
            width="0" 
            height="0" 
            scrolling="no" 
            frameBorder="no" 
            allow="autoplay" 
            src={currentTrack.soundCloudUrl}
            style={{ display: 'none' }}
          />
        </div>

        {/* Mood Tracker */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '25px',
          paddingBottom: '35px',
          borderRadius: '20px',
          width: '340px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          marginBottom: '10px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ 
              fontWeight: '600',
              fontSize: '1.2em',
              color: '#2d3436'
            }}>
              Mood Tracker
            </div>
            <button 
              onClick={() => setIsMoodPickerOpen(!isMoodPickerOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '22px',
                padding: '8px 12px',
                transition: 'transform 0.2s ease',
                transform: isMoodPickerOpen ? 'rotate(90deg)' : 'none'
              }}
            >
              {isMoodPickerOpen ? '✕' : '🎨'}
            </button>
          </div>

          {/* Emoji Picker */}
          {isMoodPickerOpen && (
            <div style={{
              marginBottom: '20px',
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '15px',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.05)'
            }}>
              {Object.entries(moods).map(([emoji, mood]) => (
                <div
                  key={emoji}
                  draggable
                  onDragStart={(e) => handleDragStart(e, emoji)}
                  style={{
                    cursor: 'grab',
                    fontSize: '28px',
                    position: 'relative',
                    padding: '8px',
                    borderRadius: '12px',
                    transition: 'transform 0.2s ease, background 0.2s ease',
                    ':hover': {
                      transform: 'scale(1.1)',
                      background: 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                  title={mood}
                >
                  {emoji}
                </div>
              ))}
            </div>
          )}

          {/* Week Days */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '10px 5px'
          }}>
            {Object.entries(weekMoods).map(([day, mood], i) => (
              <div 
                key={i}
                onDrop={(e) => handleDrop(e, day)}
                onDragOver={handleDragOver}
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '50%', 
                  background: mood ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: mood ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                  transform: mood ? 'translateY(-2px)' : 'none'
                }}
              >
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '2px',
                  letterSpacing: '0.5px'
                }}>{day}</div>
                <div style={{ 
                  fontSize: mood ? '20px' : '16px',
                  transition: 'all 0.2s ease',
                  transform: mood ? 'scale(1.1)' : 'scale(1)'
                }}>{mood}</div>
              </div>
            ))}
          </div>

          {/* Journal Section */}
          <div style={{
            marginTop: '20px',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            paddingTop: '20px'
          }}>
            <div style={{
              fontSize: '1.1em',
              fontWeight: '500',
              marginBottom: '15px',
              color: '#2d3436'
            }}>
              Today's Journal
            </div>
            
            <div style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'flex-start'
            }}>
              {/* Journal Input */}
              <div style={{ flex: 1 }}>
                <textarea
                  placeholder="How are you feeling today?"
                  value={currentJournal}
                  onChange={(e) => setCurrentJournal(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    background: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9em',
                    lineHeight: '1.5',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Polaroid Image Section */}
              <div style={{
                width: '140px',
                background: '#fff',
                padding: '10px 10px 30px 10px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: 'rotate(2deg)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  background: selectedImage ? `url(${selectedImage})` : '#f0f0f0',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('imageUpload').click()}
                >
                  {!selectedImage && (
                    <div style={{
                      color: '#666',
                      fontSize: '2em',
                      opacity: 0.5
                    }}>+</div>
                  )}
                </div>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <div style={{
                  fontSize: '0.8em',
                  color: '#666',
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}>
                  {selectedImage ? 'Click to change' : 'Add a happy moment'}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={() => {
                setJournalEntries(prev => ({
                  ...prev,
                  [new Date().toISOString()]: {
                    text: currentJournal,
                    image: selectedImage
                  }
                }));
                setCurrentJournal('');
                setSelectedImage(null);
              }}
              style={{
                marginTop: '15px',
                background: '#4a7c59',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.9em',
                fontWeight: '500',
                transition: 'background 0.2s ease',
                ':hover': {
                  background: '#3d6548'
                }
              }}
            >
              Save Entry
            </button>
          </div>
        </div>
      </div>

      {isAgentSpeaking && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '30%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '20px 30px',
          borderRadius: '20px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          zIndex: 3,
          animation: 'fadeIn 0.3s ease-out',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{
            fontSize: '1.1em',
            lineHeight: '1.4',
            color: '#2d3436',
            textAlign: 'center',
            fontFamily: "'Inter', sans-serif",
          }}>
            {agentMessage}
          </div>
        </div>
      )}
    </div>
  );
} 
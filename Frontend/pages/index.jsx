import React, { useState, useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { useRouter } from 'next/router';

export default function Home() {
  const [agentMessage, setAgentMessage] = useState('');
  const [journalText, setJournalText] = useState('');
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [songDuration, setSongDuration] = useState(204); // 3:24 in seconds
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('onboarding');
  const [selectedEmojis, setSelectedEmojis] = useState({
    S: null,
    M: null,
    T: null,
    W: null,
    F: null
  });
  
  // References to Spline
  const splineRef = useRef();
  
  // Reference for the SoundCloud iframe
  const soundCloudRef = useRef(null);
  
  // Trigger words that will show emergency contacts
  const triggerWords = ['sad', 'depressed', 'depression', 'suicide', 'suicidal', 'kill myself', 'end my life', 'hopeless'];
  
  // Breakup related words
  const breakupWords = ['breakup', 'break up', 'broke up', 'breaking up', 'left me', 'ex', 'heartbreak', 'dumped'];
  
  // Check journal text for trigger words
  useEffect(() => {
    const words = journalText.toLowerCase().split(/\s+/);
    const hasTriggerWord = words.some(word => 
      triggerWords.some(trigger => word.includes(trigger))
    );
    
    const hasBreakupWord = words.some(word => 
      breakupWords.some(trigger => word.includes(trigger))
    );
    
    if (hasTriggerWord && journalText.length > 0) {
      setShowEmergencyContacts(true);
    }
    
    if (hasBreakupWord && journalText.length > 0) {
      setShowMusicPlayer(true);
      setAgentMessage("I know you're going through a tough time. Music can help heal. Here's a recommended song for you.");
    }
  }, [journalText]);
  
  // Handle when Spline loads
  const onSplineLoad = (spline) => {
    splineRef.current = spline;
  };
  
  // Handle emoji drop onto a day
  const handleEmojiDrop = (day, emojiType) => {
    // Update the selected emoji for the day
    setSelectedEmojis({
      ...selectedEmojis,
      [day]: emojiType
    });
    
    // Set the agent message based on the emoji type
    switch(emojiType) {
      case 'happy':
        setAgentMessage("I'm glad you're feeling happy today!");
        break;
      case 'sad':
        setAgentMessage("I'm sorry you're feeling down. Is there something I can help with?");
        break;
      case 'stressed':
        setAgentMessage("It sounds like you're under a lot of stress. Try taking some deep breaths.");
        break;
      case 'angry':
        setAgentMessage("I see you're feeling frustrated. It's okay to feel that way.");
        break;
      case 'love':
        setAgentMessage("That's wonderful! Cherish those positive feelings.");
        break;
      case 'sleepy':
        setAgentMessage("Feeling tired? Make sure you're getting enough rest.");
        break;
      default:
        setAgentMessage("");
    }
    
    // Here you would add code to trigger animations or actions in your Spline object
    // For example: splineRef.current.emitEvent('mouseDown', 'agent');
  };
  
  // Make emoji draggable
  const onDragStart = (e, emojiType) => {
    e.dataTransfer.setData('emojiType', emojiType);
    // Add a visual indicator of dragging
    if (e.target.style) {
      e.target.style.opacity = '0.5';
    }
  };
  
  const onDragEnd = (e) => {
    // Reset visual indicator
    if (e.target.style) {
      e.target.style.opacity = '1';
    }
  };
  
  // Handle drop on day circle
  const onDrop = (e, day) => {
    e.preventDefault();
    const emojiType = e.dataTransfer.getData('emojiType');
    if (emojiType) {
      handleEmojiDrop(day, emojiType);
    }
  };
  
  const onDragOver = (e) => {
    e.preventDefault();
    // Add visual indicator for valid drop target
    if (e.target.style) {
      e.target.style.background = '#e9f5ec';
    }
  };
  
  const onDragLeave = (e) => {
    // Reset visual indicator
    if (e.target.style) {
      e.target.style.background = '#f5f5f5';
    }
  };

  // Handle manual selection for touch devices
  const handleEmojiSelect = (emojiType) => {
    const selectedDay = prompt("Which day do you want to set this mood for? (S, M, T, W, F)");
    if (selectedDay && ['S', 'M', 'T', 'W', 'F'].includes(selectedDay.toUpperCase())) {
      handleEmojiDrop(selectedDay.toUpperCase(), emojiType);
    }
  };
  
  // Create an Emoji component for rendering
  const Emoji = ({ type, label }) => {
    const emojiMap = {
      'happy': '😊',
      'relaxed': '😌',
      'sleepy': '😴',
      'angry': '😤',
      'love': '🥰',
      'sad': '😔'
    };
    
    return (
      <div 
        draggable 
        onDragStart={(e) => onDragStart(e, type)}
        onDragEnd={onDragEnd}
        onClick={() => handleEmojiSelect(type)}
        style={{ 
          fontSize: '28px', 
          cursor: 'grab',
          display: 'inline-block',
          margin: '10px',
          userSelect: 'none'
        }}
        title={label}
      >
        {emojiMap[type]}
      </div>
    );
  };
  
  // Contact component for emergency contacts
  const Contact = ({ icon, name, info, onCall }) => {
  return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px',
        background: '#f9f9f9',
        borderRadius: '12px',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: '#5b7d61',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            {icon}
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{name}</div>
            <div style={{ fontSize: '12px', color: '#777' }}>{info}</div>
          </div>
        </div>
        <button 
          onClick={onCall}
          style={{
            background: '#5b7d61',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span style={{ fontSize: '14px' }}>📱</span> Call
        </button>
      </div>
    );
  };

  // Toggle emoji selector visibility
  const toggleEmojiSelector = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const router = useRouter();

  // Function to toggle play/pause
  const togglePlayPause = () => {
    if (soundCloudRef.current) {
      if (isPlaying) {
        soundCloudRef.current.contentWindow.postMessage(JSON.stringify({ method: 'pause' }), '*');
      } else {
        soundCloudRef.current.contentWindow.postMessage(JSON.stringify({ method: 'play' }), '*');
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Load SoundCloud Widget API and setup event listeners when the music player is shown
  useEffect(() => {
    if (showMusicPlayer) {
      // Add SoundCloud Widget API script
      const script = document.createElement('script');
      script.src = 'https://w.soundcloud.com/player/api.js';
      script.async = true;
      document.body.appendChild(script);
      
      // Setup message listener for SoundCloud iframe events
      const handleSoundCloudMessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.soundcloud) {
            if (data.soundcloud.event === 'play') {
              setIsPlaying(true);
            } else if (data.soundcloud.event === 'pause') {
              setIsPlaying(false);
            } else if (data.soundcloud.event === 'playProgress') {
              setSongProgress(Math.floor(data.soundcloud.currentPosition / 1000));
            } else if (data.soundcloud.event === 'loadProgress') {
              if (data.soundcloud.duration) {
                setSongDuration(Math.floor(data.soundcloud.duration / 1000));
              }
            }
          }
        } catch (e) {
          // Not a JSON message or not from SoundCloud
        }
      };
      
      window.addEventListener('message', handleSoundCloudMessage);
      
      return () => {
        window.removeEventListener('message', handleSoundCloudMessage);
      };
    }
  }, [showMusicPlayer]);

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <Spline
        scene="https://prod.spline.design/PwDsQ4vGJzfXnO8U/scene.splinecode"
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        onLoad={onSplineLoad}
      />
      
      {/* Sidebar Toggle Button */}
      <button 
        onClick={toggleSidebar} 
        style={{
          position: 'fixed',
          top: '20px',
          left: sidebarOpen ? '280px' : '20px',
          zIndex: 150,
          background: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          transition: 'left 0.3s ease'
        }}
      >
        {sidebarOpen ? '✕' : '≡'}
      </button>
      
      {/* Left Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? 0 : '-350px',
        width: '350px',
        height: '100vh',
        background: 'white',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        zIndex: 140,
        transition: 'left 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Sidebar Header */}
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '500' }}>Solace</h2>
          <div style={{ 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e66465, #9198e5)'
          }}></div>
        </div>
        
        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #eee'
        }}>
          <button 
            onClick={() => setActiveTab('onboarding')} 
            style={{
              flex: 1,
              padding: '15px',
              background: activeTab === 'onboarding' ? '#f5f5f5' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'onboarding' ? '2px solid #5b7d61' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'onboarding' ? '500' : 'normal'
            }}
          >
            Onboarding
          </button>
          <button 
            onClick={() => setActiveTab('marketplace')} 
            style={{
              flex: 1,
              padding: '15px',
              background: activeTab === 'marketplace' ? '#f5f5f5' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'marketplace' ? '2px solid #5b7d61' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'marketplace' ? '500' : 'normal'
            }}
          >
            Marketplace
          </button>
        </div>
        
        {/* Tab Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {activeTab === 'onboarding' ? (
            <div>
              <h3 style={{ fontSize: '18px', marginTop: 0 }}>Welcome to Solace</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#555' }}>
                Your personal AI companion for emotional wellness and support.
              </p>
              
              <div style={{ 
                marginTop: '20px',
                background: '#f9f9f9',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <h4 style={{ fontSize: '16px', marginTop: 0 }}>Getting Started</h4>
                <ul style={{ 
                  paddingLeft: '20px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: '#555'
                }}>
                  <li>Use the mood tracker to record your daily emotions</li>
                  <li>Journal your thoughts and feelings</li>
                  <li>Interact with your Solace companion</li>
                  <li>Listen to mood-enhancing music</li>
                </ul>
              </div>
              
              <div style={{ 
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <button 
                  onClick={() => router.push('/onboarding/welcome')}
                  style={{
                    background: '#5b7d61',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Complete Your Profile
                </button>
                <button style={{
                  background: 'transparent',
                  color: '#5b7d61',
                  border: '1px solid #5b7d61',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => router.push('/wellness-quiz')}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(91, 125, 97, 0.05)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Take the Wellness Quiz
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '18px', marginTop: 0 }}>Mood Marketplace</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#555' }}>
                Discover and collect moods and wellness tools.
              </p>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '15px',
                marginTop: '20px'
              }}>
                <div 
                  className="marketplace-item"
                  style={{
                    background: 'linear-gradient(135deg, #c2e59c, #64b3f4)',
                    borderRadius: '8px',
                    padding: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    aspectRatio: '1/1',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>🧘</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>Calm Kit</div>
                  <div style={{ fontSize: '12px', marginTop: '5px', opacity: '0.9' }}>200 pts</div>
                  <div 
                    className="item-description" 
                    style={{ 
                      position: 'absolute', 
                      bottom: '-100%', 
                      left: 0, 
                      right: 0, 
                      background: 'rgba(0,0,0,0.7)', 
                      color: 'white', 
                      padding: '10px',
                      transition: 'bottom 0.3s ease',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}
                  >
                    Guided meditation and breathing exercises for instant calm
                  </div>
                </div>
                
                <div 
                  className="marketplace-item"
                  style={{
                    background: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
                    borderRadius: '8px',
                    padding: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    aspectRatio: '1/1',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                    e.currentTarget.querySelector('.item-description').style.bottom = '0';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    e.currentTarget.querySelector('.item-description').style.bottom = '-100%';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎵</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>Music Therapy</div>
                  <div style={{ fontSize: '12px', marginTop: '5px', opacity: '0.9' }}>150 pts</div>
                  <div 
                    className="item-description" 
                    style={{ 
                      position: 'absolute', 
                      bottom: '-100%', 
                      left: 0, 
                      right: 0, 
                      background: 'rgba(0,0,0,0.7)', 
                      color: 'white', 
                      padding: '10px',
                      transition: 'bottom 0.3s ease',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}
                  >
                    Curated playlists to boost your mood and reduce anxiety
                  </div>
                </div>
                
                <div 
                  className="marketplace-item"
                  style={{
                    background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
                    borderRadius: '8px',
                    padding: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    aspectRatio: '1/1',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                    e.currentTarget.querySelector('.item-description').style.bottom = '0';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    e.currentTarget.querySelector('.item-description').style.bottom = '-100%';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>😴</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>Sleep Aid</div>
                  <div style={{ fontSize: '12px', marginTop: '5px', opacity: '0.9' }}>180 pts</div>
                  <div 
                    className="item-description" 
                    style={{ 
                      position: 'absolute', 
                      bottom: '-100%', 
                      left: 0, 
                      right: 0, 
                      background: 'rgba(0,0,0,0.7)', 
                      color: 'white', 
                      padding: '10px',
                      transition: 'bottom 0.3s ease',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}
                  >
                    Soothing sounds and bedtime stories for better sleep
                  </div>
                </div>
                
                <div 
                  className="marketplace-item"
                  style={{
                    background: 'linear-gradient(135deg, #f6d365, #fda085)',
                    borderRadius: '8px',
                    padding: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    aspectRatio: '1/1',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                    e.currentTarget.querySelector('.item-description').style.bottom = '0';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    e.currentTarget.querySelector('.item-description').style.bottom = '-100%';
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏃</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>Energy Boost</div>
                  <div style={{ fontSize: '12px', marginTop: '5px', opacity: '0.9' }}>220 pts</div>
                  <div 
                    className="item-description" 
                    style={{ 
                      position: 'absolute', 
                      bottom: '-100%', 
                      left: 0, 
                      right: 0, 
                      background: 'rgba(0,0,0,0.7)', 
                      color: 'white', 
                      padding: '10px',
                      transition: 'bottom 0.3s ease',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}
                  >
                    Quick exercises and motivation to boost your energy levels
                  </div>
                </div>
              </div>
              
              <div style={{ 
                marginTop: '20px',
                background: '#f5f5f5',
                padding: '15px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>Your Mood Points</div>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: '#5b7d61' }}>350</div>
                </div>
                <button style={{
                  background: '#5b7d61',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#4a6b50'}
                onMouseOut={(e) => e.currentTarget.style.background = '#5b7d61'}
                >
                  Redeem
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Persistent Record Player */}
      <div style={{
        position: 'fixed',
        bottom: '15px',
        right: '15px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: '#1a1a1a',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        overflow: 'hidden'
      }} onClick={() => setShowMusicPlayer(!showMusicPlayer)}>
        {/* Record Player Animation */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: showMusicPlayer 
            ? `url("https://i.imgur.com/PzYsC9K.png") center/cover` 
            : '#333',
          boxShadow: 'inset 0 0 0 8px rgba(255,255,255,0.1), inset 0 0 0 12px rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: showMusicPlayer ? 'spin 4s linear infinite' : 'none'
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#ddd',
            boxShadow: '0 0 3px rgba(0,0,0,0.4)'
          }}></div>
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
      
      {/* Instruction text */}
      <div style={{
        position: 'fixed',
        bottom: '100px',
        width: '100%',
        textAlign: 'center',
        zIndex: 50,
        pointerEvents: 'none'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '10px 20px',
          borderRadius: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          color: '#666',
          fontSize: '14px',
          backdropFilter: 'blur(4px)'
        }}>
          please hold option to interact with solace
        </div>
      </div>
      
      {/* Emergency Contacts Modal */}
      {showEmergencyContacts && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '25px',
            maxWidth: '450px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Here for You</h2>
              <button 
                onClick={() => setShowEmergencyContacts(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <Contact 
              icon="🆘" 
              name="Crisis Lifeline" 
              info="988 • 24/7 Crisis Support" 
              onCall={() => window.open('tel:988')}
            />
            
            <Contact 
              icon="👩" 
              name="Kelly" 
              info="kellyzhiying@hotmail.com • Available now" 
              onCall={() => window.open('facetime:kellyzhiying@hotmail.com')}
            />
            
            <Contact 
              icon="🤗" 
              name="Best Friend" 
              info="+17785808718 • Available evenings" 
              onCall={() => window.open('tel:+17785808718')}
            />
            
            <Contact 
              icon="🧠" 
              name="Therapist" 
              info="(555) 234-5678 • Available Mon-Fri" 
              onCall={() => window.open('tel:5552345678')}
            />
          </div>
        </div>
      )}
      
      {/* Music Player */}
      {showMusicPlayer && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          padding: '16px',
          width: '420px',
          maxWidth: '95%',
          zIndex: 110,
          overflow: 'hidden'
        }}>
          {/* Hidden SoundCloud iframe for audio playback */}
          <iframe 
            ref={soundCloudRef}
            width="100%" 
            height="0" 
            scrolling="no" 
            frameBorder="no" 
            allow="autoplay" 
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/931781749&color=%235b7d61&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&buying=false&sharing=false&download=false&show_playcount=false"
            style={{ display: 'none' }}
          ></iframe>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div 
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '8px',
                backgroundImage: 'url("https://i.imgur.com/PzYsC9K.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0
              }}
            ></div>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Safe With Me</div>
              <div style={{ fontSize: '12px', color: '#777' }}>Gryffin, Audrey Mika</div>
              
              <div style={{ 
                width: '100%', 
                height: '4px', 
                background: '#eee', 
                borderRadius: '2px',
                marginTop: '8px',
                position: 'relative'
              }}>
                <div style={{ 
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${(songProgress / songDuration) * 100}%`,
                  background: '#5b7d61',
                  borderRadius: '2px',
                  transition: 'width 0.5s'
                }}></div>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '10px', 
                color: '#999',
                marginTop: '4px'
              }}>
                <span>{Math.floor(songProgress / 60)}:{String(songProgress % 60).padStart(2, '0')}</span>
                <span>{Math.floor(songDuration / 60)}:{String(songDuration % 60).padStart(2, '0')}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                onClick={togglePlayPause}
                style={{
                  background: '#5b7d61',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '16px'
                }}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
            </div>
            
            <button 
              onClick={() => setShowMusicPlayer(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#999',
                padding: '5px'
              }}
            >×</button>
          </div>
        </div>
      )}
      
      {/* Speech bubble for agent messages */}
      {agentMessage && (
        <div style={{
          position: 'absolute',
          left: '30%',
          top: '30%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '15px',
          borderRadius: '16px',
          maxWidth: '250px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          zIndex: 10
        }}>
          <p>{agentMessage}</p>
        </div>
      )}
      
      {/* Mood Tracker Card */}
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        right: '30px',
        transform: 'translateY(-50%)',
        background: 'white',
        padding: '25px',
        borderRadius: '16px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: '300px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Mood Tracker</h1>
          <div style={{ 
            width: '25px', 
            height: '25px', 
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e66465, #9198e5)'
          }}></div>
        </div>
        
        {/* Day Circles with Emojis */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          marginBottom: '20px',
        }}>
          {['S', 'M', 'T', 'W', 'F'].map((day, i) => (
            <div 
              key={i} 
              onDrop={(e) => onDrop(e, day)}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                color: '#333',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              {day}
              {selectedEmojis[day] && (
                <div style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  fontSize: '18px',
                  marginTop: '5px'
                }}>
                  {selectedEmojis[day] === 'happy' && '😊'}
                  {selectedEmojis[day] === 'relaxed' && '😌'}
                  {selectedEmojis[day] === 'sleepy' && '😴'}
                  {selectedEmojis[day] === 'angry' && '😤'}
                  {selectedEmojis[day] === 'love' && '🥰'}
                  {selectedEmojis[day] === 'sad' && '😔'}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Emoji Selector Toggle Button */}
        <button 
          onClick={toggleEmojiSelector}
          style={{
            width: '100%',
            padding: '8px',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#666'
          }}
        >
          {showEmojiSelector ? 'Hide Emojis' : 'Select Mood'} {showEmojiSelector ? '▲' : '▼'}
        </button>
        
        {/* Collapsible Emoji Selector */}
        {showEmojiSelector && (
          <div style={{ 
            marginBottom: '20px',
            padding: '12px',
            background: '#f5f5f5',
            borderRadius: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Emoji type="happy" label="Happy" />
            <Emoji type="relaxed" label="Relaxed" />
            <Emoji type="sleepy" label="Sleepy" />
            <Emoji type="angry" label="Angry" />
            <Emoji type="love" label="Love" />
            <Emoji type="sad" label="Sad" />
          </div>
        )}
        
        <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Today's Journal</h2>
        
        <textarea 
          placeholder="How are you feeling today?"
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          style={{
            width: '100%',
            height: '120px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #eee',
            resize: 'none',
            marginBottom: '15px',
            fontFamily: 'inherit',
            fontSize: '14px'
          }}
        ></textarea>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
          <div style={{ 
            flex: 1,
            textAlign: 'center',
            background: 'white',
            borderRadius: '4px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            padding: '10px 10px 28px 10px',
            transform: 'rotate(-2deg)',
            position: 'relative',
            border: '1px solid #f0f0f0'
          }}>
            <div style={{
              width: '100%',
              paddingBottom: '100%',
              background: '#f5f5f5',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24px',
                color: '#aaa'
              }}>
                +
              </div>
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#777',
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              Add a happy moment
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            <button style={{
              width: '100%',
              padding: '12px',
              background: '#5b7d61',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              cursor: 'pointer'
            }}>
              Save Entry
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 
import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function ArtistsPage() {
  const router = useRouter();
  const [artists, setArtists] = useState(['Justin Bieber']);
  const [newArtist, setNewArtist] = useState('');
  
  const addArtist = () => {
    if (newArtist.trim() !== '') {
      setArtists([...artists, newArtist]);
      setNewArtist('');
    }
  };
  
  const removeArtist = (index) => {
    const newArtists = [...artists];
    newArtists.splice(index, 1);
    setArtists(newArtists);
  };
  
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #f7f7f7, #e0e0e0)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '500px',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Header section with divider */}
        <div style={{
          marginBottom: '30px'
        }}>
          <div style={{
            width: '100%',
            height: '2px',
            background: '#e0e0e0',
            marginBottom: '20px'
          }}></div>
          
          <div style={{
            color: '#888',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '10px'
          }}>
            GETTING TO KNOW YOU
          </div>
        </div>
        
        {/* Main content */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '15px',
          color: '#333'
        }}>
          What are some of your favorite artists?
        </h2>
        
        <p style={{
          fontSize: '15px',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.5'
        }}>
          It helps us cheer you up with songs you love, if you're ever feeling down.
        </p>
        
        {/* Artist list */}
        <div style={{
          marginBottom: '20px'
        }}>
          {artists.map((artist, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #eee',
              paddingBottom: '10px',
              marginBottom: '15px'
            }}>
              <div style={{ fontSize: '16px' }}>{artist}</div>
              <button 
                onClick={() => removeArtist(index)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        {/* Add artist input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px dashed #ccc',
          borderRadius: '10px',
          padding: '10px 15px',
          marginBottom: '40px',
          cursor: 'text'
        }}
        onClick={() => document.getElementById('artistInput').focus()}
        >
          <input
            id="artistInput"
            type="text"
            value={newArtist}
            onChange={(e) => setNewArtist(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addArtist()}
            placeholder="Add another artist"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              color: '#333',
              background: 'transparent'
            }}
          />
          <button
            onClick={addArtist}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#5b7d61',
              fontSize: '22px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30px',
              height: '30px'
            }}
          >
            +
          </button>
        </div>
        
        {/* Navigation buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => router.push('/onboarding/welcome')}
            style={{
              padding: '12px 25px',
              background: 'transparent',
              border: '1px solid #ddd',
              borderRadius: '25px',
              fontSize: '15px',
              color: '#555',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f7f7f7';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Back
          </button>
          
          <button
            onClick={() => router.push('/onboarding/contact-schedule')}
            style={{
              padding: '12px 25px',
              background: 'linear-gradient(to right, #5b7d61, #80b5a8)',
              border: 'none',
              borderRadius: '25px',
              fontSize: '15px',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(91, 125, 97, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(91, 125, 97, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(91, 125, 97, 0.2)';
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
} 
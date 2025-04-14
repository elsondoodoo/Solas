import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function ConnectOmi() {
  const router = useRouter();
  const [connecting, setConnecting] = useState(false);
  
  const handleConnect = () => {
    setConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setConnecting(false);
      router.push('/profile');
    }, 2000);
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
          Connect your Omi
        </h2>
        
        <p style={{
          fontSize: '15px',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.5'
        }}>
          Stay connected with Solace wherever you are, with the help of Omi.
        </p>
        
        {/* Connection button */}
        <div 
          onClick={connecting ? null : handleConnect}
          style={{
            border: '1px dashed #ccc',
            borderRadius: '12px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '40px',
            cursor: connecting ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            background: connecting ? 'rgba(91, 125, 97, 0.05)' : 'transparent'
          }}
        >
          {connecting ? (
            <>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '3px solid rgba(91, 125, 97, 0.2)',
                borderTopColor: '#5b7d61',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ color: '#5b7d61', fontSize: '15px', fontWeight: '500' }}>Connecting...</span>
              <style jsx>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </>
          ) : (
            <>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(91, 125, 97, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4Z" stroke="#5b7d61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12V16" stroke="#5b7d61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="#5b7d61" strokeWidth="2"/>
                </svg>
              </div>
              <span style={{ color: '#5b7d61', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Connect Now</span>
            </>
          )}
        </div>
        
        {/* Navigation buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => router.push('/onboarding/contact-schedule')}
            style={{
              padding: '12px 25px',
              background: 'transparent',
              border: '1px solid #ddd',
              borderRadius: '25px',
              fontSize: '15px',
              color: '#555',
              cursor: connecting ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: connecting ? 0.6 : 1
            }}
            disabled={connecting}
            onMouseOver={(e) => {
              if (!connecting) e.currentTarget.style.background = '#f7f7f7';
            }}
            onMouseOut={(e) => {
              if (!connecting) e.currentTarget.style.background = 'transparent';
            }}
          >
            Back
          </button>
          
          <button
            onClick={() => router.push('/profile')}
            style={{
              padding: '12px 25px',
              background: 'linear-gradient(to right, #5b7d61, #80b5a8)',
              border: 'none',
              borderRadius: '25px',
              fontSize: '15px',
              color: 'white',
              cursor: connecting ? 'default' : 'pointer',
              boxShadow: '0 4px 10px rgba(91, 125, 97, 0.2)',
              transition: 'all 0.2s ease',
              opacity: connecting ? 0.6 : 1
            }}
            disabled={connecting}
            onMouseOver={(e) => {
              if (!connecting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(91, 125, 97, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (!connecting) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(91, 125, 97, 0.2)';
              }
            }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
} 
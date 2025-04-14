import React from 'react';
import { useRouter } from 'next/router';

export default function Welcome() {
  const router = useRouter();
  
  return (
    <div className="onboarding-container" style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #65a187, #80b5a8, #acc4c4)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Close button */}
      <button
        onClick={() => router.push('/')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.3)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: 'white',
          cursor: 'pointer',
          backdropFilter: 'blur(5px)'
        }}
      >
        ×
      </button>
      
      {/* Content container */}
      <div style={{
        width: '90%',
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Intro text */}
        <h2 style={{
          fontSize: '24px',
          marginBottom: '20px',
          fontWeight: '500',
          color: 'white'
        }}>
          Introducing
        </h2>
        
        {/* Logo/Name */}
        <h1 style={{
          fontSize: '64px',
          margin: '0 0 40px',
          fontWeight: '700',
          color: 'white',
          letterSpacing: '-1px'
        }}>
          Solace
        </h1>
        
        {/* Subtle description */}
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          marginBottom: '40px',
          color: 'white',
          maxWidth: '450px',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          Your personal wellness companion for mindful living, emotional balance, and healthier daily habits.
        </p>
        
        {/* Continue button */}
        <button 
          onClick={() => router.push('/onboarding/personal-details')}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L15 12L9 18" stroke="#5b7d61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        bottom: '-150px',
        left: '-100px',
        backdropFilter: 'blur(5px)'
      }}></div>
      
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        top: '-80px',
        right: '-80px',
        backdropFilter: 'blur(5px)'
      }}></div>
    </div>
  );
} 
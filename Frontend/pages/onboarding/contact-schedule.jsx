import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function ContactSchedule() {
  const router = useRouter();
  const [contactPreference, setContactPreference] = useState('daily');
  
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
          How often would you like Solace to contact you?
        </h2>
        
        <p style={{
          fontSize: '15px',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.5'
        }}>
          We're here when you need us — daily, weekly, or just once in a while. You can always change this later.
        </p>
        
        {/* Options */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginBottom: '40px'
        }}>
          {/* Daily option */}
          <div 
            onClick={() => setContactPreference('daily')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: '12px',
              border: contactPreference === 'daily' ? '2px solid #5b7d61' : '1px solid #e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: contactPreference === 'daily' ? 'rgba(91, 125, 97, 0.05)' : 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: contactPreference === 'daily' ? '6px solid #5b7d61' : '1px solid #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}></div>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: contactPreference === 'daily' ? '500' : 'normal',
                color: contactPreference === 'daily' ? '#333' : '#555'
              }}>
                Daily
              </span>
            </div>
            <span style={{ fontSize: '14px', color: '#888' }}>
              Light nudges + support
            </span>
          </div>
          
          {/* Weekly option */}
          <div 
            onClick={() => setContactPreference('weekly')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: '12px',
              border: contactPreference === 'weekly' ? '2px solid #5b7d61' : '1px solid #e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: contactPreference === 'weekly' ? 'rgba(91, 125, 97, 0.05)' : 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: contactPreference === 'weekly' ? '6px solid #5b7d61' : '1px solid #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}></div>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: contactPreference === 'weekly' ? '500' : 'normal',
                color: contactPreference === 'weekly' ? '#333' : '#555'
              }}>
                Weekly
              </span>
            </div>
            <span style={{ fontSize: '14px', color: '#888' }}>
              Occasional check-ins
            </span>
          </div>
          
          {/* On-demand option */}
          <div 
            onClick={() => setContactPreference('ondemand')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: '12px',
              border: contactPreference === 'ondemand' ? '2px solid #5b7d61' : '1px solid #e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: contactPreference === 'ondemand' ? 'rgba(91, 125, 97, 0.05)' : 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: contactPreference === 'ondemand' ? '6px solid #5b7d61' : '1px solid #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}></div>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: contactPreference === 'ondemand' ? '500' : 'normal',
                color: contactPreference === 'ondemand' ? '#333' : '#555'
              }}>
                Only when I reach out
              </span>
            </div>
            <span style={{ fontSize: '14px', color: '#888' }}>
              You control when
            </span>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => router.push('/onboarding/artists')}
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
            onClick={() => router.push('/onboarding/connect-omi')}
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
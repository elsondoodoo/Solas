import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function PersonalDetails() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    pronouns: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
          Tell us about yourself
        </h2>
        
        <p style={{
          fontSize: '15px',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.5'
        }}>
          We'll use this information to personalize your Solace experience.
        </p>
        
        {/* Form Fields */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#555'
            }}>
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '16px',
                outline: 'none',
                transition: 'border 0.2s ease'
              }}
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '20px' 
          }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#555'
              }}>
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Your age"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#555'
              }}>
                Pronouns
              </label>
              <input
                type="text"
                name="pronouns"
                value={formData.pronouns}
                onChange={handleInputChange}
                placeholder="e.g. she/her"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#555'
            }}>
              Emergency Contact Name
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              placeholder="Name of someone we can contact"
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#555'
            }}>
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleInputChange}
              placeholder="Their phone number"
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>
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
            onClick={() => router.push('/onboarding/artists')}
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
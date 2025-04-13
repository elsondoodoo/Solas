import React from 'react';
import Spline from '@splinetool/react-spline';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="header">
        <a href="/" className="logo">Solace</a>
        <div className="settings">⚙️</div>
      </div>

      <main className="spline-container">
        <Spline
          scene="https://prod.spline.design/GaMQ4Yii7PdYXTAq/scene.splinecode"
        />
      </main>

      <div className="ui-overlay">
        <div className="music-player">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '50px', height: '50px', background: '#4a7c59', borderRadius: '8px' }}></div>
            <div>
              <div>Song Title</div>
              <div style={{ color: '#666' }}>ARTIST NAME</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span style={{ marginRight: '10px' }}>▶️</span>
              <span>⏭️</span>
            </div>
          </div>
        </div>

        <div className="mood-tracker">
          <div style={{ marginBottom: '10px' }}>Mood tracker</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: '#ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}>
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 
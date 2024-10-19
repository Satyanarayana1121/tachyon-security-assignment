import React, { useState } from 'react';
import DeviceRegistrationView from './views/DeviceRegistrationView';
import DeviceAvailabilityView from './views/DeviceAvailabilityView';
import { handleDeviceRegistration, handleDeviceAvailabilityCheck } from './controllers/deviceController';
import './App.css';  // Import the CSS

function App() {
  const [result, setResult] = useState('');
  const [activeView, setActiveView] = useState('registration');  // Track active view

  return (
    <div className="app-container">
      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button
          className={`toggle-button ${activeView === 'registration' ? 'active' : ''}`}
          onClick={() => setActiveView('registration')}
        >
          Device Registration
        </button>
        <button
          className={`toggle-button ${activeView === 'availability' ? 'active' : ''}`}
          onClick={() => setActiveView('availability')}
        >
          Device Availability
        </button>
      </div>

      {/* Conditionally Render Forms */}
      {activeView === 'registration' ? (
        <DeviceRegistrationView onSubmit={(deviceData) => handleDeviceRegistration(deviceData, setResult)} />
      ) : (
        <DeviceAvailabilityView onSubmit={(deviceName, password) => handleDeviceAvailabilityCheck(deviceName, password, setResult)} />
      )}

      {/* Success/Result Message */}
      {result && <p className="result-message">{result}</p>}
    </div>
  );
}

export default App;

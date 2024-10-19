import React, { useState } from 'react';
import DeviceRegistrationView from './views/DeviceRegistrationView';
import DeviceAvailabilityView from './views/DeviceAvailabilityView';
import { handleDeviceRegistration, handleDeviceAvailabilityCheck } from './controllers/deviceController';
import './App.css';  // Import the CSS

function App() {
  const [result, setResult] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);  // Track if the result is success or error
  const [activeView, setActiveView] = useState('registration');  // Track active view

  // Function to clear the result after a few seconds
  const clearResult = () => {
    setTimeout(() => {
      setResult('');
    }, 3000); // Clear message after 3 seconds
  };

  const handleRegistrationSubmit = async (deviceData) => {
    const response = await handleDeviceRegistration(deviceData, setResult);
    setIsSuccess(response.success);  // Set success or error flag
    clearResult();  // Clear the message after a timeout
  };

  const handleAvailabilitySubmit = async (deviceName, password) => {
    await handleDeviceAvailabilityCheck(deviceName, password, setResult);
    clearResult();  // Clear the message after a timeout
  };

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
        <DeviceRegistrationView onSubmit={handleRegistrationSubmit} />
      ) : (
        <DeviceAvailabilityView onSubmit={handleAvailabilitySubmit} />
      )}

      {/* Success/Result Message */}
      {result && (
        <p className={`result-message ${isSuccess ? 'success' : 'error'}`}>
          {result}
        </p>
      )}
    </div>
  );
}

export default App;

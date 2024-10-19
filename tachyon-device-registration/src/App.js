import React, { useState } from 'react';
import DeviceRegistrationView from './views/DeviceRegistrationView';
import DeviceAvailabilityView from './views/DeviceAvailabilityView';
import { handleDeviceRegistration, handleDeviceAvailabilityCheck } from './controllers/deviceController';
import './App.css';  // Import the CSS file for styling

function App() {
  // State variables for managing the result message and whether it's a success or error
  const [result, setResult] = useState('');  // To store success or error messages
  const [isSuccess, setIsSuccess] = useState(true);  // To track if the result is a success or error message
  const [activeView, setActiveView] = useState('registration');  // To track the current active view (registration or availability)

  // Function to clear the result message after a timeout
  const clearResult = () => {
    setTimeout(() => {
      setResult('');  // Clear the result message after 3 seconds
    }, 3000);
  };

  // Function to handle device registration form submission
  const handleRegistrationSubmit = async (deviceData) => {
    const response = await handleDeviceRegistration(deviceData, setResult);  // Call the registration handler and set the result message
    setIsSuccess(response.success);  // Determine whether the operation was successful and update the success flag
    clearResult();  // Clear the result message after a timeout
  };

  // Function to handle device availability form submission
  const handleAvailabilitySubmit = async (deviceName, password) => {
    await handleDeviceAvailabilityCheck(deviceName, password, setResult);  // Call the availability handler and set the result message
    clearResult();  // Clear the result message after a timeout
  };

  return (
    <div className="app-container">
      {/* Toggle Buttons for switching between "Device Registration" and "Device Availability" views */}
      <div className="toggle-buttons">
        <button
          className={`toggle-button ${activeView === 'registration' ? 'active' : ''}`}  // Apply the active class if "registration" view is active
          onClick={() => setActiveView('registration')}  // Switch to the registration view
        >
          Device Registration
        </button>
        <button
          className={`toggle-button ${activeView === 'availability' ? 'active' : ''}`}  // Apply the active class if "availability" view is active
          onClick={() => setActiveView('availability')}  // Switch to the availability view
        >
          Device Availability
        </button>
      </div>

      {/* Conditionally render the appropriate form based on the active view */}
      {activeView === 'registration' ? (
        <DeviceRegistrationView onSubmit={handleRegistrationSubmit} />  // Render the device registration form and pass the handler function
      ) : (
        <DeviceAvailabilityView onSubmit={handleAvailabilitySubmit} />  // Render the device availability form and pass the handler function
      )}

      {/* Display the result message if it exists */}
      {result && (
        <p className={`result-message ${isSuccess ? 'success' : 'error'}`}>  {/* Apply "success" or "error" class based on isSuccess flag */}
          {result}
        </p>
      )}
    </div>
  );
}

export default App;

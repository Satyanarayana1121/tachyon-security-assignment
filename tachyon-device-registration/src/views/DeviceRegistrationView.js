import React, { useState } from 'react';
import './DeviceRegistrationView.css';  // Import the CSS file for styling the form

function DeviceRegistrationView({ onSubmit }) {
  // State variables for form inputs and other states
  const [deviceName, setDeviceName] = useState('');  // To store the entered device name
  const [ipAddress, setIpAddress] = useState('');  // To store the entered IP address
  const [password, setPassword] = useState('');  // To store the entered password
  const [errorMessage, setErrorMessage] = useState('');  // To store validation error messages
  const [submitting, setSubmitting] = useState(false);  // To indicate form submission in progress

  // Regular expression pattern for validating IPv4 addresses
  const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // Regular expression pattern for validating password strength
  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Function to validate the form fields before submission
  const validateForm = () => {
    // Check each field and return early if an error is found
    if (!deviceName) {
      setErrorMessage('Device name is required');
      return false;  // Return false if validation fails
    }
    if (!ipAddress) {
      setErrorMessage('IP address is required');
      return false;
    } else if (!ipPattern.test(ipAddress)) {
      setErrorMessage('Please enter a valid IP address (e.g., 192.168.0.1)');
      return false;
    }
    if (!password) {
      setErrorMessage('Password is required');
      return false;
    } else if (!passwordPattern.test(password)) {
      setErrorMessage('Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character');
      return false;
    }

    // Clear the error message if all fields are valid
    setErrorMessage('');
    return true;  // Return true if validation passes
  };

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior

    // Validate form inputs
    if (!validateForm()) {
      return;  // If validation fails, exit the function
    }

    setSubmitting(true);  // Set the submitting state to true, disabling the submit button

    try {
      // Call the onSubmit function passed from the parent component to handle device registration
      await onSubmit({
        device_name: deviceName,  // Send the device name
        ip_address: ipAddress,  // Send the IP address
        password: password,  // Send the password
      });

      // Clear the form fields after successful submission
      setDeviceName('');
      setIpAddress('');
      setPassword('');
    } catch (error) {
      console.error('Error during device registration:', error);  // Log any errors that occur during the registration
    } finally {
      setSubmitting(false);  // Reset the submitting state, re-enabling the submit button
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Register a New Device</h2>
      <form onSubmit={handleSubmit} className="form">
        {/* Device Name Input Field */}
        <label>Device Name</label>
        <input
          type="text"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}  // Update the device name state when the input changes
          className="form-input"
          placeholder="Enter device name"
        />

        {/* IP Address Input Field */}
        <label>IP Address</label>
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}  // Update the IP address state when the input changes
          className="form-input"
          placeholder="Enter IP address"
        />

        {/* Password Input Field */}
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}  // Update the password state when the input changes
          className="form-input"
          placeholder="Enter password"
        />

        {/* Display any validation error message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Submit Button with disabling state during submission */}
        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Register Device'}
        </button>
      </form>
    </div>
  );
}

export default DeviceRegistrationView;

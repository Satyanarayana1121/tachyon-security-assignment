// src/views/DeviceRegistrationView.js
import React, { useState } from 'react';
import './DeviceRegistrationView.css';  // Import the CSS file

function DeviceRegistrationView({ onSubmit }) {
  const [deviceName, setDeviceName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);  // Submitting state

  const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  const validateForm = () => {
    const newErrors = {};
    if (!deviceName) {
      newErrors.deviceName = 'Device name is required';
    }
    if (!ipAddress) {
      newErrors.ipAddress = 'IP address is required';
    } else if (!ipPattern.test(ipAddress)) {
      newErrors.ipAddress = 'Please enter a valid IP address (e.g., 192.168.0.1)';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);  // Start the submitting state

    // Call the onSubmit function passed from the controller
    const response = await onSubmit({ device_name: deviceName, ip_address: ipAddress, password: password });

    setSubmitting(false);  // Stop the submitting state

    if (response.success) {
      setDeviceName('');
      setIpAddress('');
      setPassword('');
      setSuccessMessage('Device registered successfully!');
    } else {
      setSuccessMessage('Failed to register device. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Register a New Device</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Device Name</label>
        <input
          type="text"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          className="form-input"
          placeholder="Enter device name"
        />
        {errors.deviceName && <p className="error-message">{errors.deviceName}</p>}

        <label>IP Address</label>
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          className="form-input"
          placeholder="Enter IP address"
        />
        {errors.ipAddress && <p className="error-message">{errors.ipAddress}</p>}

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          placeholder="Enter password"
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Register Device'}
        </button>
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default DeviceRegistrationView;

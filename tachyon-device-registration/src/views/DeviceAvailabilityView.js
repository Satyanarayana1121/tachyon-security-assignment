// src/views/DeviceAvailabilityView.js
import React, { useState } from 'react';
import './DeviceAvailabilityView.css';  // Import the CSS file

function DeviceAvailabilityView({ onSubmit }) {
    const [deviceName, setDeviceName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(deviceName, password);
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Check Device Availability</h2>
            <form onSubmit={handleSubmit} className="form">
                <label>Device Name</label>
                <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    required
                    className="form-input"
                    placeholder="Enter device name"
                />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input"
                    placeholder="Enter password"
                />

                <button type="submit" className="submit-button">Check Availability</button>
            </form>
        </div>
    );
}

export default DeviceAvailabilityView;

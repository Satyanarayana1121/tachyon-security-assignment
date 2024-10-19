// src/views/DeviceAvailabilityView.js
import React, { useState, useEffect } from 'react';
import { fetchDevices } from '../models/deviceModel';  // Import the fetchDevices function
import './DeviceAvailabilityView.css';  // Import the CSS file

function DeviceAvailabilityView({ onSubmit }) {
    const [deviceName, setDeviceName] = useState('');
    const [password, setPassword] = useState('');
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);  // Loading state
    const [submitting, setSubmitting] = useState(false);  // Submitting state

    // Fetch the list of devices when the component mounts
    useEffect(() => {
        const getDevices = async () => {
            try {
                const fetchedDevices = await fetchDevices();
                setDevices(fetchedDevices);  // Set the devices for the dropdown
            } catch (error) {
                console.error('Error fetching devices:', error);
            } finally {
                setLoading(false);  // Stop loading once devices are fetched
            }
        };

        getDevices();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);  // Start the submitting state
        setDeviceName('');  // Clear device name
        setPassword('');    // Clear password

        // Call the onSubmit function
        onSubmit(deviceName, password)
            .finally(() => {
                setSubmitting(false);  // Stop the submitting state
            });
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Check Device Availability</h2>

            {loading ? (
                <p>Loading devices...</p>  // Show loading while devices are being fetched
            ) : (
                <form onSubmit={handleSubmit} className="form">
                    <label>Device Name</label>
                    <select
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        required
                        className="form-input"
                    >
                        <option value="" disabled>Select your device</option>
                        {devices.map((device, index) => (
                            <option key={index} value={device}>
                                {device}
                            </option>
                        ))}
                    </select>

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                        placeholder="Enter password"
                    />

                    <button type="submit" className="submit-button" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Check Availability'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default DeviceAvailabilityView;

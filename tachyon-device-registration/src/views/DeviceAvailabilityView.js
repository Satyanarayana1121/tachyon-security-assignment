// src/views/DeviceAvailabilityView.js
import React, { useState, useEffect } from 'react';
import { fetchDevices } from '../models/deviceModel';  // Import the function to fetch devices
import './DeviceAvailabilityView.css';  // Import the CSS file for styling

function DeviceAvailabilityView({ onSubmit }) {
    // State variables for form inputs, devices, loading, and submitting states
    const [deviceName, setDeviceName] = useState('');  // To store the selected device name
    const [password, setPassword] = useState('');  // To store the entered password
    const [devices, setDevices] = useState([]);  // To store the fetched devices list
    const [loading, setLoading] = useState(true);  // To indicate whether devices are still being fetched
    const [submitting, setSubmitting] = useState(false);  // To indicate whether form is being submitted

    // Fetch the list of devices when the component mounts
    useEffect(() => {
        const getDevices = async () => {
            try {
                const fetchedDevices = await fetchDevices();  // Call function to fetch devices from the server
                setDevices(fetchedDevices);  // Set the fetched devices to the state
            } catch (error) {
                console.error('Error fetching devices:', error);  // Log error if fetching fails
            } finally {
                setLoading(false);  // Stop the loading state once devices are fetched
            }
        };

        getDevices();  // Trigger the fetch when the component mounts
    }, []);  // Empty dependency array ensures this effect runs only once when the component mounts

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();  // Prevent the default form submission behavior
        setSubmitting(true);  // Start the submitting state (disables the submit button)

        // Clear input fields after submission
        setDeviceName('');  // Clear the selected device name field
        setPassword('');  // Clear the password field

        // Call the onSubmit function with the form inputs (deviceName and password)
        onSubmit(deviceName, password)
            .finally(() => {
                setSubmitting(false);  // Stop the submitting state once submission is done
            });
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Check Device Availability</h2>

            {/* Show a loading message while devices are being fetched */}
            {loading ? (
                <p>Loading devices...</p>  // Display loading state
            ) : (
                // Render the form once devices are fetched
                <form onSubmit={handleSubmit} className="form">
                    {/* Device selection dropdown */}
                    <label>Device Name</label>
                    <select
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}  // Update state with selected device
                        required
                        className="form-input"
                    >
                        <option value="" disabled>Select your device</option>
                        {/* Populate dropdown with the list of devices */}
                        {devices.map((device, index) => (
                            <option key={index} value={device}>
                                {device}
                            </option>
                        ))}
                    </select>

                    {/* Password input field */}
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}  // Update state with entered password
                        required
                        className="form-input"
                        placeholder="Enter password"
                    />

                    {/* Submit button with disabled state while submitting */}
                    <button type="submit" className="submit-button" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Check Availability'}  {/* Change button text based on state */}
                    </button>
                </form>
            )}
        </div>
    );
}

export default DeviceAvailabilityView;

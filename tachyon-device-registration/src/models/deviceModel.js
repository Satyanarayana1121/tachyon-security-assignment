// src/models/deviceModel.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Flask backend URL

// Register a new device
export const addDevice = async (device) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/add_device`, device);
        return response.data;
    } catch (error) {
        console.error('Error adding device:', error);
        throw error;
    }
};

// Check device availability
export const checkDeviceAvailability = async (deviceName, password) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/check_availability`, {
            params: { device_name: deviceName, password: password }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Backend error:', error.response.data);
            console.error('Status code:', error.response.status);
            throw new Error(`Failed to check availability: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
            // Request was made, but no response was received
            console.error('No response from server:', error.request);
            throw new Error('No response from server. Please try again.');
        } else {
            // Other errors, like setting up the request
            console.error('Error setting up request:', error.message);
            throw new Error(`Error: ${error.message}`);
        }
    }
};

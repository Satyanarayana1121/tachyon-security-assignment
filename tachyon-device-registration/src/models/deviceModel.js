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

// Check device availability (GET request)
export const checkDeviceAvailability = async (deviceName, password) => {
    try {
        // Make a GET request with device_name and password as query parameters
        const response = await axios.get(`${API_BASE_URL}/check_availability`, {
            params: {
                device_name: deviceName,
                password: password
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Handle backend error response
            console.error('Backend error:', error.response.data);
            throw new Error(`Failed to check availability: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
            // Handle no response from the server
            console.error('No response from server:', error.request);
            throw new Error('No response from server. Please try again.');
        } else {
            // Handle other errors
            console.error('Error setting up request:', error.message);
            throw new Error(`Error: ${error.message}`);
        }
    }
};

export const fetchDevices = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/devices`);
        return response.data.devices;
    } catch (error) {
        console.error('Error fetching devices:', error);
        throw error;
    }
};


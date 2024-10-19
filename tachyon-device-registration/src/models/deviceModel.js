import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Flask backend base URL

/**
 * Registers a new device by making a POST request to the Flask backend.
 * @param {Object} device - An object containing the device details (device_name, ip_address, password).
 * @returns {Object} - Returns the backend response data, which usually contains a success message.
 * @throws {Error} - Throws an error if the request fails.
 */
export const addDevice = async (device) => {
    try {
        // Send POST request to register a new device
        const response = await axios.post(`${API_BASE_URL}/add_device`, device);
        return response.data; // Return the response data from the backend
    } catch (error) {
        console.error('Error adding device:', error); // Log the error to the console
        throw error; // Throw the error so it can be handled by the calling function
    }
};

/**
 * Checks the availability of a device by making a GET request to the Flask backend.
 * @param {string} deviceName - The name of the device to check availability for.
 * @param {string} password - The password of the device for authentication.
 * @returns {Object} - Returns the backend response data, which contains availability status.
 * @throws {Error} - Throws an error if the request fails or if the backend responds with an error.
 */
export const checkDeviceAvailability = async (deviceName, password) => {
    try {
        // Send GET request to check if the device is reachable
        const response = await axios.get(`${API_BASE_URL}/check_availability`, {
            params: {
                device_name: deviceName, // Query parameter for device name
                password: password       // Query parameter for password
            }
        });
        return response.data; // Return the response data from the backend
    } catch (error) {
        if (error.response) {
            // Handle error response from the backend (e.g., 404 or 500 status codes)
            console.error('Backend error:', error.response.data);
            throw new Error(`Failed to check availability: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
            // Handle case where no response was received from the server
            console.error('No response from server:', error.request);
            throw new Error('No response from server. Please try again.');
        } else {
            // Handle any other errors that occurred during the setup of the request
            console.error('Error setting up request:', error.message);
            throw new Error(`Error: ${error.message}`);
        }
    }
};

/**
 * Fetches a list of all devices by making a GET request to the Flask backend.
 * @returns {Array} - Returns an array of device names.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchDevices = async () => {
    try {
        // Send GET request to fetch all registered devices
        const response = await axios.get(`${API_BASE_URL}/devices`);
        return response.data.devices; // Return the list of device names from the backend
    } catch (error) {
        console.error('Error fetching devices:', error); // Log the error to the console
        throw error; // Throw the error so it can be handled by the calling function
    }
};

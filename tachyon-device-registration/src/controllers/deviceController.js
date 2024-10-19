// Importing functions to handle API requests related to device registration and availability
import { addDevice, checkDeviceAvailability } from '../models/deviceModel';

/**
 * Handles the device registration process by calling the model's addDevice function.
 * @param {Object} deviceData - The data related to the device (device name, IP address, password).
 * @param {Function} setResult - A state setter function to update the result message in the UI.
 * @returns {Object} - Returns an object with success status indicating if the registration was successful or not.
 */
export const handleDeviceRegistration = async (deviceData, setResult) => {
    try {
        // Call the model's addDevice function to register the device in the backend
        const response = await addDevice(deviceData);

        // Set the result message with the backend response (e.g., 'Device added successfully')
        setResult(response.message);

        // Return a success status so that the UI can respond appropriately
        return { success: true };  // Registration was successful
    } catch (error) {
        // If an error occurs, set the result message to inform the user
        setResult('Error adding device');

        // Return a failure status so the UI can handle the error appropriately
        return { success: false };  // Registration failed
    }
};

/**
 * Handles the process of checking device availability by calling the model's checkDeviceAvailability function.
 * @param {string} deviceName - The name of the device to check availability for.
 * @param {string} password - The password to authenticate the device.
 * @param {Function} setResult - A state setter function to update the result message in the UI.
 */
export const handleDeviceAvailabilityCheck = async (deviceName, password, setResult) => {
    try {
        // Call the model's checkDeviceAvailability function to check if the device is reachable
        const response = await checkDeviceAvailability(deviceName, password);

        // Set the result message with the backend response (e.g., 'Device is reachable')
        setResult(response.message);
    } catch (error) {
        // Log the error for debugging purposes (optional)
        console.error('Error in handleDeviceAvailabilityCheck:', error);

        // If an error occurs, set the result message to inform the user
        setResult(error.message);  // Use the error's message to update the UI
    }
};

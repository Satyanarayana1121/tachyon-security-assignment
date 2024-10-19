// src/controllers/deviceController.js
import { addDevice, checkDeviceAvailability } from '../models/deviceModel';

export const handleDeviceRegistration = async (deviceData, setResult) => {
    try {
        const response = await addDevice(deviceData);
        setResult(response.message);
        return { success: true };  // Return success response
    } catch (error) {
        setResult('Error adding device');
        return { success: false };  // Return failure response
    }
};

// Logic for handling device availability check
export const handleDeviceAvailabilityCheck = async (deviceName, password, setResult) => {
    try {
        const response = await checkDeviceAvailability(deviceName, password);
        setResult(response.message);
    } catch (error) {
        console.error('Error in handleDeviceAvailabilityCheck:', error);  // Log the error for debugging
        setResult(error.message);  // Return the error message to the frontend
    }
};

# tachyon-security-assignment

This project is a **Device Management System** that allows users to manage devices by adding them to a MySQL database, checking device availability, and retrieving all registered devices. It is built using **Flask** for the backend and **React** for the frontend. The system supports input validation, password encryption using bcrypt, and provides JSON-based API responses.

## Features

- **Add Device**: Users can register a device with a device name, IP address, and password.
- **Check Availability**: Verifies device credentials (device name and password) and checks if the device is reachable.
- **Get Devices**: Retrieves a list of all registered devices.
- **Input Validation**: Ensures valid input for device registration, including checking for required fields, valid IP addresses, and password length.
- **Password Encryption**: The password is encrypted using bcrypt before being stored in the database.
- **JSON Responses**: All API responses are in JSON format for easy integration with frontend applications.
- **Frontend Form Validation**: React frontend includes form validation for required fields and correct formats.
- **Error Handling**: Proper handling for errors, including database errors and input validation failures.

## Technologies Used

- **Flask**: Python web framework for backend API.
- **MySQL**: Relational database used to store device information.
- **React**: JavaScript library for building the frontend UI.
- **bcrypt**: Used for password encryption and hashing.
- **axios**: Promise-based HTTP client for making requests from the frontend to the backend.
- **flask-cors**: For handling Cross-Origin Resource Sharing (CORS) between the backend and frontend.

## Project Structure

\`\`\`bash
|-- backend/                # Flask backend
|   |-- app.py              # Main Flask app with API routes
|   |-- requirements.txt    # Python dependencies
|
|-- frontend/               # React frontend
|   |-- src/                # Source code for frontend
|   |   |-- components/     # React components
|   |   |-- models/         # API interaction (addDevice, checkDeviceAvailability)
|   |   |-- views/          # View components (DeviceRegistrationView)
|   |-- package.json        # Node.js dependencies
|
|-- README.md               # Project overview and instructions
\`\`\`

## Installation and Setup

### Backend (Flask)

1. **Install Python dependencies**:

    \`\`\`bash
    cd backend
    pip install -r requirements.txt
    \`\`\`

2. **Set up MySQL database**:
   - Ensure MySQL is installed and running.
   - Create a database named \`world\` or modify the connection details in \`app.py\` to point to your desired database.
   - Ensure you have created the necessary table by running the \`/add_device\` route.

3. **Run the Flask server**:

    \`\`\`bash
    python app.py
    \`\`\`

    The Flask backend will be running at \`http://localhost:5000\`.

### Frontend (React)

1. **Install Node.js dependencies**:

    \`\`\`bash
    cd frontend
    npm install
    \`\`\`

2. **Start the React development server**:

    \`\`\`bash
    npm start
    \`\`\`

    The React frontend will be running at \`http://localhost:3000\`.

## API Endpoints

### 1. Add Device (\`/add_device\`)
**Method**: \`POST\`  
**Description**: Adds a new device to the database.  
**Request Body** (JSON):
\`\`\`json
{
  "device_name": "Router1",
  "ip_address": "192.168.1.1",
  "password": "mypassword"
}
\`\`\`
**Response** (JSON):
\`\`\`json
{
  "message": "Device added successfully"
}
\`\`\`

### 2. Check Availability (\`/check_availability\`)
**Method**: \`POST\`  
**Description**: Checks if a device is reachable by verifying its credentials (device name and password).  
**Request Body** (JSON):
\`\`\`json
{
  "device_name": "Router1",
  "password": "mypassword"
}
\`\`\`
**Response** (JSON):
- If reachable:
  \`\`\`json
  {
    "message": "Reachable",
    "status": "Success"
  }
  \`\`\`
- If not reachable:
  \`\`\`json
  {
    "message": "Not Reachable",
    "status": "Failed"
  }
  \`\`\`
- If incorrect password or device not found, appropriate error messages are returned.

### 3. Get Devices (\`/get_devices\`)
**Method**: \`GET\`  
**Description**: Retrieves all registered devices.  
**Response** (JSON):
\`\`\`json
{
  "devices": [
    {
      "device_name": "Router1",
      "ip_address": "192.168.1.1"
    },
    {
      "device_name": "Router2",
      "ip_address": "192.168.1.2"
    }
  ]
}
\`\`\`

## Frontend Features and Form Validation

The frontend provides a form for registering devices and includes the following validations:

1. **Device Name**: Required field.
2. **IP Address**: Must follow the correct IPv4 format (e.g., \`192.168.0.1\`).
3. **Password**: Must be at least 8 characters long and contains at least one uppercase letter and contains at least one lowercase letter and contains at least one number and contains at least one special character.

If any validation fails, an error message is displayed next to the relevant input field.

### Example Form Validation in React:

\`\`\`javascript
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
    return Object.keys(newErrors).length === 0;
};
\`\`\`

## Validation Rules

The following validation rules apply when registering a new device:

- **Device Name**: Required.
- **IP Address**: Must be a valid IPv4 address (e.g., \`192.168.0.1\`).
- **Password**: Must be at least 8 characters long and contains at least one uppercase letter and contains at least one lowercase letter and contains at least one number and contains at least one special character.

If any field does not meet these requirements, the frontend will show appropriate error messages.

# Docker Setup for Tachyon Security Assignment

This guide explains how to set up the Docker environment for the **Device Management System** project using **Docker**.

## Prerequisites

- Install Docker from [Docker Official Website](https://www.docker.com/get-started).
- Ensure MySQL and Flask dependencies are set in `requirements.txt`.

---

## Future Enhancements

- **Edit Device**: Add functionality to edit existing device details.
- **Delete Device**: Add functionality to delete devices from the database.
- **User Authentication**: Add user authentication for more secure operations.
- **Pagination**: Add pagination for listing devices if the list grows large.
- **Testing**: Implement unit and integration tests for the backend API and frontend components.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Dockerfile for Flask Backend

Create a `Dockerfile` in the `backend/` folder with the following content:

```dockerfile
# Use official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Run the application
CMD ["flask", "run"]

##Build Docker Images

  \`\`\`bash
  docker-compose build
  \`\`\`

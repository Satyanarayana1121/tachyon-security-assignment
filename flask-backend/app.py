from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import random
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing to allow frontend to communicate with backend

# Setup logging to write to a file and console
log_formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')

# Logging to a file with rotation
log_file = 'app.log'  # Specify the path to the log file here

# Set up a rotating file handler (5 MB per log file, with up to 2 backups)
file_handler = RotatingFileHandler(log_file, maxBytes=5 * 1024 * 1024, backupCount=2)
file_handler.setFormatter(log_formatter)
file_handler.setLevel(logging.INFO)

# Logging to the console for real-time feedback
console_handler = logging.StreamHandler()
console_handler.setFormatter(log_formatter)
console_handler.setLevel(logging.INFO)

# Setup the root logger to use both file and console logging
logging.basicConfig(level=logging.INFO, handlers=[file_handler, console_handler])

# Setup a second call to logging to ensure format
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

# Database connection
# Establish a connection to the MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="satya",
    database="world"
)

# Function to get a cursor for database operations
def get_db_cursor():
    # Reconnect if the database connection has dropped
    if db.is_connected():
        return db.cursor()
    else:
        db.reconnect()
        return db.cursor()

# Function to create the devices table (run this once)
# This function will create a table if it doesn't exist
def create_table():
    cursor = get_db_cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS devices (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        device_name VARCHAR(50),
                        ip_address VARCHAR(50),
                        password VARCHAR(255)
                      )''')
    db.commit()
    cursor.close()

# Call the function to ensure table is created
create_table()

# API route to add a new device
@app.route('/add_device', methods=['POST'])
def add_device():
    try:
        # Get JSON input from the request
        data = request.json
        
        device_name = data['device_name']
        ip_address = data['ip_address']
        raw_password = data['password']

        # Log the request to add a device
        logging.info(f"Received request to add device: {device_name} with IP: {ip_address}")

        # Encrypt the password using bcrypt
        hashed_password = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt())

        # Create a cursor to execute SQL queries
        cursor = get_db_cursor()

        # Insert the new device into the database
        sql = "INSERT INTO devices (device_name, ip_address, password) VALUES (%s, %s, %s)"
        val = (device_name, ip_address, hashed_password)
        cursor.execute(sql, val)
        db.commit()

        # Log successful addition of the device
        logging.info(f"Device {device_name} added successfully with IP: {ip_address}")
        
        return jsonify({"message": "Device added successfully"}), 201

    except mysql.connector.Error as err:
        # Log database errors
        logging.error(f"Database Error while adding device: {err}")
        return jsonify({"message": "Database Error"}), 500

    except Exception as e:
        # Log any unexpected errors
        logging.error(f"Unexpected error while adding device: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

    finally:
        # Close the cursor after use
        cursor.close()

# API route to check device availability
@app.route('/check_availability', methods=['GET'])
def check_availability():
    try:
        # Get query parameters from the request
        device_name = request.args.get('device_name')
        password = request.args.get('password')

        # If device name or password is missing, return a warning
        if not device_name or not password:
            logging.warning("Missing device_name or password in availability check request")
            return jsonify({"message": "Missing device_name or password"}), 400

        logging.info(f"Checking availability for device: {device_name}")

        cursor = get_db_cursor()

        # Check if the device exists in the database
        sql = "SELECT * FROM devices WHERE device_name=%s"
        cursor.execute(sql, (device_name,))
        device = cursor.fetchone()

        if device:
            # Extract the stored password from the result set
            stored_password = device[3]  # Assuming the password is in the 4th column
            if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
                logging.info(f"Password validation succeeded for device: {device_name}")

                # Simulate device reachability using random logic
                reachable = random.randint(1, 100) % 2 == 0
                if reachable:
                    logging.info(f"Device {device_name} is reachable")
                    cursor.fetchall()  # Ensure all results are read
                    return jsonify({"message": "Reachable", "status": "Success"}), 200
                else:
                    logging.info(f"Device {device_name} is not reachable")
                    cursor.fetchall()  # Ensure all results are read
                    return jsonify({"message": "Not Reachable", "status": "Failed"}), 200
            else:
                logging.warning(f"Password validation failed for device: {device_name}")
                cursor.fetchall()  # Ensure all results are read
                return jsonify({"message": "Incorrect Password"}), 401
        else:
            logging.warning(f"Device not found: {device_name}")
            cursor.fetchall()  # Ensure all results are read
            return jsonify({"message": "Device not found"}), 404

    except mysql.connector.Error as err:
        # Log database errors during availability check
        logging.error(f"Database Error while checking availability for device {device_name}: {err}")
        return jsonify({"message": "Database Error"}), 500

    except Exception as e:
        # Log unexpected errors during availability check
        logging.error(f"Unexpected error during availability check for device {device_name}: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

    finally:
        # Close the cursor after use
        cursor.close()

# API route to fetch all registered devices (for the dropdown in the frontend)
@app.route('/devices', methods=['GET'])
def get_devices():
    try:
        logging.info("Fetching all device names")

        cursor = get_db_cursor()

        # Query to get all device names from the database
        cursor.execute("SELECT device_name FROM devices")
        devices = cursor.fetchall()

        # Extract device names from the query result
        device_list = [device[0] for device in devices]

        logging.info(f"Fetched devices: {device_list}")

        return jsonify({"devices": device_list}), 200

    except mysql.connector.Error as err:
        # Log database errors while fetching devices
        logging.error(f"Database Error while fetching devices: {err}")
        return jsonify({"message": "Database Error"}), 500

    except Exception as e:
        # Log unexpected errors while fetching devices
        logging.error(f"Unexpected error while fetching devices: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

    finally:
        # Close the cursor after use
        cursor.close()

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)  # Enable debug mode for easier development and troubleshooting

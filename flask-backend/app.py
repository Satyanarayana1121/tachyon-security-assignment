from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import random
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)
CORS(app)


# Setup logging to write to a file and console
log_formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')

# Logging to a file with rotation
log_file = 'app.log'  # You can specify the path to the log file here

file_handler = RotatingFileHandler(log_file, maxBytes=5 * 1024 * 1024, backupCount=2)  # 5 MB per file, with 2 backups
file_handler.setFormatter(log_formatter)
file_handler.setLevel(logging.INFO)

# Logging to the console
console_handler = logging.StreamHandler()
console_handler.setFormatter(log_formatter)
console_handler.setLevel(logging.INFO)

# Setup the root logger
logging.basicConfig(level=logging.INFO, handlers=[file_handler, console_handler])

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="satya",
    database="world"
)

# Create a cursor
def get_db_cursor():
    if db.is_connected():
        return db.cursor()
    else:
        db.reconnect()
        return db.cursor()

# Create table (run this once)
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

create_table()

# Add a new device
@app.route('/add_device', methods=['POST'])
def add_device():
    try:
        # Get JSON input from the request
        data = request.json
        
        device_name = data['device_name']
        ip_address = data['ip_address']
        raw_password = data['password']

        # Log the incoming request
        logging.info(f"Received request to add device: {device_name} with IP: {ip_address}")

        # Password encryption
        hashed_password = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt())

        # Create a new cursor
        cursor = get_db_cursor()

        # Insert device into the database
        sql = "INSERT INTO devices (device_name, ip_address, password) VALUES (%s, %s, %s)"
        val = (device_name, ip_address, hashed_password)
        cursor.execute(sql, val)
        db.commit()

        logging.info(f"Device {device_name} added successfully with IP: {ip_address}")
        
        return jsonify({"message": "Device added successfully"}), 201

    except mysql.connector.Error as err:
        logging.error(f"Database Error while adding device: {err}")
        return jsonify({"message": "Database Error"}), 500

    except Exception as e:
        logging.error(f"Unexpected error while adding device: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

    finally:
        cursor.close()

# Check Device Availability
@app.route('/check_availability', methods=['GET'])
def check_availability():
    try:
        # Get the query parameters from the request
        device_name = request.args.get('device_name')
        password = request.args.get('password')

        if not device_name or not password:
            logging.warning("Missing device_name or password in availability check request")
            return jsonify({"message": "Missing device_name or password"}), 400

        logging.info(f"Checking availability for device: {device_name}")

        cursor = get_db_cursor()

        # Check if device exists in the database
        sql = "SELECT * FROM devices WHERE device_name=%s"
        cursor.execute(sql, (device_name,))
        device = cursor.fetchone()

        if device:
            stored_password = device[3]  # Assuming the password is in the 4th column
            if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
                logging.info(f"Password validation succeeded for device: {device_name}")

                # Simulate device reachability
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
        logging.error(f"Database Error while checking availability for device {device_name}: {err}")
        return jsonify({"message": "Database Error"}), 500

    except Exception as e:
        logging.error(f"Unexpected error during availability check for device {device_name}: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

    finally:
        cursor.close()

# Fetch all devices (for dropdown)
@app.route('/devices', methods=['GET'])
def get_devices():
    try:
        logging.info("Fetching all device names")

        cursor = get_db_cursor()

        # Query to get all devices
        cursor.execute("SELECT device_name FROM devices")
        devices = cursor.fetchall()

        device_list = [device[0] for device in devices]  # Extract just the device names

        logging.info(f"Fetched devices: {device_list}")

        return jsonify({"devices": device_list}), 200

    except mysql.connector.Error as err:
        logging.error(f"Database Error while fetching devices: {err}")
        return jsonify({"message": "Database Error"}), 500

    except Exception as e:
        logging.error(f"Unexpected error while fetching devices: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

    finally:
        cursor.close()

# Run the app
if __name__ == '__main__':
    app.run(debug=True)

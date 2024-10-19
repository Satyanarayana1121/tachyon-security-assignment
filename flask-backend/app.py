from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import random
import logging

app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO)

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

        # Password encryption
        hashed_password = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt())

        # Create a new cursor
        cursor = get_db_cursor()

        # Insert device into the database
        sql = "INSERT INTO devices (device_name, ip_address, password) VALUES (%s, %s, %s)"
        val = (device_name, ip_address, hashed_password)
        cursor.execute(sql, val)
        db.commit()
        
        logging.info(f"Device {device_name} added with IP: {ip_address}")
        
        return jsonify({"message": "Device added successfully"}), 201

    except mysql.connector.Error as err:
        logging.error(f"Database Error: {err}")
        return jsonify({"message": "Database Error"}), 500

    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

    finally:
        cursor.close()

# Check device availability
@app.route('/check_availability', methods=['POST'])
def check_availability():
    try:
        # Get JSON input from the request
        data = request.json
        
        device_name = data['device_name']
        password = data['password']

        cursor = get_db_cursor()

        # Check if device exists
        sql = "SELECT * FROM devices WHERE device_name=%s"
        cursor.execute(sql, (device_name,))
        device = cursor.fetchone()

        if device:
            stored_password = device[3]  # Assuming password is the 4th column in the 'devices' table
            if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
                # Simulate device reachability using random number logic
                reachable = random.randint(1, 100) % 2 == 0
                if reachable:
                    return jsonify({"message": "Reachable", "status": "Success"}), 200
                else:
                    return jsonify({"message": "Not Reachable", "status": "Failed"}), 200
            else:
                return jsonify({"message": "Incorrect Password"}), 401
        else:
            return jsonify({"message": "Device not found"}), 404

    except mysql.connector.Error as err:
        logging.error(f"Database Error: {err}")
        return jsonify({"message": "Database Error"}), 500

    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

    finally:
        cursor.close()

# Run the app
if __name__ == '__main__':
    app.run(debug=True)

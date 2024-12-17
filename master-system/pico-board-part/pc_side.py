import socket
import time
import struct
from desk_manager import DeskManager 


LIGHT_SENSOR_HOST = "192.168.0.103"  # Change this to the server's IP address
LIGHT_SENSOR_PORT = 4242      # Use the port number the server is listening on
MAIN_SERVER_HOST = '18:03:43'
MAIN_SERVER_PORT = 8000

def forward_to_main_server(data):
    """Forward data to the main server."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as main_socket:
        try:
            main_socket.connect((MAIN_SERVER_HOST, MAIN_SERVER_PORT))
            main_socket.sendall(data.encode() if isinstance(data, str) else data)
        except Exception as e:
            print(f"Error forwarding to main server: {e}")

def process_sensor_data(client_socket, desk_manager):
    """Process incoming messages from the light sensor."""
    try:
        while True:
            # Try to receive structured data
            msg = client_socket.recv(28)
            if len(msg) == 28:  # Expected structured data
                btn_state, pressed, pressed_since_last, potentiometer, light_intensity, temp, humidity = struct.unpack("<BxxxIIffff", msg)
                
                # Log and process structured data
                print(f"Structured data - Light intensity: {light_intensity}, Temp: {temp}, Humidity: {humidity}")
                desk_manager.move_desks_based_on_light(light_intensity)
                
                # Forward to the main server
                forward_to_main_server(f"Structured data - Light: {light_intensity}, Temp: {temp}, Humidity: {humidity}")
            else:
                # Try to decode as a regular message
                try:
                    message = msg.decode('utf-8')
                    print(f"Received message: {message}")
                    
                    # Parse light intensity from message
                    if message.startswith("Light"):
                        try:
                            light_value = float(message.split(":")[1].strip().replace("%", ""))
                            print(f"Light intensity is {light_value}%, moving desks accordingly.")
                            desk_manager.move_desks_based_on_light(light_value)
                            
                            # Forward to the main server
                            forward_to_main_server(message)
                        except (ValueError, IndexError) as e:
                            print(f"Error parsing light intensity: {e}")
                except UnicodeDecodeError:
                    print(f"Received raw data: {msg}")

    except struct.error as e:
        print(f"Struct error: {e}")
    except Exception as e:
        print(f"An error occurred while processing sensor data: {e}")

def light_sensor_server():
    """TCP server to receive data from the light sensor."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
        server_socket.bind((LIGHT_SENSOR_HOST, LIGHT_SENSOR_PORT))
        server_socket.listen(5)
        print(f"Light Sensor Server running on {LIGHT_SENSOR_HOST}:{LIGHT_SENSOR_PORT}")
        
        desk_manager = DeskManager()
        desk_manager.start_updates()

        try:
            while True:
                client_socket, addr = server_socket.accept()
                print(f"Connection from {addr}")
                with client_socket:
                    process_sensor_data(client_socket, desk_manager)
        except KeyboardInterrupt:
            print("\nShutting down the server...")
        finally:
            desk_manager.stop_updates()


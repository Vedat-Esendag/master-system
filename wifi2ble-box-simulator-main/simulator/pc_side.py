import socket
import time
import struct
from desk_manager import DeskManager

server_host = "192.168.50.176"  # Change this to the server's IP address
server_port = 4242      # Use the port number the server is listening on
# Create a socket object
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Add this function before the main connection logic
def send_test_message(socket, message):
    # Convert string to bytes before sending
    message_bytes = message.encode('utf-8')
    socket.send(message_bytes)

# Add function to receive messages
def receive_message(socket):
    try:
        # First receive the message length (assuming it's packed as a 4-byte integer)
        message_length = socket.recv(4)
        if not message_length:
            return None
        
        length = struct.unpack('!I', message_length)[0]
        
        # Then receive the actual message
        message = socket.recv(length).decode('utf-8')
        return message
    except Exception as e:
        print(f"Error receiving message: {e}")
        return None

# Modify the connection part to include test message
client_socket.connect((server_host, server_port))
print(f"Connected to server {server_host}:{server_port}")

# Send initial handshake
client_socket.send(b'\x01')

# Modified communication sequence
for i in range(3):  # Send 3 messages with waiting for responses
    # Send message
    send_test_message(client_socket, f"Hello Raspberry Pi! ({i+1})")
    print(f"Sent message {i+1}")
    
    # Wait for response
    response = receive_message(client_socket)
    if response:
        print(f"Received response: {response}")
        
    else:
        print("No response received")
    
    time.sleep(1)  # Small delay between messages

# Initialize DeskManager before the main loop
desk_manager = DeskManager()
desk_manager.start_updates()

try:
    i = 0  # Initialize i before the loop
    while True:
        # Try to receive structured data
        try:
            msg = client_socket.recv(28)
            if len(msg) == 28:  # If we received the expected structured data
                btn_state, pressed, pressed_since_last, potentiometer, light_intensity, temp, humidity = struct.unpack("<BxxxIIffff", msg)
                
                
                # Call the new function to move desks based on light intensity
                desk_manager.move_desks_based_on_light(light_intensity)
            else:
                # Try to decode as a regular message
                try:
                    message = msg.decode('utf-8')
                    print(f"Received message(this one): {message}")
                    if message.startswith("Light"):
                        print(f"success", {message})
                        try:
                            light_value = float(message.split(":")[1].strip().replace("%", ""))
                            if light_value > 10.00:
                                print(f"Light intensity is {light_value}%, moving desks up")
                                desk_manager.move_desks_based_on_light(light_value)
                        except (ValueError, IndexError) as e:
                            print(f"Error parsing light intensity: {e}")

                except UnicodeDecodeError:
                    print(f"Received raw data: {msg}")
        
        except struct.error:
            # If it's not structured data, try to decode as a regular message
            try:
                message = msg.decode('utf-8')
                print(f"Received message2: {message}")
            except UnicodeDecodeError:
                print(f"Received raw data: {msg}")
        
        # Send acknowledgment every 6th iteration
        if i % 6 == 0:
            client_socket.send(b'\x05')
        
        i += 1  # Increment i in each iteration
        time.sleep(0.1)  # Add a small delay to prevent CPU overload

except KeyboardInterrupt:
    print("\nClosing connection...")
    client_socket.send(b'\x02')
    time.sleep(2)
    client_socket.close()
except Exception as e:
    print(f"An error occurred: {e}")
    client_socket.close()

desk_manager.stop_updates()
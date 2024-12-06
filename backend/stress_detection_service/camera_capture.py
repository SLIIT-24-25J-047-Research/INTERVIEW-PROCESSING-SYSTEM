import cv2
import requests

def capture_and_predict():
    # Open the camera
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open camera.")
        return

    print("Press 'Space' to capture an image, or 'Esc' to exit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture frame.")
            break

        # Display the frame
        cv2.imshow('Camera', frame)

        # Wait for a key press
        key = cv2.waitKey(1)
        if key == 27:  # Esc key to exit
            break
        elif key == 32:  # Space key to capture
            # Save the frame
            image_path = "captured_image.jpg"
            cv2.imwrite(image_path, frame)
            print(f"Image captured and saved as {image_path}")

            # Send the image to the Flask API
            with open(image_path, 'rb') as img_file:
                response = requests.post("http://127.0.0.1:5002/detect-stress", files={"image": img_file})
                if response.status_code == 200:
                    print("Stress Level Prediction:", response.json())
                else:
                    print("Error:", response.text)
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    capture_and_predict()

from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.optimizers import Adam
import numpy as np
import cv2
import base64
import re

app = Flask(__name__)
CORS(app, origins=["http://localhost:3002"])

model = load_model("model.h5", compile=False)
model.compile(optimizer=Adam(learning_rate=0.0005),
              loss='categorical_crossentropy',
              metrics=['accuracy'])

emotion_labels = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"]

def preprocess_face(face_image):
    resized = cv2.resize(face_image, (48, 48))
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    normalized = gray.astype("float32") / 255.0
    return np.expand_dims(normalized, axis=(0, -1))

@app.route("/predict_emotion", methods=["POST"])
def predict_emotion_route():
    data = request.json
    img_data = data.get("image", "")

    img_str = re.sub('^data:image/.+;base64,', '', img_data)
    img_bytes = base64.b64decode(img_str)

    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    try:
        preprocessed = preprocess_face(img)
        predictions = model.predict(preprocessed, verbose=0)
        emotion_index = int(np.argmax(predictions))
        emotion = emotion_labels[emotion_index]
    except Exception as e:
        print(f"Prediction error: {e}")
        emotion = "neutral"

    return jsonify({"emotion": emotion})

if __name__ == "__main__":
    app.run(host="localhost", port=5002, debug=True)



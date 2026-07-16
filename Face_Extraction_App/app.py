"""
Face Extractor — backend API

Accepts an uploaded image, runs Haar-cascade face detection,
crops each detected face, and returns them as base64-encoded
JPEGs along with their bounding boxes.
"""

import base64
import os

import cv2
import numpy as np
from flask import (
    Flask,
    jsonify,
    request,
    render_template
)
from flask_cors import CORS

app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static"
)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CASCADE_PATH = os.path.join(BASE_DIR, "haarcascades", "haarcascade_frontalface_default.xml")

face_cascade = cv2.CascadeClassifier(CASCADE_PATH)
if face_cascade.empty():
    raise RuntimeError(f"Could not load cascade file at {CASCADE_PATH}")


def detect_and_crop_faces(image_bytes: bytes):
    """Run face detection on raw image bytes, return (annotated_b64, list of face dicts)."""
    file_bytes = np.frombuffer(image_bytes, dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Could not decode image. Please upload a valid JPG or PNG.")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.15,
        minNeighbors=8,
        minSize=(80, 80),
        flags=cv2.CASCADE_SCALE_IMAGE
    )
    

    results = []
    annotated = img.copy()

    for i, (x, y, w, h) in enumerate(faces, start=1):
        face_crop = img[y:y + h, x:x + w]
        ok, buf = cv2.imencode(".jpg", face_crop)
        if not ok:
            continue
        face_b64 = base64.b64encode(buf).decode("utf-8")

        results.append({
            "id": i,
            "box": {"x": int(x), "y": int(y), "w": int(w), "h": int(h)},
            "image": f"data:image/jpeg;base64,{face_b64}",
        })

        cv2.rectangle(annotated, (x, y), (x + w, y + h), (46, 125, 115), 3)
        cv2.putText(
            annotated, f"#{i}", (x, max(y - 10, 15)),
            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (46, 125, 115), 2, cv2.LINE_AA,
        )

    ok, ann_buf = cv2.imencode(".jpg", annotated)
    annotated_b64 = base64.b64encode(ann_buf).decode("utf-8") if ok else None

    return annotated_b64, results

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/extract-faces", methods=["POST"])
def extract_faces():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided. Send it under the 'image' field."}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename."}), 400

    try:
        image_bytes = file.read()
        annotated_b64, faces = detect_and_crop_faces(image_bytes)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {e}"}), 500

    return jsonify({
        "faceCount": len(faces),
        "annotatedImage": f"data:image/jpeg;base64,{annotated_b64}" if annotated_b64 else None,
        "faces": faces,
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)

# 🎯 AI Face Extraction Studio

A modern AI-powered web application built with **Flask** and **OpenCV** that automatically detects human faces in an uploaded image, extracts each detected face, and allows users to preview and download them individually or all at once through an intuitive dashboard.

The application combines a responsive frontend with a Flask backend to provide a seamless face extraction experience using the Haar Cascade face detection algorithm.

---

# 📌 Features

* 🖼️ Upload images using drag-and-drop or file browser
* 🤖 Automatic face detection using OpenCV Haar Cascade
* ✂️ Extract and crop multiple faces from a single image
* 👀 Live preview of uploaded and processed images
* 📊 Dashboard displaying:

  * Number of faces detected
  * Processing time
  * Image resolution
  * File size
* 🖼️ Face gallery for all detected faces
* 📥 Download individual extracted faces
* 📦 Download all extracted faces
* 🌙 Dark Mode support
* 🔔 Toast notifications
* ⏳ Animated loading screen with progress bar
* 📱 Fully responsive UI for desktop, tablet, and mobile devices
* ✨ Modern Glassmorphism-based AI dashboard

---

# 🛠️ Technologies Used

### Backend

* Python
* Flask
* Flask-CORS
* OpenCV
* NumPy

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)
* Font Awesome

### AI / Computer Vision

* OpenCV Haar Cascade Classifier
* Image Processing
* Face Detection

---

# 📂 Project Structure

```text
FaceExtractionApp/
│
├── app.py
├── requirements.txt
│
├── templates/
│     └── index.html
│
├── static/
│     ├── style.css
│     ├── script.js
│     └── images/
│
├── uploads/
│
├── extracted_faces/
│
└── haarcascades/
      └── haarcascade_frontalface_default.xml
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/your-username/AI-Face-Extraction-Studio.git
```

---

## 2. Navigate to the project

```bash
cd AI-Face-Extraction-Studio
```

---

## 3. Create a virtual environment (Recommended)

Windows

```bash
python -m venv venv
venv\Scripts\activate
```

Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 4. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 5. Run the Flask application

```bash
python app.py
```

---

## 6. Open in browser

```
http://localhost:5000
```

---

# 📤 How to Use

1. Launch the Flask application.
2. Open **http://localhost:5000** in your browser.
3. Upload an image by dragging it into the upload area or selecting it using the Browse button.
4. Click **Extract Faces**.
5. The application detects all faces automatically.
6. Preview the annotated image and extracted faces.
7. Download individual faces or all detected faces.

---

# 🧠 How It Works

1. The user uploads an image.
2. Flask receives the image through the REST API.
3. OpenCV decodes the image.
4. The Haar Cascade classifier detects faces.
5. Each detected face is cropped.
6. Cropped faces are encoded into Base64 format.
7. The backend returns:

   * Annotated image
   * Number of faces
   * Bounding box coordinates
   * Extracted face images
8. JavaScript dynamically updates the dashboard.

---

# 📸 Face Detection Pipeline

```
Image Upload
      │
      ▼
Flask Backend
      │
      ▼
OpenCV Image Processing
      │
      ▼
Haar Cascade Face Detection
      │
      ▼
Face Cropping
      │
      ▼
Base64 Encoding
      │
      ▼
JSON Response
      │
      ▼
Interactive Dashboard
```

---

# 📡 API Endpoints

## Health Check

```
GET /api/health
```

Response

```json
{
    "status": "ok"
}
```

---

## Face Extraction

```
POST /api/extract-faces
```

Form Data

```
image
```

Example Response

```json
{
    "faceCount": 3,
    "annotatedImage": "...",
    "faces": [
        {
            "id": 1,
            "box": {
                "x": 95,
                "y": 74,
                "w": 142,
                "h": 142
            },
            "image": "..."
        }
    ]
}
```

---

# 📊 Future Enhancements

* Deep Learning face detector (DNN)
* YOLO Face Detection
* MTCNN integration
* RetinaFace integration
* Face Recognition
* Face Mask Detection
* Age & Gender Prediction
* Emotion Recognition
* Batch image processing
* ZIP download support
* PDF extraction report
* Face similarity search
* Cloud deployment
* User authentication
* Image history

---

# 💡 Applications

* Attendance Systems
* Face Dataset Creation
* Security & Surveillance
* AI Research
* Identity Verification
* Image Annotation
* Dataset Preparation
* Smart Photo Management

---

# 📷 Screenshots

Add screenshots of:

* Dashboard
* Image Upload
* Face Detection
* Face Gallery
* Dark Mode

inside the repository.

Example

```
screenshots/
├── dashboard.png
├── upload.png
├── detected_faces.png
└── dark_mode.png
```

---

# 📋 Requirements

```
Python 3.9+

Flask

Flask-CORS

OpenCV

NumPy
```

---

# 🚀 Performance

* Fast face detection
* Lightweight architecture
* Supports multiple faces
* Responsive dashboard
* Minimal memory usage
* Easy deployment

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```
git checkout -b feature-name
```

3. Commit changes

```
git commit -m "Added new feature"
```

4. Push changes

```
git push origin feature-name
```

5. Open a Pull Request

---

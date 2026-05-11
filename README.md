# Ornis  
### Bird Species Classification via Image and Audio

Ornis is a machine learning based web application that predicts bird species from **images** and **audio recordings**.  
It provides two independent classification pipelines powered by ShuffleNet V2 models.

## Features
- Bird classification from **image uploads**
- Bird classification from **audio uploads**
- Minimal UI with no layout shift
- Supported species list modal
- FastAPI backend with PyTorch inference
- Audio pipeline includes preprocessing + chunk-based majority voting

---

## Models Used
- **Image Model:** ShuffleNet V2 (trained on bird images)
- **Audio Model:** ShuffleNet V2 (trained on mel-spectrogram images)

---

## Audio Pipeline
1. Load audio using Librosa
2. Normalize + noise reduction
3. Trim silence
4. Chunk into fixed duration segments
5. Convert each chunk into a mel-spectrogram image
6. Predict each chunk
7. Final output selected using **majority voting**

---

## Image Pipeline
1. Convert to RGB
2. Resize to 224×224
3. Convert to tensor
4. Normalize using ImageNet mean/std
5. Predict using ShuffleNet V2

---

## Deployment Notes
- Free hosting may cause slower first prediction due to **server cold start** and **model warm-up**
- Limited number of supported species due to financial and hardware constraints (dataset size + training compute)

---

## Project Structure

```

Ornis/
│
├── frontend/                  # React + TypeScript frontend
│   └── src/
│       ├── Pages/             # PredictImage, PredictAudio, Home
│       ├── Layout/            # Sidebar layout
│       ├── components/        # InfoModal, reusable UI
│       ├── App.tsx
│       └── main.tsx
│
└── backend/                   # FastAPI backend + ML inference
├── api/                   # API routes / utilities
├── ml/                    # ML pipeline code
├── models/                # Trained model weights
├── config.py
├── main.py
└── requirements.txt

````

---

## Getting Started (Local Setup)

### 1. Clone Repository
```bash
git clone https://github.com/YaswanthRJ/Ornis.git
cd Ornis
````

---

## Frontend Setup

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Start Frontend

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## Backend Setup

### 4. Create Virtual Environment (Recommended)

```bash
cd ../backend
python -m venv venv
```

Activate:

**Windows (PowerShell):**

```bash
venv\Scripts\Activate.ps1
```

**Mac/Linux:**

```bash
source venv/bin/activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

### 6. Run Backend Server

```bash
uvicorn main:app --reload --port 8000
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

## API Endpoints

* `POST /predict/image`
* `POST /predict/audio`

---

## Notes

* First prediction may be slow because models need to warm up.
* For best performance, keep the backend running continuously.


# Bird Classifier API

A minimal FastAPI backend for classifying birds from images and audio recordings. Uses ShuffleNet-based models trained on Indian bird species.

## Project Structure

```
bird_classifier/
├── main.py                  # App entry point
├── config.py                # Class labels, paths, constants
├── requirements.txt
├── api/
│   └── routes.py            # HTTP endpoints
└── ml/
    ├── models.py            # Model loader (runs once at startup)
    ├── image_classifier.py  # Image preprocessing + inference
    └── audio_classifier.py  # Audio preprocessing + spectrogram + inference
```

## Requirements

- Python 3.10+
- Model weight files placed in a `models/` directory at the project root:
  - `models/model_image_state.pth`
  - `models/model_audio_state.pth`

## Setup

```bash
pip install -r requirements.txt
```

## Running

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.  
Interactive docs (Swagger UI) at `http://localhost:8000/docs`.

---

## Endpoints

### `POST /predict/image`

Classifies a bird from a photo.

**Request:** `multipart/form-data` with a single field `file` containing an image (JPEG, PNG, etc.)

**Response:**
```json
{ "predicted_class": "Indian-Roller" }
```

**Supported classes (25):**
Asian-Green-Bee-Eater, Brown-Headed-Barbet, Cattle-Egret, Common-Kingfisher, Common-Myna, Common-Rosefinch, Common-Tailorbird, Coppersmith-Barbet, Forest-Wagtail, Gray-Wagtail, Hoopoe, House-Crow, Indian-Grey-Hornbill, Indian-Peacock, Indian-Pitta, Indian-Roller, Jungle-Babbler, Northern-Lapwing, Red-Wattled-Lapwing, Ruddy-Shelduck, Rufous-Treepie, Sarus-Crane, White-Breasted-Kingfisher, White-Breasted-Waterhen, White-Wagtail

---

### `POST /predict/audio`

Classifies a bird from an audio recording. Longer recordings are split into 15-second chunks and the majority prediction is returned.

**Request:** `multipart/form-data` with a single field `file` containing an audio file (WAV, MP3, FLAC, etc.)

**Response:**
```json
{ "predicted_class": "Asian_koel" }
```

**Supported classes (15):**
Asian_koel, Black_kite, Common_Hawk-Cuckoo, Common_Tailorbird, Coppersmith_Barbet_pr, Greater_Coucal, House_Crow, Indian_Cuckoo, Indian_Peafowl, Jungle_Babbler, Pied_Bush_Chat, Red_junglefowl, Rose-Ringed_Parakeet, Throated_Kingfisher_pr, White_breasted_Waterhen

---

## Example Usage

**curl:**
```bash
# Image
curl -X POST http://localhost:8000/predict/image \
  -F "file=@/path/to/bird.jpg"

# Audio
curl -X POST http://localhost:8000/predict/audio \
  -F "file=@/path/to/recording.wav"
```

**Python (requests):**
```python
import requests

# Image
with open("bird.jpg", "rb") as f:
    r = requests.post("http://localhost:8000/predict/image", files={"file": f})
print(r.json())  # {"predicted_class": "Hoopoe"}

# Audio
with open("recording.wav", "rb") as f:
    r = requests.post("http://localhost:8000/predict/audio", files={"file": f})
print(r.json())  # {"predicted_class": "Asian_koel"}
```

---

## Audio Processing Pipeline

1. **Normalize** — peak amplitude scaled to [-1, 1]
2. **Noise reduction** — via `noisereduce`
3. **Trim** — leading/trailing silence removed (30 dB threshold)
4. **Chunk** — split into 15-second segments (shorter clips are zero-padded)
5. **Spectrogram** — each chunk converted to a mel spectrogram image
6. **Inference** — ShuffleNetV2 runs on each spectrogram
7. **Majority vote** — most frequent prediction across chunks is returned

## Notes

- Both models are loaded once at startup and reused across all requests.
- Audio files are written to a system temp directory and deleted after inference regardless of success or failure.
- The server does not store any uploaded files.

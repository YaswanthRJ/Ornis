import os
import uuid
import time
import logging
import tempfile
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from ml.models import image_model, audio_model
from ml.image_classifier import predict_image
from ml.audio_classifier import predict_audio

router = APIRouter()
log = logging.getLogger("routes")


class PredictionResponse(BaseModel):
    predicted_class: str


@router.post("/predict/image", response_model=PredictionResponse)
async def predict_image_endpoint(file: UploadFile = File(...)):
    log.info(f"[request] POST /predict/image  filename={file.filename}  content_type={file.content_type}")
    t = time.perf_counter()

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    raw = await file.read()
    log.info(f"[request] file read: {len(raw)/1024:.1f} KB")

    label = predict_image(image_model, raw)

    log.info(f"[request] /predict/image completed in {time.perf_counter()-t:.2f}s  →  {label}")
    return PredictionResponse(predicted_class=label)


@router.post("/predict/audio", response_model=PredictionResponse)
async def predict_audio_endpoint(file: UploadFile = File(...)):
    log.info(f"[request] POST /predict/audio  filename={file.filename}  content_type={file.content_type}")
    t = time.perf_counter()

    suffix = os.path.splitext(file.filename)[-1] or ".wav"
    tmp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}{suffix}")

    try:
        raw = await file.read()
        log.info(f"[request] file read: {len(raw)/1024:.1f} KB")

        with open(tmp_path, "wb") as f:
            f.write(raw)

        label = predict_audio(audio_model, tmp_path)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    log.info(f"[request] /predict/audio completed in {time.perf_counter()-t:.2f}s  →  {label}")
    return PredictionResponse(predicted_class=label)
import os
import uuid
import tempfile
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from ml.models import image_model, audio_model
from ml.image_classifier import predict_image
from ml.audio_classifier import predict_audio

router = APIRouter()


class PredictionResponse(BaseModel):
    predicted_class: str


@router.post("/predict/image", response_model=PredictionResponse)
async def predict_image_endpoint(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    raw = await file.read()
    label = predict_image(image_model, raw)
    return PredictionResponse(predicted_class=label)


@router.post("/predict/audio", response_model=PredictionResponse)
async def predict_audio_endpoint(file: UploadFile = File(...)):
    suffix = os.path.splitext(file.filename)[-1] or ".wav"
    tmp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}{suffix}")
    try:
        with open(tmp_path, "wb") as f:
            f.write(await file.read())
        label = predict_audio(audio_model, tmp_path)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
    return PredictionResponse(predicted_class=label)

import time
import logging
import torch
import torchvision.transforms as T
import io
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import librosa
import noisereduce as nr
from PIL import Image
from config import (
    IMAGENET_MEAN, IMAGENET_STD,
    AUDIO_SAMPLE_RATE, AUDIO_CHUNK_DURATION, AUDIO_CLASSES,
)

log = logging.getLogger("audio_classifier")

_transform = T.Compose([
    T.Resize((224, 224)),
    T.Lambda(lambda x: x.convert("RGB")),
    T.ToTensor(),
    T.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])


def _load_audio(path: str) -> tuple[np.ndarray, int]:
    t = time.perf_counter()
    audio, sr = librosa.load(path, sr=AUDIO_SAMPLE_RATE)
    log.info(f"[audio] librosa.load: {time.perf_counter()-t:.2f}s  |  samples={len(audio)}  sr={sr}")
    return audio, sr


def _clean(audio: np.ndarray, sr: int) -> np.ndarray:
    t = time.perf_counter()
    audio = audio / (np.max(np.abs(audio)) + 1e-9)
    log.info(f"[audio] normalize: {time.perf_counter()-t:.3f}s")

    t = time.perf_counter()
    audio = nr.reduce_noise(y=audio, sr=sr)
    log.info(f"[audio] noise_reduce: {time.perf_counter()-t:.2f}s")

    t = time.perf_counter()
    audio, _ = librosa.effects.trim(audio, top_db=30)
    log.info(f"[audio] trim: {time.perf_counter()-t:.3f}s  |  trimmed_samples={len(audio)}")

    return audio


def _chunk(audio: np.ndarray, sr: int) -> list[np.ndarray]:
    target = AUDIO_CHUNK_DURATION * sr
    if len(audio) < target:
        chunks = [np.pad(audio, (0, target - len(audio)))]
    else:
        chunks = [audio[i: i + target] for i in range(0, len(audio), target)]
    log.info(f"[audio] chunking: {len(chunks)} chunk(s) of {AUDIO_CHUNK_DURATION}s each")
    return chunks


def _spectrogram_image(chunk: np.ndarray, sr: int) -> Image.Image:
    t = time.perf_counter()
    S_dB = librosa.power_to_db(librosa.feature.melspectrogram(y=chunk, sr=sr), ref=np.max)
    log.info(f"[audio] melspectrogram: {time.perf_counter()-t:.3f}s")

    t = time.perf_counter()
    fig, ax = plt.subplots(figsize=(2.24, 2.24), dpi=100)
    librosa.display.specshow(S_dB, sr=sr, cmap="magma", ax=ax)
    ax.axis("off")
    fig.tight_layout(pad=0)
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", pad_inches=0)
    plt.close(fig)
    buf.seek(0)
    log.info(f"[audio] spectrogram render: {time.perf_counter()-t:.3f}s")

    return Image.open(buf).convert("RGB")


def predict_audio(model: torch.nn.Module, tmp_path: str) -> str:
    total_start = time.perf_counter()
    log.info("[audio] === predict_audio START ===")

    audio, sr = _load_audio(tmp_path)
    audio = _clean(audio, sr)
    chunks = _chunk(audio, sr)

    predictions = []
    for i, chunk in enumerate(chunks):
        log.info(f"[audio] --- chunk {i+1}/{len(chunks)} ---")
        img = _spectrogram_image(chunk, sr)

        t = time.perf_counter()
        tensor = _transform(img).unsqueeze(0)
        with torch.no_grad():
            logits = model(tensor)
        pred = logits.argmax(dim=1).item()
        log.info(f"[audio] inference: {time.perf_counter()-t:.3f}s  |  predicted={AUDIO_CLASSES[pred]}")
        predictions.append(pred)

    majority = max(set(predictions), key=predictions.count)
    log.info(f"[audio] === predict_audio DONE  total={time.perf_counter()-total_start:.2f}s  result={AUDIO_CLASSES[majority]} ===")
    return AUDIO_CLASSES[majority]
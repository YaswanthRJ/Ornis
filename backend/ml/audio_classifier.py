import io
import numpy as np
import torch
import torchvision.transforms as T
import librosa
import noisereduce as nr
import matplotlib
matplotlib.use("Agg")           # non-interactive backend — no display needed
import matplotlib.pyplot as plt
from PIL import Image
from config import (
    IMAGENET_MEAN, IMAGENET_STD,
    AUDIO_SAMPLE_RATE, AUDIO_CHUNK_DURATION, AUDIO_CLASSES,
)

_transform = T.Compose([
    T.Resize((224, 224)),
    T.Lambda(lambda x: x.convert("RGB")),
    T.ToTensor(),
    T.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])


# ---------- audio helpers ----------

def _load_audio(path: str) -> tuple[np.ndarray, int]:
    return librosa.load(path, sr=AUDIO_SAMPLE_RATE)


def _clean(audio: np.ndarray, sr: int) -> np.ndarray:
    audio = audio / (np.max(np.abs(audio)) + 1e-9)
    audio = nr.reduce_noise(y=audio, sr=sr)
    audio, _ = librosa.effects.trim(audio, top_db=30)
    return audio


def _chunk(audio: np.ndarray, sr: int) -> list[np.ndarray]:
    target = AUDIO_CHUNK_DURATION * sr
    if len(audio) < target:
        return [np.pad(audio, (0, target - len(audio)))]
    return [audio[i : i + target] for i in range(0, len(audio), target)]


def _spectrogram_image(chunk: np.ndarray, sr: int) -> Image.Image:
    S_dB = librosa.power_to_db(librosa.feature.melspectrogram(y=chunk, sr=sr), ref=np.max)
    fig, ax = plt.subplots(figsize=(2.24, 2.24), dpi=100)
    librosa.display.specshow(S_dB, sr=sr, cmap="magma", ax=ax)
    ax.axis("off")
    fig.tight_layout(pad=0)
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", pad_inches=0)
    plt.close(fig)
    buf.seek(0)
    return Image.open(buf).convert("RGB")


# ---------- public API ----------

def predict_audio(model: torch.nn.Module, tmp_path: str) -> str:
    audio, sr = _load_audio(tmp_path)
    chunks = _chunk(_clean(audio, sr), sr)

    predictions = []
    for chunk in chunks:
        img = _spectrogram_image(chunk, sr)
        tensor = _transform(img).unsqueeze(0)
        with torch.no_grad():
            logits = model(tensor)
        predictions.append(logits.argmax(dim=1).item())

    majority = max(set(predictions), key=predictions.count)
    return AUDIO_CLASSES[majority]

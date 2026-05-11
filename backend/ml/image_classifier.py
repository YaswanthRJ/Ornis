import io
import time
import logging
import torch
import torchvision.transforms as T
from PIL import Image
from config import IMAGENET_MEAN, IMAGENET_STD, IMAGE_CLASSES

log = logging.getLogger("image_classifier")

_transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])


def preprocess_image(raw_bytes: bytes) -> torch.Tensor:
    image = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    return _transform(image).unsqueeze(0)


def predict_image(model: torch.nn.Module, raw_bytes: bytes) -> str:
    log.info("[image] === predict_image START ===")
    total_start = time.perf_counter()

    t = time.perf_counter()
    tensor = preprocess_image(raw_bytes)
    log.info(f"[image] preprocess: {time.perf_counter()-t:.3f}s")

    t = time.perf_counter()
    with torch.no_grad():
        logits = model(tensor)
    class_idx = logits.argmax(dim=1).item()
    log.info(f"[image] inference: {time.perf_counter()-t:.3f}s  |  predicted={IMAGE_CLASSES[class_idx]}")

    log.info(f"[image] === predict_image DONE  total={time.perf_counter()-total_start:.3f}s ===")
    return IMAGE_CLASSES[class_idx]
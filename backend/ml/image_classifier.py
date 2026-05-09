import io
import torch
import torchvision.transforms as T
from PIL import Image
from config import IMAGENET_MEAN, IMAGENET_STD, IMAGE_CLASSES

_transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])


def preprocess_image(raw_bytes: bytes) -> torch.Tensor:
    image = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    return _transform(image).unsqueeze(0)          # (1, 3, 224, 224)


def predict_image(model: torch.nn.Module, raw_bytes: bytes) -> str:
    tensor = preprocess_image(raw_bytes)
    with torch.no_grad():
        logits = model(tensor)
    class_idx = logits.argmax(dim=1).item()
    return IMAGE_CLASSES[class_idx]

import torch
import torch.nn as nn
from torchvision import models
from config import (
    IMAGE_MODEL_PATH, AUDIO_MODEL_PATH,
    IMAGE_NUM_CLASSES, AUDIO_NUM_CLASSES,
)


def load_image_model() -> nn.Module:
    model = models.shufflenet_v2_x1_0(pretrained=False)
    model.fc = nn.Linear(1024, IMAGE_NUM_CLASSES)
    model.load_state_dict(torch.load(IMAGE_MODEL_PATH, map_location="cpu"))
    model.eval()
    return model


def load_audio_model() -> nn.Module:
    model = models.shufflenet_v2_x2_0(pretrained=False)
    model.fc = nn.Linear(model.fc.in_features, AUDIO_NUM_CLASSES)
    model.load_state_dict(torch.load(AUDIO_MODEL_PATH, map_location="cpu"))
    model.eval()
    return model


# Singletons — loaded once when the module is first imported
image_model: nn.Module = load_image_model()
audio_model: nn.Module = load_audio_model()

from pathlib import Path

# Paths
MODEL_DIR = Path("models")
IMAGE_MODEL_PATH = MODEL_DIR / "model_image_state.pth"
AUDIO_MODEL_PATH = MODEL_DIR / "model_audio_state.pth"

# Image model
IMAGE_NUM_CLASSES = 25
IMAGE_CLASSES = {
    0: "Asian Green Bee Eater",    1: "Brown Headed Barbet",
    2: "Cattle Egret",             3: "Common Kingfisher",
    4: "Common Myna",              5: "Common Rosefinch",
    6: "Common Tailorbird",        7: "Coppersmith Barbet",
    8: "Forest Wagtail",           9: "Gray Wagtail",
    10: "Hoopoe",                  11: "House Crow",
    12: "Indian Grey Hornbill",    13: "Indian Peacock",
    14: "Indian Pitta",            15: "Indian Roller",
    16: "Jungle Babbler",          17: "Northern Lapwing",
    18: "Red Wattled Lapwing",     19: "Ruddy Shelduck",
    20: "Rufous Treepie",          21: "Sarus Crane",
    22: "White Breasted Kingfisher", 23: "White Breasted-Waterhen",
    24: "White Wagtail",
}

# Audio model
AUDIO_NUM_CLASSES = 15
AUDIO_SAMPLE_RATE = 16000
AUDIO_CHUNK_DURATION = 15  # seconds
AUDIO_CLASSES = {
    0: "Asian koel",              1: "Black kite",
    2: "Common Hawk Cuckoo",      3: "Common Tailorbird",
    4: "Coppersmith Barbet",   5: "Greater Coucal",
    6: "House Crow",              7: "Indian Cuckoo",
    8: "Indian Peafowl",          9: "Jungle Babbler",
    10: "Pied Bush Chat",         11: "Red junglefowl",
    12: "Rose Ringed Parakeet",   13: "Throated Kingfisher",
    14: "White breasted Waterhen",
}

# Normalization stats (ImageNet)
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]

# import json, torch, torch.nn as nn
# from torchvision import models

# DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# def load_labels(path="class_names.json"):
#     with open(path, "r", encoding="utf-8") as f:
#         return json.load(f)

# def build_model(num_classes):
#     m = models.resnet18(weights=None)       # weights already learned in your .pth
#     m.fc = nn.Linear(m.fc.in_features, num_classes)
#     return m

# def load_model(weights_path, num_classes):
#     model = build_model(num_classes)
#     state = torch.load(weights_path, map_location=DEVICE)
#     model.load_state_dict(state)
#     model.to(DEVICE)
#     model.eval()
#     return model
import json
import torch
import torch.nn as nn
from torchvision import models

# Device configuration
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_labels(path="class_names.json"):
    """Load class labels from JSON file."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def build_model(num_classes):
    """Build ResNet18 model with final layer replaced."""
    model = models.resnet18(weights=None)  # pretrained weights not used here
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model

def load_model(weights_path, num_classes):
    """Load model with trained weights."""
    model = build_model(num_classes)
    state = torch.load(weights_path, map_location=DEVICE)
    model.load_state_dict(state)
    model.to(DEVICE)
    model.eval()
    return model

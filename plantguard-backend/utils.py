# from torchvision import transforms
# from PIL import Image
# import torch

# IMAGENET_MEAN = [0.485, 0.456, 0.406]
# IMAGENET_STD  = [0.229, 0.224, 0.225]

# val_transform = transforms.Compose([
#     transforms.Resize(256),
#     transforms.CenterCrop(224),
#     transforms.ToTensor(),
#     transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD)
# ])

# def load_image_bytes(image_bytes):
#     img = Image.open(image_bytes).convert("RGB")
#     return img

# @torch.no_grad()
# def predict_tensor(model, tensor):
#     model.eval()
#     out = model(tensor)
#     probs = torch.softmax(out, dim=1)
#     conf, cls = probs.max(dim=1)
#     return cls.item(), float(conf.item())
from PIL import Image
from torchvision import transforms
import torch

# Validation transformations (match model training)
val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def load_image_bytes(image_bytes):
    """Load image from byte stream."""
    return Image.open(image_bytes).convert("RGB")

def predict_tensor(model, tensor):
    """Predict class index and confidence for given tensor."""
    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.nn.functional.softmax(outputs, dim=1)
        conf, pred = torch.max(probs, dim=1)
        return pred.item(), conf.item()

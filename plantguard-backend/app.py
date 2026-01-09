# import io
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch

from utils import val_transform, load_image_bytes, predict_tensor
from model import load_labels, load_model, DEVICE

# --- Bootstrap phase ---
LABELS = load_labels("class_names.json")
NUM_CLASSES = len(LABELS)
MODEL = load_model("plantvillage_resnet18_final.pth", NUM_CLASSES)

# Load remedies JSON (from local file)
with open("remedies_seed.json", "r", encoding="utf-8") as f:
    REMEDY_DB = {
        item["diseaseName"].strip().lower(): item
        for item in json.load(f)
    }

def normalize_for_lookup(name: str) -> str:
    """Normalize prediction name to match JSON keys."""
    return (
        name.replace("__", "_")
            .replace(" ", "_")
            .strip()
            .lower()
    )

def find_remedy_for(label: str):
    """Find remedies and pesticides for a given predicted label."""
    key = label.strip().lower()
    if key in REMEDY_DB:
        return REMEDY_DB[key]
    # fallback fuzzy match
    for k, v in REMEDY_DB.items():
        if key in k or k in key:
            return v
    return None

# --- Flask App ---
app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "message": "PlantGuard backend active ✅"})

@app.route("/predict", methods=["POST"])
def predict():
    """Predict plant disease from uploaded leaf image."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    img = load_image_bytes(file.stream)
    tensor = val_transform(img).unsqueeze(0).to(DEVICE)

    cls_id, conf = predict_tensor(MODEL, tensor)
    disease_label = LABELS[cls_id]

    remedy = find_remedy_for(disease_label)
    resp = {
        "prediction": disease_label,
        "confidence": round(conf * 100, 2),
        "remedies": remedy["remedies"] if remedy else [],
        "pesticides": remedy["pesticides"] if remedy else [],
    }
    print(f"🧠 Predicted: {disease_label} ({resp['confidence']}%)")
    return jsonify(resp)

if __name__ == "__main__":
    # Run Flask backend
    app.run(host="0.0.0.0", port=5001, debug=False)

# # import io
# # import json
# # import torch
# # import torch.nn as nn
# # from torchvision import models, transforms
# # from PIL import Image
# # from flask import Flask, request, jsonify
# # from flask_cors import CORS

# # # =========================
# # # DEVICE CONFIG
# # # =========================
# # DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# # print("✅ Using device:", DEVICE)

# # # =========================
# # # IMAGE TRANSFORM (same as training)
# # # =========================
# # val_transform = transforms.Compose([
# #     transforms.Resize((224, 224)),
# #     transforms.ToTensor(),
# #     transforms.Normalize(mean=[0.485, 0.456, 0.406],
# #                          std=[0.229, 0.224, 0.225])
# # ])

# # # =========================
# # # MODEL LOADING
# # # =========================
# # def build_model(num_classes):
# #     model = models.resnet18(weights=None)
# #     model.fc = nn.Linear(model.fc.in_features, num_classes)
# #     return model

# # def load_labels(path="class_names.json"):
# #     with open(path, "r", encoding="utf-8") as f:
# #         return json.load(f)

# # def load_model(weights_path, num_classes):
# #     model = build_model(num_classes)
# #     state = torch.load(weights_path, map_location=DEVICE)
# #     model.load_state_dict(state)
# #     model.to(DEVICE)
# #     model.eval()
# #     print("✅ Model loaded successfully!")
# #     return model

# # def load_image_bytes(image_bytes):
# #     image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
# #     return image

# # def predict_tensor(model, tensor):
# #     with torch.no_grad():
# #         outputs = model(tensor)
# #         probs = torch.nn.functional.softmax(outputs, dim=1)
# #         conf, cls_id = torch.max(probs, 1)
# #         return cls_id.item(), conf.item()

# # # =========================
# # # LOAD MODEL + LABELS
# # # =========================
# # LABELS = load_labels("class_names.json")
# # NUM_CLASSES = len(LABELS)
# # MODEL = load_model("plantvillage_resnet18_final.pth", NUM_CLASSES)

# # # =========================
# # # LOAD REMEDIES DATA
# # # =========================
# # with open("remedies_seed.json", "r", encoding="utf-8") as f:
# #     raw_remedies = json.load(f)

# # # Build lookup maps (exact and lowercase)
# # REMEDY_DB = {}
# # for item in raw_remedies:
# #     name = item["diseaseName"].strip()
# #     REMEDY_DB[name] = item
# #     REMEDY_DB[name.lower()] = item  # lowercase fallback

# # def find_remedy_for(label: str):
# #     if label in REMEDY_DB:
# #         print(f"✅ Found exact remedy match for {label}")
# #         return REMEDY_DB[label]
# #     if label.lower() in REMEDY_DB:
# #         print(f"✅ Found lowercase remedy match for {label}")
# #         return REMEDY_DB[label.lower()]
    
# #     print(f"⚠️ No remedy found for {label}, returning fallback advice.")
# #     return {
# #         "diseaseName": label,
# #         "remedies": [
# #             "Maintain proper spacing and airflow between plants.",
# #             "Remove infected leaves immediately to prevent spread.",
# #             "Use disease-free seeds and avoid overhead irrigation."
# #         ],
# #         "pesticides": [
# #             "Copper oxychloride (2–3 g/L)",
# #             "Mancozeb (2 g/L)",
# #             "Neem oil (5 ml/L)"
# #         ]
# #     }

# # # =========================
# # # FLASK APP
# # # =========================
# # app = Flask(__name__)
# # CORS(app)  # Enable CORS for frontend communication

# # @app.route("/health", methods=["GET"])
# # def health():
# #     return jsonify({"status": "ok", "device": str(DEVICE)})

# # @app.route("/predict", methods=["POST"])
# # def predict():
# #     if "file" not in request.files:
# #         return jsonify({"error": "No file uploaded"}), 400

# #     file = request.files["file"]
# #     img_bytes = file.read()
# #     image = load_image_bytes(img_bytes)

# #     tensor = val_transform(image).unsqueeze(0).to(DEVICE)
# #     cls_id, conf = predict_tensor(MODEL, tensor)

# #     disease_label = LABELS[cls_id]
# #     print(f"🧠 Predicted: {disease_label} ({conf*100:.2f}%)")

# #     remedy = find_remedy_for(disease_label)
# #     response = {
# #         "prediction": disease_label,
# #         "confidence": round(conf * 100, 2),
# #         "remedies": remedy["remedies"],
# #         "pesticides": remedy["pesticides"]
# #     }

# #     return jsonify(response)

# # # =========================
# # # MAIN ENTRY
# # # =========================
# # if __name__ == "__main__":
# #     print("🚀 Starting Flask server at http://127.0.0.1:5001 ...")
# #     app.run(host="0.0.0.0", port=5001, debug=False)

# @app.route("/predict", methods=["POST"])
# def predict():
#     if "file" not in request.files:
#         return jsonify({"error": "file is required"}), 400

#     file = request.files["file"]
#     img = load_image_bytes(file.stream)
#     tensor = val_transform(img).unsqueeze(0).to(DEVICE)

#     cls_id, conf = predict_tensor(MODEL, tensor)
#     disease_label = LABELS[cls_id]

#     # --- Case 1: Healthy leaf
#     if "healthy" in disease_label.lower():
#         return jsonify({
#             "prediction": disease_label,
#             "confidence": round(conf * 100, 2),
#             "remedies": [],
#             "pesticides": [],
#             "message": "🌱 Healthy leaf detected – no remedies or pesticides required."
#         })

#     # --- Case 2: Try to find matching entry in JSON
#     remedy = find_remedy_for(disease_label)

#     # --- Case 3: Fallbacks if not found
#     fallback_remedies_sets = [
#         [
#             "Remove infected leaves immediately.",
#             "Improve air circulation around plants.",
#             "Avoid overhead watering to reduce humidity."
#         ],
#         [
#             "Apply neem oil spray once every 7 days.",
#             "Sterilize garden tools to prevent spread.",
#             "Use well-draining soil to avoid fungus."
#         ],
#         [
#             "Trim surrounding weeds and infected plants.",
#             "Maintain balanced fertilization to boost immunity.",
#             "Disinfect with baking soda or copper spray."
#         ],
#         [
#             "Monitor leaf undersides for fungal spots.",
#             "Avoid excess nitrogen fertilizer.",
#             "Rotate crops annually to reduce soil pathogens."
#         ],
#         [
#             "Use disease-free seeds and avoid over-irrigation.",
#             "Destroy heavily infected leaves away from the field.",
#             "Increase potassium fertilizer to improve resistance."
#         ]
#     ]

#     fallback_pesticides_sets = [
#         ["Mancozeb (2 g/L)", "Copper oxychloride (1 ml/L)"],
#         ["Carbendazim (1 g/L)", "Propiconazole (1 ml/L)"],
#         ["Captan (2 g/L)", "Thiophanate-methyl (1 g/L)"],
#         ["Tricyclazole (0.6 g/L)", "Metalaxyl (1.25 g/L)"],
#         ["Tebuconazole (0.75 ml/L)", "Dimethomorph (1 ml/L)"]
#     ]

#     import random
#     random_remedies = random.choice(fallback_remedies_sets)
#     random_pesticides = random.choice(fallback_pesticides_sets)

#     # --- If nothing found, use fallback
#     final_remedies = remedy["remedies"] if remedy else random_remedies
#     final_pesticides = remedy["pesticides"] if remedy else random_pesticides

#     message = (
#         "✅ Specific remedies and pesticides found from database."
#         if remedy else
#         "⚠️ Showing general AI fallback remedies and pesticides."
#     )

#     return jsonify({
#         "prediction": disease_label,
#         "confidence": round(conf * 100, 2),
#         "remedies": final_remedies,
#         "pesticides": final_pesticides,
#         "message": message
#     })
# import io, json, random, torch
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import torch.nn as nn
# from torchvision import models

# from utils import val_transform, load_image_bytes, predict_tensor

# # ------------------------- SETUP -------------------------
# DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# # Load class labels
# def load_labels(path="class_names.json"):
#     with open(path, "r", encoding="utf-8") as f:
#         return json.load(f)

# # Build ResNet18 model
# def build_model(num_classes):
#     m = models.resnet18(weights=None)
#     m.fc = nn.Linear(m.fc.in_features, num_classes)
#     return m

# # Load pretrained weights
# def load_model(weights_path, num_classes):
#     model = build_model(num_classes)
#     state = torch.load(weights_path, map_location=DEVICE)
#     model.load_state_dict(state)
#     model.to(DEVICE)
#     model.eval()
#     return model


# # ------------------------- INITIALIZE -------------------------
# LABELS = load_labels("class_names.json")
# NUM_CLASSES = len(LABELS)
# MODEL = load_model("plantvillage_resnet18_final.pth", NUM_CLASSES)

# # Load remedies database
# with open("remedies_seed.json", "r", encoding="utf-8") as f:
#     REMEDY_DB = {item["diseaseName"].strip().lower(): item for item in json.load(f)}


# def normalize_for_lookup(name: str) -> str:
#     """Normalize disease label for matching."""
#     return (
#         name.replace("Tomato_", "Tomato ")
#         .replace("__", " ")
#         .replace("_", " ")
#         .replace("Two spotted", "Two-spotted")
#         .replace("YellowLeaf  Curl", "Yellow Leaf Curl")
#         .strip()
#         .lower()
#     )


# def find_remedy_for(label: str):
#     """Find remedies in database (fuzzy match)."""
#     key = normalize_for_lookup(label)
#     if key in REMEDY_DB:
#         return REMEDY_DB[key]
#     for k, v in REMEDY_DB.items():
#         if key in k or k in key:
#             return v
#     return None


# # ------------------------- FLASK APP -------------------------
# app = Flask(__name__)
# CORS(app)

# @app.route("/health", methods=["GET"])
# def health():
#     return jsonify({"status": "ok", "device": str(DEVICE)})


# @app.route("/predict", methods=["POST"])
# def predict():
#     if "file" not in request.files:
#         return jsonify({"error": "file is required"}), 400

#     file = request.files["file"]
#     img = load_image_bytes(file.stream)
#     tensor = val_transform(img).unsqueeze(0).to(DEVICE)

#     # Model inference
#     cls_id, conf = predict_tensor(MODEL, tensor)
#     disease_label = LABELS[cls_id]

#     # Case 1: Healthy plant
#     if "healthy" in disease_label.lower():
#         return jsonify({
#             "prediction": disease_label,
#             "confidence": round(conf * 100, 2),
#             "remedies": [],
#             "pesticides": [],
#             "healthy": True
#         })

#     # Case 2: Try to get from remedies_seed.json
#     remedy = find_remedy_for(disease_label)

#     # Case 3: Fallbacks if not found
#     fallback_remedies_sets = [
#         ["Remove infected leaves and debris.", "Apply neem oil weekly.", "Avoid overhead watering."],
#         ["Trim weeds near infected area.", "Improve ventilation.", "Disinfect pruning tools regularly."],
#         ["Use disease-free seeds.", "Rotate crops each season.", "Maintain proper soil drainage."],
#         ["Destroy heavily infected leaves.", "Ensure proper sunlight.", "Spray mild copper fungicide weekly."],
#         ["Avoid over-fertilizing plants.", "Water early morning.", "Maintain humidity below 60%."]
#     ]

#     fallback_pesticides_sets = [
#         ["Mancozeb (2 g/L)", "Copper oxychloride (1 ml/L)"],
#         ["Carbendazim (1 g/L)", "Propiconazole (1 ml/L)"],
#         ["Captan (2 g/L)", "Thiophanate-methyl (1 g/L)"],
#         ["Metalaxyl (1.25 g/L)", "Dimethomorph (1 ml/L)"],
#         ["Tebuconazole (0.75 ml/L)", "Chlorothalonil (1.5 g/L)"]
#     ]

#     random_remedies = random.choice(fallback_remedies_sets)
#     random_pesticides = random.choice(fallback_pesticides_sets)

#     final_remedies = remedy["remedies"] if remedy else random_remedies
#     final_pesticides = remedy["pesticides"] if remedy else random_pesticides

#     # Return response
#     return jsonify({
#         "prediction": disease_label,
#         "confidence": round(conf * 100, 2),
#         "remedies": final_remedies,
#         "pesticides": final_pesticides,
#         "healthy": False
#     })


# # ------------------------- MAIN -------------------------
# if __name__ == "__main__":
#     print("🚀 Backend running on http://127.0.0.1:5001")
#     app.run(host="0.0.0.0", port=5001, debug=False)

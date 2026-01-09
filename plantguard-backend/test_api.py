import requests
import os

# ✅ Use your actual image path exactly as it appears
file_path = r"C:\Users\harsh\OneDrive\Desktop\SETPROJECT\newdataset\PlantVillage\Pepper__bell___Bacterial_spot\00f2e69a-1e56-412d-8a79-fdce794a17e4___JR_B.Spot 3132.JPG"

if not os.path.exists(file_path):
    print("❌ Image not found. Check the file name and path again.")
    exit()

url = "http://127.0.0.1:5001/predict"

print(f"📤 Sending image to backend: {file_path}")
with open(file_path, "rb") as f:
    files = {"file": f}
    res = requests.post(url, files=files)

if res.status_code == 200:
    data = res.json()
    print("\n✅ Prediction Results:")
    print(f"   🌿 Disease: {data['prediction']}")
    print(f"   📈 Confidence: {data['confidence']}%")
    if data['remedies']:
        print("\n🩺 Remedies:")
        for r in data['remedies']:
            print(f"   - {r}")
    if data['pesticides']:
        print("\n💧 Pesticides:")
        for p in data['pesticides']:
            print(f"   - {p}")
else:
    print(f"❌ Error: {res.status_code}")
    print(res.text)

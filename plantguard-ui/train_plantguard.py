# train_plantguard_cpu.py
import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from tqdm import tqdm

# --------- SETTINGS ---------
DATA_DIR = r"C:\Users\harsh\OneDrive\Desktop\SETPROJECT\dataset"  # update path
BATCH_SIZE = 32
NUM_EPOCHS = 5
LEARNING_RATE = 0.001
NUM_WORKERS = os.cpu_count()  # use all CPU cores
DEVICE = torch.device("cpu")  # explicitly CPU

# --------- TRANSFORMS ---------
train_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
])

test_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def main():
    # --------- DATASET ---------
    train_dataset = datasets.ImageFolder(os.path.join(DATA_DIR, "Train"), transform=train_transforms)
    test_dataset  = datasets.ImageFolder(os.path.join(DATA_DIR, "Test"), transform=test_transforms)

    print(f"Number of training images: {len(train_dataset)}")
    print(f"Number of test images: {len(test_dataset)}")
    print(f"Classes: {train_dataset.classes}")

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True,
                              num_workers=NUM_WORKERS)
    test_loader  = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False,
                              num_workers=NUM_WORKERS)

    # --------- MODEL ---------
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)

    # Freeze all layers except the final classifier
    for param in model.parameters():
        param.requires_grad = False

    model.classifier[1] = nn.Linear(model.last_channel, len(train_dataset.classes))
    model = model.to(DEVICE)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier[1].parameters(), lr=LEARNING_RATE)

    # --------- TRAINING ---------
    for epoch in range(NUM_EPOCHS):
        model.train()
        running_loss = 0.0
        for inputs, labels in tqdm(train_loader, desc=f"Epoch {epoch+1}/{NUM_EPOCHS}"):
            inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()

        print(f"Epoch [{epoch+1}/{NUM_EPOCHS}] Loss: {running_loss/len(train_loader):.4f}")

    # --------- SAVE MODEL ---------
    torch.save(model.state_dict(), "plantguard_model_cpu.pth")
    print("Training completed. Model saved as plantguard_model_cpu.pth")

    # --------- EVALUATION ---------
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
            outputs = model(inputs)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

    print(f"Test Accuracy: {100 * correct / total:.2f}%")

# --------- ENTRY POINT FOR WINDOWS ---------
if __name__ == "__main__":
    from multiprocessing import freeze_support
    freeze_support()  # required on Windows for DataLoader
    main()

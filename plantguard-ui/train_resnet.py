import os, sys, time, argparse, json
import torch
import torch.nn as nn
from torch.optim import Adam
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from tqdm import tqdm
from sklearn.metrics import classification_report

def eprint(*a, **k): print(*a, file=sys.stderr, **k)

def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--data", type=str, default=r"C:\Users\harsh\OneDrive\Desktop\SETPROJECT\dataset",
                   help="Folder containing Train/Valid/Test")
    p.add_argument("--epochs", type=int, default=12)
    p.add_argument("--batch", type=int, default=32)
    p.add_argument("--lr", type=float, default=1e-4)
    p.add_argument("--save", type=str, default=r"C:\Users\harsh\OneDrive\Desktop\SETPROJECT\saved_models\resnet50_best.pth")
    return p.parse_args()

def check_dirs(root):
    req = ["Train","Valid","Test"]
    missing = [d for d in req if not os.path.isdir(os.path.join(root,d))]
    if missing:
        raise SystemExit(f"❌ Missing folders under {root}: {missing}\nExpected Train/Valid/Test")
    for d in req:
        count = sum(len(files) for _,_,files in os.walk(os.path.join(root,d)))
        print(f"📁 {d}: {count} files")

def main():
    args = parse_args()
    os.makedirs(os.path.dirname(args.save), exist_ok=True)

    print("🔧 Settings:",
          json.dumps({"data": args.data, "epochs": args.epochs, "batch": args.batch, "lr": args.lr, "save": args.save}, indent=2))
    check_dirs(args.data)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print("🖥️  Device:", device, "| CUDA available:", torch.cuda.is_available())

    # Transforms
    train_tfms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225]),
    ])
    val_tfms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225]),
    ])

    # Datasets
    train_dir = os.path.join(args.data, "Train")
    val_dir   = os.path.join(args.data, "Valid")
    test_dir  = os.path.join(args.data, "Test")

    train_ds = datasets.ImageFolder(train_dir, transform=train_tfms)
    val_ds   = datasets.ImageFolder(val_dir,   transform=val_tfms)
    test_ds  = datasets.ImageFolder(test_dir,  transform=val_tfms)
    num_classes = len(train_ds.classes)
    print(f"🧠 Classes: {num_classes}")

    # DataLoaders
    train_loader = DataLoader(train_ds, batch_size=args.batch, shuffle=True,  num_workers=2, pin_memory=True)
    val_loader   = DataLoader(val_ds,   batch_size=args.batch, shuffle=False, num_workers=2, pin_memory=True)
    test_loader  = DataLoader(test_ds,  batch_size=args.batch, shuffle=False, num_workers=2, pin_memory=True)

    # Model
    model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    for p in model.parameters(): p.requires_grad = False  # warm start on head only
    model.fc = nn.Sequential(
        nn.Linear(model.fc.in_features, 512),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(512, num_classes),
    )
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = Adam(model.fc.parameters(), lr=args.lr)

    best_acc = 0.0
    epochs = args.epochs

    # Train
    for epoch in range(1, epochs+1):
        t0 = time.time()
        model.train()
        total_loss, correct, total = 0.0, 0, 0
        for imgs, labels in tqdm(train_loader, desc=f"Epoch {epoch}/{epochs}", ncols=80):
            imgs, labels = imgs.to(device), labels.to(device)
            optimizer.zero_grad()
            out = model(imgs)
            loss = criterion(out, labels)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
            correct += (out.argmax(1) == labels).sum().item()
            total += labels.size(0)
        train_acc = 100.0 * correct / total

        # Validate
        model.eval()
        v_correct, v_total, v_loss = 0, 0, 0.0
        with torch.no_grad():
            for imgs, labels in val_loader:
                imgs, labels = imgs.to(device), labels.to(device)
                out = model(imgs)
                v_loss += criterion(out, labels).item()
                v_correct += (out.argmax(1) == labels).sum().item()
                v_total += labels.size(0)
        val_acc = 100.0 * v_correct / v_total

        print(f"✅ Epoch {epoch}: Train {train_acc:.2f}% | Val {val_acc:.2f}% | "
              f"TrainLoss {(total_loss/len(train_loader)):.4f} | Time {time.time()-t0:.1f}s")

        if val_acc > best_acc:
            best_acc = val_acc
            torch.save(model.state_dict(), args.save)
            print(f"💾 Saved best to {args.save} (Val {best_acc:.2f}%)")

        # (optional) unfreeze backbone after a few epochs for higher accuracy
        if epoch == max(2, epochs//3):
            for p in model.parameters(): p.requires_grad = True
            optimizer = Adam(model.parameters(), lr=args.lr * 0.3)  # smaller LR when unfreezing
            print("🔓 Unfroze backbone for fine-tuning.")

    print(f"\n🎯 Best Val Acc: {best_acc:.2f}%")

    # Test
    model.load_state_dict(torch.load(args.save, map_location=device))
    model.eval()
    y_true, y_pred = [], []
    with torch.no_grad():
        for imgs, labels in tqdm(test_loader, desc="Testing", ncols=80):
            imgs, labels = imgs.to(device), labels.to(device)
            out = model(imgs)
            preds = out.argmax(1)
            y_true.extend(labels.cpu().numpy())
            y_pred.extend(preds.cpu().numpy())

    print("\n📊 Classification Report:")
    try:
        print(classification_report(y_true, y_pred, target_names=train_ds.classes))
    except Exception as e:
        print("Report error:", e)

if __name__ == "__main__":
    # Make prints flush immediately (or run with -u)
    os.environ["PYTHONUNBUFFERED"] = "1"
    main()

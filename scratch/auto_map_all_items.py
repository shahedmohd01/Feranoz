import cv2
import os
import subprocess
import json
import re

VIDEO_PATH = r"d:\cafe\menu_video.MP4"
OUT_ITEMS_DIR = r"d:\Feranoz\images\swiggy_items"
TMP_FRAMES_DIR = r"d:\Feranoz\images\raw_video_frames"
TMP_LABELS_DIR = r"d:\Feranoz\images\ocr_labels"

os.makedirs(OUT_ITEMS_DIR, exist_ok=True)
os.makedirs(TMP_FRAMES_DIR, exist_ok=True)
os.makedirs(TMP_LABELS_DIR, exist_ok=True)

import gc

print("Step 1: Extracting video frames from menu_video.MP4 directly to disk...")
cap = cv2.VideoCapture(VIDEO_PATH)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

frame_idx = 0
saved_count = 0
step = int(fps * 1.2) # Extract every 1.2 seconds (approx 45-50 frames total)

frame_info_list = []

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    if frame_idx % step == 0:
        fname = f"vframe_{saved_count:04d}.jpg"
        fpath = os.path.join(TMP_FRAMES_DIR, fname)
        cv2.imwrite(fpath, frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
        frame_info_list.append((saved_count, fpath))
        saved_count += 1
        del frame
        gc.collect()
    frame_idx += 1

cap.release()
gc.collect()
print(f"Extracted {saved_count} frames to disk.")

print("Step 2: Detecting cards and cropping text labels...")
# Card detection logic
cards_list = [] # list of { id, frame_id, crop_img, label_img_path, label_text: "" }

def detect_food_contours(img):
    h, w, _ = img.shape
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 253, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    rects = []
    for cnt in contours:
        x, y, cw, ch = cv2.boundingRect(cnt)
        if cw > 200 and ch > 200:
            if y > 250 and (y + ch) < (h - 150):
                rects.append((x, y, cw, ch))
    return rects

card_global_id = 0

for f_id, fpath in frame_info_list:
    img = cv2.imread(fpath)
    if img is None:
        continue
    h, w, _ = img.shape
    rects = detect_food_contours(img)
    
    col_rects = [r for r in rects if r[2] < 700]
    full_rects = [r for r in rects if r[2] >= 800]
    
    if len(col_rects) >= 2:
        col_rects = sorted(col_rects, key=lambda r: (r[1], r[0]))
        for i, r in enumerate(col_rects):
            rx, ry, rw, rh = r
            # Tight food crop (removing white card borders and badges)
            pad_y = int(rh * 0.02)
            pad_x = int(rw * 0.02)
            food_crop = img[ry+pad_y : ry+rh-pad_y, rx+pad_x : rx+rw-pad_x]
            
            # Label crop
            y_start = ry + rh
            y_end = min(y_start + 260, h)
            text_crop = img[y_start:y_end, rx:rx+rw]
            
            lbl_name = f"lbl_{card_global_id:04d}.jpg"
            lbl_path = os.path.join(TMP_LABELS_DIR, lbl_name)
            cv2.imwrite(lbl_path, text_crop)
            
            cards_list.append({
                "id": card_global_id,
                "frame_id": f_id,
                "food_crop": food_crop,
                "label_path": lbl_path,
                "text": ""
            })
            card_global_id += 1
    else:
        full_rects = sorted(full_rects, key=lambda r: r[1])
        for i, r in enumerate(full_rects):
            rx, ry, rw, rh = r
            food_crop = img[ry+4 : ry+min(535, rh), 48:1236]
            
            y_start = ry + rh
            y_end = min(y_start + 280, h)
            text_crop = img[y_start:y_end, 48:1236]
            
            lbl_name = f"lbl_{card_global_id:04d}.jpg"
            lbl_path = os.path.join(TMP_LABELS_DIR, lbl_name)
            cv2.imwrite(lbl_path, text_crop)
            
            cards_list.append({
                "id": card_global_id,
                "frame_id": f_id,
                "food_crop": food_crop,
                "label_path": lbl_path,
                "text": ""
            })
            card_global_id += 1

print(f"Total card crops extracted: {len(cards_list)}")

print("Step 3: Running Windows Native OCR on all card text labels via PowerShell...")
ps_script_path = r"d:\Feranoz\scratch\batch_ocr.ps1"
json_out_path = r"d:\Feranoz\scratch\ocr_results.json"

ps_code = """
[Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($null -eq $engine) {
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("en-US"))
}

$labelsDir = "d:\\Feranoz\\images\\ocr_labels"
$files = Get-ChildItem -Path $labelsDir -Filter "*.jpg"
$results = @{}

foreach ($f in $files) {
    try {
        $fileObj = [Windows.Storage.StorageFile]::GetFileFromPathAsync($f.FullName).GetAwaiter().GetResult()
        $stream = $fileObj.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()
        $decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).GetAwaiter().GetResult()
        $bitmap = $decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult()
        $ocrRes = $engine.RecognizeAsync($bitmap).GetAwaiter().GetResult()
        $results[$f.Name] = $ocrRes.Text
    } catch {
        $results[$f.Name] = ""
    }
}

$results | ConvertTo-Json | Out-File -FilePath "d:\\Feranoz\\scratch\\ocr_results.json" -Encoding utf8
"""

with open(ps_script_path, "w", encoding="utf-8") as f:
    f.write(ps_code)

res = subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", ps_script_path], capture_output=True, text=True)
print("PowerShell OCR finished.")

print("Step 4: Parsing OCR results and matching menu items...")
ocr_data = {}
if os.path.exists(json_out_path):
    with open(json_out_path, "r", encoding="utf-8-sig") as f:
        ocr_data = json.load(f)

for card in cards_list:
    fname = f"lbl_{card['id']:04d}.jpg"
    card["text"] = ocr_data.get(fname, "").replace("\n", " ").strip()

# Target menu items to map
MENU_ITEMS = [
    ("basque_cheesecake.jpg", ["Basque", "Cheesecake"]),
    ("rocher_cake.jpg", ["Rocher", "Cake"]),
    ("chocolate_noir.jpg", ["Chocolate Noir", "Noir"]),
    ("blueberry_vanilla_cake.jpg", ["Blueberry", "Vanilla"]),
    ("belgian_chocolate_cake.jpg", ["Belgian", "Chocolate Cake"]),
    ("chocolate_caramel_fudge_cake.jpg", ["Caramel Fudge", "Fudge"]),
    ("red_velvet.jpg", ["Red Velvet"]),
    ("medovik.jpg", ["Medovik", "Russian Honey"]),
    ("blueberry_cheesecake.jpg", ["Blueberry Cheesecake"]),
    ("chocolate_caramel_verrine.jpg", ["Verrine", "Chocolate Caramel Verrine"]),
    ("chocolate_teacake.jpg", ["Chocolate Teacake"]),
    ("mango_cheesecake.jpg", ["Mango Cheesecake"]),
    ("tiramisu.jpg", ["Tiramisu"]),
    ("vanilla_choux.jpg", ["Vanilla Choux", "Choux"]),
    ("opera_cake.jpg", ["Opera"]),
    ("spanish_tresleches.jpg", ["Tres Leches", "Spanish"]),
    ("hazelnut_cake.jpg", ["Hazelnut Cake"]),
    ("lemon_tart.jpg", ["Lemon Tart"]),
    ("choux_pastry.jpg", ["Choux Pastry"]),
    ("macaron_assorted.jpg", ["Macaron", "Assorted"]),
    ("banana_walnut_teacake.jpg", ["Banana Walnut"]),
    ("vanilla_teacake.jpg", ["Vanilla Teacake"]),
    ("walnut_brownie.jpg", ["Walnut Brownie", "Brownie"]),
    ("madeleine.jpg", ["Madeleine"]),
    ("chicken_fajita_pizza.jpg", ["Chicken Fajita", "Fajita"]),
    ("bbq_chicken_pizza.jpg", ["BBQ Chicken"]),
    ("paprika_smoked_chicken_pizza.jpg", ["Paprika", "Smoked Chicken"]),
    ("lamb_pepperoni_pizza.jpg", ["Lamb Pepperoni", "Pepperoni"]),
    ("meat_lovers_pizza.jpg", ["Meat Lovers"]),
    ("margherita_pizza.jpg", ["Margherita"]),
    ("mexican_cottage_cheese_pizza.jpg", ["Mexican Cottage", "Cottage Cheese"]),
    ("crunchy_chicken_burger.jpg", ["Crunchy Chicken", "Burger"]),
    ("chicken_club_sandwich.jpg", ["Chicken Club", "Sandwich"]),
    ("chicken_loaded_fries.jpg", ["Loaded Fries", "Fries"]),
    ("chicken_wrap.jpg", ["Chicken Wrap", "Wrap"]),
    ("almond_croissant.jpg", ["Almond Croissant"]),
    ("herb_chicken_croissant.jpg", ["Herb Chicken"]),
    ("southwest_chicken_tenders.jpg", ["Southwest", "Tenders"]),
    ("vegetariana_calzone.jpg", ["Vegetariana", "Calzone"]),
    ("veg_parmarosa_pasta.jpg", ["Parmarosa", "Pink Sauce"]),
    ("chicken_penne_pasta.jpg", ["Chicken Penne", "Penne"]),
    ("mushroom_pasta.jpg", ["Mushroom Pasta"]),
    ("cold_chocolate.jpg", ["Signature Cold", "Cold Chocolate"]),
    ("belgian_hot_chocolate.jpg", ["Belgian Hot", "Hot Chocolate"]),
    ("classic_cold_coffee.jpg", ["Classic Cold", "Cold Coffee"]),
    ("cappuccino_classic.jpg", ["Cappuccino"]),
    ("iced_latte.jpg", ["Iced Latte", "Latte"])
]

matched_items = {}

for target_filename, keywords in MENU_ITEMS:
    best_card = None
    best_score = 0
    for card in cards_list:
        text_upper = card["text"].upper()
        if not text_upper:
            continue
        score = sum(1 for kw in keywords if kw.upper() in text_upper)
        if score > best_score:
            best_score = score
            best_card = card
            
    if best_card and best_score > 0:
        out_path = os.path.join(OUT_ITEMS_DIR, target_filename)
        cv2.imwrite(out_path, best_card["food_crop"], [cv2.IMWRITE_JPEG_QUALITY, 95])
        matched_items[target_filename] = {
            "score": best_score,
            "text": best_card["text"],
            "frame": best_card["frame_id"]
        }
        print(f"MATCHED [{target_filename}] -> Text: '{best_card['text']}' (Frame {best_card['frame_id']})")
    else:
        print(f"WARNING: Could not auto-match [{target_filename}] via OCR.")

print(f"\nSuccessfully matched and cropped {len(matched_items)} food items directly from video!")

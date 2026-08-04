import os
import json
import cv2

OUT_ITEMS_DIR = r"d:\Feranoz\images\swiggy_items"
TMP_LABELS_DIR = r"d:\Feranoz\images\ocr_labels"
TMP_FRAMES_DIR = r"d:\Feranoz\images\raw_video_frames"
json_out_path = r"d:\Feranoz\scratch\ocr_results.json"

os.makedirs(OUT_ITEMS_DIR, exist_ok=True)

if not os.path.exists(json_out_path):
    print("ocr_results.json not found!")
    exit(1)

with open(json_out_path, "r", encoding="utf-8-sig") as f:
    ocr_data = json.load(f)

print(f"Loaded OCR data for {len(ocr_data)} label images.")

# Re-detect cards mapping from images
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

frame_files = sorted([f for f in os.listdir(TMP_FRAMES_DIR) if f.endswith(".jpg")])

cards_list = []
card_global_id = 0

for ff in frame_files:
    fpath = os.path.join(TMP_FRAMES_DIR, ff)
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
            pad_y = int(rh * 0.02)
            pad_x = int(rw * 0.02)
            food_crop = img[ry+pad_y : ry+rh-pad_y, rx+pad_x : rx+rw-pad_x]
            
            lbl_name = f"lbl_{card_global_id:04d}.jpg"
            text = ocr_data.get(lbl_name, "").replace("\n", " ").strip()
            
            cards_list.append({
                "id": card_global_id,
                "frame_file": ff,
                "food_crop": food_crop,
                "lbl_name": lbl_name,
                "text": text
            })
            card_global_id += 1
    else:
        full_rects = sorted(full_rects, key=lambda r: r[1])
        for i, r in enumerate(full_rects):
            rx, ry, rw, rh = r
            food_crop = img[ry+4 : ry+min(535, rh), 48:1236]
            
            lbl_name = f"lbl_{card_global_id:04d}.jpg"
            text = ocr_data.get(lbl_name, "").replace("\n", " ").strip()
            
            cards_list.append({
                "id": card_global_id,
                "frame_file": ff,
                "food_crop": food_crop,
                "lbl_name": lbl_name,
                "text": text
            })
            card_global_id += 1

print(f"Constructed {len(cards_list)} card records.")

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

matched_count = 0

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
        matched_count += 1
        print(f"MATCHED [{target_filename}] -> Text: '{best_card['text']}' ({best_card['frame_file']})")
    else:
        print(f"WARNING: Could not auto-match [{target_filename}]")

print(f"\nSuccessfully matched and saved {matched_count}/{len(MENU_ITEMS)} food items!")

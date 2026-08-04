import cv2
import os

IN_DIR = r"d:\Feranoz\images\swiggy_items"
OUT_DIR = r"d:\Feranoz\images\swiggy_items"

os.makedirs(OUT_DIR, exist_ok=True)

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

def crop_box(img, pos_type):
    h, w, _ = img.shape
    rects = detect_food_contours(img)
    
    col_rects = [r for r in rects if r[2] < 700]
    full_rects = [r for r in rects if r[2] >= 800]
    
    if pos_type.startswith("full"):
        full_rects = sorted(full_rects, key=lambda r: r[1])
        if pos_type == "full_top" and len(full_rects) > 0:
            rx, ry, rw, rh = full_rects[0]
            return img[ry+4 : ry+min(535, rh), 48:1236]
        elif pos_type == "full_bot" and len(full_rects) > 1:
            rx, ry, rw, rh = full_rects[1]
            return img[ry+4 : ry+min(535, rh), 48:1236]
        elif pos_type == "full_bot" and len(full_rects) == 1:
            # Fallback for single visible full card at bottom
            return img[1790:2325, 48:1236]
        else:
            return img[571:1106, 48:1236]
            
    elif pos_type.startswith("left") or pos_type.startswith("right"):
        col_rects = sorted(col_rects, key=lambda r: (r[1], r[0]))
        if len(col_rects) >= 4:
            if pos_type == "left_top": r = col_rects[0]
            elif pos_type == "right_top": r = col_rects[1]
            elif pos_type == "left_bot": r = col_rects[2]
            elif pos_type == "right_bot": r = col_rects[3]
            else: r = col_rects[0]
        elif len(col_rects) >= 2:
            if pos_type.endswith("top"):
                r = col_rects[0] if pos_type.startswith("left") else col_rects[1]
            else:
                r = col_rects[0] if pos_type.startswith("left") else col_rects[1]
        else:
            if pos_type == "left_top": r = (51, 642, 565, 564)
            elif pos_type == "right_top": r = (669, 642, 566, 564)
            elif pos_type == "left_bot": r = (51, 1617, 565, 565)
            else: r = (669, 1615, 565, 569)
            
        rx, ry, rw, rh = r
        pad_y = int(rh * 0.02)
        pad_x = int(rw * 0.02)
        return img[ry+pad_y : ry+rh-pad_y, rx+pad_x : rx+rw-pad_x]

    return img

EXACT_MAPPINGS = [
    # (Frame, Pos, Filename)
    (1, 'left_top', 'blueberry_vanilla_cake.jpg'),
    (1, 'right_top', 'belgian_chocolate_cake.jpg'),
    (2, 'left_bot', 'basque_cheesecake.jpg'),
    (2, 'right_bot', 'rocher_cake.jpg'),
    (3, 'left_top', 'chocolate_caramel_fudge_cake.jpg'),
    (3, 'right_top', 'red_velvet.jpg'),
    (3, 'left_bot', 'medovik.jpg'),
    (3, 'right_bot', 'blueberry_cheesecake.jpg'),
    (4, 'left_bot', 'chocolate_caramel_verrine.jpg'),
    (4, 'right_bot', 'chocolate_teacake.jpg'),
    (5, 'left_top', 'bbq_chicken_pizza.jpg'),
    (5, 'right_top', 'paprika_smoked_chicken_pizza.jpg'),
    (5, 'left_bot', 'crunchy_chicken_burger.jpg'),
    (5, 'right_bot', 'chocolate_noir.jpg'),
    (6, 'full_top', 'mango_cheesecake.jpg'),
    (6, 'full_bot', 'tiramisu.jpg'), # Glass dessert with gold spoon
    (7, 'left_top', 'vanilla_choux.jpg'),
    (7, 'right_top', 'opera_cake.jpg'),
    (7, 'left_bot', 'spanish_tresleches.jpg'),
    (7, 'right_bot', 'hazelnut_cake.jpg'),
    (8, 'left_top', 'lemon_tart.jpg'),
    (8, 'right_top', 'choux_pastry.jpg'),
    (8, 'left_bot', 'macaron_assorted.jpg'),
    (8, 'right_bot', 'banana_walnut_teacake.jpg'),
    (9, 'left_top', 'vanilla_teacake.jpg'),
    (9, 'right_top', 'walnut_brownie.jpg'),
    (9, 'left_bot', 'madeleine.jpg'),

    # PIZZAS
    (10, 'full_top', 'chicken_fajita_pizza.jpg'),
    (11, 'full_top', 'paprika_smoked_chicken_pizza_large.jpg'),
    (11, 'full_bot', 'lamb_pepperoni_pizza.jpg'),
    (12, 'full_top', 'meat_lovers_pizza.jpg'),
    (12, 'full_bot', 'margherita_pizza.jpg'),
    (13, 'full_top', 'mexican_cottage_cheese_pizza.jpg'),

    # BURGERS / SAVORY
    (14, 'full_top', 'crunchy_chicken_burger_savory.jpg'),
    (14, 'full_bot', 'chicken_club_sandwich.jpg'),
    (15, 'full_top', 'chicken_loaded_fries.jpg'),
    (15, 'full_bot', 'chicken_wrap.jpg'),
    (16, 'full_top', 'almond_croissant.jpg'),
    (16, 'full_bot', 'herb_chicken_croissant.jpg'),
    (17, 'full_top', 'southwest_chicken_tenders.jpg'),
    (17, 'full_bot', 'vegetariana_calzone.jpg'),

    # PASTA
    (18, 'full_top', 'veg_parmarosa_pasta.jpg'),
    (19, 'full_top', 'chicken_penne_pasta.jpg'),
    (20, 'full_top', 'mushroom_pasta.jpg'),

    # DRINKS
    (21, 'full_top', 'cold_chocolate.jpg'),
    (22, 'full_top', 'belgian_hot_chocolate.jpg'),
    (23, 'full_top', 'classic_cold_coffee.jpg'),
    (24, 'full_top', 'cappuccino_classic.jpg'),
    (25, 'full_top', 'iced_latte.jpg')
]

saved_count = 0
for f_num, pos_type, out_name in EXACT_MAPPINGS:
    frame_path = os.path.join(IN_DIR, f"menu_item_{f_num:03d}.jpg")
    if not os.path.exists(frame_path):
        print(f"Skipping missing frame file {frame_path}")
        continue
        
    img = cv2.imread(frame_path)
    if img is None:
        continue
        
    crop = crop_box(img, pos_type)
    out_path = os.path.join(OUT_DIR, out_name)
    cv2.imwrite(out_path, crop, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print(f"Successfully saved [{out_name}] ({crop.shape[1]}x{crop.shape[0]}) from Frame {f_num} [{pos_type}]")
    saved_count += 1

print(f"\nDone cropping {saved_count} perfectly mapped food items!")

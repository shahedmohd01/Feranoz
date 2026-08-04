import cv2
import os
import numpy as np

IN_DIR  = r"d:\Feranoz\images\swiggy_items"
OUT_DIR = r"d:\Feranoz\images\swiggy_items"

os.makedirs(OUT_DIR, exist_ok=True)

FRAME_MAPPINGS = [
    # ── RECOMMENDED (2col) ──
    (1, '2col', [
        ('left_top', 'blueberry_vanilla_cake.jpg'),
        ('right_top', 'belgian_chocolate_cake.jpg')
    ]),
    (2, '2col', [
        ('left_top', 'basque_cheesecake.jpg'),
        ('right_top', 'rocher_cake.jpg')
    ]),
    (3, '2col', [
        ('left_top', 'chocolate_caramel_fudge_cake.jpg'),
        ('right_top', 'red_velvet.jpg')
    ]),
    (4, '2col', [
        ('left_top', 'medovik.jpg'),
        ('right_top', 'blueberry_cheesecake.jpg')
    ]),
    (5, '2col', [
        ('left_top', 'bbq_chicken_pizza.jpg'),
        ('right_top', 'paprika_smoked_chicken_pizza.jpg'),
        ('left_bot', 'crunchy_chicken_burger.jpg'),
        ('right_bot', 'chocolate_noir.jpg')
    ]),

    # ── DESSERTS FULL WIDTH ──
    (6, 'full_top', 'chocolate_caramel_verrine.jpg'),
    (7, 'full_top', 'chocolate_teacake.jpg'),

    # ── 2col GRID ITEMS ──
    (8, '2col', [
        ('left_top', 'almond_croissant.jpg'),
        ('right_top', 'herb_chicken_croissant.jpg')
    ]),
    (9, '2col', [
        ('left_top', 'chicken_club_sandwich.jpg'),
        ('right_top', 'chicken_loaded_fries.jpg')
    ]),
    (10, '2col', [
        ('left_top', 'chicken_wrap.jpg'),
        ('right_top', 'lamb_pepperoni_pizza.jpg')
    ]),
    (11, '2col', [
        ('left_top', 'meat_lovers_pizza.jpg'),
        ('right_top', 'chicken_fajita_pizza.jpg')
    ]),

    # ── FULL WIDTH DESSERTS ──
    (12, 'full_top', 'mango_cheesecake.jpg'),
    (12, 'full_bot', 'strawberry_cheesecake.jpg'),
    (13, 'full_top', 'spanish_tresleches.jpg'),
    (13, 'full_bot', 'blueberry_tart.jpg'),
    (14, 'full_top', 'dulce_de_leche.jpg'),
    (14, 'full_bot', 'chocolate_eclair.jpg'),
    (15, 'full_top', 'vanilla_choux.jpg'),
    (15, 'full_bot', 'tiramisu.jpg'),
    (16, 'full_top', 'opera_cake.jpg'),
    (16, 'full_bot', 'mango_verrine.jpg'),
    (17, 'full_top', 'hazelnut_cake.jpg'),
    (17, 'full_bot', 'lemon_tart.jpg'),
    (18, 'full_top', 'choux_pastry.jpg'),
    (18, 'full_bot', 'panna_cotta.jpg'),
    (19, 'full_top', 'crème_brulee.jpg'),
    (19, 'full_bot', 'eclair_caramel.jpg'),
    (20, 'full_top', 'opera_slice.jpg'),
    (20, 'full_bot', 'spanish_tresleches_2.jpg'),

    # ── TEACAKES / LOAVES ──
    (21, 'full_top', 'walnut_brownie.jpg'),
    (21, 'full_bot', 'lemon_poppy_cake.jpg'),
    (22, 'full_top', 'carrot_walnut_cake.jpg'),
    (22, 'full_bot', 'date_walnut_cake.jpg'),
    (23, 'full_top', 'chocolate_loaf.jpg'),
    (23, 'full_bot', 'marble_loaf.jpg'),
    (24, 'full_top', 'macaron_assorted.jpg'),
    (24, 'full_bot', 'chocolate_cookie.jpg'),
    (25, 'full_top', 'butter_cookie.jpg'),
    (25, 'full_bot', 'financier.jpg'),
    (26, 'full_top', 'madeleine.jpg'),
    (26, 'full_bot', 'canele.jpg'),
    (27, 'full_top', 'chocolate_brownie.jpg'),
    (27, 'full_bot', 'nutella_brownie.jpg'),
    (28, 'full_top', 'blondie.jpg'),
    (28, 'full_bot', 'cheesecake_brownie.jpg'),
    (29, 'full_top', 'walnut_teacake.jpg'),
    (29, 'full_bot', 'almond_teacake.jpg'),
    (30, 'full_top', 'banana_walnut_teacake.jpg'),
    (30, 'full_bot', 'vanilla_teacake.jpg'),

    # ── PIZZAS ──
    (35, 'full_top', 'pizza_four_cheese.jpg'),
    (35, 'full_bot', 'pizza_tandoori_paneer.jpg'),
    (36, 'full_top', 'pizza_chicken_tikka.jpg'),
    (36, 'full_bot', 'pizza_truffle_mushroom.jpg'),
    (37, 'full_top', 'pizza_bbq_jackfruit.jpg'),
    (38, 'full_top', 'margherita_pizza.jpg'),
    (39, 'full_top', 'pizza_cottage_cheese.jpg'),
    (40, 'full_top', 'margherita_pizza.jpg'),
    (40, 'full_bot', 'mexican_cottage_cheese_pizza.jpg'),

    # ── PASTA ──
    (46, 'full_top', 'chicken_penne_pasta.jpg'),
    (46, 'full_bot', 'veg_pink_pasta.jpg'),
    (47, 'full_top', 'mushroom_pasta.jpg'),
    (48, 'full_top', 'arrabiata_pasta.jpg'),
    (50, 'full_top', 'veg_parmarosa_pasta.jpg'),

    # ── BURGER ──
    (51, 'full_top', 'southwest_chicken_tenders.jpg'),
    (52, 'full_top', 'crispy_chicken_sandwich.jpg'),

    # ── CALZONE ──
    (60, 'full_bot', 'vegetariana_calzone.jpg'),

    # ── DRINKS ──
    (61, 'full_top', 'cappuccino_classic.jpg'),
    (61, 'full_bot', 'classic_cold_coffee.jpg'),
    (62, 'full_top', 'belgian_hot_chocolate.jpg'),
    (62, 'full_bot', 'cold_chocolate.jpg'),
    (63, 'full_top', 'iced_latte.jpg')
]

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

def process_crops():
    success_count = 0
    
    for item in FRAME_MAPPINGS:
        frame_num = item[0]
        layout = item[1]
        
        frame_path = os.path.join(OUT_DIR, f"menu_item_{frame_num:03d}.jpg")
        if not os.path.exists(frame_path):
            backup_path = r"d:\Feranoz\images\swiggy_video_frames"
            frame_path = os.path.join(backup_path, f"menu_item_{frame_num:03d}.jpg")
            if not os.path.exists(frame_path):
                print(f"Frame {frame_num:03d} not found!")
                continue
                
        img = cv2.imread(frame_path)
        if img is None:
            print(f"Failed to load frame {frame_num:03d}!")
            continue
            
        h, w, _ = img.shape
        
        if layout == '2col':
            targets = item[2]
            rects = detect_food_contours(img)
            col_rects = [r for r in rects if r[2] < 700]
            
            # Sort top to bottom, then left to right
            col_rects = sorted(col_rects, key=lambda r: (r[1], r[0]))
            
            mapped = {}
            if len(col_rects) >= 4:
                # 4 items grid: top-left, top-right, bot-left, bot-right
                row1 = sorted(col_rects[:2], key=lambda r: r[0])
                row2 = sorted(col_rects[2:4], key=lambda r: r[0])
                mapped['left_top'] = row1[0]
                mapped['right_top'] = row1[1]
                mapped['left_bot'] = row2[0]
                mapped['right_bot'] = row2[1]
            elif len(col_rects) >= 2:
                # 2 items grid: left_top, right_top
                row1 = sorted(col_rects[:2], key=lambda r: r[0])
                mapped['left_top'] = row1[0]
                mapped['right_top'] = row1[1]
            elif len(col_rects) == 1:
                # Fallback if only 1 detected
                mapped['left_top'] = col_rects[0]
                
            for pos_name, out_name in targets:
                if pos_name in mapped:
                    rx, ry, rw, rh = mapped[pos_name]
                    # tight crop inside image card boundary
                    cropped = img[ry+4:ry+rh-4, rx+4:rx+rw-4]
                    out_path = os.path.join(OUT_DIR, out_name)
                    cv2.imwrite(out_path, cropped, [cv2.IMWRITE_JPEG_QUALITY, 95])
                    success_count += 1
                else:
                    # Fallback to manual coordinate crop if contour fails
                    print(f"  Warning: Position {pos_name} not found dynamically in frame {frame_num:03d}. Using fallback.")
                    # Fallback coordinate math
                    is_left = 'left' in pos_name
                    is_top = 'top' in pos_name
                    rx = 50 if is_left else 669
                    ry = 642 if is_top else 1615
                    rw, rh = 565, 564
                    cropped = img[ry+4:ry+rh-4, rx+4:rx+rw-4]
                    out_path = os.path.join(OUT_DIR, out_name)
                    cv2.imwrite(out_path, cropped, [cv2.IMWRITE_JPEG_QUALITY, 95])
                    success_count += 1
                    
        elif layout in ['full_top', 'full_bot']:
            out_name = item[2]
            rects = detect_food_contours(img)
            full_rects = [r for r in rects if r[2] >= 800]
            
            target_rect = None
            if layout == 'full_top':
                top_items = [r for r in full_rects if r[1] < 1400]
                if top_items:
                    target_rect = top_items[0]
            else:
                bot_items = [r for r in full_rects if r[1] >= 1400]
                if bot_items:
                    target_rect = bot_items[0]
                    
            if target_rect is not None:
                rx, ry, rw, rh = target_rect
                y_start = ry + 4
                y_end = min(y_start + 535, h)
                cropped = img[y_start:y_end, 48:1236]
                out_path = os.path.join(OUT_DIR, out_name)
                cv2.imwrite(out_path, cropped, [cv2.IMWRITE_JPEG_QUALITY, 95])
                success_count += 1
            else:
                y_start = 571 if layout == 'full_top' else 1790
                y_end = y_start + 535
                cropped = img[y_start:y_end, 48:1236]
                out_path = os.path.join(OUT_DIR, out_name)
                cv2.imwrite(out_path, cropped, [cv2.IMWRITE_JPEG_QUALITY, 95])
                success_count += 1
                
    print(f"Finished cropping! Successfully saved {success_count} food-only main images.")

if __name__ == '__main__':
    process_crops()

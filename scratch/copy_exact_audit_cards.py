import os
import shutil
import cv2

AUDIT_DIR = r"d:\Feranoz\images\audit_crops"
OUT_DIR = r"d:\Feranoz\images\swiggy_items"

os.makedirs(OUT_DIR, exist_ok=True)

AUDIT_MAP = [
    (0, "blueberry_vanilla_cake.jpg"),
    (1, "belgian_chocolate_cake.jpg"),
    (2, "basque_cheesecake.jpg"),
    (3, "rocher_cake.jpg"),
    (4, "chocolate_caramel_fudge_cake.jpg"),
    (5, "red_velvet.jpg"),
    (6, "medovik.jpg"),
    (7, "blueberry_cheesecake.jpg"),
    (8, "chocolate_caramel_verrine.jpg"),
    (9, "chocolate_teacake.jpg"),
    (10, "bbq_chicken_pizza_recommended.jpg"),
    (11, "paprika_smoked_chicken_pizza_recommended.jpg"),
    (12, "crunchy_chicken_burger.jpg"),
    (13, "chocolate_noir.jpg"),
    (14, "mango_cheesecake.jpg"),
    (15, "tiramisu.jpg"), # Dessert glass with gold spoon
    (16, "vanilla_choux.jpg"),
    (17, "opera_cake.jpg"),
    (18, "spanish_tresleches.jpg"),
    (19, "hazelnut_cake.jpg"),
    (20, "lemon_tart.jpg"),
    (21, "choux_pastry.jpg"),
    (22, "macaron_assorted.jpg"),
    (23, "banana_walnut_teacake.jpg"),
    (24, "vanilla_teacake.jpg"),
    (25, "walnut_brownie.jpg"),
    (26, "madeleine.jpg"),

    # PIZZAS
    (28, "chicken_fajita_pizza.jpg"),
    (29, "bbq_chicken_pizza.jpg"),
    (30, "paprika_smoked_chicken_pizza.jpg"),
    (31, "lamb_pepperoni_pizza.jpg"),
    (32, "meat_lovers_pizza.jpg"),
    (33, "margherita_pizza.jpg"),
    (34, "mexican_cottage_cheese_pizza.jpg"),

    # BURGERS & SAVORY
    (36, "crunchy_chicken_burger_savory.jpg"),
    (37, "chicken_club_sandwich.jpg"),
    (38, "chicken_loaded_fries.jpg"),
    (39, "chicken_wrap.jpg"),
    (40, "almond_croissant.jpg"),
    (41, "herb_chicken_croissant.jpg"),
    (42, "southwest_chicken_tenders.jpg"),
    (43, "vegetariana_calzone.jpg"),

    # PASTA
    (45, "veg_parmarosa_pasta.jpg"),
    (46, "chicken_penne_pasta.jpg"),
    (47, "mushroom_pasta.jpg"),

    # DRINKS
    (49, "cold_chocolate.jpg"),
    (50, "belgian_hot_chocolate.jpg"),
    (51, "classic_cold_coffee.jpg"),
    (52, "cappuccino_classic.jpg"),
    (53, "iced_latte.jpg")
]

saved_count = 0

for card_id, target_name in AUDIT_MAP:
    src_file = os.path.join(AUDIT_DIR, f"card_{card_id:03d}_food.jpg")
    dest_file = os.path.join(OUT_DIR, target_name)
    
    if os.path.exists(src_file):
        img = cv2.imread(src_file)
        if img is not None:
            # Crop padding to remove any surrounding card borders
            h, w, _ = img.shape
            crop_y1 = int(h * 0.03)
            crop_y2 = int(h * 0.97)
            crop_x1 = int(w * 0.03)
            crop_x2 = int(w * 0.97)
            clean_food = img[crop_y1:crop_y2, crop_x1:crop_x2]
            
            cv2.imwrite(dest_file, clean_food, [cv2.IMWRITE_JPEG_QUALITY, 95])
            saved_count += 1
            print(f"Copied Card #{card_id:03d} -> {target_name} ({clean_food.shape[1]}x{clean_food.shape[0]})")
    else:
        print(f"WARNING: Card image {src_file} not found!")

print(f"\nSuccessfully assigned {saved_count} food photos from video audit!")

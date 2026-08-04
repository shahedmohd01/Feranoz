import os
import json
import cv2

json_path = r"d:\Feranoz\scratch\ocr_results_pure.json"
crop_dir = r"d:\Feranoz\images\audit_crops"
out_dir = r"d:\Feranoz\images\swiggy_items"

os.makedirs(out_dir, exist_ok=True)

with open(json_path, "r", encoding="utf-8-sig") as f:
    ocr_results = json.load(f)

print(f"Loaded OCR results for {len(ocr_results)} cards.")
non_empty = {k: v for k, v in ocr_results.items() if v.strip()}
print(f"Total non-empty recognized labels: {len(non_empty)}")

# Print sample matches
for k, v in list(non_empty.items())[:20]:
    card_num = k.replace("_text.jpg", "")
    print(f"Card [{card_num}]: '{v}'")

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
    for card_text_file, text_val in ocr_results.items():
        if not text_val.strip():
            continue
        text_upper = text_val.upper()
        score = sum(1 for kw in keywords if kw.upper() in text_upper)
        if score > best_score:
            best_score = score
            best_card = card_text_file
            
    if best_card and best_score > 0:
        food_filename = best_card.replace("_text.jpg", "_food.jpg")
        src_food_path = os.path.join(crop_dir, food_filename)
        dest_food_path = os.path.join(out_dir, target_filename)
        
        if os.path.exists(src_food_path):
            img = cv2.imread(src_food_path)
            if img is not None:
                cv2.imwrite(dest_food_path, img, [cv2.IMWRITE_JPEG_QUALITY, 95])
                matched_count += 1
                print(f"MATCHED [{target_filename}] -> Card '{best_card}' -> Text: '{ocr_results[best_card]}'")

print(f"\nSuccessfully matched and updated {matched_count}/{len(MENU_ITEMS)} menu item images!")

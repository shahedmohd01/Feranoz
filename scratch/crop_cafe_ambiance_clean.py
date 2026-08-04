import cv2
import os

cafe_dir = r"d:\cafe"
out_dir = r"d:\Feranoz\images\cafe_gallery"
os.makedirs(out_dir, exist_ok=True)

# 4 photos mapping
files = [
    ("Insta_Saver_@feranoz_hyd_image_3932344417860612468_1080x1440_3 (1).jpg", "feranoz_ambiance_1.jpg"), # Indoor Entrance & Staircase View
    ("Insta_Saver_@feranoz_hyd_image_3932344417860612468_1080x1440_3 (2).jpg", "feranoz_ambiance_2.jpg"), # Outdoor Courtyard Seating
    ("Insta_Saver_@feranoz_hyd_image_3932344417860612468_1080x1440_3 (3).jpg", "feranoz_ambiance_3.jpg"), # High-top Interior Table with Window View
    ("Insta_Saver_@feranoz_hyd_image_3932344417860612468_1080x1440_3 (4).jpg", "feranoz_ambiance_4.jpg"), # Exterior Facade
]

for src_name, out_name in files:
    src_path = os.path.join(cafe_dir, src_name)
    if not os.path.exists(src_path):
        print(f"Source file {src_path} not found!")
        continue
    
    img = cv2.imread(src_path)
    if img is None:
        print(f"Failed to read {src_path}")
        continue
        
    h, w, _ = img.shape
    # The photo frame is centered inside a white card margin with text at the bottom.
    # Let's crop the actual photo portion inside the white frame!
    # In these 1080x1440 Instagram posts, the photo itself is from y=148 to y=1130, x=160 to x=920
    # Let's crop x: 140..940, y: 120..1140 to get pure clean photo without white borders or text!
    photo = img[120:1140, 140:940]
    
    out_path = os.path.join(out_dir, out_name)
    cv2.imwrite(out_path, photo, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print(f"Saved clean photo {out_name}: {photo.shape[1]}x{photo.shape[0]}")

print("Successfully cropped all 4 clean ambiance photos!")

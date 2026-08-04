import cv2
import numpy as np

def detect_food_images(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return []
    
    h, w, _ = img.shape
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # We threshold anything that is NOT pure white (255)
    # The background of the screen is white (255, 255, 255)
    _, thresh = cv2.threshold(gray, 253, 255, cv2.THRESH_BINARY_INV)
    
    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    rects = []
    for cnt in contours:
        x, y, cw, ch = cv2.boundingRect(cnt)
        # Bounding box criteria for a food item card image:
        # Minimum width/height to avoid small text/icons: 200px
        # We also check that it doesn't span the entire height or width of the screen (excluding background/borders)
        if cw > 200 and ch > 200 and cw < (w - 20) and ch < (h - 200):
            # Exclude header and bottom nav area
            if y > 250 and (y + ch) < (h - 150):
                rects.append((x, y, cw, ch))
                
    # Sort from top to bottom, then left to right
    rects = sorted(rects, key=lambda r: (r[1], r[0]))
    return rects

for f in [2, 5, 15, 40]:
    p = f"d:\\Feranoz\\images\\swiggy_items\\menu_item_{f:03d}.jpg"
    rects = detect_food_images(p)
    print(f"File {f:03d}:")
    for i, r in enumerate(rects):
        print(f"  Box {i}: x={r[0]}, y={r[1]}, w={r[2]}, h={r[3]}")

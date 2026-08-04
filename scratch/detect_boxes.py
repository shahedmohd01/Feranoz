import cv2
import numpy as np

def detect_food_images(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return []
    
    h, w, _ = img.shape
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # We want to find the colorful/textured food photos. They are surrounded by white (#FFFFFF)
    # or near-white background.
    # Let's threshold everything that is NOT white.
    # Typical white in screenshots is > 245.
    _, thresh = cv2.threshold(gray, 250, 255, cv2.THRESH_BINARY_INV)
    
    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    rects = []
    for cnt in contours:
        x, y, cw, ch = cv2.boundingRect(cnt)
        # We are looking for large rectangular image areas.
        # Inside the Swiggy UI, 2-column food photos are ~500-600px wide, and 500-600px high.
        # Full-width food photos are ~1100-1200px wide, and ~500-600px high.
        # Let's filter out banners, headers, text lines, buttons (which are small or narrow).
        if cw > 200 and ch > 200:
            # Avoid the header (y < 400) and bottom navigation (y > 2600)
            if y > 300 and (y + ch) < 2650:
                rects.append((x, y, cw, ch))
                
    # Sort from top to bottom
    rects = sorted(rects, key=lambda r: (r[1], r[0]))
    return rects

# Let's test on menu_item_005.jpg
rects = detect_food_images(r"d:\Feranoz\images\swiggy_items\menu_item_005.jpg")
print("Detected boxes in menu_item_005.jpg:")
for i, r in enumerate(rects):
    print(f"Box {i}: x={r[0]}, y={r[1]}, w={r[2]}, h={r[3]}")

import cv2
import os
import numpy as np

IN_DIR = r"d:\Feranoz\images\swiggy_items"
DEBUG_DIR = r"d:\Feranoz\images\debug_labels"
os.makedirs(DEBUG_DIR, exist_ok=True)

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

for f in range(1, 64):
    p = os.path.join(IN_DIR, f"menu_item_{f:03d}.jpg")
    if not os.path.exists(p):
        continue
    img = cv2.imread(p)
    if img is None:
        continue
    
    h, w, _ = img.shape
    rects = detect_food_contours(img)
    
    # Check if 2-column or full-width
    col_rects = [r for r in rects if r[2] < 700]
    full_rects = [r for r in rects if r[2] >= 800]
    
    if len(col_rects) >= 2:
        # Sort and group
        col_rects = sorted(col_rects, key=lambda r: (r[1], r[0]))
        for i, r in enumerate(col_rects):
            rx, ry, rw, rh = r
            # Text is directly below the image, y goes down by ~280px
            y_start = ry + rh
            y_end = min(y_start + 260, h)
            text_crop = img[y_start:y_end, rx:rx+rw]
            cv2.imwrite(os.path.join(DEBUG_DIR, f"label_frame_{f:03d}_col_{i}.jpg"), text_crop)
    else:
        # Full width layout
        full_rects = sorted(full_rects, key=lambda r: r[1])
        for i, r in enumerate(full_rects):
            rx, ry, rw, rh = r
            # For top/bottom full-width cards
            y_start = ry + rh
            y_end = min(y_start + 300, h)
            # Full width text spans from x=48 to x=1236
            text_crop = img[y_start:y_end, 48:1236]
            cv2.imwrite(os.path.join(DEBUG_DIR, f"label_frame_{f:03d}_full_{i}.jpg"), text_crop)

print("Done cropping label images!")

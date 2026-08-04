import cv2
import os

RAW_FRAMES_DIR = r"d:\Feranoz\images\raw_video_frames"
AUDIT_CROP_DIR = r"d:\Feranoz\images\audit_crops"
HTML_OUT_PATH = r"d:\Feranoz\video_menu_audit.html"

os.makedirs(AUDIT_CROP_DIR, exist_ok=True)

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

frame_files = sorted([f for f in os.listdir(RAW_FRAMES_DIR) if f.endswith(".jpg")])

audit_records = []
card_idx = 0

for ff in frame_files:
    fpath = os.path.join(RAW_FRAMES_DIR, ff)
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
            food_crop = img[ry:ry+rh, rx:rx+rw]
            
            y_start = ry + rh
            y_end = min(y_start + 240, h)
            text_crop = img[y_start:y_end, rx:rx+rw]
            
            food_filename = f"card_{card_idx:03d}_food.jpg"
            text_filename = f"card_{card_idx:03d}_text.jpg"
            
            cv2.imwrite(os.path.join(AUDIT_CROP_DIR, food_filename), food_crop)
            cv2.imwrite(os.path.join(AUDIT_CROP_DIR, text_filename), text_crop)
            
            audit_records.append({
                "id": card_idx,
                "frame": ff,
                "type": "2-column",
                "food": food_filename,
                "text": text_filename
            })
            card_idx += 1
    elif len(full_rects) >= 1:
        full_rects = sorted(full_rects, key=lambda r: r[1])
        for i, r in enumerate(full_rects):
            rx, ry, rw, rh = r
            food_crop = img[ry:ry+rh, 48:1236]
            
            y_start = ry + rh
            y_end = min(y_start + 260, h)
            text_crop = img[y_start:y_end, 48:1236]
            
            food_filename = f"card_{card_idx:03d}_food.jpg"
            text_filename = f"card_{card_idx:03d}_text.jpg"
            
            cv2.imwrite(os.path.join(AUDIT_CROP_DIR, food_filename), food_crop)
            cv2.imwrite(os.path.join(AUDIT_CROP_DIR, text_filename), text_crop)
            
            audit_records.append({
                "id": card_idx,
                "frame": ff,
                "type": "full-width",
                "food": food_filename,
                "text": text_filename
            })
            card_idx += 1

# Generate HTML
html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Swiggy Video Menu Audit</title>
<style>
  body {{ font-family: system-ui, sans-serif; background: #1a1a1a; color: #fff; padding: 20px; }}
  h1 {{ text-align: center; color: #ff9900; }}
  .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }}
  .card {{ background: #2a2a2a; border: 1px solid #444; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; align-items: center; }}
  .card header {{ font-weight: bold; margin-bottom: 8px; color: #aaa; font-size: 0.85rem; }}
  .food-img {{ width: 100%; height: 200px; object-fit: cover; border-radius: 8px; background: #000; }}
  .text-img {{ width: 100%; margin-top: 8px; border-radius: 4px; border: 1px solid #555; background: #fff; }}
</style>
</head>
<body>
<h1>Swiggy Video Menu Audit — All Extracted Cards ({len(audit_records)})</h1>
<div class="grid">
"""

for rec in audit_records:
    html_content += f"""
  <div class="card">
    <header>Card #{rec['id']} ({rec['frame']} - {rec['type']})</header>
    <img class="food-img" src="images/audit_crops/{rec['food']}" alt="Food Photo" />
    <img class="text-img" src="images/audit_crops/{rec['text']}" alt="Item Title Text" />
  </div>
"""

html_content += """
</div>
</body>
</html>
"""

with open(HTML_OUT_PATH, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated {HTML_OUT_PATH} with {len(audit_records)} cards!")

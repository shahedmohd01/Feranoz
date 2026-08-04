import os
try:
    import pytesseract
    from PIL import Image
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False

try:
    import easyocr
    EASYOCR_AVAILABLE = True
except ImportError:
    EASYOCR_AVAILABLE = False

print(f"pytesseract available: {TESSERACT_AVAILABLE}")
print(f"easyocr available: {EASYOCR_AVAILABLE}")

# Let's inspect the files in d:\Feranoz\images\swiggy_items\
frames_dir = r"d:\Feranoz\images\swiggy_items"
files = [f for f in os.listdir(frames_dir) if f.startswith("menu_item_") and f.endswith(".jpg")]
files = sorted(files)
print(f"Found {len(files)} menu_item_XXX.jpg files in {frames_dir}")

import sys
import subprocess

libs = ["pytesseract", "easyocr", "tesseract", "cv2", "PIL", "numpy"]
for lib in libs:
    try:
        __import__(lib)
        print(f"{lib}: AVAILABLE")
    except ImportError:
        print(f"{lib}: NOT AVAILABLE")

# Run pip list via subprocess to see what we have
try:
    res = subprocess.run(["pip", "list"], capture_output=True, text=True)
    print("\n--- Pip List Output ---")
    print(res.stdout[:1500])
except Exception as e:
    print(f"Failed to run pip list: {e}")

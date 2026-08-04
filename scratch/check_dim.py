import cv2
import os

img = cv2.imread(r"d:\Feranoz\images\swiggy_items\menu_item_002.jpg")
if img is not None:
    print(f"Dimensions of menu_item_002.jpg: {img.shape}")
else:
    print("Failed to load image")

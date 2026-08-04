import cv2

p = r"d:\Feranoz\images\swiggy_items\menu_item_040.jpg"
img = cv2.imread(p)
if img is not None:
    h, w, _ = img.shape
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 253, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    print(f"Total contours: {len(contours)}")
    for i, cnt in enumerate(contours):
        x, y, cw, cb = cv2.boundingRect(cnt)
        if cw > 200 or cb > 200:
            print(f"Large Contour: x={x}, y={y}, w={cw}, h={cb}")
else:
    print("Failed to load image")

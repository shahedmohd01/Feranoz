import json

json_path = r"d:\Feranoz\scratch\ocr_results.json"
with open(json_path, "r", encoding="utf-8-sig") as f:
    data = json.load(f)

print(f"Total keys in ocr_results.json: {len(data)}")
non_empty = {k: v for k, v in data.items() if v.strip()}
print(f"Non-empty OCR texts count: {len(non_empty)}")

print("\n--- SAMPLE OCR TEXTS ---")
for k, v in list(non_empty.items())[:30]:
    print(f"{k}: '{v}'")

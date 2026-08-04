try:
    import winrt.windows.media.ocr as ocr
    import winrt.windows.graphics.imaging as imaging
    import winrt.windows.storage as storage
    print("WINRT AVAILABLE!")
except Exception as e:
    print("WINRT NOT AVAILABLE:", e)

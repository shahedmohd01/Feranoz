import subprocess
import json
import os

def run_win_ocr(img_path):
    # PowerShell script to run Windows built-in OCR
    ps_code = f"""
    [void][Windows.Security.Credentials.PasswordVault, Windows.Security.Credentials, ContentType = WindowsRuntime]
    [void][Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
    [void][Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]
    [void][Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime]

    $file = [Windows.Storage.StorageFile]::GetFileFromPathAsync("{img_path}").GetAwaiter().GetResult()
    $stream = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()
    $decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).GetAwaiter().GetResult()
    $bitmap = $decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult()

    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
    if ($null -eq $engine) {{
        $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("en-US"))
    }}
    
    if ($engine) {{
        $result = $engine.RecognizeAsync($bitmap).GetAwaiter().GetResult()
        Write-Output $result.Text
    }} else {{
        Write-Output "OCR Engine failed to initialize"
    }}
    """
    
    # Run powershell command
    cmd = ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_code]
    res = subprocess.run(cmd, capture_output=True, text=True)
    return res.stdout.strip()

# Test on first label
test_img = r"d:\Feranoz\images\debug_labels\label_frame_001_col_0.jpg"
if os.path.exists(test_img):
    text = run_win_ocr(test_img)
    print(f"Detected text: {text}")
else:
    print(f"Test image not found at {test_img}")

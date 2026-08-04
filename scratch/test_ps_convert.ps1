[Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.SoftwareBitmap, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()

$labelsDir = "d:\Feranoz\images\audit_crops"
$files = Get-ChildItem -Path $labelsDir -Filter "*_text.jpg"

foreach ($f in $files | Select-Object -First 10) {
    try {
        $fileObj = [Windows.Storage.StorageFile]::GetFileFromPathAsync($f.FullName).GetAwaiter().GetResult()
        $stream = $fileObj.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()
        $decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).GetAwaiter().GetResult()
        $rawBitmap = $decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult()
        
        # Convert to Bgra8 format for OcrEngine
        $bgra8Format = [Windows.Graphics.Imaging.BitmapPixelFormat]::Bgra8
        $convertedBitmap = [Windows.Graphics.Imaging.SoftwareBitmap]::Convert($rawBitmap, $bgra8Format)
        
        $ocrRes = $engine.RecognizeAsync($convertedBitmap).GetAwaiter().GetResult()
        Write-Output "$($f.Name) -> $($ocrRes.Text)"
    } catch {
        Write-Output "$($f.Name) -> ERROR: $_"
    }
}

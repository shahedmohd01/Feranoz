[void][System.Reflection.Assembly]::LoadWithPartialName("System.Runtime.WindowsRuntime")
[Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.SoftwareBitmap, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()

$labelsDir = "d:\Feranoz\images\audit_crops"
$files = Get-ChildItem -Path $labelsDir -Filter "*_text.jpg"

foreach ($f in $files | Select-Object -First 10) {
    try {
        $fileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync($f.FullName)
        $fileObj = [System.WindowsRuntimeSystemExtensions]::AsTask($fileTask).Result
        
        $streamTask = $fileObj.OpenAsync([Windows.Storage.FileAccessMode]::Read)
        $stream = [System.WindowsRuntimeSystemExtensions]::AsTask($streamTask).Result
        
        $decoderTask = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
        $decoder = [System.WindowsRuntimeSystemExtensions]::AsTask($decoderTask).Result
        
        $rawBitmapTask = $decoder.GetSoftwareBitmapAsync()
        $rawBitmap = [System.WindowsRuntimeSystemExtensions]::AsTask($rawBitmapTask).Result
        
        $bgra8Format = [Windows.Graphics.Imaging.BitmapPixelFormat]::Bgra8
        $convertedBitmap = [Windows.Graphics.Imaging.SoftwareBitmap]::Convert($rawBitmap, $bgra8Format)
        
        $ocrTask = $engine.RecognizeAsync($convertedBitmap)
        $ocrRes = [System.WindowsRuntimeSystemExtensions]::AsTask($ocrTask).Result
        
        Write-Output "$($f.Name) -> $($ocrRes.Text)"
    } catch {
        Write-Output "$($f.Name) -> ERROR: $_"
    }
}

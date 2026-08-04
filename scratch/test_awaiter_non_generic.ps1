[void][System.Reflection.Assembly]::LoadWithPartialName("System.Runtime.WindowsRuntime")
[Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.SoftwareBitmap, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()

$labelsDir = "d:\Feranoz\images\audit_crops"
$files = Get-ChildItem -Path $labelsDir -Filter "*_text.jpg"

foreach ($f in $files | Select-Object -First 5) {
    try {
        $op1 = [Windows.Storage.StorageFile]::GetFileFromPathAsync($f.FullName)
        $fileObj = [System.WindowsRuntimeSystemExtensions]::GetAwaiter($op1).GetResult()
        
        $op2 = $fileObj.OpenAsync([Windows.Storage.FileAccessMode]::Read)
        $stream = [System.WindowsRuntimeSystemExtensions]::GetAwaiter($op2).GetResult()
        
        $op3 = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
        $decoder = [System.WindowsRuntimeSystemExtensions]::GetAwaiter($op3).GetResult()
        
        $op4 = $decoder.GetSoftwareBitmapAsync()
        $rawBitmap = [System.WindowsRuntimeSystemExtensions]::GetAwaiter($op4).GetResult()
        
        $bgra8Format = [Windows.Graphics.Imaging.BitmapPixelFormat]::Bgra8
        $convertedBitmap = [Windows.Graphics.Imaging.SoftwareBitmap]::Convert($rawBitmap, $bgra8Format)
        
        $op5 = $engine.RecognizeAsync($convertedBitmap)
        $ocrRes = [System.WindowsRuntimeSystemExtensions]::GetAwaiter($op5).GetResult()
        
        Write-Output "$($f.Name) -> $($ocrRes.Text)"
    } catch {
        Write-Output "$($f.Name) -> ERROR: $_"
    }
}

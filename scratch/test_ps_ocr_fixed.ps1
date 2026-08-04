[Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()

$labelsDir = "d:\Feranoz\images\debug_labels"
$files = Get-ChildItem -Path $labelsDir -Filter "*.jpg"

foreach ($f in $files | Select-Object -First 10) {
    try {
        $fileObj = [Windows.Storage.StorageFile]::GetFileFromPathAsync($f.FullName).GetAwaiter().GetResult()
        $stream = $fileObj.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()
        $decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).GetAwaiter().GetResult()
        $bitmap = $decoder.GetSoftwareBitmapAsync([Windows.Graphics.Imaging.BitmapPixelFormat]::Bgra8, [Windows.Graphics.Imaging.BitmapAlphaMode]::Premultiplied).GetAwaiter().GetResult()
        $ocrRes = $engine.RecognizeAsync($bitmap).GetAwaiter().GetResult()
        Write-Output "$($f.Name) -> $($ocrRes.Text)"
    } catch {
        Write-Output "$($f.Name) -> ERROR: $_"
    }
}

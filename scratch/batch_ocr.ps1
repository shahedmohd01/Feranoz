
[Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($null -eq $engine) {
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("en-US"))
}

$labelsDir = "d:\Feranoz\images\ocr_labels"
$files = Get-ChildItem -Path $labelsDir -Filter "*.jpg"
$results = @{}

foreach ($f in $files) {
    try {
        $fileObj = [Windows.Storage.StorageFile]::GetFileFromPathAsync($f.FullName).GetAwaiter().GetResult()
        $stream = $fileObj.OpenAsync([Windows.Storage.FileAccessMode]::Read).GetAwaiter().GetResult()
        $decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).GetAwaiter().GetResult()
        $bitmap = $decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult()
        $ocrRes = $engine.RecognizeAsync($bitmap).GetAwaiter().GetResult()
        $results[$f.Name] = $ocrRes.Text
    } catch {
        $results[$f.Name] = ""
    }
}

$results | ConvertTo-Json | Out-File -FilePath "d:\Feranoz\scratch\ocr_results.json" -Encoding utf8

[Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.SoftwareBitmap, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()

$labelsDir = "d:\Feranoz\images\audit_crops"
$files = Get-ChildItem -Path $labelsDir -Filter "*_text.jpg"
$results = @{}

foreach ($f in $files) {
    try {
        $op1 = [Windows.Storage.StorageFile]::GetFileFromPathAsync($f.FullName)
        while ($op1.Status.ToString() -eq 'Started') { Start-Sleep -Milliseconds 2 }
        $fileObj = $op1.GetResults()
        
        $op2 = $fileObj.OpenAsync([Windows.Storage.FileAccessMode]::Read)
        while ($op2.Status.ToString() -eq 'Started') { Start-Sleep -Milliseconds 2 }
        $stream = $op2.GetResults()
        
        $op3 = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
        while ($op3.Status.ToString() -eq 'Started') { Start-Sleep -Milliseconds 2 }
        $decoder = $op3.GetResults()
        
        $op4 = $decoder.GetSoftwareBitmapAsync()
        while ($op4.Status.ToString() -eq 'Started') { Start-Sleep -Milliseconds 2 }
        $rawBitmap = $op4.GetResults()
        
        $bgra8Format = [Windows.Graphics.Imaging.BitmapPixelFormat]::Bgra8
        $convertedBitmap = [Windows.Graphics.Imaging.SoftwareBitmap]::Convert($rawBitmap, $bgra8Format)
        
        $op5 = $engine.RecognizeAsync($convertedBitmap)
        while ($op5.Status.ToString() -eq 'Started') { Start-Sleep -Milliseconds 2 }
        $ocrRes = $op5.GetResults()
        
        $results[$f.Name] = $ocrRes.Text
    } catch {
        Write-Output "$($f.Name) -> ERROR: $_"
        $results[$f.Name] = ""
    }
}

$results | ConvertTo-Json | Out-File -FilePath "d:\Feranoz\scratch\ocr_results_pure.json" -Encoding utf8
Write-Output "Successfully processed $($results.Count) files via Pure WinRT PowerShell OCR!"

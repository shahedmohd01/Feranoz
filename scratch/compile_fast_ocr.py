import subprocess
import os

csc_path = r"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"

csharp_code = """
using System;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using Windows.Graphics.Imaging;
using Windows.Media.Ocr;
using Windows.Storage;

class Program
{
    static void Main(string[] args)
    {
        string labelsDir = @"d:\\Feranoz\\images\\audit_crops";
        string jsonOut = @"d:\\Feranoz\\scratch\\ocr_results_csharp.json";

        if (!Directory.Exists(labelsDir))
        {
            Console.WriteLine("Dir not found: " + labelsDir);
            return;
        }

        var files = Directory.GetFiles(labelsDir, "*_text.jpg");
        Console.WriteLine("Found " + files.Length + " text label images.");

        var engine = OcrEngine.TryCreateFromUserProfileLanguages();
        if (engine == null)
        {
            Console.WriteLine("ERROR: Could not create OcrEngine");
            return;
        }

        var dict = new Dictionary<string, string>();
        int count = 0;

        foreach (var f in files)
        {
            try
            {
                string text = System.Threading.Tasks.Task.Run(async () =>
                {
                    var fileObj = await StorageFile.GetFileFromPathAsync(Path.GetFullPath(f));
                    using (var stream = await fileObj.OpenAsync(FileAccessMode.Read))
                    {
                        var decoder = await BitmapDecoder.CreateAsync(stream);
                        var rawBitmap = await decoder.GetSoftwareBitmapAsync();
                        var convertedBitmap = SoftwareBitmap.Convert(rawBitmap, BitmapPixelFormat.Bgra8);
                        
                        var ocrRes = await engine.RecognizeAsync(convertedBitmap);
                        return ocrRes.Text;
                    }
                }).GetAwaiter().GetResult();

                dict[Path.GetFileName(f)] = text;
                if (!string.IsNullOrEmpty(text)) count++;
            }
            catch (Exception ex)
            {
                dict[Path.GetFileName(f)] = "";
            }
        }

        Console.WriteLine("Successfully OCR processed " + count + " files!");

        // Write simple JSON output
        using (var writer = new StreamWriter(jsonOut))
        {
            writer.WriteLine("{");
            int i = 0;
            foreach (var kvp in dict)
            {
                string cleanVal = kvp.Value.Replace((char)34, (char)32);
                writer.Write("  " + (char)34 + kvp.Key + (char)34 + ": " + (char)34 + cleanVal + (char)34);
                if (i < dict.Count - 1) writer.WriteLine(",");
                else writer.WriteLine();
                i++;
            }
            writer.WriteLine("}");
        }

        Console.WriteLine("Saved OCR results to " + jsonOut);
    }
}
"""

src_path = r"d:\Feranoz\scratch\FastOcr.cs"
exe_path = r"d:\Feranoz\scratch\FastOcr.exe"

with open(src_path, "w", encoding="utf-8") as f:
    f.write(csharp_code)

winmd_path = r"C:\\Windows\\System32\\WinMetadata\\Windows.Media.winmd"
winmd_graphics = r"C:\\Windows\\System32\\WinMetadata\\Windows.Graphics.winmd"
winmd_storage = r"C:\\Windows\\System32\\WinMetadata\\Windows.Storage.winmd"
winmd_foundation = r"C:\\Windows\\System32\\WinMetadata\\Windows.Foundation.winmd"

cmd = [
    csc_path,
    "/target:exe",
    f"/out:{exe_path}",
    "/r:System.Runtime.WindowsRuntime.dll",
    r"/r:C:\Windows\Microsoft.NET\Framework64\v4.0.30319\System.Runtime.dll",
    f"/r:{winmd_path}",
    f"/r:{winmd_graphics}",
    f"/r:{winmd_storage}",
    f"/r:{winmd_foundation}",
    src_path
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)

if os.path.exists(exe_path):
    print("SUCCESS: FastOcr.exe compiled!")
else:
    print("Compilation failed!")

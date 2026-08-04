import subprocess
import os

# Let's search for csc.exe
csc_path = r"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not os.path.exists(csc_path):
    print("csc.exe not found!")
    exit(1)

# C# source code to perform Windows Runtime OCR
csharp_code = """
using System;
using System.IO;
using Windows.Graphics.Imaging;
using Windows.Media.Ocr;
using Windows.Storage;

class Program
{
    static void Main(string[] args)
    {
        if (args.Length == 0)
        {
            Console.WriteLine("Usage: Program.exe <image_path>");
            return;
        }

        string imgPath = Path.GetFullPath(args[0]);
        if (!File.Exists(imgPath))
        {
            Console.WriteLine("File not found: " + imgPath);
            return;
        }

        try
        {
            var file = StorageFile.GetFileFromPathAsync(imgPath).GetAwaiter().GetResult();
            using (var stream = file.OpenAsync(FileAccessMode.Read).GetAwaiter().GetResult())
            {
                var decoder = BitmapDecoder.CreateAsync(stream).GetAwaiter().GetResult();
                var bitmap = decoder.GetSoftwareBitmapAsync().GetAwaiter().GetResult();
                
                var engine = OcrEngine.TryCreateFromUserProfileLanguages();
                if (engine != null)
                {
                    var result = engine.RecognizeAsync(bitmap).GetAwaiter().GetResult();
                    Console.WriteLine(result.Text);
                }
                else
                {
                    Console.WriteLine("ERROR: Failed to create OCR engine");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("ERROR: " + ex.Message);
            if (ex.InnerException != null)
            {
                Console.WriteLine("INNER ERROR: " + ex.InnerException.Message);
            }
        }
    }
}
"""

# Write source file
src_path = r"d:\Feranoz\scratch\OcrApp.cs"
with open(src_path, "w") as f:
    f.write(csharp_code)

# Compile C# application
# We need to reference the necessary WinMD files for Windows Runtime APIs
winmd_core = r"C:\\Windows\\System32\\WinMetadata\\Windows.winmd"
winmd_path = r"C:\\Windows\\System32\\WinMetadata\\Windows.Media.winmd"
winmd_graphics = r"C:\\Windows\\System32\\WinMetadata\\Windows.Graphics.winmd"
winmd_storage = r"C:\\Windows\\System32\\WinMetadata\\Windows.Storage.winmd"
winmd_foundation = r"C:\\Windows\\System32\\WinMetadata\\Windows.Foundation.winmd"

cmd = [
    csc_path,
    "/target:exe",
    "/out:d:\\Feranoz\\scratch\\OcrApp.exe",
    "/r:System.Runtime.WindowsRuntime.dll",
    r"/r:C:\Windows\Microsoft.NET\Framework64\v4.0.30319\System.Runtime.dll",
    f"/r:{winmd_core}",
    f"/r:{winmd_path}",
    f"/r:{winmd_graphics}",
    f"/r:{winmd_storage}",
    f"/r:{winmd_foundation}",
    src_path
]

print("Running compilation command...")
res = subprocess.run(cmd, capture_output=True, text=True)
print("Compiler STDOUT:")
print(res.stdout)
print("Compiler STDERR:")
print(res.stderr)

if os.path.exists(r"d:\Feranoz\scratch\OcrApp.exe"):
    print("SUCCESS: Compiled OcrApp.exe!")
else:
    print("FAILED to compile!")

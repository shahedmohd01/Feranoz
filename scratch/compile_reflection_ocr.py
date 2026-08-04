import subprocess
import os

csc_path = r"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"

csharp_code = """
using System;
using System.IO;
using System.Reflection;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        string labelsDir = @"d:\\Feranoz\\images\\audit_crops";
        string jsonOut = @"d:\\Feranoz\\scratch\\ocr_results_reflection.json";

        if (!Directory.Exists(labelsDir))
        {
            Console.WriteLine("Dir not found: " + labelsDir);
            return;
        }

        var files = Directory.GetFiles(labelsDir, "*_text.jpg");
        Console.WriteLine("Found " + files.Length + " text label images.");

        Type storageFileType = Type.GetType("Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime");
        Type fileAccessModeType = Type.GetType("Windows.Storage.FileAccessMode, Windows.Storage, ContentType=WindowsRuntime");
        Type bitmapDecoderType = Type.GetType("Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType=WindowsRuntime");
        Type softwareBitmapType = Type.GetType("Windows.Graphics.Imaging.SoftwareBitmap, Windows.Graphics.Imaging, ContentType=WindowsRuntime");
        Type bitmapPixelFormatType = Type.GetType("Windows.Graphics.Imaging.BitmapPixelFormat, Windows.Graphics.Imaging, ContentType=WindowsRuntime");
        Type ocrEngineType = Type.GetType("Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType=WindowsRuntime");

        if (ocrEngineType == null || storageFileType == null)
        {
            Console.WriteLine("ERROR: WinRT types not found.");
            return;
        }

        MethodInfo tryCreateMethod = ocrEngineType.GetMethod("TryCreateFromUserProfileLanguages", BindingFlags.Public | BindingFlags.Static);
        object ocrEngine = tryCreateMethod.Invoke(null, null);

        if (ocrEngine == null)
        {
            Console.WriteLine("ERROR: Could not create OcrEngine.");
            return;
        }

        MethodInfo getFileMethod = storageFileType.GetMethod("GetFileFromPathAsync", new Type[] { typeof(string) });
        MethodInfo convertMethod = softwareBitmapType.GetMethod("Convert", new Type[] { softwareBitmapType, bitmapPixelFormatType });
        MethodInfo recognizeMethod = ocrEngineType.GetMethod("RecognizeAsync", new Type[] { softwareBitmapType });

        object readAccess = Enum.Parse(fileAccessModeType, "Read");
        object bgra8Format = Enum.Parse(bitmapPixelFormatType, "Bgra8");

        var dict = new Dictionary<string, string>();
        int count = 0;

        foreach (var f in files)
        {
            try
            {
                // GetFileFromPathAsync
                object asyncOp1 = getFileMethod.Invoke(null, new object[] { Path.GetFullPath(f) });
                object fileObj = AwaitResult(asyncOp1);

                // OpenAsync
                MethodInfo openAsyncMethod = storageFileType.GetMethod("OpenAsync", new Type[] { fileAccessModeType });
                object asyncOp2 = openAsyncMethod.Invoke(fileObj, new object[] { readAccess });
                object streamObj = AwaitResult(asyncOp2);

                // CreateAsync
                MethodInfo createAsyncMethod = bitmapDecoderType.GetMethod("CreateAsync", new Type[] { streamObj.GetType().GetInterfaces()[0] });
                if (createAsyncMethod == null)
                {
                    createAsyncMethod = bitmapDecoderType.GetMethods()[0];
                }
                object asyncOp3 = createAsyncMethod.Invoke(null, new object[] { streamObj });
                object decoderObj = AwaitResult(asyncOp3);

                // GetSoftwareBitmapAsync
                MethodInfo getSoftwareBitmapMethod = decoderObj.GetType().GetMethod("GetSoftwareBitmapAsync", new Type[0]);
                object asyncOp4 = getSoftwareBitmapMethod.Invoke(decoderObj, null);
                object rawBitmapObj = AwaitResult(asyncOp4);

                // Convert to Bgra8
                object bgra8BitmapObj = convertMethod.Invoke(null, new object[] { rawBitmapObj, bgra8Format });

                // RecognizeAsync
                object asyncOp5 = recognizeMethod.Invoke(ocrEngine, new object[] { bgra8BitmapObj });
                object ocrResultObj = AwaitResult(asyncOp5);

                PropertyInfo textProp = ocrResultObj.GetType().GetProperty("Text");
                string recognizedText = (string)textProp.GetValue(ocrResultObj, null);
                recognizedText = recognizedText.Replace("\\n", " ").Replace("\\r", " ").Trim();

                dict[Path.GetFileName(f)] = recognizedText;
                if (!string.IsNullOrEmpty(recognizedText)) count++;
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR for " + Path.GetFileName(f) + ": " + ex.ToString());
                dict[Path.GetFileName(f)] = "";
            }
        }

        Console.WriteLine("Successfully OCR processed " + count + " / " + files.Length + " files!");

        using (var writer = new StreamWriter(jsonOut))
        {
            writer.WriteLine("{");
            int idx = 0;
            foreach (var kvp in dict)
            {
                string cleanVal = kvp.Value.Replace((char)34, (char)32);
                writer.Write("  " + (char)34 + kvp.Key + (char)34 + ": " + (char)34 + cleanVal + (char)34);
                if (idx < dict.Count - 1) writer.WriteLine(",");
                else writer.WriteLine();
                idx++;
            }
            writer.WriteLine("}");
        }

        Console.WriteLine("Saved OCR results to " + jsonOut);
    }

    static object AwaitResult(object asyncOp)
    {
        if (asyncOp == null) return null;
        Type opType = asyncOp.GetType();
        
        PropertyInfo statusProp = opType.GetProperty("Status");
        if (statusProp == null)
        {
            foreach (Type iface in opType.GetInterfaces())
            {
                statusProp = iface.GetProperty("Status");
                if (statusProp != null) break;
            }
        }

        while (true)
        {
            object status = statusProp.GetValue(asyncOp, null);
            string statusStr = status.ToString();
            if (statusStr == "Completed") break;
            if (statusStr == "Error" || statusStr == "Canceled")
            {
                throw new Exception("Async operation " + statusStr);
            }
            System.Threading.Thread.Sleep(2);
        }

        MethodInfo getResultsMethod = opType.GetMethod("GetResults");
        if (getResultsMethod == null)
        {
            foreach (Type iface in opType.GetInterfaces())
            {
                getResultsMethod = iface.GetMethod("GetResults");
                if (getResultsMethod != null) break;
            }
        }

        return getResultsMethod.Invoke(asyncOp, null);
    }
}
"""

src_path = r"d:\Feranoz\scratch\OcrRunner.cs"
exe_path = r"d:\Feranoz\scratch\OcrRunner.exe"

with open(src_path, "w", encoding="utf-8") as f:
    f.write(csharp_code)

cmd = [
    csc_path,
    "/target:exe",
    f"/out:{exe_path}",
    src_path
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)

if os.path.exists(exe_path):
    print("SUCCESS: OcrRunner.exe compiled!")
else:
    print("Compilation failed!")

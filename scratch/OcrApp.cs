
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

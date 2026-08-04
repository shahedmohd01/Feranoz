import subprocess
import os

csc_path = r"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"

csharp_code = """
using System;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("C# Console App Test");
    }
}
"""

src_path = r"d:\Feranoz\scratch\TestApp.cs"
exe_path = r"d:\Feranoz\scratch\TestApp.exe"

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

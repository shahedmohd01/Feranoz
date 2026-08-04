import os

search_dir = r"C:\Windows\Microsoft.NET"
found = []
for root, dirs, files in os.walk(search_dir):
    if "System.Runtime.dll" in files:
        found.append(os.path.join(root, "System.Runtime.dll"))

print("Found System.Runtime.dll:")
for f in found:
    print(f)

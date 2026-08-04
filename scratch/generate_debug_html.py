import os

debug_dir = r"d:\Feranoz\images\debug_labels"
html_path = r"d:\Feranoz\label_debug.html"

files = [f for f in os.listdir(debug_dir) if f.endswith(".jpg")]
# Sort naturally
files.sort()

html_content = """<!DOCTYPE html>
<html>
<head>
<title>Label Debugger</title>
<style>
  body { font-family: sans-serif; background: #f0f0f0; padding: 20px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .card { background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center; }
  img { max-width: 100%; height: auto; border: 1px solid #ccc; margin-top: 5px; }
</style>
</head>
<body>
<h1>Label Debugger - Find Correct Frames</h1>
<div class="grid">
"""

for f in files:
    html_content += f"""
  <div class="card">
    <strong>{f}</strong>
    <br>
    <img src="images/debug_labels/{f}" />
  </div>
"""

html_content += """
</div>
</body>
</html>
"""

with open(html_path, "w") as out:
    out.write(html_content)

print("Created label_debug.html! Open it in browser to see the labels.")

import shutil
import os

src = r"C:\Users\Administrator\.openclaw\workspace\lobster-platform\out"
dst = r"C:\Users\Administrator\.openclaw\workspace\lobster-platform"

# Copy _next dir
shutil.copytree(os.path.join(src, "_next"), os.path.join(dst, "_next"), dirs_exist_ok=True)
# Copy data, profile, tasks dirs
for d in ["data", "profile", "tasks"]:
    shutil.copytree(os.path.join(src, d), os.path.join(dst, d), dirs_exist_ok=True)

# Copy HTML files from out/ to root
for f in os.listdir(src):
    if f.endswith('.html') or f.endswith('.json'):
        shutil.copy2(os.path.join(src, f), os.path.join(dst, f))

print("Done copying all files")

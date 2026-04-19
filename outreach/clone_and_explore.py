#!/usr/bin/env python3
import subprocess
import os
import shutil
import time

os.environ["GITHUB_TOKEN"] = "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"

# Clone to a Windows temp path
labmain_path = "C:/tmp/labmain"
os.makedirs("C:/tmp", exist_ok=True)

# Remove old clone if exists
if os.path.exists(labmain_path):
    try:
        shutil.rmtree(labmain_path, ignore_errors=True)
        time.sleep(1)
    except:
        pass

result = subprocess.run(
    ["git", "clone", "--quiet", "https://github.com: D2758695161@github.com/labmain/ai-agent-pay-demo.git", labmain_path],
    capture_output=True, text=True, env={**os.environ}
)
print(f"Clone return: {result.returncode}")
if result.stderr:
    print(f"Stderr: {result.stderr[:300]}")

if os.path.exists(labmain_path):
    # Explore structure
    print("\n=== Structure ===")
    for root, dirs, files in os.walk(labmain_path):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', '.next']]
        level = root.replace(labmain_path, '').count(os.sep)
        indent = ' ' * 2 * level
        print(f'{indent}{os.path.basename(root)}/')
        subindent = ' ' * 2 * (level + 1)
        for file in files[:15]:
            print(f'{subindent}{file}')
        if level > 4:
            break

#!/usr/bin/env python3
import subprocess
import json
import base64
import os

os.environ["GITHUB_TOKEN"] = "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"

def gh_api(path):
    result = subprocess.run(
        ["gh", "api", f"repos/labmain/ai-agent-pay-demo/{path}"],
        capture_output=True, text=True, env={**os.environ}
    )
    if result.returncode == 0:
        try:
            return json.loads(result.stdout)
        except:
            return result.stdout
    return None

# Check fix-31.js pattern
print("=== fix-31.js ===")
data = gh_api("contents/fix-31.js")
if data and isinstance(data, dict):
    content = data.get('content', '')
    if content:
        decoded = base64.b64decode(content).decode('utf-8')
        print(decoded[:500])

# Check fix-22.js
print("\n=== fix-22.js ===")
data = gh_api("contents/fix-22.js")
if data and isinstance(data, dict):
    content = data.get('content', '')
    if content:
        decoded = base64.b64decode(content).decode('utf-8')
        print(decoded[:500])

# Check src/parser.js
print("\n=== src/parser.js ===")
data = gh_api("contents/src/parser.js")
if data and isinstance(data, dict):
    content = data.get('content', '')
    if content:
        decoded = base64.b64decode(content).decode('utf-8')
        print(decoded[:1000])

# Check existing PRs to understand pattern
print("\n=== Recent PRs ===")
prs = gh_api("pulls?state=closed&per_page=10&sort=updated")
if prs and isinstance(prs, list):
    for pr in prs[:5]:
        print(f"PR #{pr['number']}: {pr['title']} - {pr['state']}")

# Check if fix-35.js exists
print("\n=== fix-35.js check ===")
data = gh_api("contents/fix-35.js")
print(f"fix-35.js exists: {data is not None and 'content' in data}")

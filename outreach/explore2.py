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

# Check test directory
print("=== test/ ===")
data = gh_api("contents/test")
if isinstance(data, list):
    for f in data[:20]:
        print(f"  {f['name']}")

# Check settings-validator.test.ts
print("\n=== src/settings-validator.test.ts ===")
data = gh_api("contents/src/settings-validator.test.ts")
if data and isinstance(data, dict):
    content = data.get('content', '')
    if content:
        decoded = base64.b64decode(content).decode('utf-8')
        print(decoded[:1500])

# Check settings-validator.ts
print("\n=== src/settings-validator.ts ===")
data = gh_api("contents/src/settings-validator.ts")
if data and isinstance(data, dict):
    content = data.get('content', '')
    if content:
        decoded = base64.b64decode(content).decode('utf-8')
        print(decoded[:2000])

# Look at recent closed PRs (merged)
print("\n=== Recent Merged PRs ===")
prs = gh_api("pulls?state=closed&per_page=20&sort=updated&direction=desc")
if prs and isinstance(prs, list):
    merged = [pr for pr in prs if pr.get('merged_at')]
    for pr in merged[:5]:
        print(f"PR #{pr['number']}: {pr['title']} - merged: {pr.get('merged_at')}")

# Check PR #51 (mentioned in context)
print("\n=== PR #51 ===")
data = gh_api("pulls/51")
if data and isinstance(data, dict):
    print(f"Title: {data.get('title')}")
    print(f"State: {data.get('state')}")
    print(f"Files: {data.get('changed_files')}")

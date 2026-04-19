#!/usr/bin/env python3
"""Check znc #433 - reserved identifier violation"""
import subprocess
import json
import os

os.environ["GITHUB_TOKEN"] = "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"

def gh_api_raw(endpoint):
    result = subprocess.run(
        ["gh", "api", endpoint],
        capture_output=True, env={**os.environ}
    )
    try:
        return result.stdout.decode('utf-8', errors='replace')
    except:
        return ""

def gh_json(endpoint):
    out = gh_api_raw(endpoint)
    if out:
        try:
            return json.loads(out)
        except:
            pass
    return None

# Get full issue details
issue = gh_json("repos/znc/znc/issues/433")
if issue:
    print(f"Title: {issue['title']}")
    print(f"Body:\n{issue.get('body', '')}")

# Get the files mentioned
print("\n=== WebModules.h ===")
data = gh_json("repos/znc/znc/contents/include/znc/WebModules.h")
if data and isinstance(data, dict):
    content = data.get('content', '')
    if content:
        import base64
        decoded = base64.b64decode(content).decode('utf-8', errors='replace')
        # Find lines with _WEBMODULES_H
        for i, line in enumerate(decoded.split('\n')[:30]):
            if '_WEBMODULES_H' in line or 'include' in line.lower():
                print(f"  {i+1}: {line}")

print("\n=== ZNCString.h ===")
data = gh_json("repos/znc/znc/contents/include/znc/ZNCString.h")
if data and isinstance(data, dict):
    content = data.get('content', '')
    if content:
        import base64
        decoded = base64.b64decode(content).decode('utf-8', errors='replace')
        # Find lines with _SQL
        for i, line in enumerate(decoded.split('\n')[:30]):
            if '_SQL' in line or 'include' in line.lower():
                print(f"  {i+1}: {line}")

# Check how many files have these reserved identifiers
print("\n=== Searching for reserved identifiers ===")
data = gh_json("search/code?q=_WEBMODULES_H+repo:znc/znc")
if data and isinstance(data, dict):
    print(f"_WEBMODULES_H found in {data.get('total_count', 0)} files")

data = gh_json("search/code?q=_SQL+repo:znc/znc+extension:h")
if data and isinstance(data, dict):
    print(f"_SQL (header) found in {data.get('total_count', 0)} files")

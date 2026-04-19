#!/usr/bin/env python3
"""More bounty searches"""
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

# Search for bountysource issues
print("=== Bountysource Issues ===")
data = gh_json("search/issues?q=is:issue+is:open+label:bountysource+comments:<3&per_page=30")
if data and isinstance(data, dict):
    items = data.get('items', [])
    print(f"Found: {len(items)}")
    for item in items[:10]:
        repo = "/".join(item['repository_url'].split("/")[-2:])
        labels = [l['name'] for l in item.get('labels', [])]
        try:
            print(f"  #{item['number']} [{repo}] {item['title'][:50]}")
            print(f"       labels: {labels}")
        except:
            pass

# Search for issue with $ in body (not just title)
print("\n=== Issues with $ in body ===")
data = gh_json("search/issues?q=is:issue+is:open+%22$%22+in:body+comments:<2&per_page=30")
if data and isinstance(data, dict):
    items = data.get('items', [])
    print(f"Found: {len(items)}")
    for item in items[:10]:
        repo = "/".join(item['repository_url'].split("/")[-2:])
        try:
            print(f"  #{item['number']} [{repo}] {item['title'][:50]}")
        except:
            pass

# Look at repos that might have bounties
print("\n=== Repos with bounty labels ===")
# Get trending repos or look for specific bounty platforms
data = gh_json("search/repositories?q=bounty+label:issue+in:name&sort=stars&per_page=10")
if data and isinstance(data, dict):
    items = data.get('items', [])
    for item in items[:5]:
        print(f"  {item['full_name']} - {item.get('description', '')[:50]}")

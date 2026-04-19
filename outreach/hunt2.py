#!/usr/bin/env python3
"""Bounty hunting - robust version"""
import subprocess
import json
import os
import base64

os.environ["GITHUB_TOKEN"] = "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"

def gh_api_raw(endpoint):
    """Raw gh api call returning decoded stdout"""
    result = subprocess.run(
        ["gh", "api", endpoint],
        capture_output=True, env={**os.environ}
    )
    try:
        return result.stdout.decode('utf-8', errors='replace')
    except:
        return ""

def gh_json(endpoint):
    """GH API returning JSON"""
    out = gh_api_raw(endpoint)
    if out:
        try:
            return json.loads(out)
        except:
            pass
    return None

# Check kcolbchain/switchboard issues
print("=== kcolbchain/switchboard Issues ===")
issues = gh_json("repos/kcolbchain/switchboard/issues?state=open&per_page=30")
if issues:
    for issue in issues[:10]:
        labels = [l['name'] for l in issue.get('labels', [])]
        try:
            print(f"  #{issue['number']}: {issue['title']}")
            print(f"      labels: {labels}")
        except:
            print(f"  #{issue['number']}: [title encoding error]")

# Check if PRs exist for kcolbchain issues
print("\n=== kcolbchain/switchboard Open PRs ===")
prs = gh_json("repos/kcolbchain/switchboard/pulls?state=open&per_page=20")
if prs:
    for pr in prs:
        try:
            print(f"  PR #{pr['number']}: {pr['title']}")
        except:
            print(f"  PR #{pr['number']}: [title encoding error]")

# Search for more bounties with $ in title
print("\n=== More $ bounties ===")
searches = [
    "is:issue is:open $ in:title comments:<2",
    "is:issue is:open label:bounty label:$ comments:<2",
    "is:issue is:open \"bounty\" \"good first issue\" comments:<2",
]
for q in searches:
    data = gh_json(f"search/issues?q={q.replace(' ', '+')}&per_page=10")
    if data and isinstance(data, dict):
        items = data.get('items', [])
        if items:
            print(f"\n  Query: {q[:50]}")
            for item in items[:5]:
                repo = "/".join(item['repository_url'].split("/")[-2:])
                try:
                    print(f"    #{item['number']} [{repo}] {item['title'][:50]}")
                except:
                    print(f"    #{item['number']} [encode error]")

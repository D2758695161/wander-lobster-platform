#!/usr/bin/env python3
"""Check new bounty targets - fixed"""
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

targets = [
    ("kcolbchain", "monsoon", 6),
    ("kcolbchain", "monsoon", 4),
    ("kcolbchain", "meridian", 5),
]

for owner, repo, num in targets:
    print(f"\n=== {owner}/{repo} #{num} ===")
    issue = gh_json(f"repos/{owner}/{repo}/issues/{num}")
    if issue:
        labels = [l['name'] for l in issue.get('labels', [])]
        try:
            print(f"Title: {issue['title']}")
        except:
            print("Title: [encoding error]")
        print(f"Labels: {labels}")
        try:
            body = issue.get('body', '')[:400]
            print(f"Body: {body}")
        except:
            print("Body: [encoding error]")
    
    # Check if PR exists - use pulls endpoint
    prs = gh_json(f"repos/{owner}/{repo}/pulls?state=open&per_page=50")
    if prs and isinstance(prs, list):
        matching = [pr for pr in prs if pr.get('body', '').startswith(f'#{num}') or f'#{num}' in pr.get('body', '')]
        print(f"Open PRs total: {len(prs)}, Matching for #{num}: {len(matching)}")
        for pr in matching[:3]:
            try:
                print(f"  PR #{pr['number']}: {pr['title']}")
            except:
                print(f"  PR #{pr['number']}: [encoding error]")
    else:
        print("No PRs or error")

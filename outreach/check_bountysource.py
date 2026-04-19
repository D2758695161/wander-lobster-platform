#!/usr/bin/env python3
"""Check Bountysource issues in detail"""
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
    ("znc", "znc", 433),
    ("znc", "znc", 381),
    ("znc", "znc", 539),
    ("znc", "znc", 534),
    ("swergroup", "category-pages-shortcodes", 8),
    ("swergroup", "category-pages-shortcodes", 7),
    ("swergroup", "category-pages-shortcodes", 5),
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
            body = issue.get('body', '')[:500]
            print(f"Body: {body}")
        except:
            print("Body: [encoding error]")
    
    # Check PRs
    prs = gh_json(f"repos/{owner}/{repo}/pulls?state=open&per_page=50")
    if prs and isinstance(prs, list):
        # Look for PRs that reference this issue
        matching = [pr for pr in prs if f'#{num}' in pr.get('body', '') or f'#{num}' in pr.get('title', '')]
        if matching:
            print(f"PRs referencing this issue: {len(matching)}")
            for pr in matching[:2]:
                try:
                    print(f"  PR #{pr['number']}: {pr['title']}")
                except:
                    pass
        else:
            print("No open PRs for this issue")
    else:
        print("No PRs found")

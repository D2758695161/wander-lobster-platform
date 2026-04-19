#!/usr/bin/env python3
"""Check Rustchain bounties"""
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

# Check rustchain-bounties repo
print("=== Scottcjn/rustchain-bounties Issues ===")
issues = gh_json("repos/Scottcjn/rustchain-bounties/issues?state=open&per_page=20")
if issues:
    for issue in issues[:15]:
        labels = [l['name'] for l in issue.get('labels', [])]
        try:
            print(f"  #{issue['number']}: {issue['title']}")
        except:
            print(f"  #{issue['number']}: [encoding error]")
        print(f"      labels: {labels}")
        # Check body
        body = issue.get('body', '')
        if body:
            try:
                print(f"      body: {body[:100]}")
            except:
                pass

# Check recent Rustchain bounties
print("\n=== Scottcjn/Rustchain Recent Bounties ===")
issues = gh_json("repos/Scottcjn/Rustchain/issues?state=open&labels=bounty&per_page=20")
if issues:
    for issue in issues[:10]:
        labels = [l['name'] for l in issue.get('labels', [])]
        try:
            print(f"  #{issue['number']}: {issue['title'][:60]}")
        except:
            print(f"  #{issue['number']}: [encoding error]")
        print(f"      labels: {labels}")

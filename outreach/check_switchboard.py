#!/usr/bin/env python3
import subprocess
import json
import os

os.environ["GITHUB_TOKEN"] = "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"

def gh_api(path):
    result = subprocess.run(
        ["gh", "api", f"repos/kcolbchain/switchboard/{path}"],
        capture_output=True, text=True, env={**os.environ}
    )
    if result.returncode == 0:
        try:
            return json.loads(result.stdout)
        except:
            return result.stdout
    return None

print("=== kcolbchain/switchboard Issues ===")
issues = gh_api("issues?state=open&per_page=30")
if issues:
    for issue in issues[:15]:
        labels = [l['name'] for l in issue.get('labels', [])]
        print(f"  #{issue['number']}: {issue['title'][:60]}")
        print(f"      labels: {labels}")

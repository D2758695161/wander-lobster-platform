#!/usr/bin/env python3
"""Focused bounty search"""
import subprocess
import json
import os
import re

os.environ["GITHUB_TOKEN"] = "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"

def gh_run(cmd_str):
    result = subprocess.run(cmd_str, capture_output=True, env={**os.environ})
    try:
        return result.stdout.decode('utf-8', errors='replace')
    except:
        return ""

# Check SolFoundry for new bounty issues
print("=== SolFoundry Open Bounties ===")
output = gh_run(['gh', 'api', 'repos/SolFoundry/solfoundry/issues?state=open&labels=bounty&per_page=20'])
if output:
    try:
        issues = json.loads(output)
        for issue in issues[:10]:
            print(f"  #{issue['number']}: {issue['title'][:70]}")
            # Check if PR exists
            pr_output = gh_run(['gh', 'api', f"repos/SolFoundry/solfoundry/issues/{issue['number']}/pulls"])
            if pr_output:
                try:
                    prs = json.loads(pr_output)
                    print(f"    PRs: {len(prs)}")
                except:
                    pass
    except Exception as e:
        print(f"Error: {e}")

# Check labmain for new bounty issues
print("\n=== labmain Open Bounties ===")
output = gh_run(['gh', 'api', 'repos/labmain/ai-agent-pay-demo/issues?state=open&per_page=20'])
if output:
    try:
        issues = json.loads(output)
        for issue in issues[:10]:
            labels = [l['name'] for l in issue.get('labels', [])]
            if any('bounty' in l.lower() or '$' in l for l in labels):
                print(f"  #{issue['number']}: {issue['title'][:70]} labels:{labels}")
    except Exception as e:
        print(f"Error: {e}")

# Search for specific bounty platform labels
print("\n=== Bountysource/IssueHunt labels ===")
for label in ['bounty-available', 'bountysource', 'issuehunt', 'funded', 'bounty:$']:
    q = f'is:issue is:open label:{label} comments:<3'
    output = gh_run(['gh', 'api', f'search/issues?q={q.replace(" ", "+")}&per_page=10'])
    if output:
        try:
            data = json.loads(output)
            count = data.get('total_count', 0)
            items = data.get('items', [])
            if count > 0:
                print(f"  {label}: {count} issues")
                for item in items[:3]:
                    repo = "/".join(item['repository_url'].split("/")[-2:])
                    print(f"    #{item['number']} [{repo}] {item['title'][:60]}")
        except Exception as e:
            pass

# Search for $ amounts in labels
print("\n=== Issues with $ in labels ===")
output = gh_run(['gh', 'api', 'search/issues?q=is:issue+is:open+label:$+per_page=30'])
if output:
    try:
        data = json.loads(output)
        count = data.get('total_count', 0)
        items = data.get('items', [])
        print(f"  Total: {count}")
        for item in items[:10]:
            repo = "/".join(item['repository_url'].split("/")[-2:])
            labels = [l['name'] for l in item.get('labels', [])]
            print(f"  #{item['number']} [{repo}] labels:{labels}")
    except Exception as e:
        print(f"Error: {e}")

# Check recent bounties from known bounty repos
print("\n=== Known Bounty Repos ===")
known_repos = [
    'labmain/ai-agent-pay-demo',
    'kcolbchain/switchboard',
    'SolFoundry/solfoundry',
]

for repo in known_repos:
    parts = repo.split('/')
    output = gh_run(['gh', 'api', f'repos/{repo}/issues?state=open&per_page=30'])
    if output:
        try:
            issues = json.loads(output)
            bounty_issues = []
            for issue in issues:
                labels = [l['name'] for l in issue.get('labels', [])]
                if any('bounty' in l.lower() or '$' in str(l) for l in labels):
                    bounty_issues.append(f"#{issue['number']}: {issue['title'][:50]}")
            if bounty_issues:
                print(f"  {repo}:")
                for b in bounty_issues[:5]:
                    print(f"    {b}")
        except Exception as e:
            print(f"  Error: {e}")

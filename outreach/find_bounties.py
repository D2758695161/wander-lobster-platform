#!/usr/bin/env python3
"""Bounty hunting script"""
import subprocess
import json
import os
import re
import sys

os.environ["GITHUB_TOKEN"] = "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"

def safe_print(s):
    try:
        print(s)
    except:
        print(s.encode('utf-8', errors='replace').decode('utf-8', errors='replace'))

def gh_run(cmd):
    """Run gh command"""
    full_cmd = ["gh"] + cmd
    result = subprocess.run(full_cmd, capture_output=True, env={**os.environ})
    try:
        out = result.stdout.decode('utf-8', errors='replace')
        err = result.stderr.decode('utf-8', errors='replace')
    except:
        out, err = "", ""
    return out, err

queries = [
    ('bounty label', 'is:issue is:open label:bounty comments:<3'),
    ('bounty anywhere', 'is:issue is:open bounty comments:<2'),
    ('reward', 'is:issue is:open reward comments:<2'),
    ('payment', 'is:issue is:open payment comments:<2'),
]

all_issues = []
seen = set()

for name, q in queries:
    safe_print(f"\n=== {name} ===")
    out, err = gh_run(["api", f"search/issues?q={q.replace(' ', '+')}&per_page=50"])
    if err:
        safe_print(f"Err: {err[:200]}")
    if out:
        try:
            data = json.loads(out)
            items = data.get("items", [])
            safe_print(f"Found {len(items)} issues")
            for item in items[:20]:
                repo = "/".join(item['repository_url'].split("/")[-2:])
                key = f"{repo}/{item['number']}"
                if key not in seen:
                    seen.add(key)
                    all_issues.append({
                        'repo': repo,
                        'number': item['number'],
                        'title': item['title'],
                        'html_url': item['html_url'],
                        'comments': item['comments'],
                        'labels': [l['name'] for l in item.get('labels', [])],
                        'body': item.get('body', ''),
                    })
                    safe_print(f"  #{item['number']} [{repo}] {item['title'][:70]} (c:{item['comments']})")
        except Exception as e:
            safe_print(f"Parse error: {e} | out: {out[:300]}")

safe_print(f"\nTotal unique: {len(all_issues)}")

# Save results
with open('C:/Users/Administrator/.openclaw/workspace/outreach/quick-bounties-2026-04-07.json', 'w', encoding='utf-8') as f:
    json.dump(all_issues, f, indent=2)

# Filter to most promising
safe_print("\n=== PRIORITY (bounty/$/reward) ===")
priority = []
for issue in all_issues:
    title = issue['title']
    labels = issue['labels']
    title_lower = title.lower()
    if any(k in title_lower for k in ['bounty', 'reward', 'paid', 'payment', 'grant']) or \
       any(k in labels for k in ['bounty', 'reward', 'paid', 'payment', 'grant', 'bounty-available']):
        amounts = re.findall(r'\$?([\d,]+)', title)
        issue['est_amount'] = amounts[0] if amounts else '?'
        priority.append(issue)

priority.sort(key=lambda x: x.get('est_amount', '0'), reverse=True)
for issue in priority[:10]:
    safe_print(f"  #{issue['number']} [{issue['repo']}] {issue['title'][:60]} [{issue['est_amount']}]")

safe_print(f"\nPriority count: {len(priority)}")

# Also print all issues for reference
safe_print("\n=== ALL ISSUES ===")
for issue in all_issues[:20]:
    safe_print(f"  #{issue['number']} [{issue['repo']}] {issue['title'][:60]}")

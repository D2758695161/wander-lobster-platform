#!/usr/bin/env python3
"""Bounty hunting - focused searches"""
import subprocess
import json
import os
import base64

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

# Targeted searches for TypeScript/React/JS bounty issues
searches = [
    # Bounty label with language filters
    ("bounty + ts/react", "is:issue+is:open+label:bounty+language:TypeScript+comments:<3"),
    ("bounty + js", "is:issue+is:open+label:bounty+language:JavaScript+comments:<3"),
    ("bounty + py", "is:issue+is:open+label:bounty+language:Python+comments:<3"),
    # Bounty with recent date
    ("recent bounty", "is:issue+is:open+label:bounty+created:>2026-04-01"),
    # $ in title more specific
    ("$ in title", "is:issue+is:open+%22$%22+in:title+comments:<2+created:>2026-03-20"),
]

all_issues = []
seen = set()

for name, q in searches:
    print(f"\n=== {name}: {q[:60]} ===")
    data = gh_json(f"search/issues?q={q}&per_page=30")
    if data and isinstance(data, dict):
        items = data.get('items', [])
        print(f"  Found: {len(items)}")
        for item in items[:10]:
            repo = "/".join(item['repository_url'].split("/")[-2:])
            key = f"{repo}/{item['number']}"
            if key not in seen:
                seen.add(key)
                labels = [l['name'] for l in item.get('labels', [])]
                all_issues.append({
                    'repo': repo,
                    'number': item['number'],
                    'title': item['title'],
                    'html_url': item['html_url'],
                    'comments': item['comments'],
                    'labels': labels,
                })
                try:
                    print(f"    #{item['number']} [{repo}] {item['title'][:50]}")
                    print(f"         labels: {labels}")
                except:
                    pass

print(f"\n\nTotal unique issues: {len(all_issues)}")

# Filter to actual $ bounties
print("\n=== ACTUAL $ BOUNTIES ===")
dollar_bounties = []
for issue in all_issues:
    title = issue['title']
    labels = issue['labels']
    # Check for $ in title or bounty-related labels
    if '$' in title or any('$' in l for l in labels):
        import re
        amounts = re.findall(r'\$?([\d,]+)', title)
        est = amounts[0] if amounts else '?'
        issue['est_amount'] = est
        dollar_bounties.append(issue)
        try:
            print(f"  #{issue['number']} [{issue['repo']}] ${issue['est_amount']} - {issue['title'][:50]}")
        except:
            print(f"  #{issue['number']} [encode error]")

print(f"\nDollar bounties: {len(dollar_bounties)}")

# Save all results
with open('C:/Users/Administrator/.openclaw/workspace/outreach/quick-bounties-2026-04-07.json', 'w', encoding='utf-8') as f:
    json.dump({
        'all_issues': all_issues,
        'dollar_bounties': dollar_bounties,
    }, f, indent=2, ensure_ascii=False)

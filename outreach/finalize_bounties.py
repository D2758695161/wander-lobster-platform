import json
from datetime import datetime

with open(r'C:\Users\Administrator\.openclaw\workspace\outreach\github-bounties-filtered.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f'Input: {len(items)} items')

# Date filter: April 10-17, 2026 only
DATE_START = '2026-04-10'
DATE_END = '2026-04-17'

filtered = []
skipped = []
for item in items:
    created = item['created_at'][:10]
    if DATE_START <= created <= DATE_END:
        filtered.append(item)
    else:
        skipped.append(created)

print(f'After date filter: {len(filtered)} ({len(skipped)} outside range: {set(skipped)})')

# Sort by comments descending (engagement = hotness)
filtered.sort(key=lambda x: x['comments'], reverse=True)

# Final cleanup: remove empty/low-signal entries
# Criteria: must have either bounty/reward/paid label OR money keywords in body
import re
money_regex = re.compile(r'\$[\d,]+|[\d,]+\s*(?:usd|eur|gbp|btc|eth)| bounty | reward | grant | sponsor| prize| payment', re.IGNORECASE)

final = []
for item in filtered:
    body = item['body'] or ''
    title = item['title'] or ''
    labels = item['labels']

    labels_lower = [l.lower() for l in labels]
    priority_labels = {'bounty', 'reward', 'paid', 'grant', 'sponsor', 'funded',
                       'bounty-hunt', 'bounty-reward', 'hacktoberfest-accepted'}
    has_priority = any(l in labels_lower for l in priority_labels)

    has_money = bool(money_regex.search(body + ' ' + title))

    # Include if has priority label OR money in body
    if has_priority or has_money:
        final.append(item)
    else:
        print(f'  SKIPPED (no signal): {item["owner"]}/{item["repo"]} - {item["title"][:60]}')

print(f'Final: {len(final)} items')

# Structure output
output = []
for item in final:
    # Extract bounty amount if present
    body = item['body'] or ''
    title = item['title'] or ''

    # Try to find money amounts
    amounts = money_regex.findall(body + ' ' + title)
    bounty_amount = None
    for a in amounts:
        if '$' in a:
            try:
                bounty_amount = a
            except:
                pass

    output.append({
        'owner': item['owner'],
        'repo': item['repo'],
        'title': item['title'],
        'url': item['url'],
        'labels': item['labels'],
        'body': item['body'][:800],  # cap body
        'comments': item['comments'],
        'created_at': item['created_at'],
        'bounty_amount': bounty_amount,
    })

# Save
outpath = r'C:\Users\Administrator\.openclaw\workspace\outreach\github-bounties.json'
with open(outpath, 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f'Saved {len(output)} items to {outpath}')
print()
print('Summary by label:')
from collections import Counter
label_ctr = Counter()
for item in output:
    for l in item['labels']:
        label_ctr[l] += 1
for l, c in label_ctr.most_common(15):
    print(f'  {l}: {c}')

import json
from collections import Counter

with open(r'C:\Users\Administrator\.openclaw\workspace\outreach\github-bounties.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f'Total: {len(items)}')

# Label distribution
label_counter = Counter()
for item in items:
    for label in item['labels']:
        label_counter[label] += 1

print('Top 30 labels:')
for label, cnt in label_counter.most_common(30):
    print(f'  {label}: {cnt}')

# Filter: keep only items with money keywords in body/title OR have specific bounty-related labels
# Also prioritize: bounty label > reward label > paid label > hacktoberfest with money mention
filtered = []
for item in items:
    title_lower = item['title'].lower()
    body_lower = item['body'].lower()
    labels_lower = [l.lower() for l in item['labels']]
    combined = title_lower + ' ' + body_lower + ' ' + ' '.join(labels_lower)

    # Check for payment keywords in body/title
    money_patterns = ['$', 'usd', 'eur', 'gbp', 'dollar', 'reward', 'bounty', 'grant', 'sponsor',
                      'funded', 'payment', 'btc', 'eth', 'crypto', 'prize', ' remuneration',
                      'compensation', 'payout', 'honorarium', 'paid out', 'winnings']

    has_money = any(p in combined for p in money_patterns)

    # Check for bounty/reward/paid/sponsor/grant labels
    bounty_labels = ['bounty', 'reward', 'paid', 'grant', 'sponsor', 'funded',
                     'hacktoberfest-accepted', 'hacktoberfest', 'bounty-hunt', 'bounty-reward']
    has_bounty_label = any(l in labels_lower for l in bounty_labels)

    # Include if it has a bounty label OR has money mention with hacktoberfest
    if has_bounty_label:
        if has_money or 'bounty' in labels_lower or 'reward' in labels_lower:
            filtered.append(item)
        elif 'hacktoberfest' in labels_lower and has_money:
            filtered.append(item)

print(f'After quality filter: {len(filtered)}')

# Deduplicate by URL (should already be done but double-check)
seen = set()
unique_filtered = []
for item in filtered:
    if item['url'] not in seen:
        seen.add(item['url'])
        unique_filtered.append(item)

print(f'After dedup: {len(unique_filtered)}')

# Show sample
for item in unique_filtered[:10]:
    body_preview = item['body'][:100].replace('\n', ' ')
    print(f'  [{item["created_at"][:10]}] {item["owner"]}/{item["repo"]} | labels={item["labels"]} | comments={item["comments"]}')
    print(f'    Title: {item["title"][:100]}')
    print(f'    Body: {body_preview}')

# Save filtered result
with open(r'C:\Users\Administrator\.openclaw\workspace\outreach\github-bounties-filtered.json', 'w', encoding='utf-8') as f:
    json.dump(unique_filtered, f, indent=2, ensure_ascii=False)

print('Filtered result saved to github-bounties-filtered.json')

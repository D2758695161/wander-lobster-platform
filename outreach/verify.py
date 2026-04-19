import json
with open(r'C:\Users\Administrator\.openclaw\workspace\outreach\github-bounties.json', encoding='utf-8') as f:
    items = json.load(f)
print('Total:', len(items))
for i, item in enumerate(items[:10]):
    print(str(i+1) + '. [' + item['created_at'][:10] + '] ' + item['owner'] + '/' + item['repo'])
    print('   Labels: ' + str(item['labels']))
    print('   Title: ' + item['title'][:100])
    print('   Bounty: ' + str(item.get('bounty_amount')) + ' | Comments: ' + str(item['comments']))
    body_preview = item['body'][:80].replace('\n', ' ')
    print('   Body: ' + body_preview)
    print()

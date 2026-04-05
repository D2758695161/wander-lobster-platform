import json
f = open('intl-leads.json', 'r', encoding='utf-8')
d = json.load(f)
f.close()
print('Date:', d.get('date'))
print('Summary:', d.get('summary', '')[:100])
print('Jobs count:', len(d['jobs']))
print()
for j in d['jobs']:
    status = j.get('status', '?')
    email = j.get('email_sent_to', '')
    print(f"  [{status}] {j.get('company')}: {j.get('title')} -> {email}")

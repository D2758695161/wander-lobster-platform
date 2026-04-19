import json
with open('C:/Users/Administrator/.openclaw/workspace/outreach/cn-leads.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
jobs = data['jobs']
pending = [j for j in jobs if j.get('status') == 'pending']
print('Total jobs: {}, Pending: {}'.format(len(jobs), len(pending)))
for j in pending[:20]:
    title = j['title'].encode('utf-8', 'replace').decode('utf-8', 'replace')
    budget = j['budget'].encode('utf-8', 'replace').decode('utf-8', 'replace')
    pid = j['project_id']
    import sys
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    print('ID:{} | {} | {}'.format(pid, title, budget))

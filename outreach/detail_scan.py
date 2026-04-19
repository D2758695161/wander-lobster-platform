import urllib.request, json
TOKEN = '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'

def gh(url):
    req = urllib.request.Request(url)
    req.add_header('Authorization', 'token ' + TOKEN)
    req.add_header('Accept', 'application/vnd.github.v3+json')
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())

# RustChain bounty details
for num in [2849, 2850]:
    d = gh(f'https://api.github.com/repos/Scottcjn/rustchain-bounties/issues/{num}')
    print(f'#{num}: {d["title"]}')
    body = (d.get('body') or '')[:400]
    print(f'  Body: {body}')
    labels = [l['name'] for l in d.get('labels',[])]
    print(f'  Labels: {labels}')
    print(f'  Comments: {d["comments"]}')
    print(f'  URL: {d["html_url"]}')
    print()

# Algora #233
d = gh('https://api.github.com/repos/algora-io/algora/issues/233')
print(f'Algora #{d["number"]}: {d["title"]}')
body = (d.get('body') or '')[:400]
print(f'  Body: {body}')
labels = [l['name'] for l in d.get('labels',[])]
print(f'  Labels: {labels}')
print(f'  Comments: {d["comments"]}')
print(f'  URL: {d["html_url"]}')
print()

# Check for PR on algora #231
print('Checking PR #231 on algora-io/algora...')
d = gh('https://api.github.com/repos/algora-io/algora/pulls/231')
print(f'PR #231 state: {d.get("state")}, merged: {d.get("merged")}')
print(f'  Title: {d["title"]}')
print()

# Check ResearchHub bounty labels
d = gh('https://api.github.com/search/issues?q=repo:ResearchHub/web+label:bounty+created:%3E2026-04-01&per_page=10&sort=created&order=desc')
print('=== RESEARCHHUB bounty issues ===')
for i in d.get('items',[])[:5]:
    print(f'#{i["number"]}: {i["title"][:70]} | {i["comments"]} comments | {i["html_url"]}')

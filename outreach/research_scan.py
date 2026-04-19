import urllib.request, json

TOKEN = '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'

def gh(url):
    req = urllib.request.Request(url)
    req.add_header('Authorization', 'token ' + TOKEN)
    req.add_header('Accept', 'application/vnd.github.v3+json')
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())

# Check Algora
print('=== ALGORA bounties (last 7d) ===')
try:
    d = gh('https://api.github.com/search/issues?q=repo:algora-io/algora+bounty+created:%3E2026-04-01&per_page=10&sort=created&order=desc')
    for i in d.get('items',[])[:8]:
        print(f'algora #{i["number"]} | {i["title"][:70]} | {i["comments"]} comments')
except Exception as e:
    print(f'Error: {e}')

print()

# Check SuperteamDAO
print('=== SUPERTEAMDAO bounties (last 7d) ===')
try:
    d = gh('https://api.github.com/search/issues?q=repo:superteamDAO/superteam+bounty+created:%3E2026-04-01&per_page=10&sort=created&order=desc')
    for i in d.get('items',[])[:8]:
        print(f'superteam #{i["number"]} | {i["title"][:70]} | {i["comments"]} comments')
except Exception as e:
    print(f'Error: {e}')

print()

# Check Layer3
print('=== LAYER3 bounties (last 7d) ===')
try:
    d = gh('https://api.github.com/search/issues?q=repo:layer3xyz/bounties+created:%3E2026-04-01&per_page=10&sort=created&order=desc')
    for i in d.get('items',[])[:8]:
        print(f'layer3 #{i["number"]} | {i["title"][:70]} | {i["comments"]} comments')
except Exception as e:
    print(f'Error: {e}')

print()

# Check Gitcoin
print('=== GITCOIN bounties (last 7d) ===')
try:
    d = gh('https://api.github.com/search/issues?q=repo:gitcoinco/grants-stack+issue+created:%3E2026-04-01&per_page=10&sort=created&order=desc')
    for i in d.get('items',[])[:8]:
        print(f'gitcoin #{i["number"]} | {i["title"][:70]} | {i["comments"]} comments')
except Exception as e:
    print(f'Error: {e}')

print()

# Search for new repos with "tip" or "reward" or "grant"
print('=== NEW repos: tip/reward/grant ===')
try:
    d = gh('https://api.github.com/search/repositories?q=tip+OR+reward+OR+grant+created:%3E2026-04-01&sort=stars&order=desc&per_page=15')
    for r in d.get('items',[])[:10]:
        desc = r.get('description') or ''
        print(f'{r["full_name"]} | {r["stargazers_count"]} stars | {desc[:70]}')
except Exception as e:
    print(f'Error: {e}')

print()

# Product Hunt type: dev/AI tools repos
print('=== AI/DEV tool repos (new) ===')
try:
    d = gh('https://api.github.com/search/repositories?q=AI+agent+API+tool+created:%3E2026-04-01&sort=stars&order=desc&per_page=15')
    for r in d.get('items',[])[:10]:
        desc = r.get('description') or ''
        print(f'{r["full_name"]} | {r["stargazers_count"]} stars | {desc[:70]}')
except Exception as e:
    print(f'Error: {e}')

print()
print('=== DONE ===')

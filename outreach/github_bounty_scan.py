import urllib.request, json

TOKEN = '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'

def gh_search(url):
    req = urllib.request.Request(url)
    req.add_header('Authorization', 'token ' + TOKEN)
    req.add_header('Accept', 'application/vnd.github.v3+json')
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())

# 1. Bounty-labeled issues (last 7 days)
print('=== BOUNTY ISSUES (last 7 days) ===')
d = gh_search('https://api.github.com/search/issues?q=label:bounty+created:%3E2026-04-01&per_page=20&sort=created&order=desc')
for i in d.get('items',[])[:15]:
    repo = i['repository_url'].split('/')[-2:]
    print(f'{repo[0]}/{repo[1]} #{i["number"]} | {i["title"][:70]} | {i["created_at"][:10]} | {i["comments"]} comments')

print()
print('=== REWARD ISSUES (last 7 days) ===')
d = gh_search('https://api.github.com/search/issues?q=label:reward+created:%3E2026-04-01&per_page=15&sort=created&order=desc')
for i in d.get('items',[])[:10]:
    repo = i['repository_url'].split('/')[-2:]
    print(f'{repo[0]}/{repo[1]} #{i["number"]} | {i["title"][:70]} | {i["comments"]} comments')

print()
print('=== NEW BUG BOUNTY REPOS ===')
d = gh_search('https://api.github.com/search/repositories?q=bug+bounty+created:%3E2026-04-01&sort=stars&order=desc&per_page=15')
for r in d.get('items',[])[:10]:
    desc = r.get('description') or ''
    print(f'{r["full_name"]} | {r["stargazers_count"]} stars | {desc[:70]}')

print()
print('=== $ bounty in title ===')
d = gh_search('https://api.github.com/search/issues?q=bounty+created:%3E2026-04-01+USD+in:title&per_page=15&sort=created&order=desc')
for i in d.get('items',[])[:10]:
    repo = i['repository_url'].split('/')[-2:]
    print(f'{repo[0]}/{repo[1]} #{i["number"]} | {i["title"][:70]} | {i["comments"]} comments')

print()
print('=== bounty in READMEs ===')
d = gh_search('https://api.github.com/search/code?q=bounty+in:readme+created:%3E2026-04-01&per_page=10&sort=indexed&order=desc')
for i in d.get('items',[])[:10]:
    print(f'{i["repository"]["full_name"]} | {i["name"]}')

print()
print('=== GitHub Sponsors projects (new) ===')
d = gh_search('https://api.github.com/search/repositories?q=github+sponsors+created:%3E2026-04-01&sort=stars&order=desc&per_page=15')
for r in d.get('items',[])[:10]:
    desc = r.get('description') or ''
    print(f'{r["full_name"]} | {r["stargazers_count"]} stars | {desc[:70]}')

import urllib.request, json

TOKEN = "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"
headers = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "leads-researcher/1.0"
}

results = {}

# 1. Search repos with bounty in name, created recently
print("=== BOUNTY REPOS (last 7 days) ===")
req = urllib.request.Request(
    "https://api.github.com/search/repositories?q=bounty+created:>2026-03-30&sort=stars&order=desc&per_page=15",
    headers=headers
)
try:
    resp = urllib.request.urlopen(req, timeout=15)
    data = json.loads(resp.read())
    for r in data.get("items", []):
        stars = r.get("stargazers_count", 0)
        name = r.get("full_name", "")
        url = r.get("html_url", "")
        desc = r.get("description", "")
        lang = r.get("language", "")
        print(f"{name} stars:{stars} lang:{lang}")
        print(f"  {url}")
        print(f"  desc: {desc}")
        results[name] = {"type": "bounty-repo", "stars": stars, "url": url, "desc": desc}
except Exception as e:
    print(f"Error: {e}")

print()

# 2. Search issues with bounty label, recent
print("=== BOUNTY ISSUES (last 7 days) ===")
req2 = urllib.request.Request(
    "https://api.github.com/search/issues?q=label:bounty+created:>2026-03-30+type:issue&per_page=20&sort=created&order=desc",
    headers=headers
)
try:
    resp2 = urllib.request.urlopen(req2, timeout=15)
    data2 = json.loads(resp2.read())
    for i in data2.get("items", [])[:15]:
        repo_name = "/".join(i["repository_url"].split("/")[-2:])
        comments = i.get("comments", 0)
        title = i.get("title", "")
        url = i.get("html_url", "")
        labels = [l["name"] for l in i.get("labels", [])]
        print(f"{repo_name} [{comments} comments] labels:{labels}")
        print(f"  {title}")
        print(f"  {url}")
except Exception as e:
    print(f"Error: {e}")

print()

# 3. Search repos with "reward" in description, recent
print("=== REWARD REPOS (last 7 days) ===")
req3 = urllib.request.Request(
    "https://api.github.com/search/repositories?q=reward+created:>2026-03-30&sort=stars&order=desc&per_page=10",
    headers=headers
)
try:
    resp3 = urllib.request.urlopen(req3, timeout=15)
    data3 = json.loads(resp3.read())
    for r in data3.get("items", []):
        stars = r.get("stargazers_count", 0)
        name = r.get("full_name", "")
        url = r.get("html_url", "")
        desc = r.get("description", "")
        print(f"{name} stars:{stars}")
        print(f"  {url}")
        print(f"  desc: {desc}")
except Exception as e:
    print(f"Error: {e}")

print()

# 4. Search for 'good-first-issue' recently updated (big repos)
print("=== BIG REPOS with recent good-first-issues ===")
big_repos = ["microsoft/vscode", "facebook/react", "vercel/next.js", "tailwindlabs/tailwindcss", "nodejs/node", "denoland/deno"]
for repo in big_repos:
    req4 = urllib.request.Request(
        f"https://api.github.com/repos/{repo}/issues?labels=good-first-issue&state=open&per_page=3&sort=created&direction=desc",
        headers=headers
    )
    try:
        resp4 = urllib.request.urlopen(req4, timeout=10)
        data4 = json.loads(resp4.read())
        if data4:
            print(f"\n{repo} - good-first-issues:")
            for issue in data4[:3]:
                print(f"  #{issue['number']}: {issue['title']}")
                print(f"  {issue['html_url']}")
    except Exception as e:
        print(f"Error for {repo}: {e}")

print()

# 5. Check RapidAPI categories for new APIs
print("=== RAPIDAPI ===")
try:
    req5 = urllib.request.Request(
        "https://api.rapidapi.com/v1/categories",
        headers={"X-RapidAPI-Key": "demo", "X-RapidAPI-Host": "api.rapidapi.com"}
    )
    resp5 = urllib.request.urlopen(req5, timeout=10)
    print("RapidAPI categories accessible")
except Exception as e:
    print(f"RapidAPI error: {e}")

# 6. Check for new freelance platforms
print("\n=== FREELANCE PLATFORM STATUS ===")
platforms = [
    ("https://proginn.com", "Proginn"),
    ("https://eleduck.com", "EleDuck"),
    ("https://topio.io", "Topio"),
]
for url, name in platforms:
    try:
        req6 = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp6 = urllib.request.urlopen(req6, timeout=8)
        print(f"{name}: OK ({resp6.status})")
    except Exception as e:
        print(f"{name}: ERROR - {e}")

print("\n=== PRODUCT HUNT ===")
try:
    req7 = urllib.request.Request(
        "https://api.producthunt.com/v1/posts",
        headers={"Authorization": "Bearer demo", "Content-Type": "application/json"}
    )
    resp7 = urllib.request.urlopen(req7, timeout=10)
    print("Product Hunt API: accessible")
except Exception as e:
    print(f"Product Hunt: {e}")

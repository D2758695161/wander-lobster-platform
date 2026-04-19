import urllib.request, json, sys

TOKEN = "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"
headers = {"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github.v3+json", "User-Agent": "leads-researcher/1.0"}

def fetch(url):
    req = urllib.request.Request(url, headers=headers)
    resp = urllib.request.urlopen(req, timeout=15)
    return json.loads(resp.read())

# Check SPLURT bounty details
print("=== SPLURT S.P.L.U.R.T-tg #931 ===")
try:
    d = fetch("https://api.github.com/repos/SPLURT-Station/S.P.L.U.R.T-tg/issues/931")
    print("Title: " + d["title"])
    print("Body: " + (d.get("body","") or "none")[:800])
    print("Labels: " + str([l["name"] for l in d.get("labels",[])]))
    print("Comments: " + str(d["comments"]))
except Exception as e:
    print("Error: " + str(e))

print()

# Check solfoundry bounty
print("=== SolFoundry/solfoundry bounty issues ===")
try:
    d2 = fetch("https://api.github.com/repos/SolFoundry/solfoundry/issues?labels=bounty&state=open&per_page=10&sort=created&direction=desc")
    for issue in d2:
        print("Issue #" + str(issue["number"]) + ": " + issue["title"])
        print("  Labels: " + str([l["name"] for l in issue.get("labels",[])]))
        print("  Comments: " + str(issue["comments"]))
        body = issue.get("body","")
        if body:
            print("  Body: " + body[:400])
        print()
except Exception as e:
    print("Error: " + str(e))

print()

# Check kcolbchain/muzix bounty
print("=== kcolbchain/muzix bounty issues ===")
try:
    d3 = fetch("https://api.github.com/repos/kcolbchain/muzix/issues?labels=bounty&state=open&per_page=10&sort=created&direction=desc")
    for issue in d3:
        print("Issue #" + str(issue["number"]) + ": " + issue["title"])
        print("  Labels: " + str([l["name"] for l in issue.get("labels",[])]))
        print("  Comments: " + str(issue["comments"]))
        body = issue.get("body","")
        if body:
            print("  Body: " + body[:400])
        print()
except Exception as e:
    print("Error: " + str(e))

print()

# Check Btr4k/bugbounty-agent
print("=== Btr4k/bugbounty-agent ===")
try:
    repo = fetch("https://api.github.com/repos/Btr4k/bugbounty-agent")
    print("Stars: " + str(repo.get("stargazers_count")))
    print("Description: " + str(repo.get("description")))
    print("Open issues: " + str(repo.get("open_issues_count")))
    # Get FUNDING.yml or sponsor info
    issues = fetch("https://api.github.com/repos/Btr4k/bugbounty-agent/issues?state=open&per_page=10&sort=created&direction=desc")
    for issue in issues[:5]:
        print("Issue #" + str(issue["number"]) + ": " + issue["title"])
        print("  Labels: " + str([l["name"] for l in issue.get("labels",[])]))
except Exception as e:
    print("Error: " + str(e))

print()

# Check Infatoshi/crucible
print("=== Infatoshi/crucible ===")
try:
    repo2 = fetch("https://api.github.com/repos/Infatoshi/crucible")
    print("Stars: " + str(repo2.get("stargazers_count")))
    print("Description: " + str(repo2.get("description")))
    issues2 = fetch("https://api.github.com/repos/Infatoshi/crucible/issues?state=open&per_page=10&sort=created&direction=desc")
    for issue in issues2[:5]:
        print("Issue #" + str(issue["number"]) + ": " + issue["title"])
        print("  Labels: " + str([l["name"] for l in issue.get("labels",[])]))
        print("  Body: " + (issue.get("body","") or "")[:200])
except Exception as e:
    print("Error: " + str(e))

print()

# Check if there is FUNDING.yml on some key repos
print("=== FUNDING.yml checks ===")
funding_repos = ["Btr4k/bugbounty-agent", "SolFoundry/solfoundry", "kcolbchain/muzix", "SPLURT-Station/S.P.L.U.R.T-tg"]
for full_name in funding_repos:
    parts = full_name.split("/")
    try:
        url = f"https://api.github.com/repos/{parts[0]}/{parts[1]}/contents/.github/FUNDING.yml"
        req = urllib.request.Request(url, headers=headers)
        resp = urllib.request.urlopen(req, timeout=10)
        print(f"{full_name}: has FUNDING.yml")
    except Exception:
        try:
            url2 = f"https://api.github.com/repos/{parts[0]}/{parts[1]}/contents/FUNDING.yml"
            req2 = urllib.request.Request(url2, headers=headers)
            resp2 = urllib.request.urlopen(req2, timeout=10)
            print(f"{full_name}: has FUNDING.yml")
        except Exception:
            print(f"{full_name}: no FUNDING.yml found")

print()
print("=== NEW Sponsorable GitHub users (last 7 days) ===")
try:
    d4 = fetch("https://api.github.com/search/users?q=type:user+sponsorable+created:>2026-03-30&per_page=10&sort=joined&order=desc")
    for user in d4.get("items", []):
        print(user.get("login") + " " + user.get("html_url"))
except Exception as e:
    print("Error: " + str(e))

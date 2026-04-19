import urllib.request, json, re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

TOKEN = "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"
headers = {"Authorization": "token " + TOKEN, "Accept": "application/vnd.github.v3+json", "User-Agent": "leads-researcher/1.0"}

def fetch(url):
    req = urllib.request.Request(url, headers=headers)
    resp = urllib.request.urlopen(req, timeout=15)
    return json.loads(resp.read())

# Get SolFoundry bounty issues
print("=== SolFoundry/solfoundry bounties ===")
try:
    data = fetch("https://api.github.com/repos/SolFoundry/solfoundry/issues?labels=bounty&state=open&per_page=15&sort=created&direction=desc")
    for issue in data:
        print("---")
        print("#" + str(issue["number"]) + ": " + issue["title"])
        labels = [l["name"] for l in issue.get("labels",[])]
        print("Labels: " + str(labels))
        print("Comments: " + str(issue["comments"]))
        body = issue.get("body","") or ""
        amounts = re.findall(r"\$[0-9,]+|USD[B]?[T]?[0-9,]*|[0-9]+\s*(?:RTC|FND|SOL|token|FNDR)", body, re.IGNORECASE)
        if amounts:
            print("Amounts: " + str(amounts[:10]))
        if body:
            print("Body: " + body[:600])
except Exception as e:
    print("Error: " + str(e))

print()

# Get kcolbchain/muzix bounty amounts
print("=== kcolbchain/muzix bounty amounts ===")
try:
    data2 = fetch("https://api.github.com/repos/kcolbchain/muzix/issues?labels=bounty&state=open&per_page=10&sort=created&direction=desc")
    for issue in data2:
        print("---")
        print("#" + str(issue["number"]) + ": " + issue["title"])
        labels = [l["name"] for l in issue.get("labels",[])]
        print("Labels: " + str(labels))
        body = issue.get("body","") or ""
        amounts = re.findall(r"\$[0-9,]+|USD[B]?[T]?[0-9,]*|[0-9]+\s*(?:RTC|FND|SOL|token|MUSD)", body, re.IGNORECASE)
        if amounts:
            print("Amounts: " + str(amounts[:10]))
        else:
            print("(no explicit amounts found)")
        # Check comments for bounty amounts
        comments_url = "https://api.github.com/repos/kcolbchain/muzix/issues/" + str(issue["number"]) + "/comments"
        comments = fetch(comments_url)
        for c in comments:
            cbody = c.get("body","")
            amounts_c = re.findall(r"\$[0-9,]+|USD[B]?[T]?[0-9,]*", cbody, re.IGNORECASE)
            if amounts_c:
                print("Comment by " + c["user"]["login"] + ": " + str(amounts_c[:5]))
except Exception as e:
    print("Error: " + str(e))

print()

# Check SPLURT bounty board
print("=== SPLURT-Station S.P.L.U.R.T-tg bounty label issues ===")
try:
    data3 = fetch("https://api.github.com/repos/SPLURT-Station/S.P.L.U.R.T-tg/issues?labels=bounty&state=open&per_page=10&sort=created&direction=desc")
    for issue in data3:
        print("---")
        print("#" + str(issue["number"]) + ": " + issue["title"])
        print("Comments: " + str(issue["comments"]))
        body = issue.get("body","") or ""
        amounts = re.findall(r"\$[0-9,]+|USD[B]?[T]?[0-9,]*", body, re.IGNORECASE)
        if amounts:
            print("Amounts: " + str(amounts[:10]))
        # Get comments for payment info
        comments_url = "https://api.github.com/repos/SPLURT-Station/S.P.L.U.R.T-tg/issues/" + str(issue["number"]) + "/comments"
        comments = fetch(comments_url)
        for c in comments:
            cbody = c.get("body","")
            if any(x in cbody.lower() for x in ["payment", "bounty", "reward", "discord", "contact"]):
                print("Comment by " + c["user"]["login"] + ": " + cbody[:200])
except Exception as e:
    print("Error: " + str(e))

print()

# Search for repos with FUNDING.yml + bounty keyword
print("=== Repos with FUNDING + bounty recently ===")
try:
    search_url = "https://api.github.com/search/repositories?q=FUNDING+bounty+created:%3E2026-03-30&sort=stars&order=desc&per_page=10"
    d = fetch(search_url)
    for r in d.get("items", []):
        print(r["full_name"] + " stars:" + str(r["stargazers_count"]))
        print("  " + r["html_url"])
        print("  desc: " + str(r.get("description","")))
except Exception as e:
    print("Error: " + str(e))

print()

# Search for repos with "sponsor" in FUNDING.yml and recently active
print("=== High-star repos with FUNDING.yml + 'sponsor' label recently ===")
try:
    search_url2 = "https://api.github.com/search/repositories?q=sponsorable+created:%3E2026-03-25&sort=stars&order=desc&per_page=10"
    d2 = fetch(search_url2)
    for r in d2.get("items", []):
        print(r["full_name"] + " stars:" + str(r["stargazers_count"]))
        print("  " + r["html_url"])
        print("  desc: " + str(r.get("description","")))
except Exception as e:
    print("Error: " + str(e))

print()

# Check eleduck for new postings
print("=== EleDuck new jobs ===")
try:
    req = urllib.request.Request("https://api.eleduck.com/api/v1/jobs?page=1&page_size=10&status=published", headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=10)
    print("EleDuck API: accessible - " + str(resp.status))
except Exception as e:
    print("EleDuck: " + str(e))

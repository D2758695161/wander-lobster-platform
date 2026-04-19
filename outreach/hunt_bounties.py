#!/usr/bin/env python3
"""Bounty hunting script - find and submit PRs for bounties"""

import subprocess
import json
import os
from datetime import datetime

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")

def gh_api(endpoint, params=None):
    """Make GitHub API request"""
    cmd = ["gh", "api", endpoint]
    if params:
        for k, v in params.items():
            cmd.extend(["--field", f"{k}={v}"])
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ERROR: {result.stderr[:200]}")
        return None
    try:
        return json.loads(result.stdout)
    except:
        return result.stdout

def gh_api_raw(endpoint):
    """Raw gh api call returning stdout"""
    result = subprocess.run(["gh", "api", endpoint], capture_output=True, text=True)
    return result.stdout

def search_issues(query):
    """Search issues and return list of dicts"""
    output = gh_api_raw(f"search/issues?q={query.replace(' ', '+')}&per_page=30")
    if not output.strip():
        return []
    try:
        data = json.loads(output)
        return data.get("items", [])
    except:
        return []

def check_prs_exist(repo, issue_number):
    """Check if PR already exists for an issue"""
    prs = gh_api(f"repos/{repo}/issues/{issue_number}/pull_requests") or []
    return len(prs) > 0

def get_issue_comments(repo, issue_number):
    """Get issue comments"""
    comments = gh_api(f"repos/{repo}/issues/{issue_number}/comments") or []
    return comments

def fork_repo(repo):
    """Fork a repository"""
    result = subprocess.run(["gh", "repo", "fork", repo, "--clone=false"], 
                          capture_output=True, text=True)
    if result.returncode == 0:
        print(f"  Forked {repo}")
        return True
    else:
        print(f"  Fork failed: {result.stderr[:100]}")
        return False

def clone_and_setup(repo, branch_name):
    """Clone repo and setup branch"""
    local_path = f"/tmp/bounty_{repo.replace('/', '_')}_{branch_name}"
    work_dir = f"/tmp/bounty_work_{repo.replace('/', '_')}"
    
    # Clean up
    subprocess.run(f"rm -rf {local_path} {work_dir}", shell=True, capture_output=True)
    
    # Clone fork
    fork_url = f"https://github.com/D2758695161/{repo.split('/')[-1]}.git"
    result = subprocess.run(["git", "clone", "--quiet", "--branch", "main", fork_url, local_path],
                          capture_output=True, text=True)
    if result.returncode != 0:
        # Try master
        result = subprocess.run(["git", "clone", "--quiet", "--branch", "master", fork_url, local_path],
                              capture_output=True, text=True)
        if result.returncode != 0:
            print(f"  Clone failed")
            return None, None
    
    # Create feature branch
    subprocess.run(["git", "config", "--global", "user.email", "d2758695161@github.com"], capture_output=True)
    subprocess.run(["git", "config", "--global", "user.name", "D2758695161"], capture_output=True)
    subprocess.run(["git", "checkout", "-b", branch_name], cwd=local_path, capture_output=True)
    
    return local_path, work_dir

def commit_and_pr(local_path, repo, branch_name, title, body):
    """Commit changes and create PR"""
    subprocess.run(["git", "add", "."], cwd=local_path, capture_output=True)
    subprocess.run(["git", "commit", "-m", title], cwd=local_path, capture_output=True)
    subprocess.run(["git", "push", "-u", "origin", branch_name, "--quiet"], cwd=local_path, capture_output=True)
    
    # Create PR
    result = subprocess.run([
        "gh", "pr", "create", "--repo", repo, "--title", title, "--body", body, "--base", "main"
    ], cwd=local_path, capture_output=True, text=True)
    
    if result.returncode == 0:
        pr_url = result.stdout.strip()
        print(f"  PR created: {pr_url}")
        return pr_url
    else:
        # Try master
        result = subprocess.run([
            "gh", "pr", "create", "--repo", repo, "--title", title, "--body", body, "--base", "master"
        ], cwd=local_path, capture_output=True, text=True)
        if result.returncode == 0:
            return result.stdout.strip()
        print(f"  PR failed: {result.stderr[:200]}")
        return None

def post_comment(repo, issue_number, body):
    """Post comment on issue"""
    result = subprocess.run([
        "gh", "issue", "comment", f"{repo}#{issue_number}", "--body", body
    ], capture_output=True, text=True)
    return result.returncode == 0

def main():
    print("=" * 60)
    print("BOUNTY HUNTER - Starting search")
    print("=" * 60)
    
    results = []
    date_str = datetime.now().strftime("%Y-%m-%d")
    
    # Search queries
    queries = [
        "is:issue is:open label:bounty created:>2026-04-01 comments:<3",
        "is:issue is:open $ in:title created:>2026-04-05 comments:<3",
        "is:issue is:open \"good first issue\" \"bounty\" comments:<3 created:>2026-03-25",
    ]
    
    all_issues = []
    seen = set()
    
    for query in queries:
        print(f"\nSearching: {query[:80]}...")
        issues = search_issues(query)
        print(f"  Found {len(issues)} issues")
        for issue in issues:
            key = f"{issue['repository_url']}/{issue['number']}"
            if key not in seen:
                seen.add(key)
                all_issues.append(issue)
    
    print(f"\nTotal unique issues: {len(all_issues)}")
    
    # Save raw results
    os.makedirs("C:/Users/Administrator/.openclaw/workspace/outreach", exist_ok=True)
    with open(f"C:/Users/Administrator/.openclaw/workspace/outreach/quick-bounties-{date_str}.json", "w") as f:
        json.dump(all_issues, f, indent=2)
    
    # Analyze each issue
    print("\n" + "=" * 60)
    print("ANALYZING BOUNTIES")
    print("=" * 60)
    
    for issue in all_issues[:15]:  # Top 15
        repo_url = issue['repository_url']
        repo = "/".join(repo_url.split("/")[-2:])
        num = issue['number']
        title = issue['title']
        html_url = issue['html_url']
        comments = issue['comments']
        
        print(f"\n#{num} [{repo}] {title}")
        print(f"  URL: {html_url}")
        print(f"  Comments: {comments}")
        
        # Extract $ amount
        import re
        amounts = re.findall(r'\$[\d,]+', title)
        if amounts:
            print(f"  Bounty: {amounts}")
        
        # Check if PR exists
        if check_prs_exist(repo, num):
            print(f"  SKIP: PR already exists")
            continue
        
        # Get full issue details
        issue_data = gh_api(f"repos/{repo}/issues/{num}")
        if issue_data:
            body = issue_data.get('body', '')[:500]
            print(f"  Body: {body[:200]}...")
    
    print("\n" + "=" * 60)
    print("SAVED to quick-bounties-{date}.json")
    print("=" * 60)

if __name__ == "__main__":
    main()

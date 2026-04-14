import subprocess, requests

result = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True)
token = result.stdout.strip()
headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github+json'}

# Create PR
pr_url = 'https://api.github.com/repos/nashsu/llm_wiki/pulls'
pr_payload = {
    'title': 'fix: display markdown file content instead of showing empty placeholder',
    'body': 'Fixes issue #15: .md files show empty content because getFileCategory() returns "markdown" for markdown files, but the FilePreview switch has no case for "markdown", falling through to BinaryPlaceholder.\n\nAdded case "markdown": that renders TextPreview, same as the "text" case.',
    'head': 'D2758695161:fix-md-file-empty',
    'base': 'main'
}
r3 = requests.post(pr_url, headers=headers, json=pr_payload)
print('PR status:', r3.status_code)
if r3.status_code not in (201, 200):
    print('PR error:', r3.text[:500])
else:
    pr_data = r3.json()
    print('PR created:', pr_data['html_url'])
    print('PR number:', pr_data['number'])

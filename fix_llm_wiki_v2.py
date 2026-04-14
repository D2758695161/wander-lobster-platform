import subprocess, requests, base64, json

result = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True)
token = result.stdout.strip()
headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github+json'}

# Read the original file
with open('C:/Users/Administrator/.openclaw/workspace/bounty-hunter-kit/file-preview-orig.tsx', 'r', encoding='utf-8') as f:
    orig_content = f.read()

# Add markdown case after text case
old_text = '    case "text":\n      return <TextPreview filePath={filePath} content={textContent} label="Text" />'
new_text = old_text + '\n    case "markdown":\n      return <TextPreview filePath={filePath} content={textContent} label="Markdown" />'

new_content = orig_content.replace(old_text, new_text)
if new_content == orig_content:
    print('ERROR: Replacement failed')
    exit(1)
print('New content length:', len(new_content))

# Get SHA from the fix-md-file-empty branch
r = requests.get('https://api.github.com/repos/D2758695161/llm_wiki/contents/src/components/editor/file-preview.tsx?ref=fix-md-file-empty', headers=headers)
data = r.json()
sha = data['sha']
print('Current SHA on fix-md-file-empty:', sha)

# Commit to fix-md-file-empty branch
url = 'https://api.github.com/repos/D2758695161/llm_wiki/contents/src/components/editor/file-preview.tsx'
payload = {
    'message': 'fix: add markdown case to display .md file content (issue #15)',
    'content': base64.b64encode(new_content.encode('utf-8')).decode('ascii'),
    'sha': sha,
    'branch': 'fix-md-file-empty'
}
r2 = requests.put(url, headers=headers, json=payload)
print('Commit status:', r2.status_code)
if r2.status_code != 200:
    print('Error:', r2.text[:300])
else:
    print('Commit successful')
    # Create PR
    pr_url = 'https://api.github.com/repos/nashsu/llm_wiki/pulls'
    pr_payload = {
        'title': 'fix: display markdown file content instead of showing empty placeholder',
        'body': 'Fixes issue #15\n\n.md files show empty content because getFileCategory() returns "markdown" for markdown files, but the FilePreview switch has no case for "markdown", falling through to BinaryPlaceholder.\n\nAdded `case "markdown":` that renders TextPreview, same as the "text" case.',
        'head': 'D2758695161:fix-md-file-empty',
        'base': 'main'
    }
    r3 = requests.post(pr_url, headers=headers, json=pr_payload)
    print('PR status:', r3.status_code)
    if r3.status_code not in (201, 200):
        print('PR error:', r3.text[:300])
    else:
        pr_data = r3.json()
        print('PR created:', pr_data['html_url'])
        print('PR number:', pr_data['number'])

import subprocess, requests, base64, json

result = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True)
token = result.stdout.strip()
headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github+json'}

# Read the original file
with open('C:/Users/Administrator/.openclaw/workspace/bounty-hunter-kit/file-preview-orig.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add markdown case after text case
old = '    case "text":\n      return <TextPreview filePath={filePath} content={textContent} label="Text" />'
new = old + '\n    case "markdown":\n      return <TextPreview filePath={filePath} content={textContent} label="Markdown" />'

new_content = content.replace(old, new)
assert new_content != content, 'Replacement failed'
print('Replacement OK, new length:', len(new_content))

# Get SHA of the file in my fork
r = requests.get('https://api.github.com/repos/D2758695161/llm_wiki/contents/src/components/editor/file-preview.tsx', headers=headers)
sha = r.json()['sha']

# Commit to my fork using PUT
url = 'https://api.github.com/repos/D2758695161/llm_wiki/contents/src/components/editor/file-preview.tsx'
payload = {
    'message': 'fix: add markdown case to FilePreview switch to display .md content',
    'content': base64.b64encode(new_content.encode('utf-8')).decode('ascii'),
    'sha': sha
}
r2 = requests.put(url, headers=headers, json=payload)
print('Commit status:', r2.status_code)
if r2.status_code != 200:
    print('Error:', r2.text[:200])
else:
    print('Committed OK')
    # Create PR
    pr_url = 'https://api.github.com/repos/nashsu/llm_wiki/pulls'
    pr_payload = {
        'title': 'fix: display markdown file content instead of showing empty placeholder',
        'body': '## Summary\n\nFixes issue #15: .md files show empty content because `getFileCategory()` returns `"markdown"` for markdown files, but the `FilePreview` switch has no case for `"markdown"`, falling through to `BinaryPlaceholder`.\n\n## Fix\n\nAdded `case "markdown":` that renders `TextPreview`, same as the `"text"` case.\n\n```tsx\ncase "markdown":\n  return <TextPreview filePath={filePath} content={textContent} label="Markdown" />\n```\n\n## Testing\n\n- Create a wiki store with a .md file\n- Open it in the editor\n- The file content should now display correctly instead of showing "File content is empty"',
        'head': 'D2758695161:patch-1',
        'base': 'main'
    }
    r3 = requests.post(pr_url, headers=headers, json=pr_payload)
    print('PR status:', r3.status_code)
    if r3.status_code != 201:
        print('PR error:', r3.text[:200])
    else:
        pr_data = r3.json()
        print('PR created:', pr_data['html_url'])

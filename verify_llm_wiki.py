import subprocess, requests, base64
result = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True)
token = result.stdout.strip()
headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github+json'}

# Verify the file content in my fork
r = requests.get('https://api.github.com/repos/D2758695161/llm_wiki/contents/src/components/editor/file-preview.tsx?ref=fix-md-file-empty', headers=headers)
data = r.json()
content = base64.b64decode(data['content']).decode('utf-8', errors='replace')
# Check for markdown case
if 'case "markdown":' in content:
    print('FIX VERIFIED: markdown case found')
else:
    print('FIX NOT FOUND')
    # Show relevant section
    idx = content.find('case "text"')
    print(content[idx:idx+200])

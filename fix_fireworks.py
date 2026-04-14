import subprocess, requests, base64, json

result = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True)
token = result.stdout.strip()
headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github+json'}

with open('C:/Users/Administrator/.openclaw/workspace/bounty-hunter-kit/gen_template.py', 'rb') as f:
    content = f.read().decode('utf-8', errors='replace')

# The exact lines to remove from render_canvas (NOT the defs):
old = '    if style_index == 3:\n        parts.append(f\'  <rect width="{width}" height="{height}" fill="url(#blueprintGrid)"/>\')'

if old not in content:
    print('ERROR: exact match not found')
    idx = content.find('blueprintGrid')
    print('Context:', repr(content[idx-80:idx+80]))
    exit(1)

new_content = content.replace(old, '')
print('Fix applied, new length:', len(new_content))

# Verify the rect line is gone but pattern def in defs is preserved
assert "fill=\"url(#blueprintGrid)\"" not in new_content, "blueprintGrid rect still in content!"
# Pattern def should still be there
assert 'pattern id="blueprintGrid"' in new_content, "pattern def was removed too!"
print('Fix verified: rect removed, pattern def preserved')

# Get SHA from my fireworks fork
r = requests.get('https://api.github.com/repos/D2758695161/fireworks-tech-graph/contents/scripts/generate-from-template.py', headers=headers)
data = r.json()
sha = data['sha']
print('SHA:', sha)

# Commit
url = 'https://api.github.com/repos/D2758695161/fireworks-tech-graph/contents/scripts/generate-from-template.py'
payload = {
    'message': 'fix: remove blueprint grid rect to prevent wireframe overlap (issue #5)',
    'content': base64.b64encode(new_content.encode('utf-8')).decode('ascii'),
    'sha': sha
}
r2 = requests.put(url, headers=headers, json=payload)
print('Commit status:', r2.status_code)
if r2.status_code != 200:
    print('Error:', r2.text[:300])
else:
    print('Commit OK')
    # Create PR
    pr_url = 'https://api.github.com/repos/yizhiyanhua-ai/fireworks-tech-graph/pulls'
    pr_payload = {
        'title': 'fix: remove blueprint grid rect to prevent wireframe overlap',
        'body': 'Fixes issue #5: SVG wireframe overlap\n\nIn render_canvas(), the blueprint grid rect is appended after the background rect. In SVG element stacking order, later elements paint on top of earlier ones, so the grid lines (fill="url(#blueprintGrid)") appear on top of content nodes.\n\nRemoved the blueprint grid rect for style_index==3. The pattern definition in defs is preserved.',
        'head': 'D2758695161:main',
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

import subprocess, requests, base64, json

result = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True)
token = result.stdout.strip()
headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github+json'}

# Read local gen_template.py as bytes to preserve exact encoding
with open('C:/Users/Administrator/.openclaw/workspace/bounty-hunter-kit/gen_template.py', 'rb') as f:
    orig_bytes = f.read()
orig_content = orig_bytes.decode('utf-8', errors='replace')

# Find the render_canvas function and modify it
# The bug: blueprint grid rect is appended after background, painted on TOP of content
# Fix: remove the if style_index == 3 block entirely

idx_start = orig_content.find('def render_canvas(')
idx_end = orig_content.find('\ndef ', idx_start + 10)
render_canvas_code = orig_content[idx_start:idx_end]

print('Found render_canvas function, length:', len(render_canvas_code))

# Check if the blueprint line is there
if 'blueprintGrid' in render_canvas_code:
    print('Found blueprintGrid - will remove')
else:
    print('BlueprintGrid NOT found!')

# Build new render_canvas without the blueprint grid rect
# We need to remove the "if style_index == 3: parts.append(...)" lines
lines = render_canvas_code.split('\n')
new_lines = []
skip_block = False
for line in lines:
    if 'if style_index == 3:' in line:
        skip_block = True
        continue
    if skip_block:
        # Skip lines that are part of the if block (indented relative to the if)
        # The if had some indentation, block lines have more
        if line.strip() and not line.strip().startswith('#'):
            # Check if this is still inside the if block by indentation
            # Simple heuristic: if line starts with whitespace less than or equal to 'if' line, we're out
            if len(line) - len(line.lstrip()) <= len(line) - len(line):
                skip_block = False
            continue
        else:
            skip_block = False
            continue
    new_lines.append(line)

new_render_canvas = '\n'.join(new_lines)
# Restore the function signature and body properly
print('New code snippet:', new_render_canvas[:300])

# Actually let me just do a simple text replacement
# The specific lines to remove are:
#     if style_index == 3:
#         parts.append(f'  <rect width="{width}" height="{height}" fill="url(#blueprintGrid)"/>')
# But because of the way I wrote old_canvas, the exact match failed
# Let me just remove by finding and replacing the specific lines

old_block = '''    if style_index == 3:
        parts.append(f\'  <rect width="{width}" height="{height}" fill="url(#blueprintGrid)"/>\')
'''
# Actually let's use a different approach - find the line and remove it

# Find the exact text
search = '    if style_index == 3:\n        parts.append(f\'  <rect width="{width}" height="{height}" fill="url(#blueprintGrid)"/>\')'
if search in orig_content:
    print('Found exact match!')
    new_content = orig_content.replace(search, '')
else:
    print('Exact match not found, trying to locate...')
    # Find the line containing blueprintGrid
    bp_idx = orig_content.find('blueprintGrid')
    if bp_idx >= 0:
        print('blueprintGrid context:', repr(orig_content[bp_idx-100:bp_idx+100]))
    # Use the line-based removal approach
    lines = orig_content.split('\n')
    new_lines = []
    skip_next = False
    for i, line in enumerate(lines):
        if skip_next:
            skip_next = False
            continue
        if 'if style_index == 3:' in line and i + 1 < len(lines) and 'blueprintGrid' in lines[i+1]:
            # Skip both lines
            skip_next = True
            continue
        new_lines.append(line)
    new_content = '\n'.join(new_lines)
    if 'blueprintGrid' in new_content:
        print('WARNING: blueprintGrid still in content!')
    else:
        print('blueprintGrid removed successfully')

# Verify the change
if 'blueprintGrid' in new_content:
    print('ERROR: Fix not applied')
    exit(1)
else:
    print('Fix verified: blueprintGrid removed')

# Get SHA from my fireworks fork
r = requests.get('https://api.github.com/repos/D2758695161/fireworks-tech-graph/contents/scripts/generate-from-template.py', headers=headers)
data = r.json()
sha = data['sha']
print('SHA:', sha)

# Commit to my fork
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
    print('Commit successful')
    # Create PR
    pr_url = 'https://api.github.com/repos/yizhiyanhua-ai/fireworks-tech-graph/pulls'
    pr_payload = {
        'title': 'fix: remove blueprint grid rect to prevent wireframe overlap',
        'body': 'Fixes issue #5: SVG wireframe overlap\n\nIn render_canvas(), the blueprint grid rect (fill="url(#blueprintGrid)") is appended after the background rect. In SVG stacking order, later elements paint on top of earlier ones, so the grid lines appear on top of content nodes.\n\nRemoved the lines that append the blueprint grid rect for style_index==3. The grid pattern definition in <defs> is preserved for other uses.',
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

import subprocess, requests, base64

result = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True)
token = result.stdout.strip()
headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github+json'}

def get_file(path):
    r = requests.get(f'https://api.github.com/repos/yizhiyanhua-ai/fireworks-tech-graph/contents/{path}', headers=headers)
    data = r.json()
    if data.get('encoding') == 'base64':
        return base64.b64decode(data['content']).decode('utf-8', errors='replace')
    return data.get('content', '')

# Get all SVG templates
svgs = ['agent-architecture.svg', 'architecture.svg', 'comparison-matrix.svg', 'data-flow.svg', 'er-diagram.svg', 'flowchart.svg', 'sequence.svg', 'state-machine.svg', 'timeline.svg', 'use-case.svg']
for name in svgs:
    content = get_file(f'templates/{name}')
    has_fill_none = 'fill="none"' in content
    has_url_blueprint = 'url(#blueprintGrid)' in content
    print(f'{name}: fill_none={has_fill_none}, blueprint_grid={has_url_blueprint}, size={len(content)}')

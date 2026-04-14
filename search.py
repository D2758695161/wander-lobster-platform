with open('C:/Users/Administrator/.openclaw/workspace/bounty-hunter-kit/gen_template.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find render functions
import re
for keyword in ['def render_', 'svg_parts', 'parts.append', 'join(parts']:
    positions = [m.start() for m in re.finditer(keyword, content)]
    print(f'{keyword}: {len(positions)} occurrences')
    for pos in positions[:5]:
        print(f'  ...{repr(content[max(0,pos-50):pos+200])}...')

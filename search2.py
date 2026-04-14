with open('C:/Users/Administrator/.openclaw/workspace/bounty-hunter-kit/gen_template.py', 'r', encoding='utf-8') as f:
    content = f.read()

import re
for keyword in ['blueprintGrid', 'url(#blueprint', 'render', 'parts.append', 'svg.render']:
    positions = [m.start() for m in re.finditer(keyword, content)]
    print(f'{keyword}: {len(positions)} occurrences')
    for pos in positions[:5]:
        print(f'  line {content[:pos].count(chr(10))+1}: ...{repr(content[max(0,pos-80):pos+200])}...')

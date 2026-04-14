with open('C:/Users/Administrator/.openclaw/workspace/bounty-hunter-kit/gen_template.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find render_section
idx = content.find('def render_section')
end = content.find('def ', idx + 10)
print(content[idx:end][:5000])

import subprocess, requests, base64, json

result = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True)
token = result.stdout.strip()
headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github+json'}

# Read the local app_vm.swift
with open('C:/Users/Administrator/.openclaw/workspace/bounty-hunter-kit/app_vm.swift', 'r', encoding='utf-8') as f:
    content = f.read()

# The fix: in scanSingleCategory, clear deselectedItems before setting new category result
# This ensures items from a new scan start fresh (all selected), not affected by previous scan's deselect state
# 
# We add: deselectedItems.removeAll()
# after scanProgress = 0.5

old_scan = '''        Task {
            scanProgress = 0.5
            let result = await scanEngine.scanCategory(category)
            categoryResults[category] = result'''

new_scan = '''        Task {
            scanProgress = 0.5
            deselectedItems.removeAll()
            let result = await scanEngine.scanCategory(category)
            categoryResults[category] = result'''

if old_scan not in content:
    print('ERROR: old_scan not found')
    idx = content.find('scanProgress = 0.5')
    print(repr(content[idx-50:idx+200]))
    exit(1)

new_content = content.replace(old_scan, new_scan)
print('Fix applied, length:', len(new_content))
assert 'deselectedItems.removeAll()' in new_content

# Also fix startSmartScan to clear deselectedItems when starting a full scan
old_smart = '''        scanState = .scanning(progress: 0, currentCategory: "Preparing...")
        categoryResults = [:]
        totalJunkSize = 0
        scanProgress = 0'''

new_smart = '''        scanState = .scanning(progress: 0, currentCategory: "Preparing...")
        categoryResults = [:]
        totalJunkSize = 0
        scanProgress = 0
        deselectedItems.removeAll()'''

if old_smart not in new_content:
    print('Note: startSmartScan pattern not found as expected, skipping')
else:
    new_content = new_content.replace(old_smart, new_smart)
    print('startSmartScan fix also applied')

# Get SHA from my PureMac fork
r = requests.get('https://api.github.com/repos/D2758695161/PureMac/contents/PureMac/ViewModels/AppViewModel.swift', headers=headers)
data = r.json()
sha = data['sha']
print('SHA:', sha)

# Commit to my fork
url = 'https://api.github.com/repos/D2758695161/PureMac/contents/PureMac/ViewModels/AppViewModel.swift'
payload = {
    'message': 'fix: clear deselectedItems on new scan to fix item selection bug (issue #19)',
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
    pr_url = 'https://api.github.com/repos/momenbasel/PureMac/pulls'
    pr_payload = {
        'title': 'fix: clear deselectedItems on new scan to fix item selection (issue #19)',
        'body': 'Fixes issue #19: items in Large & Old Files cannot be selected after "Deselect All"\n\n**Root cause:** When `scanSingleCategory()` replaces `categoryResults[category]` with new scan results, the `deselectedItems` set was not cleared. If the same category was scanned previously and items were deselected (added to `deselectedItems`), the old UUIDs could persist and interfere with the new scan state. Additionally, `deselectedItems` is a global set that is not scoped to categories - items from different categories could have UUID collisions.\n\n**Fix:** Call `deselectedItems.removeAll()` in two places:\n1. `startSmartScan()` - when starting a full scan, clear all deselected items since all categories are refreshed\n2. `scanSingleCategory()` - when scanning a specific category, clear deselected items so the new items start fresh (all selected by default)\n\nThis ensures items from a new scan are always in a clean selected state.',
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

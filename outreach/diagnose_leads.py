import json

# Load and count
with open('intl-leads.json', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"File size: {len(content)} bytes")

# Check if valid JSON
try:
    data = json.loads(content)
    print(f"JSON type: {type(data).__name__}")
    
    if isinstance(data, dict):
        print(f"Top-level keys: {list(data.keys())}")
        if 'jobs' in data:
            jobs = data['jobs']
            print(f"Jobs in 'jobs' key: {len(jobs)}")
            print("Companies in jobs:")
            for j in jobs:
                status = j.get('status', '?')
                co = j.get('company', '?')
                title = j.get('title', '?')[:50]
                email = j.get('email_sent_to', '')
                print(f"  [{status}] {co}: {title} -> {email}")
        else:
            print("No 'jobs' key found. Checking for nested job arrays...")
            for k, v in data.items():
                if isinstance(v, list) and len(v) > 0 and isinstance(v[0], dict):
                    if 'company' in v[0] or 'title' in v[0]:
                        print(f"  Found list at key '{k}': {len(v)} items")
    elif isinstance(data, list):
        print(f"List length: {len(data)}")
        # Check if it's a list of session objects
        if len(data) > 0:
            first = data[0]
            if isinstance(first, dict):
                print(f"First element keys: {list(first.keys())}")
except json.JSONDecodeError as e:
    print(f"INVALID JSON: {e}")
    # Show end of file
    print("End of file content:")
    print(content[-500:])

import json

# Load existing intl-leads.json
with open('intl-leads.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find the main jobs array (it's the 'jobs' key in the first/only element)
if isinstance(data, list) and len(data) > 0:
    main = data[0]
elif isinstance(data, dict):
    main = data

jobs = main.get('jobs', [])

# New leads to add
new_leads = [
    {
        "title": "Senior Software Engineer - Karpenter",
        "url": "https://remoteok.com/remote-jobs/remote-senior-software-engineer-karpenter-cast-ai-1130741",
        "company": "Cast AI",
        "budget": "Competitive (Series B, $150M+ raised, Vilnius/Miami/NY/Tel Aviv/London/Dallas/Bengaluru)",
        "location": "Probably worldwide (remote-first)",
        "fit_score": 9,
        "skills_match": ["Golang", "Kubernetes", "Karpenter", "Cloud automation", "AWS/GCP", "CI/CD", "GitOps"],
        "keyword_required": "SAVIOR #RMjcuMzguMTYzLjE3",
        "status": "email_sent",
        "email_sent_to": "careers@cast.ai",
        "email_sent_at": "2026-04-03T06:13 CST",
        "notes": "Cast AI embeds autonomous decision-making in Kubernetes. Karpenter autoscaling + Golang. Strong fit. Email sent."
    },
    {
        "title": "Site Reliability Engineer US West",
        "url": "https://remoteok.com/remote-jobs/remote-site-reliability-engineer-us-west-minio-1130893",
        "company": "MinIO",
        "budget": "Competitive (Fortune 500 backing, remote-first)",
        "location": "US West (remote)",
        "fit_score": 8,
        "skills_match": ["Go/Golang", "SRE", "Distributed systems", "Object storage", "Kubernetes", "Performance benchmarking", "DevOps automation"],
        "keyword_required": "LIGHTER #RMjcuMzguMTYzLjE3",
        "status": "not_applied",
        "notes": "MinIO is leader in high-performance object storage. SRE focusing on optimizing core storage software. Workable URL bounced. Could try min.io/contact. Email not sent - no direct apply link."
    },
    {
        "title": "Software Engineer III Golang/Elixir",
        "url": "https://remoteok.com/remote-jobs/remote-engenharia-software-engineer-iii-golang-elixir-stone-1130912",
        "company": "Stone (Brazil payments)",
        "budget": "Competitive (Brazil payments giant, Stone Co)",
        "location": "Remote Brazil (UTC-3, limited overlap with Asia)",
        "fit_score": 7,
        "skills_match": ["Golang", "Elixir", "Backend", "Payments", "Distributed systems"],
        "status": "not_applied",
        "notes": "Stone Tech - Golang/Elixir backend for payments. Brazil timezone challenge. Not emailed due to timezone overlap."
    }
]

# Add new leads to jobs array
for lead in new_leads:
    jobs.append(lead)

# Also update proactive_cold_outreach
if 'proactive_cold_outreach' not in main:
    main['proactive_cold_outreach'] = []

main['proactive_cold_outreach'].append({
    "to": "hello@inngest.com",
    "subject": "Python SDK & Agentic Workflows — Proactive Cold Outreach | Yitong",
    "timestamp": "2026-04-03T06:13 CST",
    "notes": "Inngest - AI agentic workflows platform. Python SDK. Series A (a16z). Open source core. Fit:9. Proactive outreach despite no posted job."
})

# Save
with open('intl-leads.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Added {len(new_leads)} leads to intl-leads.json")
print(f"Proactive outreach entries: {len(main.get('proactive_cold_outreach', []))}")
print(f"Total jobs in file: {len(jobs)}")

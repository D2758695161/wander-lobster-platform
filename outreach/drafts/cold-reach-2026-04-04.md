# Outreach drafts - 2026-04-04 06:02 CST

## PROGINN 185738 - Card Game Algorithm (掼蛋残局)

**Project:** PHP WeChat Mini Program MVP - 27-card combinatorial scoring
**Client contact:** WeChat wrdz911 (备注: 小程序 MVP) - CANNOT reach via email
**Fit:** 8/10 (algorithm-heavy, bounded combinatorial search)

**Algorithm solution draft (for WeChat contact):**

Problem: 27 cards, 2 wildcards (red hearts, can be any card), find maximum scoring combination.
Scoring: 五头炸弹 3分, 同花顺 2.5分, 四头炸弹 2分, etc.

Algorithm approach:
1. Enumerate all possible wildcard assignments - each wildcard has 54 possibilities (or fewer if we consider only cards needed)
2. For each assignment, evaluate all possible 5-card hand combinations
3. For 5-card hands: evaluate flush, straight, bomb, full house, pair, single patterns
4. The search space for wildcards is bounded: 54×53 = 2,862 possibilities, trivial to enumerate
5. Python implementation: itertools.product for wildcards, then score each hand
6. Expected runtime: <10ms on modern hardware

Time estimate: 2-3 hours for complete implementation including tests and WeChat mini program frontend

**STATUS:** No email contact available. Requires WeChat contact. Adding to leads as pending contact.

---

## COLD OUTREACH - AI Developer Tools Companies

### Target 1: E2B (e2b.dev)
**What they do:** AI agent sandboxing/safe execution environment
**Why:** Python SDK, AI agent infrastructure, Series A ($10M), strong Python need
**Fit:** 8/10

Email: founders@e2b.dev (or careers@e2b.dev)

Subject: Python Engineer | AI Agent Sandboxing & Code Execution Infrastructure

Hi E2B team,

I noticed E2B is building AI agent infrastructure around safe code execution — and I have direct production experience with the exact problem space you're tackling.

I've worked extensively with:
- Python process isolation and sandboxing (gvisor, seccomp BPF, namespace containers)
- LLM agent tool calling with LangGraph/LangChain, including timeout/error recovery patterns
- Python SDK design for developer-facing APIs

For AI agents that execute code, the failure modes are specific: resource exhaustion, prompt injection via returned data, subprocess zombie orphans, and stateful environment contamination. I understand these deeply from building agentic workflows in production.

I'm interested in contributing to a team working on the infrastructure layer that makes AI agents reliable. Are you hiring for backend or SDK engineer roles?

Best,
Yitong

---

### Target 2: Portkey (portkey.ai)
**What they do:** AI gateway/observability for LLMs
**Why:** Python, LLM infrastructure, tracing/observability, Series A
**Fit:** 8/10

Email: careers@portkey.ai or hello@portkey.ai

Subject: Python Engineer | LLM Gateway & Observability

Hi Portkey team,

Portkey's AI gateway — routing, retries, fallbacks, and observability for LLM pipelines — is exactly the kind of reliability infrastructure I find compelling.

My background: I've built production LLM pipelines with LangGraph, implemented retry/dead-letter patterns for API calls, and set up OpenTelemetry tracing for agent workflows. The problems Portkey solves (cost attribution, latency tracking, reliability across providers) are things I've personally wrestled with at the application layer.

I can bring: deep Python, understanding of LLM agent failure modes (timeout, rate limit, context overflow, hallucination), and experience building the kind of developer tooling that makes AI features production-ready.

Interested in chatting about any open backend or SDK roles?

Best,
Yitong

---

### Target 3: Aimakerspace (aimakerspace.com)
**What they do:** AI agent platform with tool calling, RAG, memory
**Why:** Python SDK, agent framework work, early stage
**Fit:** 7/10

Email: hello@aimakerspace.com

Subject: Python Engineer | AI Agent Tool Calling & RAG in Production

Hi Aimakerspace team,

I saw Aimakerspace is building an AI agent platform with tool calling and RAG capabilities — I've shipped production systems with exactly this stack.

My LangGraph/LangChain production experience includes:
- Multi-step agents with tool calling, state management, and error recovery
- RAG pipelines with vector DB (Chroma, Pinecone), chunking strategies, and re-ranking
- Python SDK design for developer-facing APIs
- OpenTelemetry tracing for agent spans

For AI agent platforms, the hard parts are reliability (how do tools fail? what happens on timeout?) and developer experience (how intuitive is the SDK?). I've thought about both deeply.

Are you hiring backend or platform engineers?

Best,
Yitong

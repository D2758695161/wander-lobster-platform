# Bounty Tracker — 2026-04-14

## Active PRs

| # | Repo | Issue | Fix | Value | Status | Link |
|---|------|-------|-----|-------|--------|------|
| 1 | momenbasel/PureMac | #19 Large&Old Files无法选中 | `deselectedItems.removeAll()` in `scanSingleCategory()` and `startSmartScan()` | 0-comment | PR #22 OPEN | https://github.com/momenbasel/PureMac/pull/22 |
| 2 | nashsu/llm_wiki | #15 MD文件内容为空 | Added `case "markdown":` in FilePreview switch → `TextPreview` | 0-comment | PR #19 OPEN | https://github.com/nashsu/llm_wiki/pull/19 |
| 3 | yizhiyanhua-ai/fireworks-tech-graph | #5 线框重叠 | Removed blueprint grid rect from `render_canvas()` — was painted on top of content | 1-comment | PR #9 OPEN | https://github.com/yizhiyanhua-ai/fireworks-tech-graph/pull/9 |

## Today's Actions
- [x] Fix fireworks-tech-graph #5: remove `parts.append(f'...fill="url(#blueprintGrid)"')` from `render_canvas()` in `scripts/generate-from-template.py` → PR #9
- [x] Fix llm_wiki #15: Added `case "markdown": return <TextPreview ...>` in `src/components/editor/file-preview.tsx` → PR #19
- [x] Fix PureMac #19: `deselectedItems.removeAll()` in `startSmartScan()` and `scanSingleCategory()` in `PureMac/ViewModels/AppViewModel.swift` → PR #22

## Bounty Scan Log (2026-04-14)
- fireworks-tech-graph #5 (线框重叠) → PR #9 ✅ (upstream: yizhiyanhua-ai/fireworks-tech-graph)
- llm_wiki #15 (MD文件为空) → PR #19 ✅ (upstream: nashsu/llm_wiki)
- PureMac #19 (Large&Old Files无法选中) → PR #22 ✅ (upstream: momenbasel/PureMac)

## Notes
- All 3 repos forked to D2758695161 first, then PRs created against upstream repos
- fireworks-tech-graph fix: `scripts/generate-from-template.py`, `render_canvas()` function, removed blueprint grid rect (style_index==3). The grid rect was appended AFTER the background rect in SVG, causing it to be painted ON TOP of node content (SVG stacking order)
- llm_wiki fix: `src/components/editor/file-preview.tsx`, `FilePreview` switch. `getFileCategory()` returns `"markdown"` for .md files, but no case existed, falling through to `BinaryPlaceholder`. Added `case "markdown":` → `TextPreview`
- PureMac fix: `PureMac/ViewModels/AppViewModel.swift`. `deselectedItems` was never cleared between scans. When same category rescanned or items from different categories had UUID collisions, stale `deselectedItems` entries caused items to appear unselected. Added `deselectedItems.removeAll()` in `startSmartScan()` and `scanSingleCategory()`
- fireworks-tech-graph and llm_wiki: pushed via GitHub REST API (git push blocked on port 443)

## OLD STALE PRs (superseded)
- fireworks PR #1 (D2758695161 fork) — superseded by PR #9
- llm_wiki PR #1 (D2758695161 fork) — superseded by PR #19
- PureMac PR #21 — superseded by PR #22

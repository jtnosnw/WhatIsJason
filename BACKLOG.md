# WhatIsJason — Backlog

Tracked ideas and deferred work. Items are grouped by area; within each section higher priority items come first. Ratings are out of 5.

---

## Unbuilt spec features (SPEC §4 and §6)

These are committed v1 features from the spec that have not been built yet.

---

### Mind map (SPEC §4.3)
**Priority: 4/5** — A core differentiator. The spec calls it a primary navigation surface alongside search.
**Complexity: 5/5** — The most technically involved feature on the site. Requires a graph layout library (e.g. D3-force or Cytoscape), a three-level expansion model (clusters → entries → neighbours), a persistent edge-style legend, an in-map search box, a side panel, mobile pinch/tap support, and reduced-motion handling. Build against real data density (75+ entries) as the spec requires.

Spec requirements:
- Default: ~10 domain cluster nodes only
- Click cluster → expands to entries, siblings collapse
- Click entry → immediate typed neighbours appear, side panel shows summary, adoption badge, video link, full-entry link
- Breadcrumb trail back to top level
- Node colour = domain; node size = adoption tier; edge style = relationship type; persistent legend
- In-map search: jump camera to node, expand its cluster, highlight it
- Mobile: pinch-zoom, tap to expand, panel slides up

---

### Comparison pages (SPEC §4.4)
**Priority: 3/5** — High SEO value (people search "RAG vs fine-tuning"). Blocked only by build time.
**Complexity: 3/5** — Needs a new route (`/compare/:a-vs-:b`), a page component, a comparison index page, and the "Compare with…" control on entry pages. Data is already in the graph (all `alternative-to` edges). The trickiest part is the ad-hoc comparison picker for entries without an explicit `alternative-to` edge.

Spec requirements:
- Route: `/compare/rag-vs-fine-tuning` (real, shareable URL)
- Content: what each is, when to choose it, trade-offs, key differences
- "Compare with…" control on every entry page, offering `alternative-to` neighbours + an open picker
- Browsable comparison index page

---

### "Compare with…" control on entry page (SPEC §4.1)
**Priority: 3/5** — Listed as a required element of the entry page in §4.1, and the entry point to comparisons.
**Complexity: 2/5** — Straightforward once the comparison page route exists. Renders a dropdown/button on entries that have `alternative-to` neighbours.
*Blocked by: comparison pages above.*

---

### Recently added and updated feed (SPEC §4.8)
**Priority: 3/5** — The spec identifies this as the returning-user landing point. Currently there is no way to see what's new.
**Complexity: 2/5** — Sort entries by `added` date descending; add a date-range filter. Could live as a tab or filter on BrowsePage, or as a dedicated section. The data (`added` field) is already on every entry.

---

### "What's hot" view — emerging + rising entries (SPEC §3.3)
**Priority: 2/5** — Useful discovery surface, especially for the "is this worth my time?" question the spec addresses.
**Complexity: 1/5** — Filter `entries` where `adoption === 'emerging' && trend === 'rising'`. Could be a BrowsePage filter preset or a pinned section at the top of Browse. All data is already present.

---

## Content gaps

### 5 more entries to reach 80 (SPEC §3.5)
**Priority: 4/5** — The spec sets 80 as the v1 launch target and explicitly says to do this before building the mind map. Currently at 75.
**Complexity: 2/5** — Each entry takes time to write accurately but no code changes required. The spec's suggested distribution points to what's still missing (see below).

Suggested distribution audit (current vs target):
| Cluster | Target | Approx. current | Gap |
|---|---|---|---|
| Foundational concepts | ~30 | ~22 | ~8 — but relationships are sparse; adding more here first would generate more quiz questions |
| Established systems/workflows | ~25 | ~22 | ~3 |
| Local-LLM practical terms | ~15 | ~14 | ~1 (GGUF, VRAM requirements missing) |
| Emerging/trending | ~10 | ~7 | ~3 (System 1/2 reasoning; current agent frameworks) |

---

### Learning path content (SPEC §4.5)
**Priority: 4/5** — The PathsPage currently shows "No learning paths have been published yet." The UI is fully built; there is just no YAML in `content/paths/`.
**Complexity: 2/5** — Pure content authoring. The spec suggests four paths to start. Each needs entries to already exist as steps, and the build validates prerequisites appear before the steps that need them.

Suggested v1 paths (from spec):
- *AI fundamentals* — for someone starting from zero
- *Running an LLM locally* — temperature, top-p, KV cache, quantisation, context window, GGUF
- *How ChatGPT actually works* — end-to-end on one system
- *AI for decision-makers* — vocabulary without the maths

---

### Hand-written quiz questions (SPEC §4.6)
**Priority: 3/5** — The spec says "hand-written questions carry the core" — they cover nuance and definitions that generated questions can't. Currently 0 hand-written questions; all 38 are generated from relationship edges.
**Complexity: 2/5** — Write YAML to `content/quizzes/questions.yaml`. Questions of `kind: definition` or `kind: application` for the most important entries. The build validates format and entry references.

---

### Populate quiz questions for `performance` and `agents` domains
**Priority: 3/5** — Both domains show as selectable in the quiz UI (disabled) but have 0 questions. `agents` is one of the most-searched AI topics.
**Complexity: 2/5 (Option A) / 1/5 (Option B)**

- **Option A** — Write hand-written questions in `content/quizzes/questions.yaml` for entries in these domains. Correct long-term fix; pairs well with the hand-written questions task above.
- **Option B** — Hide categories with 0 questions from the quiz setup UI (one-line filter in `QuizPage.tsx`). Removes the broken disabled state immediately; doesn't fix the content gap.

Recommended: ship Option B now, address Option A as part of the hand-written questions task.

---

## UI / UX improvements

### Returning user dashboard (home page for signed-in users)
**Priority: 4/5** — A signed-in user currently lands on the same Browse page as everyone else. There's no sense of continuity or progress. A personalised dashboard makes the product feel like it knows you.
**Complexity: 3/5** — The underlying data (quiz attempts, path progress, review queue) is all already in Firestore and loaded via `useProgress()`. The work is entirely in presentation: a new layout branch on the home route when a user is signed in with progress data, plus the visual components.

Ideas for what to include:
- **Overall quiz score stat** — aggregate correct/total across all attempts, displayed as a number or percentage with a motivating framing ("You've answered 47 questions correctly")
- **Accuracy over time** — a sparkline or small bar chart showing score trend across the last N attempts, so the user can see improvement
- **Streak or activity indicator** — days active, quizzes taken this week, or similar motivating graphic
- **Review queue callout** — how many items are due, with a direct link to `/review`
- **Path progress cards** — each started path shown as a progress bar with "pick up where you left off"
- **Recently added terms** — a short list of entries added since the user's last visit (use `buildTime` vs. a stored `lastVisit` timestamp)
- **Quick-start quiz button** — one tap to jump into a mixed quiz

Layout approach: replace the `<ReviewCallout />` slot on the home route with a full dashboard section when `progress` is non-null, or as a separate `/dashboard` route that the header links to when signed in.

Note: graphics and motivational design (charts, progress rings, etc.) would benefit from a design pass — see the visual polish item below.

---

### Visual polish and design refresh
**Priority: 3/5** — The site is functional but visually minimal. A design pass would improve first impressions, especially for a site about AI where the aesthetic signals credibility.
**Complexity: 4/5** — Broad scope. Worth breaking into smaller slices rather than tackling all at once. All changes must continue to use design tokens only (CLAUDE.md rule 1) — no hardcoded values.

Areas to consider:
- **Illustrations or iconography** on the home page and empty states (currently very text-heavy)
- **Dashboard graphics** — progress rings, sparklines, or bar charts for quiz stats (pairs with the dashboard item above)
- **Entry card design** — cards are quite plain; small domain-colour accents, adoption indicators, or hover states could add life without violating the "domain is the only colour channel" rule
- **Typography hierarchy** — headings and lead text could be more expressive; consider weight and size contrast
- **Empty/loading states** — path list ("no paths yet") and quiz history ("no attempts yet") are bare `<p>` tags
- **Browse page** — the domain-grouped card grid works but a visual entry point (e.g. a featured term or domain spotlight) would help new users know where to start

Consider running the design tokens and current component structure through Claude.ai's design tooling for layout and aesthetic suggestions while keeping the token system intact.

---

### Quiz end screen: side-pane term preview
**Priority: 4/5** — The results screen is where a user most wants to immediately understand what they got wrong. Navigating away loses the context.
**Complexity: 3/5** — Needs a slide-in panel component, state to track which entry is open, a responsive layout (panel beside on desktop, below on mobile), depth toggle inside the panel, and a "Read full entry" link. No new data needed.

On the results screen, clicking any term under "Your gaps" or "Worth another look" should open a panel showing:
- Entry summary and depth-toggled explanation
- Adoption and trend badges
- "Read full entry" link (opens in same tab, navigating away)

---

### Quiz layout: history panel beside category picker
**Priority: 3/5** — History and the picker are related; side-by-side is more ergonomic.
**Complexity: 1/5** — CSS grid/flex two-column layout on `≥ 64rem` viewports, stacking below on mobile. ~10–15 lines of CSS.

---

### Access-list warning: collapse to header status icon
**Priority: 2/5** — Affects only signed-in users not on the allowlist. Polish item.
**Complexity: 3/5** — Needs a dismissal mechanism (session state), a tooltip component built to tokens spec, and changes to `ContentGate`/`Account` and the header layout.

Currently: persistent banner always visible.
Target: one-time toast on sign-in → dismissed → small status icon next to account name in header → hover/focus reveals tooltip with full message.

---

## Notes
- `public/data/` is gitignored; quiz question counts are from the last local `npm run build:content` run.
- Build order from SPEC §6: content to 80 entries → mind map → (comparisons + recently-added feed). Don't build the mind map against sparse data.

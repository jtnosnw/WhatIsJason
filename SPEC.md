# WhatIsJason — Product Spec

**Version:** 0.1 (pre-build)
**Status:** Draft for review

---

## 1. What this is

A learning and discovery site for AI terminology, technologies, workflows and systems. A user at any knowledge level should be able to arrive, find a term they half-understand, read an explanation pitched at their level, see what it connects to, and test whether it stuck.

**Design principle:** the glossary is the product. Quizzes, the mind map, learning paths and comparisons are all *views onto the same graph*. No feature gets its own parallel content store.

### Success looks like

- A beginner can go from "what is RAG" to understanding how it differs from fine-tuning without leaving the site.
- Someone setting up a local LLM can look up `temperature`, `KV cache` and `quantisation` and get useful answers at both plain and technical depth.
- A returning user can see what's new since their last visit and re-test what they previously got wrong.

### Explicit non-goals for v1

- User-generated content, comments, ratings, or any social features.
- Anything requiring moderation.
- Mobile apps. Responsive web only.
- Multi-author editing workflows.

---

## 2. Architecture

| Concern | Choice | Rationale |
|---|---|---|
| Hosting | GitHub Pages | Free, git-native, sufficient for a static site |
| Content store | Markdown + YAML frontmatter in repo | Version history, reviewable diffs, no read costs |
| Runtime data | JSON index built by CI | Fast load, structured, validated at build time |
| Auth | Firebase Auth, Google SSO, `signInWithPopup` | Dedicated Firebase project `whatisjason-420eb` (Spark plan) |
| User data | Firestore | Quiz attempts, progress, missed-question queue |
| Access model | Allowlist soft gate | See §2.1 |

### 2.1 Access model — stated plainly

Sign-in is a **soft gate**. GitHub Pages serves static files to anyone who requests them, so the built JSON index is technically fetchable without authentication. The gate hides the UI; it does not protect the bytes.

**What the gate covers (v1).** The glossary, search, quizzes and learning paths are open to everyone, signed in or not. Signing in with an allowlisted Google account unlocks saved progress: quiz history, the review queue, path progress and synced preferences. A signed-in account that isn't on the allowlist can use everything, but nothing is saved.

This is accepted and intentional. The glossary content is general AI knowledge, not proprietary. What genuinely needs protecting is **user data** — quiz history and progress — and that is protected properly by Firestore security rules, which are server-enforced.

If content ever needs real protection, hosting must move to Firebase Hosting + Cloud Functions or an edge-middleware host. Do not attempt to solve it client-side.

### 2.2 Firebase notes

- Use `signInWithPopup`, **not** `signInWithRedirect`. Redirect routes through `*.firebaseapp.com`, a third-party origin relative to `*.github.io`; browsers block its storage access and the user returns signed-out.
- Add the Pages domain to Firebase authorised domains.
- The Firebase web API key is public by design. Restrict by HTTP referrer in Google Cloud Console; rely on Firestore rules for access control.
- **Dedicated project.** Firebase project `whatisjason-420eb` is used only by this app. User data lives in its `(default)` Firestore database, initialised with the bare `getFirestore(app)`.
- This repo owns `firebase.json`, `.firebaserc` and `firestore.rules`.

### 2.3 Build pipeline

GitHub Actions on push to `main`:

1. Parse all `content/entries/*.md` → validate against schema.
2. **Fail the build** on: unknown relationship target, duplicate ID or alias, missing required field, quiz question referencing a non-existent entry.
3. **Warn** on: entry with `lastReviewed` older than 6 months, entry with zero relationships, video with `verified` older than 12 months.
4. Emit `glossary.json`, `quiz.json`, `paths.json` and `graph.json` to `public/data/`. Vite copies them to `dist/data/`.
5. Stamp `buildTime` (UTC ISO 8601) into the index.
6. Deploy to Pages.

### 2.4 Routing

Static hosting has no server-side routing. Use a `404.html` fallback that hands control to the client router, so `/term/kv-cache` works as a direct link. Every entry, comparison and path must have a real, shareable URL.

---

## 3. Content model

### 3.1 One entity, many types

Terms, technologies, workflows and systems are a **single entity type** with a `type` field. "RAG" is arguably all four; forcing a choice at the schema level creates unwinnable arguments. `type` drives filtering and a badge icon, not storage. It is not colour-coded; domain is the only colour channel (see DESIGN.md).

### 3.2 Typed relationships

Relationships are **typed edges**, not flat tags. The same edges power three features: mind-map layout, auto-generated related-terms, and generated quiz questions.

| Type | Meaning | Inverse (generated) |
|---|---|---|
| `prerequisite-of` | You should understand A before B | `builds-on` |
| `part-of` | A is a component of B | `has-component` |
| `alternative-to` | A and B solve the same problem differently | symmetric |
| `used-in` | A is applied within B | `uses` |
| `implemented-by` | A is a concrete implementation of B | `implements` |

Author edges in **one direction only**. The build script generates inverses. This prevents the two sides drifting out of sync.

### 3.3 Relevance signalling — revised from the brief

The brief proposed a **percentage** for real-world relevance. I'd advise against it, and the spec uses ordinal tiers instead.

A number like "RAG: 87% relevant" implies a measurement that doesn't exist. There's no underlying data — it would be a judgement call dressed as a metric, and users would reasonably ask where it came from. Worse, false precision on a site whose purpose is teaching people to think clearly about AI is a bad look.

Two honest fields instead:

- **`adoption`** — `foundational` | `established` | `emerging` | `experimental`
- **`trend`** — `rising` | `steady` | `cooling`, with an optional one-line `trendNote`

This conveys the same useful signal ("is this worth my time, is it settled or in flux") without pretending to precision. It's also *maintainable* — you can honestly re-assess four buckets during a review pass; you cannot honestly re-assess eighty percentages.

Displayed as a small badge on the entry and used as a filter. `emerging` + `rising` entries feed a "what's hot" view.

### 3.4 Two explanation depths

Every entry carries a `plain` and a `technical` explanation, toggled by the user with the choice persisted. This is the mechanism that serves all knowledge levels. `temperature` is "how random the output is" and "a scaling factor applied to logits before softmax" — neither alone serves everyone.

`plain` must avoid jargon entirely, or link any jargon it uses.

### 3.5 Launch scope

**80 entries at v1.** Prioritise `foundational` and `established` over `emerging`. Suggested distribution:

- ~30 foundational concepts (tokens, embeddings, transformers, attention, training vs inference, parameters)
- ~25 established systems and workflows (RAG, fine-tuning, agents, MCP, vector databases, prompt engineering)
- ~15 local-LLM practical terms (temperature, top-p, top-k, KV cache, quantisation, context window, GGUF, VRAM requirements)
- ~10 emerging/trending (e.g. System 1 / System 2 reasoning models, current agent frameworks)

Quality over count. Forty well-connected entries beat two hundred thin ones — and the relationship graph is what makes the rest of the site work.

---

## 4. Features

### 4.1 Glossary entry page

- Term, aliases, type badge, domain badges, adoption + trend badges
- Depth toggle (plain / technical)
- Examples
- Industries and workflows where it's used
- Related terms, grouped by relationship type with plain-English labels ("You should know first:", "Alternatives:", "Part of:")
- YouTube thumbnails linking out in a new tab (see §4.7)
- Optional diagram
- `lastReviewed` date, visible
- **"Compare with…"** control (see §4.4)

### 4.2 Search

Primary navigation. Instant, client-side, fuzzy. Searches term names, **aliases**, and explanation text with that weighting.

Aliases are critical: "vector DB" must find *Vector Database*; "LoRA" must find *Low-Rank Adaptation*; "temp" must find *Temperature*.

Keyboard-accessible (`/` to focus, arrows to navigate, Enter to open).

### 4.3 Mind map

Interactive, clustered, clean.

**Scale strategy — decided up front.** At 80 entries, rendering every node at once is a hairball. So:

1. **Default view:** domain clusters only. ~8–10 large nodes.
2. **Click a cluster:** expands to the entries within it, siblings collapse.
3. **Click an entry node:** expands to its immediate typed neighbours regardless of domain, with a side panel showing summary, adoption badge, video link, and a link to the full entry.
4. **Breadcrumb trail** back to the top level. Never let a user get lost.

**Visual encoding:**
- Node **colour** = domain
- Node **size** = adoption tier (foundational largest)
- Edge **style** = relationship type (solid for prerequisite, dashed for alternative-to, etc.), with a persistent legend
- Colour is never the sole carrier of meaning — every colour-coded thing also has a label or shape difference.

**Independent map search.** A search box inside the map. Typing a term jumps the camera to that node, expands its cluster, and highlights it — for users who know the word but not where it sits.

Must be usable on a phone: pinch-zoom, tap to expand, panel slides up rather than sitting beside.

### 4.4 Comparison pages

Generated from `alternative-to` edges. Side-by-side: what each is, when to choose it, trade-offs, and the differences that actually matter.

Each has a real URL (`/compare/rag-vs-fine-tuning`) because this is how people search.

Surfaced two ways: a **"Compare with…"** control on every entry page offering its `alternative-to` neighbours (plus a picker for any other entry, generating an ad-hoc comparison from structured fields), and a browsable comparison index.

### 4.5 Learning paths

Curated ordered sequences threading existing entries into a route. Progress tracked per user, resumable.

Suggested v1 paths:
- *AI fundamentals* — for someone starting from zero
- *Running an LLM locally* — practical, maps to the local-LLM term cluster
- *How ChatGPT actually works* — end-to-end on one system
- *AI for decision-makers* — vocabulary without the maths

Paths are hand-curated, but the build validates that each step's prerequisites appear earlier in the path.

### 4.6 Quizzes

**Hybrid authoring.** Hand-written questions for nuance and definitions; generated questions from relationship edges for coverage. Generated questions are marked internally so quality issues are traceable.

Generated templates:
- "Which of these is a prerequisite for understanding X?"
- "X is an alternative to which of the following?"
- "Which of these is a component of X?"
- "Which domain does X primarily belong to?"

Distractors are sampled from *nearby but wrong* nodes — same domain, wrong relationship — because random distractors are too easy and teach nothing.

**Modes:** random mix across all categories, or a single chosen category.

**Per question:**
- Hover/tap **clue** revealing the linked entry's one-line summary, with a link to the full entry
- **"I don't know"** / **pass** option — a first-class answer, not a wrong one

**Grading distinguishes three outcomes:** correct, incorrect, unknown. Conflating "I guessed wrong" with "I've never heard of this" destroys the signal that makes spaced repetition useful. Score displays as correct/incorrect/skipped, and *skipped* does not count against accuracy — it counts toward a "gaps" list.

**History:** last 5 attempts per category, comparable, showing score trend and time taken.

**Spaced repetition:** incorrect and unknown questions enter a review queue with different intervals (unknown resurfaces sooner — it's a gap, not a slip). A "Review your gaps" entry point on the dashboard.

### 4.7 YouTube handling

**Thumbnails only, no embeds.** Thumbnail images come from the static URL pattern derived from the video ID — no API key, no quota, no tracking scripts, no iframe weight. Click opens YouTube in a new tab.

Every video record stores `title`, `channel` and `verified` date alongside the ID, so a dead video degrades to a readable labelled link rather than a grey box. The build warns on videos unverified for 12+ months.

Prefer reputable explainer channels (IBM Technology, 3Blue1Brown, Computerphile, StatQuest and similar).

### 4.8 Freshness

- Global **"Database last updated"** timestamp in the footer, from CI build time, rendered in the **user's local timezone**.
- Per-entry `lastReviewed`, shown on the entry.
- Entries unreviewed for 6+ months show a quiet "may be out of date" marker. Honest, not alarming.
- **"Recently added and updated"** feed with a date filter. Returning users land here.

**Update workflow** (recurring, roughly monthly): search for terms that have emerged since the last review date → draft entries → review → merge → CI redeploys and restamps.

---

## 5. Design requirements

- Consistent spacing scale. Every element has breathing room; nothing overlaps at any breakpoint.
- Design tokens in a single committed file. **No hardcoded colours anywhere in components.**
- Light and dark themes, respecting system preference.
- WCAG AA contrast minimum. Full keyboard navigation. Visible focus states.
- Diagrams follow the same token system — same palette, same spacing logic, same type ramp as the rest of the site.
- Responsive from 360px up. The mind map and comparison tables are the two things most likely to break; test them first.
- Reduced-motion preference respected, particularly by mind-map animations.

---

## 6. Build order

Vertical slices, each shippable.

1. **Foundation** — repo, tokens, CI pipeline, build script with validation, Firebase auth + allowlist, one hardcoded entry rendering end-to-end.
2. **Glossary core** — schema finalised, 20 entries authored, entry pages, search, depth toggle, related terms.
3. **Scale content** — to 80 entries. Do this *before* the mind map, so the map is built against real density.
4. **Mind map** — clustering, expansion, map search, side panel.
5. **Quizzes** — hand-written first, then generation, then history in Firestore.
6. **Spaced repetition + learning paths** — both depend on 4 and 5.
7. **Comparisons + recently-added feed.**

Do not build the whole UI against three tidy example entries. A real entry with eleven relationships and a long name breaks layouts that looked fine with fake data.

---

## 7. Known risks

| Risk | Mitigation |
|---|---|
| Content staleness | Per-entry review dates, visible markers, scheduled review sessions |
| Mind map becomes a hairball | Clustering decided up front (§4.3), not retrofitted |
| Generated quiz questions read mechanically | Marked internally, hand-written questions carry the core |
| Dead YouTube links | Store title/channel/verified date; build warns; degrade gracefully |
| Design drift across sessions | Tokens file + `CLAUDE.md` + periodic hardcoded-value audit |
| Soft gate mistaken for real security | Documented in §2.1; never store anything sensitive in repo content |

# WhatIsJason

A learning and discovery site for AI terminology. Static React app on GitHub Pages, content in repo files, user data in Firestore.

## Source of truth

- **[SPEC.md](SPEC.md)**: what the product is, architecture, features, build order.
- **[SCHEMA.md](SCHEMA.md)**: content file formats, relationship types, quiz and Firestore shapes, and validation rules.
- **[DESIGN.md](DESIGN.md)**: how to use the design tokens in [src/styles/tokens.css](src/styles/tokens.css).

If code and these documents disagree, the documents win. If a document is wrong, change the document in the same change as the code. Don't let them drift. If something isn't covered, ask; don't invent a convention.

## Commands

- `npm run dev`: builds content, then starts Vite. Re-run `npm run build:content` after editing `content/`.
- `npm run build:content`: validates `content/` (SCHEMA §7) and writes `public/data/*.json`. It fails on errors and lists warnings.
- `npm run build`: content, then type-check, then the Vite production build. CI runs this.
- `npm run lint`

## Non-negotiable rules

1. **Design tokens only.** Every colour, spacing value, font size, radius, shadow and duration comes from a `var(--…)` defined in `src/styles/tokens.css`. Never hardcode a hex, `rgb()`, `px` or `rem` value for colour or spacing in a component, stylesheet or diagram. If a value you need is missing, add a token (and document it in DESIGN.md). Don't inline it.
2. **The glossary lives in repo files, not Firestore.** Entries, quiz questions, paths and taxonomy are Markdown/YAML under `content/`. The build turns them into JSON. The app never reads content from Firestore.
3. **Firestore holds user data only.** That means profile, prefs, quiz attempts, the review queue and path progress, all under `users/{uid}`, plus the read-only `allowlist`. No content, ever. That data lives in the project's `(default)` database. Connect with the bare `getFirestore(app)`.
4. **Use `signInWithPopup`, never `signInWithRedirect`.** Redirect goes through `*.firebaseapp.com`, a third-party origin relative to `*.github.io`. Browsers block its storage and the user comes back signed out (SPEC §2.2).
5. **Every entry needs both a `## Plain` and a `## Technical` explanation.** Neither is optional. `plain` uses no jargon, or links any jargon it uses with `[[entry-id]]`.
6. **Skipped quiz answers are a third outcome, not wrong answers.** Outcomes are `correct`, `incorrect` and `skipped`. Accuracy is `correct / (correct + incorrect)`. Skipped answers go on the "gaps" list and come back for review sooner. Never fold `skipped` into `incorrect` in data, scoring, UI or copy.

## Project decisions

- **Hosting:** GitHub Pages project site at `/WhatIsJason/`. Vite `base` and the router basename both use that path. `404.html` hands deep links to the client router.
- **Deployment:** `.github/workflows/deploy.yml` builds and deploys to Pages on every push to `main`, using the official Actions artifact flow (Pages source: "GitHub Actions"). There's no `gh-pages` branch and no manual `dist/` push. Firebase config reaches the build as repo secrets named `VITE_FIREBASE_*`. Firestore rules are deployed separately with `firebase deploy --only firestore`; CI doesn't deploy them.
- **Generated data:** the content build writes JSON to `public/data/` (gitignored). Vite copies it to `dist/data/`, and the dev server serves it too. Never write into `dist/` directly, because Vite empties it on every build.
- **Diagrams:** SVGs live in `content/diagrams/` and are inlined at build time, so they can use token variables and switch with the theme. Never load one through `<img>`.
- **Type:** system font stacks only. No web fonts.
- **Firebase:** project `whatisjason-420eb` (Spark plan), web app "WhatIsJason". Config comes from `VITE_FIREBASE_*` env vars (see `.env.example`). No Analytics.
- **Dedicated project:** the Firebase project is used only by WhatIsJason. There's no shared Auth, API key or authorised-domain list to coordinate with another app. This repo owns `firebase.json`, `.firebaserc` and `firestore.rules`.
- **Access model:** sign-in is a soft gate that hides the UI; it does not protect the content. In v1 it gates saved progress only. The glossary, search and quizzes never wait on or require sign-in (SPEC §2.1). Never put anything sensitive in `content/` (SPEC §2.1).
- **Domain is the only colour channel.** Entry `type` is shown as an icon on a neutral badge, not a colour. Adoption and trend badges are neutral too.
- **Colour is never the only signal.** Domain colours, quiz outcomes and relationship types always come with a text label, an icon or a shape difference.

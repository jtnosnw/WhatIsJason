---
id: human-evaluation
term: Human Evaluation
aliases:
  - human eval
type: workflow
domains: [evaluation]
adoption: established
trend: steady
summary: Assessing model outputs using human judgment rather than automated scoring against a fixed answer key.
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Some qualities of a good answer, whether it's genuinely helpful, well-written, or appropriately cautious, are hard to capture with a simple right-or-wrong test. Human evaluation fills that gap by having real people read model outputs and judge them directly, often comparing two responses side by side and picking the better one.

This is slower and more expensive than automated benchmarks, but it captures nuances that automated scoring tends to miss, and it's also exactly how RLHF gathers its training signal.

## Technical

Human evaluation typically involves raters scoring or ranking model outputs against criteria like helpfulness, accuracy, tone, or harmlessness, either in absolute terms or via pairwise comparison (which output is better). It's more expensive and slower to scale than automated benchmarks but captures subjective and contextual quality that fixed-answer benchmarks can't, and pairwise preference data from human evaluation is also the raw material used to train reward models in RLHF.

## Examples

- Raters comparing two chatbot responses to decide which is more helpful
- Human preference data used to train a reward model for RLHF
- Qualitative review of a model's tone and clarity, not just factual correctness

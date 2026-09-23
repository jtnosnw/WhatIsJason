---
id: rlhf
term: RLHF
aliases:
  - reinforcement learning from human feedback
type: technique
domains: [training, safety]
adoption: established
trend: steady
summary: Using human preference ratings to further train a model toward more helpful and safe behavior.
relationships:
  - type: used-in
    target: alignment
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

After a model learns language in general, it still doesn't automatically know what kind of response humans actually prefer. RLHF fixes that by having people rank different model responses — "this one is better than that one" — and using those rankings to nudge the model toward the kind of answers people rate highly.

It's one of the main reasons modern chat assistants feel more helpful and less erratic than earlier, purely pretrained models.

## Technical

RLHF trains a reward model on human preference comparisons between model outputs, then uses reinforcement learning (commonly PPO, or increasingly simpler methods like DPO) to optimize the base model's policy against that reward model. This shapes outputs toward helpfulness, harmlessness, and honesty without requiring humans to write exhaustive labeled examples for every scenario.

## Examples

- Human raters comparing two chatbot responses to the same prompt
- The step that makes a "base model" feel like a well-behaved assistant
- DPO (Direct Preference Optimization) as a lighter-weight alternative to classic RLHF

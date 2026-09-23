---
id: temperature
term: Temperature
type: parameter
domains: [inference]
adoption: foundational
trend: steady
summary: A setting that controls how random or predictable a model's word choices are during generation.
relationships:
  - type: used-in
    target: prompt-engineering
  - type: alternative-to
    target: top-p
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Temperature is a dial for creativity versus predictability. Turn it down, and the model plays it safe, usually picking the most likely next word — good for factual, consistent answers. Turn it up, and the model takes more risks, picking less obvious words — good for creative writing, but riskier for accuracy.

There's no universally "correct" setting; it depends on whether you want reliable, focused answers or more varied, exploratory ones.

## Technical

Temperature scales the logits before the softmax function that converts them into a probability distribution over the vocabulary. A temperature near 0 sharpens the distribution toward the highest-probability token (closer to greedy decoding); a temperature above 1 flattens it, increasing the likelihood of sampling lower-probability tokens. It's applied at inference time and doesn't affect the model's underlying weights.

## Examples

- Temperature 0 for a customer support bot that needs consistent answers
- Temperature 0.8 to 1.0 for creative fiction generation
- Combining temperature with top-p for finer control over output variety

---
id: attention-mechanism
term: Attention Mechanism
aliases:
  - self-attention
  - attention
type: technique
domains: [architecture]
adoption: foundational
trend: steady
summary: A technique that lets a model weigh how relevant every other part of the input is when processing each part.
relationships:
  - type: part-of
    target: transformer-architecture
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

When you read the word "it" in a sentence, your brain automatically figures out what "it" refers to by looking back at earlier words. Attention gives a model a similar ability: for every word it's processing, it looks at all the other words and decides how much each one matters right now.

This is a big deal because earlier models mostly processed text in strict order, one word at a time, and struggled to connect ideas that were far apart. Attention lets a model connect any two points in a passage directly.

## Technical

Self-attention computes, for each token, a weighted combination of all other tokens' value vectors, where weights come from a compatibility function (typically scaled dot-product) between query and key vectors. Multi-head attention runs several such computations in parallel with different learned projections, letting the model capture different types of relationships simultaneously. This mechanism is what allows transformers to model long-range dependencies without recurrence.

## Examples

- Resolving that "it" refers to "the trophy" earlier in a sentence
- Multi-head attention layers stacked inside GPT and Claude
- Attention weights sometimes visualized to see what a model is "focusing on"

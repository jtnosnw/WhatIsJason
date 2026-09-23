---
id: top-p
term: Top-p
aliases:
  - nucleus sampling
type: parameter
domains: [inference]
adoption: established
trend: steady
summary: A sampling method that only considers the smallest set of most-likely next words whose probabilities add up to p.
relationships:
  - type: used-in
    target: prompt-engineering
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Instead of choosing purely based on temperature, top-p takes a different approach to controlling randomness: it looks at the most likely next words, keeps adding them up until their combined probability reaches a threshold (say, 90%), and only picks from that shortlist. This avoids the model ever choosing a wildly unlikely, nonsensical word, while still allowing some variety.

It's often used alongside or instead of temperature to keep outputs both varied and sensible.

## Technical

Top-p (nucleus) sampling dynamically selects the smallest subset of the vocabulary whose cumulative probability mass exceeds threshold p, then renormalizes and samples from that subset. Unlike top-k sampling, which uses a fixed number of candidates, top-p adapts the candidate pool size to the shape of the probability distribution at each step, keeping more options open when the model is uncertain and fewer when it's confident.

## Examples

- top_p = 0.9 restricts sampling to the most likely words covering 90% of probability mass
- Used together with temperature in most LLM APIs
- Contrasted with top-k sampling, which uses a fixed candidate count instead of a probability threshold

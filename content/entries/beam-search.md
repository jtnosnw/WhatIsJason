---
id: beam-search
term: Beam Search
type: technique
domains: [inference]
adoption: established
trend: steady
summary: A decoding method that tracks several likely sequences at once instead of committing to just one word at a time.
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Instead of committing to just the single best next word at every step, beam search keeps a handful of the most promising partial sentences alive at once, and only picks the overall best-looking complete sentence at the end. This helps avoid a common problem with greedy decoding, where an early, locally reasonable choice turns out to lead to a worse sentence overall.

It's like exploring a few different promising paths on a hike simultaneously, rather than committing fully to the first path that looks slightly better at the very first fork.

## Technical

Beam search maintains a fixed number of candidate sequences (the "beam width") at each generation step, expanding each by all possible next tokens, scoring the results, and keeping only the top-scoring candidates to continue. This explores more of the possible sequence space than greedy decoding at moderate extra computational cost, generally producing higher-quality output for tasks like translation, though it's less commonly used for open-ended chat generation, where sampling methods tend to produce more natural-feeling text.

## Examples

- Commonly used in machine translation systems to improve output quality
- A beam width of 4-5 candidate sequences being a typical setting
- Less commonly used in conversational chat models, which favor sampling-based decoding instead

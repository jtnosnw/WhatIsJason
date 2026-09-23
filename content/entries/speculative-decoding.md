---
id: speculative-decoding
term: Speculative Decoding
type: technique
domains: [inference, performance]
adoption: emerging
trend: rising
summary: Using a small, fast model to guess several tokens ahead, which a larger model then quickly verifies, speeding up generation.
relationships:
  - type: used-in
    target: inference-process
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Generating text one token at a time with a large model is slow, since each token requires a full pass through a huge network. Speculative decoding speeds this up with a clever trick: a smaller, much faster model guesses a few tokens ahead, and the large model then checks all of those guesses at once, in a single pass, rather than generating each one individually. When the small model's guesses are good, this produces the same output as normal, just noticeably faster.

It's like having a fast assistant draft several sentences ahead, which the expert then quickly approves or corrects all at once, rather than dictating word by word.

## Technical

Speculative decoding uses a small draft model to autoregressively generate a short sequence of candidate tokens, which the larger target model then verifies in a single parallel forward pass, accepting tokens that match what the target model would have generated and rejecting (and correcting) the point of first disagreement. Because verification is cheaper than sequential generation, this can significantly reduce end-to-end latency without changing the target model's output distribution, provided the draft model's guesses are reasonably accurate.

## Examples

- Using a small, fast model to draft tokens that a larger model verifies in parallel
- Reducing response latency without changing the quality of the final generated output
- Draft-model accuracy directly affecting how much speedup speculative decoding provides

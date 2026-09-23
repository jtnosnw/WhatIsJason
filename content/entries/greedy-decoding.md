---
id: greedy-decoding
term: Greedy Decoding
type: technique
domains: [inference]
adoption: established
trend: steady
summary: Generating text by always picking the single most likely next token, with no randomness involved.
relationships:
  - type: alternative-to
    target: beam-search
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

The simplest way for a model to generate text is to just always pick whatever word it thinks is most likely to come next, one word at a time. That's greedy decoding: fast, fully predictable, and deterministic, since the same input always produces the exact same output. The downside is that always taking the single best-looking next step can sometimes lead to a worse overall sentence than considering a few alternatives would have.

It's the decoding equivalent of always taking the most obviously good move in a game, without ever looking a few steps ahead.

## Technical

Greedy decoding selects the token with the highest probability at each generation step, with no sampling or randomness, making output fully deterministic for a given input and model state. It's computationally cheap but can produce locally optimal yet globally suboptimal sequences, and lacks the diversity of sampling-based methods like temperature or top-p sampling, making it most suitable for tasks where consistency matters more than variety.

## Examples

- Used when a task needs fully reproducible, deterministic output
- Contrasted with beam search, which considers multiple candidate sequences at once
- Often used as a baseline to compare against more sophisticated decoding strategies

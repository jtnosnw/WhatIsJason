---
id: kv-cache
term: KV Cache
aliases:
  - key-value cache
  - KV caching
type: technique
domains: [inference, performance]
adoption: established
trend: rising
trendNote: >
  Increasingly discussed as context windows grow and inference cost becomes
  a bigger concern.
summary: >
  Stored intermediate values that let a model generate each new token without
  recomputing the whole conversation.
relationships:
  - type: part-of
    target: transformer-architecture
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

When a model generates a response one word at a time, it would be wasteful to re-read the entire conversation from scratch for every single new word. The KV cache is a shortcut: the model saves the internal calculations it already did for earlier words and reuses them, only doing fresh work for the newest word.

This is a big part of why longer conversations use more memory — the cache has to hold onto information for every word so far.

## Technical

During autoregressive generation, each attention layer computes key (K) and value (V) vectors for every token; the KV cache stores these so they don't need to be recomputed at each generation step, reducing per-token inference cost as the sequence grows. The trade-off is memory: cache size grows linearly with context length, batch size, and model depth, making it a major driver of inference memory and cost, especially for long-context models.

## Examples

- Why long conversations consume increasing amounts of GPU memory during chat
- Techniques like multi-query attention exist partly to shrink KV cache size
- KV cache reuse across a conversation's turns to speed up response generation

---
id: prompt-caching
term: Prompt Caching
type: technique
domains: [inference, performance]
adoption: emerging
trend: rising
summary: Reusing previously computed results for a repeated prompt prefix so later requests skip redundant computation.
relationships:
  - type: implemented-by
    target: kv-cache
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

If your application sends the same long instructions or reference document at the start of every request, it's wasteful to make the model process that same text from scratch every single time. Prompt caching lets a system remember the computation it already did for that repeated portion and reuse it on later requests, so only the new part of the prompt needs fresh processing.

This can make repeated requests noticeably faster and cheaper, especially when a large shared prefix (like a long system prompt or document) is reused across many calls.

## Technical

Prompt caching stores the intermediate key-value states computed for a given prompt prefix, so subsequent requests sharing that same prefix can skip recomputing it and reuse the cached values directly, functionally an application-level extension of the KV cache mechanism across separate requests rather than within one continuous generation. This reduces both latency and compute cost for workloads with large, repeated prompt content, such as long system prompts, reference documents, or few-shot examples reused across many calls.

## Examples

- Caching a long system prompt or reference document reused across many API calls
- Reduced latency and cost on requests that share a large common prompt prefix
- Particularly useful for RAG applications that repeatedly inject the same reference material

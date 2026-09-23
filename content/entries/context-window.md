---
id: context-window
term: Context Window
aliases:
  - context length
type: parameter
domains: [inference]
adoption: foundational
trend: rising
trendNote: >
  Context windows have grown rapidly, from a few thousand tokens to over a
  million in some models.
summary: The maximum amount of text (in tokens) a model can consider at once when generating a response.
relationships:
  - type: prerequisite-of
    target: kv-cache
  - type: used-in
    target: retrieval-augmented-generation
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

A model can only "see" a limited amount of text at a time — its context window. Anything outside that window is effectively invisible to it, including earlier parts of a long conversation if it grows too big. A bigger context window means the model can keep track of more information at once, like a longer conversation or a whole document.

This is why very long chats sometimes cause a model to "forget" something mentioned much earlier — it may have simply scrolled out of the window.

## Technical

The context window is the maximum sequence length (in tokens) a model's architecture and computational budget allow it to process in a single forward pass, encompassing both the input prompt and generated output. Larger context windows increase memory and compute costs, particularly because of the quadratic scaling of standard self-attention with sequence length, which techniques like KV caching and sparse/linear attention aim to mitigate.

## Examples

- A model with a 128K-token context window can process roughly a full-length novel
- Long documents that exceed the context window must be summarized or chunked
- Conversations that exceed the window may lose track of earlier messages

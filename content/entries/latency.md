---
id: latency
term: Latency
type: concept
domains: [performance]
adoption: foundational
trend: steady
summary: The time delay between sending a request to a model and receiving its response.
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Latency is simply how long you wait after asking an AI a question before you start getting an answer. Low latency feels snappy and conversational; high latency feels sluggish, especially in real-time applications like voice assistants.

Different factors affect it: model size, hardware, how long the context window is, and whether the response streams in gradually or arrives all at once.

## Technical

Latency in model inference is typically broken into time-to-first-token (TTFT) and time-per-output-token, both influenced by model size, hardware, batching strategy, KV cache management, and context length. Techniques like speculative decoding, quantization, and optimized serving frameworks aim to reduce latency, especially for interactive applications where response time directly affects user experience.

## Examples

- Streaming responses token-by-token to reduce perceived latency
- Smaller or quantized models generally have lower latency than larger ones
- Voice assistants requiring very low latency for natural conversation

---
id: throughput
term: Throughput
type: concept
domains: [performance]
adoption: foundational
trend: steady
summary: The number of requests or tokens a system can process in a given amount of time.
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

While latency asks "how fast is one answer," throughput asks "how many answers can this system produce overall, at the same time." A service might have decent latency per user but still struggle if a huge number of people ask questions at once — that's a throughput problem.

Companies serving AI models to lots of users have to balance both: keeping individual responses fast (latency) while handling many requests simultaneously (throughput).

## Technical

Throughput measures aggregate processing capacity, often expressed as tokens per second or requests per second across all concurrent users. Serving systems increase throughput via batching (grouping multiple requests to share GPU compute), model parallelism across multiple devices, and hardware acceleration, sometimes trading a small increase in per-request latency for a large gain in overall throughput.

## Examples

- A batched inference server processing many users' requests in parallel
- Providers reporting throughput in tokens per second per GPU
- Trade-offs between low-latency single requests and high-throughput batch processing

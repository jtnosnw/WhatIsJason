---
id: model-serving
term: Model Serving
type: workflow
domains: [tooling, performance]
adoption: established
trend: steady
summary: The infrastructure and software that runs a trained model and handles incoming requests to it in production.
relationships:
  - type: used-in
    target: api
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

A trained model sitting on a hard drive doesn't do anything by itself. Model serving is everything involved in actually making it usable: loading it onto hardware, accepting incoming requests, running inference efficiently, and sending results back, reliably and at scale, often to thousands of users at once.

It's the operational plumbing that sits between "we have a trained model" and "people can actually use it."

## Technical

Model serving systems handle request routing, batching, KV cache management, load balancing across hardware, and often multiple concurrent model versions, optimizing for a balance of latency, throughput, and cost. Dedicated serving frameworks implement techniques like continuous batching and efficient memory management specifically to maximize GPU utilization under real-world, unpredictable request patterns, rather than the more predictable, uniform workloads seen during training.

## Examples

- A hosted API backed by a model-serving system handling thousands of concurrent requests
- Serving frameworks implementing continuous batching to maximize GPU utilization
- Running multiple model versions simultaneously behind the same serving layer

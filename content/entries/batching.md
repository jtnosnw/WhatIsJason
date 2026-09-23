---
id: batching
term: Batching
aliases:
  - batch inference
type: technique
domains: [performance]
adoption: established
trend: steady
summary: Grouping multiple requests together so a model can process them simultaneously, improving overall throughput.
relationships:
  - type: used-in
    target: model-serving
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Running a model for one person at a time, one request after another, wastes a lot of the computer's capacity, since modern hardware is built to do many calculations in parallel. Batching groups several requests together and processes them at the same time, making much better use of that parallel hardware and letting a system serve far more people for the same amount of computing power.

The trade-off is that an individual request might wait briefly for a batch to fill before processing starts, slightly increasing latency for the sake of overall efficiency.

## Technical

Batching groups multiple inference requests to be processed together in a single forward pass, exploiting the parallelism of GPU hardware far more efficiently than processing requests sequentially. Modern serving systems use dynamic or continuous batching, which adds new requests to an in-progress batch as earlier ones finish (rather than waiting for a fixed batch to complete entirely), balancing high throughput with reasonable per-request latency.

## Examples

- Continuous batching in modern serving frameworks improving GPU utilization
- A trade-off between larger batches (higher throughput) and smaller ones (lower latency)
- Why serving many users simultaneously is more efficient per-user than serving one at a time

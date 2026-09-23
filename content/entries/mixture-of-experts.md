---
id: mixture-of-experts
term: Mixture of Experts
aliases:
  - MoE
type: technology
domains: [architecture, performance]
adoption: established
trend: rising
summary: An architecture that routes each input to only a few specialized sub-networks instead of using the whole model every time.
relationships:
  - type: part-of
    target: transformer-architecture
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

A very large model doesn't have to use every single one of its parameters for every single request. Mixture of Experts splits the model into many smaller specialized sub-networks ("experts") and, for each piece of input, only activates a handful of the most relevant ones. This means you get the benefit of a huge total model, without paying the full computational cost on every request.

It's a bit like having a large team of specialists but only calling in the two or three actually relevant to the question at hand, rather than convening everyone every time.

## Technical

In a Mixture-of-Experts layer, a learned routing (gating) function selects a small subset of expert sub-networks (often 1-2 out of dozens) to process each token, rather than passing every token through every parameter. This allows total parameter count, and therefore model capacity, to scale up substantially while keeping the compute cost per token much closer to that of a smaller dense model. The main engineering challenges are load balancing across experts and the added system complexity of routing and distributed serving.

## Examples

- A model with a large total parameter count that only activates a fraction per token
- MoE layers replacing the feed-forward layers within transformer blocks
- Routing decisions determining which "expert" sub-networks handle a given token

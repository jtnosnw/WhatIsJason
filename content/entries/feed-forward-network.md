---
id: feed-forward-network
term: Feed-Forward Network
aliases:
  - FFN
type: technology
domains: [architecture]
adoption: foundational
trend: steady
summary: A simple layer inside a transformer block that processes each token's representation independently after attention.
relationships:
  - type: part-of
    target: transformer-architecture
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Attention handles mixing information between different words in a sentence. The feed-forward network is the other main ingredient inside a transformer block, and it does the opposite job: it processes each word's information on its own, independently, transforming it through a couple of simple layers before passing it along.

Think of attention as the part that lets words "talk to each other," and the feed-forward network as the part where each word then "thinks it over" on its own.

## Technical

A transformer's feed-forward network is typically a two-layer fully connected network with a non-linear activation in between, applied identically and independently to each token's representation after the attention step. Despite its simplicity, the feed-forward network actually holds the majority of a transformer's parameters in most architectures, and is the component that Mixture-of-Experts architectures typically replace with a set of routed expert sub-networks.

## Examples

- The feed-forward layers holding most of a transformer's total parameter count
- Mixture-of-Experts models replacing standard feed-forward layers with routed experts
- Each token processed independently by the feed-forward network after attention mixes information

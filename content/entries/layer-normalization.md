---
id: layer-normalization
term: Layer Normalization
aliases:
  - LayerNorm
type: technique
domains: [architecture, performance]
adoption: established
trend: steady
summary: A technique that rescales values inside a network's layers to keep training stable as models get deeper.
relationships:
  - type: used-in
    target: transformer-architecture
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

As information passes through many stacked layers of a deep network, the numbers involved can grow, shrink, or drift in ways that make training unstable or slow. Layer normalization is a housekeeping step that rescales these numbers back to a consistent, well-behaved range at each layer, the way a sound engineer keeps adjusting levels so nothing gets too loud or too quiet as a mix comes together.

This small technical detail turned out to matter a lot for successfully training very deep networks.

## Technical

Layer normalization normalizes the activations within each layer to have consistent mean and variance across the feature dimension, for each individual example, which helps stabilize gradients and speeds up convergence during training. It's applied at specific points within each transformer block (commonly before or after the attention and feed-forward sub-layers, depending on the exact architecture variant) and is one of several normalization techniques, alongside batch normalization, used in deep learning.

## Examples

- LayerNorm applied before or after attention and feed-forward layers in a transformer block
- Helping very deep transformer stacks train stably without exploding or vanishing values
- "Pre-norm" versus "post-norm" transformer variants referring to where normalization is placed

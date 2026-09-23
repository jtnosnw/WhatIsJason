---
id: residual-connection
term: Residual Connection
aliases:
  - skip connection
type: technique
domains: [architecture]
adoption: foundational
trend: steady
summary: A shortcut that lets information skip past a layer, added to that layer's output, which helps deep networks train.
relationships:
  - type: part-of
    target: transformer-architecture
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

The deeper a network gets, the harder it can be to train, because signals (and the gradients used to update parameters) can weaken or distort as they pass through many layers. A residual connection is a simple fix: it adds a layer's input directly to its output, creating a shortcut path that lets information (and gradients, during training) flow through more easily, even in very deep networks.

It's a small architectural trick that had an outsized effect on making really deep networks actually trainable.

## Technical

A residual connection computes a layer's output as the layer's transformation of the input plus the original input itself, rather than only the transformation. This shortcut path prevents gradients from vanishing as they backpropagate through many stacked layers, since the gradient can flow directly through the addition operation even if a layer's own gradient is small. Residual connections are used throughout transformer blocks, wrapping both the attention and feed-forward sub-layers.

## Examples

- Every transformer block wrapping its attention and feed-forward layers in residual connections
- Originally introduced in ResNet to enable training much deeper image classification networks
- Helping gradients flow through dozens or even hundreds of stacked transformer layers

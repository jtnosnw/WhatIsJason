---
id: activation-function
term: Activation Function
type: concept
domains: [fundamentals, architecture]
adoption: foundational
trend: steady
summary: A mathematical function applied inside a neural network that lets it learn non-linear, more complex patterns.
relationships:
  - type: part-of
    target: neural-network
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Without something extra added in, a neural network's layers would just be doing simple math that, stacked together, could always be simplified into one single simple calculation — not very powerful. An activation function is a small non-linear twist applied at each layer that breaks this limitation, letting the network as a whole learn much more complex, curved, and nuanced patterns than plain straight-line math ever could.

It's a small ingredient that turns a stack of simple operations into something capable of learning genuinely complicated relationships.

## Technical

An activation function introduces non-linearity by transforming a neuron's weighted input sum before passing it to the next layer, which is what allows stacked layers to approximate complex, non-linear functions rather than collapsing into an equivalent single linear transformation. Common choices include ReLU (simple and efficient, widely used in earlier deep networks) and GELU or SwiGLU variants (smoother, commonly used in modern transformer architectures).

## Examples

- ReLU, one of the most widely used activation functions in deep learning
- GELU activations used inside the feed-forward layers of many transformer models
- Choice of activation function affecting both training stability and final performance

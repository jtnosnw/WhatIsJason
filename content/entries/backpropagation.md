---
id: backpropagation
term: Backpropagation
type: technique
domains: [training]
adoption: foundational
trend: steady
summary: The algorithm that efficiently computes how much each parameter contributed to a model's error, layer by layer.
relationships:
  - type: used-in
    target: model-training
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Gradient descent needs to know which direction to nudge each of a model's potentially billions of parameters. Backpropagation is the clever bookkeeping trick that makes this possible efficiently: it works backward from the final error, layer by layer, calculating exactly how much each parameter contributed to that error, so gradient descent knows precisely how to adjust each one.

Without backpropagation, training the huge networks behind modern AI simply wouldn't be computationally feasible.

## Technical

Backpropagation applies the chain rule of calculus to compute the gradient of the loss function with respect to every parameter in a network, propagating error signals backward from the output layer through each preceding layer. This gives an efficient way to compute all gradients in roughly the same time as a single forward pass, rather than requiring a separate, expensive calculation for each individual parameter. It's the computational backbone that makes gradient descent practical for networks with billions of parameters.

## Examples

- The core algorithm running under the hood of virtually every deep learning framework
- Why training deep networks became computationally practical starting in the 1980s-90s
- Automatic differentiation libraries (like in PyTorch) implementing backpropagation automatically

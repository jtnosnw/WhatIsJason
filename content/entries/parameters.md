---
id: parameters
term: Parameters
aliases:
  - weights
  - model weights
type: parameter
domains: [fundamentals, training]
adoption: foundational
trend: steady
summary: The internal numbers a model adjusts during training to capture patterns in data.
relationships:
  - type: used-in
    target: quantization
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

If a model is a machine, parameters are all the dials on it — potentially billions of them. Training is the slow process of turning each dial to just the right position so the whole machine produces good outputs. Nobody sets these by hand; they're adjusted automatically based on how wrong the model's guesses are.

"Parameter count" (like "70 billion parameters") is often used as a rough proxy for how much a model can potentially learn and store, though it's not the whole story — how the parameters are arranged matters too.

## Technical

Parameters are the learnable weights and biases within a model's layers, typically stored as floating-point tensors. During training, gradient descent updates each parameter in the direction that reduces the loss function, scaled by the learning rate. Parameter count correlates with model capacity but interacts with architecture, training data quality, and training compute to determine actual capability.

## Examples

- A 7B model has roughly 7 billion parameters
- Fine-tuning updates some or all existing parameters rather than starting fresh
- Quantization reduces the precision (not the count) of parameters to save memory

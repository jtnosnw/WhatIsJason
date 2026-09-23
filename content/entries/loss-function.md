---
id: loss-function
term: Loss Function
aliases:
  - cost function
  - objective function
type: concept
domains: [fundamentals, training]
adoption: foundational
trend: steady
summary: A formula that measures how wrong a model's predictions are, giving training something concrete to minimize.
relationships:
  - type: prerequisite-of
    target: gradient-descent
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

For a model to improve, it needs a way to measure how badly it's currently doing. The loss function is that measuring stick: it compares the model's prediction to the correct answer and outputs a single number representing how wrong the guess was. Training is essentially the process of trying to make this number as small as possible.

Different tasks need different loss functions, the same way different sports need different scoring systems, but the basic idea is always "how far off was this guess?"

## Technical

A loss function maps a model's prediction and the true target to a scalar value quantifying prediction error, which the training process minimizes via optimization. Common choices include cross-entropy loss for classification and next-token prediction, and mean squared error for regression tasks. The choice of loss function shapes what the model actually learns to prioritize, since gradient descent will push parameters specifically toward reducing whatever the loss function measures.

## Examples

- Cross-entropy loss used to train language models on next-token prediction
- Mean squared error used when predicting a continuous number, like a price
- A training run's "loss curve" showing this value decreasing over time

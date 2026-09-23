---
id: learning-rate
term: Learning Rate
type: parameter
domains: [training]
adoption: foundational
trend: steady
summary: A setting that controls how big a step a model's parameters take with each update during training.
relationships:
  - type: used-in
    target: gradient-descent
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

When training nudges a model's parameters toward better values, the learning rate controls how big each nudge is. Set it too high, and the model can overshoot the best values and never settle down. Set it too low, and training crawls along so slowly it might take forever, or get stuck in a mediocre spot.

Finding a good learning rate is one of the most important, and most fiddled-with, decisions in training any model.

## Technical

The learning rate scales the parameter update computed by gradient descent at each training step. It's often varied over the course of training via a schedule — commonly starting small (a "warmup" period), rising, and then gradually decaying — to balance stable early training with efficient convergence. Adaptive optimizers like Adam adjust effective per-parameter learning rates automatically, but a base learning rate value still needs to be chosen and tuned.

## Examples

- A learning rate warmup period at the start of training to avoid early instability
- Learning rate decay schedules that shrink the step size as training progresses
- Training diverging (loss increasing instead of decreasing) due to too high a learning rate

---
id: gradient-descent
term: Gradient Descent
type: technique
domains: [fundamentals, training]
adoption: foundational
trend: steady
summary: An optimization method that repeatedly nudges a model's parameters in the direction that reduces its loss.
relationships:
  - type: prerequisite-of
    target: backpropagation
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Imagine standing on a hillside in thick fog, trying to reach the lowest point. You can't see the whole landscape, but you can feel which direction slopes downward from where you're standing, so you take a small step that way, then check again, and repeat. Gradient descent trains a model the same way: it repeatedly checks which direction would reduce the loss and nudges the parameters a small step in that direction.

Do this enough times, in small enough steps, and the model gradually settles into a much better set of parameters than it started with.

## Technical

Gradient descent updates parameters in the direction of the negative gradient of the loss function with respect to those parameters, scaled by a learning rate. In practice, deep learning uses stochastic gradient descent (computing gradients on small random batches rather than the full dataset) or adaptive variants like Adam, which adjust the effective step size per parameter based on past gradients. Step size, batch size, and the shape of the loss landscape all affect whether training converges smoothly or gets stuck.

## Examples

- Adam optimizer, a popular adaptive variant used to train most modern large models
- Learning rate schedules that shrink step size as training progresses
- Loss decreasing steadily across training steps as gradient descent finds better parameters

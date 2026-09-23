---
id: model-training
term: Training
aliases:
  - model training
type: workflow
domains: [training]
adoption: foundational
trend: steady
summary: The process of exposing a model to data and adjusting its parameters until it performs well.
relationships:
  - type: prerequisite-of
    target: pretraining
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Training is how a model goes from knowing nothing to being useful. You show it example after example — millions or billions of them — and after each one, you nudge its internal settings slightly so it gets a bit closer to the right answer. Do this enough times, on enough data, and a useful pattern-recognizer emerges.

It's less like traditional programming and more like practice: repetition, feedback, and gradual improvement, done automatically by the computer instead of a person.

## Technical

Training minimizes a loss function over a dataset via iterative optimization, typically stochastic gradient descent or a variant like Adam. Each pass computes a forward pass (prediction), measures error against ground truth, and backpropagates gradients to update parameters. Training is divided into epochs and batches, and choices like learning rate, batch size, and regularization critically affect whether the model converges well or overfits.

## Examples

- Training an image classifier on millions of labeled photos
- Pretraining a language model on a large text corpus
- Continuing to train (fine-tuning) an existing model on a smaller, specific dataset

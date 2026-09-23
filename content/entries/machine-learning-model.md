---
id: machine-learning-model
term: Model
aliases:
  - ML model
  - machine learning model
type: concept
domains: [fundamentals]
adoption: foundational
trend: steady
summary: The trained artifact that maps inputs to outputs after learning patterns from data.
relationships:
  - type: prerequisite-of
    target: model-training
  - type: prerequisite-of
    target: parameters
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

A "model" is just the end result of teaching a computer to notice patterns. Feed it thousands of emails labeled "spam" or "not spam," and it learns a model — a set of internal rules — that can then guess about brand-new emails it's never seen.

When people say "the model," they usually mean this trained thing: not the training process itself, and not the raw data, but the finished system you can actually use to make predictions or generate text.

## Technical

A model is a parameterized function f(x; θ) that maps inputs to outputs, where θ (the parameters) are learned from training data by minimizing a loss function. The model's architecture defines the function's structure; training determines the specific parameter values. A model can be saved, shared, and run for inference independently of the training process that produced it.

## Examples

- A spam classifier that outputs "spam" or "not spam"
- GPT-4 or Claude as a specific trained language model
- A recommendation model predicting which movie you'll like next

---
id: overfitting
term: Overfitting
type: concept
domains: [training, evaluation]
adoption: foundational
trend: steady
summary: When a model learns the training data too closely, including its noise, and performs worse on new, unseen data.
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

A model can get so good at its specific training examples that it basically memorizes them instead of learning the general pattern behind them. That's overfitting — like a student who memorizes the exact practice questions instead of understanding the underlying concept, and then struggles the moment the real exam asks something slightly different.

The tell-tale sign is a model that performs great on data it's seen before but noticeably worse on new data it hasn't.

## Technical

Overfitting occurs when a model's capacity is high relative to the training data's size or diversity, causing it to fit noise and idiosyncrasies in the training set rather than the underlying generalizable pattern, resulting in a gap between training performance and validation or test performance. Common mitigations include regularization, dropout, early stopping, gathering more diverse training data, and holding out a separate validation set to monitor generalization during training.

## Examples

- A model scoring near-perfectly on training data but poorly on a held-out test set
- Using a validation set specifically to detect overfitting during training
- Regularization techniques added to discourage a model from memorizing training examples

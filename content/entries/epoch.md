---
id: epoch
term: Epoch
type: concept
domains: [training]
adoption: established
trend: steady
summary: One complete pass through the entire training dataset during model training.
relationships:
  - type: part-of
    target: model-training
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

If you're studying flashcards, one epoch is like going through the entire deck once, start to finish, before shuffling and going through it again. In model training, an epoch means the model has seen every single example in the training dataset exactly once. Training usually runs for many epochs, giving the model repeated exposure to the same data.

For very large datasets used in modern language model pretraining, models sometimes see the data less than once, making "epoch" a less central concept there than in smaller-scale training.

## Technical

An epoch is one full iteration over the training dataset, typically composed of many smaller batches, with parameters updated after each batch (or occasionally after the full epoch). The number of epochs is a key hyperparameter: too few and the model may underfit, too many and it risks overfitting to the training data. Large-scale pretraining on massive web-scale corpora often uses less than one full epoch, since the dataset is so large that a single partial pass already provides enormous exposure.

## Examples

- Fine-tuning a model for 3 epochs over a specific dataset
- Tracking validation loss after each epoch to decide when to stop training
- Large pretraining runs sometimes not even completing a full epoch over their massive datasets

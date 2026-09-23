---
id: data-augmentation
term: Data Augmentation
type: technique
domains: [data]
adoption: established
trend: steady
summary: Automatically creating variations of existing training examples to expand a dataset without collecting new raw data.
relationships:
  - type: used-in
    target: model-training
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Instead of gathering brand-new examples, data augmentation squeezes more value out of the data you already have by creating slightly altered versions of it — rotating an image, rephrasing a sentence, adding background noise to audio. This gives a model more variety to learn from and helps it generalize better, without the cost of collecting entirely new data.

Think of it as practicing the same skill from a few different angles instead of only ever practicing it one exact way.

## Technical

Data augmentation applies label-preserving transformations to existing examples to expand effective dataset size and diversity, reducing overfitting and improving generalization. Techniques are domain-specific: image augmentation includes rotation, cropping, and color jitter; text augmentation includes paraphrasing, back-translation, and synonym substitution; audio augmentation includes noise injection and pitch shifting. It's often used alongside, not instead of, collecting more real data.

## Examples

- Rotating and cropping training images to make an image classifier more robust
- Paraphrasing sentences to expand a text classification dataset
- Adding background noise to audio clips to improve a speech recognition model

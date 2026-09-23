---
id: dataset
term: Dataset
type: concept
domains: [data]
adoption: foundational
trend: steady
summary: The collection of examples a model learns from during training.
relationships:
  - type: prerequisite-of
    target: model-training
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

A dataset is simply the pile of examples a model learns from — millions of sentences, images, or conversations, depending on what the model is meant to do. The quality, size, and diversity of this data has a huge effect on what the resulting model can and can't do well.

There's a saying in the field: "garbage in, garbage out." A model trained on biased, low-quality, or narrow data will reflect those limitations, no matter how clever its architecture is.

## Technical

A dataset is a structured or unstructured collection of examples used for training, validation, or evaluation, typically split into disjoint training/validation/test sets to measure generalization. Dataset composition (size, diversity, quality, labeling accuracy, and potential biases) directly shapes model behavior, and data curation, deduplication, and filtering have become significant engineering challenges at large scale.

## Examples

- Common Crawl web text used in pretraining large language models
- ImageNet as a foundational dataset for computer vision research
- A company's internal support tickets used as a fine-tuning dataset

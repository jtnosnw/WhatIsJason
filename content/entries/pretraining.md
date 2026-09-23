---
id: pretraining
term: Pretraining
type: technique
domains: [training]
adoption: established
trend: steady
summary: Training a model from scratch on a large, general dataset before any task-specific adjustment.
relationships:
  - type: prerequisite-of
    target: fine-tuning
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Pretraining is the big, expensive first step in creating a modern AI model. Instead of teaching it one narrow skill, you expose it to a huge, broad slice of the world — books, websites, code — so it picks up general patterns in language, reasoning, and knowledge before anyone tries to specialize it.

Think of it like a general education before a career: pretraining builds broad competence, and later steps (fine-tuning) sharpen that into something more specific and useful.

## Technical

Pretraining optimizes a model, usually with a self-supervised objective (like next-token prediction for language models), over a massive, diverse corpus, without task-specific labels. This produces a base model with general-purpose representations that later stages (fine-tuning, RLHF) build on. Pretraining is by far the most compute- and data-intensive stage of building a large model.

## Examples

- GPT and Claude base models are pretrained on large text corpora before further tuning
- Pretraining an image model on millions of unlabeled photos to learn general visual features
- The "foundation model" concept refers specifically to a pretrained base model

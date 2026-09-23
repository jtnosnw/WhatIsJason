---
id: foundation-model
term: Foundation Model
type: concept
domains: [fundamentals]
adoption: established
trend: steady
summary: A large, broadly capable model, usually pretrained on massive data, that serves as the base for many downstream uses.
relationships:
  - type: used-in
    target: fine-tuning
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Rather than building a new model from scratch for every single task, most modern AI is built on top of a foundation model: one large, general-purpose model trained once on a huge amount of data, which can then be adapted — through fine-tuning, prompting, or RAG — for many different specific purposes.

It's called a "foundation" because so much gets built on top of it, the way a building's foundation supports many different rooms and floors above it.

## Technical

A foundation model is produced by large-scale pretraining and exhibits broad, general-purpose capabilities that transfer to many downstream tasks with relatively little task-specific adaptation. The term emphasizes both the model's role as a shared base for many applications and the risks that come with that concentration — flaws or biases in a foundation model can propagate into everything built on top of it.

## Examples

- GPT, Claude, and LLaMA are all examples of foundation models
- A single foundation model fine-tuned separately for coding, writing, and customer support use cases
- Companies building products "on top of" a foundation model via API rather than training their own

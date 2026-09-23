---
id: model-card
term: Model Card
type: workflow
domains: [tooling, evaluation]
adoption: established
trend: steady
summary: A standardized document describing a model's intended uses, limitations, training data, and evaluation results.
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Before using a model for something important, it helps to know what it's actually good at, what it struggles with, and what data it was trained on. A model card is a standardized summary sheet answering exactly those questions — a bit like a nutrition label, but for an AI model instead of food.

It's meant to help people make informed decisions about whether a model is appropriate for their specific use case, rather than finding out its limitations the hard way.

## Technical

A model card documents a model's architecture, intended use cases, out-of-scope uses, training data sources and composition, evaluation results across relevant benchmarks, known limitations, and potential biases or risks. The practice was proposed to standardize model documentation and improve transparency and accountability, particularly as models get reused across many downstream applications by people who weren't involved in training them.

## Examples

- A model card listing benchmark scores alongside known failure modes
- Documentation clarifying that a model wasn't evaluated for a particular high-stakes use case
- Comparing model cards from different providers before choosing a model for a project

---
id: hallucination
term: Hallucination
type: concept
domains: [safety]
adoption: foundational
trend: steady
summary: When a model confidently generates information that is false or not grounded in its input or training data.
relationships:
  - type: prerequisite-of
    target: guardrails
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Sometimes a model states something with total confidence that simply isn't true — a fake citation, an invented fact, a made-up event. This is called hallucination, and it happens because the model is fundamentally predicting plausible-sounding text, not looking facts up in a database.

It's one of the most important limitations to understand about current AI systems: fluent, confident-sounding text is not the same thing as accurate text.

## Technical

Hallucination arises because generative models optimize for producing statistically plausible continuations rather than verified truth, and they have no built-in mechanism to distinguish a confidently recalled fact from a confidently generated guess. Mitigations include retrieval-augmented generation (grounding responses in retrieved sources), fine-tuning on accuracy-focused data, output verification or citation requirements, and prompting the model to express uncertainty.

## Examples

- A model inventing a plausible-sounding but fake academic citation
- Confidently stating an incorrect date or statistic
- RAG reducing hallucination by grounding answers in retrieved, real documents

---
id: automated-evaluation
term: Automated Evaluation
aliases:
  - auto-eval
  - LLM-as-judge
type: workflow
domains: [evaluation]
adoption: emerging
trend: rising
trendNote: >
  "LLM-as-judge" approaches, where one model scores another's output, are
  gaining popularity as a faster substitute for human evaluation.
summary: Using scripts or another model to score outputs at scale, instead of relying only on human judgment.
relationships:
  - type: alternative-to
    target: human-evaluation
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Human evaluation is thorough but slow and expensive — you can't have people manually review millions of outputs. Automated evaluation solves that by using code (checking an answer against a known correct value) or even another AI model (asking it to judge which of two responses is better) to score outputs automatically, at a scale no team of humans could match.

The trade-off is that automated judges have their own blind spots and biases, so they work best alongside, not instead of, some human review.

## Technical

Automated evaluation includes rule-based scoring (exact match, unit tests passing, regex checks) for tasks with verifiable answers, and model-based scoring ("LLM-as-judge") for more subjective qualities like helpfulness or tone, where a separate model is prompted to rate or compare outputs. LLM-as-judge approaches are cheaper and faster than human evaluation but can inherit the judge model's own biases and blind spots, so they're often calibrated against a smaller set of human-labeled examples.

## Examples

- Automatically checking whether generated code passes a test suite
- Using a strong model to rate two chatbot responses and pick the better one
- Running the same automated eval suite after every model or prompt change

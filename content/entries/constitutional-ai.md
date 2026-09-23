---
id: constitutional-ai
term: Constitutional AI
type: technique
domains: [safety, training]
adoption: established
trend: steady
summary: Training a model to critique and revise its own outputs against a written set of principles, reducing reliance on human labeling.
relationships:
  - type: alternative-to
    target: rlhf
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Instead of relying only on humans to label thousands of examples of "good" versus "bad" responses, constitutional AI gives a model a written set of principles — a "constitution" — and has the model use those principles to critique and improve its own answers. It's a way of scaling up the process of teaching a model good behavior without needing a human to review every single example.

The name comes from the idea of the model being guided by an explicit, readable set of rules, rather than only implicit patterns learned from labeled data.

## Technical

Constitutional AI has a model generate an initial response, then critique that response against a set of written principles, then revise the response based on its own critique, producing training data without requiring extensive human labeling of individual harmful examples. This self-critique data can then be used for supervised fine-tuning and to train a preference model for reinforcement learning, similar in spirit to RLHF but substituting AI-generated feedback (guided by the constitution) for a large volume of direct human preference labels.

## Examples

- A model revising its own answer after checking it against a written set of principles
- Reducing the amount of human-labeled preference data needed compared to standard RLHF
- Anthropic's use of this technique in developing Claude's safety behavior

---
id: in-context-learning
term: In-Context Learning
aliases:
  - ICL
  - few-shot prompting
type: concept
domains: [inference, fundamentals]
adoption: established
trend: steady
summary: A model adapting its behavior within a single prompt, using examples or instructions, without updating its parameters.
relationships:
  - type: alternative-to
    target: fine-tuning
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

You can often teach a model to do something new just by showing it a couple of examples right there in your prompt — no retraining required. Show it two examples of turning casual text into formal text, then give it a third sentence, and it will often follow the same pattern. That's in-context learning: the model "learns" the task for the length of that conversation, then forgets it completely once the conversation ends.

This is a big part of why prompting is so powerful — you can redirect a model's behavior instantly, without touching its underlying training.

## Technical

In-context learning refers to a model adapting its outputs based on patterns present in its prompt (instructions, few-shot examples, or demonstrations) without any gradient updates to its parameters — the adaptation exists only within that forward pass and doesn't persist afterward. It emerged as a capability of sufficiently large pretrained models and is the mechanism underlying few-shot prompting, in contrast to fine-tuning, which permanently updates the model's weights.

## Examples

- Providing two example input/output pairs before asking the model to handle a third
- A model correctly following a new output format described only in the current prompt
- Choosing in-context learning over fine-tuning when you need flexibility without retraining

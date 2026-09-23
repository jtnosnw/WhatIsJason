---
id: chain-of-thought
term: Chain-of-Thought Prompting
aliases:
  - CoT
type: technique
domains: [inference, agents]
adoption: established
trend: steady
summary: Prompting a model to reason through intermediate steps before giving a final answer, improving accuracy on complex tasks.
relationships:
  - type: part-of
    target: prompt-engineering
  - type: used-in
    target: ai-agent
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Ask a model to jump straight to an answer on a tricky math or logic problem, and it's more likely to make a mistake. Ask it to "think step by step" first, and accuracy often improves noticeably. Chain-of-thought prompting is simply encouraging the model to show and work through its reasoning before committing to a final answer, much like a student showing their work on a math test.

It also has a side benefit: you can often see where the model's reasoning went wrong, if it does make a mistake.

## Technical

Chain-of-thought prompting elicits intermediate reasoning steps from a model before the final answer, which improves performance on tasks requiring multi-step logic, arithmetic, or reasoning, likely by giving the model more computation and more opportunities to catch its own errors before committing to an output. It can be induced through explicit prompting instructions or is sometimes built into a model's default behavior through training.

## Examples

- Adding "let's think step by step" before a math word problem
- A model breaking down a multi-part question into sub-answers before combining them
- Reviewing a model's shown reasoning to spot exactly where a wrong answer went astray

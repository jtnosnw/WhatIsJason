---
id: prompt-engineering
term: Prompt Engineering
type: workflow
domains: [tooling]
adoption: established
trend: steady
summary: The practice of carefully wording instructions to a model to get more reliable, accurate, or useful outputs.
relationships:
  - type: used-in
    target: ai-agent
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

The same question can get a much better or worse answer from an AI model depending on exactly how it's asked. Prompt engineering is the skill of writing clear, well-structured instructions, providing context, examples, or step-by-step guidance, to reliably get the kind of response you actually want.

It's less about "tricking" the model and more like giving really good instructions to a very literal, very capable assistant who has no other context about what you need.

## Technical

Prompt engineering involves techniques like few-shot examples, explicit output formatting instructions, chain-of-thought prompting (asking the model to reason step by step), system prompts that set persistent behavior, and iterative refinement based on observed outputs. It sits alongside fine-tuning and RAG as a way to shape model behavior, but requires no training and can be adjusted instantly at inference time.

## Examples

- Adding "think step by step" to improve a model's reasoning on math problems
- Providing a few example input and output pairs to demonstrate a desired format
- Writing a system prompt that defines an assistant's persona and constraints

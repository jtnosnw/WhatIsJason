---
id: benchmark
term: Benchmark
type: workflow
domains: [evaluation]
adoption: established
trend: steady
summary: A standardized test used to measure and compare model performance on a specific task or skill.
relationships:
  - type: alternative-to
    target: human-evaluation
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

How do you know if one AI model is actually better than another? Benchmarks are standardized tests, sets of questions or tasks with known correct answers, that let researchers measure and compare models on a level playing field, the same way a standardized exam compares students.

Different benchmarks test different things: some focus on general knowledge, others on coding ability, math reasoning, or safety, so a model's benchmark scores only tell part of the story.

## Technical

A benchmark is a fixed dataset and scoring methodology used to evaluate model performance on a defined task, enabling reproducible comparison across models and training runs. Common concerns include benchmark contamination (test data leaking into training data, inflating scores), overfitting to specific benchmarks rather than general capability, and the gap between benchmark performance and real-world usefulness.

## Examples

- MMLU testing broad academic knowledge across many subjects
- HumanEval measuring a model's ability to write correct code
- Benchmark leaderboards used to compare models like GPT, Claude, and Gemini

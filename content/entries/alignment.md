---
id: alignment
term: Alignment
type: concept
domains: [safety]
adoption: foundational
trend: steady
summary: The effort to make an AI system's goals and behavior match human intentions and values.
relationships:
  - type: prerequisite-of
    target: guardrails
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

A powerful AI system that's very good at achieving goals isn't automatically good at achieving the right goals, or achieving them in ways people actually want. Alignment is the broad effort to close that gap, to make sure a model's behavior reflects what humans actually intend, including being honest, avoiding harm, and following instructions sensibly, not just technically satisfying them.

It's an ongoing area of research, not a solved problem, and touches everything from how models are trained to how their outputs are evaluated and monitored.

## Technical

Alignment research addresses the gap between a model's optimized objective (e.g. predicting likely text, or maximizing a reward signal) and the actual intentions of its designers and users, encompassing techniques like RLHF, constitutional AI, red-teaming, and interpretability research. Key sub-problems include specification (defining what "good" behavior means), robustness (behaving well even in unusual situations), and scalable oversight (evaluating behavior that may exceed human ability to directly judge).

## Examples

- RLHF as a practical alignment technique used in most modern assistants
- Red-teaming a model to find ways it can be induced to misbehave
- Constitutional AI, where a model is trained against a set of explicit principles

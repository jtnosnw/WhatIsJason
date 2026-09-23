---
id: red-teaming
term: Red-Teaming
type: workflow
domains: [safety, evaluation]
adoption: established
trend: rising
summary: Deliberately probing a model with adversarial inputs to find ways it can be misused or made to misbehave.
relationships:
  - type: used-in
    target: alignment
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Before a model is released, someone needs to actively try to break it — asking tricky, manipulative, or edge-case questions to see where it fails, says something harmful, or can be tricked into ignoring its guidelines. That's red-teaming: playing the role of an attacker on purpose, so the real weaknesses get found and fixed before actual users (or bad actors) find them first.

It's the AI-safety equivalent of a company hiring hackers to try to break into its own systems.

## Technical

Red-teaming systematically searches for failure modes by crafting adversarial prompts, edge cases, and multi-turn attack strategies designed to elicit unsafe, biased, or policy-violating outputs. It can be done manually by human testers, automatically by using another model to generate attacks at scale, or both together. Findings from red-teaming typically feed back into training data, guardrails, or alignment techniques like RLHF and constitutional AI.

## Examples

- Testers trying multi-step prompts designed to bypass a model's safety training
- Using one model to automatically generate thousands of adversarial test prompts for another
- Red-team findings leading to new guardrail rules before a public release

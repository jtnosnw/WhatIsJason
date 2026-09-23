---
id: system-prompt
term: System Prompt
type: concept
domains: [tooling, inference]
adoption: established
trend: steady
summary: A persistent instruction set placed before a conversation to shape a model's behavior, tone, and boundaries throughout it.
relationships:
  - type: used-in
    target: prompt-engineering
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Rather than repeating the same instructions every single message, a system prompt sets up standing instructions once, at the start, that apply for the whole conversation: who the assistant should act as, what tone to use, what topics to avoid, what format to reply in. The user's actual messages then build on top of that foundation.

It's the difference between telling someone the ground rules once at the start of a meeting versus having to repeat them before every single sentence.

## Technical

A system prompt is typically passed as a distinct message role (separate from user and assistant messages) that establishes persistent context, persona, and constraints applied throughout the conversation, generally given higher priority by the model than later user instructions. Well-designed system prompts specify tone, format, scope, and edge-case handling, and are a primary lever developers use to customize model behavior for a specific application without any fine-tuning.

## Examples

- A system prompt instructing an assistant to always respond in a specific format
- Setting persona, tone, and topic boundaries for a customer-facing chatbot
- Distinguishing trusted system-prompt instructions from untrusted user or document content

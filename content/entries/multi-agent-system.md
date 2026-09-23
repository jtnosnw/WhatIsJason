---
id: multi-agent-system
term: Multi-Agent System
aliases:
  - multi-agent
  - agent swarm
type: system
domains: [agents]
adoption: emerging
trend: rising
summary: Multiple specialized AI agents working together, each handling part of a task and coordinating toward a shared goal.
relationships:
  - type: implemented-by
    target: ai-agent
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Some tasks are easier to split up than to hand to a single generalist. A multi-agent system does exactly that: instead of one AI trying to do everything, several agents each specialize in one part of a job — one researches, one writes, one checks the work — and pass results between each other until the task is done.

It's similar to how a small team of specialists can often outperform one person trying to juggle every role at once.

## Technical

Multi-agent systems coordinate several agent instances, often with distinct roles, prompts, or tool access, communicating through structured messages or a shared state. Coordination patterns range from a fixed pipeline (agent A's output feeds agent B) to a manager agent that dynamically delegates subtasks to worker agents. Key challenges include avoiding redundant or conflicting work, managing shared context efficiently, and handling failures in one agent without derailing the whole system.

## Examples

- A "researcher" agent gathering information and a "writer" agent turning it into a report
- A coding system with separate agents for planning, writing code, and reviewing it
- Customer support systems that route a query to a specialist agent based on topic

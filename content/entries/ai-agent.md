---
id: ai-agent
term: AI Agent
aliases:
  - agent
  - autonomous agent
type: system
domains: [agents]
adoption: emerging
trend: rising
summary: A system that uses a model to plan and take actions toward a goal, often across multiple steps and tools.
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

A basic AI chatbot answers a question and stops. An AI agent goes further: it can break a goal into steps, decide what to do next, use tools like a web browser or calculator, and keep going until the goal is done, checking its own progress along the way.

Think of the difference between asking someone a question versus asking them to actually go handle a task for you, checking in, adjusting, and following through.

## Technical

An AI agent wraps a model in a control loop that alternates between reasoning (deciding what to do next) and acting (calling tools, APIs, or sub-processes), using the results of each action to inform the next decision, often until a stopping condition or goal check is satisfied. Common patterns include ReAct (interleaving reasoning and acting), planning-then-execution, and multi-agent systems where several specialized agents collaborate.

## Examples

- A coding agent that writes code, runs tests, and fixes failures automatically
- A research agent that searches the web, reads results, and compiles a report
- A customer service agent that can look up an order and issue a refund

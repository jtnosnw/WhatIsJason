---
id: agent-orchestration
term: Agent Orchestration
type: workflow
domains: [agents, tooling]
adoption: emerging
trend: rising
summary: Coordinating when and how multiple agents or tools are invoked so a complex task gets completed correctly.
relationships:
  - type: used-in
    target: multi-agent-system
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

When a task involves several agents or tools working together, something has to decide the order of operations: who goes first, what happens if a step fails, and when the whole thing is actually finished. Orchestration is that coordination layer — the traffic control system sitting above the individual agents.

Without it, you'd just have a pile of capable pieces with no one directing traffic.

## Technical

Orchestration frameworks manage the control flow between agents and tools: sequencing calls, passing outputs as inputs to the next step, handling retries and errors, and enforcing constraints like timeouts or budgets. Some orchestration is explicit and rule-based (a defined pipeline or state machine); other systems let a coordinating agent decide dynamically which agent or tool to invoke next based on intermediate results.

## Examples

- A workflow engine that runs a research agent, then a summarizer agent, then a writer agent in sequence
- Retrying a failed tool call automatically before escalating to a human
- A manager agent dynamically deciding which specialist agent to call next

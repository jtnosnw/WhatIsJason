---
id: task-planning
term: Task Planning
aliases:
  - planning
type: technique
domains: [agents]
adoption: emerging
trend: rising
summary: Breaking a high-level goal into an ordered sequence of smaller steps an agent can execute one at a time.
relationships:
  - type: used-in
    target: ai-agent
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Give an agent a big, vague goal like "plan a trip to Japan," and it needs a way to turn that into concrete, ordered steps: research flights, check visa requirements, book a hotel, and so on. Task planning is that breakdown process — figuring out what needs to happen, and in what order, before actually doing any of it.

Good planning is often the difference between an agent that flails around and one that reliably gets things done.

## Technical

Task planning decomposes a high-level objective into a sequence or tree of subtasks, optionally identifying dependencies between them (which steps must happen before others). Approaches range from having the model generate a plan directly via prompting, to more structured methods that revise the plan as new information arrives (since real-world execution rarely goes exactly as first planned). Planning quality is a major factor in how well an agent handles multi-step, ambiguous tasks.

## Examples

- An agent listing the steps needed to debug a failing test before writing any code
- Re-planning after a tool call returns an unexpected result
- Breaking "write a report on competitor pricing" into research, analysis, and drafting steps

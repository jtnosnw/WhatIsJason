---
id: tool-use
term: Tool Use
aliases:
  - function calling
  - tool calling
type: technique
domains: [agents]
adoption: established
trend: rising
summary: A model's ability to call external functions or services to get information or take action beyond generating text.
relationships:
  - type: used-in
    target: ai-agent
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

On its own, a model can only produce text — it can't check today's weather, run a calculation reliably, or send an email. Tool use fixes that by letting the model say, in effect, "call this function with these inputs," and then feeding the result back so it can use it in its answer.

This is what turns a model from a pure text generator into something that can actually interact with the outside world.

## Technical

Tool use (often implemented as "function calling") lets a model output a structured request specifying a function name and arguments, which the surrounding application executes and returns as a result appended to the model's context. This requires the model to be trained or prompted to recognize when a tool is needed, format calls correctly, and interpret results, and is the mechanism underlying most agentic and API-integrated AI systems.

## Examples

- A model calling a weather API to answer "what's the weather in Tokyo?"
- Function calling used to query a company's internal database
- An agent chaining multiple tool calls together to complete a task

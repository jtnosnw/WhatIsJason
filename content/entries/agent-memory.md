---
id: agent-memory
term: Agent Memory
aliases:
  - long-term memory
type: concept
domains: [agents]
adoption: emerging
trend: rising
summary: A mechanism that lets an agent retain information across steps or sessions, beyond what fits in a single context window.
relationships:
  - type: used-in
    target: ai-agent
  - type: used-in
    target: retrieval-augmented-generation
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

A model's context window is like short-term memory — once a conversation gets long enough, older details fall out of view. Agent memory gives an agent a way to hold onto important information for longer: facts about a user, decisions made earlier in a task, or lessons from previous runs, stored somewhere outside the context window and pulled back in when relevant.

This is part of what makes an agent feel like it's actually learning your preferences over time, rather than starting fresh every conversation.

## Technical

Agent memory is typically implemented as an external store (a database, vector store, or structured file) that the agent writes to and reads from during its control loop, distinct from the model's own parameters or its immediate context window. Common patterns include episodic memory (logs of past interactions), semantic memory (distilled facts, often retrieved via embeddings), and working memory (a scratchpad for the current task). Retrieval-augmented generation is a common mechanism for surfacing relevant memories back into context.

## Examples

- An assistant recalling a user's stated preferences from earlier conversations
- An agent storing a summary of completed subtasks so it doesn't repeat work
- Using a vector database to retrieve the most relevant past interactions

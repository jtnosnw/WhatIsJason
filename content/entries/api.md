---
id: api
term: API
aliases:
  - application programming interface
type: technology
domains: [tooling]
adoption: foundational
trend: steady
summary: A defined way for one piece of software to request services or data from another, such as a hosted AI model.
relationships:
  - type: used-in
    target: tool-use
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

An API is essentially a menu of requests one program can make to another. When a developer builds an app that uses Claude or GPT, they're usually not running the model themselves — they're sending a request over the internet to the company's API and getting a response back, following a well-defined format.

This is how the same underlying model can power a chatbot, a coding tool, and a writing assistant simultaneously — all just different apps talking to the same API.

## Technical

An API defines the endpoints, request and response formats, authentication, and rate limits through which external software interacts with a service. For AI models, APIs typically accept a prompt or message history plus parameters (temperature, max tokens, etc.) and return generated text or structured data, often via HTTP with JSON payloads, and increasingly with support for streaming responses and tool or function calling.

## Examples

- Sending a prompt to the Anthropic API and receiving Claude's response
- API keys used to authenticate and track usage and billing
- Streaming API responses so text appears incrementally rather than all at once

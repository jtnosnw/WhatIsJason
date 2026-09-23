---
id: sdk
term: SDK
aliases:
  - software development kit
type: technology
domains: [tooling]
adoption: established
trend: steady
summary: A package of pre-built code that makes it easier for developers to call an API without writing everything from scratch.
relationships:
  - type: used-in
    target: api
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

You could talk to an API by manually constructing web requests yourself, but that's tedious and error-prone. An SDK is a ready-made toolkit, usually provided by the company behind the API, that handles the fiddly details for you: authentication, formatting requests correctly, parsing responses, handling errors, so a developer can call a few simple functions in their own programming language instead.

It's the difference between building a piece of furniture from raw lumber versus using a kit that already has all the parts pre-cut.

## Technical

An SDK (Software Development Kit) wraps an API's raw HTTP interface in language-specific functions and classes, handling authentication, request formatting, retries, streaming, and response parsing, so developers interact with idiomatic code rather than constructing HTTP requests manually. Official SDKs typically stay in sync with an API's latest features, making them the recommended way to integrate for most application development compared to calling the API directly.

## Examples

- Using a Python SDK to call an AI provider's API with a few lines of code
- SDK methods handling streaming responses automatically instead of manual parsing
- Official SDKs typically supporting the latest API features first

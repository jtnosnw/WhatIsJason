---
id: guardrails
term: Guardrails
type: technique
domains: [safety, tooling]
adoption: established
trend: rising
summary: Rules, filters, or checks placed around a model to keep its outputs within safe or intended boundaries.
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Even a well-trained model can occasionally produce something unwanted — an unsafe suggestion, an off-topic answer, leaked sensitive information. Guardrails are the extra safety layers built around a model to catch and prevent that: filtering inputs before they reach the model, checking outputs before they reach the user, or restricting what topics or actions the model is allowed to engage with.

They're a practical complement to alignment: alignment tries to make the model itself behave well; guardrails add an extra layer of protection in case it doesn't.

## Technical

Guardrails are implemented as pre-processing filters (blocking disallowed inputs), post-processing checks (validating or filtering outputs, e.g. for PII or policy violations), structured output constraints (schema validation), or separate classifier models that flag risky content. They operate outside the model's own weights, making them easier to update and audit than retraining, and are commonly layered with a model's built-in alignment training rather than relying on either alone.

## Examples

- A content filter that blocks a model from generating harmful instructions
- Schema validation to ensure a model's structured output matches an expected format
- A separate classifier flagging responses that might contain private information

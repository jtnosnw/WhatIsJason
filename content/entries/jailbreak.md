---
id: jailbreak
term: Jailbreak
type: concept
domains: [safety]
adoption: established
trend: rising
summary: An attempt to bypass a model's safety training so it produces content it would normally refuse to generate.
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Models are trained to refuse certain kinds of requests — for harmful, dangerous, or policy-violating content. A jailbreak is any technique someone uses to get around those refusals, often through clever framing, role-play scenarios, or multi-step conversations designed to trick the model into dropping its guard.

Model developers treat jailbreak resistance as an ongoing arms race: new jailbreak techniques get discovered, and defenses get updated in response.

## Technical

Jailbreaking encompasses a range of adversarial techniques — role-play framing, hypothetical scenarios, encoding requests indirectly, multi-turn escalation, or exploiting prompt injection — aimed at circumventing a model's safety training and eliciting disallowed outputs. Robustness against jailbreaks is tested through red-teaming and improved through techniques like RLHF, constitutional AI, and dedicated safety classifiers layered on top of the model itself.

## Examples

- Asking a model to "roleplay" as a character with no restrictions to bypass refusals
- Multi-turn conversations designed to gradually erode a model's guardrails
- Red-teaming used specifically to discover and patch new jailbreak techniques

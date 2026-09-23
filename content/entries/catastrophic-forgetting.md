---
id: catastrophic-forgetting
term: Catastrophic Forgetting
type: concept
domains: [training]
adoption: established
trend: steady
summary: When training a model on new data causes it to lose previously learned knowledge or skills.
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

When you teach a model something new, there's a risk it forgets some of what it already knew — like cramming for one exam and losing your grip on material from a previous one. This is a real concern when fine-tuning a capable general model on a narrow dataset: it might become great at the new task while quietly getting worse at things it used to do well.

Careful fine-tuning tries to strike a balance so the model gains a new skill without losing its old ones.

## Technical

Catastrophic forgetting occurs because gradient updates for a new task can overwrite parameter values important for previously learned tasks, especially when fine-tuning aggressively or on data very different from the original training distribution. Mitigations include using a low learning rate during fine-tuning, mixing some original training data back in, parameter-efficient methods like LoRA that only adjust a small subset of weights, and regularization techniques that penalize large changes to important parameters.

## Examples

- A model fine-tuned heavily on legal text becoming worse at casual conversation
- Using a low learning rate during fine-tuning specifically to limit forgetting
- LoRA fine-tuning reducing forgetting risk by leaving most original weights untouched

---
id: fine-tuning
term: Fine-tuning
type: technique
domains: [training]
adoption: established
trend: steady
summary: Further training a pretrained model on a smaller, focused dataset to specialize its behavior.
relationships:
  - type: prerequisite-of
    target: rlhf
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Fine-tuning takes a model that already knows a lot in general and teaches it to be really good at one particular thing. Instead of starting from zero, you start from a capable pretrained model and show it a smaller, focused set of examples — customer support conversations, legal documents, a certain writing style — until it adapts.

It's much cheaper and faster than pretraining from scratch, because the model already has the broad foundation; fine-tuning just specializes it.

## Technical

Fine-tuning continues optimization of a pretrained model's parameters (fully or partially, e.g. via LoRA/adapters) on a smaller, task-specific dataset, usually with a lower learning rate to avoid catastrophic forgetting of general capabilities. Variants include supervised fine-tuning (SFT) on labeled examples and further stages like RLHF for behavior shaping.

## Examples

- Fine-tuning a base model on customer support transcripts to build a support chatbot
- Using LoRA to fine-tune efficiently without updating all parameters
- Fine-tuning a code model specifically on a company's codebase style

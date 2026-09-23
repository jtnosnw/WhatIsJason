---
id: instruction-tuning
term: Instruction Tuning
type: technique
domains: [training]
adoption: established
trend: steady
summary: Fine-tuning a model on examples of instructions paired with correct responses, so it learns to follow directions well.
relationships:
  - type: part-of
    target: fine-tuning
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

A freshly pretrained model has absorbed a lot of knowledge, but it doesn't automatically know how to be a helpful assistant that follows instructions well. Instruction tuning teaches it that specific skill, by training it on many examples of instructions paired with good responses — "summarize this," "translate that," "write a poem about X" — until following instructions well becomes second nature.

This is typically one of the first steps in turning a raw base model into something that behaves like a helpful chat assistant.

## Technical

Instruction tuning is a form of supervised fine-tuning where the training data consists specifically of instruction-response pairs across a wide variety of task types, teaching the model to generalize to following novel instructions it wasn't explicitly trained on. It's typically applied to a pretrained base model before further alignment stages like RLHF, and is a major factor in why instruction-tuned models feel noticeably more usable and directable than raw base models.

## Examples

- Training on datasets of diverse instruction-response pairs across many task types
- The step that turns a raw pretrained base model into a usable chat assistant
- Instruction-tuned models generalizing to follow new instructions they weren't explicitly trained on

---
id: distillation
term: Knowledge Distillation
aliases:
  - model distillation
type: technique
domains: [training, performance]
adoption: established
trend: rising
summary: Training a smaller "student" model to mimic a larger "teacher" model's behavior, keeping most capability at lower cost.
relationships:
  - type: alternative-to
    target: quantization
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Big, powerful models are expensive and slow to run. Distillation is a way to get a smaller, cheaper model that behaves similarly, by having the small model learn directly from the big one's outputs, rather than from scratch. The large "teacher" model effectively teaches the smaller "student" model its best behaviors, and the result is often much more capable than a same-sized model trained the normal way.

It's a common technique behind smaller, faster models that still feel surprisingly capable.

## Technical

Distillation trains a smaller student model to match a larger teacher model's output distribution (not just its final hard predictions), typically by minimizing the difference between the two models' probability distributions over outputs for the same inputs. This transfers some of the teacher's learned "soft" knowledge — including its uncertainty and relative preferences between options — that isn't visible from labeled data alone. It's a complementary approach to quantization: distillation reduces parameter count and architecture size, while quantization reduces the numerical precision of whichever size model you have.

## Examples

- A smaller, faster model trained to imitate the outputs of a larger flagship model
- Distilled models used on-device or in latency-sensitive applications
- Combining distillation with quantization for maximum size and speed reduction

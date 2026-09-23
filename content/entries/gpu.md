---
id: gpu
term: GPU
aliases:
  - graphics processing unit
type: technology
domains: [performance, tooling]
adoption: foundational
trend: steady
summary: Specialized computer hardware, originally built for graphics, whose parallel design makes it well-suited to training and running AI models.
relationships:
  - type: used-in
    target: model-training
  - type: used-in
    target: inference-process
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Training and running large AI models involves doing enormous numbers of simple mathematical operations at the same time. Regular computer processors (CPUs) are built to do a smaller number of tasks very flexibly, one after another; GPUs are built to do huge numbers of simpler calculations all at once, in parallel. That parallel design, originally developed for rendering video game graphics, happens to be extremely well-suited to the matrix math that powers neural networks.

This is why GPUs (and increasingly, similar specialized chips) became the essential hardware behind the modern AI boom.

## Technical

GPUs contain thousands of smaller cores designed for massively parallel arithmetic, making them far more efficient than general-purpose CPUs at the matrix multiplications that dominate neural network training and inference. GPU memory (VRAM) capacity is a key practical constraint, since a model's parameters, activations, and (during inference) its KV cache must fit within it, which is a major motivation behind techniques like quantization. Specialized AI accelerator chips (like TPUs) apply similar parallel principles with hardware tuned even more specifically for deep learning workloads.

## Examples

- VRAM capacity determining what size of model can be run locally on a given GPU
- Data centers using thousands of GPUs connected together to train the largest models
- Quantization used specifically to fit larger models into limited GPU memory

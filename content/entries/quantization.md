---
id: quantization
term: Quantization
type: technique
domains: [performance]
adoption: established
trend: rising
summary: Reducing the numerical precision of a model's parameters to shrink its size and speed it up.
relationships:
  - type: used-in
    target: machine-learning-model
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Model parameters are normally stored as fairly precise numbers. Quantization rounds those numbers to a coarser, lower-precision format, which makes the model smaller and faster to run, at the cost of a small amount of accuracy. It's a major reason large models can now run on ordinary consumer hardware instead of requiring huge, expensive servers.

Think of it like compressing a high-resolution photo into a smaller file — you lose a little detail, but it's dramatically easier to store and share.

## Technical

Quantization maps model weights (and sometimes activations) from a high-precision format like FP32 or FP16 to a lower-precision one like INT8 or INT4, reducing memory footprint and often increasing throughput on compatible hardware. Techniques range from simple post-training quantization to quantization-aware training, which adapts the model during training to tolerate the reduced precision with less accuracy loss.

## Examples

- Running a 4-bit quantized 7B model on a consumer GPU with limited VRAM
- GGUF and GPTQ as popular quantization formats for local LLMs
- Trading a small drop in accuracy for a large reduction in memory use

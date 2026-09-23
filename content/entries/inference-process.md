---
id: inference-process
term: Inference
aliases:
  - model inference
type: workflow
domains: [inference]
adoption: foundational
trend: steady
summary: Running a trained model on new input to produce an output, as opposed to training it.
relationships:
  - type: prerequisite-of
    target: context-window
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Training is the slow, expensive process of teaching a model. Inference is everything that happens afterward: actually using the finished model to answer a question, generate an image, or make a prediction. Every time you send a message to an AI chatbot, you're triggering inference — the model's parameters stay fixed, and it just computes a response based on what it already learned.

This distinction matters because training and inference have very different costs, hardware needs, and optimization concerns.

## Technical

Inference is a forward pass through a trained model's fixed parameters, producing an output from a given input without any weight updates. For autoregressive language models, inference happens token by token, with each new token depending on all previous ones, which is why techniques like KV caching, batching, and quantization exist specifically to make inference faster and cheaper at scale. Inference cost and speed, not training cost, dominate the economics of running an AI product at scale.

## Examples

- Every chat response from an AI assistant is the result of an inference pass
- Inference-optimized hardware and software differ from training-optimized setups
- A company's ongoing "inference costs" refer to running the already-trained model, not training it

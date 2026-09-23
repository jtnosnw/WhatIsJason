---
id: transformer-architecture
term: Transformer
aliases:
  - transformer architecture
  - transformer model
type: technology
domains: [architecture]
adoption: foundational
trend: steady
summary: The neural network architecture, built around attention, behind most modern large language models.
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

The transformer is the blueprint behind almost every major AI language model today, including GPT and Claude. Its key trick is processing an entire piece of text at once and using attention to figure out how every part relates to every other part, rather than reading strictly left to right.

This design turned out to scale remarkably well: bigger transformers, trained on more data, kept getting more capable, which is a big part of why AI progressed so quickly in recent years.

## Technical

A transformer stacks layers of multi-head self-attention and position-wise feed-forward networks, with residual connections and layer normalization for stable training. Because attention has no inherent sense of order, positional encodings are added to the input embeddings. Transformers come in encoder-only (e.g. BERT), decoder-only (e.g. GPT-style), and encoder-decoder (e.g. T5) variants, with decoder-only being dominant for modern generative LLMs.

## Examples

- GPT, Claude, and LLaMA are all decoder-only transformer models
- BERT is an encoder-only transformer used for understanding tasks
- The original "Attention Is All You Need" paper introduced the architecture in 2017

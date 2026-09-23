---
id: embedding
term: Embedding
aliases:
  - vector embedding
  - embeddings
type: concept
domains: [architecture, data]
adoption: foundational
trend: steady
summary: A numeric vector representation of text (or other data) that captures its meaning for a model to use.
relationships:
  - type: prerequisite-of
    target: vector-database
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

An embedding turns a word, sentence, or even an image into a list of numbers that captures its meaning in a way a computer can compare mathematically. Similar meanings end up as similar lists of numbers — so "king" and "queen" sit closer together in this numeric space than "king" and "banana" do.

This is the trick that lets computers do things like search by meaning instead of exact keywords, or measure how similar two pieces of text really are.

## Technical

An embedding is a dense vector in a continuous, usually high-dimensional space, learned such that geometric relationships (distance, direction) reflect semantic relationships in the original data. Embeddings are produced by a model's early layers (token embeddings) or by dedicated embedding models trained via contrastive or self-supervised objectives. Cosine similarity or dot product between embeddings is commonly used to measure semantic closeness.

## Examples

- Token embeddings that feed into a transformer's first layer
- Sentence embeddings used to power semantic search
- Embeddings stored in a vector database for retrieval-augmented generation

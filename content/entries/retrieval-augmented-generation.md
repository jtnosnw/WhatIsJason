---
id: retrieval-augmented-generation
term: Retrieval-Augmented Generation
aliases:
  - RAG
type: technique
domains: [data, inference]
adoption: established
trend: rising
summary: Giving a model relevant external information at query time so it can answer using facts beyond its training data.
relationships:
  - type: alternative-to
    target: fine-tuning
  - type: used-in
    target: ai-agent
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

A model's knowledge is frozen at the time it was trained, and it can't know about your private documents or anything that happened afterward. RAG works around this by fetching relevant information first — from a database, your files, or the web — and handing it to the model along with your question, so it can answer using fresh, specific facts instead of relying only on what it memorized during training.

This is why many AI products can answer questions about a specific company's documents or recent events, even though the underlying model wasn't trained on that information.

## Technical

RAG systems embed a user query, retrieve the most semantically relevant chunks from an external knowledge source (typically via a vector database), and inject those chunks into the model's context window as grounding evidence before generation. This reduces hallucination risk and enables up-to-date or proprietary knowledge without retraining, at the cost of added system complexity (chunking strategy, retrieval quality, re-ranking) compared to relying purely on parametric knowledge.

## Examples

- A support chatbot that retrieves relevant help articles before answering
- Searching your own PDFs and injecting the top matches into a prompt
- Combining RAG with fine-tuning for both fresh facts and consistent tone

---
id: reranking
term: Reranking
type: technique
domains: [data, inference]
adoption: established
trend: rising
summary: Re-scoring an initial set of retrieved results with a more accurate model to put the most relevant ones first.
relationships:
  - type: used-in
    target: retrieval-augmented-generation
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

A first search pass is often fast but a bit rough, retrieving a batch of results that are roughly relevant, but not perfectly ordered by actual usefulness. Reranking adds a second, more careful pass: a more accurate (but slower) model looks specifically at that smaller batch of candidates and re-sorts them by how genuinely relevant each one is, before the best few are used.

It's like a fast first-round filter followed by a more careful judge reviewing just the finalists.

## Technical

Reranking applies a more computationally expensive but more accurate relevance model to a smaller candidate set already narrowed down by a faster initial retrieval step (typically vector similarity search), improving final ranking quality without paying the cost of running the expensive model over the entire corpus. This two-stage retrieve-then-rerank pattern is common in RAG pipelines where the initial embedding-based search casts a wide net and a cross-encoder reranker refines the final ordering.

## Examples

- A cross-encoder model reranking the top 50 vector-search results down to the best 5
- Improving RAG answer quality by ensuring the most relevant chunks appear first
- Two-stage retrieve-then-rerank pipelines balancing speed and accuracy

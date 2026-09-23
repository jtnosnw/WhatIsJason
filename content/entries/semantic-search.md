---
id: semantic-search
term: Semantic Search
type: technique
domains: [data]
adoption: established
trend: steady
summary: Searching by meaning using embeddings, so results can match a query's intent even without shared exact keywords.
relationships:
  - type: prerequisite-of
    target: retrieval-augmented-generation
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Traditional keyword search looks for documents containing the exact words you typed. Semantic search instead compares meaning: it converts your query and the documents into embeddings and finds the ones closest in meaning, so a search for "canceling a subscription" can still surface a relevant document titled "how to end your membership," even though no words match exactly.

This is a big part of what makes modern AI-powered search feel smarter than older keyword-based search engines.

## Technical

Semantic search embeds both the query and the documents in a corpus into the same vector space, then retrieves documents whose embeddings are closest to the query's embedding by a similarity measure like cosine similarity, typically using a vector database for efficient approximate nearest-neighbor lookup at scale. It captures conceptual similarity that keyword-based (lexical) search misses, and is the retrieval mechanism underlying most modern RAG pipelines.

## Examples

- Finding relevant support articles even when the query uses different words than the article
- Powering "search by meaning" features in modern documentation and knowledge-base tools
- Often combined with traditional keyword search in a hybrid approach for best results

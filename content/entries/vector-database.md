---
id: vector-database
term: Vector Database
aliases:
  - vector store
  - vector DB
type: technology
domains: [data]
adoption: established
trend: rising
summary: A database optimized for storing and searching embeddings by similarity rather than exact match.
relationships:
  - type: used-in
    target: retrieval-augmented-generation
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

A regular database is great at finding exact matches — "find the customer named John Smith." A vector database instead finds things that are similar in meaning, by comparing embeddings (numeric representations of meaning). This lets you search for "documents about canceling a subscription" and get relevant results even if they don't contain those exact words.

This capability is the backbone of many modern AI search and question-answering systems.

## Technical

Vector databases index high-dimensional embedding vectors and support approximate nearest-neighbor (ANN) search using algorithms like HNSW or IVF, trading a small amount of accuracy for large gains in search speed at scale. They typically support filtering by metadata alongside similarity search, and are a core infrastructure component for retrieval-augmented generation and semantic search applications.

## Examples

- Pinecone, Weaviate, and Chroma as popular vector database products
- Storing document embeddings to power a company knowledge-base chatbot
- Combining vector search with metadata filters (e.g. date, author)

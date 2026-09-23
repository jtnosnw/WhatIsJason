---
id: chunking
term: Chunking
type: technique
domains: [data]
adoption: established
trend: rising
summary: Splitting a long document into smaller pieces so relevant sections can be found and retrieved individually.
relationships:
  - type: used-in
    target: retrieval-augmented-generation
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

You can't usefully search or retrieve "the most relevant part" of a giant document if the whole document is treated as one single block. Chunking solves this by splitting documents into smaller, more manageable pieces first, so a search system can find and pull out just the specific chunk that's actually relevant to a given question, rather than the entire document.

Getting chunk size right matters: too small and you lose context, too large and you drag in a lot of irrelevant text along with the useful part.

## Technical

Chunking divides source documents into smaller segments, typically a few hundred tokens each, often with some overlap between consecutive chunks to avoid cutting relevant context awkwardly at a boundary. Each chunk is embedded separately and stored in a vector database, so retrieval can operate at the chunk level rather than the whole-document level. Chunking strategy (fixed-size, sentence-based, or structure-aware splitting) is one of the most impactful, and most commonly under-tuned, parts of a RAG pipeline's quality.

## Examples

- Splitting a long PDF into overlapping few-hundred-token chunks before embedding
- Structure-aware chunking that respects section or paragraph boundaries
- Poor chunking cutting an important sentence in half across two separate chunks

---
id: tokenization
term: Tokenization
type: technique
domains: [inference, architecture]
adoption: foundational
trend: steady
summary: Breaking text into smaller units (tokens) that a model can process as numbers.
relationships:
  - type: prerequisite-of
    target: transformer-architecture
  - type: prerequisite-of
    target: embedding
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Computers don't understand words directly — they need numbers. Tokenization is the step that chops text into small chunks, called tokens, and assigns each one a number. A token might be a whole word, part of a word, or even a single character, depending on the tokenizer.

This is why AI pricing and limits are often measured in "tokens" rather than words: a model's usage is counted in these underlying chunks, not in plain English words.

## Technical

Tokenization converts raw text into a sequence of discrete tokens from a fixed vocabulary, using algorithms like byte-pair encoding (BPE), WordPiece, or SentencePiece that balance vocabulary size against sequence length. Each token maps to an integer ID, which is then converted into an embedding vector for the model to process. Tokenization choices affect context window efficiency, since more tokens are needed to represent rare words or non-English text.

## Examples

- The word "unbelievable" might split into tokens like "un", "believ", "able"
- Non-English text often uses more tokens per word than English
- API pricing for models like GPT and Claude is billed per token, not per word

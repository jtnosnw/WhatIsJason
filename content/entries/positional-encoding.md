---
id: positional-encoding
term: Positional Encoding
type: technique
domains: [architecture]
adoption: foundational
trend: steady
summary: Information added to a transformer's input so it knows the order of tokens, since attention alone has no sense of sequence.
relationships:
  - type: part-of
    target: transformer-architecture
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Attention lets a transformer look at every word in a sentence at once, which is powerful, but it also means the model has no built-in sense of which word came first, second, or last — it sees a set of words, not a sequence. Positional encoding fixes this by tagging each word's embedding with information about its position, so the model can still tell "the dog bit the man" apart from "the man bit the dog."

Without this, word order — something obviously crucial to meaning — would be invisible to the model.

## Technical

Positional encoding injects sequence-order information into token embeddings before or within the attention layers, since self-attention itself is permutation-invariant. Approaches include fixed sinusoidal encodings (added directly to embeddings, as in the original transformer paper), learned positional embeddings, and more recent relative position schemes like RoPE (Rotary Position Embedding), which encode relative rather than absolute position and tend to generalize better to longer sequences than seen during training.

## Examples

- RoPE (Rotary Position Embedding), widely used in modern large language models
- The original sinusoidal positional encoding from the first transformer paper
- Why extending a model's context window often requires adjusting its positional encoding scheme

---
id: multimodal-model
term: Multimodal Model
type: technology
domains: [architecture]
adoption: established
trend: rising
summary: A model that can process and often generate more than one type of content, such as text, images, or audio, together.
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Early language models could only read and write text. Multimodal models go further, handling multiple kinds of content — text, images, audio, sometimes video — often within the very same conversation, so you can show it a photo and ask a question about it, or describe an image you want generated.

This matters because a lot of real-world information isn't text at all: a chart, a screenshot, a diagram, or a photo often communicates something that would be awkward or impossible to fully describe in words alone.

## Technical

Multimodal models typically encode different input types (images, audio, text) into a shared representation space, often by converting non-text inputs into embeddings compatible with the same transformer architecture that processes text tokens, allowing unified attention across modalities. Architectures vary in how tightly modalities are integrated: some use separate encoders feeding into a shared language model, while others are trained end-to-end across modalities from the start. Output can be single-modality (text describing an image) or itself multimodal (generating images or audio).

## Examples

- Uploading a photo and asking a model to describe or answer questions about it
- Models that generate images or audio directly, not just text
- Interpreting a chart or screenshot as part of answering a question

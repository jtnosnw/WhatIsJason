---
id: open-weights
term: Open-Weights Model
aliases:
  - open weights
type: concept
domains: [fundamentals, tooling]
adoption: established
trend: rising
summary: A model whose trained parameters are published for anyone to download, inspect, and run themselves.
relationships:
  - type: alternative-to
    target: api
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Most well-known AI models can only be used through a company's hosted API — you send a request over the internet and get a response back, but you never actually get the model itself. An open-weights model is different: its trained parameters are published for anyone to download and run on their own hardware, with no API required and no company in the loop for each request.

This matters for privacy (your data never leaves your machine), cost (no per-request fees), and control (you can modify or fine-tune it yourself).

## Technical

Open-weights release means the trained parameter values are made publicly downloadable, allowing anyone to run inference or further fine-tune the model on their own infrastructure. This is distinct from "open source" in the traditional software sense, since training data, code, and methodology are often not fully disclosed alongside the weights. Open-weights models trade the convenience and infrastructure of a managed API for local control, customizability, and the ability to run entirely offline.

## Examples

- Downloading an open-weights model to run locally instead of calling a hosted API
- Fine-tuning an open-weights model on private data that never leaves your own servers
- Choosing an open-weights model specifically to avoid ongoing per-request API costs

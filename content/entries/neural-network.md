---
id: neural-network
term: Neural Network
aliases:
  - artificial neural network
  - ANN
type: technology
domains: [fundamentals]
adoption: foundational
trend: steady
summary: A computing system loosely inspired by the brain, made of layered nodes that learn patterns from data.
relationships:
  - type: prerequisite-of
    target: machine-learning-model
added: 2026-09-22
lastReviewed: 2026-09-22
---

## Plain

Imagine a huge web of tiny decision-makers, stacked in layers, each one looking at the outputs of the layer before it and passing along its own opinion. That's a neural network. Nobody programs the rules directly — instead, the network is shown lots of examples and gradually adjusts itself until its guesses get better.

This adjusting process is called training, and it's what turns a network from a random guesser into something useful, like a system that can recognize a cat in a photo or predict the next word in a sentence.

## Technical

A neural network is a directed graph of weighted connections between simple computational units (neurons), organized into layers. Each neuron computes a weighted sum of its inputs, passes it through a nonlinear activation function, and forwards the result. Training adjusts the weights via backpropagation and gradient descent to minimize a loss function. Depth (number of layers) and width (neurons per layer) determine capacity; architecture choices (convolutional, recurrent, transformer) determine what kinds of patterns the network can efficiently learn.

## Examples

- A network trained to classify images as "cat" or "dog"
- The layers inside a large language model like GPT or Claude
- A network predicting house prices from square footage and location

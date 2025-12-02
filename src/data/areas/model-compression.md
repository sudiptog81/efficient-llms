---
title: Model Compression
slug: model-compression
icon: Package
tags:
  - Model Compression
  - Pruning
  - Quantization
  - Distillation
  - Sparsity
summary: >
  Model compression encompasses pruning, quantization, distillation, and related
  techniques to reduce the computational and memory footprint of large models
  while preserving performance.
---

Model compression refers to the family of techniques that reduce a neural network’s computational and memory footprint while preserving as much task performance as possible. For large language models, this includes **pruning**, **quantization**, **distillation**, **low-rank adaptation**, and **efficient architectures** such as sparse or mixture-of-experts (MoE) designs. The core idea is simple: overparameterized models contain substantial redundancy, and a carefully compressed variant can retain most of the original capabilities at a fraction of the cost.

Pruning remains one of the most widely studied compression methods. It removes redundant or low-importance parameters, either at the weight level (unstructured sparsity) or in larger units such as attention heads, neurons, or entire blocks (structured sparsity). Techniques such as gradual magnitude pruning, movement pruning, and lottery-ticket–style training use gradient flow or loss sensitivity to decide which parameters to keep. In LLMs, pruning extends beyond weights to **KV-cache compression**, **activation sparsification**, and **expert selection** in MoE architectures, producing real speedups for long-context and multi-step reasoning workloads.

Quantization tackles a different axis of redundancy: numerical precision. By representing weights, activations, or KV caches with fewer bits (e.g., 8-bit, 4-bit, or mixed precision), quantization can dramatically shrink memory usage and bandwidth requirements, often with minimal accuracy loss when combined with calibration or quantization-aware training. Distillation, in contrast, compresses models *semantically*: a smaller “student” network is trained to mimic a larger “teacher,” capturing its behavior through soft targets, intermediate feature matching, or explanation traces. This is particularly powerful for deploying compact instruction-following or domain-specialized LLMs.

As models scale into the multi-billion and trillion-parameter regimes, model compression has become a practical necessity rather than a cosmetic optimization. Compressed models enable **on-device inference**, **latency-sensitive applications**, and **multi-model ensembles** that would otherwise be prohibitively expensive. Ongoing research investigates how compression interacts with generalization, robustness, and alignment; how sparsity and low precision affect emergent behaviors; and how to co-design compression with post-training methods such as RLHF, preference optimization, or retrieval augmentation. Model compression is both a systems-level toolkit for making LLMs usable in the real world and a scientific probe for understanding redundancy, information flow, and representation efficiency in large-scale neural networks.
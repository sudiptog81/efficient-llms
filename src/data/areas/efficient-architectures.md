---
title: Efficient Architectures
slug: efficient-architectures
icon: Cog
tags:
  - Efficient Architectures
  - Transformers
  - Sparse Models
  - Mixture-of-Experts
  - Systems
summary: >
  Efficient architectures redesign the computation graph of large models—via sparsity,
  routing, and attention optimizations—to maximize performance per FLOP and per byte.
---

Efficient architectures attack the scaling problem **at the design level**: instead of only compressing a dense Transformer after the fact, they rethink *how* computation and parameters are organized so that every FLOP pulls its weight. In large language models, this includes sparse and mixture-of-experts (MoE) designs, attention variants that reduce context cost, and alternative sequence models that trade quadratic attention for more scalable inductive biases.

A central idea is **conditional computation**. Mixture-of-experts models maintain a large pool of parameters but activate only a small subset (experts) per token. A router determines which experts to use, so effective capacity scales with the number of experts while per-token compute stays roughly constant. This lets models reach “virtual” parameter counts in the hundreds of billions without linearly scaling latency. Variants include top-k routing, token-dropping, and sparse MoE layers interleaved with dense backbone blocks.

Another pillar is **attention efficiency**. Standard self-attention costs \(O(n^2)\) in sequence length, which becomes painful for long-context reasoning. Efficient architectures mitigate this via:

- **Multi-query / grouped-query attention**, which shares keys and values across heads to cut memory bandwidth.
- **KV-cache optimizations**, such as chunking, block-sparse layouts, and low-rank KV projections for long-context decoding.
- **Alternative sequence models** (state-space models, linear attention, hybrid convolution–attention blocks) that approximate global context with sub-quadratic cost.

On the structural side, efficient architectures explore **depth–width tradeoffs** and **bottlenecked modules**. Narrow but deep residual stacks, gated MLPs, and low-rank projections can improve expressivity per parameter. Some designs push heavy capacity into a small number of “core” layers while keeping the rest lightweight, making fine-tuning and routing cheaper. Cross-layer parameter sharing and reversible layers reduce memory further by reusing weights or recomputing activations on the fly.

Efficient architectures are tightly coupled with **systems constraints**. The “right” design depends on GPU memory, bandwidth, and parallelism: MoEs favor high-bandwidth interconnects; multi-query attention helps when KV cache dominates memory; grouped experts and local attention reduce cross-device communication. As a result, architecture search increasingly optimizes for **hardware-aware objectives**: tokens per second, energy per generated token, and deployment targets from data center to edge devices.

In practice, efficient architectures sit alongside compression methods like pruning, quantization, and distillation. A well-designed architecture can start sparse, quantization-friendly, and routing-aware, so that later compression steps are *aligned* with its inductive biases rather than bolted on. Studying these designs also gives a clearer view of where capacity truly matters—attention vs MLP, dense vs sparse paths—and how much “structure” a large language model really needs to think effectively.

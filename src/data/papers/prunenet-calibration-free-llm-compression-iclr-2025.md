---
title: "You Only Prune Once: Designing Calibration-Free Model Compression with Policy Learning"
slug: "prunenet-calibration-free-llm-compression-iclr-2025"
publishedDate: "2025-01-30"
conference: ICLR 2025
categories:
  - Model Compression
  - Pruning
  - Efficient Architectures
authors:
  - name: "Ayan Sengupta"
    affiliation: "IIT Delhi, India"
    email: ayan.sengupta@ee.iitd.ac.in
  - name: "Siddhant Chaudhary"
    affiliation: "IIT Delhi, India"
    email: urssidd@gmail.com
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
    email: tanchak@iitd.ac.in
abstract: "This work introduces PruneNet, a calibration-free structured pruning method for large language models that treats pruning as policy learning over intrinsic model properties. A lightweight policy network learns which FFN dimensions to keep by minimizing a spectral distribution shift between original and compressed weight matrices via a KS-distance penalty. PruneNet compresses LLaMA-2-7B in ~15 minutes, preserves 80–95% of zero-shot performance at 20–30% compression, and outperforms SliceGPT and other structured baselines both in accuracy and throughput—without relying on calibration datasets and with minimal benefit from recovery finetuning."
citations: 6
links:
  arxiv: "https://arxiv.org/abs/2501.15296"
  code: "https://github.com/LCS2-IIITD/PruneNet"
  openreview: "https://openreview.net/forum?id=5RZoYIT3u6"
  huggingface-paper: "https://huggingface.co/papers/2501.15296"
  ppt: "https://iclr.cc/media/iclr-2025/Slides/30946.pdf"
  poster: "https://iclr.cc/media/PosterPDFs/ICLR%202025/30946.png?t=1743958023.7834394"
  video: "https://iclr.cc/virtual/2025/poster/30946"

bibtex: |
  @article{sengupta2025you,
    title={You only prune once: Designing calibration-free model compression with policy learning},
    author={Sengupta, Ayan and Chaudhary, Siddhant and Chakraborty, Tanmoy},
    journal={arXiv preprint arXiv:2501.15296},
    year={2025}
  }
---

![PruneNet: Calibration-Free Model Compression with Policy Learning](/resources/prunenet-calibration-free-llm-compression-iclr-2025/pruneNet3.png)

Large models are powerful but painfully expensive: memory-heavy, slow to run, and hard to deploy. Traditional structured pruning methods—SliceGPT, SVD-based methods, and large-block channel pruning—depend heavily on **calibration datasets**, break easily at high sparsity, and often require expensive recovery finetuning to undo the damage.

**PruneNet takes a different route:**  
It treats pruning as **policy learning over the model’s weights**, guided by a simple but powerful principle:

> *"Keep the compressed spectrum close to the original spectrum, and the model will keep behaving the same."*

By learning what to prune without ever touching calibration data, PruneNet becomes reusable, layer-aware, and surprisingly stable—even at aggressive compression ratios.

### TL;DR

PruneNet turns pruning into a **learned policy** that studies a model’s own weight structure—no calibration data, no guesswork.  By preserving the **spectral shape** of FFN layers, it achieves **higher accuracy**, **faster inference**, and **robust compression** across many LLMs.  Think of it as pruning with intuition *and* discipline.

## Why This Research?

LLM pruning suffers from two long-standing problems:

1. **Calibration dependency** — Most techniques must evaluate many pruned variants on a dataset to pick which slices to keep.
2. **Spectral damage** — Removing rows/columns collapses singular values, distorting information flow in deep layers.

PruneNet tackles both by:

- Using a **weight-only policy network** to choose rows of FFN layers.
- Penalizing **Kolmogorov–Smirnov distance** between original and compressed spectra.
- Making pruning decisions reusable across sparsity levels.

The result is a method that is fast, stable, and *shockingly accurate* with zero external data.

---

## Main Insights

### 1. Pruning as Learned Policy (No Calibration)

Each FFN layer is treated as a **state**, and pruning rows is an **action**.  
The policy network (a tiny MLP ~0.6% of LLaMA-2-7B) outputs keep/drop probabilities based solely on weights.

- No dataset needed  
- No activation recording  
- No layer-wise greedy scoring

Just pure structural reasoning over the matrix itself.

---

### 2. Spectral Preservation via KS Distance

Standard slicing shrinks and skews singular values: $\sigma^\text{pruned} \rightarrow \text{imbalanced, right-skewed spectrum}$

PruneNet minimizes the KS divergence: $\text{KS}(\Sigma_\text{orig},\, \Sigma_\text{pruned})$

This ensures the **shape** of the singular-value distribution stays intact, which strongly correlates with downstream task stability.

---

### 3. Structured FFN Compression (Where It Matters)

FFN layers account for:

- **64% of parameters** in LLaMA-2-7B  
- Majority of nonlinearity  
- Majority of compute

PruneNet selectively removes entire rows of FFN1 and corresponding columns of FFN2—maintaining functional consistency and FLOPs reductions.

---

### 4. You Only Prune Once: Policy Transfer

Train a policy at **one sparsity level**—reuse it across many compression ratios.

- Train at 40% → reuse at 10%, 20%, 30% → <1% average drop.
- Train at 10% → reuse at 20–40% → still beats SliceGPT by ≥3 points.

A single policy effectively acts as a **compression oracle** for the whole model family.

---

### 5. Reinforcement Learning Over Layers

The pruning problem is non-differentiable.  
PruneNet uses **REINFORCE** with:

- Per-layer rewards  
- Future-discounted spectral penalties  
- Layer depth–sensitive prioritization  

Later layers get stronger incentives (they hold more semantic content).

---

## Results Overview

### Zero-Shot Performance (LLaMA-2-7B)

Average over PIQA, WinoGrande, HellaSwag, ARC-e, ARC-c:

| Compression | Dense | SliceGPT | PruneNet |
|------------:|------:|----------:|----------:|
| **20%** | 69.0 | 58.2 | **61.7** |
| **25%** | 69.0 | 55.5 | **58.6** |
| **30%** | 69.0 | 51.5 | **55.5** |

PruneNet retains **~89% performance** at moderate sparsity and stays significantly more stable than SliceGPT.

---

### Phi-2 (2.7B)

| Compression | Dense | SliceGPT | PruneNet |
|-----------:|-------:|----------:|----------:|
| **30%** | 72.24 | 51.99 | **61.05** |

A massive 9-point advantage at the same sparsity.

### Throughput Gains

LLaMA-2-7B @ 30% compression:

| Model | Tokens/sec |
|------|-------------|
| Dense | 11.96 |
| SliceGPT | 12.82 |
| **PruneNet** | **20.74** |

Nearly **2× faster inference**.

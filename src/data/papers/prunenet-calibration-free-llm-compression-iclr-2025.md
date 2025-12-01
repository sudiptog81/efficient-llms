---
title: "You Only Prune Once: Designing Calibration-Free Model Compression with Policy Learning"
slug: "prunenet-calibration-free-llm-compression-iclr-2025"
publishedDate: "2025-01-30"
conference: ICLR 2025
categories:
  - Model Compression
  - Large Language Models
  - Pruning
  - Transformers
authors:
  - name: "Ayan Sengupta"
    affiliation: "IIT Delhi, India"
  - name: "Siddhant Chaudhary"
    affiliation: "IIT Delhi, India"
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
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

## Introduction

LLMs are huge, and not in the fun way. Models like LLaMA-2-7B, OPT-6.7B, or larger GPT-style systems eat hundreds of gigabytes of memory and demand beefy GPUs even just for inference. Two main compression tools exist:

- **Quantization**: reduce precision of weights.
- **Pruning**: remove parameters / structures entirely.

Most recent **structured pruning** methods (SliceGPT, SVD-LLM, LaCo, etc.) have two big headaches:

1. They **depend on calibration datasets** to decide what to prune. Change sparsity → re-run calibration.
2. They often **hurt downstream performance badly** at high compression ratios, especially without recovery finetuning.

This paper proposes **PruneNet**, which flips the usual story:

> Treat pruning as **policy learning** over the model’s own weights, with **no calibration data**, and use spectral structure as the “don’t break this” constraint.

PruneNet:

- Learns a **stochastic pruning policy** that picks which FFN dimensions to keep,
- Uses **only intrinsic properties** of weights (no extra data),
- Minimizes **spectral distribution shift** between original and compressed matrices,
- Decouples the compression logic from the LLM so the same policy can be reused at multiple compression ratios.

On LLaMA-2-7B, PruneNet compresses the model in ~15 minutes, preserving **~89% zero-shot performance at 20–30% compression**, and beats SliceGPT on both accuracy and FLOPs / throughput.

## Key Ideas

1. **Pruning as Policy Learning (Calibration-Free)**  
   - Instead of scoring parameters with a data-driven heuristic, PruneNet trains a **policy network** that outputs importance scores for FFN rows.
   - The policy uses only **weights** (no activations, no external dataset), making it **calibration-free** and reusable.

2. **Spectral-Structure Preservation via KS Distance**  
   - The paper observes that standard slicing (dropping rows/columns) shrinks the **spectrum** (singular values) and makes it more right-skewed, especially at deeper layers.
   - PruneNet penalizes the **Kolmogorov–Smirnov (KS) distance** between the singular value distributions of original vs compressed matrices, keeping the compressed model’s spectral “shape” close to the original.

3. **Selective Structured Pruning of FFN Layers**  
   - Only **FFN layers** are pruned, not attention:
     - In LLaMA-2-7B, FFNs are ~64% of parameters and 100% dense.
     - Attention blocks are already more structured and less dense per weight.
   - PruneNet prunes **rows of FFN1** and the corresponding **columns of FFN2** (and biases) to maintain consistent hidden dimension shrinkage.

4. **Decoupled Compression Model (You Only Prune Once)**  
   - The policy learner is a separate MLP (~0.67% of LLaMA-2-7B params).
   - Once trained, the **same policy** can be used:
     - Across **different compression ratios** for the same model,
     - With only mild performance loss if reused instead of retrained.

5. **RL-Based Optimization over Layers**  
   - Each FFN layer weight matrix is treated as a “state”; the sampled subset of rows is the “action”.
   - A **discounted future penalty** encourages preserving later layers, which hold more semantic info.
   - Policy is trained via **REINFORCE** to minimize KS distance across all layers.


### What Gets Pruned?

PruneNet only prunes **FFN layers**, not attention:

- In LLaMA-2-7B:
  - FFNs ≈ 64% of parameters, fully dense.
  - Attention ≈ 32%, but more structured/specialized.
- FFNs also carry the bulk of nonlinearity and computational cost.

This gives high **effective sparsity** with clear FLOPs reductions, while keeping the attention machinery intact.

## Results

### LLaMA-2-7B: Better Accuracy–Sparsity Tradeoff

Zero-shot commonsense reasoning (PIQA, WinoGrande, HellaSwag, ARC-e, ARC-c):

- **Dense baseline**: average ≈ 69.0.
- At **20% compression**:
  - **SliceGPT**: ~58.2 (≈84% retention).
  - **PruneNet**: ~61.7 (≈89% retention).
- At **25% compression**:
  - SliceGPT: ~55.5,
  - PruneNet: ~58.6.
- At **30% compression**:
  - SliceGPT: ~51.5 (≈75% retention),
  - PruneNet: ~55.5 (≈80% retention).

So PruneNet consistently keeps **3–4 points more accuracy** than SliceGPT at comparable nominal sparsities and has **higher effective sparsity** (because SliceGPT reintroduces parameters through intrinsic transformations).

On a second suite of tasks (multi-task language understanding, including MMLU), PruneNet-compressed models remain **remarkably stable** across compression ratios, sometimes even beating the dense model on formal logic / global facts.

### Phi-2 and OPT Models: Robust Across Sizes

For **Phi-2**:

- Dense average ≈ 72.24.
- At **30% compression**:
  - SliceGPT: ≈ 51.99 (≈72% retention),
  - PruneNet: ≈ 61.05 (≈84% retention).

Similar trends hold for **OPT-125M, OPT-2.7B, OPT-6.7B**: PruneNet’s performance drop is consistently smaller and less volatile with sparsity (lower standard deviation across ratios).

### Recovery Finetuning (RFT): Almost Optional

They test **LoRA-based recovery finetuning** on WikiText2:

- For LLaMA-2-7B, RFT improves zero-shot by only **~1.5% on average**.
- For Phi-2, RFT sometimes **hurts** performance.

So PruneNet’s compression is already “alignment-friendly”: weights remain close enough that post-compression tuning buys relatively little.

They also check **which RFT dataset matters**:

- RFT on Alpaca, PTB, WikiText2 all give very similar improvements (std dev ≈1 point).
- That’s more evidence that **PruneNet preserves key information intrinsically**, reducing dependence on any fancy recovery data.

### Policy Reuse Across Compression Ratios

Can you **“you only prune once”** and reuse the policy?

- Train policy at **40% compression**, then reuse at **10% / 20% / 30%**:
  - Performance drops by **< 1%** compared to a freshly trained policy at each ratio.
- Train at **10%**, reuse for **20% / 30% / 40%**:
  - Average drop ≈ 0.96%, still **~3% better than SliceGPT** at the same sparsity.

So even if you don’t retrain the policy for a new target sparsity, you’re still in good shape.

### Varying Compression Per Layer

They try **heterogeneous sparsity across layers**, e.g. compress layers with ratios in $[0, 40\%]$, average ≈ 20%:

- For **Phi-2**, average drop vs uniform 20% is just **0.24 points**.
- For **LLaMA-2-7B**, drop is ≈ 2.15 points—visible but still acceptable.

This hints that per-layer structured sparsity profiles are possible without catastrophic degradation.

### Comparison to Other Structured Pruning Methods

On LLaMA-2-7B (30% compression, no RFT):

- **Dense**: 74.58 (avg over PIQA, HellaSwag).
- **ShortGPT**: 59.72  
- **LaCo**: 62.74  
- **SliceGPT**: 58.24  
- **LLM-Pruner**: 63.84  
- **PruneNet**: **64.70**  

On LLaMA-1-7B (20–30% compression), PruneNet outperforms:

- SliceGPT,
- LLM-Pruner,
- SVD-LLM,
- ASVD,

by **4–10 points** on average, especially at high compression.

SVD-based methods also aim for spectral preservation, but they do it via **output-level reconstruction using calibration data**, whereas PruneNet regularizes the **weight spectra directly** and avoids data dependency.

### Efficiency and Runtime

Compression runtime and throughput:

- **Compression time** LLaMA-2-7B @ 30%:
  - PruneNet: ~916 s (~15 min),
  - SliceGPT: ~29 min (reported).
- **Throughput** (tokens/sec), LLaMA-2-7B @ 30%:
  - Dense: 11.96
  - SliceGPT: 12.82 (+7% vs dense)
  - PruneNet: **20.74** (~+73% vs dense)
- **Throughput**, Phi-2 @ 30%:
  - Dense: 20.20
  - SliceGPT: 18.48 (worse than dense)
  - PruneNet: **29.50** (~+46% vs dense)

So pruning with PruneNet actually makes inference meaningfully faster, not just “technically smaller.”

### Does Sparsity Help Later Fine-Tuning?

Looking at training and validation loss curves during RFT:

- Highly compressed models start with higher loss (as expected),
- But they **converge faster** and generalize well once trained for a small number of steps (~50 iterations).

Interpretation: pruning removes redundant / low-importance features, making subsequent fine-tuning **more focused and efficient**.

## Conclusion

PruneNet is essentially:

> **“Pruning as a reusable, calibration-free policy that preserves spectral structure.”**

Concretely, it:

- Provides a **calibration-free structured pruning** scheme driven purely by intrinsic model weights,
- Uses **KS-distance on singular values** to tightly control information loss,
- Achieves strong **accuracy–sparsity–speed trade-offs** across multiple LLM families,
- Makes **recovery finetuning almost optional**, with minimal dependence on data choice or size,
- Offers **policy reuse** across compression ratios and per-layer sparsity, staying robust.

Methodologically, it shifts LLM pruning toward:

- **Policy learning + spectral constraints**, rather than dataset-dependent heuristics,
- **Decoupled compression modules** you can train once and reuse,
- A path to combining with **quantization and activation sparsity** for even more aggressive yet controlled compression.

If you want LLaMA-sized models that actually behave like deployable systems instead of academic fire-breathing dragons, PruneNet is a pretty sane step in that direction.

---
title: "Enough of Scaling LLMs! Let’s Focus on Downscaling"
slug: "downscaling-laws-for-llms-icml-2025"
conference: ICML 2025
year: 2025
publishedDate: "2025-01-17"
categories:
  - Scaling Laws
  - Downscaling
  - Model Efficiency
  - Sustainability
  - Large Language Models
  - Efficient Architectures
authors:
  - name: "Ayan Sengupta"
    affiliation: "IIT Delhi, India"
  - name: "Yash Goel"
    affiliation: "IIT Delhi, India"
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
links:
  openreview: "https://openreview.net/forum?id=CYJlJgEzZs"
  video: "https://icml.cc/virtual/2025/poster/40165"
  code: "https://github.com/LCS2-IIITD/Downscaling"
  slides: "https://icml.cc/media/icml-2025/Slides/40165.pdf"
  poster: "https://icml.cc/media/PosterPDFs/ICML%202025/40165.png?t=1749924472.0240057"
  arxiv: "https://arxiv.org/abs/2505.00985"
  alphaxiv: "https://www.alphaxiv.org/abs/2505.00985v3"

bibtex: |
  @article{sengupta2025downscaling,
    title={Enough of Scaling LLMs! Let's Focus on Downscaling},
    author={Sengupta, Ayan and Goel, Yash and Chakraborty, Tanmoy},
    journal={arXiv preprint arXiv:2505.00985},
    year={2025}
  }

abstract: >
  This position paper argues that the current obsession with neural scaling laws and ever-larger LLMs is
  unsustainable and increasingly inefficient. The authors advocate for a systematic theory of
  *downscaling laws*—principled ways to shrink models, data, and compute while retaining performance.
  They connect classical scaling laws, carbon footprint models, pruning laws, domain-continual pretraining,
  and ensemble scaling, and propose a concrete pipeline where a large model is decomposed into specialized
  small language models whose ensemble can outperform the original model at comparable compute.
---

![Teaser Image](/resources/downscaling-laws-for-llms-icml-2025/Downscaling_header.png)

*Figure: Performance improves slowly with model size, while carbon emissions rise steeply. The aim of downscaling laws is to find a sweet spot where small models deliver big impact without big emissions. <small>Image generated with Gemini AI.</small>*

### TL;DR

Bigger isn’t always better. Neural scaling laws say “more parameters, more data, more compute,” but the returns are flattening and the carbon bill is skyrocketing. This position paper argues for **downscaling laws**—principles that tell us how to shrink models, datasets and compute while keeping the performance that matters. It proposes a pipeline combining pruning, data selection and ensembling to build small, specialized models that can outperform a single giant model under the same compute budget.

### Why this research?

Neural scaling laws have offered a convenient roadmap: increase model size and data, and test loss falls along a power law. But this strategy has major flaws:

- **Diminishing returns:** Beyond a certain point, doubling parameters or tokens yields tiny gains.
- **Uneven degradation:** When large models are pruned or downsized, some abilities (e.g. fact recall) degrade quickly while others (in‑context learning) remain robust.
- **Data & societal limits:** Quality data is scarce; blindly scaling on low‑quality text risks bias and poor transfer.
- **Environmental impact:** Training enormous models consumes vast energy and emits large amounts of CO₂, yet scaling laws treat “compute” as a single scalar.

To address these challenges, the authors advocate a **shift from scaling to downscaling**—developing principles for building **Small Language Models (SLMs)** that are efficient, specialized and sustainable.

### A telling equation

The paper introduces a simple carbon scaling proposition: the total carbon footprint of training a language model grows **linearly** with both the number of parameters \(N\) and training tokens \(D\): $\text{CO₂}_\text{eq}(N, D) \approx (K_1 + K_2) \, N \, D.$

Combining this with a Kaplan‑style loss scaling \(L \propto N^{-0.08}\) and a linear mapping from test loss \(L\) to downstream performance \(P\), one arrives at $P \propto \text{CO₂}_\text{eq}^{\,0.08}.$

In other words, a 10 % improvement in performance could require **hundreds of percent more carbon emissions**. This shallow power law underscores why simply scaling up is unsustainable and why finding ways to scale **down** is so pressing.

### Main insights

- **Scaling laws are useful but incomplete:** They ignore diminishing returns, heterogeneous skill degradation, data quality limits and environmental costs.
- **Carbon cost vs. performance:** Loss decreases roughly logarithmically with model size, but carbon emissions increase linearly with size and token count. Performance grows only as the 0.08‑power of carbon cost.
- **Rise of SLMs:** Models with 100 M–5 B parameters (TinyLlama, Mistral‑7B, Phi‑4, Qwen‑2.5, etc.) are proliferating, running on consumer hardware and matching or beating older larger models when trained with high‑quality, curated data.
- **Ingredients for downscaling laws:** Data pruning and domain alignment, post‑pruning loss laws (e.g., P²), domain‑continual pre‑training (D‑CPT), and deep ensemble scaling laws all provide building blocks for predicting how small models will perform.
- **Downscaling pipeline:** Start with a large model and dataset; use active learning to prune data and model weights; fine‑tune the pruned models on domain‑specific corpora; and ensemble the specialized small models via routing, cascades or voting to achieve better performance under fixed compute/carbon budgets.
- **Ensemble advantage:** Splitting compute across several pruned models and combining their predictions can outperform one large model (“memory split advantage”), especially when diversity and specialization are leveraged.

### Results-style summary

| Aspect | Key takeaway |
|---|---|
| **Scaling vs. carbon cost** | Test loss falls slowly as models grow, while carbon emissions rise linearly with parameters and tokens. |
| **Performance vs. carbon** | Downstream performance scales as a very shallow power of carbon cost (≈0.08); modest gains require huge emissions. |
| **SLM trend** | Number of small models (100 M–5 B params) has exploded, with many matching larger predecessors when trained on curated data. |
| **Downscaling proposition** | Ensembles of pruned 1 B‑parameter models can, in theory, match or beat an 8 B‑parameter model at comparable compute. |
| **Pipeline impact** | Combining data pruning, model pruning, domain‑continual pre‑training and ensembling offers a practical roadmap for efficient, specialized LLMs. |

### Keywords

| Term | Description |
|---|---|
| **Downscaling Law** | A principle predicting how performance changes when models, data and compute are reduced. |
| **SLM** | Small Language Model (≈100 M–5 B parameters) designed for efficiency and specialized tasks. |
| **Carbon Scaling** | Relationship between model size, dataset size and carbon footprint; carbon grows linearly with \(N\) and \(D\). |
| **P² Law** | A formula predicting post‑training loss after pruning, factoring in pruning rate and retraining budget. |
| **Ensemble Scaling** | Observation that multiple small models can outperform one large model when combined effectively. |

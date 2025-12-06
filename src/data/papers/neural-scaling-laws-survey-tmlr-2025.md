---
title: "How to Upscale Neural Networks with Scaling Law? A Survey and Practical Guidelines"
slug: "neural-scaling-laws-survey-tmlr-2025"
conference: "TMLR 2025"
year: 2025
publishedDate: "2025-05-27"
categories:
  - Scaling Laws
  - Neural Networks
  - Large Language Models
  - Efficient Architectures
  - Model Efficiency
  - Survey
authors:
  - name: "Ayan Sengupta"
    affiliation: "IIT Delhi, India"
  - name: "Yash Goel"
    affiliation: "IIT Delhi, India"
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
links:
  arxiv: "https://arxiv.org/abs/2502.12051"
  openreview: "https://openreview.net/forum?id=AL7N0UOfgI"
  alphaxiv: "https://alphaxiv.org/abs/2502.12051"

bibtex: | 
    @misc{sengupta2025upscaleneuralnetworksscaling,
      title={How to Upscale Neural Networks with Scaling Law? A Survey and Practical Guidelines}, 
      author={Ayan Sengupta and Yash Goel and Tanmoy Chakraborty},
      year={2025},
      eprint={2502.12051},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2502.12051}, 
    }

abstract: >
  Neural scaling laws have revolutionized the design and optimization of large-scale AI models by
  revealing predictable relationships between model size, dataset volume, and computational resources.
  Early research established power-law relationships in model performance, leading to compute-optimal
  scaling strategies. However, recent studies highlighted their limitations across architectures,
  modalities, and deployment contexts. Sparse models, mixture-of-experts, retrieval-augmented learning,
  and multimodal models often deviate from traditional scaling patterns. Moreover, scaling behaviors vary
  across domains such as vision, reinforcement learning, and fine-tuning, underscoring the need for more
  nuanced approaches. In this survey, we synthesize insights from over 50 studies, examining the theoretical
  foundations, empirical findings, and practical implications of scaling laws. We also explore key challenges,
  including data efficiency, inference scaling, and architecture-specific constraints, advocating for adaptive
  scaling strategies tailored to real-world applications. We suggest that while scaling laws provide a useful
  guide, they do not always generalize across all architectures and training strategies.
---

## Neural Scaling Laws: A Survey of What Grows, What Breaks, and What Still Doesn’t Add Up

### TL;DR

Neural scaling laws promised a simple recipe: more parameters, more data, more compute → better performance. This survey reads the fine print: when those laws hold, when they break, and how they should evolve to guide **practical, efficient, and sustainable** AI instead of just ever-bigger models.

---

<center><img src="/resources/neural-scaling-laws-survey-tmlr-2025/image1.jpg" style="width:600px;"/></center>

---

### Why this research?

Over the last few years, dozens of papers have proposed scaling laws for language, vision, multimodal models, RL, GNNs, sparse MoEs, pruned networks, and more. But the landscape is fragmented:

- Different works use different functional forms, metrics, and fitting procedures.  
- Many results are hard to reproduce or extrapolate in real-world settings.  
- New architectures (MoE, RAG, sparse models) increasingly **violate** classical laws.

This survey pulls together **50+ papers** into a single taxonomy, asking:

- What do we actually know about how performance scales with model size, data, and compute?  
- Where do scaling laws generalize, and where do they fail?  
- How can we turn them from pretty curves into **actionable design tools** for training, inference, and compression?

<center><img src="/resources/neural-scaling-laws-survey-tmlr-2025/image2.png" style="width:800px;"/></center>

---

### Main insights

- **A unified taxonomy of scaling laws**  
  The survey organizes the literature along clear axes:  
  - *Model scaling* (parameters, depth, width),  
  - *Data scaling* (mixture ratios, domain shift, D-CPT),  
  - *Post-training scaling* (fine-tuning, transfer, PEFT),  
  - *Inference scaling* (test-time compute, sampling, routing),  
  - *Efficient scaling* (sparsity, MoEs, pruning, quantization),  
  - *Non-standard domains* (RL, GNNs, multimodal).

- **Power laws are common—but not universal**  
  Many works fit power-law forms like  $L(P_1,\dots,P_n) = \sum_i \alpha_i P_i^{-\beta_i}$,  but “broken” regimes, inflection points, and saturation frequently appear (e.g., Broken Neural Scaling Laws, double saturation in ViTs, competition barriers in multimodal models).

- **Scaling depends as much on *data strategy* as on size**  
  Data pruning, optimal mixture laws, and domain-continual pretraining (D-CPT) show that **how** you scale data matters more than **how much** you have. Carefully chosen subsets or mixtures can beat naive “more data” scaling.

- **Inference and post-training change the scaling story**  
  Test-time scaling (sampling, tree search, retrieval) and post-training strategies (fine-tuning, distillation, LoRA) introduce additional “axes of scale” often missing from classical laws. Small models with smart inference can rival larger models with naive decoding.

- **Efficient models need their own scaling laws**  
  Sparse models, MoEs, pruned networks, and quantized LLMs follow different regimes:  
  - Sparsity acts as a multiplicative efficiency factor.  
  - MoEs scale with both parameter count and expert expansion.  
  - Post-pruning loss laws (like P²) predict how much data you need to recover performance.  
  These are *not* just dense laws with a sparsity tag slapped on.

- **Critiques: reproducibility, fairness, and downscaling**  
  The survey highlights sharp criticisms:  
  - Lack of reproducibility (proprietary data, missing hyperparameters).  
  - Exponents that change wildly across setups, limiting extrapolation.  
  - Social and fairness concerns: scaling for “everyone at once” can hurt marginalized groups and underscores the need for **localized, smaller models** and **downscaling laws**.

- **Guidelines and future directions**  
  Instead of “just scale up,” the survey proposes:  
  - Multi-objective scaling (accuracy, compute, robustness, energy).  
  - Inference-aware and data-aware laws.  
  - Explicit scaling laws for **small** and **compressed** models.  
  - A shift from one-number test loss to **task- and community-specific** metrics.

<center><img src="/resources/neural-scaling-laws-survey-tmlr-2025/image3.png" style="width:800px;"/></center>

---

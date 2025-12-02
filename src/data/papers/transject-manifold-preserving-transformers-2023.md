---
title: "Manifold-Preserving Transformers are Effective for Short-Long Range Encoding"
slug: "transject-manifold-preserving-transformers-2023"
publishedDate: "2023-12-10"
conference: EMNLP 2023
categories:
  - Transformers
  - Deep Learning
  - NLP
  - Representation Learning
  - Efficient Inference
authors:
  - name: "Ayan Sengupta"
    affiliation: "IIT Delhi, India"
  - name: "Md. Shad Akhtar"
    affiliation: "IIIT Delhi, India"
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
abstract: "This work proposes TransJect, an encoder-only Transformer with enforced injectivity and Lipschitz continuity. By combining orthogonal attention, injective residual connections, and mixture-of-experts, TransJect preserves pairwise distances between token representations across layers, achieves lower entropy, and improves accuracy on both short- and long-sequence benchmarks while also reducing perplexity for language modeling."
citations: 1
doi: "10.18653/v1/2023.findings-emnlp.228"
links:
  arxiv: "https://arxiv.org/abs/2310.14206"
  pdf: "https://aclanthology.org/2023.findings-emnlp.228.pdf"
  code: "https://github.com/victor7246/TransJect"
  alphaxiv: "https://alphaxiv.org/abs/2310.14206"
  openreview: "https://openreview.net/forum?id=oYRlrDN6uj"
bibtex: |
  @inproceedings{sengupta2023manifold,
    title={Manifold-Preserving Transformers are Effective for Short-Long Range Encoding},
    author={Sengupta, Ayan and Akhtar, Md and Chakraborty, Tanmoy},
    booktitle={Findings of the Association for Computational Linguistics: EMNLP 2023},
    pages={3533--3549},
    year={2023}
  }

---

## Introduction

Transformer encoders excel at modeling short- and long-range dependencies but struggle to **preserve the geometry of token representations across layers**. Standard self-attention tends to project tokens onto sparse manifolds, increasing distances between semantically related tokens and inflating representational entropy.

This paper introduces **TransJect**, a manifold-preserving Transformer encoder that:
- Enforces **injectivity** (different tokens remain distinct at every layer),
- Maintains a **theoretical bound on pairwise distance distortion**, and
- Supports **scalable deep architectures** with better information propagation.

The goal is to make deep Transformers more stable, reversible in a controlled sense, and efficient for long-range encoding.


## Key Innovations

1. **Manifold-Preserving Orthogonal Attention**  
   - Uses orthogonal projections and shared eigenvalues to keep the **relative geometry of tokens stable across layers**.

2. **Injective, Reversible-Like Encoder**  
   - Provides formal guarantees that **distinct inputs never collide** in representation space, a step toward reversible deep NLP models.

3. **Entropy–Sparsity Connection**

   - Empirically links **lower activation bounds** to **lower representational entropy**, drawing an analogy to thermodynamic reversibility in physical systems.

4. **Mixture-of-Experts with Orderly Sparsity**

   - Experts show **balanced utilization and lower entropy** than standard multi-head attention, suggesting more structured specialization.

5. **Theoretically-Grounded Deep Scaling**

   - By controlling Lipschitz constants and injectivity, TransJect supports **very deep encoders** without the usual degradation in information flow.

## Results

Experiments cover:

- **Short-sequence classification** (IMDb, AGNews)
- **Long Range Arena (LRA)** tasks (ListOps, CharIMDb, AAN retrieval, Pathfinder, CIFAR-10)
- **Language modeling** on **Penn Treebank (PTB)**

Key findings:

- **Short sequences**:  
  - On IMDb, TransJect improves accuracy by up to **6.8 percentage points** over a vanilla Transformer baseline.  
  - On AGNews, a random-eigenvalue variant (Random-TransJect) slightly surpasses TransJect, indicating that injected randomness can help in limited-context settings.

- **Long sequences (LRA)**:  
  - TransJect achieves **state-of-the-art or competitive performance** across several tasks, outperforming strong baselines like BigBird, Linformer, Performer, and Skyformer on multiple benchmarks.
  - Particularly strong on **hierarchical (ListOps)** and **spatial (Pathfinder)** tasks, showing robustness in both temporal and spatial long-range dependencies.

- **Language modeling (PTB)**:  
  - TransJect reports about **79% lower test perplexity** than a vanilla Transformer.  
  - Even compared to ReZero-augmented Transformers (which already improve signal propagation), TransJect achieves further gains.

- **Activation bound & entropy analysis**:  
  - TransJect has an empirical **activation factor ≈ 1** across layers, versus much larger factors for standard Transformers.  
  - **Entropy remains low and stable** across depth, unlike vanilla Transformers where entropy increases with depth, signaling more random, irreversible behavior.

- **Efficiency**:  
  - Despite having more parameters in some configurations, TransJect achieves up to **13×–26× test-time speedups** on long-sequence character-level tasks, thanks to its **linear attention complexity in sequence length**.

## Conclusion

TransJect shows that **enforcing geometric structure and injectivity in Transformer encoders** is not just a mathematical flex; it yields tangible benefits:

- Better **distance preservation** and **context propagation** across layers,
- More **ordered, low-entropy representations**,
- Strong gains on both **short- and long-range sequence tasks**, and
- Significant **efficiency improvements** for long sequences.

The work suggests a design philosophy where deep NLP models are built not only to be expressive, but also **manifold-aware, Lipschitz-controlled, and thermodynamically sane**, opening doors to deeper, more reversible, and more interpretable architectures.

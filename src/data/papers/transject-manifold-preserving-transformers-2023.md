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
  - Efficient Architectures
authors:
  - name: "Ayan Sengupta"
    affiliation: "IIT Delhi, India"
    email: ayan.sengupta@ee.iitd.ac.in
  - name: "Md. Shad Akhtar"
    affiliation: "IIIT Delhi, India"
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
    email: tanchak@iitd.ac.in
abstract: "This work proposes TransJect, an encoder-only Transformer with enforced injectivity and Lipschitz continuity. By combining orthogonal attention, injective residual connections, and mixture-of-experts, TransJect preserves pairwise distances between token representations across layers, achieves lower entropy, and improves accuracy on both short- and long-sequence benchmarks while also reducing perplexity for language modeling."

doi: "10.18653/v1/2023.findings-emnlp.228"
links:
  arxiv: "https://arxiv.org/abs/2310.14206"
  pdf: "https://aclanthology.org/2023.findings-emnlp.228.pdf"
  code: "https://github.com/parmanu-lcs2/TransJect"
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

![Teaser Image](/resources/transject-manifold-preserving-transformers-2023/Transject_Header.png) 

*Figure: Diagram of TransJect’s manifold‑preserving encoder. Orthogonal attention and injective residuals keep token geometries intact, enabling deeper, more efficient models.  <small>Image generated with Gemini AI.</small>*

### TL;DR

Deep transformers often warp the “shape” of your data: semantically similar tokens drift apart as layers stack up. **TransJect** reimagines the encoder with orthogonal attention and injective connections to keep representations geometrically faithful while still scaling deep. The result? Stronger performance on both short and long sequences, plus faster inference.

### Why this research?

Standard transformer encoders are brilliant at capturing both local and global dependencies, yet they have a blind spot: as layers deepen, **token representations get stretched and scrambled**. Self‑attention projects embeddings onto sparse manifolds, inflating distances between related tokens and increasing representational entropy. This makes it hard to build very deep or reversible models and leads to unstable information flow.

**TransJect** tackles this by imposing mathematical structure on the encoder. It combines **orthogonal attention** with an **injective residual connection** to ensure that different tokens remain distinct and that pairwise distances change only within a provable bound. By controlling Lipschitz constants, TransJect supports much deeper architectures without the usual information degradation.

### Main insights

* **Geometry matters:** Orthogonal projections and shared eigenvalues keep the relative geometry of tokens stable across layers.
* **Injectivity & reversibility:** The encoder guarantees that distinct inputs never collide in representation space, moving toward reversible NLP models.
* **Entropy–sparsity connection:** Lower activation bounds correlate with lower representational entropy, analogous to thermodynamic reversibility.
* **Orderly sparsity:** A mixture‑of‑experts design encourages balanced specialization and lower entropy compared to standard multi‑head attention.
* **Deep scaling without collapse:** Controlling Lipschitz constants allows very deep encoders to maintain information flow.

### Results at a glance

| Task/Domain | Improvement |
|---|---|
| **IMDb (short sequences)** | Up to **+6.8 pp accuracy** over vanilla Transformer |
| **AGNews** | Random‑TransJect variant slightly surpasses TransJect |
| **Long Range Arena (LRA)** | Competitive or SOTA versus BigBird, Linformer, Performer, Skyformer |
| **Penn Treebank (PTB)** | ~**79% lower test perplexity** than vanilla Transformer |
| **Efficiency** | **13×–26× faster** on long character sequences due to linear attention |

Beyond numbers, TransJect maintains an activation factor around **1** across layers, whereas standard transformers exhibit growing activation factors and entropy. This indicates stable, low‑entropy representations through depth.

### Keywords

| Term | Description |
|---|---|
| **TransJect** | A manifold‑preserving transformer encoder with orthogonal attention and injective residuals |
| **Injectivity** | Ensuring distinct tokens remain distinct across all layers |
| **Orthogonal Attention** | Using orthogonal projections to preserve pairwise distances |
| **Entropy–Sparsity** | Empirical link between bounded activations and low representational entropy |
| **Deep Scaling** | Controlling Lipschitz constants to enable deeper, reversible models |

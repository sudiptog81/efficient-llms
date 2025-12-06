---
title: "Value-Guided KV Compression for LLMs via Approximated CUR Decomposition"
slug: "curdkv-kv-compression-neurips-2025"
conference: NeurIPS 2025
year: 2025
publishedDate: "2025-09-18"
categories:
  - KV Cache Compression
  - Long-Context Inference
  - Model Efficiency
  - Model Compression
  - Large Language Models
  - Attention Mechanisms
authors:
  - name: "Ayan Sengupta"
    affiliation: "IIT Delhi, India"
  - name: "Siddhant Chaudhary"
    affiliation: "IIT Delhi, India"
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
links:
  openreview: "https://openreview.net/forum?id=klmc4fwPLd"
  paper: "https://openreview.net/pdf?id=klmc4fwPLd"
  arxiv: "https://arxiv.org/abs/2509.15038"
  video: "https://neurips.cc/virtual/2025/loc/san-diego/poster/116352"
  slides: "https://neurips.cc/media/neurips-2025/Slides/116352.pdf"
  poster: "https://neurips.cc/media/PosterPDFs/NeurIPS%202025/116352.png?t=1762272357.6524627"
  code: "https://github.com/codetalker7/kvpress/tree/curpress"

doi: "https://doi.org/10.48550/arXiv.2509.15038"
bibtex: |
  @article{sengupta2025value,
    title={Value-Guided KV Compression for LLMs via Approximated CUR Decomposition},
    author={Sengupta, Ayan and Chaudhary, Siddhant and Chakraborty, Tanmoy},
    journal={arXiv preprint arXiv:2509.15038},
    year={2025}
  }

abstract: >
  CurDKV is a value-guided KV cache compression method for autoregressive LLMs based on
  approximated CUR decomposition and leverage scores. Instead of ranking tokens purely by
  attention scores, CurDKV computes importance from both keys and values to better preserve
  the attention output softmax(QKᵀ)V, directly targeting eviction loss. Using fast Gaussian
  random projections to approximate leverage scores, CurDKV remains compatible with
  FlashAttention and Grouped Query Attention (GQA). On LongBench and Ruler, it achieves
  up to 9.6% higher accuracy than SnapKV/ChunkKV under aggressive compression ratios
  (e.g., 90% cache reduction), while reducing generation latency by up to 40% at high
  compression, offering a practical speed–accuracy tradeoff.
---

### TL;DR

Long-context LLMs drown in KV cache memory, and most existing compression schemes look only at **attention on keys**, not what actually flows through the network.  CurDKV flips the perspective: it uses **value-guided CUR-style leverage scores** to keep the tokens that matter most for the *output* of attention, delivering aggressive KV compression with far less degradation on long-context tasks.

## Why this research?

As context windows stretch to hundreds of thousands or millions of tokens, **KV cache dominates GPU memory and latency**. Popular methods like SnapKV and ChunkKV decide which tokens to drop purely from **query–key attention patterns**, implicitly assuming “low attention = expendable.”

This paper shows that assumption is shaky:

- The actual attention output is `softmax(QKᵀ) V`, so **values (V)**, not keys, directly shape what is propagated.  
- **Eviction loss** (error after removing tokens) is only weakly correlated with average attention.  
- Tokens with modest attention can still have **high-value leverage** and be critical for downstream behavior.

CurDKV is motivated by a simple question:  
> If we want to preserve what the model *really computes*, shouldn’t we compress around **V** and the attention output, not just key scores?

## Main insights

- **Theory: preserving V, not just attention scores, is what matters**

  The paper proves that when you drop KV entries by zeroing rows:

  $\big\|\text{softmax}(QK^\top)V - \text{softmax}(QK'^\top)V'\big\|_F
  \;\lesssim\;
  \sqrt{n}\,\|V - V'\|_F + \sqrt{n}\,\|V'\|_F.$

  At high compression, $\|V'\|_F$ is small, so the dominant term is **how well $V'$ approximates $V$**.  
  In other words, you can’t preserve attention output by staring at keys alone; **value reconstruction quality is the real bottleneck.**

---

- **CurDKV: approximate CUR-guided token selection over keys *and* values**

  CurDKV adapts ideas from **CUR decomposition**:

  - It uses **Gaussian random projections** to build low-dimensional sketches $\tilde{K}, \tilde{V}$.  
  - Each token gets key and value leverage proxies via squared row norms:  
    $\ell^{(K)}_j = \|\tilde{K}[j]\|^2,\; \ell^{(V)}_j = \|\tilde{V}[j]\|^2.$
  - These are combined into a **KV leverage score**  
    $\ell^{(KV)}_j = \ell^{(K)}_j \cdot \ell^{(V)}_j,$  
    normalized to form a distribution over tokens.
  - Tokens with high KV leverage are the ones that best preserve the **dominant subspace** of the attention output.

  Practically, this design:

  - Works with **GQA** (grouped-query attention),  
  - Avoids ever forming full attention matrices, so it stays **FlashAttention-compatible**,  
  - Requires only small projection dims (e.g., $r \approx 20$), making it efficient.

---

- **Robust long-context compression on LongBench and Ruler**

  On **LongBench** (QA, summarization, few-shot, synthetic reasoning, code) for LLaMA-3.1-8B and Mistral-7B:

  - At **30% compression**, CurDKV improves over attention-only methods like SnapKV by **~3–4 points** on average, often matching full-cache behavior on QA and summarization tasks.  
  - Even at **90% compression**, CurDKV maintains **noticeably higher scores** than SnapKV and norm-based baselines, which degrade sharply.

  On **Ruler** (needle-in-a-haystack):

  - With 30% compression, CurDKV and its adaptive variant **AdaCurDKV** retain **near-perfect retrieval** on many NIAH tasks where K-norm and streaming baselines collapse.  
  - Under 90% compression, they still outperform other methods on the hardest retrieval subtasks, showing that **value-guided leverage is better at preserving rare, important tokens.**

---

- **Adaptive AdaCurDKV: moving budgets to the heads that matter**

  Building on CurDKV, **AdaCurDKV**:

  - Aggregates leverage mass across heads/groups,  
  - Allocates more token budget to heads with **higher total KV leverage**,  
  - Enforces a minimum fraction of tokens per head to avoid collapse.

  This adaptive head-wise budgeting:

  - Gives **the best or near-best averages** on many LongBench settings,  
  - Offers a more flexible trade-off between compression and fidelity than fixed per-head quotas.

---

- **Real deployment benefits: less memory, slightly slower prefill, faster generation**

  On LLaMA-8B with contexts up to 128K tokens:

  - KV memory shrinks almost **linearly** with compression (e.g., from ~15.6 GB to <3 GB at high compression).  
  - Prefill time increases moderately due to projection + top-k steps, but saturates beyond mid compression ratios.  
  - **Generation time drops significantly** because each autoregressive step attends over far fewer tokens—big wins for long-context chat and RAG-style workloads.

  Net effect: CurDKV is attractive when you’re willing to pay a small prefill overhead to unlock **large memory and latency savings** during generation.

![Teaser Image](/resources/curdkv-kv-compression-neurips-2025/teaser.png) 

*Figure: CurDKV achieves lowest post-eviction loss than contemporary KV compression methods, highlighting the importance of value-aware KV compression methods.*

## Example: Using CURPress with Llama-3.2-3B-Instruct

```python
from transformers import pipeline
from kvpress import CURPress

# Base model and device
device = "cuda:0"  # use "cpu" if you don't have a GPU
model = "meta-llama/Llama-3.2-3B-Instruct"


# KV-Press-aware pipeline
pipe = pipeline(
    "kv-press-text-generation",  # custom task provided by kvpress
    model=model,
    device=device,
    model_kwargs=model_kwargs,
)

# Long context you want to compress once
context = "A very long text you want to compress once and for all"

# Optional question/query over the compressed context
question = "\nA question about the compressed context"

# Configure CURPress
press = CURPress(
    compression_ratio=0.5,          # keep ~50% of KV cache
    leverage_type="kv_product",     # leverage scores from key–value product
    use_random_leverage=False,      # deterministic, policy-based selection
    use_local_approximation=True,   # local approximations for efficiency
    local_window_size=16,           # window size for local approximation
)

# Run compressed-context generation
result = pipe(
    context,
    question=question,
    press=press,  # pass the CURPress object into the pipeline
)

answer = result["answer"]
print(answer)

```

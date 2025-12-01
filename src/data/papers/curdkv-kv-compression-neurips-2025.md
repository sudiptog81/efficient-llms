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

## 1. Motivation: Why KV Compression Needs to Look at V

LLMs with long contexts are dominated by KV cache memory during inference. For an 8B model
with 2M tokens, KV alone can reach hundreds of GBs of GPU memory.

Most existing KV compression methods:

- Rank tokens using **attention scores** (query–key alignment).
- Evict low-attention tokens using top-k heuristics across heads/layers.
- Implicitly assume: “high attention ⇒ important; low attention ⇒ safely removable.”

The paper argues this is flawed because:

- The **actual output** of attention is $softmax(QKᵀ)V$, where **V (values)** directly control the
  propagated representation.
- Empirically, **eviction loss** (reconstruction error after deleting tokens) is **poorly correlated**
  with average attention scores.
- Tokens with modest attention can still carry semantically rich value vectors, and evicting them
  can severely hurt the model.

Hence the central idea:

> Instead of compressing based on attention scores over K, select tokens to preserve the
> dominant subspace of **softmax(QKᵀ)V** itself — via CUR decomposition and leverage scores.

---

## 2. Background: KV Cache, Eviction Loss & CUR Decomposition

### 2.1 KV Cache Setup

For a given layer and head:

- Hidden states: $X \in \mathbb{R}^{n \times d}$
- Projections:
  $$
  Q = X W_Q,\quad K = X W_K,\quad V = X W_V
  $$
- KV cache stores rows of $K, V$ for all past tokens; grows linearly with sequence length.

At a new step, the output is:

$$
\text{Attn}(Q, K, V) = \text{softmax}(QK^\top)\, V
$$

KV compression: zero out or drop a subset of rows of $K, V$ → $K', V'$.

The paper proves a bound:

**Lemma (informal).** Let $K', V'$ be obtained by zeroing a subset of rows in $K, V$. Then:

$$
\|\text{softmax}(QK^\top)V - \text{softmax}(QK'^\top)V'\|_F
\;\lesssim\;
\sqrt{n}\,\|V - V'\|_F + \sqrt{n}\,\|V'\|_F
$$

For high compression, $\|V'\|_F$ becomes small, so the main driver is how well $V'$ approximates $V$.

**Key takeaway:**  
To preserve the attention output, you must approximate **V** well; approximating attention scores alone is not enough.

### 2.2 CUR Decomposition & Leverage Scores

Given a matrix $A \in \mathbb{R}^{n \times d}$ with SVD $A = U \Sigma V^\*$:

- **CUR decomposition** approximates $A$ as:
  $$
  A \approx C U' R
  $$
  where:
  - $C$: subset of columns of $A$,
  - $R$: subset of rows of $A$,
  - $U'$: small linking matrix.

- **Leverage scores** use singular vectors to quantify row/column importance.

Row leverage scores:

$$
\ell_{r,j} = \|U_{(j,:)}\|^2
$$

Column leverage scores:

$$
\ell_{c,j} = \|V_{(j,:)}\|^2
$$

High leverage rows/columns are the ones you want to keep in CUR.

---

## 3. CurDKV: Value-Guided KV Compression via Approximate CUR

CurDKV (CUR Decomposition for KV compression) uses **leverage scores of both keys and values**
to decide which tokens to keep.

It is designed to:

- Work with **GQA** (grouped-query attention),
- Avoid needing explicit attention matrices (so it stays compatible with **FlashAttention**),
- Scale via **Gaussian random projections** instead of full SVD.

### 3.1 GQA Setup

Assume **g groups** of attention heads. For group $i$:

- $K_i \in \mathbb{R}^{n \times d}$, $V_i \in \mathbb{R}^{n \times d}$
- Combined tensors across groups:
  - $K \in \mathbb{R}^{g \times n \times d}$
  - $V \in \mathbb{R}^{g \times n \times d}$

Goal: For each group, select **k** out of **n** tokens (per layer) that best preserve the attention output.

### 3.2 Random Projection–Based Approximate Leverage Scores

Exact leverage scores need SVD, which is too expensive per layer/head.

CurDKV uses:

- Sample a Gaussian matrix $G \in \mathbb{R}^{d \times r}$, with $G_{ij} \sim \mathcal{N}(0, 1/r)$,  
  with a small projection dimension $r \approx 20$.

- Project:
  $$
  \tilde{K}_i = K_i G,\quad \tilde{V}_i = V_i G
  $$

- Use squared row norms of $\tilde{K}_i$ and $\tilde{V}_i$ as proxies for leverage scores:

  $$
  \ell^{(K)}_j = \|\tilde{K}_i[j]\|_2^2,\quad
  \ell^{(V)}_j = \|\tilde{V}_i[j]\|_2^2
  $$

- Combine into a **key–value leverage score** per token:

  $$
  \ell^{(KV)}_j = \ell^{(K)}_j \cdot \ell^{(V)}_j
  $$

- Normalize:
  $$
  \tilde{\ell}_j = \frac{\ell^{(KV)}_j}{\sum_{t} \ell^{(KV)}_t}
  $$

Intuition: A token is important if it is structurally important both in the key space and the value space.

### 3.3 Attention Sinks & Top-k Selection

To respect **attention sink tokens** (early positions that many models always attend to):

- Always preserve the first **s** tokens (e.g., $s = 4$):  
  $S_{\text{sink}} = \{0, 1, \dots, s - 1\}$.

- From the remaining positions, choose top-$(k - s)$ by $\tilde{\ell}_j$:

  - $Stop = TopK(tilde_ell[s:], k - s) + s$

- Final index set for group $i$:

  $$
  S_i = S_{\text{sink}} \cup S_{\text{top}}
  $$

- Compressed KV:

  $$
  K'_i = K_i[S_i],\quad V'_i = V_i[S_i]
  $$

Apply this per group and per layer.

### 3.4 AdaCurDKV: Adaptive Budget Across Heads

On top of CurDKV, the paper defines **AdaCurDKV**:

- Instead of allocating the same k per head/group, it:
  - Aggregates leverage score mass across heads,
  - Allocates more budget to heads with higher total leverage,
  - Uses a safeguard α (e.g., 0.2) to ensure each head keeps at least α·n tokens.

This mirrors prior adaptive methods (e.g., AdaKV) but uses **value-guided leverage** instead of
attention entropy/weights.

---

## 4. Experimental Setup

**Models:**

- LLaMA-3.1-8B-Instruct,
- Mistral-7B-Instruct-v0.3.

**Benchmarks:**

- **LongBench** (16 tasks):
  - Single-document QA,
  - Multi-document QA,
  - Summarization,
  - Few-shot learning,
  - Synthetic reasoning,
  - Code completion.
- **Ruler**:
  - 8 **Needle-in-a-haystack (NIAH)** tasks up to 16K context.

**Compression ratios** (eviction rates): 30%, 50%, 70%, 90%.

**Question-agnostic setting**:

- Compression is done **only on the context** during prefill.
- Questions are not known at compression time, making the problem harder and more realistic.

**Baselines:**

- **Non-adaptive**:
  - SnapKV,
  - ChunkKV,
  - Streaming LLM,
  - KNorm (key-norm heuristic).
- **Adaptive**:
  - AdaSnapKV (adaptive SnapKV),
  - AdaCurDKV (this paper).

H2O is excluded in long-context runs due to incompatibility with FlashAttention and large memory usage.

---

## 5. Results on LongBench

### 5.1 Full Cache Performance

With **0% compression**, LLaMA-8B and Mistral-7B reach:

- Average scores ≈ mid-40s on LongBench (e.g., LLaMA ~45.7, Mistral ~43.3),
- Strong baselines across QA, summarization, few-shot, and code tasks.

These are used as reference for normalized “fidelity.”

### 5.2 30% Compression (Moderate)

With **30% compression** (i.e., 70% cache retained):

- **CurDKV vs SnapKV** (LLaMA-8B):
  - Average: 48.9% vs 45.3% → **+3.6 points**.
- **CurDKV vs SnapKV** (Mistral-7B):
  - Average: 45.6% vs 42.7% → **+2.9 points**.

CurDKV consistently:

- Matches or beats the best attention-based baselines in:
  - Multi-hop QA (HotpotQA, 2WikiMQA, Musique),
  - Summarization (GovReport, QMSum, MultiNews),
  - Few-shot tasks and synthetic tasks (Pcount, Pre),
  - Code tasks (Lcc, RB-P).

**AdaCurDKV**:

- For LLaMA-8B:
  - Achieves the **highest average** (~49.1%),
  - Outperforms AdaSnapKV by ~3.6 points,
  - Slightly edges static CurDKV.
- For Mistral-7B:
  - Reaches ~45.2%, competitive with CurDKV (45.6%) and better than AdaSnapKV.

### 5.3 90% Compression (Aggressive)

With **90% compression** (keep only 10% of KV):

- **CurDKV vs SnapKV** (LLaMA-8B):
  - 35.7% vs 33.7% → +2.0 points.
- **CurDKV vs SnapKV** (Mistral-7B):
  - 33.2% vs 32.6–32.7% → small but consistent gains.

Norm-based baselines (KNorm, ChunkKV) often collapse more severely.

**AdaCurDKV**:

- LLaMA-8B:
  - ~35.1% average, slightly below CurDKV but above AdaSnapKV.
- Mistral-7B:
  - ~29.1% average, competitive and stable.

### 5.4 Ablations

Two key ablations:

1. **What matrix do we compute leverage on?**
   - Key-only, Value-only, or Key–Value product.
   - At **30% compression** → similar performance.
   - At **90% compression** → **value-centric and combined** variants are more robust than key-only.

2. **Random projections vs no projection:**
   - With projection: slightly better stability at high compression,
   - Overhead is modest; projection largely preserves relative scores.

---

## 6. Results on Ruler (Needle-in-a-Haystack)

Ruler’s NIAH tasks stress **retrieval of rare facts** in long noisy contexts.

### 6.1 Full Cache

With full KV:

- LLaMA-8B: ~99.6% average accuracy,
- Mistral-7B: ~92.8% average.

### 6.2 30% Compression

At 30% compression:

- **CurDKV**:
  - Average: 98.7% (LLaMA) / 77.8% (Mistral).
- **AdaCurDKV**:
  - Average: 97.7% (LLaMA) / 80.6% (Mistral).

Compare with:

- ChunkKV: 87.0% / 76.2%,
- Knorm: 71.8% / 14.3%,
- StreamingLLM: 68.2% / 63.6%,
- SnapKV: 80.4% / 37.4%.

Notable wins:

- For harder subtasks (MK-3, MQ):
  - AdaCurDKV reaches **>90%** or even ~100% on several settings,
  - Clearly better at retaining “needle” tokens.

### 6.3 90% Compression

At 90% compression:

- Norm & attention baselines degrade sharply (often <25% average).
- **CurDKV**:
  - 34.7% (LLaMA) / 7.8% (Mistral).
- **AdaCurDKV**:
  - 39.1% (LLaMA) / 3.9% (Mistral) — best overall average at 90% compression on LLaMA.

Some caveats:

- Mistral uses **sliding-window attention**, which weakens head specialization.
- In such architectures, naive locality-based heuristics (e.g., ChunkKV) can occasionally preserve NIAH tokens by luck.
- Even then, CurDKV remains stronger on the genuinely hard retrieval subtasks.

---

## 7. Computational Efficiency: Memory & Latency

The paper measures CurDKV’s practical impact on **KV size, prefill time, and generation time** for LLaMA-8B across sequences up to 128K tokens.

### 7.1 Memory

- KV memory drops **linearly** with compression:
  - At 80% compression, for 128K tokens:
    - From ~15.6 GB to <3 GB.
- This linear relation holds across all sequence lengths, thanks to per-token KV removal.

### 7.2 Prefill Latency

- CurDKV adds overhead during **prefill** due to:
  - Random projections,
  - Leverage score computation,
  - Top-k selection.

Observations:

- Prefill time increases modestly (e.g., from ~10s to ~14–15s for 128K tokens at high compression).
- Overhead plateaus beyond ~40–60% compression; additional compression does not increase cost much.

### 7.3 Generation Latency

- Generation gets **faster** with compression:
  - Fewer KV tokens → cheaper attention at each autoregressive step.
  - For 128K contexts, generation time drops from ~10s to <6s at 80% compression.
- Gains are strongest for long contexts, but visible at shorter contexts too.

Net effect: CurDKV trades a bit more prefill time for **substantial** memory savings and **reduced
generation latency**, which is attractive in deployment.

---

## 8. Limitations & Future Directions

The authors are fairly explicit about the limitations:

- **Static prefill compression**:
  - CurDKV compresses based on the context alone, before generation.
  - It does not adapt to changing query demands mid-generation.
- **Hyperparameters**:
  - Requires choosing projection dimension $r$, sink size $s$, group budgets, and α for AdaCurDKV.
  - Some tuning is needed per model/benchmark.
- **Architecture dependence**:
  - Behavior under sliding-window or unusual attention mechanisms (as in some Mistral variants) can be less predictable.
- **No learned components yet**:
  - CurDKV is entirely heuristic/analytic; no learned routing or token scoring networks.

Future work directions suggested:

- **Query-aware or dynamic compression** during generation.
- Hybrid **token–chunk strategies** for better locality and robustness.
- Incorporating light **learned modules** to refine leverage-based scores.
- Extending CUR-style compression to:
  - cross-attention,
  - multimodal transformers,
  - or other structured memory mechanisms.

---

## 9. Takeaways

Boiled down:

- Attention score–based KV compression is not enough: it ignores the **value vectors** that actually
  determine the output of attention.
- CurDKV uses **approximate CUR decomposition** via **Gaussian projections** and **combined
  key–value leverage scores** to pick which tokens to keep.
- It is:
  - **Value-centric**,
  - **FlashAttention-compatible** (doesn’t need explicit attention matrices),
  - **GQA-aware**,
  - And practically efficient.

On LongBench and Ruler:

- CurDKV and AdaCurDKV consistently outperform SnapKV, ChunkKV, and related methods,
  especially under **aggressive compression** (70–90% eviction).
- They deliver better **semantic fidelity**, **higher task accuracy**, and **faster generation**
  at long context lengths.

In short, if you care about long-context LLM inference on limited memory, CurDKV gives you a
principled, value-driven way to aggressively shrink the KV cache without throwing your model’s
brains out with the tokens.

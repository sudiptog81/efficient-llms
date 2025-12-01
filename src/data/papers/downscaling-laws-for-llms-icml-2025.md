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
  @article{sengupta2025upscale,
  title={How to Upscale Neural Networks with Scaling Law? A Survey and Practical Guidelines},
  author={Sengupta, Ayan and Goel, Yash and Chakraborty, Tanmoy},
  journal={arXiv preprint arXiv:2502.12051},
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

## 1. Motivation: From Scaling to Downscaling

Neural scaling laws gave the field a convenient story: more parameters, more data, more compute → better performance, often following power-law relationships. Work such as Kaplan et al. (2020) and Hoffmann et al. (2022) suggested predictable gains by pushing scale.

This paper pushes back on that narrative, arguing:

- Practical performance gains increasingly show **diminishing returns** with scale.
- A singular focus on scaling ignores **heterogeneous capability degradation** when models are pruned or downsized.
- The environmental and economic **carbon cost of scaling grows much faster** than performance.
- The ecosystem is already shifting: **small language models (SLMs)** are exploding in number and quality.

The authors argue that we should spend more effort understanding **how to go smaller well**—deriving *downscaling laws* that tell us how to:

- Reduce model size, data, and compute,
- Maintain task performance where it matters,
- And do so in a way that is sustainable and accessible.

## 2. Recap & Critique of Neural Scaling Laws

### 2.1 Classical Scaling Laws

Two key forms are recalled:

- **Kaplan-style law** (informal form):

  $$
  L(N, D) \approx \frac{N_c}{N^{\alpha_N}} + \frac{D_c}{D^{\alpha_D}}
  $$

  where:
  - $N$: number of parameters,
  - $D$: number of training tokens,
  - $\alpha_N, \alpha_D$: exponents (~0.08, –0.1),
  - $L$: test loss.

- **Chinchilla-style law**:

  $$
  L(N, D) \approx A N^{-\alpha} + B D^{-\beta} + E
  $$

  introducing an irreducible loss floor $E$, and emphasizing that **balanced scaling of model size and data** is optimal.

Beyond those, refinements like **Broken Neural Scaling Laws (BNSL)** address phenomena such as double descent and sharp capability transitions.

### 2.2 Criticisms

The paper highlights several issues:

- **Diminishing returns & resource allocation**  
  Empirically, gains from more data/parameters flatten out; past a point, extra compute delivers marginal benefit.

- **Non-uniform degradation of abilities**  
  Under pruning or downsizing, not all skills degrade equally:
  - Fact recall can collapse at moderate pruning rates.
  - In-context learning can remain robust under much more severe pruning.  
  This heterogeneity is not captured by simple power-law fits.

- **Data and societal constraints**  
  There are limits on high-quality human text, and not all text is equally useful. Simply counting tokens ignores:
  - Quality,
  - Diversity of communities and value systems,
  - Evaluation mismatches.

- **Environmental impact**  
  Scaling laws mostly ignore energy usage and carbon emissions, treating “compute” as an abstract scalar. In reality, power, location, hardware, and lifecycle all matter.

The conclusion: scaling laws are useful but incomplete. They are not a sustainable roadmap for progress.

## 3. Carbon Scaling: Performance vs Emissions

Using the LLMCarbon framework, the paper decomposes emissions into:

- **Operational emissions** (during training/inference):

  $$
  \text{CO2}^{\text{oper}} = \sum_i (P_i \cdot \text{eff}_i \cdot n_i \cdot t_i) \cdot \text{PUE} \cdot c_{\text{inten}}
  $$

- **Embodied emissions** (manufacturing hardware):

  $$
  \text{CO2}^{\text{emb}} = \sum_i \frac{\text{area}_i \cdot \text{CPA}_i}{\text{lifetime}_i}
  $$

Total:

$$
\text{CO2}^{\text{eq}} = \text{CO2}^{\text{oper}} + \text{CO2}^{\text{emb}}
$$

Under reasonable simplifications, the paper derives:

> **Proposition:**  
> Carbon cost scales approximately linearly with both the number of parameters $N$ and the number of training tokens $D$:

$$
\text{CO2}^{\text{eq}}(N, D) \approx (K_1 + K_2)\, N D
$$

Combining this with a Kaplan-like law $L \propto N^{-\alpha}$ and a linear mapping from loss to downstream performance $P = w_1 + w_2 L$, they derive a relationship:

$$
P \propto \text{CO2}^{\alpha}
$$

with $\alpha \approx 0.08$.

Interpretation:

- Performance grows like a **very shallow power** of carbon cost.
- To get a modest linear improvement in performance, you need **exponentially more emissions**.
- For example, achieving a 10% performance bump could require several times more carbon.

The headline: **test loss falls slowly, carbon rises linearly (or worse)**. Scaling is environmentally expensive.

## 4. Rise of Small & Efficient Language Models

Despite the scaling craze, the last few years have seen a boom in **SLMs (≈100M–5B parameters)**.

Key trends:

- **SLMs are increasingly competitive**  
  Models like TinyLlama, Mistral-7B, Phi-4, Qwen-2.5, etc., show that carefully trained small/medium models can rival or beat earlier large models on many benchmarks.

- **Deployment constraints dominate reality**  
  SLMs can run on:
  - Consumer GPUs,
  - Laptops,
  - Phones/edge devices (e.g., Gemini Nano).

- **Specialization beats raw size**  
  Domain-specialized SLMs (code, math, multimodal, etc.) often outperform much larger generalist models on their niche.

The paper organizes SLM progress along four axes:

### 4.1 Data Quality Evolution

Modern SLMs obsess over **data curation** rather than brute-force data volume:

- Multi-round filtering, plurality voting over model-generated answers, self-revision.
- Balancing general instruction tuning with **rich domain-specific datasets** (math, code, reasoning).
- Emphasis on removing low-quality or ambiguous samples.

This supports the thesis: **better, targeted data can substitute for scale**.

### 4.2 Architectural Innovations

Architectural choices that help SLMs:

- **Efficient attention**:
  - Grouped-Query Attention (GQA),
  - Sliding Window Attention (SWA),
  - Other memory/computation-saving tricks.

- **Hybrid architectures**:
  - Transformers + state-space models (e.g., Mamba-like approaches).

- **Throughput-aware design**:
  - Architectures tuned for high training speed and efficient inference.

### 4.3 Specialization & Training Methodology

- **Domain-specialized SLMs** (e.g., math, code) can beat larger general-purpose models.
- **Knowledge distillation** and **explanation/CoT tuning** let small models inherit reasoning skills from larger teachers.
- **Progressive learning curricula** improve the effectiveness of small models learning from big ones.

### 4.4 Efficiency Optimizations

Post-training tricks:

- Advanced **quantization** (e.g., SmoothQuant),
- **Structured / semi-structured pruning**,
- Inference-time optimizations and smart decoding strategies.

Together, these trends show that **scale is not the only path to progress**.

## 5. Ingredients for Downscaling Laws

The paper then surveys pieces already known that could be assembled into a coherent theory of **downscaling**.

### 5.1 Dataset Downscaling & Domain Alignment

Two strands are key:

1. **Data pruning and “breaking” the power law**  
   Work on dataset pruning shows that selecting the right subset of data can deliver **exponential improvements** relative to naive scaling. You do not need to keep all data; you need to keep **the right data**.

2. **Domain-Continual Pre-Training (D-CPT) law**  
   D-CPT formalizes how to mix:
   - General data,
   - Domain-specific data,
   to avoid catastrophic forgetting while adapting to new domains.  
   Instead of trial-and-error mixtures, the law provides a principled way to choose mixture ratios.

The authors argue that future work should prioritize:

- How to **optimally shrink datasets** while keeping or improving target-task performance.
- How to handle **data-constrained regimes**, where training smaller models longer can beat larger models trained shallowly.

### 5.2 Model Downscaling via Pruning

Three pruning regimes:

- **Unstructured pruning**: individual weights → sparse matrices, hardware-unfriendly but flexible.
- **Semi-structured pruning**: e.g., 2:4 patterns, more hardware-friendly (NVIDIA-style structured sparsity).
- **Structured pruning**: entire channels, heads, MLP dimensions, or layers.

Structured methods (SliceGPT, SVD-based, PruneNet, etc.) are especially attractive for deployment but raise questions:

- How much pruning is possible before capabilities collapse?
- How to predict **post-pruning loss** given pruning rate and post-training budget?

The paper highlights the **P2 law** which predicts post-training loss after pruning:

$$
L(N_0, D, \rho, L_0) = L_0 + \frac{1}{\rho^\gamma}
\left(
\frac{N_c}{N_0^\alpha} + \frac{D_c}{D^\beta} + E
\right)
$$

(schematic form)

Where:

- $L_0$: pre-pruning loss,
- $\rho$: pruning rate,
- $N_0$: pre-pruning model size,
- $D$: post-training tokens,
- $N_c, D_c, E, \alpha, \beta, \gamma$: fitted constants.

This gives a way to reason about **how much data you need to regain performance** after pruning.

### 5.3 Ensembling & the “Memory Split Advantage”

Ensembling is another crucial piece:

- Rather than one gigantic model, use **multiple smaller models** and combine their predictions.
- Ensembles can benefit from **diversity** and **specialization**.

The paper cites a deep ensemble scaling law:

$$
\mathbb{E}[L_{\text{ens}}(n)] = L_0 - b + \frac{a}{n}
$$

for an ensemble of size $n$, with $L_0$ the base model loss and $a, b$ fitted constants.

Key observation: for a fixed compute budget, **splitting resources into several smaller networks can outperform one large network** (“memory split advantage”).

The authors extend this by combining:

- Pruning/post-training laws (P2),
- Ensemble scaling laws,

to derive a **downscaling condition** (Proposition 4.1):

> There exists a range of ensemble sizes $n$ such that a set of pruned, smaller models, when ensembled, can achieve **lower expected loss than the original large model at comparable compute**.

Using example parameters for LLaMA-3-8B, they argue:

- With reasonable exponents and constants,
- An ensemble of **≈8 pruned 1B-parameter models** can, in principle,
- **Outperform the original 8B model without increasing compute.**

This forms the theoretical backbone of their downscaling story.

### 5.4 Ensemble Strategies for LLMs

The paper adopts a taxonomy of LLM ensemble strategies:

1. **Pre-inference**: router chooses a model per query.
2. **During inference**: token-level integration, voting, or mixture over logits.
3. **Post-inference**: combine multiple candidate outputs.

Each family has pros and cons:

- Routers can be brittle and hard to generalize.
- Token-level ensembles struggle with heterogeneous vocabularies/architectures.
- Post-hoc ensembles can be expensive and increase latency.

Despite limitations, ensembles remain one of the most promising tools for **turning many small models into one strong system**.

## 6. Proposed Downscaling Pipeline

The authors assemble all these ideas into a conceptual pipeline (Figure 5 in the paper). The stages:

### Stage 1: Active Learning–Driven Data and Model Pruning

- Start with a **large base LLM** and a large pretraining corpus.
- Use **active learning / Bayesian acquisition** to:
  - Select **high-value training examples** (data pruning),
  - Decide which parameters / structures can be pruned (model pruning).
- Apply a combination of:
  - Unstructured pruning,
  - Semi-structured pruning,
  - Structured pruning,
  obeying constraints like those in the downscaling proposition to ensure eventual ensemble viability.

Output:

- A set of **pruned base models** (candidate SLM “chunks”),
- Along with **aligned, high-quality sub-corpora**.

### Stage 2: Domain-Continual Pretraining (D-CPT) of SLMs

- Each pruned model is paired with a **domain-aligned corpus** (e.g., math, code, biomed).
- Apply D-CPT to:
  - Specialize each SLM for its domain,
  - Avoid catastrophic forgetting,
  - Use P2-like laws to size post-training datasets just enough to recover performance.

Each parallel stream in the pipeline corresponds to one **domain-specialized SLM**.

### Stage 3: Ensemble Assembly of Domain SLMs

- Combine these specialized SLMs into an **ensemble system** using:
  - Routers,
  - Hierarchical cascades (small model first, big ones on hard queries),
  - Or voting/aggregation schemes.

Under Proposition 4.1, if constructed carefully:

- The ensemble’s expected loss **can be lower** than the original large model’s loss,
- While respecting a **fixed compute or carbon budget**.

The crucial difference from classic Mixture-of-Experts (MoE):

- MoE often aims for sparse routing within one giant model.
- Here, the focus is on **composing multiple small experts** (each trained and adapted separately) into a cooperative system, not just sparsifying a single monolith.

## 7. Limitations & Alternative Views

The paper explicitly acknowledges that downscaling is not free lunch:

- **SLMs struggle with very complex, multi-domain reasoning**, especially where:
  - Deep world knowledge,
  - Long-range dependencies,
  - Or broad cross-domain expertise are required.

- Capability degradation under downscaling is **uneven**:
  - Fact recall can deteriorate quickly beyond certain pruning levels.
  - In-context learning can remain surprisingly robust.

- Ensembling has real-world frictions:
  - More models → more latency in naive setups.
  - Routers can misroute queries.
  - Heterogeneous vocabularies and architectures complicate token-level integration.
  - Post-hoc aggregation requires non-trivial compute and engineering.

So while downscaling is promising, it must be done **carefully and task-aware**.

## 8. Takeaways

The core claim of the paper can be summed up as:

> Neural scaling laws explain how to go *bigger*;  
> we now need *downscaling laws* to explain how to go *smaller* without losing what matters.

Concretely:

- **Scaling LLMs is environmentally and economically expensive**, with performance growing very slowly compared to carbon cost.
- **SLMs, when carefully trained and specialized, can rival larger models** on many tasks and are much easier to deploy.
- We already have many ingredients for a theory of downscaling:
  - Data pruning laws,
  - Post-pruning loss laws (P2),
  - Domain-continual pretraining laws (D-CPT),
  - Deep ensemble scaling laws,
  - And a growing ecosystem of SLM architectures and toolchains.
- The proposed pipeline shows a plausible path where:
  - One large LLM is pruned into multiple small, domain-focused models,
  - Trained on aligned data,
  - Then ensembled to **outperform the original** under fixed compute.

The message is not “abandon big models entirely,” but rather:

- Stop treating “scale up” as the only axis of progress.
- Invest in understanding how to **shrink, specialize, and compose** models in a principled way.
- Build a science of **downscaling laws** to guide that process.

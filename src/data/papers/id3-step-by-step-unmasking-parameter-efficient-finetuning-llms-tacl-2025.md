---
title: "Step-by-Step Unmasking for Parameter-Efficient Fine-tuning of Large Language Models"
slug: "id3-step-by-step-unmasking-parameter-efficient-finetuning-llms-tacl-2025"
publishedDate: "2024-08-27"
conference: "TACL 2025"
categories:
  - Parameter-Efficient Fine-Tuning
  - Model Compression
  - Sparse Training
  - NLP
  - Transformers
authors:
  - name: "Aradhye Agarwal"
    affiliation: "Indian Institute of Technology Delhi, India"
  - name: "Suhas Kamasetty Ramesh"
    affiliation: "Indian Institute of Technology Delhi, India"
  - name: "Ayan Sengupta"
    affiliation: "Indian Institute of Technology Delhi, India"
  - name: "Tanmoy Chakraborty"
    affiliation: "Indian Institute of Technology Delhi, India"
abstract: "Fine-tuning large language models is expensive, and selective PEFT methods try to reduce cost by updating only a small subset of parameters. However, most existing selective approaches rely on a static mask chosen once via a heuristic, which can lock in bad choices and limit performance. This work proposes ID3, a dynamic selective PEFT framework that repeatedly recomputes parameter importance, gradually unmasks parameters over training, and balances exploration and exploitation of the parameter space. ID3 introduces: (i) increment-S, an incremental masking schedule that provably halves the number of effective gradient updates compared to static masking; and (ii) D3, a magnitude-and-gradient-based importance metric that subsumes prior Fisher- and magnitude-based heuristics as special cases. Across 16 tasks spanning GLUE, NER, summarization, and math reasoning, ID3 consistently outperforms static selective PEFT baselines and can even match or surpass full fine-tuning while updating as little as 0.17% of parameters. The method is architecture- and PEFT-agnostic, integrating cleanly with adapters and LoRA, and is released as an open-source selective PEFT toolkit."
links:
  openreview: "https://openreview.net/forum?id=wHcA9iXUVb"
  pdf: "https://www.alphaxiv.org/pdf/2408.14470v1.pdf"
  alphaxiv: "https://www.alphaxiv.org/abs/2408.14470"
  code: "https://github.com/Aradhye2002/selective-peft-toolkit"
bibtex: | 
  @article{agarwal2024step,
  title={Step-by-Step Unmasking for Parameter-Efficient Fine-tuning of Large Language Models},
  author={Agarwal, Aradhye and Ramesh, Suhas K and Sengupta, Ayan and Chakraborty, Tanmoy},
  journal={arXiv preprint arXiv:2408.14470},
  year={2024}
  }
tags:
  - parameter-efficient fine-tuning
  - selective PEFT
  - sparse updates
  - ID3
  - D3 heuristic
  - LoRA
  - adapters
  - large language models
---

# Step-by-Step Unmasking for Parameter-Efficient Fine-tuning of Large Language Models

## 1. Problem & Motivation

Fine-tuning LLMs on downstream tasks is brutally expensive. PEFT (parameter-efficient fine-tuning) methods try to reduce cost by:

- Adding small task-specific modules (adapters),
- Or using low-rank updates (LoRA),
- Or **selectively** updating only a small subset of existing parameters (selective PEFT).

Selective PEFT picks a tiny subset of parameters and only updates those. Good for budget, but:

- Most methods **use a fixed mask**: choose top-B parameters once, then reuse that set for the entire training run.
- That means:
  - If your importance heuristic is slightly wrong, you’re stuck with a bad subset.
  - You never revisit parameters that might become important later.
  - You either **purely exploit** (static mask) or **purely explore** (change parameters every step), but never balance the two.

Core problems the paper attacks:

- Static masks don’t track **changing parameter importance** during optimization.
- “Pure exploitation” (static-S) can lock into suboptimal sets.
- “Pure exploration” (repeat-S) wastes budget and often overshoots, updating too many parameters.
- Existing heuristics (pure magnitude / pure gradient) have their own biases.

Enter **ID3**: an incremental, dynamic selective PEFT method that:

- Recomputes importance throughout training,
- Gradually expands the set of trainable parameters,
- Balances **exploration vs exploitation** in parameter selection,
- And can plug into both **additive** PEFT (adapters) and **reparametrization** PEFT (LoRA).

---

## 2. Selective PEFT: Setup & Baselines

### PEFT landscape

Three main PEFT families:

1. **Additive PEFT**  
   - Add small trainable modules on top of frozen backbone.  
   - Examples: Adapters (Houlsby, Pfeiffer), Conditional-Adapters, Hadamard adapters.

2. **Reparameterization PEFT**  
   - Low-rank updates of weights: LoRA, AdaLoRA, IncreLoRA, DyLoRA, DoRA, etc.

3. **Selective PEFT**  
   - Train only a subset of existing parameters using a **mask** over scalar weights.  
   - Examples:
     - **BitFit** – only biases.
     - **Diff Pruning** – parameters with large changes.
     - **Fish Mask** – Fisher-based gradient importance.
     - **PaFi** – magnitude-based selection.
     - **SparseAdapter, LoRAPrune** – sparsify adapters / LoRA.

In selective PEFT, you:

- Have a parameter vector θ with N scalar parameters.
- Want to only update at most B of them (budget).
- Define a **heuristic** that assigns importance scores.
- Use a **selection strategy** to decide which parameters to unmask (train).

The paper formalizes three strategies:

- **Static-S (static)**: choose B once → reuse forever (pure exploitation).
- **Repeat-S (repeated)**: choose a fresh B at every step (pure exploration).
- **Increment-S (incremental)**: choose a few new parameters each step and **accumulate** the mask over time (their proposal).

Most existing work = **static-S**. ID3 = **increment-S**.

---

## 3. The D3 Importance Metric

The first piece: a better scalar importance function.

They define a general importance heuristic:

$$
H(\theta_i) = \frac{|\nabla_{\theta_i}|}{(|\theta_i| + \epsilon)^{\text{exp}}}
$$

- Inputs:
  - Parameter value: $ \theta_i $
  - Gradient: $ \nabla_{\theta_i} $
- Hyperparameters:
  - $ \epsilon > 0 $: smoothing,
  - $exp$: controls how much the magnitude term matters.

Nice properties:

- If $exp = 0$ → purely gradient-based → approximates **Fisher-style** importance (Fish).
- If $exp → ∞$ → magnitude term dominates → magnitude-only → **PaFi-style** importance.
- Intermediate $exp$ mixes both.

So **D3** (“Dynamic magnitude and graDient-based heuristic”) interpolates between gradient-based and magnitude-based heuristics.

They also justify it via Fisher information:

- Show that, under mild conditions, Fisher information is an upper bound on expected H(θ).
- So maximizing H is aligned with maximizing Fisher importance, but cheaper to compute.

Takeaway: **D3 = flexible, differentiable importance metric that subsumes Fish + PaFi**.

---

## 4. Increment-S: Incremental Parameter Selection

Now the selection strategy.

We want to:

- Fine-tune for **T** steps,
- Select at most **B** scalar parameters overall,
- But only gradually unmask them.

### Unmasking schedule

Define an **unmasking scheduler** $ \{u_t\}_{t=1}^T $:

- $u_t$ = how many **new** parameters we unmask at step t.
- Default: **uniform** schedule $u_t = B/T$.

At each step t:

1. We keep a set of **currently unmasked** parameters Λₜ.
2. We compute H(θᵢ) only over **currently masked** parameters (θ \ Λₜ).
3. We pick the top $u_t$ parameters by importance:

   $$
   \lambda_t = \text{top-}u_t \text{ parameters by } H(\theta_i)
   $$

4. Update unmasked set:  
   $$
   \Lambda_{t+1} = \Lambda_t \cup \lambda_t
   $$

5. During backprop:
   - For θᵢ ∈ Λₜ → keep gradient as is.
   - For θᵢ ∉ Λₜ → zero out gradient.

   $$
   \tilde{\nabla}_{\theta_i} =
   \begin{cases}
     \nabla_{\theta_i}, & \theta_i \in \Lambda_t \\
     0, & \text{otherwise}
   \end{cases}
   $$

6. Update parameters using $\tilde{\nabla}_\theta$.

This is algorithmically summarized as **Algorithm 1 (ID3 incremental updates)**.

### Why is this cheaper?

Let:

- Static masking: you always update B parameters every step:

  $$
  U_{\text{static}} = T \cdot B
  $$

- Increment-S with uniform schedule:

  $$
  U_{\text{dynamic}} = \sum_{t=0}^{T-1} \sum_{i=0}^{t} u_i
  = \frac{T+1}{2} B \approx \frac{1}{2} T B
  $$

So:

$$
U_{\text{dynamic}} \approx \frac{1}{2} U_{\text{static}} \quad (T \gg 1)
$$

**Result**: incremental selection cuts the *effective number of parameter updates* roughly in half for the same budget.

---

## 5. Efficient Sparse Mask Storage

They also worry about how to store and reload sparse updates efficiently.

Idea:

- For each tensor parameter (e.g., a W ∈ ℝ^{m×n}), we:
  - Store only:
    - The indices (pointers) of unmasked scalar parameters,
    - Their updated values.
- Since typical tensors are at most 2D:
  - Each pointer = up to 2 indices → can fit in a 32-bit unsigned integer per dimension.
  - Values stored as 64-bit floats.

Space complexity:

- Pointers: O(2 × 32 × B)
- Values: O(64 × B)

Total: **O(B)** storage.

At load time, you:

- Create an index table of (pointer, value) pairs,
- Scatter updated values into the original dense tensors,
- Reconstruct the fine-tuned model.

They illustrate this with a simple pointer table ↔ tensor reconstruction diagram.

---

## 6. Experimental Setup (High-Level)

### Tasks & datasets

They test across **three major task types**:

1. **Text classification (NLU)**  
   - GLUE tasks: CoLA, MRPC, RTE, STS-B, SST-2, MNLI-m/mm, QNLI, QQP  
   - WNLI excluded as usual.

2. **Token classification**  
   - NER: CoNLL-2003.

3. **Text generation**  
   - Summarization: CNN/DailyMail.  
   - Math reasoning:
     - Train on Math10K (Hu et al., 2023),
     - Evaluate on GSM8K, SVAMP, MultiArith, AddSub, AQuA, SingleEq.

### Models

- **Encoder-only**:
  - DeBERTa-v3-base,
  - RoBERTa-base.

- **Encoder–decoder**:
  - T5-small (for summarization).

- **Decoder-only LLMs for math reasoning**:
  - LLaMA-7B,
  - Qwen-2.5 family,
  - MobileLLaMA-2.7B.

PEFT variants:

- Selective PEFT on backbones;
- LoRA + selective sparsification;
- Adapters + selective sparsification;
- SparseAdapter baselines.

All implemented in **PyTorch + HuggingFace**, released as **selective-peft-toolkit**.

---

## 7. Results

### 7.1 GLUE (Text Classification)

Backbone: **DeBERTa-v3-base**

- Full FT: GLUE avg ≈ **88.58%** (184M trainable params).

**Budget 103K (~0.06% of params)**

- Baselines:
  - R-Mask, Fish, PaFi, BitFit ≈ 78–87% avg.
- **ID3**:
  - Avg ≈ **88.56%**, beating all selective baselines by >1%,
  - Essentially *matching* full fine-tuning with a tiny budget.

**Budget 320K (~0.17% of params)**

- Best baseline (Fish): avg ≈ **88.35%**.
- **ID3**:
  - Avg ≈ **89.03%** → **better than full fine-tuning** (88.58%) at 0.17% parameters.

Statistical tests:

- Paired Wilcoxon across GLUE:
  - Overall p ≈ 0.04 → improvements are statistically significant.
  - ID3 wins on 8/9 tasks with p<0.05.

### 7.2 GLUE with LoRA & Adapters

**LoRA + DeBERTa-v3**

- Dense LoRA (r=8, 1.33M params): avg ≈ 88.76%.
- ID3 + LoRA at **320K** params (76% sparse):
  - Avg ≈ **88.76%** – matches dense LoRA with ~1/4 parameters.
  - Sparse LoRA (PaFi) also strong but usually slightly behind ID3.

**Adapters (Pfeiffer) + RoBERTa**

- Pfeiffer adapter alone (8M params): avg ≈ 78.89%.
- SparseAdapter (320K): ≈ 79.07%.
- **ID3 + Pfeiffer (320K)**:
  - Avg ≈ **79.98%** (+1.09 over dense Pfeiffer, +0.91 over SparseAdapter).

### 7.3 NER (CoNLL-2003)

Backbone: DeBERTa-v3

- Full FT (184M): F1 ≈ **96.62%**.

Selective methods:

- At **103K** params:
  - Fish ≈ 95.26%, PaFi ≈ 94.40%, BitFit ≈ 93.85%.
  - **ID3**: **95.55%**, best among selective.
- At **320K**:
  - **ID3**: **96.04%** vs full FT 96.62%.

Again, ID3 narrows the gap to full FT using <0.2% parameters.

### 7.4 Summarization (CNN/DailyMail)

Backbone: T5-small

- Full FT (60M): Rouge-1/2/L ≈ 41.29 / 18.90 / 29.19.

Selective methods:

- Across budgets {100K, 320K, 1M}:
  - **ID3** consistently beats PaFi by a small but steady margin on all Rouge metrics.
  - Still short of full FT, but solid for tight budgets.

### 7.5 Math Reasoning (LLaMA, Qwen, MobileLLaMA)

#### LLaMA-7B + LoRA

- Dense LoRA (r=32, 56M params): avg ≈ 59.5%.
- Thin LoRA (r=2, 3.5M): avg ≈ 58.1%.
- **ID3 + LoRA (r=32, 3.5M effective)**:
  - Avg ≈ **58.6%**, better than PaFi+LoRA and LoRA(r=2).

#### Qwen-7B / 3B / 1.5B + LoRA

General pattern:

- LoRA (r=32) gives strong baselines.
- LoRA (r=2) shrinks parameters but slightly drops performance.
- **ID3 + LoRA (r=32, sparsified)**:
  - Matches or beats PaFi+LoRA at same budget,
  - Often matches or gets very close to dense LoRA.

Example (Qwen-3B):

- Dense LoRA: avg ≈ 79.0%.
- LoRA (r=2): 79.3%.
- PaFi+LoRA (r=32, 2.5M): 79.3%.
- **ID3+LoRA**: **79.9%**, best among them.

#### MobileLLaMA-2.7B (no LoRA, direct selective PEFT)

- Full FT: avg ≈ 56.8%.
- At **2.7M** params (~0.1%):
  - PaFi: 35.4%.
  - **ID3**: 36.3% (recovers ~64% of full FT performance).
- At **1.3M**:
  - PaFi: 24.0%.
  - **ID3**: 30.1% (much more robust at extreme sparsity).

Conclusion: ID3 is consistently more stable than PaFi under tight budgets, especially on harder reasoning tasks.

---

## 8. Analysis & Ablations

### 8.1 Increment-S vs Repeat-S

They compare ID3 under:

- **Increment-S** (their default),
- **Repeat-S** (pure exploration).

Result:

- Increment-S dominates across budgets 100K–1M.
- Repeat-S:
  - Touches many more parameters overall,
  - But wastes budget on unimportant weights,
  - Especially unstable on low-data tasks like MRPC, RTE.

Moral: **blind exploration is bad; incremental accumulation works better.**

### 8.2 D3 vs PaFi under Increment-S

Swap D3 with PaFi but keep increment-S:

- “Increment-PaFi” loses ≈ **5% absolute** on average vs ID3.
- Max drop ~12% (RTE).

So:

- Increment-S alone is not enough; the **importance metric must be good**.
- D3’s mix of gradient + magnitude is materially better than magnitude-only.

### 8.3 Sensitivity to ε and exp

They sweep:

- ε in {10⁻³, 10⁻², 10⁻¹, 1},
- exp in {−2, −1, 1, 2}.

Findings:

- Best performance typically around:
  - ε ∈ {0.1, 1},
  - exp ∈ {1, 2}.
- But one-way ANOVA shows:
  - Differences are **not statistically significant** at 0.05 level.

Translation: **ID3 is robust**, not hypersensitive to heuristic hyperparameters.

### 8.4 Tensor Sparsity & Entropy

They define:

- **Tensor sparsity**: fraction of tensors that remain completely untouched.
- **Selection entropy**: entropy of selection probabilities across tensors.

Observations:

- Increment-S:
  - Starts with high tensor sparsity; gradually decreases.
  - Entropy first increases (exploration across many tensors), then stabilizes (more exploitation).
- Repeat-S:
  - Rapidly reduces tensor sparsity and then entropy, i.e., it sprays updates everywhere then collapses into weird patterns.

This matches the “controlled exploration → focused exploitation” story for increment-S.

### 8.5 FFT vs ID3: Parameter Change Patterns

They compare DeBERTa-v3 fine-tuned on STS-B with:

- Full FT,
- ID3.

Key observations:

- For parameters updated by both:
  - **Strong Spearman correlation** in magnitude of changes → they agree on *which* parameters matter among the overlapping set.
- FFT also updates a ton of **non-overlapping** parameters substantially → it does not distinguish importance well.
- ID3:
  - Makes **smaller, more targeted** updates.
  - Focuses more updates on:
    - Value matrices and FF layers (semantics, task-specific info),
    - Later layers (task features),
    - Less on early layers (more generic syntax).

So ID3 behaves like a **structured, importance-aware FFT**.

### 8.6 Efficiency

They measure:

- Peak GPU memory,
- Time for:
  - Mask initialization,
  - Mask updates,
  - One optimization step.

Results (DeBERTa-v3):

- FFT: ~10.1 GB, 4.58 s/step.
- BitFit: ~10.29 GB, ~0.05 s overhead.
- PaFi: ~10.29 GB, ~0.24 s.
- **ID3**:
  - ~12.92 GB (extra for masks / ops),
  - Initialization ~2.3 s,
  - ~0.10 s per-step overhead,
  - Total ~0.33 s per-step.

So ID3 is more expensive than static methods at the Python level, but:

- Has **fixed overhead per step**,
- Can be amortized with larger batches and optimized at C++ backend level.

They explicitly call out this as an engineering limitation, not a conceptual one.

---

## 9. Overall Takeaways

1. **Incremental selection beats static and repeated selection.**  
   Increment-S + D3 yields better use of budget, fewer updates, and stronger performance.

2. **D3 is a principled, unified importance metric.**  
   It smoothly interpolates between Fisher-like and magnitude-based heuristics and empirically outperforms both.

3. **ID3 can match or beat full fine-tuning with tiny budgets.**  
   E.g., on GLUE with DeBERTa-v3, 0.17% parameters > full FT.

4. **ID3 plays nicely with LoRA and adapters.**  
   Sparsifying LoRA/adapters with ID3 often improves over dense PEFT modules.

5. **ID3 is robust and modular.**  
   Hyperparameters (ε, exp) don’t need obsessive tuning; method works across NLU, NER, summarization, and math reasoning.

6. **Theoretical efficiency, practical engineering gap.**  
   The method cuts gradient updates in half in theory; actual wall-clock gains will need low-level sparse support.

---

## 10. Limitations & Future Work

- Current implementations still use dense kernels under the hood → theoretical savings not fully realized.
- Future directions:
  - Integrate ID3-style masking directly into low-level frameworks (PyTorch C++ backends) for true sparse compute wins.
  - Use ID3 to study **mechanistic behavior** of sparsely updated subnetworks.
  - Explore more sophisticated schedules and heuristics specialized for safety / robustness / interpretability.

In short: **ID3 turns “selective PEFT” from one-shot guessing into a dynamic search process over the parameter space**, and it does so with theory (fewer updates) and practice (better accuracy at tiny budgets) lining up surprisingly well.
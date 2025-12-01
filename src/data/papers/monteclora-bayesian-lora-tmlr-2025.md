---
title: "Robust and Efficient Fine-tuning of LLMs with Bayesian Reparameterization of Low-Rank Adaptation"
slug: "monteclora-bayesian-lora-tmlr-2025"
conference: "TMLR 2025"
year: 2025
publishedDate: "2025-08-03"
categories:
  - Parameter-Efficient Fine-tuning
  - Bayesian Methods
  - Robustness
  - Large Language Models
  - Low-Rank Adaptation
authors:
  - name: "Vaibhav Seth"
    affiliation: "Indian Institute of Technology Delhi, India"
  - name: "Arinjay Pathak"
    affiliation: "Indian Institute of Technology Delhi, India"
  - name: "Ayan Sengupta"
    affiliation: "Indian Institute of Technology Delhi, India"
  - name: "Aastha Verma"
    affiliation: "Indian Institute of Technology Delhi, India"
  - name: "Natraj Raman"
    affiliation: "JPMorgan AI Research"
  - name: "Sriram Gopalakrishnan"
    affiliation: "JPMorgan AI Research"
  - name: "Niladri Chatterjee"
    affiliation: "Indian Institute of Technology Delhi, India"
  - name: "Tanmoy Chakraborty"
    affiliation: "Indian Institute of Technology Delhi, India"
links:
  openreview: "https://openreview.net/forum?id=2HFmicB8kh"
  pdf: "https://openreview.net/pdf?id=2HFmicB8kh"
  arxiv: "https://arxiv.org/abs/2411.04358"
  alphaxiv: "https://www.alphaxiv.org/abs/2411.04358"
  code: "https://github.com/LCS2-IIITD/MonteCLoRA"
abstract: >
  MonteCLoRA is a Bayesian variant of LoRA for parameter-efficient fine-tuning of LLMs.
  It models low-rank adapters as mixtures of Gaussians with Wishart and Dirichlet hyperpriors,
  and uses Monte Carlo estimation to obtain low-variance, unbiased updates of LoRA parameters.
  This reduces sensitivity to hyperparameters and stabilizes fine-tuning, improving both robustness
  and accuracy on NLU and NLG benchmarks with only O(r) extra parameters for rank r.
---

## 1. Motivation

LoRA is widely used for PEFT but is surprisingly brittle:

- Validation accuracy can vary by 10–20 points across learning rates and batch sizes.
- Full fine-tuning is even more unstable and often less robust.
- Hyperparameter sweeps for LLMs are expensive.

The paper asks: **can we make low-rank adaptation intrinsically more robust**, instead of patching it with post-hoc Bayesian fixes?

---

## 2. Method: MonteCLoRA in a Nutshell

MonteCLoRA replaces deterministic LoRA weights with a Bayesian, Monte Carlo–estimated version:

- Start from a standard LoRA **A matrix** (low-rank adapter).
- Parameterize each column as samples from a **multivariate Gaussian**:
  - Shared covariance Σ ∼ Wishart(V, ν) with learnable diagonal scale V.
  - Mixture weights Π ∼ Dirichlet(α) with learnable α.
- Draw N Gaussian samples, combine them with weights Π, scale by a factor ε, and add to the mean:
  - This yields a **stochastic low-rank update** whose expectation equals the original LoRA weights.

Key properties:

- **Unbiased**: expected output matches the LoRA model (no change in mean prediction).
- **Lower variance & smoother loss landscape** due to injected Gaussian noise.
- **Small overhead**: only O(r + N) additional parameters per LoRA layer (r = rank, N = #mixture components).

Training loss = task loss + weighted KL terms:

- KL between learned Gaussian and N(0, I),
- KL between Wishart prior and standard Wishart,
- KL between Dirichlet and a reference Dirichlet,
- Plus a **cooperative loss** encouraging all mixture components to participate.

---

## 3. Empirical Results (Condensed)

**Models & tasks**

- RoBERTa-base on GLUE / SuperGLUE (MRPC, CoLA, RTE, WiC, BoolQ, SST-2, MNLI, QQP, QNLI).
- LLaMA-1-7B on six commonsense NLG tasks (PiQA, Social IQa, WinoGrande, ARC-e, ARC-c, OBQA).
- LLaMA-3.2-3B-Instruct on GSM8k (math) and HumanEval (code generation).

**Compared against**

- Full fine-tuning, LoRA, AdaLoRA, DoRA.
- For GLUE, also Bayesian post-hoc methods: MC Dropout, temperature scaling, checkpoint ensembles, Laplace-LoRA.

**Headline findings**

- On GLUE:
  - **Lowest spread** in accuracy and NLL across hyperparameters.
  - Extrinsic robustness (median accuracy) is higher than LoRA/AdaLoRA on most tasks.
  - Best accuracy and NLL are competitive with or better than all LoRA variants.
- Against Bayesian post-hoc baselines:
  - MonteCLoRA (even at median performance) beats MC Dropout / Laplace-LoRA in average accuracy and NLL,
    **without** needing long post-hoc calibration phases.
- On commonsense NLG:
  - Accuracy similar to the best LoRA baseline but with **much lower spread** (53–62% reduction).
- On GSM8k & HumanEval with LLaMA-3.2-3B:
  - Achieves the **highest strict and flexible match scores** on GSM8k.
  - Achieves the best pass@2 / pass@4 on HumanEval with tighter robustness bands than LoRA/DoRA.

---

## 4. Ablations & Insights

Key knobs and what they do:

- **Mixture components (N)**: N = 4 is enough; 16 brings marginal gains.
- **Dirichlet initialization**:
  - Random α initialization improves accuracy vs α = 1, by encouraging diverse mixture usage.
- **Sample scaler (ε)**:
  - Too small → under-exploration, overfitting; too big → divergence.
  - Moderate ε (≈ 5e-3) balances exploration–exploitation and gives best validation scores.
- **KL weight (η)**:
  - Both under- and over-regularization hurt; a mid-range η works best.
- **Cooperative loss**:
  - Removing it degrades accuracy by 3–4%; mixture collapses towards a few components.
- **Sparse vs dense mixtures**:
  - For small NLU tasks, using only the argmax component (sparse mixture) can help,
    hinting that selective mixture can be beneficial when data is scarce.

MonteCLoRA can also:

- Be restricted to only Q/K/V vs all linear layers; for small tasks, restricting to attention weights is often better.
- Work **post-hoc** by first training plain LoRA then only learning the stochastic part.

---

## 5. Convergence & Cost

- LoRA frequently shows **stalled or jagged loss curves**, sometimes diverging at high learning rates.
- MonteCLoRA converges **faster and more smoothly**, escaping bad basins more reliably.
- With buffered sampling:
  - Runtime overhead is around **1.2–1.7×** LoRA depending on model size and which modules are wrapped.
  - Memory overhead is modest (≈ 1.06–1.25×).

---

## 6. Limitations & Future Directions

Limitations:

- Extra sampling logic increases implementation complexity and training time.
- New hyperparameters (ε, η, N, α) require some tuning per model/task.
- Experiments so far go up to ≈13B models; behavior at 70B+ is untested.

Future extensions:

- Asynchronous / background sampling to hide sampling cost.
- Adaptive ε schedules driven by uncertainty or entropy.
- Variational approximations instead of explicit Monte Carlo sampling.
- Applying MonteCLoRA beyond LoRA (e.g., to full weights, vision models, or multimodal architectures).

---
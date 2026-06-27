---
title: "Disentangling Intrinsic Importance from Emergent Structure in Multi-Expert Orchestration"
slug: "disentangling-intrinsic-importance-from-emergent-structure-tmlr-2026"
conference: "TMLR 2026"
year: 2026
publishedDate: "2026-06-21"
categories:
  - Model Coordination
  - Large Language Models
  - Efficient Architectures
authors:
  - name: "Sudipto Ghosh"
    affiliation: "IIT Delhi, India"
    email: sudipto.ghosh@scai.iitd.ac.in
  - name: "Sujoy Nath"
    affiliation: "IIT Delhi, India"
    email: sujoynathofficial@gmail.com
  - name: "Sunny Manchanda"
    affiliation: "DYSL-AI DRDO, India"
    email: sunny.dysl-ai@gov.in
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
    email: tanchak@iitd.ac.in
links:
  arxiv: "https://arxiv.org/abs/2602.04291"
  openreview: "https://openreview.net/forum?id=4W7sgat04A"
  alphaxiv: "https://alphaxiv.org/abs/2602.04291"
  code: "https://github.com/parmanu-lcs2/inform"
  video: "https://www.youtube.com/watch?v=f8TwBV-Xl-M"

bibtex: | 
    @article{
      ghosh2026disentangling,
      title={Disentangling Intrinsic Importance from Emergent Structure in Multi-Expert Orchestration},
      author={Sudipto Ghosh and Sujoy Nath and Sunny Manchanda and Tanmoy Chakraborty},
      journal={Transactions on Machine Learning Research},
      issn={2835-8856},
      year={2026},
      url={https://openreview.net/forum?id=4W7sgat04A}
    }

abstract: >
  Multi-expert systems, where multiple Large Language Models (LLMs) collaborate to solve complex tasks, are increasingly adopted for high-performance reasoning and generation. However, the orchestration policies governing expert interaction and sequencing remain largely opaque. We introduce INFORM, an interpretability analysis that treats orchestration as an explicit, analyzable computation, enabling the decoupling of expert interaction structure, execution order, and functional attribution. We use INFORM to evaluate an orchestrator on GSM8K, HumanEval, and MMLU using a homogeneous consortium of ten instruction-tuned experts drawn from LLaMA-3.1 8B, Qwen3 8B, and DeepSeek-R1 8B, with controlled decoding-temperature variation, and a secondary heterogeneous consortium spanning 1B-7B parameter models. Across tasks, routing dominance is a poor proxy for functional necessity. We reveal a divergence between relational importance, captured by routing mass and interaction topology, and intrinsic importance, measured via gradient sensitivity: frequently selected experts often act as interaction hubs with limited influence, while sparsely routed experts can be structurally critical. Orchestration behaviors emerge asynchronously, with expert centralization preceding stable routing confidence and expert ordering remaining non-deterministic. Targeted ablations show that masking intrinsically important experts induces disproportionate collapse in interaction structure compared to masking frequent peers, confirming that INFORM exposes functional and structural dependencies beyond accuracy metrics alone.
---

![INFORM](/resources/disentangling-intrinsic-importance-from-emergent-structure-tmlr-2026/tmlr_disentangling.svg)

---

### TL;DR

Multi-expert LLM systems are becoming increasingly popular, but **their orchestration policies remain largely a black box**. We introduce **INFORM**, an interpretability framework that opens this black box by analyzing **who talks to whom, in what order, and who actually matters** during inference. Surprisingly, the experts selected most often are **not necessarily the ones the orchestrator truly depends on**, revealing a fundamental distinction between **relational importance** and **intrinsic importance**.

## Why this research?

Modern multi-agent and multi-expert systems often outperform single LLMs by coordinating multiple specialized models.

But there is a problem:

- We rarely know **why** a particular expert was selected.
- We do not know whether expert ordering is meaningful or merely incidental.
- Routing frequency is often assumed to represent importance—but **does it really?**
- Existing orchestration methods optimize for performance, while providing almost **no visibility into the reasoning process**.

Current interpretability approaches largely focus on individual LLMs, whereas orchestration itself has remained opaque.

This paper asks a different question:

> Can we treat orchestration itself as an explicit computation and understand how experts interact, specialize, and influence each other?

INFORM analyzes a differentiable orchestrator setup without modifying how experts collaborate. Instead of treating routing as a black box, INFORM probes three complementary aspects of orchestration:

1. **Interaction Structure**
   - Extract the collaboration matrix learned by the orchestrator.
   - View expert interactions as a directed graph.
   - Identify universal successors, hubs, and redundant experts.

2. **Sequencing Decisions**
   - Analyze which experts are selected first.
   - Track how ordering preferences emerge during training.
   - Measure routing confidence using entropy.

3. **Intrinsic Expert Attribution**
   - Backpropagate routing decisions to expert representations.
   - Measure gradient sensitivity to estimate how much each expert actually influences routing.
   - Compare intrinsic importance against observed routing frequency.

Together these probes separate **what the orchestrator does** from **why it does it**, exposing both structural and functional dependencies inside multi-expert systems.

![INFORM Overview](/resources/disentangling-intrinsic-importance-from-emergent-structure-tmlr-2026/tmlr_disentangling.svg)

---

## Main insights

- **Popularity does not imply importance**

  Experts that receive the most routing probability frequently serve as **interaction hubs**, but many contribute surprisingly little to the orchestrator's actual decisions. Conversely, sparsely selected experts can be structurally indispensable. INFORM distinguishes this gap through **relational importance** (routing mass) and **intrinsic importance** (gradient attribution).

- **Routing confidence and specialization emerge at different times**

  During training, expert centralization develops **before** routing confidence stabilizes. In other words, the orchestrator learns **who to trust** before learning **how confidently to trust them**, revealing asynchronous emergence of orchestration behavior.

- **Expert ordering is structured—but not deterministic**

  The orchestrator gradually develops strong preferences for initialization experts while preserving non-zero ordering entropy. Rather than converging to a fixed execution order, it learns adaptive sequencing policies that remain context dependent.

- **Prompt perturbations reveal what the orchestrator actually uses**

  Controlled perturbations demonstrate task-specific routing behavior:
  - GSM8K routing depends heavily on numerical information.
  - HumanEval is more sensitive to structural and semantic perturbations.
  - MMLU exhibits the strongest context dependence and routing variability.

  These analyses show that routing decisions increasingly align with meaningful semantic features rather than superficial lexical cues.

- **Masking intrinsically important experts breaks orchestration**

  Ablation experiments reveal that removing experts identified through gradient attribution causes substantially larger disruption to the collaboration graph than removing frequently routed experts. This confirms that intrinsic importance captures genuine functional dependencies beyond simple routing statistics.

- **Interpretability beyond accuracy**

  INFORM measures properties that conventional evaluation misses:
  - interaction topology,
  - routing confidence,
  - sequencing dynamics,
  - expert specialization,
  - structural redundancy,
  - and functional attribution.

  These analyses provide actionable insights for debugging, pruning, and understanding multi-expert systems rather than treating orchestration as an opaque optimization problem.
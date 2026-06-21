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

### Coming Soon

---

---
title: "Route, Communicate, and Reason: Gated Routing and Adaptive Depth for Efficient Multi-Agent Reasoning"
slug: "route-communicate-reason-arxiv-2026"
conference: "arXiv Preprint"
year: 2026
publishedDate: "2026-08-13"
categories:
  - Model Coordination
  - Large Language Models
  - Efficient Architectures
authors:
  - name: "Sudipto Ghosh"
    affiliation: "IIT Delhi, India"
    email: sudipto.ghosh@scai.iitd.ac.in
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
    email: tanchak@iitd.ac.in
links:
  arxiv: "https://arxiv.org/abs/2607.10836"
  code: "https://github.com/parmanu-lcs2/grade"

bibtex: | 
    @article{
        ghosh2026routecommunicatereasongated,
        title={Route, Communicate, and Reason: Gated Routing and Adaptive Depth for Efficient Multi-Agent Reasoning}, 
        author={Sudipto Ghosh and Tanmoy Chakraborty},
        year={2026},
        eprint={2607.10836},
        archivePrefix={arXiv},
        primaryClass={cs.AI},
        url={https://arxiv.org/abs/2607.10836}, 
        journal={arXiv preprint arXiv:2607.10836},
    }

abstract: >
  Multi-agent ensembling multiplies active parameters and inference cost without answering three basic questions: which agents to consult, how deeply a query should traverse a hierarchy of agents, and when inter-agent communication is worth its cost. We present GRADE (Gated Routing and Adaptive Depth for Efficient Reasoning), a hierarchical multi-agent system in which four lightweight learned gates jointly govern agent selection, hierarchy depth, inter-agent communication, and branch pruning. Training uses CoGRPO (Collaborative Group-Relative Policy Optimization), a novel critic-free recipe that adapts GRPO to multi-agent hierarchies and assigns a shared advantage signal to every gate and agent that participated in a rollout. Agent models are drawn from a hot-swappable Expert Registry; per-agent calibration maps allow experts to be replaced at inference time without retraining. At ∼17B average active parameters, GRADE outperforms all baselines on GSM8K, MMLUPro, and GPQA, surpassing the strongest baseline by 4.8 points on MMLUPro at half the active compute. On AIME-2025, where model depth dominates, GRADE remains competitive to existing frameworks. Ablations isolate the hierarchy and masked cross-attention as the largest contributors to accuracy, and show that per-agent calibration is necessary for safe hot-swapping.
---

![GRADE](/resources/route-communicate-reason-arxiv-2026/grade.png)

---

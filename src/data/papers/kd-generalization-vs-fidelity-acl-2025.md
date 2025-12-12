---
title: "On the Generalization vs Fidelity Paradox in Knowledge Distillation"
slug: "kd-generalization-vs-fidelity-acl-2025"
publishedDate: "2025-08-04"
conference: "ACL 2025"
categories:
  - Knowledge Distillation
  - Efficient Architectures
  - Large Language Models
  - Reasoning
  - NLP
authors:
  - name: "Suhas Kamasetty Ramesh"
    affiliation: "IIT Delhi, India"
  - name: "Ayan Sengupta"
    affiliation: "IIT Delhi, India"
    email: ayan.sengupta@ee.iitd.ac.in
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
    email: tanchak@iitd.ac.in
abstract: "Knowledge distillation (KD) is a key technique for compressing large language models into smaller ones while preserving performance. Despite the recent traction of KD research, its effectiveness for smaller language models (LMs) and the mechanisms driving knowledge transfer remain underexplored. In this work, we present the first large-scale empirical and statistical analysis of KD across models ranging from 0.5B to 7B parameters on 14 complex reasoning tasks in a zero-shot setting. Our findings reveal that KD can improve the average performance of smaller models by up to 10%, with a peak task specific gain of 22%, while providing only marginal benefits (∼ 1.3%) for larger models. Surprisingly, teacher performance has a minimal impact on student outcomes, while teacher task expertise impacts KD effectiveness. A correlation study indicates that smaller LMs benefit more from KD, whereas larger LMs show diminished gains. Additionally, we uncover a misalignment between improvements in student performance and reasoning fidelity, suggesting that while KD enhances accuracy, it does not always maintain the structured decision-making processes of the teacher. Our ablation study further highlights the importance of teacher signals and logit smoothing in influencing students’ performance after distillation. Overall, our study offers a comprehensive empirical and statistical assessment of KD, highlighting both its benefits and trade-offs when distilling knowledge from larger to smaller LMs."
citations: 23
anthology_id: "2025.findings-acl.923"
pages: "17930–17951"
month: "July"
year: 2025
doi: "10.18653/v1/2025.findings-acl.923"
links:
  paper: "https://aclanthology.org/2025.findings-acl.923/"
  pdf: "https://aclanthology.org/2025.findings-acl.923.pdf"
  arxiv: "https://arxiv.org/abs/2505.15442"
  alphaxiv: "https://www.alphaxiv.org/abs/2505.15442v2"
  code: "https://github.com/LCS2-IIITD/KD_generalization"
  ppt: "/resources/kd-generalization-vs-fidelity-acl-2025/ACL_2025_Find-3569.pptx"
#   video: "../data/resources/kd-generalization-vs-fidelity-acl-2025/ACL_2025_Find-3569.mp4"
  poster : "/resources/kd-generalization-vs-fidelity-acl-2025/ACL_2025_Find-3569.pdf"

bibtex: |
  @article{ramesh2025generalization,
  title={On the Generalization vs Fidelity Paradox in Knowledge Distillation},
  author={Ramesh, Suhas Kamasetty and Sengupta, Ayan and Chakraborty, Tanmoy},
  journal={arXiv preprint arXiv:2505.15442},
  year={2025}
  }

tags:
  - knowledge distillation
  - model compression
  - large language models
  - generalization
  - reasoning fidelity
  - Qwen2.5
  - LLaMA-3
---

### TL;DR

Knowledge distillation (KD) is the standard recipe for shrinking big LLMs into smaller ones—but what exactly gets transferred?  This paper shows that while KD often **boosts accuracy for small models**, it **fails to reliably preserve the teacher’s reasoning patterns**, exposing a deep gap between *generalization* and *fidelity*.

---

![Teaser Image](/resources/kd-generalization-vs-fidelity-acl-2025/teaser.png) 

## Why this research?

Everyone distills large LMs into smaller ones, but key questions remain murky:

- Does KD help **all** student sizes equally, or mainly tiny models?
- Does a **stronger teacher** always make a stronger student?
- Are we transferring just answers, or also **reasoning behavior**?
- How sensitive is KD to design choices like objective, temperature, logit noise, and teacher expertise?

This paper systematically studies KD across **multiple model families, sizes, tasks, and KD objectives**, and comes back with a sobering message:  
we’re very good at making students *perform* like their teachers, but not necessarily *think* like them.

## Snapshot summary

| Question | Short answer from the paper |
|---------|-----------------------------|
| Does KD help? | Yes, especially for small/medium students (big gains). |
| Do larger students benefit much? | Only marginally (≈1–2 points). |
| Does a better teacher always help? | No; task-aware teachers matter more than raw strength. |
| Does KD preserve reasoning? | Not reliably — accuracy ↑, reasoning fidelity often weakly correlated. |
| Are KD methods very different? | Less than you’d think; KD vs no KD matters more. |
| Are temperature & noise important? | Yes — moderate τ and low noise are critical. |

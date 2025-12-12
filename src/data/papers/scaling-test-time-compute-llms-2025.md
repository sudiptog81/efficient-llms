---
title: "The Art of Scaling Test-Time Compute for Large Language Models"
slug: "scaling-test-time-compute-llms-2025"
conference: "ArXiv Preprint"
year: 2025
publishedDate: "2025-12-02"
categories:
  - Test-Time Scaling
  - Large Language Models
  - Reasoning
  - Efficient Inference
  - Machine Learning
authors:
  - name: "Aradhye Agarwal"
    affiliation: "Microsoft Research, IIT Delhi, India"
  - name: "Ayan Sengupta"
    affiliation: "IIT Delhi, India"
    email: ayan.sengupta@ee.iitd.ac.in
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
    email: tanchak@iitd.ac.in
links:
  arxiv: "https://arxiv.org/abs/2512.02008"
  pdf: "https://arxiv.org/pdf/2512.02008"
  openreview: ""
  alphaxiv: "https://alphaxiv.org/pdf/2512.02008"
  code: "https://github.com/Aradhye2002/art_of_tts"
  slides: ""
  poster: ""
  huggingface-paper: "https://huggingface.co/papers/2512.02008"

bibtex: |
    @misc{agarwal2025artscalingtesttimecompute,
      title={The Art of Scaling Test-Time Compute for Large Language Models}, 
      author={Aradhye Agarwal and Ayan Sengupta and Tanmoy Chakraborty},
      year={2025},
      eprint={2512.02008},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2512.02008}, 
    }

abstract: >
  Test-time scaling (TTS)—the dynamic allocation of compute during inference—is a promising direction for
  improving reasoning in large language models (LLMs). However, a systematic comparison of well-known TTS
  strategies under identical conditions is missing, and the influence of model type and problem difficulty on
  performance remains unclear. To address these gaps, we conduct the first large-scale study of TTS, spanning
  over thirty billion tokens generated using eight open-source LLMs (7B to 235B parameters), across four
  reasoning datasets. We observe consistent trends: no single TTS strategy universally dominates; reasoning models
  exhibit distinct trace-quality patterns forming short-horizon and long-horizon categories; and optimal
  performance scales monotonically with compute budget. Based on these insights, we provide a practical recipe
  for selecting the best TTS strategy, considering problem difficulty, model type, and compute budget.
---

![Teaser Image](/resources/scaling-test-time-compute-llms-2025/figures/teaser.png) 
*Figure: A taste of how different inference strategies trade compute for accuracy across model families.  Shaded regions illustrate which technique—shortest‑trace, beam search or majority voting—wins at various compute budgets.*


### TL;DR

How much “thinking time” should a language model get? Our study explores **test‑time scaling**—allocating extra compute during inference—and discovers that there’s no single best strategy. The optimal approach hinges on your model, the task and how much compute you can spare.

### Why this research?

Early work on TTS took a scattershot approach: some papers claimed that letting models deliberate longer improves accuracy, while others observed that lengthy chains of thought reinforce errors and actually harm performance.  These contradictions stem from limited experiments and a narrow focus on specific model families.  The authors wanted to **settle the debate** by running a **systematic, cross‑model comparison**.  Their study spans **open‑source reasoning models (7 B–235 B parameters)** and two complementary benchmarks—**AIME 2024–2025** for symbolic mathematics and **GPQA Diamond** for conceptual science questions.  By analysing both reasoning and non‑reasoning models, and by grouping them into *short‑* or *long‑horizon* based on their training algorithms (e.g., GRPO vs. GSPO), the authors provide a principled framework for choosing the right inference strategy at runtime.

### Main insights

* **No free lunch in TTS:** No single method (beam search, self‑consistency, first‑finish search, etc.) universally outperforms the others. Optimality changes with compute budget and model type.
* **Short‑ vs. long‑horizon models:** Models trained with **GRPO** or similar reinforcement learning methods tend to prefer short, concise reasoning chains; longer traces often degrade their accuracy. Conversely, models trained via **GSPO** can sustain deeper reasoning and benefit from longer chains on harder tasks.
* **Beam search isn’t your friend:** Increasing the beam width rarely improves accuracy on reasoning tasks and sometimes hurts it, exemplifying “inverse scaling.”
* **First‑finish search shines for concise thinkers:** For short‑horizon models, sampling many traces in parallel and stopping as soon as the first k finish yields the best cost–accuracy trade‑off.
* **Majority voting is robust:** When compute is abundant, simply sampling multiple reasoning traces and picking the most frequent answer (majority voting) consistently outperforms length‑based filtering on both short‑ and long‑horizon models.

### Keywords

| Term | Description |
|---|---|
| **Test‑Time Scaling (TTS)** | Dynamically increasing compute at inference to improve reasoning. |
| **Short‑Horizon vs. Long‑Horizon** | Categories of models depending on whether shorter or longer reasoning traces lead to higher accuracy. |
| **First‑Finish Search (FFS)** | A strategy that samples N traces and majority‑votes among the first k to complete. |
| **Majority Voting** | Aggregating answers from multiple traces and choosing the most common one; effective at high compute budgets. |
| **Beam Search** | Maintaining several high‑probability reasoning paths; found to have diminishing returns on complex reasoning. |

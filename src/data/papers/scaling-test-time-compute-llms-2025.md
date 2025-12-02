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
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
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


## 1. Introduction

Test-time scaling (TTS) has emerged as a critical method to enhance the reasoning capabilities of Large Language Models (LLMs) by increasing inference-time compute. Unlike pre-training scaling laws, which focus on parameter count and dataset size, TTS focuses on how models utilize computational resources *after* training to solve complex problems.

---
![Teaser Image](/resources/scaling-test-time-compute-llms-2025/figures/teaser.png) 
---
Figure 1: Plots of shortest (cyan), majority-voted (purple), and beam-searched (red) trace
performances for short-horizon (left), long-horizon (middle), and non-reasoning (right)
models. Short-horizon models include R1, DAPO-32B, and QwQ-32B; long-horizon mod-
els include and Qwen3-32B, GPT-OSS-120B and R1-32B; and non-reasoning models include
Qwen3-235B-Instruct and DeepSeek-Chat. Performance is measured using average accuracy
on the AIME 2024–2025 and GPQA Diamond datasets. Shaded regions show the optimal
TTS strategy by compute budget: shortest for low compute, beam search for medium, ma-
jority voting for high. The plot illustrates that there is no free lunch for TTS strategies: no
single strategy is optimal and optimality depends on compute budget. This highlights the
need for a principled, model-aware approach to determine the best scaling strategy at test-
time. Marker size increases with N (N ≥2); N is the number of parallel traces sampled.

---
While early studies explored sequential scaling (extending reasoning traces) and parallel scaling (majority voting), the field currently lacks a unified framework. Recent findings have been contradictory:
* **Muennighoff et al. (2025)** suggest extending reasoning traces helps.
* **Gema et al. (2025)** argue that longer reasoning can reinforce incorrect behaviors ("inverse scaling").
* **Hassid et al. (2025)** propose that shorter, concise reasoning often outperforms extended deliberation.

These contradictions stem from a lack of systematic comparison across different **model families** and **post-training algorithms**.

To address this, the authors conduct a large-scale study involving:
* **30 Billion** generated tokens,
* **8 Open-source LLMs** (7B to 235B parameters),
* **4 Reasoning Datasets** (AIME 2024–2025, GPQA Diamond).

The study introduces a novel categorization of models into **Short-Horizon** and **Long-Horizon** reasoners, arguing that the optimal TTS strategy is not universal but highly contextual.

---

## 2. Taxonomy of Test-Time Scaling Methods

Test-time scaling strategies typically fall into four categories (Figure 2 in the paper). Understanding these distinctions is vital for selecting the appropriate inference strategy.



### 2.1 Parallel Scaling
Strategies that aggregate answers across multiple independently sampled traces.
* **Self-Consistency / Majority Voting (MV):** Samples diverse paths and selects the most frequent answer.
* **Best-of-N:** Selects the highest-reward trace from $N$ samples.
* **Short-m@k:** Runs $k$ chains and halts early based on trace length, voting among the shortest $m$.

### 2.2 Sequential Scaling
Strategies that extend reasoning depth iteratively.
* **Chain-of-Thought (CoT):** Step-by-step reasoning.
* **Tree-of-Thought (ToT):** Structured breadth-first or DAG-style search.
* **Refinement:** Iterative revision or self-correction (e.g., Reflexion).

### 2.3 Hybrid & Internal Scaling
* **Hybrid/Meta:** Dynamic switching between strategies using agents or bandits (e.g., Meta-Reasoner).
* **Internal:** Modifying internal computation without explicit external samples (e.g., Early exit based on uncertainty).

### 2.4 Studied Algorithms
This paper specifically analyzes **First Finish Search (FFS)**, **Last Finish Search (LFS)**, and **Beam Search**.

**First Finish Search (FFS-k@N):**
$$
\text{Result} = \text{MajorityVote}(\text{Shortest } k \text{ of } N \text{ traces})
$$

**Last Finish Search (LFS-k@N):**
$$
\text{Result} = \text{MajorityVote}(\text{Longest } k \text{ of } N \text{ traces})
$$

---
![TTS Techniques](/resources/scaling-test-time-compute-llms-2025/figures/tts_techniques_cropped.pdf)
Figure 2: Different TTS paradigms

---

## 3. Research Questions and Guidelines

The authors analyze TTS through the lens of model behavior, defining two distinct classes of models based on their post-training dynamics (GRPO vs. GSPO/others).

### 3.1 RQ1 — Does Beam Search Scale with Compute?
*(Analysis of standard decoding strategies)*

Contrary to intuition, **Beam Search** exhibits inverse scaling or stagnation across most reasoning tasks.

* **Short-horizon & Non-reasoning models:** Performance degrades monotonically as beam size $N$ increases.
* **Long-horizon models:** Accuracy curves flatten or decline.
* **Compute Implication:** Since total tokens increase with beam width, this represents a waste of test-time compute.



#### Synthesis and Guidelines (RQ1)
* **Avoid Beam Search** for complex reasoning tasks (AIME/GPQA) using current open-source reasoning models.
* Standard stochastic sampling combined with voting is generally superior to beam-based deterministic search for reasoning.

---

### 3.2 RQ2 — How Does Trace Length Correlate with Quality?
*(The Horizon Hypothesis)*

The study identifies a bifurcation in model behavior, attributed to post-training algorithms (e.g., GRPO vs. GSPO).

**1. Short-Horizon Models (e.g., DeepSeek-R1, QwQ-32B, DAPO-32B):**
* **Behavior:** Shorter traces are consistently more likely to be correct than longer ones, regardless of problem difficulty.
* **Origin:** Often trained with GRPO, which introduces length bias.
* **Metric:** Accuracy drops as trace length increases.

**2. Long-Horizon Models (e.g., Qwen3-32B, GPT-OSS-120B):**
* **Behavior:** Context-dependent.
    * *Easy Problems:* Shorter traces are better.
    * *Hard Problems:* Longer traces are better (sustained reasoning).
* **Origin:** Trained with methods maintaining stability over extended traces (e.g., GSPO).

#### Synthesis and Guidelines (RQ2)
* Do not assume "longer is better" (CoT fallacy).
* Classify your model as **Short** or **Long** horizon before selecting a strategy (see Table 1 in paper).
* **DAPO-32B** exhibits similar length bias to GRPO models, suggesting the bias is inherent to the reinforcement learning signal structure.

---

### 3.3 RQ3 — What is the Optimal Scaling Strategy?
*(Comparing FFS, LFS, and Majority Voting)*

The authors perform a granular analysis of FFS-k@N and LFS-k@N.

* **LFS vs. MV:** LFS (Last Finish Search) is consistently suboptimal. For any compute budget, Majority Voting (MV) outperforms filtering for the longest traces.
* **FFS Trade-offs:**
    * For **Short-horizon** models: Larger $N$ is always better.
    * For **Long-horizon** models: There is a trade-off. To gain performance at the cost of compute, one must choose smaller $N$ (approaching Simple Decoding) on easy tasks, but larger $N$ on hard tasks.



#### Synthesis and Guidelines (RQ3)
* **Majority Voting (MV@N)** is a robust baseline that generally outperforms complex length-based filtering for Long-horizon models on hard tasks.
* **First Finish Search (FFS)** is highly effective for Short-horizon models, exploiting their bias toward correct, concise answers.

---

## 4. The Recipe: A Practical Guide to TTS

Based on the empirical results, the paper proposes a decision matrix for practitioners. The optimal strategy depends on **Model Family**, **Task Difficulty**, and **Compute Budget**.

### 4.1 The Decision Matrix

| Model Family | Difficulty | Compute Budget | Recommended Recipe |
| :--- | :--- | :--- | :--- |
| **Short-Horizon** | High / Low | **High** | **MV@N** ($N$ large) |
| **Short-Horizon** | High / Low | **Low** | **FFS-k@N** ($k=1, N$ large) |
| **Long-Horizon** | High / Low | **High** | **MV@N** ($N$ large) |
| **Long-Horizon** | High / Low | **Low** | **SD** (Simple Decoding) |
| **Non-Reasoning** | High / Low | **High** | **MV@N** ($N$ large) |
| **Non-Reasoning** | High / Low | **Low** | **FFS-k@N** ($k=1, N$ large) |

### 4.2 Key Heuristics

1.  **For Short-Horizon Models (R1, QwQ):** Prioritize conciseness. Under low compute, generate many samples ($N$) but stop as soon as the first one finishes ($k=1$).
2.  **For Long-Horizon Models (Qwen3, GPT-OSS):** Respect the difficulty. On hard tasks with high compute, use standard Majority Voting. With low compute, do not attempt to filter; use greedy/simple decoding.
3.  **Universal Constant:** The optimal strategy is surprisingly independent of task difficulty *within* the model family decision branch; the budget and model type are the primary drivers.

---
![FFS all models](/resources/scaling-test-time-compute-llms-2025/figures/FFS_all_models.jpg)
---

Figure 3: Accuracy versus token usage for First Finish Search (FFS) across different model families. Distinct colors represent different values of k, while marker size represents N. The results demonstrate that FFS is particularly effective for short-horizon models, allowing them to scale performance while prioritizing concise reasoning.

---
![LFS all models](/resources/scaling-test-time-compute-llms-2025/figures/LFS_all_models.jpg)
---

Figure 4: Accuracy versus token usage for Last Finish Search (LFS) across different model families. The results illustrate that LFS is consistently suboptimal compared to Majority Voting, as prioritizing longer traces often fails to improve accuracy despite higher compute costs.
## 5. Conclusion

"The Art of Scaling Test-Time Compute" challenges the monolithic view of inference scaling. It demonstrates that there is **no free lunch**:

1.  **Beam Search** is ineffective for current open-source reasoning models on complex tasks.
2.  **Model Training Dictates Inference:** The post-training algorithm (GRPO vs. GSPO) determines the "reasoning horizon" of the model, which in turn dictates whether you should optimize for short or long traces.
3.  **Compute-Optimality:** For a given model type, optimal performance scales monotonically with budget, but the *method* to achieve that scaling changes.

Future work must move toward **Model-Aware Inference**, where the scaling strategy is dynamically selected based on the model's training history and the available computational constraints.


## 6. Results

---

### 1. Trace Length, Problem Difficulty, and Model Behavior

| Category | Model | Behavior Description | Easy Accuracy (Short) | Easy Accuracy (Long) | Hard Accuracy (Short) | Hard Accuracy (Long) |
| :----- | :----- | :----- | :----- | :----- | :----- | :----- |
| **Short Horizon** | R1 | Shorter is always better | 0.95 | 0.72 | 0.61 | 0.48 |
| | DAPO-32B | Shorter is always better | 0.80 | 0.54 | 0.05 | 0.05 |
| | QwQ-32B | Shorter is always better | 0.91 | 0.70 | 0.58 | 0.58 |
| **Long Horizon** | GPT-OSS-120B | Shorter is better for easy; Longer is better for hard | 0.92 | 0.85 | 0.48 | 0.53 |
| | Qwen3-32B | Shorter is better for easy; Longer is better for hard | 0.75 | 0.63 | 0.22 | 0.45 |
| | R1-32B | Shorter is better for easy; Longer is better for hard | 0.92 | 0.62 | 0.33 | 0.34 |
| **Non-Reasoning**| Qwen3-235B | Shorter is always better | 0.90 | 0.52 | 0.51 | 0.20 |
| | DeepSeek | Shorter is always better | 0.47 | 0.22 | 0.12 | 0.06 |

---

### 2. Summary of Key Qualitative Findings

| Finding Category | Observation |
| :--- | :--- |
| **Beam Search** | Beam search performance degrades or remains the same with increasing beam size for reasoning-focused datasets like AIME and GPQA. |
| **Inverse Scaling** | A clear case of "inverse compute scaling" is observed with Beam Search, where allocating more compute (larger beams) harms accuracy. |
| **DAPO vs. GRPO** | DAPO induces length bias to the same extent as GRPO, suggesting improvements in mitigating length bias may be limited. |
| **Trace Invariant** | Across all models, for any given trace-length bucket, accuracy is always higher on easy problems than on hard ones. |
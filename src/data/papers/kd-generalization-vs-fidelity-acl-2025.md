---
title: "On the Generalization vs Fidelity Paradox in Knowledge Distillation"
slug: "kd-generalization-vs-fidelity-acl-2025"
publishedDate: "2025-08-04"
conference: "ACL 2025"
categories:
  - Knowledge Distillation
  - Model Compression
  - Large Language Models
  - Reasoning
  - NLP
authors:
  - name: "Suhas Kamasetty Ramesh"
    affiliation: "IIT Delhi, India"
  - name: "Ayan Sengupta"
    affiliation: "IIT Delhi, India"
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
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

# On the Generalization vs Fidelity Paradox in Knowledge Distillation

## 1. Problem & Motivation

Knowledge distillation (KD) is the workhorse of compressing large LMs into smaller ones: you train a *student* to imitate a larger *teacher* and hope you keep most of the performance while shrinking compute and memory.

The paper asks:

> When we distill big LLMs into small ones, **what exactly are we transferring** – and what quietly breaks?

Specifically:

- How much does KD actually help small vs larger LMs?
- Does a *better* teacher reliably give a better student?
- How does KD affect **reasoning behavior**, not just final accuracy?
- What roles do **KD objective**, **teacher expertise**, **temperature**, and **logit noise** play?

The central paradox they uncover:

> KD clearly boosts **generalization (accuracy)** for small LMs,  
> but it does **not reliably preserve fidelity** to the teacher’s reasoning process.

So you get students that answer more questions correctly, while *not* thinking like their teachers.

---

## 2. Experimental Setup (High-Level)

**Model families**

- **Qwen2.5**: 0.5B, 1.5B, 3B, 7B (and larger teachers like 14B)
- **LLaMA-3.x**: 1B, 3B, 8B (students & teachers)

All models are standard open LMs from Hugging Face.

**Task families**

Three broad categories:

1. **Mathematical reasoning**  
   - Train on: Math10K  
   - Eval on: GSM8K, SVAMP, MultiArith, AddSub, AQuA, SingleEq

2. **Commonsense reasoning**  
   - Train on: Commonsense15K  
   - Eval on: Hellaswag, Winogrande, ARC-e/c, OBQA, BoolQ, PiQA, SiQA

3. **Instruction following**  
   - Train on: Dolly-15K  
   - Eval on: Dolly, SelfInst (“Self”), Vicuna, SNI, UNI

**Fine-tuning setup**

- LoRA adapters on top of each base model:
  - rank $r = 8$, scaling $α = 16$
- Optimizer setup (shared across KD variants):
  - batch size 16
  - learning rate $3e-4$
  - max seq length 256
  - epochs:
    - 4 for Math10K
    - 3 for Commonsense15K
- All experiments run on a single NVIDIA A100.

**Evaluation**

- Mostly **zero-shot** performance on downstream tasks.
- KD effectiveness tracked across:
  - student size
  - teacher size
  - KD method
  - task type (math / commonsense / instructions)

---

## 3. KD Methods Compared

They study three modern KD variants, all using temperature-scaled softmax with temperature $τ$:

### 3.1 Sequence-Level KD (SeqKD)

Classic **sequence-level knowledge distillation** (Kim & Rush, 2016):

- Teacher generates a full output sequence $y_T$.
- Student is trained via NLL on the teacher’s sequence:

$$
L_{\text{SeqKD}} = \mathbb{E}_{x \sim D}[-\log P_S(y_T \mid x)]
$$

This aligns student *outputs* to teacher sequences, not just tokenwise logits.

---

### 3.2 Reverse KL KD (RevKD)

MiniLLM-style **reverse KL** objective (Gu et al., 2024):

- Use $KL(P_S || P_T)$ instead of $KL(P_T || P_S)$.

$$
L_{\text{RevKD}} = \mathbb{E}_{x \sim D} \left[ D_{\text{KL}}\big(P_S(\cdot|x) \,\Vert\, P_T(\cdot|x)\big) \right]
$$

Intuition:

- Avoid over-emphasizing teacher’s low-probability regions.
- Better behaved for generative LMs.

---

### 3.3 Generalized KD (GKD)

Generalized KD (Agarwal et al., 2024):

- Mix two data sources:
  1. **Off-policy**: ground-truth / teacher-generated sequences  
  2. **On-policy**: sequences sampled from the student itself

Objective:

$$
\begin{aligned}
L_{\text{GKD}}(\theta) = & (1 - \lambda) \,\mathbb{E}_{(x,y)\sim(X,Y)}[D(P_T \Vert P_S(\cdot|x))] \\
& + \lambda \,\mathbb{E}_{x\sim X,\,y\sim P_S(\cdot|x)}[D(P_T \Vert P_S(\cdot|x))]
\end{aligned}
$$

- Use **Jensen–Shannon Divergence** (JSD) between $P_T$ and $P_S$ with mixing $β$:

$$
D_{\text{JSD}}^{(\beta)}(P_T \Vert P_S) 
= \beta D_{\text{KL}}(P_T \Vert M) + (1 - \beta) D_{\text{KL}}(P_S \Vert M),
\quad M = \beta P_T + (1-\beta)P_S
$$

Default hyperparams: $λ = 0.5$, $β = 0.5$.

---

## 4. Metrics Beyond Accuracy

They go beyond plain task accuracy and introduce:

1. **Teacher–student agreement**
   - Top-1 **answer agreement rate** (how often student output == teacher output).
   - Captures surface-level imitation of final answers.

2. **Reasoning fidelity**
   - For math + instruction tasks where models output *reasoning traces*:
     - Measure **BLEU** between teacher and student rationales.
   - Also considered sentence-embedding cosine similarity; it correlates (ρ ≈ 0.97) with BLEU, so BLEU is used as the main fidelity metric.

Key point: this lets them separate **“gets the right answer”** from **“thinks like the teacher.”**

---

## 5. Main Empirical Findings

### 5.1 KD strongly helps small LMs, barely helps larger ones

- For **small Qwen2.5** students:
  - 0.5B student: up to **~10% average improvement**, peak **~22%** on some tasks after KD.
  - 1.5B student: still substantial gains.
- For **larger students (e.g., 7B)**:
  - Only **~1.3%** average improvement.

The same pattern holds for LLaMA students:

- 1B: double-digit relative gains.
- 3B: moderate gains.
- 8B: marginal.

**Spearman correlations** between student size and KD improvement are **strongly negative** across many tasks:

- e.g., MultiArith: ρ ≈ −0.83 (p ≈ 0.0) — bigger students gain less.

So: **KD is high-leverage for tiny/medium models, low-leverage for already strong ones.**

---

### 5.2 KD method choice: surprisingly minor differences

Across math and commonsense reasoning:

- SeqKD vs RevKD vs GKD produce **similar post-KD performance**.
- t-tests confirm that **“KD vs no-KD”** is statistically significant.
- One-way ANOVA shows **no strong separation** between KD methods for these tasks.

Instruction-following shows more method-level differences, but overall story:

> If you pick a reasonable KD method, **doing KD at all** matters far more than *which* of the three you pick.

RevKD is slightly more consistent on average, but not by a huge margin.

---

### 5.3 Teacher performance vs student gains: weak correlation

They correlate **teacher base performance** with **student improvement after KD**:

- For some *structured* math tasks (AddSub, SingleEq):
  - Weak-to-moderate positive correlation: better teachers help.
- For more complex math (GSM8K, AQuA) and most commonsense/instruction tasks:
  - Correlations are weak or even negative.
  - Stronger teacher does **not** reliably yield a stronger student.

However, a crucial nuance:

> **Teacher task expertise matters a lot.**

If the teacher is **task-unaware** (not fine-tuned on that domain), distillation can **wreck** the student:

- They report up to **40% absolute performance drops** when distilling from an unfine-tuned teacher.

So:

- Raw teacher “IQ” (average performance) is not a strong predictor.
- **Domain-adapted teacher** vs **domain-agnostic teacher** *is* critical.

---

### 5.4 Teacher–student agreement is not a good proxy for performance

Agreement analysis:

- Small students (0.5B, 1.5B) often show **high agreement** with the teacher on simple math tasks (e.g., > 80–90%).
- As student size grows, agreement **drops**, even though accuracies may increase.

Correlation between agreement and performance:

- Often weak or negative (especially in math and commonsense).
- That is: **the best students are often the ones who disagree more with the teacher** on individual examples.

So *mimicry* is not the same as *competence*.

---

### 5.5 Reasoning fidelity vs performance: the actual paradox

Using BLEU-based reasoning fidelity:

- KD typically **increases fidelity** vs plain SFT (student more aligned to teacher reasoning than the SFT baseline).
- But correlation between **fidelity** and **performance** is **tiny** or statistically insignificant.

Examples:

- Math tasks like AddSub and GSM8K:
  - ρ ~ 0.0 between BLEU fidelity and accuracy.

For instruction-following datasets (Dolly, SelfInst, Vicuna, SNI, UNI):

- Some mild positive or negative correlations, but nothing robust.

**Conclusion of this section:**

> KD can give you a student that is **more accurate** but **not more faithful** to the teacher’s decision process.  
> High-performing students may deviate substantially in their *reasoning paths* even when they match answers.

This is the **generalization vs fidelity paradox** in the title.

---

### 5.6 Sensitivity to teacher signal quality (logit noise)

They perturb teacher logits with Gaussian noise:

$$
\tilde{z}_T = z_T + \epsilon, \quad \epsilon \sim \mathcal{N}(0, \sigma^2)
$$

Findings:

- Small noise (σ ≈ 1):
  - Modest performance degradation.
  - e.g., Qwen-3B → 1.5B math accuracy drops by a few points.
- Moderate noise (σ ≈ 2):
  - Clear drop in both math and commonsense reasoning.
- Large noise (σ ≈ 5):
  - KD collapses:
    - Qwen-3B → 0.5B math accuracy goes from ~55.9% to ~5.9%.
    - Large drops across the board.

So **teacher logits must be reasonably clean**; KD is fragile to noisy supervision.

---

### 5.7 Effect of temperature (τ) / logit smoothing

They sweep τ ∈ {1, 2, 5} for KD:

- **τ = 2** is almost universally better than τ = 1 or τ = 5:
  - It yields the highest average accuracy in both math and commonsense.
- **τ = 5**:
  - Over-smoothing kills the signal, especially for small students:
    - Qwen-3B → 0.5B in math: accuracy collapses to single digits.
  - Larger students degrade, but less catastrophically.

Takeaway:

> There is a sweet spot in temperature; “some smoothing” helps,  
> “too much smoothing” erases useful teacher structure.

---

### 5.8 Teacher–student size gap: biggest is not always best

Consistent with Mirzadeh et al. (2020) in vision:

- The **best teacher** for a given student is often **not the largest** possible model.
- Example:
  - Qwen-1.5B student performs best when distilled from Qwen-7B, not Qwen-14B.
- Very large gaps can make KD harder to optimize and less effective.

So KD design should consider **teacher–student compatibility**, not just “largest teacher wins.”

---

## 6. Overall Takeaways

1. **KD is most valuable for small/medium LMs.**  
   Below ~1–3B parameters, KD yields sizable gains; above ~7B, returns are marginal.

2. **Teacher domain adaptation is crucial.**  
   Using a task-unaware teacher can catastrophically *hurt* the student, even if the teacher is large.

3. **Method details matter less than doing KD at all.**  
   SeqKD, RevKD, and GKD perform similarly on reasoning tasks; choose any well-behaved variant, tune τ.

4. **Accuracy ≠ fidelity.**  
   KD can improve downstream performance while *not* preserving the teacher’s reasoning patterns or answer agreement.

5. **Careful control of signal quality (noise, temperature) is essential.**  
   Moderate temperature smoothing (τ ≈ 2) and low logit noise are good; excessive smoothing or noise destabilizes distillation.

6. **Teacher–student gap needs to be reasonable.**  
   Mid-size teachers can be more effective than massive ones for a given student.

---

## 7. Implications & Future Directions

- **For practitioners**:
  - KD is a strong tool for compressing large LMs into deployable small models, especially for math/commonsense reasoning.
  - But do **not assume** that your distilled model “reasons like” the teacher just because metrics improved.
  - When interpretability or safety relies on reasoning transparency, you may need additional constraints.

- **For research**:
  - Design **KD objectives that explicitly control the trade-off between accuracy and reasoning fidelity**.
  - Explore **self-distillation** and **multi-teacher KD** with fidelity-aware objectives.
  - Develop **diagnostics** for how reasoning structures transform under KD, not just end-task scores.

This work basically says: distillation doesn’t simply “shrink the brain,” it **re-sculpts** the student’s internal decision process. Any theory or method for KD in LLMs has to respect that gap between *getting answers right* and *thinking like the teacher*.

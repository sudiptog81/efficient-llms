---
title: "A Good Learner can Teach Better: Teacher-Student Collaborative Knowledge Distillation"
slug: "mpdistil-teacher-student-collaborative-knowledge-distillation-iclr-2024"
publishedDate: "2024-01-17"
conference: ICLR 2024
categories:
  - Knowledge Distillation
  - Meta-Learning
  - NLP
  - Transformers
authors:
  - name: "Ayan Sengupta"
    affiliation: "IIT Delhi, India"
  - name: "Shantanu Dixit"
    affiliation: "IIIT Delhi, India"
  - name: "Md. Shad Akhtar"
    affiliation: "IIIT Delhi, India"
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
abstract: "This work proposes MPDistil, a meta-policy knowledge distillation framework that makes teacher–student learning collaborative and competitive instead of one-way. MPDistil introduces a lightweight meta-teacher that optimizes a joint utility over teacher and student, and a curriculum-learning policy that selects tasks to help the student eventually surpass the teacher. On GLUE and SuperGLUE, a 6-layer BERT student distilled with MPDistil can outperform its 12-layer teacher on several tasks, and the method also narrows the performance gap when distilling from very large models like DeBERTa-v2-xxlarge to smaller students."
citations: 23

bibtex: | 
  @inproceedings{sengupta2023good,
  title={A good learner can teach better: Teacher-student collaborative knowledge distillation},
  author={Sengupta, Ayan and Dixit, Shantanu and Akhtar, Md Shad and Chakraborty, Tanmoy},
  booktitle={Proceedings of the The Twelfth International Conference on Learning Representations, Virtual Event},
  pages={25--29},
  year={2023}
}

links:
  pdf: "https://openreview.net/pdf?id=Ixi4j6LtdX"
  code: "https://github.com/notmyname16/MPDistil"
  openreview: "https://openreview.net/forum?id=Ixi4j6LtdX"
  poster: "https://iclr.cc/media/PosterPDFs/ICLR%202024/18953.png?t=1713539941.8927011"
  ppt: "https://iclr.cc/virtual/2024/poster/18953"


---

## Introduction

Large language models (LLMs) like GPT-3, PaLM, and LLaMA deliver strong performance but are expensive to deploy, especially on resource-constrained devices. Knowledge Distillation (KD) is the standard way to compress a big **teacher** into a smaller **student**, but most KD methods are:

- **One-way**: the teacher never improves based on the student.
- **Teacher-centric**: the student just tries to mimic the teacher, not surpass it.
- **Task-isolated**: multi-task students don’t really exploit cross-task structure.

Meta-learning-based KD (MetaKD) improved things by updating the teacher with a meta-objective that depends on the student, but still doesn’t fully capture real teacher–student dynamics where both sides keep improving and the student is allowed to beat the teacher.

This paper introduces **MPDistil**, a **meta-policy distillation framework** that:

- Optimizes a **joint utility** over teacher and student via a lightweight *meta-teacher*.
- Uses **collaborative and competitive objectives** between teacher and student.
- Equips the student with a **curriculum-learning policy** that picks tasks to train on so it can eventually outperform the teacher.

The aim is to make KD less “copy the teacher” and more “co-evolve teacher and student” across multiple tasks.

## Key Innovations

1. **Meta-Policy Distillation (MPDistil)**  
   - Treats KD as a **meta-learning problem** with:
     - A **teacher** $T$,
     - A **student** $S$,
     - And a **meta-teacher** $T'$ that operates on hidden representations.
   - The meta-teacher is a small feed-forward network that:
     - Takes hidden states from either teacher or student,
     - Produces outputs for the downstream task,
     - Is trained to improve *both* teacher and student performance.

2. **Collaborative vs. Competitive Meta-Teacher Losses**

   MPDistil defines two meta-objectives for the meta-teacher:

   - **Collaborative loss**  
     - Uses teacher and student hidden states separately as inputs to the meta-teacher.  
     - Minimizes the **joint task loss** over both:
       - For classification, encourages *both* teacher-based and student-based predictions to be confident on the true class.
     - Intuition: a strong shared utility encourages the meta-teacher to learn representations that help **both** models, not just the teacher.

   - **Competitive loss**  
     - Inspired by Wasserstein GAN / Earth Mover’s distance.
     - Encourages the meta-teacher to **separate** teacher and student logits while also being good at the task.
     - This creates a more adversarial dynamic: the meta-teacher prefers the teacher’s distribution, pushing the student to catch up.

   The paper shows that **lower collaborative loss correlates strongly with better student improvements**, while purely competitive dynamics are less reliable.

3. **Generic KD Objective with Hidden-State Matching**

   For distilling teacher → student, MPDistil uses a general KD loss:

   - **Task loss** on the student (e.g., cross-entropy).
   - **Logit alignment** between teacher and student with an L2 loss (instead of KL for stability).
   - **Hidden-state alignment** between corresponding layers.

   This makes MPDistil compatible with many existing KD designs: as long as the KD loss is differentiable in the student, it can plug in.

4. **Lightweight Meta-Teacher (No Teacher Cloning)**

   - Instead of cloning a large teacher into a full meta-teacher (which is expensive), MPDistil:
     - Keeps the original teacher fixed (or fine-tuned in a standard way),
     - Uses a *small* meta-teacher network (≈0.001% of teacher parameters) that only sees hidden states.
   - This makes meta-learning feasible even for **huge teachers** like DeBERTa-v2-xxlarge (≈1.4B parameters).

5. **Student Curriculum Learning via Meta-RL**

   The last step is to let the student **choose which tasks to train on**:

   - Define a **curriculum policy network** that:
     - Observes a state representation of the student (a projection of its parameters/hidden states),
     - Picks a task $T'$ from a pool of tasks (action),
     - The student is fine-tuned on a quiz batch from $T'$,
     - Reward is computed based on how much the updated student **outperforms the meta-teacher/teacher** on the main task $T$.

   - Two reward schemes:
     - **Binary reward**: whether student beats teacher/meta-teacher on the true class / regression error.
     - **Real-valued reward**: how much better the student is than the teacher.

   - The curriculum model is trained with **REINFORCE** (Monte Carlo policy gradient) to maximize expected reward, i.e., maximize how often and by how much the student beats the teacher.

   This turns the student into a **self-improving multi-task learner** that strategically samples tasks instead of passively consuming a fixed curriculum.

6. **Architecture-Agnostic Distillation**

   - MPDistil is compatible with:
     - Encoder-only models (BERT, DeBERTa),
     - Decoder-only LLMs (e.g., OPT-1.3B),
     - And, in principle, encoder–decoder models.
   - Teacher and student just need to expose:
     - Output logits,
     - Intermediate hidden states.

## Results

Experiments run on **15 NLU tasks** from **SuperGLUE** and **GLUE**, plus some additional tests with a decoder-only LLM.

### BERT Teacher → 6-Layer BERT Student

- Teacher: **BERT-base** (12 layers, 111M parameters)  
- Student: **BERT-6L** (6 layers, 66M parameters)

**SuperGLUE (dev):**

- Collaborative meta-teacher achieves **better performance than the fine-tuned teacher** on average.
- With MPDistil (collaborative loss + binary reward):
  - The student gains **+5.9%** over the base 6-layer BERT on SuperGLUE dev.
  - It also **outperforms the 12-layer teacher** on **5 out of 6** SuperGLUE tasks, with margins up to **+7%** on some tasks.
- In contrast, the best prior KD baselines:
  - **TinyBERT** and **MetaDistil** still leave the student **below** the teacher on average (negative ∆Margin).

**GLUE (dev):**

- MPDistil gives the BERT-6L student an **average +3.1% improvement** over the base student.
- On both dev and test splits, the distilled student:
  - Matches or **beats the BERT-base teacher** on **multiple GLUE tasks**, including STS-B, MRPC, and others.
- Standard deviation of scores across curriculum-learning episodes is small (~0.7–2.4%), indicating **stable training**.

### DeBERTa-v2-xxlarge → DeBERTa-12-Layer Student

- Teacher: **DeBERTa-v2-xxlarge** (~1.4B parameters)  
- Student: **DeBERTa-12** (~547M parameters)

On SuperGLUE dev:

- Baseline gap: the large teacher is much stronger than the student, especially on COPA and RTE.
- MPDistil **reduces the teacher–student performance gap to ~4.6%**, significantly better than:
  - CKD (≈9.8% drop),
  - MetaDistil (≈6% drop).
- So even when the student can’t fully beat the massive teacher, MPDistil **recovers more of the gap** than prior KD methods.

### Decoder-Only LLM (OPT-1.3B)

- The paper also tests MPDistil with **OPT-1.3B** as teacher.
- On SuperGLUE, MPDistil achieves a higher ∆Margin than PKD and other baselines:
  - Average ∆Margin for MPDistil ≈ −0.58 (student still below teacher, but closer),
  - PKD ≈ −1.92, i.e., the student lags further behind under older KD.

### Dynamics & Analysis

- **Meta-teacher strength vs. student strength**:
  - There is a **strong positive correlation** between how much the meta-teacher improves over the teacher and how much the student improves over the base student (Pearson ≈ 0.40 overall, ≈0.65 under collaborative loss).
  - Translation: “better teacher of teachers” → “better student”.

- **Reward type matters**:
  - Expected **binary reward** (>0.8 on many tasks) is higher and correlates more strongly with student performance (correlation ≈0.77) than real reward (~0.60).

- **Curriculum behaviour**:
  - On **harder tasks** (e.g., MNLI), the curriculum model explores many tasks with near-uniform weight.
  - On **higher-performing tasks** (RTE, CB, COPA):
    - The curriculum focuses on a small subset of tasks with structured patterns (e.g., CB ↔ COPA),
    - Sequence of tasks matters: low chi-square distance but low curriculum similarity implies it keeps the same task *set* but explores different orders.

## Conclusion

MPDistil reframes knowledge distillation as a **teacher–student–meta-teacher game** with:

- A **joint utility** that encourages both teacher and student to improve,
- A **lightweight meta-teacher** instead of cloning big models,
- A **reinforcement-learning-based curriculum** that lets the student choose what to learn next.

The end result:

- For moderate-sized models (BERT-base → BERT-6L), the student can **overtake** the teacher on many benchmarks.
- For very large teachers (DeBERTa-v2-xxlarge), MPDistil **significantly shrinks the performance gap** without the computational overhead of full meta-teacher fine-tuning.
- The framework is **architecture-agnostic** and extensible to multi-task, large-scale, and even decoder-only LLM settings.

Broadly, the paper argues that **“good learners can teach better”**: if you optimize the teacher and student together under a meta-policy and give the student agency via curricula, distillation becomes less about copying a static teacher and more about co-evolving smarter, more robust compressed models.
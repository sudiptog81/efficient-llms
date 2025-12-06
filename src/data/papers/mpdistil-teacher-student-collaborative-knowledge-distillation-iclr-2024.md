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

![Teaser Image](/resources/mpdistil-teacher-student-collaborative-knowledge-distillation-iclr-2024/mpdistill1.png)

*Figure: MPDistil introduces a meta‑teacher and a curriculum policy so the student doesn’t just copy the teacher—it learns when to collaborate, when to compete, and which tasks to prioritize.  <small>Image generated with Gemini AI.</small>*

### TL;DR

Big language models are amazing but too bulky for everyday use. **MPDistil** reframes knowledge distillation as a collaboration game: a tiny meta‑teacher guides both the teacher and the student, and a curriculum policy lets the student choose what to learn next. The result? A distilled student that can match or even outperform its teacher on many tasks while remaining lightweight.

### Why this research?

Large language models like GPT‑3, PaLM and LLaMA deliver impressive accuracy, but their size makes them costly to deploy. Classic knowledge distillation compresses a powerful **teacher** model into a smaller **student**, but it’s mostly a one‑way street: the student mimics the teacher, the teacher never learns from the student, and multi‑task settings ignore shared structure. Meta‑learning‑based distillation improves on this by updating the teacher, yet it still doesn’t let the student surpass the teacher. **MPDistil** aims to change that by turning distillation into a cooperative–competitive game where both teacher and student can improve, and the student gains agency to pick the tasks that will help it beat the teacher.

### Main insights

- **Meta‑Policy Distillation:** Treats distillation as a meta‑learning problem with a teacher, a student and a tiny meta‑teacher network that operates on hidden states and trains to improve both models.
- **Collaborative vs. Competitive objectives:** Introduces two losses—one encourages the meta‑teacher to learn representations that benefit both teacher and student, while the other makes it adversarial, pushing the student to catch up.
- **Generic distillation loss:** Combines task loss, logit alignment and hidden‑state alignment, making the framework compatible with various teacher–student architectures.
- **Lightweight meta‑teacher:** Uses a small feed‑forward network (about 0.001 % of the teacher’s size) instead of cloning the full teacher, so even gigantic models like DeBERTa‑v2‑xxlarge can participate.
- **Curriculum learning via meta‑RL:** Gives the student a policy network that selects which task to train on next, using rewards based on how much it outperforms the teacher; trained with REINFORCE.
- **Architecture agnostic:** Works with encoder‑only (BERT, DeBERTa) and decoder‑only (OPT‑1.3B) models and, in principle, encoder–decoder architectures.

### Results at a glance

| Setting | Benefit |
|---|---|
| **BERT‑base teacher → BERT‑6‑layer student (SuperGLUE dev)** | Student gains **+5.9 pp** over the base student and beats its teacher on 5 of 6 tasks (margins up to +7 pp). |
| **BERT‑base teacher → BERT‑6‑layer student (GLUE dev)** | Student improves by **+3.1 pp** on average and matches or exceeds the teacher on several tasks; training is stable with low variance. |
| **DeBERTa‑v2‑xxlarge → DeBERTa‑12 student** | MPDistil narrows the performance gap to about **4.6 pp**, outperforming prior distillation methods that leave a ~9.8 pp gap. |
| **OPT‑1.3B teacher (decoder‑only)** | Student achieves a smaller negative ∆Margin than with PKD and similar baselines, meaning it stays closer to the teacher’s performance. |

Additional analysis shows a strong positive correlation between how much the meta‑teacher improves and how much the student improves; binary reward signals correlate better with student gains than real‑valued rewards; and the curriculum focuses on different tasks depending on whether a task is “hard” or “easy.”

### Keywords

| Term | Description |
|---|---|
| **Knowledge Distillation** | Compressing a large teacher model into a smaller student by transferring knowledge. |
| **Meta‑Teacher** | A tiny network that learns to improve both teacher and student, rather than cloning the teacher. |
| **Collaborative Loss** | Objective encouraging representations beneficial to both teacher and student. |
| **Curriculum Policy** | A reinforcement‑learned strategy that lets the student pick which task to train on next. |
| **Architecture Agnostic** | Applicable to encoder‑only, decoder‑only, and potentially encoder–decoder models. |
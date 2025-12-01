---
title: "How to Upscale Neural Networks with Scaling Law? A Survey and Practical Guidelines"
slug: "neural-scaling-laws-survey-tmlr-2025"
conference: "TMLR 2025"
year: 2025
publishedDate: "2025-05-27"
categories:
  - Scaling Laws
  - Neural Networks
  - Large Language Models
  - Model Efficiency
  - Survey
authors:
  - name: "Ayan Sengupta"
    affiliation: "IIT Delhi, India"
  - name: "Yash Goel"
    affiliation: "IIT Delhi, India"
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
links:
  arxiv: "https://arxiv.org/abs/2502.12051"
  openreview: "https://openreview.net/forum?id=a9BT8G7Hiq"
  alphaxiv: "https://alphaxiv.org/abs/2502.12051"

bibtex: | 
    @misc{sengupta2025upscaleneuralnetworksscaling,
      title={How to Upscale Neural Networks with Scaling Law? A Survey and Practical Guidelines}, 
      author={Ayan Sengupta and Yash Goel and Tanmoy Chakraborty},
      year={2025},
      eprint={2502.12051},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2502.12051}, 
    }

abstract: >
  Neural scaling laws have revolutionized the design and optimization of large-scale AI models by
  revealing predictable relationships between model size, dataset volume, and computational resources.
  Early research established power-law relationships in model performance, leading to compute-optimal
  scaling strategies. However, recent studies highlighted their limitations across architectures,
  modalities, and deployment contexts. Sparse models, mixture-of-experts, retrieval-augmented learning,
  and multimodal models often deviate from traditional scaling patterns. Moreover, scaling behaviors vary
  across domains such as vision, reinforcement learning, and fine-tuning, underscoring the need for more
  nuanced approaches. In this survey, we synthesize insights from over 50 studies, examining the theoretical
  foundations, empirical findings, and practical implications of scaling laws. We also explore key challenges,
  including data efficiency, inference scaling, and architecture-specific constraints, advocating for adaptive
  scaling strategies tailored to real-world applications. We suggest that while scaling laws provide a useful
  guide, they do not always generalize across all architectures and training strategies.
---

## 1. Introduction

Scaling laws have become a fundamental aspect of modern AI development, especially for large language models (LLMs). In recent years, researchers have identified consistent relationships between model size, dataset volume, and computational resources, demonstrating that increasing these factors leads to systematic improvements in performance. These empirical patterns have been formalized into mathematical principles, known as **scaling laws**, which provide a framework for understanding how the capabilities of neural networks evolve as they grow.

Mastering these laws is crucial for:

- Building more powerful AI models,  
- Optimizing efficiency,  
- Reducing costs,  
- Improving generalization.

The study of neural scaling laws gained prominence with the foundational work of **Kaplan et al. (2020)**, who demonstrated that model performance follows a power-law relationship with respect to size, data, and compute. Their findings suggested that larger language models (LMs) achieve lower loss when trained on sufficiently large datasets with increased computational resources.

Later, **Hoffmann et al. (2022)** refined these ideas, introducing the notion of **compute-optimal scaling**, which revealed that training a moderate-sized model on a larger dataset is often more effective than scaling model size alone.

However, recent studies (Muennighoff et al., 2023; Caballero et al., 2023; Krajewski et al., 2024) have challenged the universality of these laws, highlighting cases where:

- Sparse models,  
- Mixture-of-experts (MoE) architectures, and  
- Retrieval-augmented methods  

introduce deviations from traditional scaling patterns. These findings suggest that while scaling laws provide a useful guide, they do not always generalize across all architectures and training strategies.

Despite the growing importance of scaling laws, existing research remains fragmented, with limited synthesis of:

- Theoretical foundations,  
- Empirical findings,  
- Practical implications.

Given the rapid evolution of this field, there is a need for a **structured analysis** that consolidates key insights, identifies limitations, and outlines future research directions. While theoretical studies have established the mathematical principles governing scaling, their real-world applications—such as efficient model training, optimized resource allocation, and improved inference strategies—are less explored.

To address this gap, the authors review **over 50 research articles** (Figure 1 in the paper) to comprehensively analyze scaling laws, examining their validity across different domains and architectures.

While prior surveys have made valuable contributions to understanding scaling laws, they have primarily focused on specific aspects of the scaling phenomenon (see Table 1 in the paper). For example:

- **Choshen et al. (2024)** emphasize statistical best practices for estimating and interpreting scaling laws using training data.  
- **Li et al. (2024b)** focus on methodological inconsistencies and a reproduction crisis in existing scaling laws.

This survey distinguishes itself by offering **comprehensive coverage** of:

- Architectural considerations,  
- Data scaling implications,  
- Inference scaling,

areas that previous surveys either overlooked or addressed only partially.

---

## 2. Taxonomy of Neural Scaling Laws

Understanding the scaling laws of neural models is crucial for optimizing performance across different domains. The survey predominantly explores scaling principles for language models, extending to other modalities such as vision and multimodal learning. It also examines scaling behaviors in:

- Domain adaptation,  
- Inference,  
- Efficient model architectures,  
- Data utilization.

Figure 2 (in the paper) highlights a **taxonomy tree** for scaling laws research. As shown in Figure 1:

- Neural scaling laws have been proposed predominantly for **pre-training** and **fine-tuning** of large neural models.  
- Among the studied models (Figure 3a), **decoder-only Transformers** dominate, followed by **Vision Transformers (ViT)** and **Mixture-of-Experts (MoE)** models.

### 2.1 Common Functional Form

The most common neural scaling laws take the form of **power laws** (Equation 1), where the model loss $ L $ or performance metric follows a predictable relationship with multiple scaling variables:

$$
L(P_1, \dots, P_n) = \sum_{i=1}^n \alpha_i \cdot P_i^{-\beta_i}
\tag{1}
$$

with:

- Scaling parameters $ \beta_i $,  
- Fitting parameters $ \alpha_i $,  
- $ P_i $ representing different scaling parameters (e.g., model size, data size, compute).

Figure 3b highlights that:

- The **number of model parameters** and  
- **Data size**

are the most commonly used scaling factors. The exact forms of all studied scaling laws are summarized in Table 10 (Appendix B of the paper).

Figure 3c suggests that **language generation** is the most common task used for developing these scaling laws, with **training cross-entropy loss** widely used to fit them.

Based on empirically obtained values, scaling laws are typically fitted with **non-linear optimization**, most commonly via:

- Least squares,  
- BFGS (Broyden–Fletcher–Goldfarb–Shanno).

Statistical methods (e.g., goodness-of-fit metrics) are then used to validate the correctness of the fitted curves. Further details on evaluating neural scaling laws are provided in Appendix A.

### 2.2 Scope Across Domains

In the following sections, the survey reviews existing literature on neural scaling across multiple domains:

- **Model scaling**: parameter and data scaling,  
- **Pre-training** (language, vision, multimodal),  
- **Post-training**: fine-tuning and transfer learning,  
- **Inference**: compute-efficient deployment strategies,  
- **Efficient scaling**: sparsity, MoEs, quantization, distillation,  
- **RL and GNNs**, where scaling behaviors often differ significantly from language and vision.

Finally, the taxonomy includes two outer branches:

- **Commendations**: practical data laws and compression-aware training (e.g., Liu et al., 2024),  
- **Criticisms**: challenges to generalizability and reproducibility of scaling laws (Sorscher et al., 2023; Diaz and Madaio, 2024).

Detailed discussion of these studies is provided in Appendix B.

---

## 3. Research Questions and Guidelines

Grounded in the taxonomy of neural scaling laws (Figure 2), the survey identifies key **research questions (RQs)** spanning six dimensions:

- Model scaling,  
- Architectural bottlenecks,  
- Inference scaling,  
- Data scaling,  
- Post-training strategies,  
- Efficient model design.

Table 2 in the paper maps taxonomy categories to research questions:

- **Model scaling** → RQ1, RQ2, RQ8  
- **Data scaling** → RQ3  
- **Post-training scaling** → RQ5  
- **Inference scaling** → RQ4  
- **Efficient/compressed model scaling** → RQ6, RQ7  

For each RQ, the authors synthesize multiple studies to:

- Extract overarching patterns,  
- Identify conflicting evidence,  
- Propose actionable guidelines for large-scale model development.

### 3.1 RQ1 — Importance of Model and Pre-training Data Size on Performance  
*(taxonomy: model scaling → pre-training)*

**Kaplan et al. (2020)** established a power-law relationship:

$$
L(N, D) = \frac{N_c}{N^{\alpha_N}} + \frac{D_c}{D^{\alpha_D}},
\quad D \propto N^{0.74}
\tag{2}
$$

**Hoffmann et al. (2022)** refined this into a compute-optimal formulation:

$$
L(N, D) = A N^{-\alpha} + B D^{-\beta} + E,
\quad D \propto N
\tag{3}
$$

Recent research has challenged linear extrapolations:

- **Muennighoff et al. (2023)** and **Sardana et al. (2024)** show that *training small models longer* can outperform larger models, especially under constrained data.  
- **Caballero et al. (2023)** propose **Broken Neural Scaling Laws (BNSL)**:

  $$
  L(N, D) =
  \begin{cases}
    a N^{-\alpha} + b D^{-\beta}, & N < N_c \\
    c N^{-\alpha'} + d D^{-\beta'}, & N \ge N_c
  \end{cases}
  \tag{4}
  $$

#### Synthesis and Guidelines (RQ1)

- Model scaling success depends not only on size but also on:
  - Training strategy,  
  - Data quality,  
  - Saturation thresholds.  
- Practitioners should allocate compute across parameters, data, and training duration based on **observed inflection points**.  
- Use Kaplan/Chinchilla-style scaling when data is abundant; otherwise, **extend training epochs** or adopt **data-efficient curricula** (see Figure 4a in the paper).

---

### 3.2 RQ2 — Scaling Behaviors for Different Neural Architectures  
*(taxonomy: model scaling → pre-training → architecture)*

According to **Tay et al. (2022)**, the vanilla Transformer consistently demonstrates superior scaling properties:

- Performance $ P \propto C^\alpha $,  
- Where $ C $ represents compute, and $ \alpha $ are fitted parameters.

Alternative architectures:

- Linear attention models (e.g., Performer),  
- Lightweight Convolutions,  
- ALBERT,

often show **inconsistent or negative scaling trends**. This helps explain why most LLMs retain relatively standard Transformer architectures instead of adopting more exotic variants at large scale.

In vision, **Zhai et al. (2022)** show that ViT models exhibit **double saturation**, where performance plateaus at both very low and very high compute levels, suggesting architectural limits. They fit:

$$
E = a (C + d)^{-b} + c
\tag{5}
$$

where:

- $ E $: downstream error,  
- $ C $: compute,  
- $ a, b, c, d $: fitting parameters.

In multimodal models, **Li et al. (2024a)** show that simply scaling up vision encoders does not consistently improve performance, indicating that scaling benefits are not uniform across modalities.

#### Synthesis and Guidelines (RQ2)

- Architectural bottlenecks vary across domains and compute scales.  
- Transformer inductive biases generalize best under scale.  
- Use architectures with **proven scaling profiles** (e.g., vanilla Transformer) unless task-specific benefits clearly outweigh risks.  
- For multimodal or domain-specialized setups, consult scaling behavior across compute ranges (Figure 4a).

---

### 3.3 RQ3 — Data Strategies for Performance Scaling  
*(taxonomy: data scaling)*

**Ye et al. (2024)** propose an exponential model for data mixing:

$$
L_i(r_1, \dots, r_M) = c_i + k_i \exp\left(\sum_{j=1}^M t_{ij} r_j\right),
\tag{6}
$$

where:

- $ r_j $: mixture ratio of source $ j $,  
- $ t_{ij} $: interaction parameters.

**Liu et al. (2024)** and **Kang et al. (2024)** develop proxy models (**REGMIX**, **AUTOSCALE**) to pre-optimize mixtures.

The **Domain-Continual Pretraining (D-CPT) law** (Que et al., 2024) provides a theoretical grounding for optimal mixture ratio between general and domain-specific data:

$$
L(N, D, r) = E
+ \frac{A}{N^\alpha}
+ \frac{B \cdot r^\eta}{D^\beta}
+ \frac{C}{(r + \epsilon)^\gamma},
\tag{7}
$$

where:

- $ N $: number of parameters,  
- $ D $: dataset size,  
- $ r $: mixture ratio,  
- $ E, A, B, C, \alpha, \beta, \gamma, \eta, \epsilon $: fitting parameters.

#### Synthesis and Guidelines (RQ3)

- Model performance is sensitive to:
  - Data heterogeneity,  
  - Mixture ratios,  
  - Interaction effects—especially in multi-domain or continual settings.  
- Replace manual corpus aggregation with **predictive data mixing**.  
- Use D-CPT law when adapting to specific domains.  
- Figure 4a outlines strategy paths based on data availability and domain constraints.

---

### 3.4 RQ4 — Test-time Scaling for Better Scaling Efficiency  
*(taxonomy: model scaling → inference scaling)*

Recent research on test-time computation and model-size scaling has revealed:

- **Brown et al. (2024)**: repeated sampling during inference significantly enhances model performance. Coverage $ C $ (fraction of problems solved) follows an exponentiated power-law relationship with the number of samples $ k $:

  $$
  \log(C) = a k^{-b},
  $$

  with $ a, b $ as fitting parameters.

- **Wu et al. (2024)**: sophisticated test-time computation strategies (e.g., iterative refinement, tree search) with smaller models can be **more cost-effective** than using larger models with naive inference. They establish a relationship between inference computational budget and optimal model size for compute-efficient inference:

  $$
  \log_{10}(C) = 1.19 \log_{10}(N) + 2.03.
  $$

#### Synthesis and Guidelines (RQ4)

- Inference scaling offers a **complementary path** to performance, particularly where model reuse is desired but compute cost must remain low.  
- Use adaptive compute, retrieval augmentation, or tree search for high-value queries.  
- Integrate test-time scaling laws into deployment workflows (Figure 4b).

---

### 3.5 RQ5 — Scaling Behaviors of Model Fine-tuning  
*(taxonomy: model scaling → post-training scaling)*

Fine-tuning scaling reflects how pre-trained models adapt across tasks and domains.

- **Hernandez et al. (2021)** introduce a transfer scaling law based on effective transferred data $ D_t $:

  $$
  D_t(D_f, N) = k (D_f)^\alpha (N)^\beta,
  \tag{8}
  $$

  where $ D_f $ is fine-tuning data, $ N $ model size.

- **Lin et al. (2024a)** refine this with a rectified law:

  $$
  L(D) = \frac{B}{D_t + D^\beta} + E,
  \tag{9}
  $$

  modeling diminishing returns beyond a pre-learned threshold.

In vision:

- **Abnar et al. (2021)**: downstream error linked to upstream error:

  $$
  e_{\text{DS}} = k (e_{\text{US}})^a + c,
  \tag{10}
  $$

- **Mikami et al. (2021)**: downstream error vs synthetic pretraining data size:

  $$
  e_{\text{DS}} = a D^{-\alpha} + c.
  \tag{11}
  $$

**Chen et al. (2024c)** propose **FLOPs-to-Loss-to-Performance (FLP)**, predicting downstream performance from pretraining FLOPs. **Zhang et al. (2024)** show that **LoRA** scales nonlinearly under PEFT:

$$
\hat{L}(X, D_f) = A \times \frac{1}{X^\alpha D_f^\beta} + E.
\tag{12}
$$

#### Synthesis and Guidelines (RQ5)

- Transferability scales with both model size and pretraining loss, but:
  - Task difficulty,  
  - Data availability,  
  - Adaptation type  

  mediate returns.

- Use FLP or rectified laws to **estimate post-training gains**.  
- Prefer PEFT for low-resource settings; switch to full fine-tuning when compute permits.  
- For domain adaptation, apply D-CPT strategies (Figure 4a).

---

### 3.6 RQ6 — Scaling Efficiency and Performance for Sparse and Efficient Models  
*(taxonomy: model scaling → model compression)*

As demand for resource-efficient models grows, sparse architectures such as pruned networks and MoEs have emerged as promising alternatives to dense Transformers.

**Frantar et al. (2023)** propose a general sparse scaling law showing that sparsity acts as a **multiplicative efficiency factor**:

$$
L(S, N, D) =
\big(a_S (1 - S)^{b_S} + c_S\big)
\left(
  \frac{1}{N^{\alpha_N}} + \frac{a_D}{D^{\beta_D}}
\right) + c,
\tag{13}
$$

where:

- $ S $: sparsity,  
- $ N $: number of non-zero parameters,  
- $ D $: dataset size.

For MoE models, where only a subset of parameters is activated per input, **Clark et al. (2022)** propose:

$$
\log L = a \log N + b \log E + c \log N \cdot \log E + d,
\tag{14}
$$

where $ E $ denotes expansion factor (experts).

**Yun et al. (2024)** extend this to include dataset size $ D $:

$$
\log L(N, D, E) = \log\left(\frac{a}{b} + \frac{N^\alpha}{E^\beta} + \frac{c}{D^\gamma} + f\right) + d \log N \log E.
\tag{15}
$$

**Krajewski et al. (2024)** introduce a granularity parameter $ G $ to refine the Chinchilla-style formulation:

$$
L(N, D, G) = c + \frac{g}{G^\gamma} + a\left(\frac{1}{b} + \frac{N^\alpha}{D^\beta}\right).
\tag{16}
$$

Structured pruning approaches are formalized through the **P2 law** (Chen et al., 2024b), relating post-pruning loss to pre-pruning model size $ N_0 $, pruning ratio $ \rho $, and post-training token count $ D $:

$$
L(N_0, D, \rho, L_0) = L_0
+ \frac{1}{\rho^\gamma}
\left(
  \frac{N_C}{N_0^\alpha}
  + \frac{D_C}{D^\beta}
  + E
\right),
\tag{17}
$$

where:

- $ L_0 $: uncompressed model loss,  
- $ \rho $: pruning rate,  
- $ N_0 $: pre-pruning model size,  
- $ D $: post-training tokens,  
- $ N_C, D_C, E, \alpha, \beta, \gamma $: fitting parameters.

#### Synthesis and Guidelines (RQ6)

- Sparse models are scaling-compliant but require:
  - Careful routing (MoE),  
  - Token-budget tuning (pruning),

  to outperform dense counterparts.

- Use MoEs for **general-purpose LLMs under compute limits**.  
- Apply pruning for **deployment constraints**.  
- For efficient inference, refer to Figure 4b.

---

### 3.7 RQ7 — Model Scaling with Low-precision Quantization  
*(taxonomy: model scaling → model compression → quantization)*

**Dettmers and Zettlemoyer (2023)** suggest that **4-bit precision** appears to be an optimal sweet spot for maximizing performance while minimizing model size.

Research on **mixed quantization** (Cao et al., 2024) shows:

- Larger models can handle higher quantization ratios while maintaining performance,  
- Larger models require **exponentially fewer high-precision components** to maintain a given performance level.

**Kumar et al. (2024)** develop a unified scaling law predicting both training and post-training quantization effects:

$$
L(N, D, P_w, P_a, P_{kv}, P_{\text{post}})
  = A N_{\text{eff}}^{-\alpha} + B D^{-\beta} + E + \delta_{\text{PTQ}},
\tag{18}
$$

where:

- $ P_w, P_a, P_{kv} $: training precision of weights, activations, and attention,  
- $ P_{\text{post}} $: end-time weight precision,  
- $ \delta_{\text{PTQ}} $: loss due to post-training quantization,  
- $ \alpha, \beta $: fitting parameters.

#### Synthesis and Guidelines (RQ7)

- Scaling-aware quantization reduces memory while preserving performance.  
- Larger models generally **generalize better to low precision**.  
- Apply mixed-precision for inference.  
- Use quantization-aware training for smaller models.  
- Combine with post-training strategies (Figure 4b) to guide compression.

---

### 3.8 RQ8 — Beyond Modalities: Scaling for Multimodal Models  
*(taxonomy: model scaling → multimodal models)*

Multimodal scaling builds upon, but does not simply replicate, unimodal trends.

- **Henighan et al. (2020)** first propose multimodal scaling:

  $$
  L(x) = A x^{-\alpha} + B,
  $$

  where $ x $ represents model size, data, or compute.

- **Alabdulmohsin et al. (2022)** refine this into a more flexible sigmoid-like form:

  $$
  \frac{L_x - L_\infty}{(L_0 - L_x)^\alpha} = \beta x^c,
  \tag{19}
  $$

  allowing transitions across saturation regimes.

- **Aghajanyan et al. (2023)** observe that:
  - Smaller multimodal models show **competition** between modalities,  
  - Larger models cross a “competition barrier” and become **synergistic**.

They propose a bimodal generalization of the Chinchilla law:

$$
L(N, D_i, D_j) =
\frac{L(N, D_i) + L(N, D_j)}{2}
+ \frac{A_{i,j}}{N^{\alpha_{i,j}} (|D_i| + |D_j|)^{\beta_{i,j}}}
- C_{i,j},
\tag{20}
$$

where $ C_{i,j} $ captures degree of positive interaction between modalities $ i $ and $ j $.

#### Synthesis and Guidelines (RQ8)

- Multimodal scaling is governed more by:
  - Modality alignment,  
  - Architectural balance,  

  than raw model size.

- Ensure models are sufficiently large to benefit from synergy across modalities.  
- Prioritize:
  - Balanced architectures,  
  - High-quality aligned datasets,  

  over isolated scaling of one modality.  
- Refer to Figure 4a when designing multimodal pretraining pipelines.

---

### 3.9 Cross-RQ Synthesis

The survey highlights several cross-cutting themes:

- **Data-efficient scaling** (RQ1, RQ3, RQ5) consistently beats brute-force model expansion (Hu et al., 2024; Sardana et al., 2024).  
- **Architectural innovations** (RQ2, RQ6) tend to scale poorly unless paired with **precise training heuristics** (e.g., expert routing in MoEs).  
- **Inference-aware scaling** (RQ4, RQ7) enables small models to rival larger ones, but is still underrepresented in current scaling law literature.

These observations motivate a more **holistic view of scaling**, beyond simple parameter or data scaling.

---

## 4. Criticisms of Scaling Laws

**Diaz and Madaio (2024)** challenge the generalizability of neural scaling laws, arguing that they fail in diverse real-world AI applications:

- Scaling laws do not always hold when AI models serve **heterogeneous populations** with conflicting performance criteria.  
- Larger datasets often reflect more diverse communities, making it difficult to optimize a single model for all users.  
- Similar to multilingual AI, increasing data diversity can lead to **performance degradation** rather than improvement for certain groups.  
- Universal evaluation metrics are inadequate for capturing these complexities, potentially reinforcing biases against underrepresented groups.

They suggest that **smaller, localized AI models** may be more effective for specific communities, highlighting the need to move beyond **one-size-fits-all scaling assumptions**.

Beyond dataset expansion, **data pruning** contradicts traditional scaling laws:

- Strategic pruning can achieve comparable or superior results with **significantly fewer training samples** (Sorscher et al., 2023).  
- Not all data contributes equally; selecting the most informative examples enables more efficient learning.  
- Experiments on CIFAR-10, SVHN, and ImageNet show that careful curation can **surpass traditional power-law improvements**, questioning the necessity of brute-force scaling.

Despite their impact, many scaling-law studies suffer from **limited reproducibility** (see Table 11 in Appendix C):

- Reliance on proprietary datasets,  
- Undisclosed hyperparameters,  
- Undocumented training methodologies.

This raises concerns about robustness. Large-scale experiments often depend on private infrastructure, making independent verification challenging and undermining reliability.

Furthermore, the field avoids **rigorous scaling exponent analysis**:

- Exponents vary across models, datasets, and hyperparameters,  
- This variability demands investigation rather than dismissal.

Neglecting exponent analysis undermines confidence in extrapolation and raises questions about whether observed behaviors are **genuine properties or experimental artifacts**.

---

## 5. Beyond Scale: Future Directions for Practical and Sustainable AI

While neural scaling laws have provided valuable insights into model performance, their current formulations often fail to account for recent advancements in:

- Architecture,  
- Data efficiency,  
- Inference strategies.

The survey outlines key directions where scaling laws should be adapted to improve predictive power and practical utility.

### 5.1 Reframing Scaling Laws for Real-world Constraints

Future scaling laws must account for:

- Compute budgets,  
- Hardware latency,  
- Energy consumption.

This includes:

- Integrating **training–inference trade-offs**,  
- Evaluating real-world performance under **quantization** or **pruning**,  
- Predicting effectiveness in **resource-constrained environments**.

### 5.2 Designing for Downscaling

Rather than only building ever-larger models, the field should invest in **scaling laws for small language models** trained with:

- Optimal data,  
- Sparsity,  
- Efficient inference strategies.

The emergence of **1–3B parameter models** that rival 13B+ models (Hu et al., 2024) highlights the viability of compact yet performant systems.

### 5.3 Multi-objective Scaling Optimization

Current scaling laws often predict accuracy at scale but ignore trade-offs between:

- Accuracy,  
- Compute,  
- Robustness.

Future work should develop **multi-objective scaling frameworks** that balance these factors and guide architecture and dataset design more holistically.

### 5.4 Inference-aware and Modular Scaling Laws

Traditional scaling laws assume fixed inference procedures. However, RQ4 and RQ7 show that **test-time compute allocation** (sampling, retrieval, routing) can drastically affect performance.

Future scaling formulations should:

- Modularize inference,  
- Allow flexible compute allocation per task or query.

### 5.5 Data Quality Over Quantity

Instead of indiscriminately expanding datasets, laws like **REGMIX (Liu et al., 2024)** and **D-CPT (Que et al., 2024)** emphasize **optimized data composition**:

- Prioritize informative examples,  
- Track dataset efficiency across tasks.

### 5.6 Towards Accessible and Sustainable AI

Large models are inaccessible to many research groups. Downscaling informed by scaling laws can ensure that smaller labs and edge deployments still benefit from state-of-the-art performance.

Ultimately, the future of neural scaling is not just **bigger models**, but **better modeling choices at every scale**.

---

## 6. Conclusion

This survey provides a comprehensive analysis of neural scaling laws, exploring their:

- Theoretical foundations,  
- Empirical findings,  
- Practical implications.

It synthesizes insights across multiple modalities:

- Language,  
- Vision,  
- Multimodal,  
- Reinforcement learning,

to uncover common trends and deviations from traditional power-law scaling.

While early research established predictable relationships between model size, dataset volume, and computational resources, more recent studies show that these relationships are **not universally applicable**:

- Sparse architectures,  
- Retrieval-augmented models,  
- Domain-specific adaptations  

often exhibit distinct scaling behaviors, challenging the notion of uniform scalability.

Furthermore, advancements in:

- Fine-tuning,  
- Data pruning,  
- Efficient inference strategies  

have introduced new perspectives on **compute-optimal scaling**.

Despite their significance, scaling laws remain an **evolving research area**, requiring further refinement to address:

- Real-world deployment challenges,  
- Architectural innovations,  
- Sustainability and accessibility constraints.

The overarching message: scaling laws are powerful tools, but they must be **expanded and adapted** to guide not only how we **scale up**, but also how we **scale smart**.
---
title: "Step-by-Step Unmasking for Parameter-Efficient Fine-tuning of Large Language Models"
slug: "id3-step-by-step-unmasking-parameter-efficient-finetuning-llms-tacl-2025"
publishedDate: "2024-08-27"
conference: "TACL 2025"
categories:
  - Parameter-Efficient Fine-tuning
  - Sparse Training
  - NLP
  - Transformers
authors:
  - name: "Aradhye Agarwal"
    affiliation: "IIT Delhi, India"
  - name: "Suhas Kamasetty Ramesh"
    affiliation: "IIT Delhi, India"
  - name: "Ayan Sengupta"
    affiliation: "IIT Delhi, India"
  - name: "Tanmoy Chakraborty"
    affiliation: "IIT Delhi, India"
abstract: "Fine-tuning large language models is expensive, and selective PEFT methods try to reduce cost by updating only a small subset of parameters. However, most existing selective approaches rely on a static mask chosen once via a heuristic, which can lock in bad choices and limit performance. This work proposes ID3, a dynamic selective PEFT framework that repeatedly recomputes parameter importance, gradually unmasks parameters over training, and balances exploration and exploitation of the parameter space. ID3 introduces: (i) increment-S, an incremental masking schedule that provably halves the number of effective gradient updates compared to static masking; and (ii) D3, a magnitude-and-gradient-based importance metric that subsumes prior Fisher- and magnitude-based heuristics as special cases. Across 16 tasks spanning GLUE, NER, summarization, and math reasoning, ID3 consistently outperforms static selective PEFT baselines and can even match or surpass full fine-tuning while updating as little as 0.17% of parameters. The method is architecture- and PEFT-agnostic, integrating cleanly with adapters and LoRA, and is released as an open-source selective PEFT toolkit."
links:
  openreview: "https://openreview.net/forum?id=wHcA9iXUVb"
  pdf: "https://arxiv.org/pdf/2408.14470v1"
  alphaxiv: "https://www.alphaxiv.org/abs/2408.14470"
  code: "https://github.com/Aradhye2002/selective-peft-toolkit"
bibtex: | 
  @article{agarwal2024step,
  title={Step-by-Step Unmasking for Parameter-Efficient Fine-tuning of Large Language Models},
  author={Agarwal, Aradhye and Ramesh, Suhas K and Sengupta, Ayan and Chakraborty, Tanmoy},
  journal={arXiv preprint arXiv:2408.14470},
  year={2024}
  }
tags:
  - parameter-efficient fine-tuning
  - selective PEFT
  - sparse updates
  - ID3
  - D3 heuristic
  - LoRA
  - adapters
  - large language models
---

<img src="/resources/id3-step-by-step-unmasking-parameter-efficient-finetuning-llms-tacl-2025/id3.jpg" alt="ID3 Diagram" style="width:500px;" />

*(a) Static selection methods update same set of parameters over iterations. (b) Repeatation-based methods select fresh set of parameters in each iteration, (c) Incremental selection methods (ours - ID3) iterative increase the pool of parameters over iterations. ID3 incrementally selects and trains new parameters at each step, balancing exploration and exploitation. A dynamic importance metric (D3) ranks masked parameters, and an unmasking scheduler controls how many to unveil.*

### TL;DR

Selective parameter‑efficient fine‑tuning usually picks a tiny set of weights once and never looks back. **ID3** flips that script by gradually unmasking new parameters as training progresses, guided by a dynamic importance metric that blends gradient and magnitude. The result is a method that matches or even surpasses full fine‑tuning while updating only a fraction of the parameters.

### Why this research?

Fine‑tuning large language models is expensive, so **parameter‑efficient fine‑tuning (PEFT)** methods train only a small subset of weights or add tiny modules. Existing selective PEFT techniques rely on **static masks**: they choose the “important” parameters once and reuse that set throughout training. If the heuristic is off, you’re stuck with a bad subset, and the method either over‑explores or over‑exploits. **ID3** addresses this by dynamically recomputing parameter importance throughout training and gradually expanding the trainable subset. This balances exploration and exploitation, adapts to changing importance, and works with adapters, LoRA and other PEFT variants.

### Main insights

- **D3 importance metric:** Combines gradient and magnitude information to rank parameters; it smoothly interpolates between Fisher‑style and magnitude‑based heuristics.
- **Increment‑S selection:** Unmasks a few new parameters at each training step, accumulating the set over time; reduces effective updates by roughly half compared to static selection.
- **Sparse mask storage:** Stores only indices and values of unmasked parameters, keeping memory overhead linear in the number of selected weights.
- **Works across architectures:** Compatible with encoder‑only, encoder–decoder and decoder‑only models; integrates with LoRA and adapter methods.
- **Robust and hyperparameter‑friendly:** Performance is stable across a range of smoothing and exponent settings in the D3 metric.

### Results at a glance

| Scenario | ID3 Outcome (Budget) |
|---|---|
| **GLUE (DeBERTa‑v3‑base)** | Matches full fine‑tuning (≈88.6% avg) with ~0.06 % parameters; beats it with 0.17 % parameters. |
| **LoRA + DeBERTa‑v3** | ID3 + LoRA (320 K params) achieves the same average as dense LoRA with ~¼ of the parameters. |
| **Adapters (Pfeiffer) + RoBERTa** | ID3 with 320 K parameters outperforms dense adapters and SparseAdapter. |
| **NER (CoNLL‑2003)** | Reaches F1 ≈96.0% using <0.2 % parameters, very close to full fine‑tuning. |
| **Summarization (CNN/DailyMail)** | Beats PaFi on Rouge metrics across budgets, though still shy of full fine‑tuning. |
| **Math reasoning (LLaMA, Qwen, MobileLLaMA)** | Consistently more stable than magnitude‑only baselines; recovers up to 64% of full performance at extreme sparsity. |

Additional analysis shows incremental selection outperforms repeated (pure exploration) selection, D3 outperforms purely magnitude‑based metrics, and ID3 remains robust to hyperparameter sweeps. While the method has higher Python‑level overhead than static approaches, its theoretical efficiency gains could be realized with lower‑level sparse implementations.

### Keywords

| Term | Description |
|---|---|
| **PEFT** | Parameter‑Efficient Fine‑Tuning: training only a small fraction of a model’s parameters. |
| **ID3** | An incremental selective PEFT method that gradually unmasks trainable weights. |
| **D3** | Dynamic importance metric blending gradient and magnitude to rank parameters. |
| **Increment‑S** | Strategy that accumulates the mask over time, balancing exploration and exploitation. |
| **LoRA/Adapters** | Low‑rank or additive modules used in conjunction with selective unmasking for efficiency. |

## Example: Training workflow with ID3

```python
from selective_optimizers.wrap import get_selective_optimizer
from selective_optimizers.load_store import write_summary_to_disk
from torch.optim import AdamW

# Choose your base optimizer
opt = AdamW

# Specify the PEFT method to use (can be one of "id3", "bitfit", or "pafi")
peft_to_use = "id3"

# Get the selective optimizer class
optimizer_class = get_selective_optimizer(opt, peft_to_use)

params = [
    {"params": list_of_params_1, "choose_all": True},
    {"params": list_of_params_2},
]

# 'choose_all': Select all parameters in this group (useful for randomly initialized heads like classification layers).
# If 'choose_all' is not specified or is set to False, selection follows the chosen PEFT method.

# Initialize the optimizer with additional selective parameters
optimizer = optimizer_class(
    params=params, 
    lr=0.0001, 
    budget=100000, 
    exp=0, 
    eps=1e-3, 
    max_steps=1000
)

# Usual training loop
for epoch in range(num_epochs):
    for i, data in enumerate(train_loader):
        optimizer.zero_grad()
        # Forward pass
        outputs = model(data)
        # Compute loss
        loss = criterion(outputs, targets)
        # Backward pass
        loss.backward()
        # Optimizer step - the key masking of gradients and updating of internal state happens here
        optimizer.step()

# Optional post-training work for validation
optimizer.post_train_work()
print("Budget used:", optimizer.get_budget_used())

# Save the summary of modified weights
summary = optimizer.get_summary(model)
write_summary_to_disk("path/to/summary.pt", summary)
```

## Example: Inference workflow with ID3

```python
from selective_optimizers.load_store import load_summary_from_disk, load_weights_from_summary

# Load your model as usual
model = ...

# Load the summary from disk
summary = load_summary_from_disk("path/to/summary.pt")

# Apply the modified weights from the summary to the model
load_weights_from_summary(model, summary)

# Usual inference code
outputs = model(input_data)
```

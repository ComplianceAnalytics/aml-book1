# Applied AML Analytics: Turning Data Science Skills into Compliance Decisions
## Transaction Monitoring, Segmentation, Scenario Tuning, Machine Learning, and Model Validation
### Companion Notebooks — Book 1

**Publisher:** Compliance Analytics Ltd  
**Organisation:** [github.com/ComplianceAnalytics](https://github.com/ComplianceAnalytics)  
**Contact:** info@complianceanalytics.co.uk

---

## About this repository

This repository contains the Google Colab companion notebooks and dataset generator for **Book 1** of the *Applied AML Analytics* series. Every code example printed in the book runs here — with real output, embedded charts, and structured exercise answer cells.

No software installation is required. All notebooks run in Google Colab using only libraries that are pre-installed in the Colab environment (pandas, scikit-learn, matplotlib, networkx, rapidfuzz).

---

## How to open a notebook

Click any **Open in Colab** badge below. The notebook opens in your browser with the Northgate dataset pre-wired — run the **Section 0 setup cell** first, then work through the sections in order.

Alternatively, open any notebook directly from Colab:  
**File → Open notebook → GitHub tab → paste `ComplianceAnalytics/aml-book1`**

---

## Chapter notebooks

| Chapter | Topic | Open in Colab |
|---------|-------|---------------|
| **3** | The Transaction Monitoring Lifecycle — first look at the Northgate dataset, mule account profile, TM lifecycle exercise | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_03.ipynb) |
| **4** | Rule-Based TMS — implementing Rule 1 (cash threshold structuring), threshold sensitivity analysis | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_04.ipynb) |
| **5** | Entity Resolution — fuzzy name matching, multi-field record linkage, entity network construction | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_05.ipynb) |
| **6** | Customer Segmentation — K-Means clustering on behavioural features, segment labelling exercise | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_06.ipynb) |
| **7** | Scenario Tuning — Rule 2 (velocity), responsiveness analysis, cross-rule alert overlap | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_07.ipynb) |
| **8** | Coverage Assessment — Rule 3 (high-risk country counterparty), three-rule coverage matrix | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_08.ipynb) |
| **9** | ML Triage — Isolation Forest on the full alert pool, SHAP explainability, governance framework | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_09.ipynb) |

Chapters 1, 2, 10, and 11 are conceptual and have no companion notebooks.

---

## Repository structure

```
aml-book1/
├── notebooks/
│   ├── chapter_03.ipynb      ← Ch 3: TM Overview
│   ├── chapter_04.ipynb      ← Ch 4: Scenario Design
│   ├── chapter_05.ipynb      ← Ch 5: Entity Resolution
│   ├── chapter_06.ipynb      ← Ch 6: Segmentation
│   ├── chapter_07.ipynb      ← Ch 7: Tuning & Calibration
│   ├── chapter_08.ipynb      ← Ch 8: Risk & Coverage Assessment
│   ├── chapter_09.ipynb      ← Ch 9: ML Triage
│   └── chapter_solutions.ipynb ← Instructor solutions manual
├── assets/
│   └── cal_logo_banner.png   ← Compliance Analytics Ltd logo
└── README.md
```

The **Northgate Retail Bank dataset** is generated inside each notebook's Section 0 setup cell — no separate download needed. The dataset is synthetic and reproducible from a fixed random seed (42).

---

## The Northgate running case study

All notebooks share a single fictional dataset: Northgate Retail Bank, a mid-sized UK retail bank with 500 customer accounts. Six accounts are embedded mule accounts conducting structuring — repeated cash deposits just below the reporting threshold, transacting with high-risk counterparties.

Each chapter adds one new analytical layer to the same case:

| Chapter | What gets built |
|---------|----------------|
| 3 | Explore the raw data; trace the TM lifecycle |
| 4 | Rule 1 — NRB-STRUCT-001 (cash structuring); 47 alerts generated |
| 5 | Entity resolution — reveal that the 47 alerts include a coordinated 6-account mule network |
| 6 | K-Means segmentation — peer groups for threshold calibration |
| 7 | Rule 2 — NRB-VEL-002 (velocity); cross-rule overlap analysis |
| 8 | Rule 3 — NRB-GEO-003 (high-risk countries); coverage matrix vs. FFIEC red flags |
| 9 | Isolation Forest ML triage — all six mule accounts rank 1–6 by anomaly score |

By the end of Chapter 9, students have built, segmented, tuned, assessed, and ML-triaged the same complete transaction monitoring system.

---

## Three-rule detection system

| Rule ID | Chapter | Detection logic | Key threshold |
|---------|---------|-----------------|---------------|
| NRB-STRUCT-001 | 4 | Rolling 30-day cash deposits | > USD 7,500, ≥ 3 transactions |
| NRB-VEL-002 | 7 | Rapid-fire transactions in short window | ≥ 5 transactions in 14 days |
| NRB-GEO-003 | 8 | Transactions with high-risk country counterparties | ≥ 2 transactions, ≥ USD 5,000 |

---

## For instructors

Each notebook is structured consistently:

- **Section 0 — Setup:** dataset generation (run once per session)
- **Section 1 — Colab Preview:** the exact code printed in the chapter, producing identical output to the book
- **Section 2+ — Exercise sections:** deeper analysis tied to numbered exercises in the text
- **Reflection cells:** editable markdown cells for structured written answers

The `chapter_solutions.ipynb` notebook contains example answers for all reflection cells. It is intended for instructor use only.

---

## Corrections and updates

If you find an error, please open an issue at [github.com/ComplianceAnalytics/aml-book1/issues](https://github.com/ComplianceAnalytics/aml-book1/issues) or email corrections@complianceanalytics.co.uk.

---

*© Compliance Analytics Ltd. All dataset content is synthetic and fictional. Northgate Retail Bank does not exist. No real customer, transaction, or financial data is included.*

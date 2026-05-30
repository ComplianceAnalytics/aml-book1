# Applied AML Analytics: Turning Data Science Skills into Compliance Decisions
## Transaction Monitoring, Segmentation, Scenario Tuning, Machine Learning, and Model Validation
### Companion Notebooks — Book 1

**Publisher:** Compliance Analytics Ltd  
**Organisation:** [github.com/ComplianceAnalytics](https://github.com/ComplianceAnalytics)  
**Contact:** info@complianceanalytics.co.uk

---

## About this repository

This repository contains the Google Colab companion notebooks and dataset generator for **Book 1** of the *Applied AML Analytics* series. Every code example printed in the book runs here — with real output, embedded charts, and structured exercise answer cells.

No software installation is required. All notebooks run in Google Colab using only libraries that are pre-installed in the Colab environment (pandas, scikit-learn, matplotlib).

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
| **5** | Customer Segmentation — K-Means clustering on behavioural features, segment labelling exercise | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_05.ipynb) |
| **6** | Scenario Tuning — Rule 2 (velocity), responsiveness analysis, cross-rule alert overlap | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_06.ipynb) |
| **7** | Coverage Assessment — Rule 3 (high-risk country counterparty), three-rule coverage matrix | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_07.ipynb) |
| **8** | ML Triage — Isolation Forest on the full alert pool, SHAP explainability, governance framework | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_08.ipynb) |

Chapters 2, 9, and 10 do not have coding exercises and have no companion notebooks.

---

## Repository structure

```
aml-book1/
├── notebooks/
│   ├── chapter_03.ipynb      ← Chapter 3 companion (this repo's template)
│   ├── chapter_04.ipynb
│   ├── chapter_05.ipynb
│   ├── chapter_06.ipynb
│   ├── chapter_07.ipynb
│   └── chapter_08.ipynb
├── assets/
│   └── cal_logo_banner.png   ← Compliance Analytics Ltd logo (displayed in notebooks)
└── README.md
```

The **Northgate Retail Bank dataset** is generated inside each notebook's Section 0 setup cell. There is no separate download — the dataset is synthetic and reproducible from a fixed random seed (42). Running the setup cell in any notebook produces identical data every time.

---

## The Northgate dataset

| File generated | Rows | Description |
|----------------|------|-------------|
| `nb_transactions.csv` | 23,188 | All transactions, Jan–Dec 2023 |
| `nb_customers.csv` | 500 | Customer and account records |
| `nb_counterparties.csv` | 300 | Counterparty firms with country codes |
| `nb_accounts.csv` | 500 | Account metadata |

Six accounts (`ACC0001`–`ACC0006`) are embedded mule accounts with structuring behaviour: 3–8 cash deposits per month, each just below USD 10,000, transacting primarily with counterparties in high-risk jurisdictions. All data is **entirely synthetic**. Northgate Retail Bank does not exist.

---

## Three-rule detection system built across Chapters 4–8

| Rule ID | Chapter | Detection logic | Threshold |
|---------|---------|-----------------|-----------|
| NRB-STRUCT-001 | 4 | Rolling 30-day cash deposits | > USD 7,500, ≥ 3 transactions |
| NRB-VEL-002 | 6 | Rapid-fire transactions in short window | ≥ 5 transactions in 14 days |
| NRB-GEO-003 | 7 | Transactions with high-risk country counterparties | ≥ 2 transactions, ≥ USD 5,000 |

Chapter 8 applies Isolation Forest across all accounts that trigger any of the three rules. All six mule accounts rank in positions 1–6 by anomaly score.

---

## For instructors

Each notebook is structured in three sections:

- **Section 0 — Setup:** dataset generation (run once, shared across all chapters)
- **Section 1 — Colab Preview:** the exact code printed in the chapter's blue code box, producing identical output to what appears in the book
- **Section 2 — Exercise Extension:** deeper analysis that extends the main-text example; structured with `✏️ YOUR OBSERVATION` prompts
- **Section 3 — Reflection / Answer cells:** editable markdown cells for structured written answers

Notebooks can be assigned directly — students click the badge, run Section 0, and work through the exercise without any local setup. Answer cells can be downloaded as `.ipynb` for submission.

---

## Corrections and updates

If you find an error in a notebook, please open an issue at [github.com/ComplianceAnalytics/aml-book1/issues](https://github.com/ComplianceAnalytics/aml-book1/issues) or email corrections@complianceanalytics.co.uk.

Because notebooks are hosted on GitHub, corrections appear immediately for all readers — no second edition required.

---

*© Compliance Analytics Ltd. All dataset content is synthetic and fictional. No real customer, transaction, or financial data is included in this repository.*

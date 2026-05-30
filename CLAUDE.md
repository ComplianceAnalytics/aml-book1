# CLAUDE.md — Book 1: Applied AML Analytics (Project Facts)
**Full title:** Applied AML Analytics: Turning Data Science Skills into Compliance Decisions
**Subtitle:** Transaction Monitoring, Segmentation, Scenario Tuning, Machine Learning, and Model Validation
**Author:** Haibo Zhang | **Edition:** First
**Contact:** haibo@compliance-analytics.co.uk | compliance-analytics.co.uk

> **Authoring instructions** (writing style, pedagogy, vocabulary, exercise rules, terminology decisions, chapter drafting structure) live in the **/aml-book skill** — invoke with `/aml-book` before drafting or editing content.

---

## Response Style

Reply with zero conversational filler. No meta-commentary, no compliments, no lengthy transitions, and no markdown tables unless explicitly requested.

---

## Chapter Status

| Ch | Title | Status |
|----|-------|--------|
| Preface | Why this book matters | Draft |
| 1 | Introduction to AML | Draft |
| 2 | Key Regulations & Regulatory Landscape | Draft |
| 3 | Transaction Monitoring — Overview | To do |
| 4 | Evolution of TMS & TM Framework / Scenario Design | To do |
| 5 | Segmentation | To do |
| 6 | Tuning & Calibration | To do |
| 7 | Risk & Coverage Assessments | To do |
| 8 | Event Triage & Machine Learning | To do |
| 9 | Model Validation Framework | To do |
| 10 | The Future of AML | To do |
| Appendix | Vocabularies | To do |
| Appendix | About the Author | Done |

Colab exercises: Ch 3–8 only.

---

## Tech Stack & File Paths

**docx generation:** Node.js scripts using `docx` npm package at `AML_Book_Project/`

| Script | Output |
|--------|--------|
| ch_preface_ch1.js | Book1_Preface_Chapter1.docx |
| ch2.js – ch10.js | Book1_Chapter2.docx – Book1_Chapter10.docx |
| appendix.js | Book1_Appendix_Vocabulary.docx |

Run: `node <script>.js` from `AML_Book_Project/` directory.
Charts (PNG) embedded via `ImageRun`; output boxes via `outputBox()` helper (green, Courier New).

---

## GitHub & Colab

**Org:** github.com/ComplianceAnalytics
**Repo:** `aml-book1`
**Notebook path pattern:** `notebooks/chapter_0X.ipynb`
**Colab URL pattern:** `https://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_0X.ipynb`
**README:** `notebooks/README.md` (has Open in Colab badges, dataset table, three-rule system table)

---

## Northgate Dataset

Generated in Section 0 of each notebook (seed 42, reproducible). No separate download.

| File | Rows | Description |
|------|------|-------------|
| nb_transactions.csv | 23,188 | All transactions, Jan–Dec 2023 |
| nb_customers.csv | 500 | Customer and account records |
| nb_counterparties.csv | 300 | Counterparty firms with country codes |
| nb_accounts.csv | 500 | Account metadata |

Six mule accounts (ACC0001–ACC0006): 3–8 cash deposits/month each just below USD 10,000; primarily transact with high-risk jurisdiction counterparties.

---

## Three-Rule Detection System

| Rule ID | Ch | Detection logic | Threshold |
|---------|---|-----------------|-----------|
| NRB-STRUCT-001 | 4 | Rolling 30-day cash deposits | > USD 7,500, ≥ 3 transactions |
| NRB-VEL-002 | 6 | Rapid-fire transactions in short window | ≥ 5 transactions in 14 days |
| NRB-GEO-003 | 7 | Transactions with high-risk country counterparties | ≥ 2 transactions, ≥ USD 5,000 |

Ch 8: Isolation Forest across all accounts triggering any rule. All six mule accounts rank 1–6 by anomaly score.

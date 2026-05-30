# BOOK1_OUTLINE.md — Applied AML Analytics: Turning Data Science Skills into Compliance Decisions
**Subtitle:** Transaction Monitoring, Segmentation, Scenario Tuning, Machine Learning, and Model Validation  
**Type:** Introductory Textbook | **Author:** Haibo Zhang | **Edition:** First

---

## Chapter 1 — Preface & Introduction to AML
- History and origins of anti-money laundering regulation
- The three stages of money laundering: Placement, Layering, Integration
- Bank obligations under AML law
- Overview of how TM fits within the broader AML control framework
- *Learning objectives, chapter map, prerequisite guide*

## Chapter 2 — Key Regulations & Regulatory Landscape
**United States**
- Bank Secrecy Act (BSA, 1970) — Customer ID, SAR reporting, record-keeping
- Money Laundering Control Act (1986) — Criminalises laundering
- USA Patriot Act (2001) — Enhanced CDD, terrorist financing provisions
- AMLA (2020) — Beneficial ownership, information sharing
- FinCEN — Enforcement and guidance body

**European Union**
- AMLD 1–4 (1991–2014) — CDD, SAR, member state cooperation
- AMLD 5 (2018) — Risk-based approach, crypto regulation, beneficial ownership
- AMLD 6 (latest) — Expanded risk-based scope
- FATF — International standards body (40 Recommendations)

**United Kingdom**
- Money Laundering Regulations (MLRs) — Implements AMLD in UK law
- FCA — Regulator and enforcement body
- NECC — AML investigations (successor to SOCA)
- PRA CS 6/23 — Model Risk Management supervisory standard

**Singapore**
- MAS Notice 1070 — Risk management principles
- MAS TRM Guidelines — Technology risk management
- CDSA — Criminalises laundering, confiscation powers

**Key Guidance Bodies**
- FATF 40 Recommendations
- FFIEC BSA/AML Examination Manual
- JMLSG UK financial services guidance

## Chapter 3 — Transaction Monitoring — Overview
- Data collection and data sources
- Scenario development methodology
- The alerting process
- Alert review workflow
- SAR/STR filing obligations and process
- TM as part of the broader financial crime control framework

## Chapter 4 — Evolution of TMS & TM Framework
- Historical systems: manual monitoring
- Profiling-based systems
- Rule-based systems
- AI/ML-driven systems
- Scenario design walkthrough: structuring example
- How to evaluate a TM system

## Chapter 5 — Segmentation
- Why segmentation matters in AML TM
- Top-down vs bottom-up segmentation approaches
- K-Means clustering
- Hierarchical clustering
- Topological Data Analysis (TDA)
- Practical exercises in R and Python

## Chapter 6 — Tuning & Calibration
- Threshold tuning fundamentals
- Above the Line (ATL) / Below the Line (BTL) concepts
- Hypergeometric sampling for tuning
- L1 / L2 / L3 investigation levels
- Rule-responsiveness analysis
- When to re-tune vs rebuild

## Chapter 7 — Risk & Coverage Assessments
- Risk coverage mapping methodology
- FFIEC red-flag framework
- Using NLP to automate coverage analysis
- Documenting coverage gaps
- Risk Coverage Mapping Sheet (companion template)

## Chapter 8 — Event Triage & Machine Learning
- Sources of noise and false positives in TM
- Event hibernation, escalation, expiration
- Unsupervised ML (UML) for alert scoring
- Dynamic risk scoring approaches
- Practical ML implementation considerations

## Chapter 9 — Model Validation Framework
- MRM regulatory requirements: SR 11-7 (US), PRA CS 6/23 (UK)
- EU and Singapore equivalents
- The Five Pillars of AML Model Validation:
  1. Model Governance
  2. Model Framework
  3. Data Quality
  4. Model Methodology
  5. Model Documentation
- Data quality in model validation
- Common validation failures and how to avoid them

## Chapter 10 — Future of AML
- FinTech and digital banking challenges
- Blockchain and crypto analysis (Binance case study)
- AI developments in AML
- The metaverse as an emerging risk
- Where the profession is heading

---

## Teaching Examples — Notable AML Fines

| Institution | Year | Fine | Reason |
|---|---|---|---|
| Binance | 2023 | $4.3B | Money laundering, sanctions violations |
| Danske Bank | 2018 | $2.2B | Weak controls, Estonian branch scandal |
| HSBC | 2012 | $1.9B | Drug cartel laundering |
| Standard Chartered | 2019 | $1.1B | Inadequate CDD & monitoring |
| Deutsche Bank | 2019/2023 | £163M + $186M | Inadequate AML controls |

---

## Companion Materials (Book 1)
- Exercises in R and Python (Chapters 5, 6, 7, 8)
- Instructor solutions manual
- Datasets for exercises
- Links to: FFIEC, JMLSG, Wolfsburg, FCA/FinCEN glossaries
- Vendor brochures: Actimize, Mantas, Quantexa, Fircosoft

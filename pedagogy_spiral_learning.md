# Spiral Learning Architecture for the AML Book
## Applied AML Analytics: Turning Data Science Skills into Compliance Decisions
**Subtitle:** Transaction Monitoring, Segmentation, Scenario Tuning, Machine Learning, and Model Validation
### Applying Kochan's Pedagogy to AML Transaction Monitoring

---

## Part I — The Pedagogical Principle

Kochan's power move in *Programming in Objective-C* is deceptively simple: he introduces a
Fraction class in the early chapters, then **refuses to throw it away**. Every time he needs to
teach a new concept — memory management, protocols, exception handling, delegation — he reaches
back for the Fraction class and asks: *what happens when we apply this to something you already
know?* The new concept lands in familiar ground. The student spends no cognitive energy
re-understanding the Fraction; they spend it entirely on the new technique being applied to it.

The deeper principle: **the evolving example converts isolated technique demonstrations into a
unified narrative of a single thing growing more capable.** By Chapter 21, the student has not
just learned twenty concepts. They have built one application, feature by feature. The final
product is theirs. That ownership is the emotional glue that makes the book sticky.

For the AML book, the equivalent thread is **a real investigation** — not a static dataset, but a
living, growing picture of criminal activity that the student watches the TMS system discover,
analyse, and ultimately resolve. Each chapter's technique should feel like a new instrument the
analyst picks up to understand something that was already confusing them from the prior chapter.
The student should finish Chapter 10 feeling not that they have completed ten labs, but that they
have **solved a case.**

---

## Part II — Why Three Cases, Not One

Kochan had one case because Objective-C is, at its core, a language for building classes that
operate on data. There is one fundamental abstraction: objects and messages.

AML analytics has three fundamental abstractions that must each be learnt:

1. **The criminal behaviour** — typologies, networks, data patterns (what we are looking for)
2. **The detection apparatus** — rules, thresholds, models (how we look for it)
3. **The institutional framework** — governance, validation, reporting (whether we can trust
   what we found)

A single customer case (Northgate alone) can only carry the first dimension. The student never
feels the weight of the second and third dimensions unless those too have a running, evolving
example. Three cases is not three times the cognitive load; the cases are interconnected, so
each illuminates the others. The student learns the same event from three different vantage points,
which is precisely how real AML investigation teams work.

---

## Part III — The Three Case Studies

### Case A — The Northgate Mule Network *(The Placement Problem)*

Already established in the book: six retail accounts, NRB-STRUCT-001 structuring typology,
GBP 8,200 average monthly cash-in per account, 500-customer population, GBP 7,500 threshold.

**What it teaches:** raw transaction data structure, peer group construction, rule-based
detection, statistical thresholds, alert triage, basic ML classification, SAR narrative drafting.

**Why it is the right "Fraction":** It is simple enough to introduce in Chapter 2, concrete enough
to stay interesting in Chapter 9. Each chapter adds a layer — first the raw data, then the peer
group, then the rule, then the narrative, then the ML model, then the validation. The student
always knows what Northgate is; they only need to learn what the new tool does to it.

**The character of the data:** structured, retail, account-level. NRB-STRUCT-001 fires on
single-account aggregation. The mule accounts are not connected to each other on paper — the
connection only becomes visible in a network graph.

---

### Case B — Meridian Trading Ltd *(The Layering Problem)*

A UK-registered import/export business, ostensibly dealing in industrial components. On paper:
legitimate. In practice: the receiving end of the Northgate money flows. Meridian pays inflated
invoices to overseas suppliers — the classic trade-based money laundering (TBML) over-invoicing
variant — and two of its directors share beneficial ownership links with Northgate account holders
via a Companies House filing neither the KYC team nor the TMS noticed.

**What it teaches:** entity resolution vs. entity consolidation (Northgate individuals ≠ Meridian
directors until you check the registry), the TBML typology, graph analytics and network
visualisation, NLP applied to trade documents, commercial data quality challenges, and the limits
of transaction-only monitoring.

**Why it is the right "Calculator":** Meridian cannot be fully understood without Northgate, just
as Kochan's Calculator class only makes sense once you have a Fraction to operate on. The student
first sees Meridian in Chapter 4 as a standalone commercial anomaly. In Chapter 6, a cross-case
rule fires and the student realises money is flowing from Northgate accounts into Meridian. By
Chapter 10, the full three-stage ML cycle — placement (Northgate) → layering (Meridian) →
integration (offshore) — is visible in a single graph. The "aha" moment is Chapter 6.

**The character of the data:** semi-structured, commercial, multi-source. Invoice PDFs, SWIFT
messages, Companies House filings, commodity codes. Every data challenge that Northgate makes
look easy, Meridian makes hard.

---

### Case C — Project Sentinel *(The Institutional Problem)*

Not a suspicious entity. A bank's internal TMS programme — the cross-functional team building,
calibrating, deploying, and validating the detection system that is supposed to catch Northgate
and Meridian. The project has four roles the student will encounter across chapters:

- **The data scientist:** builds peer groups, trains models, wrestles with null rates.
- **The compliance officer (1st Line):** writes rule logic, tunes thresholds, reviews alerts.
- **The model risk manager (2nd Line):** validates the model, applies the five-pillar framework.
- **The internal auditor (3rd Line):** challenges the validation, tests the governance paper trail.

Project Sentinel is never the main subject of a chapter. It appears in callouts, exercise
framings, and the stretch exercises (Part C of each chapter). But by Chapter 9, the student
understands that Sentinel is the institutional machinery behind everything they have been doing.

**Why it is the "iPhone app":** In Kochan's book, the iPhone app is where Fraction and Calculator
finally combine in a user-facing, deployed system. Project Sentinel is where Northgate's data,
Meridian's network, and all the models and rules come together in a real institutional output —
a validation report, a SAR, a regulatory thematic review response. Without Sentinel, the student
never sees why any of it matters. With Sentinel, the book earns its subtitle.

---

## Part IV — Chapter-by-Chapter Evolution

### Chapter 1 — The Regulatory Landscape

**Current state:** regulatory overview without a running example.

**Spiral addition:** Open the chapter with a short fictional vignette — a one-page FCA Final
Notice summary: *"UK retail bank fined £38 million for systemic failure to detect structured cash
deposits and associated trade-based layering activity across a six-year period."* The notice names
no individuals, but references a mule network (Northgate), a connected trading company (Meridian),
and the bank's TMS programme (Sentinel) as the subject of the examination. End the vignette with:
*"By the end of this book, you will be able to explain exactly how this happened, and exactly how
a well-designed TMS could have prevented it."*

This plant costs half a page. It pays off across every subsequent chapter.

**Exercise evolution:**
- **Part A:** Map the regulatory obligations triggered by Northgate's activity: MLR 2017
  (suspicious activity reporting), POCA 2002 (failure to disclose), FCA SYSC 6.3 (TMS adequacy).
- **Part B:** Do the same for Meridian. Students will find that trade finance introduces
  additional layers — HMRC reporting, trade sanctions screening, correspondent bank due diligence.
  The contrast teaches that the regulatory perimeter is not one-size-fits-all.

---

### Chapter 2 — The Transaction Monitoring System

**Spiral addition:** Introduce Northgate's data structure — a simplified account schema, 12 months
of transaction history, shown as a table with 8–10 fields. One paragraph introducing it; one small
table. Introduce Project Sentinel with one sentence in a callout: *"Project Sentinel is the bank's
internal programme tasked with building and maintaining the TMS that monitors accounts like these.
We will return to Sentinel throughout the book."*

**Exercise evolution:**
- **Part A:** Draw the data flow for Northgate's transaction data from the core banking system
  to the alert queue. Label each transformation point and the data quality risk at each step.
- **Part B (out-of-the-box):** Meridian's trade finance activity is recorded in SWIFT MT700
  messages — not in the same core banking feed as Northgate's retail transactions. What TMS
  configuration changes does Project Sentinel need? What new data sources must be onboarded?
  What could go wrong at the ingestion layer?

---

### Chapter 3 — Data Foundations

**Spiral addition:** Northgate's dataset is already the chapter's data spine. Add Meridian's
dataset as the "harder version" of the same DQ problem. Northgate has structured transaction
records with well-defined CDEs. Meridian has semi-structured invoice data, free-text goods
descriptions, and beneficial ownership records spread across three registries (Companies House,
an overseas corporate registry, and the bank's own KYC system — which disagrees with the other
two on two director names).

**Exercise evolution:**
- **Part A:** Apply the DQ four-step (Lineage → Reconciliation → CDE Testing → Feedback Loop)
  to Northgate's transaction data.
- **Part B:** Apply the same four-step to Meridian's invoice data. Students discover that
  "Lineage" is harder (which system of record owns a trade invoice?), "Reconciliation" is harder
  (what is the ground truth for an over-inflated commodity price?), and "CDE Testing" reveals null
  patterns that look benign but are actually informative — the No Data is Bad Data principle
  applied to commercial data.
- **Part C (stretch):** Which of Northgate's CDEs would also qualify as Meridian CDEs? Where
  do the DQ protocols need to diverge, and where do they share structure? This exercise plants the
  idea of a *unified data model* for a multi-typology TMS — the subject of Book 2.

---

### Chapter 4 — Typologies

**Spiral addition:** Introduce both typologies explicitly. Northgate is NRB structuring (placement).
Meridian is TBML, over-invoicing variant (layering). Show the three-stage placement → layering →
integration framework and map each case to its stage. Then — critically — plant the connection.
One sentence, buried in the Meridian section: *"Among the beneficiary accounts receiving transfers
from Northgate account holders, one entity appears consistently: Meridian Trading Ltd, registered
in Companies House under SIC code 46690 (Wholesale of other machinery and equipment)."*

That sentence is the hinge of the whole book. Everything before it is parallel cases. Everything
after it is one investigation.

**Exercise evolution:**
- **Part A:** Map the Northgate network to the FATF typology taxonomy. Which of the FATF's
  red flag indicators are present in the transaction data already seen in Chapters 2 and 3?
- **Part B:** Do the same for Meridian. Students will find TBML red flags are substantially
  harder to operationalise from transaction data alone — they require trade documents, commodity
  price benchmarks, and shipping records not typically in a TMS feed. The out-of-the-box question:
  *what does the TMS need that it does not currently have, and what organisational change is
  required to get it?*
- **Part C (stretch):** If Northgate and Meridian are structurally connected, what does that
  do to the typology classification? Is this still two typologies, or one composite typology?
  What is the regulatory difference between detecting them separately vs. detecting them as a
  network?

---

### Chapter 5 — Statistical Baselines and Thresholds

**Spiral addition:** Set the GBP 7,500 threshold for Northgate's cash-in monitoring (already
established). Then apply the same peer group methodology to Meridian — but now ask: what is
Meridian's peer group? Import/export businesses with similar turnover and SIC code. Students will
find commercial peer groups are far harder to define than retail peer groups. Meridian's monthly
wire volume looks anomalous even within its peer group — but is the peer group itself valid?

Project Sentinel's data scientist enters here in a callout: *"When a clean commercial peer group
cannot be constructed, the Sentinel team's data scientist proxies from SIC code and annual
turnover bands registered at Companies House. This approach introduces survivorship bias — only
registered, active businesses appear in the proxy — but it is the best available approximation."*

**Exercise evolution:**
- **Part A:** Compute Northgate account-level z-scores using the peer group established in
  the chapter. Identify which accounts fall outside the ATL/BTL boundary.
- **Part B:** Design a statistical peer group for Meridian Trading Ltd. Specify the variables,
  data sources, and construction method. Identify the three biggest risks in your proxy approach.
- **Project Sentinel extension:** Given the proxy peer group constructed in Part B, what
  threshold would Project Sentinel's compliance officer recommend? Justify using the same cost
  matrix methodology applied to Northgate's GBP 7,500 threshold.

---

### Chapter 6 — Rule-Based Detection

**Spiral addition:** Fire NRB-STRUCT-001 on Northgate (already the chapter's core). Write
TBML-INVOICE-001 for Meridian (invoice-to-market-price ratio > 2.0 for declared commodity, using
a commodity price benchmark feed). Show both rules firing. Then write the pivot rule:
LINK-CROSS-001 — fires when a Northgate-alerted account appears as a named beneficiary in
Meridian's incoming payment ledger within the same 90-day window.

LINK-CROSS-001 is the moment the investigation becomes one investigation. Make it explicit in
the chapter text: *"A link rule is not a typology detector. It does not tell you what the criminal
behaviour is. It tells you that two things you were watching separately are connected. The analyst's
job now changes: instead of two independent alert queues, there is one network to map."*

**Exercise evolution:**
- **Part A:** Tune NRB-STRUCT-001. Vary the look-back window (14-day, 30-day, 90-day) and the
  threshold (GBP 7,000, GBP 7,500, GBP 8,000). Build a precision/recall matrix for each variant.
- **Part B:** Write TBML-INVOICE-001 from scratch. Students must identify the required data
  elements, locate the data sources, write the rule logic, and estimate the false positive rate.
  There is no template — this is a genuine design exercise.
- **Part C (stretch):** Write LINK-CROSS-001. What are the false positive risks? What look-back
  window is appropriate, and why? What would reduce false positives without sacrificing recall?
  Consider: how should the alert be routed — to the Northgate analyst's queue, the Meridian
  analyst's queue, or a third, specialist network analyst?

---

### Chapter 7 — NLP and Text Analytics

**Spiral addition:** Apply NLP to two text corpora simultaneously. Northgate's transaction
narratives are short and coded (*"mobile top-up," "rent," "transfer to sister"*). Meridian's
invoice goods descriptions are longer and technical (*"industrial compressors, model XC-1200,
CIF Rotterdam"*). The contrast between the two text types is itself the pedagogical object — it
motivates why no single NLP approach fits all AML use cases, and why text data from a commercial
TMS feed requires a fundamentally different pipeline from retail transaction narratives.

**Exercise evolution:**
- **Part A:** Build the Northgate narrative classifier (keyword matching + frequency analysis).
  Identify which transaction narrative patterns correlate with the NRB-STRUCT-001 alert population.
- **Part B:** Apply named entity recognition to Meridian's goods descriptions to extract commodity
  types. Cross-reference against a sanctioned goods list (provided as a CSV). Students will find
  that trade NLP is substantially harder — ambiguous commodity names, abbreviations, transliterated
  text, multi-language fields. The out-of-the-box question: *how would you handle a goods
  description written partially in Mandarin?*
- **Part C (stretch):** Meridian's SAR draft narrative (produced by the Chapter 7 NLP pipeline)
  references "industrial compressors" shipped to a country that also appears in a recent FATF
  mutual evaluation report. Write a prompt for an LLM-assisted SAR enrichment tool that would
  flag this connection and recommend language for the SAR. Then write a one-paragraph governance
  note: is this LLM tool a model under SR 11-7? If yes, what does that require of Project Sentinel?

---

### Chapter 8 — Alert Triage and Machine Learning

**Spiral addition:** The 200-alert synthetic dataset (already established as the output of
NRB-STRUCT-001 on the 500-customer population at the GBP 7,500 threshold) should now include
Meridian-linked alerts generated by TBML-INVOICE-001 and LINK-CROSS-001. The combined alert
population has very different feature distributions across the two alert types. This is not a
problem to be solved — it is the data reality the student must face.

Project Sentinel enters explicitly. A callout presents the governance question: *"When the model
is trained on two structurally different alert subpopulations, the 2nd Line model risk manager
will ask: does this model generalise across both? The answer requires testing it separately on
each subpopulation, not only on the combined population."*

**Exercise evolution:**
- **Part A:** Train a gradient boosting classifier on the combined alert dataset. Report accuracy,
  precision, and recall separately for Northgate alerts and Meridian alerts. Note any significant
  divergence.
- **Part B (out-of-the-box):** The model scores a Northgate structuring alert as high-risk (0.89)
  and a Meridian invoice-manipulation alert with structurally similar financial anomaly scores as
  low-risk (0.23). Use SHAP values to explain the divergence. What does this tell you about the
  model's implicit assumptions? What would you do next?
- **Part C (stretch):** Design a subpopulation fairness test for the combined model. Define what
  "fairness" means in this context — note that the usual definition (demographic parity) does not
  apply. Propose a metric and a threshold. Then: present this to a hypothetical 2nd Line model
  risk manager in three sentences. What do you lead with?

---

### Chapter 9 — Model Validation

**Spiral addition:** Project Sentinel's formal model validation exercise. The five-pillar framework
is applied to the Chapter 8 ML model. The Northgate and Meridian datasets are the validation
datasets. The DQ protocol from Chapter 3, re-applied formally for the first time since it was
introduced, is now the Pillar 3 validation workstream — and the student will notice that Meridian's
invoice data has not improved since Chapter 3. That stale data quality problem, unresolved across
six chapters, is now a validation finding.

The regulatory stakes become real: Project Sentinel receives a fictional FCA Dear CEO letter on
TMS model adequacy. One sentence from the letter appears in a callout. The exercise asks students
to respond.

**Exercise evolution:**
- **Part A:** Apply the five-pillar validation framework to the Chapter 8 ML model. Produce a
  findings table: pillar, finding, severity (Low/Medium/High/Critical), and owner.
- **Part B:** Write a Model Risk Committee (MRC) paper summarising the validation findings.
  Hard limit: 500 words. Students must decide what is material and what is not. They cannot
  include everything — that is the exercise. This is a genuine out-of-the-box task because there
  is no template for MRC papers in the regulatory literature; every firm writes them differently.
- **Part C (stretch):** The 3rd Line internal auditor challenges the DQ finding on Meridian's
  invoice data. Her position: *"Invoice data is inherently incomplete in trade finance. A 34%
  null rate on goods description is within industry norms and should not be rated High."* Write
  the 2nd Line model risk manager's counter-argument. Reference the No Data is Bad Data principle
  and the DQ four-step protocol. Maximum: 300 words.

---

### Chapter 10 — Emerging Risks and the Frontier

**Spiral addition:** The investigation has evolved. Three Northgate mule accounts have begun
using a crypto exchange as an intermediate step. Meridian's principal director has moved a tranche
of funds through a DeFi protocol. The GNN now reveals a three-layer subgraph:

- **Layer 1 (Northgate):** Retail cash structuring — placement
- **Layer 2 (Meridian):** Trade-based wire transfers — layering
- **Layer 3 (Crypto cluster):** Wallet-to-wallet hops through a mixer — integration/obfuscation

This is the book's culminating synthesis. The student can see the full three-stage ML cycle
across all three cases simultaneously, in one graph. The Settle→Stake→Blend framework applies
cleanly across the three layers.

**The capstone:** Project Sentinel's compliance officer submits the TMS Effectiveness Statement
to the FCA. The statement must reference: the NRB-STRUCT-001 rule, the TBML-INVOICE-001 rule,
the LINK-CROSS-001 network rule, the Chapter 8 ML model, its Chapter 9 validation, the Chapter 7
NLP enrichment layer, and the Chapter 10 GNN. Every prior chapter's output is now one sentence
in the statement. The student realises: this is what "integrated TMS" means.

**Exercise evolution:**
- **Part A:** Extend the Northgate GNN to include the crypto wallet cluster. What new data
  sources does Project Sentinel need? What new DQ challenges emerge? What new typology rules
  would you write?
- **Part B:** Apply the Settle→Stake→Blend framework to the full Northgate → Meridian → Crypto
  arc. Map each stage to a detection layer (rule-based, statistical, ML, network analytic).
  Where does the framework break down? What does that tell you about the limits of the current
  TMS?
- **Part C — The Capstone:** Write a 600-word TMS Effectiveness Assessment for Project Sentinel,
  addressed to the FCA. Cover: (1) what the TMS detected and when, (2) what it missed and why,
  (3) what model validation confirmed, and (4) what remediation is planned. Reference specific
  chapter outputs by name. Grade the TMS honestly: did it do its job? Be prepared to defend your
  grade.

---

## Part V — The Recurring Exercise Architecture

Kochan's exercise pattern is consistent across 21 chapters: here is the class as it stands at
the end of this chapter; add one feature. The student always knows the starting state. The
uncertainty is in the implementation. That consistency is not laziness — it is the source of
the book's low cognitive overhead.

For the AML book, the equivalent pattern for every chapter:

> *"We continue with [Case A / Case B / Case C]. At the end of Chapter [N−1], [state of the
> case at that point]. In this chapter's exercise, you will apply [the chapter's core technique]
> to extend the analysis."*

**Per chapter, three exercises:**

| Exercise | Label | Case | Character |
|---|---|---|---|
| Part A | Foundational | Northgate (Case A) | Apply the chapter technique to familiar data. Low context load, high technique load. Always code or computation. |
| Part B | Applied | Meridian (Case B) | Same technique, harder data, different typology. Student must genuinely adapt — not copy. Often includes design decisions. Always has an out-of-the-box element. |
| Part C | Synthesis / Stretch | Cross-case or Project Sentinel | Connect A and B, or adopt the institutional perspective. Optional marker. Hardest of the three. Often written rather than coded. |

The Part C exercises are the author's natural home for out-of-the-box thinking. They cannot be
solved algorithmically. They require the student to hold two vantage points simultaneously and
write something defensible under pressure — exactly the skill AML analysts need.

---

## Part VI — The Kochan Parallel, Side by Side

| Kochan — *Programming in Objective-C* | AML Book — *From Regulation to Detection* |
|---|---|
| Fraction class (numerator, denominator, arithmetic ops) | Northgate Mule Network (6 accounts, NRB-STRUCT-001, GBP 8,200/month) |
| Calculator class (operand1, operand2, accumulator, performOperation) | Meridian Trading Ltd (TBML, over-invoicing, entity resolution, LINK-CROSS-001) |
| iPhone app (Fraction + Calculator combined in a deployed UI) | Project Sentinel (the institutional TMS programme that deploys and validates the detection of both) |
| Ch 3: Fraction class introduced simply | Ch 2: Northgate account schema introduced simply |
| Ch 6: Calculator class introduced; uses Fraction | Ch 4: Meridian introduced; connection to Northgate planted |
| Ch 8: Fraction evolved to support operator overloading | Ch 6: LINK-CROSS-001 fires; investigation becomes one network |
| Ch 21: Everything converges in one iPhone app | Ch 10: GNN reveals three-layer network; Project Sentinel submits TMS effectiveness report |
| "Add a subtract method to Fraction" | "Extend NRB-STRUCT-001 to detect aggregate structuring across all six Northgate accounts simultaneously" |
| Learning outcome: you built a working Objective-C application | Learning outcome: you designed, deployed, and validated a complete AML TMS against a real investigation |

---

## Part VII — What Stays, What Changes

**What already exists and should be preserved:**

- Northgate is fully established. GBP 8,200/month, 500-customer population, GBP 7,500 threshold,
  NRB-STRUCT-001 — these are the anchors around which everything else is built.
- "From School to Practice" callouts already carry the Kochan-style "here is what real analysts
  do" voice. These are the natural home for Project Sentinel vignettes.
- Later chapters (8, 9, 10) already have substantive exercises. The Sentinel persona can be woven
  in without rewriting — typically a one-paragraph framing change and the addition of a Part C.

**What needs to be added (not replaced):**

1. **Chapter 1:** The FCA Final Notice vignette (half a page). The book's opening statement of
   intent.
2. **Chapter 2 or 3:** Meridian Trading Ltd's dataset introduction — one paragraph, one table,
   one early exercise element. Equivalent in size and style to Northgate's introduction.
3. **Chapter 4:** The connection sentence — *"Among Northgate's beneficiary accounts: Meridian
   Trading Ltd."* This is one sentence. It is also the most important sentence in the book.
4. **Chapter 6:** TBML-INVOICE-001 rule and LINK-CROSS-001 rule as new exercise elements.
   These are Part B and Part C of the Chapter 6 exercise set.
5. **Chapters 7–9:** Project Sentinel persona in callouts (already partially present in spirit;
   needs to be made explicit and consistent with the Sentinel name).
6. **Chapter 10:** The capstone synthesis exercise (Part C above). The TMS Effectiveness
   Assessment is the book's equivalent of Kochan's working iPhone app.

**What this does to the book's length:**

Minimal. The Meridian dataset introduction is one page. The connection sentence is one sentence.
The LINK-CROSS-001 exercise is one new Part C per chapter that references it. The capstone is a
500–600 word exercise brief. Total addition: approximately 8–12 pages across 10 chapters, plus
the exercise extensions. The book does not become longer so much as it becomes *continuous*.

---

## Part VIII — The One Thing That Makes This Work

Kochan's spiral works not because he reuses an example, but because the reuse is **motivated**.
Every time the Fraction class reappears, the student can see *why* — there is a new problem with
it, a new capability it needs, a new relationship it has to form with another class. The reuse
never feels gratuitous.

For the AML book, the reuse of Northgate and Meridian must feel equally motivated. The rule:
**every chapter's technique must reveal something about the cases that the prior chapter's
technique could not reveal.** Statistics can tell you the threshold but not the typology.
Rules can classify the typology but not the narrative. NLP can enrich the narrative but not the
network. ML can score the alert but not validate the model. Validation can assess the model but
not report to the regulator. Emerging risk can extend the network but not synthesise the
governance.

Each technique is a new lens on the same investigation. By Chapter 10, the student has looked
at Northgate and Meridian through eight different lenses. They do not just understand eight
techniques. They understand *one investigation*, at depth.

That is Kochan's achievement, translated into AML analytics.

---

*Document prepared for: AML Transaction Monitoring: From Regulation to Detection | Book 1 of
the AML TM Analytics Series*

*Pedagogical reference: Stephen G. Kochan, Programming in Objective-C (multiple editions)*

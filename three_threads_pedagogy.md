# Three-Thread Pedagogical Framework
## Book 1 — Applied AML Analytics: Turning Data Science Skills into Compliance Decisions
**Subtitle:** Transaction Monitoring, Segmentation, Scenario Tuning, Machine Learning, and Model Validation
### Author: Haibo Zhang | Compliance Analytics Ltd

---

## Overview

Every chapter in Book 1 must visibly weave three parallel threads. These threads are not separate sections — they are lenses through which every concept, example, and exercise is viewed simultaneously.

---

## Thread 1 — Business Knowledge (AML Compliance Domain)

**What it covers:**
- AML regulations, red flags, typologies, and risk frameworks
- How financial crime works and how banks are obligated to respond
- The operational reality of a TM analytics team
- Regulatory context: FinCEN, FCA, FATF, MAS, BSA, AMLD, SR 11-7, PRA CS 6/23
- Risk-based thinking: risk appetite, risk tolerance, risk coverage

**How it appears in each chapter:**
- Business context section before any technique is introduced
- Regulatory grounding for why a particular approach is used
- Real-world enforcement examples (Binance, HSBC, Danske Bank, etc.)
- Risk consideration callout boxes

**Design rule:** Never introduce a technique without first establishing the business problem it solves and the risk it manages.

---

## Thread 2 — Classroom Knowledge (University Skills)

**What it covers:**
- Python programming
- SQL and data manipulation
- Statistics (distributions, hypothesis testing, sampling)
- Machine learning algorithms (K-Means, supervised/unsupervised ML, XGBoost)
- Data structures and algorithmic thinking
- Any other technique students will recognise from their degree

**How it appears in each chapter:**
- Explicit "📚 From school to practice:" callout boxes when a university concept is reused
- Acknowledgement of what the student already knows before showing what is different
- Pre-written code cells in Colab notebooks (students run and interpret, not write from scratch)
- Technical explanations that respect the student's existing knowledge base

**Design rule:** Never re-teach a university concept from scratch. Acknowledge it, then show how it is applied differently — with more constraints, messiness, and regulatory consequence — in the real world.

---

## Thread 3 — Practical Application (Classroom Knowledge → Business Problem)

**What it covers:**
- Applying Python, statistics, and ML to AML analytics specifically
- Working with realistic, messy data (the SilverBank synthetic dataset)
- Making risk-based decisions using analytical outputs — not just producing the output
- Building a functioning transaction monitoring system progressively (Chapters 3–8)
- The investigator's workflow: alert → event triage → case → SAR decision

**How it appears in each chapter:**
- Exercises that ask "what decision would you make?" not "write code to do X"
- The progressive SilverBank system build (each chapter adds one real component)
- Analytics-first Colab notebooks: code is pre-written, student interprets and decides
- Extended exercises that invite students to apply the technique to a new business scenario

**Design rule:** Every practical exercise must end with a business decision or recommendation, not just a technical output. The student must demonstrate that they can translate analytical results into risk-based action.

---

## Two Structural Principles

### 1. Simple → Complex
- Each chapter starts with the simplest possible version of a concept or technique
- Complexity is added gradually — within a chapter and across chapters
- The SilverBank system starts with a single threshold rule and grows to a full ML-triage + investigation UI by Chapter 8
- Exercises within a chapter are ordered Foundation → Intermediate → Advanced

### 2. Theory → Practical
- Every concept is introduced theoretically first (what it is, why it exists)
- Then shown in an AML business context (how it is applied in a real bank)
- Then practised hands-on (Colab exercise using SilverBank data)
- Then reflected on with risk framing (what can go wrong, what decision does this drive)

---

## The Integration Test

Before finalising any chapter section, apply this check:

| Thread | Question to ask |
|--------|----------------|
| Business | Does the student understand *why* this matters for AML compliance and what risk it manages? |
| Classroom | Does the student recognise the technique from their degree, and do they understand what is *different* about applying it here? |
| Practical | Can the student translate the analytical output into a real business decision using a risk-based approach? |

If the answer to any of these is "no", the section is incomplete.

---

## End Goal

Students who finish Book 1 should be able to:
1. Walk into an AML analytics team and understand the business context immediately (Thread 1)
2. Apply the technical tools they already know to the specific constraints of compliance analytics (Thread 2 + Thread 3)
3. Make pragmatic, risk-based decisions from analytical outputs — not just produce results (Thread 3)

This is preparation for real-world work, not exam performance.

---

*Compliance Analytics Limited | Book 1 Pedagogical Framework | v1.0 | 2026-05-20*

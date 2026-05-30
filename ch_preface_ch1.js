const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat, TableOfContents,
  ExternalHyperlink
} = require('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/node_modules/docx');
const fs = require('fs');

// ── Colour palette ──────────────────────────────────────────────────────────
const DARK_NAVY   = "1A1A2E";
const MID_BLUE    = "2C3E6B";
const LIGHT_GREY  = "F0F2F8";
const ACCENT_BLUE = "4472C4";
const WHITE       = "FFFFFF";
const BLACK       = "000000";
const WARN_AMBER  = "B05800";

// ── Shared border helper ────────────────────────────────────────────────────
const cellBorder = (color = "CCCCCC") => ({
  top:    { style: BorderStyle.SINGLE, size: 1, color },
  bottom: { style: BorderStyle.SINGLE, size: 1, color },
  left:   { style: BorderStyle.SINGLE, size: 1, color },
  right:  { style: BorderStyle.SINGLE, size: 1, color },
});

// ── Numbering config ────────────────────────────────────────────────────────
const numberingConfig = [
  {
    reference: "bullets",
    levels: [{
      level: 0, format: LevelFormat.BULLET, text: "•",
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } }
    }]
  },
  {
    reference: "sub-bullets",
    levels: [{
      level: 0, format: LevelFormat.BULLET, text: "◦",
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 1080, hanging: 360 } } }
    }]
  },
  {
    reference: "numbers",
    levels: [{
      level: 0, format: LevelFormat.DECIMAL, text: "%1.",
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } }
    }]
  }
];

// ── Helper: standard body paragraph ─────────────────────────────────────────
function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160 },
    ...opts,
    children: [new TextRun({ text, font: "Arial", size: 22, color: "222222" })]
  });
}

// ── Helper: bold inline run ──────────────────────────────────────────────────
function bold(text) { return new TextRun({ text, bold: true, font: "Arial", size: 22, color: "222222" }); }
function run(text)  { return new TextRun({ text, font: "Arial", size: 22, color: "222222" }); }
function italic(text) { return new TextRun({ text, italics: true, font: "Arial", size: 22, color: "222222" }); }

// ── Helper: mixed-run paragraph ──────────────────────────────────────────────
function para(runs, opts = {}) {
  return new Paragraph({ spacing: { after: 160 }, ...opts, children: runs });
}

// ── Helper: bullet ───────────────────────────────────────────────────────────
function bullet(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 100 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: "222222" })]
  });
}

function bulletMixed(runs, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 100 },
    children: runs
  });
}

// ── Helper: numbered item ────────────────────────────────────────────────────
function numbered(text, ref = "numbers") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 100 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: "222222" })]
  });
}

// ── Helper: heading wrappers ─────────────────────────────────────────────────
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, font: "Arial", size: 36, bold: true, color: DARK_NAVY })]
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, font: "Arial", size: 28, bold: true, color: MID_BLUE })]
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: MID_BLUE })]
  });
}

// ── Helper: callout box (shaded paragraph) ───────────────────────────────────
function callout(label, text, fillColor = "E8EEFF") {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [9026],
    rows: [
      new TableRow({
        children: [new TableCell({
          borders: cellBorder(ACCENT_BLUE),
          width: { size: 9026, type: WidthType.DXA },
          shading: { fill: fillColor, type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 180, right: 180 },
          children: [
            new Paragraph({
              spacing: { after: 60 },
              children: [new TextRun({ text: label, font: "Arial", size: 20, bold: true, color: MID_BLUE })]
            }),
            new Paragraph({
              spacing: { after: 0 },
              children: [new TextRun({ text, font: "Arial", size: 20, color: "333333", italics: true })]
            })
          ]
        })]
      })
    ]
  });
}

function calloutMixed(label, paragraphs, fillColor = "E8EEFF") {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [9026],
    rows: [
      new TableRow({
        children: [new TableCell({
          borders: cellBorder(ACCENT_BLUE),
          width: { size: 9026, type: WidthType.DXA },
          shading: { fill: fillColor, type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 180, right: 180 },
          children: [
            new Paragraph({
              spacing: { after: 80 },
              children: [new TextRun({ text: label, font: "Arial", size: 20, bold: true, color: MID_BLUE })]
            }),
            ...paragraphs
          ]
        })]
      })
    ]
  });
}

// ── Helper: exercise box ─────────────────────────────────────────────────────
function exerciseBox(children) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [9026],
    rows: [
      new TableRow({
        children: [new TableCell({
          borders: cellBorder("2E75B6"),
          width: { size: 9026, type: WidthType.DXA },
          shading: { fill: "EBF3FC", type: ShadingType.CLEAR },
          margins: { top: 160, bottom: 160, left: 200, right: 200 },
          children
        })]
      })
    ]
  });
}

// ── Helper: key takeaways box ─────────────────────────────────────────────────
function takeawayBox(items) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [9026],
    rows: [
      new TableRow({
        children: [new TableCell({
          borders: cellBorder("1A7A4A"),
          width: { size: 9026, type: WidthType.DXA },
          shading: { fill: "E6F9F0", type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 180, right: 180 },
          children: [
            new Paragraph({
              spacing: { after: 80 },
              children: [new TextRun({ text: "Key Takeaways", font: "Arial", size: 22, bold: true, color: "1A7A4A" })]
            }),
            ...items.map(t => new Paragraph({
              numbering: { reference: "bullets", level: 0 },
              spacing: { after: 80 },
              children: [new TextRun({ text: t, font: "Arial", size: 20, color: "222222" })]
            }))
          ]
        })]
      })
    ]
  });
}

// ── Helper: simple 2-col table ────────────────────────────────────────────────
function table2col(headers, rows, widths = [3000, 6026]) {
  const headerRow = new TableRow({
    children: headers.map((h, i) => new TableCell({
      borders: cellBorder("999999"),
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: DARK_NAVY, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({
        children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: WHITE })]
      })]
    }))
  });
  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell, ci) => new TableCell({
      borders: cellBorder("CCCCCC"),
      width: { size: widths[ci], type: WidthType.DXA },
      shading: { fill: ri % 2 === 0 ? "FFFFFF" : LIGHT_GREY, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({
        children: [new TextRun({ text: cell, font: "Arial", size: 20, color: "222222" })]
      })]
    }))
  }));
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...dataRows]
  });
}

function spacer() { return new Paragraph({ spacing: { after: 200 }, children: [new TextRun("")] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }

// ════════════════════════════════════════════════════════════════════════════
// DOCUMENT CONTENT
// ════════════════════════════════════════════════════════════════════════════

const children = [

  // ── COVER PAGE ────────────────────────────────────────────────────────────
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 2000, after: 200 },
    children: [new TextRun({ text: "Applied AML Analytics", font: "Arial", size: 56, bold: true, color: DARK_NAVY })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "Turning Data Science Skills into Compliance Decisions", font: "Arial", size: 32, bold: false, color: DARK_NAVY, italics: true })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [new TextRun({ text: "Transaction Monitoring, Segmentation, Scenario Tuning, Machine Learning, and Model Validation", font: "Arial", size: 24, color: MID_BLUE })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "First Edition", font: "Arial", size: 28, color: MID_BLUE, italics: true })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
    children: [new TextRun({ text: "Haibo Zhang", font: "Arial", size: 32, bold: true, color: DARK_NAVY })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "compliance-analytics.co.uk", font: "Arial", size: 22, color: MID_BLUE })]
  }),
  pageBreak(),

  // ── PREFACE ───────────────────────────────────────────────────────────────
  h1("Preface: Why This Book Matters"),
  spacer(),
  calloutMixed("Disclaimer", [
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "All company names, institutions, case studies, scenarios, enforcement actions, and fictional entities used in this book are entirely fictional and created solely for educational purposes. This includes all banks, trading companies, regulatory notices, investigation programmes, and any other named organisations or entities appearing in examples and exercises. Any resemblance to real institutions, companies, regulatory actions, or other real-world entities — whether by name, description, or circumstance — is entirely coincidental and unintentional. Where real regulatory frameworks, published typologies, or actual enforcement actions are cited as reference material, these are explicitly identified as such with full attribution.", font: "Arial", size: 20, color: "222222" })] }),
  ], "FFF8E1"),
  spacer(),

  body("The AML analytics profession has a problem that no one talks about openly: the gap between what universities teach and what banks actually need."),
  body("Students graduate with solid foundations in statistics, machine learning, and computer science. They can code. They can cluster. They can validate models. What they often cannot do is apply those skills in a risk-based, regulated business environment where the cost of getting it wrong is not a bad grade but a billion-dollar fine or a criminal referral."),
  body("This book exists to close that gap."),
  body("It grew out of my own experience — first as a PhD researcher, then as a practitioner building and leading AML analytics teams at HSBC and elsewhere — of watching capable analysts make avoidable mistakes not because they lacked technical skill, but because nobody had ever explained the business context behind the techniques they were using. They knew how K-Means worked. They did not know why peer group segmentation matters to a regulator, or what happens to an alert investigation if the segmentation is wrong."),
  body("Every chapter in this book connects a technical concept to a business risk. Every exercise asks you to make a decision, not just execute a calculation. Every example is drawn from the real world of transaction monitoring — messy, regulated, and consequential."),

  h2("The Central Thread: A Money-Mule Structuring Case"),
  body("To make that connection concrete, this book uses a single running case study throughout. Chapter 1 introduces it for the first time. From Chapter 4 onwards, we apply each major analytical technique to it progressively, building a complete picture of the analytics lifecycle."),
  body("The scenario involves a money-mule network operating through a mid-sized retail bank. The mules conduct structuring: they break large cash deposits into smaller amounts, each below the reporting threshold, to avoid triggering automatic alerts. It is one of the oldest and most common money-laundering techniques, and it is a rich vehicle for teaching because it touches every part of the transaction monitoring lifecycle — rule design, segmentation, threshold calibration, coverage assessment, machine learning triage, and model validation."),
  body("By the time you finish Chapter 9, you will have built, tested, tuned, assessed, and validated a detection model for this scenario. Not in a vacuum, but in context — understanding at each step what risk you are managing, what could go wrong, and what the regulator expects to see."),

  h2("Who This Book Is For"),
  body("This book is written for two overlapping groups."),
  body("The first is students — particularly those studying mathematics, statistics, data science, or computer science — who are entering or considering a career in AML analytics. You will find that much of the technical content is familiar. What this book adds is the business logic: why these tools are used, under what constraints, and with what consequences."),
  body("The second is early-career AML professionals who have arrived in a transaction monitoring team and need to understand the analytical dimension of the work. You may not have a deep technical background, but you understand the compliance side. This book will give you enough analytical grounding to work effectively with your data science colleagues and to ask the right questions."),

  h2("How to Use This Book"),
  body("Chapters 1 and 2 establish the regulatory and operational context. If you already know AML well, you may move through these quickly. If you are new, take time with them — the rest of the book assumes you understand why banks monitor transactions."),
  body("Chapters 3 and 4 introduce the transaction monitoring lifecycle and the framework for scenario design. These are the conceptual foundation for everything that follows."),
  body("Chapters 5 through 9 are the analytical core. Each chapter introduces a major technique, grounds it in the running case study, and builds on what came before. Do not skip chapters — the exercises are cumulative."),
  body("Chapter 10 looks forward. The industry is changing rapidly; this chapter prepares you to keep pace."),
  body("The appendix contains a complete vocabulary. When you encounter a term in bold, its canonical definition is there."),
  spacer(),

  calloutMixed("A Note on the Exercises — Three Running Cases", [
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: "Each chapter contains at least one exercise built around three interconnected running case studies, all set at Northgate Retail Bank. Working through them in order is the equivalent of conducting a real investigation — from the first alert to the final regulatory submission.", font: "Arial", size: 20, color: "333333", italics: true })] }),
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: "Case A — The Northgate Mule Network. Six personal current accounts conducting cash structuring (NRB-STRUCT-001). This is the primary running case. Every chapter applies its core technique to Northgate first. The data, the rule, the model, and the validation all grow out of what you build here.", font: "Arial", size: 20, color: "333333", italics: true })] }),
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: "Case B — Meridian Trading Ltd. A US import/export business whose principals are connected to the Northgate mule accounts. Meridian introduces commercial data complexity, trade-based money laundering, and entity resolution challenges. From Chapter 2 onwards, each chapter contains a dedicated Meridian exercise (marked [Applied]) that runs alongside the core Northgate exercise. The Northgate exercise should always be completed first. Meridian's data is more complex and the typology is different — commercial trade-based money laundering rather than retail cash structuring — so the analytical approach must be genuinely rethought for each chapter, not simply carried over from the Northgate solution.", font: "Arial", size: 20, color: "333333", italics: true })] }),
    new Paragraph({ spacing: { after: 0 },
      children: [new TextRun({ text: "Case C — Project Sentinel. The bank's internal TMS programme, staffed by a data scientist, a 1st Line compliance officer, a 2nd Line model risk manager, and a 3rd Line auditor. Project Sentinel appears in the harder stretch exercises and in Chapter 9's model validation. It is where the investigation becomes a governance problem. Solutions are available in the Instructor's Solutions Manual.", font: "Arial", size: 20, color: "333333", italics: true })] }),
  ], "FFF3E6"),
  spacer(),
  body("Haibo Zhang"),
  body("London, 2026"),
  pageBreak(),

  // ── CHAPTER 1 ─────────────────────────────────────────────────────────────
  h1("Chapter 1: Introduction to Anti-Money Laundering"),
  spacer(),

  // FinCEN Consent Order vignette
  calloutMixed("A Story in Three Parts — FCA Final Notice Summary (Fictional)", [
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: "FINAL NOTICE — NRB BANK PLC", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: "The Financial Conduct Authority (FCA) has issued this Final Notice to NRB Bank Plc ('the Firm') in respect of serious failings in its anti-money laundering controls between January 2018 and December 2022.", font: "Arial", size: 20, color: "333333" })] }),
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: "During the Review Period, the Firm's transaction monitoring system failed to detect or adequately investigate a cash structuring network operating through six personal current accounts ('the Northgate Accounts'). The Northgate Accounts received aggregate cash deposits of approximately USD 2.95 million over 18 months. Each deposit was individually below the USD 10,000 reporting reference point. The funds were subsequently transferred in near-total to a corporate account held by Meridian Trading Ltd, a UK-registered import/export company.", font: "Arial", size: 20, color: "333333" })] }),
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: "The FCA found that: (i) the Firm's segmentation model placed the Northgate Accounts in a monitoring tier with a threshold set above the accounts' aggregate monthly cash-in, meaning the structuring rule did not fire; (ii) the Firm's commercial account monitoring did not include invoice-level analysis of Meridian's incoming wire payments; and (iii) no cross-account link analysis was performed to identify the common beneficiary relationship between the Northgate Accounts and Meridian Trading Ltd.", font: "Arial", size: 20, color: "333333" })] }),
    new Paragraph({ spacing: { after: 0 },
      children: [new TextRun({ text: "The FCA imposed a financial penalty of £38 million and required the Firm to undertake a Skilled Person Review of its Transaction Monitoring Framework. By the end of this book, you will be able to explain exactly how this happened — and exactly what a well-designed TMS would have needed to prevent it.", font: "Arial", size: 20, color: "333333", italics: true })] }),
  ], "FFF3E6"),
  spacer(),

  // Learning Objectives
  calloutMixed("Learning Objectives — By the end of this chapter you will be able to:", [
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
      children: [new TextRun({ text: "Explain the three stages of money laundering and identify which stage a given transaction pattern belongs to.", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
      children: [new TextRun({ text: "Describe the obligations banks face under AML law and the consequences of non-compliance.", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
      children: [new TextRun({ text: "Place transaction monitoring within the broader AML control framework and explain its role.", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 0 },
      children: [new TextRun({ text: "Recognise the early signs of money-mule structuring in a transaction record.", font: "Arial", size: 20, color: "222222" })] }),
  ], "E8EEFF"),
  spacer(),

  h2("1.1 Business Context: Why Banks Are on the Front Line"),
  body("Money laundering is not a victimless crime. It enables drug trafficking, fraud, tax evasion, terrorism, and human exploitation. It corrupts financial systems and distorts economies. When a bank fails to detect it, the consequences extend far beyond a regulatory fine."),
  body("Banks sit at the centre of the financial system, and that makes them both the primary vehicle for money laundering and the primary line of defence against it. Governments across the world have responded by imposing legal obligations on banks: they must know their customers, monitor their transactions, and report suspicious activity. Failure to do so carries severe penalties — financial, reputational, and criminal."),
  body("This chapter gives you the foundation you need before we look at how transaction monitoring actually works. You cannot design a good detection scenario if you do not understand what you are detecting — and why the stakes are so high."),

  h2("1.2 What Is Money Laundering?"),
  body("Money laundering is the process of making illegally obtained funds appear legitimate. The term is popularly attributed to the practice of mixing dirty cash with the clean revenue of laundromats — businesses with high cash turnover and low scrutiny. The principle is the same today, though the methods are considerably more sophisticated."),
  body("The Financial Action Task Force (FATF) — the international standard-setting body for AML — defines money laundering as the processing of criminal proceeds to disguise their illegal origin. In practice, it almost always involves three stages."),

  h3("1.2.1 The Three Stages of Money Laundering"),
  spacer(),

  table2col(
    ["Stage", "Description"],
    [
      ["Placement", "The criminal introduces illegal funds into the financial system. This is the riskiest stage for the launderer — cash is bulky and conspicuous. Common methods include smurfing (using multiple individuals to split deposits across accounts or transactions to avoid reporting thresholds), cash-intensive businesses, and currency exchange. Banks' cash transaction reporting requirements are specifically designed to catch this stage. This three-stage model applies to traditional banking. We revisit its limitations in the context of blockchain and decentralised finance in Chapter 10."],
      ["Layering", "The funds are moved through a series of transactions to obscure their origin. Wire transfers, shell companies, cryptocurrency exchanges, and real estate purchases are all used here. The goal is to create a complex audit trail that investigators will struggle to follow. This is the stage where transaction monitoring is most relevant."],
      ["Integration", "The laundered funds re-enter the legitimate economy, appearing to be legal income. By this point, the money may have passed through multiple jurisdictions and financial instruments. Integration is the hardest stage to detect."],
    ],
    [2200, 6826]
  ),
  spacer(),

  body("Most AML transaction monitoring focuses on placement and layering, because these are the stages where banks can most readily observe suspicious behaviour. By integration, it is often too late."),

  h2("1.3 Bank Obligations Under AML Law"),
  body("Banks are not expected to be law enforcement agencies. They are, however, required to deter, detect, and report. The regulatory framework — which we cover in detail in Chapter 2 — imposes four core obligations on financial institutions."),

  h3("1.3.1 Know Your Customer (KYC)"),
  body("Before opening an account or entering a business relationship, a bank must verify who the customer is and understand the nature of their business. The industry calls this Customer Due Diligence (CDD). For higher-risk customers, Enhanced Due Diligence (EDD) applies — a more thorough investigation of the customer's source of funds, business relationships, and risk profile."),
  body("KYC is not a one-time exercise. Banks must update their customer records when circumstances change and periodically review them on a risk-based schedule. We examine what 'risk-based' means in practice — and how the term is frequently misused — in Chapter 4."),

  h3("1.3.2 Transaction Monitoring"),
  body("Banks must monitor customer transactions on an ongoing basis to detect patterns that suggest financial crime. This is typically done through automated Transaction Monitoring Systems (TMS), which apply rules and algorithms to flag unusual behaviour for human review."),
  body("Transaction monitoring is the subject of this entire book. For now, understand that it is not optional — it is a legal requirement in every major jurisdiction."),

  h3("1.3.3 Suspicious Activity Reporting"),
  body("When a bank identifies a transaction or pattern of behaviour that it suspects is related to financial crime, it is legally required to file a report with the relevant financial intelligence unit. The United States calls this a Suspicious Activity Report (SAR). Canada and some other jurisdictions use the term Suspicious Transaction Report (STR)."),
  body("The threshold for filing is not certainty — it is reasonable suspicion. Banks must file even when they are not sure that a crime has occurred. Filing a SAR does not mean the customer is a criminal; it means the bank has observed something it cannot explain."),

  h3("1.3.4 Record-Keeping"),
  body("Banks must maintain detailed records of their customer due diligence, transaction history, and SAR filings. Regulators need these records to conduct examinations and investigations. Failure to maintain them is itself a breach of AML obligations."),

  h2("1.4 The Cost of Getting It Wrong"),
  body("Regulatory fines for AML failures have grown dramatically over the past fifteen years. The following cases are used as teaching examples throughout this book."),
  spacer(),

  table2col(
    ["Institution", "Year / Fine / Reason"],
    [
      ["Binance", "2023 — $4.3 billion. The crypto exchange allowed sanctioned entities to transact freely and failed to implement any meaningful AML controls."],
      ["Danske Bank", "2018 — $2.2 billion. The Estonian branch of Denmark's largest bank processed approximately €200 billion in non-resident transactions with minimal scrutiny over nearly a decade."],
      ["HSBC", "2012 — $1.9 billion. The bank facilitated transactions for Mexican drug cartels and processed funds linked to Iranian sanctions evasion."],
      ["Standard Chartered", "2019 — $1.1 billion. Inadequate customer due diligence and transaction monitoring across multiple jurisdictions."],
      ["Deutsche Bank", "2019/2023 — £163 million (FCA, UK) + $186 million (US Department of Justice). Two separate enforcement actions across jurisdictions for repeated failures to implement adequate AML controls, including in correspondent banking."],
    ],
    [2500, 6526]
  ),
  spacer(),

  body("These are not cautionary tales from a different era. They are recent, large, and ongoing. The regulatory environment is tightening, not loosening."),

  callout("Risk Perspective",
    "Fines are only one dimension of AML failure. The reputational damage of a major AML scandal can be longer-lasting and more damaging than the financial penalty. In some cases, executives face personal criminal liability. The business case for effective transaction monitoring is not merely compliance — it is survival.",
    "FFF3E6"),
  spacer(),

  h2("1.5 Where Transaction Monitoring Fits"),
  body("Transaction monitoring is one component of a broader AML control framework. It operates alongside KYC (including Customer Due Diligence — CDD and Enhanced Due Diligence — EDD), Sanctions Screening, and Alert Investigation and Reporting. Understanding its position in that framework helps you understand its purpose and its limits."),
  body("The AML control framework can be thought of as a sequence of filters. KYC screening happens before a customer relationship begins. Transaction monitoring operates continuously throughout the relationship. SAR filing is the escalation mechanism when monitoring identifies something suspicious."),
  body("Transaction monitoring does not prevent money laundering. It detects it — or, more precisely, it flags behaviour that might indicate it. The decision about whether to escalate and ultimately file a SAR is made by a human analyst, often called an investigator, not by the system."),
  callout("A fundamental principle", "The system generates the alert; the investigator makes the judgement.", "E8EEFF"),
  spacer(),
  body("This distinction matters enormously. A transaction monitoring system that generates too many false positives wastes analyst time and causes genuine suspicious activity to be missed in the noise. A system that generates too few alerts creates coverage gaps that a money launderer can exploit. Calibrating that balance — between sensitivity and specificity — is one of the central analytical challenges this book addresses."),

  h2("1.6 An Introduction to Our Running Case Study"),
  body("Throughout this book, we will use a single running scenario to ground the analytical techniques we cover. Here is its first instalment."),
  spacer(),

  calloutMixed("The Scenario: Northgate Retail Bank — Initial Observations", [
    new Paragraph({ spacing: { after: 100 },
      children: [new TextRun({ text: "Northgate Retail Bank is a mid-sized US retail bank with approximately 2.4 million personal current accounts. Its AML analytics team has been asked to investigate a pattern flagged by a branch manager in Birmingham.", font: "Arial", size: 20, color: "333333" })] }),
    new Paragraph({ spacing: { after: 100 },
      children: [new TextRun({ text: "Over a six-week period, seventeen different individuals made cash deposits at three Northgate branches. None of the deposits exceeded $9,000. The cash was deposited into a mix of personal and business accounts. Within one to three business days of each deposit, the funds were transferred by faster payment to a single recipient account at a different US bank.", font: "Arial", size: 20, color: "333333" })] }),
    new Paragraph({ spacing: { after: 0 },
      children: [new TextRun({ text: "The branch manager noticed that several of the depositing individuals appeared unfamiliar with the account holders in whose name they were depositing. Two individuals visited two different branches on the same day.", font: "Arial", size: 20, color: "333333" })] }),
  ], "E8EEFF"),
  spacer(),

  body("We will return to this scenario at the end of this chapter with a first exercise. Over the course of the book, you will progressively apply every major analytical technique to this case."),

  h2("1.7 Risk Considerations"),
  body("Transaction monitoring carries four categories of risk. Each one will recur throughout this book."),

  bullet("Noisy alerts — alerts that fit the design intent of the scenario but investigation finds non-suspicious — waste analyst time and delay legitimate business. These are not failures of the system; they are the expected output of a well-designed scenario operating correctly. A true false positive (by the correct technical definition) is an alert caused by code bugs, data errors, or scenario design flaws — a system failure, not a normal alert. The industry conflates these two very different things. We examine this distinction, and why it matters for model design and governance, in Chapter 6."),
  bullet("False negatives — suspicious activity that the system misses — create regulatory liability when they fall outside the institution's risk appetite. An institution's risk appetite defines its acceptable tolerance for missing suspicious activity; false negatives within that defined tolerance are a policy decision, not a failure. False negatives outside the risk appetite represent genuine regulatory exposure: fines, enforcement action, and potential criminal charges against leadership."),
  bullet("Tipping off — alerting a customer that they are under investigation — is a criminal offence in the United States and many other jurisdictions. The bank must conduct proper training so that employees within the AML Control Framework keep investigation details strictly confidential."),
  bullet("Data quality — transaction monitoring depends on accurate, complete, and timely data across Critical/Key Data Elements (CDE/KDE): the specific fields each scenario requires to function. Missing or incomplete CDE/KDE data does not simply reduce performance — it creates undetectable coverage gaps. The book's position is that there is no such thing as 'bad' data: data always tells you something, and missing or poor-quality data reveals process issues or operational shortcomings that must be understood and managed. We examine the data quality framework in Chapters 3 and 9."),
  spacer(),

  body("We will encounter each of these risk areas again as we work through the analytical content. Keep them in mind."),

  takeawayBox([
    "Money laundering typically occurs in three stages: placement, layering, and integration. Transaction monitoring is most effective at the layering stage.",
    "Banks have four core AML obligations: Know Your Customer (KYC), transaction monitoring, suspicious activity reporting, and record-keeping.",
    "The threshold for filing a SAR is reasonable suspicion, not certainty.",
    "Transaction monitoring generates alerts; human analysts make the investigative judgement.",
    "The central analytical challenge is balancing noisy alerts (wasted investigator effort) against false negatives that fall outside the institution's risk appetite (missed crime and regulatory liability). Risk appetite defines the acceptable boundary between these two outcomes.",
    "Data quality underpins every analytical technique in this book. Chapters 4 and 6 address how to assess and manage it.",
  ]),
  spacer(),

  // ── EXERCISE 1.1 ──────────────────────────────────────────────────────────
  exerciseBox([
    new Paragraph({ spacing: { after: 100 },
      children: [new TextRun({ text: "Exercise 1.1 — Spotting the Pattern  [Foundation]", font: "Arial", size: 22, bold: true, color: "2E75B6" })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Part A — Spotting the Pattern  [Foundation]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 100 },
      children: [new TextRun({ text: "Objective: ", font: "Arial", size: 20, bold: true, color: "222222" }),
        new TextRun({ text: "Develop your intuition for suspicious transaction patterns before any automated tools are introduced.", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ spacing: { after: 100 },
      children: [new TextRun({ text: "Scenario: ", font: "Arial", size: 20, bold: true, color: "222222" }),
        new TextRun({ text: "You are a newly joined AML analyst at Northgate Retail Bank. The branch manager's observation is on your desk (see Section 1.6 above). You have access to the transaction data for the accounts involved, but no automated monitoring system.", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: "Task:", font: "Arial", size: 20, bold: true, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 },
      children: [new TextRun({ text: "Identify the specific behaviours in the scenario description that you consider suspicious. For each, explain which stage of money laundering (placement, layering, or integration) it is most likely associated with.", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 },
      children: [new TextRun({ text: "The largest single deposit in the dataset is $8,950. The US Bank Secrecy Act requires banks to file a Currency Transaction Report (CTR) for any cash transaction exceeding $10,000. What is the significance of the deposit amount relative to this threshold? Does this behaviour pattern have a specific name?", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 100 },
      children: [new TextRun({ text: "What additional information would you want before deciding whether to escalate this case?", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: "Discussion Questions:", font: "Arial", size: 20, bold: true, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
      children: [new TextRun({ text: "At what point, if any, does the threshold for filing a SAR become relevant here? What is that threshold?", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 },
      children: [new TextRun({ text: "Could any of these transactions have an innocent explanation? How does that affect your analysis?", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ spacing: { after: 80 },
      children: [italic("Note: This exercise requires no coding or data tools. It is an exercise in observation, reasoning, and risk judgement. See the Instructor's Solutions Manual for a worked discussion.")]
    }),
    new Paragraph({ spacing: { after: 100 },
      children: [italic("In Chapter 2, we will revisit this scenario and identify the specific regulatory obligations it triggers.")] }),
  ]),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 },
      children: [new TextRun({ text: "Part B — Meridian Trading Ltd: First Encounter  [Applied / Out-of-the-Box]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: "The FCA Final Notice vignette at the start of this chapter mentions Meridian Trading Ltd — a UK-registered import/export company that received funds from the Northgate Accounts. You have been given one piece of information: Meridian holds a business current account at Northgate Retail Bank, registered under SIC code 46690 (Wholesale of other machinery and equipment), with two named directors. No suspicious activity flags are on the account.", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: "Task:", font: "Arial", size: 20, bold: true, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 },
      children: [new TextRun({ text: "Without any transaction data, what risk indicators are already present from the description alone? (Consider: account type, counterparty relationship with the Northgate Accounts, industry sector.)", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 },
      children: [new TextRun({ text: "Which AML obligations does Northgate Retail Bank have toward Meridian Trading Ltd that are different from its obligations toward the Northgate personal account holders? Focus on KYC and Enhanced Due Diligence requirements for legal entities.", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 },
      children: [new TextRun({ text: "If the FCA asked Northgate to demonstrate that its transaction monitoring for Meridian was adequate, what would an 'adequate' monitoring programme for a commercial customer of this type need to include? What data sources would it require beyond the core banking transaction feed?", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ spacing: { after: 0 },
      children: [italic("This is the last time Meridian appears without any transaction data. From Chapter 2 onwards, each chapter includes a Meridian Applied exercise that applies that chapter's core analytical technique to Meridian's growing dataset. Keep your answers here — they will become the foundation of your Meridian analysis.")] }),
  ]),
  spacer(),

  h2("Further Reading and Research Topics"),
  numbered("Read Chapter 4 of the FATF Recommendations (\"Transparency and Beneficial Ownership\") and consider why beneficial ownership matters in a structuring investigation."),
  numbered("FFIEC BSA/AML Examination Manual (publicly available at ffiec.gov) — read the section on Suspicious Activity Reporting. How does the US regulator define 'suspicious activity'?"),
  numbered("Research Question: The Danske Bank scandal involved €200 billion in suspicious transactions over roughly nine years. What were the key failures in their Transaction Monitoring Framework? (Search for the final report by the Danish FSA.)"),
  numbered("Review the FFIEC's BSA/AML Examination Manual (available at ffiec.gov). How does the US regulatory framework describe the purpose and minimum standards for a bank's transaction monitoring programme?"),
  spacer(),
  pageBreak(),
];

// ── DOCUMENT ASSEMBLY ─────────────────────────────────────────────────────────
const doc = new Document({
  numbering: { config: numberingConfig },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22 } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: DARK_NAVY },
              paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: MID_BLUE },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: MID_BLUE },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } }, children: [new TextRun({ text: "Applied AML Analytics  |  Preface & Chapter 1", font: "Arial", size: 18, color: MID_BLUE })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: "Arial", size: 18, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "888888" })] })] }) },
    children
  }]
});
Packer.toBuffer(doc).then(buf => { fs.writeFileSync('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/Book1_Preface_Chapter1.docx', buf); console.log('Done: Book1_Preface_Chapter1.docx'); });

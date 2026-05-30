const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat, ImageRun
} = require('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/node_modules/docx');
const fs = require('fs');

const DARK_NAVY = "1A1A2E", MID_BLUE = "2C3E6B", LIGHT_GREY = "F0F2F8";
const ACCENT_BLUE = "4472C4", WHITE = "FFFFFF";

const numberingConfig = [
  { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  { reference: "numbers2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
];

const cellBorder = (c = "CCCCCC") => ({ top: { style: BorderStyle.SINGLE, size: 1, color: c }, bottom: { style: BorderStyle.SINGLE, size: 1, color: c }, left: { style: BorderStyle.SINGLE, size: 1, color: c }, right: { style: BorderStyle.SINGLE, size: 1, color: c } });
const run = t => new TextRun({ text: t, font: "Arial", size: 22, color: "222222" });
const bold = t => new TextRun({ text: t, bold: true, font: "Arial", size: 22, color: "222222" });
const italic = t => new TextRun({ text: t, italics: true, font: "Arial", size: 22, color: "222222" });
const smallRun = t => new TextRun({ text: t, font: "Arial", size: 20, color: "222222" });
const smallBold = t => new TextRun({ text: t, bold: true, font: "Arial", size: 20, color: "222222" });
const smallItalic = t => new TextRun({ text: t, italics: true, font: "Arial", size: 20, color: "222222" });

function body(text) { return new Paragraph({ spacing: { after: 160 }, children: [run(text)] }); }
function para(runs, opts = {}) { return new Paragraph({ spacing: { after: 160 }, ...opts, children: runs }); }
function bullet(text) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 100 }, children: [smallRun(text)] }); }
function bulletMixed(runs) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 100 }, children: runs }); }
function numbered(text, ref = "numbers") { return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 100 }, children: [smallRun(text)] }); }
function numberedMixed(runs, ref = "numbers") { return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 100 }, children: runs }); }
function spacer() { return new Paragraph({ spacing: { after: 200 }, children: [run("")] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }

function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 }, children: [new TextRun({ text, font: "Arial", size: 36, bold: true, color: DARK_NAVY })] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 160 }, children: [new TextRun({ text, font: "Arial", size: 28, bold: true, color: MID_BLUE })] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 120 }, children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: MID_BLUE })] }); }

function calloutMixed(label, paragraphs, fill = "E8EEFF") {
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026], rows: [new TableRow({ children: [new TableCell({ borders: cellBorder(ACCENT_BLUE), width: { size: 9026, type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 180, right: 180 }, children: [new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: label, font: "Arial", size: 20, bold: true, color: MID_BLUE })] }), ...paragraphs] })] })] });
}
function callout(label, text, fill = "E8EEFF") {
  return calloutMixed(label, [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text, font: "Arial", size: 20, color: "333333", italics: true })] })], fill);
}
function exerciseBox(children) {
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026], rows: [new TableRow({ children: [new TableCell({ borders: cellBorder("2E75B6"), width: { size: 9026, type: WidthType.DXA }, shading: { fill: "EBF3FC", type: ShadingType.CLEAR }, margins: { top: 160, bottom: 160, left: 200, right: 200 }, children })] })] });
}
function codeBox(label, codeLines) {
  const lines = codeLines.map(l => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: l, font: "Courier New", size: 18, color: "1A2856" })] }));
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026], rows: [new TableRow({ children: [new TableCell({ borders: cellBorder("4472C4"), width: { size: 9026, type: WidthType.DXA }, shading: { fill: "F0F4FF", type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 200, right: 200 }, children: [new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: label, font: "Arial", size: 20, bold: true, color: MID_BLUE })] }), ...lines] })] })] });
}
function outputBox(label, outputLines) {
  const lines = outputLines.map(l => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: l, font: "Courier New", size: 18, color: "1A3300" })] }));
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026], rows: [new TableRow({ children: [new TableCell({ borders: cellBorder("2E7D32"), width: { size: 9026, type: WidthType.DXA }, shading: { fill: "F1F8E9", type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 200, right: 200 }, children: [new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: label, font: "Arial", size: 20, bold: true, color: "2E7D32" })] }), ...lines] })] })] });
}
function imageBlock(imagePath, widthEmu, heightEmu) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 160 }, children: [new ImageRun({ data: fs.readFileSync(imagePath), transformation: { width: widthEmu, height: heightEmu } })] });
}
function takeawayBox(items) {
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026], rows: [new TableRow({ children: [new TableCell({ borders: cellBorder("1A7A4A"), width: { size: 9026, type: WidthType.DXA }, shading: { fill: "E6F9F0", type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 180, right: 180 }, children: [new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Key Takeaways", font: "Arial", size: 22, bold: true, color: "1A7A4A" })] }), ...items.map(t => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [smallRun(t)] }))] })] })] });
}
function regTable(headers, rows, widths) {
  const hRow = new TableRow({ children: headers.map((h, i) => new TableCell({ borders: cellBorder("999999"), width: { size: widths[i], type: WidthType.DXA }, shading: { fill: DARK_NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 18, bold: true, color: WHITE })] })] })) });
  const dRows = rows.map((row, ri) => new TableRow({ children: row.map((cell, ci) => new TableCell({ borders: cellBorder("CCCCCC"), width: { size: widths[ci], type: WidthType.DXA }, shading: { fill: ri % 2 === 0 ? "FFFFFF" : LIGHT_GREY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 18, color: "222222" })] })] })) }));
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: widths, rows: [hRow, ...dRows] });
}

// ============================================================
const children = [

  h1("Chapter 3: Transaction Monitoring — Overview"),
  spacer(),

  calloutMixed("Learning Objectives — By the end of this chapter you will be able to:", [
    numbered("Describe the end-to-end transaction monitoring lifecycle from data ingestion to SAR filing.", "numbers"),
    numbered("Explain the role of each stage in the lifecycle and identify common failure points.", "numbers"),
    numbered("Distinguish clearly between an alert, an event, and a case.", "numbers"),
    numbered("Trace the Northgate structuring scenario through the full transaction monitoring lifecycle.", "numbers"),
  ], "E8EEFF"),
  spacer(),

  callout("Project Sentinel — Introduced",
    "Project Sentinel is the bank's internal TMS programme — the cross-functional team responsible for building, calibrating, deploying, and validating the detection system that monitors both the Northgate Accounts and Meridian Trading Ltd. The team has four roles: a data scientist (builds peer groups and trains models), a 1st Line compliance officer (writes rules and reviews alerts), a 2nd Line model risk manager (validates models and governs the programme), and a 3rd Line internal auditor (provides independent assurance). Project Sentinel appears throughout the exercises in this book. It represents the institutional machinery behind every technique we cover — and in Chapter 9, it becomes the subject of a formal model validation.",
    "E8EEFF"),
  spacer(),

  h2("3.1 Business Context: Why TM is a Process, Not a System"),
  calloutMixed("Terminology Framework: TM, Transaction Monitoring Framework, and TMS", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Three terms are used throughout this book. They are not interchangeable:", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallBold("Transaction Monitoring (TM) "), smallRun("— the process of monitoring transactions for financial crime risk. TM is what you do.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallBold("Transaction Monitoring Framework (TMF) "), smallRun("— the end-to-end holistic process: all policies, personas, governance structures, data flows, controls, and escalation paths that together constitute an institution's TM capability. The TMF is how TM is organised and governed.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallBold("Transaction Monitoring System (TMS) "), smallRun("— the software or technology platform that implements TM (whether vendor-built or internally developed). The TMS is one component of the TMF. It executes scenarios, generates alerts, and may support case management. The TMS is never used to refer to the process or the framework.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "When a regulator examines a bank's transaction monitoring, they are examining the TMF in its entirety — not just the TMS. This distinction is central to understanding where accountability lies when things go wrong.", font: "Arial", size: 20, color: "222222", italics: true })] }),
  ], "FFF3E0"),
  spacer(),
  body("When practitioners speak about transaction monitoring, they often use the phrase 'the TMS' — the transaction monitoring system. This framing is understandable but misleading. A system is a tool. What matters is the process that governs how that tool is configured, maintained, and used."),
  body("A TMS that runs excellent scenarios on poor-quality data will generate misleading alerts. A TMS with well-designed scenarios and clean data will still fail if the analysts who review alerts are under-resourced or inadequately trained. A TMS where everything works technically will still expose the bank to regulatory censure if the SAR filing decisions are not properly documented."),
  body("The discipline of transaction monitoring is therefore a process discipline. The system is one component of a much larger operational pipeline. Understanding that pipeline — its stages, its failure modes, and the decisions made at each step — is the foundation of everything that follows in this book."),
  body("In this chapter, we set out that pipeline in full. We introduce the TM lifecycle, examine what happens at each stage, and identify the points where things most commonly go wrong. We then trace the Northgate structuring scenario through each stage to make the framework concrete."),
  spacer(),

  h2("3.2 The Transaction Monitoring Lifecycle"),
  body("We can describe the core TM process as a six-stage lifecycle. Each stage produces an output that feeds the next. Each stage also produces its own characteristic failure modes. Supporting processes — including segmentation and risk and coverage assessment — sit alongside this lifecycle and are introduced in Chapters 5 and 7 respectively."),
  spacer(),

  regTable(
    ["Stage", "Description", "Output", "Key Failure Mode"],
    [
      ["1. Data Collection", "Transactional, customer, and reference data are ingested from source systems.", "Cleansed, structured data feed", "Incomplete or inaccurate data; missing fields"],
      ["2. Scenario Development", "Typologies are translated into rule logic and parameters.", "Deployed scenario/rule", "Poorly specified rules; threshold not calibrated"],
      ["3. Alert Generation", "Transactions are assessed against scenarios; breaches generate alerts.", "Alert queue", "Too many noisy alerts; missed true positives"],
      ["4. Event Triage", "Analysts remove noise, apply casing logic and policies, convert relevant alerts to cases, and route to appropriate review tier.", "Closed alerts or cases routed to L1/L2/L3", "Alert fatigue; inconsistent application of casing logic; noise not properly separated from genuine activity"],
      ["5. Case Investigation (L2/L3)", "Investigators build the full picture: evidence, narrative, decision.", "Case file with recommendation", "Poor documentation; insufficient evidence"],
      ["6. SAR Filing / Closure", "Investigator files a SAR or closes the case with documented rationale.", "SAR lodged or case closed", "Tipping off; inadequate SAR quality"],
    ],
    [1800, 2800, 2200, 2226]
  ),
  spacer(),

  body("This lifecycle is not strictly linear. Data quality issues discovered at Stage 4 may feed back to Stage 1. Scenario weaknesses identified during investigation may prompt a return to Stage 2. The lifecycle is better understood as a feedback loop: each stage generates intelligence that improves the others — provided the institution has the governance mechanisms to act on it."),
  spacer(),

  h2("3.3 Data Collection"),
  h3("3.3.1 Types of Data"),
  body("Transaction monitoring draws on three broad categories of data. Each plays a different role in the process."),
  bulletMixed([smallBold("Transactional data: "), smallRun("The raw record of financial activity. This includes payment amounts, timestamps, originator and beneficiary account details, transaction types (cash, CHAPS, Faster Payments, card), and channel (branch, online, ATM). Transactional data is the primary input to most scenarios.")]),
  bulletMixed([smallBold("Customer data: "), smallRun("Information about the account holder: name, address, date of birth, occupation, customer risk rating (CRR), account opening date, KYC status, and any previous suspicious activity flags. Customer data provides the context that makes a transaction meaningful. The same deposit amount may be perfectly normal for one customer and deeply anomalous for another.")]),
  bulletMixed([smallBold("Reference data: "), smallRun("Lookup tables and external data sources that enrich the transaction picture. These include country risk lists, sanctions lists, industry codes, peer group definitions, and typology libraries. Reference data is often maintained separately from the core transaction data and must be kept current.")]),
  spacer(),

  h3("3.3.2 Data Quality Issues"),
  body("Data quality is the most underappreciated risk in transaction monitoring. When examiners find weaknesses in a Transaction Monitoring Framework, data quality is a frequent contributor."),
  body("The most common data quality problems are:"),
  bullet("Missing fields: Occupation, source of funds, or beneficial owner information absent from the customer record, making contextual assessment impossible."),
  bullet("Stale data: Customer records not updated after significant life events — retirement, change of employment, change of address — so the transaction profile no longer reflects reality."),
  bullet("Mapping errors: Transactions from legacy systems mapped incorrectly to the TMS, causing them to be classified under the wrong transaction type or excluded entirely."),
  bullet("Duplicate records: The same customer appearing under multiple identifiers, preventing aggregation of their full transaction picture."),
  bullet("Late feeds: Source system data arriving after the monitoring window has closed, creating gaps in the surveillance period."),
  spacer(),

  body("Not all data fields carry equal weight. Practitioners use the terms Critical Data Elements (CDEs) and Key Data Elements (KDEs) interchangeably — different institutions and vendors prefer different terms, but they refer to the same concept: fields whose absence or inaccuracy would directly impair a scenario's ability to fire or an investigator's ability to reach a conclusion. Throughout this book, CDE/KDE is used to reflect this equivalence. For the structuring scenario, CDEs include transaction amount, transaction type (cash vs. non-cash), transaction date, and account identifier. KDEs include occupation, stated income, and branch location. Identifying CDEs for each scenario is a prerequisite for effective data quality management — you cannot prioritise remediation without first knowing what is critical."),
  calloutMixed("From School to Practice: Data Quality Frameworks", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "A structured approach to data quality in AML TM follows four steps: establish data lineage (know where each field originates and how it flows into the TMS); perform reconciliation (verify that the volume and values of data received match the source system); conduct CDE testing (validate that critical fields are complete, accurate, and timely); and close the feedback loop (route data quality findings back to the source system owners for remediation). Chapter 7 covers this framework in detail.", font: "Arial", size: 20, color: "333333", italics: true })] }),
  ], "E8EEFF"),
  calloutMixed("There is no such thing as bad data.", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "The phrase 'bad data' is one of the most consequential category errors in analytics. Data is objective — it records what happened. The label 'bad' is subjective — it records that the data does not match what our model expected. These are different things, and conflating them is costly.", font: "Arial", size: 20, color: "333333" })] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "When practitioners say a dataset has 'bad data,' they typically mean one of three things: the data does not conform to the schema their system requires; the data contradicts a prior assumption about the customer; or the data cannot be processed by their current model. None of these are properties of the data. They are properties of the model's expectations.", font: "Arial", size: 20, color: "333333" })] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "A blank occupation field is not bad data — it is a signal that the system failed to collect it, or that the customer declined to provide it, or that the onboarding process does not require it. Each of those explanations carries a different risk implication. A transaction amount that is an order of magnitude larger than the customer's stated income is not bad data — it is the most interesting data point in the file. Calling it 'bad' and discarding it is the analysis failure, not the data failure.", font: "Arial", size: 20, color: "333333" })] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "The analyst's discipline is to resist the urge to label data relative to their model and instead ask: what is this data actually telling me? An unexpected value, an absent field, a distribution that does not match — all of these are observations about reality. The model that cannot accommodate them has a specification problem. In AML, where the objective is to detect what is hidden, dismissing surprising data as 'bad' is precisely the instinct that money launderers rely on.", font: "Arial", size: 20, color: "333333" })] }),
  ], "FFF3E6"),
  spacer(),

  h2("3.4 Scenario Development: From Typology to Rule"),
  para([bold("A scenario"), run(" is a computer-implementable rule that encodes logic derived from typologies and red flags. It is, in effect, a formal instruction to the TMS: look for this pattern, in this population, over this time window, and generate an alert if you find it. Scenario development is the process of translating a money laundering typology — and the red flags associated with it — into that formal instruction.")]),
  body("The structuring typology provides a clear example. Regulators and law enforcement have long observed that individuals seeking to avoid currency reporting thresholds will break large cash deposits into multiple smaller ones. The typology is documented in guidance from FinCEN, JMLSG, and the FFIEC."),
  body("To translate this typology into a rule, the analyst must answer a series of questions:"),
  bullet("What are the red flags that indicate structuring behaviour? Multiple cash deposits below the reporting threshold; deposits across multiple branches on the same or consecutive days; deposits inconsistent with the customer's stated income or occupation."),
  bullet("What data is needed to detect these red flags? Transaction type (cash), amount, date, branch, and customer occupation or income."),
  bullet("What logic will be used? A rolling sum of cash deposits within a defined lookback window, compared against a threshold that sits below — but near — the reporting threshold."),
  bullet("What parameters will govern the rule? The sum threshold, the lookback window (e.g., 30 days), and the minimum number of transactions required to trigger an alert."),
  bullet("Which customers will the scenario apply to? All personal current account holders, or a specific risk segment."),
  spacer(),

  body("We develop the formal rule specification for the Northgate structuring scenario in Chapter 4. For now, the important point is that scenario development is not a technical activity — it is an analytical one. The rule logic encodes human judgement about what suspicious behaviour looks like. That judgement must be grounded in documented typologies, regulatory guidance, and empirical evidence."),
  spacer(),

  h2("3.5 Alert Generation"),
  h3("3.5.1 How Alerts are Generated"),
  body("When the TMS processes a transaction or batch of transactions, it evaluates each scenario against the data. When a transaction — or pattern of transactions — meets the conditions specified in the scenario, the system generates an alert. The alert records what triggered it: which scenario, which account, which transactions, and what threshold was breached."),
  para([bold("Alert"), run(", "), bold("event"), run(", and "), bold("case"), run(" are terms used differently by different institutions. For clarity, we define them as follows throughout this book:")]),
  bulletMixed([smallBold("Alert: "), smallRun("A signal from a system or manual process that warrants further investigation. An alert is the output of the TMS and the input to human review. It has not yet been assessed.")]),
  bulletMixed([smallBold("Event: "), smallRun("Any piece of evidence potentially valuable for creating or contributing to an investigation. An event is broader than a single transaction — it may include customer data, linked account activity, open-source intelligence findings, or any other piece of information relevant to the alert. A single alert may draw on multiple events.")]),
  bulletMixed([smallBold("Case: "), smallRun("A collection of information compiled to investigate potentially suspicious behaviour. A case is opened when an alert (or multiple alerts) is escalated beyond Level 1 review and is investigated by a more senior analyst or specialist investigator.")]),
  bulletMixed([smallBold("Infraction: "), smallRun("Some vendor systems call events infractions. For the purpose of this book, treat infraction and event as equivalent terms. An infraction may be suppressed or promoted to an alert based on additional logic or threshold conditions. Not all institutions use this term — its meaning varies by platform.")]),
  spacer(),

  h3("3.5.2 Alert Volumes and the ATL/BTL Concept"),
  body("Every scenario has a threshold — the point at which a transaction or pattern crosses from unremarkable to flagged. That threshold divides the entire customer population into two groups."),
  para([bold("Above the line (ATL)"), run(" refers to transactions and accounts that trigger an alert. These are the population of alerts that analysts review.")]),
  para([bold("Below the line (BTL)"), run(" refers to transactions and accounts that did not trigger an alert. This population is, by definition, unreviewed — unless a sampling exercise is conducted.")]),
  body("The threshold setting determines the size of both populations. A lower threshold generates more alerts (larger ATL, smaller BTL) but reduces the risk of missing suspicious activity. A higher threshold generates fewer alerts (smaller ATL, larger BTL) but increases the risk of missed detection. Chapter 6 covers threshold calibration and the ATL/BTL framework in detail."),
  body("In practice, alert volumes are a major operational concern. Analysts have finite capacity. When alert volumes are too high, review quality degrades. When they are too low, coverage gaps emerge. The noisy alert rate — the proportion of alerts that investigation determines are non-suspicious — is one of the key metrics that governs this trade-off. Chapter 6 covers the full range of calibration metrics and the statistical methods used to optimise them."),
  spacer(),

  h2("3.6 Alert Review: Level 1"),
  body("Level 1 (L1) review is the first human checkpoint in the TM lifecycle. L1 analysts are typically the most junior members of the financial crime team. Their job is triage, not investigation."),
  body("At L1, the analyst answers a specific question: is there enough here to warrant escalation? They are not expected to build a complete case or make a final SAR decision. They are expected to make a rapid, structured assessment of whether the alert has apparent merit."),
  body("A typical L1 review involves:"),
  bullet("Reading the alert: What scenario fired? What transactions triggered it? What are the amounts, dates, and counterparties?"),
  bullet("Checking customer context: What is the customer's occupation, income, and risk rating? Is their transaction history consistent with the alert?"),
  bullet("Reviewing prior alerts and SARs: Has this customer been flagged before? Have they been the subject of a SAR?"),
  bullet("Applying a decision framework: Does the activity match a known typology? Is there an obvious innocent explanation? Is further investigation warranted?"),
  spacer(),

  calloutMixed("Risk Consideration: Alert Fatigue", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Alert fatigue is one of the most significant operational risks in transaction monitoring. When analysts process hundreds of alerts per day — the majority of which are noisy alerts — cognitive degradation occurs. Analysts become less thorough, less consistent, and more likely to dismiss alerts that should be escalated.", font: "Arial", size: 20, color: "333333", italics: true })] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "The risk is not merely operational. Regulatory examiners expect alert review to be of consistent quality regardless of volume. An institution that produces 10,000 alerts per month but can only review them adequately at 2,000 per month has a structural problem — one that cannot be solved by telling analysts to work faster.", font: "Arial", size: 20, color: "333333", italics: true })] }),
  ], "FFF3E6"),
  spacer(),

  body("L1 review has a time pressure built into it. Most institutions impose a review window — typically 5 to 10 business days from alert generation. Alerts not resolved within the window escalate automatically. This creates an additional risk: analysts working against a deadline may make faster decisions than careful analysis warrants."),
  calloutMixed("Note: L1/L2/L3 vs the Three Lines of Defence", [
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "The L1/L2/L3 levels used in this chapter describe alert review tiers — the escalation path from Event Triage to specialist investigation. They are not the same as the Three Lines of Defence (3LoD), which is a broader governance model. In the 3LoD framework: the First Line is the business and operations function — and this is where alert review sits. Investigation is an operational process; L1, L2, and L3 investigators are First Line staff performing operational financial crime controls. The Second Line is the Financial Crime Compliance function, which sets policy, oversees TM effectiveness, and provides challenge. The Third Line is Internal Audit and Model Risk, which provides independent assurance. This distinction matters: when a regulator asks who is responsible for a TM failure, they are asking which line of defence failed. Treating alert review as a Second Line activity is a governance error that misrepresents accountability.", font: "Arial", size: 20, color: "333333", italics: true })] }),
  ], "E8EEFF"),
  spacer(),

  h2("3.7 Case Investigation: Levels 2 and 3"),
  body("When an alert is escalated from L1, it becomes a case. Case investigation is a more intensive, structured process. It is carried out by more senior analysts (Level 2) or specialist financial crime investigators (Level 3)."),
  h3("3.7.1 What Investigators Do"),
  body("The L2/L3 investigator picks up where the L1 analyst left off. Their task is to build a complete picture of the activity: what happened, who was involved, over what period, through what accounts, and to what apparent purpose."),
  body("This involves gathering evidence beyond what is available in the TMS. Investigators typically:"),
  bullet("Pull the full transaction history for the account and any linked accounts."),
  bullet("Review customer due diligence files, including KYC documents, account opening forms, and any prior correspondence."),
  bullet("Conduct open-source intelligence (OSINT) searches on the account holder and any counterparties."),
  bullet("Liaise with relationship managers or front-line staff who may have context about the customer."),
  bullet("Review any prior SARs, internal fraud reports, or law enforcement requests relating to the account."),
  spacer(),

  h3("3.7.2 Documentation Standards"),
  body("Documentation is not a bureaucratic requirement — it is a legal one. If a SAR is subsequently the basis for a law enforcement investigation, or if a regulator examines the bank's Transaction Monitoring Framework, the case file is the evidence. Inadequate documentation cannot be reconstructed after the fact."),
  body("A well-documented case file should record: the alert or alerts that triggered the investigation; the evidence reviewed; the analytical reasoning applied; any alternative explanations considered and rejected; and the decision made with the rationale. Many institutions use structured case management templates to standardise this documentation."),
  spacer(),

  h2("3.8 SAR Filing and Closure"),
  h3("3.8.1 What Triggers a SAR"),
  body("At the conclusion of a case investigation, the investigator reaches a disposition — the conclusion, with documented reasons and evidence, determining whether the case is suspicious. Dispositions are typically categorised by level: L1 cases are closed as not interesting; L2 cases are escalated as interesting but not yet SAR-worthy; L3 cases are assessed as SAR-worthy. It is the L3 disposition that triggers a SAR filing."),
  body("A Suspicious Activity Report (SAR) is filed when the investigator concludes that the activity is suspicious — that is, when they know, suspect, or have reasonable grounds to suspect that the funds are the proceeds of crime or are connected to terrorist financing."),
  body("The legal threshold for filing is deliberately low. The analyst does not need to be certain. They do not need evidence that would satisfy a federal criminal court. They need a genuine suspicion, grounded in the evidence, that the activity is suspicious. The decision not to file must be as carefully documented as the decision to file."),

  h3("3.8.2 What Goes Into a SAR"),
  body("A good SAR is not a data dump. It is a structured narrative that tells law enforcement what happened, why it is suspicious, who was involved, and what the bank knows about them. The key elements are:"),
  bullet("Subject information: Full details of the account holder(s), including any linked accounts or entities."),
  bullet("Description of suspicious activity: A clear, chronological account of the transactions and patterns that gave rise to the suspicion."),
  bullet("Typology identification: The money laundering typology or typologies that the activity appears to match."),
  bullet("Action taken: Whether the bank has continued, restricted, or closed the account, and why."),
  spacer(),

  h3("3.8.3 SAR Auto-Filing"),
  body("In the United States, FinCEN supports electronic SAR filing through the BSA E-Filing System. The US framework allows financial institutions to submit SARs in a structured XML format, enabling automated batch submission — a process commonly referred to as auto-filing. Under auto-filing, the SAR is generated programmatically from a case management system and submitted without manual re-entry of data, significantly reducing filing time and error rates."),
  calloutMixed("SAR Auto-Filing: US Standards and International Context", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "The US auto-filing model uses FinCEN's BSA E-Filing XML schema. Key features:", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallRun("Structured XML format allows system-to-system transmission from the institution's case management platform directly to FinCEN's database.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallRun("Batch submission enables institutions with high SAR volumes (e.g. large retail banks) to file hundreds of SARs simultaneously.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallRun("The SAR narrative field remains free-text and requires human authorship — auto-filing handles the structured data fields, not the narrative.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Jurisdictions with established auto-filing or electronic SAR frameworks include:", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallBold("United States (FinCEN): "), smallRun("BSA E-Filing System with XML batch upload.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallBold("United Kingdom (NCA): "), smallRun("SARs Online portal; structured online submission rather than batch XML.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallBold("European Union: "), smallRun("Frameworks vary by member state FIU; the EU AML Authority (AMLA) is developing harmonised reporting standards.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallBold("Singapore (MAS/SPF): "), smallRun("Suspicious Transaction Report (STR) filing via STRO Online Notices and Reporting Platform (SONAR).")] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "The technology standard for auto SAR filing typically involves: case management system integration, structured data mapping to the regulatory schema, audit trail of human decision (the disposition), and transmission confirmation receipt. The investigator's disposition — the human decision to file — must always be recorded regardless of how the SAR is transmitted.", font: "Arial", size: 20, color: "222222", italics: true })] }),
  ], "E8EEFF"),
  body("For training purposes, Exercise 3.1 Part C (below) asks students to draft a SAR narrative for the Northgate structuring scenario using the FinCEN SAR format."),
  spacer(),

  h3("3.8.4 Tipping-Off Risk"),
  para([bold("Tipping off"), run(" is the criminal offence of disclosing to a subject — or to a third party who might pass the information on — that a SAR has been filed or is being considered. In the UK, tipping off is an offence under POCA 2002 s.333A, punishable by up to two years' imprisonment.")]),
  body("The practical implication for investigators is significant. They cannot ask a customer to explain unusual transactions if doing so would alert them to the fact that a SAR is being considered. They cannot discuss the case with front-line staff who have customer contact. Tipping-off risk is one of the reasons that L1 and L2/L3 review processes are typically siloed from customer-facing teams."),

  h3("3.8.5 Record-Keeping"),
  body("All institutions subject to AML regulation are required to retain records of SAR decisions — both to file and not to file — for a minimum period. In the UK, this is five years. Records must be retained in a form that can be produced to regulators or law enforcement on demand."),
  spacer(),

  h2("3.9 Risk Considerations"),
  calloutMixed("Risk Considerations", [
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("False positives vs false negatives: "), smallRun("Every threshold calibration involves a trade-off. A low threshold generates more noisy alerts, increasing analyst workload and cost. A high threshold generates fewer alerts, but risks missing genuine suspicious activity — a false negative. Neither error is cost-free, and the regulatory cost of false negatives is typically higher than the operational cost of false positives.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Alert fatigue: "), smallRun("High alert volumes degrade review quality. Institutions should monitor not just the number of alerts generated but the quality of L1 decisions — specifically, the rate at which escalated cases lead to SARs versus the rate at which L1 closures are subsequently found to have been erroneous.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Data quality: "), smallRun("Scenarios cannot compensate for bad data. Institutions should conduct regular data quality assessments covering completeness, accuracy, timeliness, and consistency of source feeds. Data quality issues discovered at L1 or L2 review should be formally tracked and remediated.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [smallBold("Tipping off: "), smallRun("The tipping-off risk is most acute during the investigation phase, when investigators may need to gather information that would normally involve customer contact. Institutions should have clear escalation protocols that separate investigative activity from customer-facing activity.")] }),
  ], "FFF3E6"),
  spacer(),

  h2("3.10 Colab Walkthrough: A First Look at the Data"),
  callout("📎 Companion Notebook", "Chapter 3 notebook — open directly in Google Colab (no installation required):\nhttps://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_03.ipynb\n\nAll chapter notebooks and the Northgate dataset generator are available at:\nhttps://github.com/ComplianceAnalytics/aml-book1", "FFF9E6"),
  body("Before building rules, you need to know your data. The code below gives a first hands-on look at the Northgate Retail Bank dataset — the same synthetic dataset used in exercises throughout Chapters 3 to 8. Open the companion notebook at the link above, run the setup cell once to generate the dataset, then run the cells in Section 1 to see the output for yourself. In Chapter 4 you will write the first formal rule on top of this foundation."),
  codeBox("📊 Colab Preview: Exploring the Northgate Transaction Data", [
    "import pandas as pd",
    "",
    "# Load the Northgate synthetic dataset",
    "df_txn  = pd.read_csv('nb_transactions.csv', parse_dates=['txn_date'])",
    "df_cust = pd.read_csv('nb_customers.csv')",
    "",
    "# Dataset summary — how much data are we working with?",
    "print(f\"Transactions : {len(df_txn):>8,}\")",
    "print(f\"Accounts     : {df_txn['account_id'].nunique():>8,}\")",
    "print(f\"Date range   : {df_txn['txn_date'].min().date()} to {df_txn['txn_date'].max().date()}\")",
    "",
    "# Preview the first few rows",
    "df_txn[['account_id','txn_date','txn_type','amount','counterparty_id']].head(5)",
  ]),
  outputBox("▶ Real Output — Northgate Dataset Summary", [
    "Transactions :   23,188",
    "Accounts     :      500",
    "Date range   : 2023-01-01 to 2023-12-31",
    "",
    " account_id    txn_date      txn_type   amount counterparty_id",
    "    ACC0116  2023-01-01  TRANSFER_OUT   471.13         CPT0139",
    "    ACC0390  2023-01-01  TRANSFER_OUT   493.47         CPT0297",
    "    ACC0236  2023-01-01   TRANSFER_IN  1439.37         CPT0038",
    "    ACC0145  2023-01-01   TRANSFER_IN    57.25         CPT0112",
    "    ACC0398  2023-01-01   TRANSFER_IN   517.43         CPT0190",
  ]),
  body("Running this cell reveals a dataset of 23,188 transactions across 500 accounts, spanning the full calendar year 2023. The transaction types — TRANSFER_OUT, TRANSFER_IN, CASH_IN, CARD — reflect ordinary retail banking activity. Most amounts are in the low-to-mid hundreds of dollars. Six accounts embedded in this population have a very different profile, which you will discover when you apply Rule 1 in Chapter 4. Exercise 3.1 asks you to trace one such account through every stage of the TM lifecycle."),
  spacer(),

  takeawayBox([
    "Transaction monitoring is a process, not a system. Every stage of the lifecycle — data, scenario, alert, review, investigation, SAR — must function correctly for the programme to be effective.",
    "The six TM lifecycle stages are: Data Collection, Scenario Development, Alert Generation, Alert Review (L1), Case Investigation (L2/L3), and SAR Filing or Closure.",
    "Alert, event, and case are distinct terms: an alert is a system-generated signal warranting review; an event is any piece of evidence — not just a transaction — potentially valuable for an investigation; a case is a structured file compiling all evidence about potentially suspicious behaviour.",
    "The ATL/BTL distinction is fundamental to tuning: transactions above the line are reviewed; those below the line are not — meaning below-the-line risk must be actively managed.",
    "Alert fatigue is a systemic risk, not an individual one. It is caused by structural over-alerting and cannot be solved by effort alone.",
    "A SAR requires suspicion, not certainty. The decision not to file must be as well-documented as the decision to file.",
    "Tipping off is a criminal offence. Investigative processes must be designed to prevent disclosure to subjects or customer-facing staff.",
    "Data quality is the most underappreciated risk in TM. Poor data creates systemic false negatives that scenario redesign cannot fix.",
  ]),
  spacer(),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Exercise 3.1 — Tracing the Northgate Scenario Through the TM Lifecycle  [Intermediate]", font: "Arial", size: 22, bold: true, color: "2E75B6" })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Part A — Tracing the Northgate Scenario Through the TM Lifecycle  [Intermediate]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Scenario Data Release 2: "), smallRun("This exercise introduces the second layer of the Northgate scenario data — the Transaction Monitoring Framework context at Northgate Retail Bank. Earlier exercises established the typology and regulatory obligations. This release adds the operational and process dimension.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Recap: "), smallRun("In Exercise 2.1 you identified the regulatory obligations triggered by the Northgate scenario. Now trace the full operational process through which that scenario would be detected and assessed.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Scenario: "), smallRun("Northgate Retail Bank operates a standard Transaction Monitoring Framework. The mule network identified in earlier chapters consists of six personal current accounts. Over a 90-day period, each account receives between three and eight cash deposits per month, each below USD 10,000. Each account's aggregate monthly cash-in ranges from USD 6,800 to USD 11,200 per account (averaging approximately USD 8,200 per account per month across the network). The customers are employed, with stated incomes between USD 18,000 and USD 24,000 per annum. Northgate's TMS currently holds occupation data for only 60% of its personal current account customers.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Task: "), smallRun("For each of the six stages of the TM lifecycle, answer the following three questions:")] }),
    numbered("What data is used at this stage, and is there any data quality risk that could impair the process?", "numbers2"),
    numbered("What decision or output is produced at this stage, and what criteria govern it?", "numbers2"),
    numbered("What could go wrong at this stage that would prevent the suspicious activity from being correctly identified or reported?", "numbers2"),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Presentation format: "), smallRun("Present your answer as a table with six rows (one per stage) and three columns (data used, decision made, failure mode). Then write a one-paragraph narrative describing the overall risk to the bank if any single stage fails.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Colab Extension — "), new TextRun({ text: "https://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_03.ipynb", font: "Courier New", size: 18, color: "1A2856" })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("Open the Chapter 3 notebook at the link above. Section 1 runs the data-exploration code shown in Section 3.10 of the text. Section 2 provides a pre-filtered view of the six mule accounts, including their monthly cash-in totals, deposit amount distribution, data quality gaps, and counterparty country profile. Use these views to identify which stage of the TM lifecycle is most at risk given the data quality gaps visible in the dataset, and document your reasoning in the Section 3 answer cells.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallItalic("In Chapter 4, you will design the specific rule that would have generated the alert in this scenario. In Chapter 5, you will use segmentation to refine the monitoring threshold applied to these accounts.")] }),
  ]),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Part B — Meridian Trading Ltd: Tracing the Commercial Lifecycle  [Applied / Out-of-the-Box]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("We continue with Meridian Trading Ltd. For Part B, trace Meridian's transaction activity through the same six-stage TM lifecycle — but now with a commercial data profile. Meridian's data environment differs from the Northgate personal accounts in three important ways: (1) its primary data is SWIFT MT700 trade finance messages, not a standard retail transaction feed; (2) its transaction amounts are larger and less frequent; (3) it uses a different system of record for its customer due diligence data (the bank's corporate banking platform rather than the retail KYC system).")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Task:")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 60 }, children: [smallRun("For each of the six TM lifecycle stages, identify at least one way in which Meridian's commercial data profile creates a different challenge from the retail Northgate accounts. Present your answer as a comparison table: Stage | Northgate challenge | Meridian challenge | Key difference.")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 60 }, children: [smallRun("Project Sentinel's data scientist proposes to ingest Meridian's SWIFT MT700 data directly into the TMS so that the same alert engine applies to both retail and commercial accounts. Identify at least two data quality risks specific to SWIFT trade finance data that would need to be resolved before this ingestion is viable. What CDEs would you define for a commercial trade finance monitoring scenario?")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 80 }, children: [smallRun("If you were writing the 'Stage 4 — Alert Review (L1)' process document for a Meridian-type alert, what context would the L1 analyst need that is not available in a standard retail TMS alert? Where would they get it? Who else in the bank would they need to contact, and what tipping-off risk does that contact create?")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallItalic("In Chapter 4, you will discover that Northgate's mule accounts and Meridian are connected via a cross-case link rule. In Chapter 5, peer-group segmentation is applied to refine the monitoring threshold for both Northgate and Meridian.")] }),
  ]),
  spacer(),

  h2("Further Reading and Research Topics"),
  numbered("The FFIEC BSA/AML Examination Manual (freely available at ffiec.gov) contains a dedicated section on Transaction Monitoring Framework management. Read the section titled 'Automated Clearing House Transactions' and identify at least two data quality risks it explicitly acknowledges."),
  numbered("The FFIEC BSA/AML Examination Manual (Part I, Chapter 5 — Risk-based approach) describes the lifecycle of a compliant AML programme. Compare the FFIEC's six-stage conception with the TM lifecycle in Section 3.2. Where do they align, and where does the FFIEC use different terminology?"),
  numbered("Research Question: The FCA's Financial Crime Guide (FCG) sets out the FCA's expectations for firms' transaction monitoring frameworks. Download FCG 8.1 and identify the specific requirements it places on firms regarding alert closure documentation and record retention."),
  numbered("Tipping-off case study: Research the UK Court of Appeal case R v K [2007] EWCA Crim 491. What did the court determine about the boundary between lawful enquiries and unlawful tipping off? How does this apply to an analyst who needs to call a relationship manager to gather context about a flagged commercial customer?"),
  spacer(),
  pageBreak(),
];

const doc = new Document({
  numbering: { config: numberingConfig },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 36, bold: true, font: "Arial", color: DARK_NAVY }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, font: "Arial", color: MID_BLUE }, paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 24, bold: true, font: "Arial", color: MID_BLUE }, paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } }, children: [new TextRun({ text: "Applied AML Analytics  |  Chapter 3", font: "Arial", size: 18, color: MID_BLUE })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: "Arial", size: 18, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "888888" })] })] }) },
    children
  }]
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/Book1_Chapter3.docx', buf); console.log('Done: Book1_Chapter3.docx'); });

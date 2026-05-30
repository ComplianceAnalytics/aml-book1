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
function imageBlock(imagePath, w, h) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 160 }, children: [new ImageRun({ data: fs.readFileSync(imagePath), transformation: { width: w, height: h } })] });
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

  h1("Chapter 4: Evolution of TMS and Scenario Design"),
  spacer(),

  calloutMixed("Learning Objectives — By the end of this chapter you will be able to:", [
    numbered("Describe the evolution from manual monitoring to AI-driven TMS and explain the trade-offs at each stage.", "numbers"),
    numbered("Design a scenario to detect structuring by encoding typology logic into rule parameters.", "numbers"),
    numbered("Evaluate a scenario design for coverage gaps and false positive risk.", "numbers"),
    numbered("Write the formal rule specification for the Northgate structuring scenario.", "numbers"),
  ], "E8EEFF"),
  spacer(),

  h2("4.1 Business Context: Why TMS Architecture Matters to an Analyst"),
  body("Transaction monitoring systems have evolved substantially over the past four decades. The architecture of the system in use at any institution — whether it is a manual spreadsheet, a rule-based engine, or an AI-driven platform — determines what kinds of patterns can be detected, how quickly alerts are generated, and how much an analyst can trust the output they are reviewing."),
  body("Understanding the architecture matters for practical reasons. When you tune a threshold, you need to know how the system evaluates it. When you design a scenario, you need to know what data the system can access and how it processes time-windowed aggregations. When you review an alert, you need to understand what the alert is actually telling you — and what it is not."),
  body("This chapter traces the evolution of TMS architecture from its origins in manual review through to contemporary AI-driven approaches. For each generation, we consider the capabilities it introduced, the limitations it brought with it, and the implications for analysts who work with it. We then develop the formal scenario design methodology and apply it to the Northgate structuring case."),
  spacer(),

  h2("4.2 Historical Monitoring: Manual Review"),
  body("The earliest form of transaction monitoring was entirely manual. Compliance officers reviewed transaction records — initially paper ledgers, later printed reports — looking for patterns that appeared unusual. Decisions about what to review and what to escalate were driven entirely by individual judgement, supplemented by regulatory guidance on what to look for."),
  body("Manual review had two fundamental limitations. First, coverage: a team of analysts could review only a small proportion of total transaction volume. Most activity was unreviewed. Second, consistency: with no systematic criteria, different analysts applied different standards. The same pattern might be escalated by one analyst and dismissed by another."),
  body("The introduction of reporting thresholds — such as the USD 10,000 Currency Transaction Report requirement under the US BSA — was an attempt to impose systematic structure on manual review. But threshold-based manual review introduced its own problem: it was easily gamed by anyone who knew the threshold, and created a cliff edge at the reporting threshold — providing false comfort that activity below the line was clean."),
  spacer(),

  h2("4.3 Profiling-Based Systems: Peer Group Comparison"),
  body("The first major technological step beyond manual review was the introduction of profiling-based systems in the 1990s. These systems established a behavioural baseline for each customer or customer segment and flagged deviations from that baseline as potentially suspicious. The most notable of these systems was Searchspace, widely deployed across major banks in the UK and US."),
  para([bold("Peer group analysis"), run(" is the foundational technique of profiling-based monitoring. Rather than applying a single threshold to all customers, the system groups customers — also called "), bold("segments"), run(", a term we use interchangeably throughout this book — with similar profiles, by industry, account type, or transaction behaviour, and assesses each customer against the behaviour of their peers. A cash deposit that is unusual for a retail customer may be unremarkable for a market trader.")]),
  body("Profiling represented a conceptual advance over simple threshold rules in that it introduced context-sensitivity. Profile-based systems adapt well to seasonality and legitimate behavioural change — a seasonal business increasing its cash turnover in December, or a customer changing jobs, would gradually shift the behavioural baseline without generating false alerts. This is a genuine advantage over rule-based systems."),
  body("The fundamental problem with profiling-based systems was not adaptability — it was that defining meaningful peer groups required sustained, expert human judgement that most institutions could not maintain at scale. If the groups were poorly constructed, the peer comparison was meaningless regardless of how well the baseline adapted. Alert volumes were high; confidence in the alerts was low. Profiling-based monitoring is best understood as a historical step — an important conceptual bridge between manual review and rule-based systems — rather than a viable architecture for a modern Transaction Monitoring Framework."),
  spacer(),

  h2("4.4 Rule-Based TMS: How Modern Rule Engines Work"),
  body("The dominant form of TMS in use today remains the rule-based system. A rule-based TMS encodes monitoring logic as a set of explicit conditions: if these criteria are met, generate an alert. Rules can be simple (a single transaction exceeds a threshold) or complex (a rolling sum of transactions of a specific type across multiple accounts exceeds a threshold within a defined lookback window, and the customer's risk rating is above a defined level)."),
  h3("4.4.1 The Anatomy of a Rule"),
  body("A rule in a modern TMS typically has the following components:"),
  bulletMixed([smallBold("Scope: "), smallRun("Which customers, accounts, or transaction types the rule applies to. Rules are not typically applied universally. A cash structuring rule might apply only to personal current accounts; a wire transfer monitoring rule might apply only to accounts with international transaction capability.")]),
  bulletMixed([smallBold("Logic: "), smallRun("The conditional statement that defines what constitutes a trigger. This may involve aggregations (sum, count, average), time windows (rolling 30 days, calendar month), and multi-account linkages (across accounts held by the same customer or the same entity).")]),
  bulletMixed([smallBold("Parameters: "), smallRun("The specific values that instantiate the logic. A rule that monitors rolling cash deposits has parameters for the threshold amount and the lookback window. Changing a parameter changes the sensitivity of the rule without changing its logic.")]),
  bulletMixed([smallBold("Actions: "), smallRun("What the system does when the rule fires. In most TMS, the action is to generate an alert with a defined priority level. More sophisticated systems may suppress the alert pending further conditions, or route the alert to a specific review queue.")]),
  spacer(),

  h3("4.4.2 Threshold Logic"),
  body("Most rule-based scenarios use threshold logic: when a calculated value crosses a defined boundary, the rule fires. The threshold is typically a parameter, not a fixed constant, so it can be adjusted during tuning without changing the rule logic itself."),
  body("Thresholds take two forms: absolute (a fixed amount) or relative (a percentage deviation from a baseline). In practice, most cash monitoring rules use absolute thresholds, calibrated against the reporting obligation threshold and the typical transaction profile of the customer segment."),
  spacer(),

  h2("4.5 AI/ML-Driven TMS: Opportunities and Challenges"),
  callout("AI and ML Terminology: How This Book Uses These Terms",
    "AI and ML are used interchangeably in this book when referring to algorithmic learning techniques applied to TM. AI, as used here, means machine intelligence using statistical learning — including neural networks, supervised learning (models trained on labelled data), and unsupervised learning (models that identify patterns without labelled data). AI in this book does NOT refer to: agentic AI, AI agents, large language models, generative AI, or robotic process automation — these are distinct technologies with different applications covered in Chapter 7. When the book references AI-driven TMS or ML models, it means statistical learning applied to alert generation, scoring, or classification.",
    "FFF3E0"),
  spacer(),
  body("The most recent generation of TMS incorporates machine learning techniques — both supervised and unsupervised — to supplement or replace rule-based monitoring. AI-driven systems promise higher precision, lower noisy alert rates, and the ability to detect novel patterns that have not been explicitly encoded in rules."),
  h3("4.5.1 Unsupervised Approaches"),
  body("Unsupervised ML techniques — including clustering and anomaly detection — can identify unusual patterns without requiring labelled examples of known suspicious activity. This is valuable in AML because labelled data is scarce: confirmed SAR outcomes are rare relative to total transaction volume, and they represent only the suspicious activity that was detected, not all suspicious activity."),
  body("Clustering groups customers or transactions by behavioural similarity. Accounts that cluster together with known suspicious actors may warrant heightened scrutiny. Anomaly detection flags accounts or transactions that diverge significantly from what the model considers normal — without defining in advance what 'suspicious' looks like."),

  h3("4.5.2 Supervised Approaches"),
  body("Supervised ML techniques train a model on historical labelled data — alerts that were confirmed as suspicious (positive labels) and alerts that were dismissed (negative labels). The model learns to distinguish the two classes and can be used to score new alerts for priority."),
  body("Supervised approaches are powerful when the training data is representative and the labels are accurate. In AML, both conditions are difficult to guarantee. The SAR population is highly imbalanced relative to the non-SAR population, and the non-SAR population includes some false negatives — genuine suspicious activity that was dismissed."),
  callout("Note: K-Means and the History of ML in AML",
    "Traditional k-means clustering — used in segmentation and peer group analysis — is, in essence, unsupervised machine learning. It groups customers by statistical similarity without labelled outcomes. This means ML has been applied in transaction monitoring for far longer than is commonly recognised. The industry's narrative of 'AI/ML as a new development' often overlooks that peer group analysis, introduced in the 1990s, was already an application of unsupervised learning. Chapter 5 covers k-means segmentation in detail.",
    "E8EEFF"),

  h3("4.5.3 Explainability Challenges"),
  callout("Limitation: SAR Training Data is Noisy",
    "Supervised ML models for AML are typically trained on historical SAR data as the positive (suspicious) class. This data is structurally noisy. Defensive SARs — filed 'just in case' with no positive link to the features or typologies the model is designed to detect — contaminate the training set. A model trained on defensive SARs learns to replicate the human biases that produced them, not to detect genuine financial crime. This noise dramatically reduces model precision and makes validation harder: if the training labels are unreliable, precision/recall metrics computed against those labels are also unreliable. SAR data cleansing is therefore a prerequisite for any supervised ML project in AML. Chapter 8 covers this in detail.",
    "FFF3E6"),
  body("A persistent challenge with AI-driven TMS is explainability. Regulators — and courts — expect institutions to be able to explain why an alert was generated or why a SAR was filed. A rule-based system provides an explicit, auditable chain of logic. Many ML models — particularly ensemble methods and neural networks — do not."),
  body("The explainability requirement is not just a compliance constraint. It is also an operational one. If an analyst cannot understand why the model flagged an account, they cannot assess whether the flag is meaningful. The field of explainable AI (XAI) is addressing this, but most deployed AML systems still combine ML-driven scoring with rule-based logic for the alert generation step."),
  body("Model governance for ML-driven TMS must meet the standards set out in SR 26-2 (US Federal Reserve) and PRA SS1/23 (UK). These frameworks require documentation of model logic, training data, validation results, and known limitations — and impose ongoing monitoring obligations. We cover these requirements in full in Chapter 9."),
  spacer(),

  h3("4.5.4 The Current Frontier: Entity Consolidation, Graph Analysis, and Event Triage"),
  body("The most advanced TM programmes today do not rely on any single ML technique. They combine four capabilities that, together, represent a step change from both rule-based and early ML architectures."),
  para([bold("Entity Consolidation"), run(" is the process of combining all known data about a customer — across accounts, products, counterparties, and linked individuals — into a single unified view for monitoring purposes. It is distinct from "), bold("Entity Resolution"), run(", which is the investigative process of resolving ambiguous identities. Entity Consolidation happens before monitoring begins; Entity Resolution happens during case investigation. Modern platforms such as Quantexa and Ayasdi are built on Entity Consolidation as a foundational layer. Without it, a mule network operating across six accounts at the same bank may never be connected.")]),
  body("This matters directly for the Northgate case. The NRB-STRUCT-001 scenario spec operates at the individual account level — it monitors each account's rolling cash deposits independently. It would detect each mule account if the threshold were met. But it would not detect the network structure: the fact that all six accounts are forwarding funds to the same recipient, or that three of them share a registered address. Entity Consolidation would surface those connections before a rule is applied."),
  para([bold("Graph and Network Analysis"), run(" extends Entity Consolidation by mapping the relationships between entities — accounts, individuals, companies, addresses, devices — and analysing the structure of those networks. A money mule network has a recognisable graph topology: multiple feeder accounts converging on a central account, or a hub-and-spoke structure that individual-account rules cannot see. Graph analysis is now a core capability of platforms such as Quantexa and is increasingly used by tier-one banks.")]),
  para([bold("Event Triage"), run(" is the ML-driven prioritisation layer that sits between alert generation and human review. Rather than presenting all alerts to analysts in the order they were generated, an event triage model scores each alert for the probability that it represents genuinely suspicious activity and routes high-priority alerts to the front of the queue. This directly addresses alert fatigue (from noisy alerts) — one of the most persistent operational failures in TM programmes. Event triage models are typically supervised, trained on historical SAR outcomes.")]),
  callout("Note — FRAML",
    "Some modern TMS platforms are designed for converged Fraud and AML monitoring — commonly abbreviated to FRAML. The rationale is that the data, techniques, and alert review processes for fraud and AML are increasingly similar, and that a single integrated platform reduces duplication of effort and improves detection of actors who exploit both domains simultaneously. Use the term with care: FRAML implementations vary widely in how deeply the two disciplines are genuinely integrated, and the regulatory frameworks remain distinct. We note it here as a feature of the current commercial landscape; it is not further examined in this book.",
    "FFF8E6"),
  spacer(),

  regTable(
    ["Generation", "Representative Platforms", "Key Capability"],
    [
      ["Pioneer (1990s)", "Searchspace, FircoSoft", "Profiling-based baselines; sanctions screening"],
      ["Standards (2000s–2010s)", "Actimize, Norkom/BAE Detica, Oracle Mantas, SAS, Verafin", "Rule-based scenario engines; workflow management"],
      ["FinTech/ML (2015–present)", "Quantexa, Ayasdi, Thetaray, DataVisor, Featurespace", "Entity Consolidation; unsupervised ML; graph analysis; event triage"],
      ["Blockchain (emerging)", "Chainalysis, Elliptic, CipherTrace", "On-chain transaction tracing; crypto typology detection"],
    ],
    [2200, 3200, 3626]
  ),
  spacer(),

  calloutMixed("From School to Practice", [
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "You may have studied decision trees or rule-based classifiers in your degree. A TMS scenario is similar in structure: it defines a set of conditions that, when satisfied, produce a classification (alert or no alert). But unlike a classifier trained on labelled data, a TMS scenario is written by a human expert encoding regulatory guidance and typological knowledge into rule logic. There is no training dataset. There is no optimisation objective function. The validation challenge is therefore very different: you cannot measure accuracy on a holdout set. You must demonstrate coverage of known typologies, calibrate thresholds against operational constraints, and defend your design to a regulator who will ask whether the rule would have detected the activity you are trying to catch.", font: "Arial", size: 20, color: "333333", italics: true })] }),
  ], "E8F0FF"),
  spacer(),

  body("Regardless of the TMS generation in use, every deployed scenario begins with a design process. Even ML-driven systems require scenario logic to be specified, tested, and documented before deployment — the methodology that follows applies across all architectures. The history of TMS evolution shows us what the systems can do; scenario design determines whether they do it well."),
  spacer(),

  h2("4.6 Scenario Design: The Methodology"),
  body("Designing a TMS scenario is a structured analytical exercise. It proceeds in five steps, each of which builds on the last: Risks → Red Flags → Typologies → Scenarios → Parameters. The sequence matters: a scenario not anchored to documented regulatory red flags and a recognised typology is not a control — it is a guess. We set out the methodology here and apply it to the Northgate structuring case in the next section."),
  h3("Step 1: Identify the Risks from Regulatory Red Flags"),
  body("The starting point is not the scenario — it is the regulatory risk landscape. Regulators and government bodies (FATF, FinCEN, FFIEC, FBI, and the Egmont Group) publish typology reports, red flag lists, and examination guidance that identify financial crime risks an institution is expected to address. The analyst's first task is to catalogue these red flags and assess which ones are relevant to the institution's customer base and product mix. This is the foundational input to the entire scenario design chain. A scenario built without reference to documented red flags cannot be defended in an examination."),

  h3("Step 2: Select or Design Typologies from Red Flags"),
  body("A typology is a documented pattern of money laundering behaviour that corresponds to one or more red flags. From the red flags identified in Step 1, the analyst selects or constructs typologies that describe how the financial crime risk manifests in transaction behaviour. Typologies should reference their source: FATF report, FinCEN Advisory, prosecution records, or law enforcement intelligence. The typology defines what the criminal is doing and why — it is the analytical bridge between the regulatory risk and the detection logic."),

  h3("Step 3: Design Scenarios from Typologies"),
  body("The scenario is the operational translation of the typology into detection logic. It specifies the conditional statement that, when met, generates an alert. The scenario logic should be testable, auditable, and explainable to a non-technical compliance officer in plain English. The discipline here is to be explicit: which red flags are being encoded, which are not, and why. Not all red flags from a typology will be detectable from transactional data alone — some require customer context, market intelligence, or law enforcement information that the TMS cannot access."),

  h3("Step 4: Set the Parameters"),
  body("Parameters give the scenario logic its operational specificity. A structuring scenario has parameters for the threshold amount, the lookback window, and the minimum number of transactions. Parameters are calibrated through tuning — a process covered in Chapter 6. Every parameter must have a documented rationale: 'we set the threshold at USD 7,500 because...' is a sentence that must have an answer. The entire Risks → Red Flags → Typologies → Scenarios chain must be traceable through the parameter documentation — a regulator reviewing a parameter must be able to trace it back to the risk and red flag it is designed to detect."),

  h3("Step 5: Test and Validate"),
  body("Before deployment, a scenario should be tested against historical data: how many alerts would it have generated, what proportion would have been suspicious, and are there known cases of the target typology that it would have missed? Testing is not one-off — it should be repeated whenever parameters are changed or data feeds are updated. Scenario design evaluation — including whether the scenario achieves adequate coverage of its target typology — is covered in Chapter 9 (Model Validation), which provides the formal validation framework for assessing deployed scenarios."),
  spacer(),

  h2("4.7 The Northgate Structuring Scenario: Formal Rule Specification"),
  body("We can now set out the formal rule specification for the scenario that would detect the Northgate structuring pattern. This specification is the output of the five-step design methodology applied to the structuring typology."),
  spacer(),

  calloutMixed("Scenario Specification: NRB-STRUCT-001 — Cash Deposit Structuring", [
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Scenario Name: "), smallRun("NRB-STRUCT-001 — Repeated Cash Deposits Below Reporting Threshold")] }),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Typology: "), smallRun("Structuring (also known as 'smurfing'). The deliberate fragmentation of cash deposits to avoid reporting thresholds, as documented in FATF Typology Report on Cash Intensive Businesses and FinCEN Advisory FIN-2014-A010.")] }),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Red Flags Encoded:")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [smallRun("Multiple cash deposits within a rolling 30-day window.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [smallRun("Each individual deposit below USD 10,000 (the UK reporting reference point for high-value cash dealings).")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [smallRun("Aggregate of deposits within the window exceeds the scenario threshold.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("Pattern inconsistent with stated customer occupation and income.")] }),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Rule Logic: "), smallRun("SUM(cash_deposit_amount) WHERE transaction_type = 'CASH_IN' AND individual_amount < 10,000 OVER ROLLING 30 DAYS > THRESHOLD_AMOUNT AND COUNT(transactions) >= MIN_TXN_COUNT.")] }),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Parameters:")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [smallRun("THRESHOLD_AMOUNT: USD 7,500 (set at 75% of the reporting reference point to capture structuring patterns with a margin below the USD 10,000 threshold; subject to tuning — see Chapter 6).")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [smallRun("MIN_TXN_COUNT: 3 (minimum three cash deposits in the lookback window).")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("LOOKBACK_WINDOW: 30 calendar days, rolling (recalculated daily).")] }),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Customer Scope: "), smallRun("All personal current accounts with an active cash transaction capability. Excludes business accounts (covered by a separate scenario). Applies to all customer risk rating segments (CRR 1-5); alert priority scales with CRR.")] }),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Data Prerequisites: "), smallRun("Three source feeds must be active and validated before deployment: (1) the cash transaction feed, including transaction type, amount, date, branch, and account identifier; (2) the customer reference data feed, including CRR, occupation, and stated income; (3) the account status feed, confirming cash-enabled accounts. All three are Critical Data Elements (CDEs) for this scenario. Absence or staleness of any feed will cause systematic false negatives.")] }),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Governance Prerequisites: "), smallRun("Scenario approved by the Financial Crime Risk second-line function and signed off by the Head of Financial Crime. Deployment requires a documented scenario approval record referencing the typology source, the data validation results, and the initial testing output.")] }),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Documentation Output: "), smallRun("This specification document, the scenario approval record, the pre-deployment test results (alert volume projection, estimated noisy alert rate, SAR hit rate against historical population), and the scheduled review date. All artefacts retained in the scenario governance register.")] }),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Common Pitfalls:")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [smallRun("If the cash transaction feed excludes ATM deposits, the rule will miss structuring conducted via ATM withdrawals reversed through deposits. Confirm feed scope with the data team before deployment.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [smallRun("If CRR data is stale, alert priority scaling will be inaccurate. CRR must be recalculated on a schedule that matches the monitoring window.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("The rule operates at the individual account level. It will not detect the mule network structure — multiple accounts forwarding to the same recipient. Network-level detection requires Entity Consolidation and graph analysis, as described in Section 4.5.4.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Owner: "), smallRun("Financial Crime Advisory — Scenario Management. Review cycle: annual, or following any material change in typology guidance or customer population composition.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "A note on network scope: NRB-STRUCT-001 operates at the individual account level. Among the beneficiary accounts receiving faster payment transfers from the six Northgate Accounts over the monitoring period, one entity appears consistently: Meridian Trading Ltd, a business current account holder at Northgate Retail Bank, registered under SIC code 46690 (Wholesale of other machinery and equipment). NRB-STRUCT-001 does not and cannot detect this connection — it sees each mule account in isolation. The significance of this observation is developed in Chapter 6.", font: "Arial", size: 20, color: "333333", italics: true })] }),
  ], "E8EEFF"),
  spacer(),

  body("Scenario design evaluation — how to assess whether a scenario achieves adequate coverage of its target typology — is covered in Chapter 9: Model Validation."),
  spacer(),

  h2("4.8 Colab Walkthrough: Rule 1 in Python"),
  body("The specification above defines the rule in business terms. Below is Rule 1 implemented in Python — the exact logic the TMS would execute on every daily batch. This is the codebase you will extend in Exercise 4.1. Open the Chapter 4 Colab notebook to run it against the Northgate dataset and see the alert output for yourself."),
  codeBox("📊 Colab Preview: Implementing Rule 1 (Cash Threshold Structuring)", [
    "import pandas as pd",
    "",
    "def apply_rule_1(df_txn, threshold=7500, min_txns=3, window_days=30):",
    "    \"\"\"Rule NRB-STRUCT-001: rolling cash deposits > threshold.\"\"\"",
    "    cash = df_txn[",
    "        (df_txn['txn_type'] == 'CASH_IN') &",
    "        (df_txn['amount'] < 10_000)   # each deposit below reporting limit",
    "    ].copy()",
    "    cash = cash.sort_values(['account_id', 'txn_date'])",
    "    cash['rolling_sum'] = (",
    "        cash.groupby('account_id', group_keys=False)",
    "           .apply(lambda g: g.set_index('txn_date')['amount']",
    "                             .rolling(f'{window_days}D').sum()",
    "                             .reset_index(drop=True))",
    "    )",
    "    cash['rolling_cnt'] = (",
    "        cash.groupby('account_id', group_keys=False)",
    "           .apply(lambda g: g.set_index('txn_date')['amount']",
    "                             .rolling(f'{window_days}D').count()",
    "                             .reset_index(drop=True))",
    "    )",
    "    alerts = (",
    "        cash[(cash['rolling_sum'] > threshold) & (cash['rolling_cnt'] >= min_txns)]",
    "            .groupby('account_id')",
    "            .agg(peak_rolling_sum=('rolling_sum', 'max'),",
    "                 alert_txn_count=('rolling_cnt', 'max'))",
    "            .reset_index()",
    "    )",
    "    return alerts",
    "",
    "df_txn = pd.read_csv('nb_transactions.csv', parse_dates=['txn_date'])",
    "alerts = apply_rule_1(df_txn)",
    "print(f'Rule 1 generated {len(alerts)} alerts')",
    "alerts.head(10)",
  ]),
  outputBox("▶ Real Output — Rule 1 Alerts (threshold USD 7,500, 30-day window)", [
    "Rule 1 generated 47 alerts",
    "",
    "account_id  peak_rolling_sum  alert_txn_count",
    "   ACC0003         106250.82               12",
    "   ACC0006          88003.61               10",
    "   ACC0005          87504.73               10",
    "   ACC0004          82093.09                9",
    "   ACC0001          80375.32                9",
    "   ACC0002          71978.38                8",
    "   ACC0431          13302.07                3",
    "   ACC0381          12325.71                5",
    "   ACC0354          11652.20                4",
    "   ACC0122          10814.49                4",
  ]),
  imageBlock('/sessions/intelligent-blissful-clarke/mnt/aml-book1/ch4_rule1_thresholds.png', 400, 233),
  body("The output shows 47 alerts. Six mule accounts (ACC0001–ACC0006) sit at the top of the list — their peak 30-day rolling sums reach USD 106,000, an order of magnitude above the threshold. The bar chart shows how alert volume responds to threshold changes: raising the threshold to USD 9,000 cuts the queue from 47 to fewer alerts, while dropping to USD 6,000 expands it. This sensitivity is the central question in Exercise 4.1. The apply_rule_1() function above is the starting point you will extend in Chapter 6 when you add the velocity rule."),
  spacer(),

  h2("4.9 Risk Considerations"),
  calloutMixed("Risk Considerations", [
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Poorly designed scenarios: "), smallRun("A scenario that does not correctly encode the underlying typology will generate alerts that do not correspond to suspicious activity (false positives) or will miss suspicious activity entirely (false negatives). Both errors have regulatory consequences. Design quality must be documented and defensible.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Over-reliance on rules: "), smallRun("Rule-based systems cannot detect novel typologies that have not been encoded in a rule. Institutions that rely exclusively on rule-based monitoring risk being blind to emerging money laundering methods. A layered approach — rules complemented by anomaly detection — provides more robust coverage.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Explainability of ML: "), smallRun("Where ML techniques are used to generate or score alerts, the institution must be able to explain the output to a regulator or in a court proceeding. 'The model said so' is not an adequate explanation. Model governance frameworks must include documentation of the model's logic, its training data, its validation results, and its limitations.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [smallBold("Scenario creep: "), smallRun("Over time, institutions accumulate scenarios without retiring obsolete ones. A library of hundreds of poorly maintained scenarios generates noise, consumes analyst capacity, and obscures the signals that matter. Scenario governance — regular review and rationalisation — is a risk management discipline in its own right.")] }),
  ], "FFF3E6"),
  spacer(),

  takeawayBox([
    "TMS has evolved through four generations: manual review, profiling-based systems, rule-based engines, and AI/ML-driven platforms. Profiling-based approaches (exemplified by Searchspace) fell out of favour in practice — due to scalability constraints at growing customer volumes, increasing regulatory demands for explainability, and the high ongoing cost of expert judgement required for peer-group maintenance; rule-based systems remain the dominant deployed architecture.",
    "Each generation added capability but introduced new trade-offs: profiling required human-defined peer groups that were impractical to maintain; rule-based systems encode human judgement explicitly but cannot detect novel typologies; ML systems add detection power but sacrifice explainability.",
    "The current frontier combines four capabilities: Entity Consolidation, unsupervised ML, graph and network analysis, and event triage. These are foundational to modern platforms such as Quantexa and Ayasdi, and cannot be replicated by adding ML scoring to a legacy rule engine.",
    "TMS generation does not determine programme maturity. A bank using a frontier ML platform can still be at the Nascent maturity stage if it has no documentation, no tuning framework, and no governance. The system is one component; the programme is everything else.",
    "Scenario design follows a five-step methodology: identify the typology, extract red flags, define the logic, set the parameters, test and validate.",
    "A scenario is not a classifier — it encodes expert judgement, not optimised weights. Validation proceeds by reference to typology coverage, not prediction accuracy on a holdout set.",
    "The Northgate structuring scenario (NRB-STRUCT-001) monitors rolling 30-day cash deposits below USD 10,000. Initial threshold: USD 7,500; minimum transaction count: 3.",
    "Coverage, precision, and recall are the three dimensions of scenario evaluation. Recall is the hardest to measure in AML because the true suspicious population is unknown.",
    "Tuning is expected and structured. Initial parameters are a starting point. Chapter 6 provides the full tuning methodology.",
    "Scenario governance — regular review, rationalisation, and retirement of obsolete rules — is a risk management discipline, not a housekeeping exercise.",
  ]),
  spacer(),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Exercise 4.1 — Designing the Northgate Structuring Rule  [Intermediate]", font: "Arial", size: 22, bold: true, color: "2E75B6" })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Part A — Designing the Northgate Structuring Rule  [Intermediate]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Recap: "), smallRun("In Exercise 3.1 you traced the Northgate structuring scenario through the full TM lifecycle. Now design the rule that would have generated the alert.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Task: "), smallRun("Using the formal scenario design methodology from Section 4.6, write a complete rule specification for the Northgate structuring scenario. Your specification should include all of the following elements:")] }),
    numbered("The typology being targeted, with a reference to at least one published typology document.", "numbers2"),
    numbered("At least four red flags that are detectable from transactional and customer data.", "numbers2"),
    numbered("The complete rule logic, written in plain English and in pseudo-code (matching the format in Section 4.7).", "numbers2"),
    numbered("All three parameters (threshold amount, lookback window, minimum transaction count) with a brief justification for your initial values.", "numbers2"),
    numbered("The customer scope, specifying which accounts the rule applies to and which are excluded.", "numbers2"),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("False Positive and False Negative Analysis: "), smallRun("Once you have written the specification, answer the following:")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("What would a false positive look like under this rule? Describe a realistic customer scenario that would trigger your rule but is not suspicious.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("What would a false negative look like? Describe a structuring pattern that is genuinely suspicious but would not be detected by your rule as specified.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 }, children: [smallRun("What change to the rule logic or parameters would address each error type? What is the trade-off of making that change?")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Colab Extension: "), smallRun("Open the Chapter 4 Colab notebook. The apply_rule_1() function from Section 4.8 is pre-loaded. Run Cell 1 to apply the rule at the default threshold (USD 7,500) and observe the alert count. Then change the threshold parameter to USD 6,000 and USD 9,000 and record how alert volume changes. In Cell 3, examine the flagged accounts: are the six Northgate mule accounts all captured? What threshold first detects all six? Answer the discussion questions in the notebook before returning to Part B.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallItalic("In Chapter 5, we will segment the customer population and use the resulting peer groups to refine the threshold applied to each segment. In Chapter 6, we calibrate the threshold using empirical performance data.")] }),
  ]),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Part B — Meridian Trading Ltd: Design a TBML Scenario  [Applied / Out-of-the-Box]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("We now know that Meridian Trading Ltd is the consistent beneficiary of the Northgate structuring funds. A review of Meridian's account activity reveals an additional pattern: Meridian regularly pays overseas suppliers invoices for 'industrial machinery components,' but invoice amounts are substantially above market price benchmarks for the declared commodity type. This is a trade-based money laundering (TBML) indicator — specifically, the over-invoicing variant. Using the same five-step scenario design methodology from Section 4.6, design a rule that would detect Meridian's TBML activity.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Task:")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 60 }, children: [smallRun("Write the typology description for TBML (over-invoicing variant) with a reference to at least one FATF or FinCEN published typology source. Identify the red flags that are detectable from Meridian's transaction and invoice data.")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 60 }, children: [smallRun("Write the formal rule specification for scenario TBML-INVOICE-001. Include: scope (which accounts), logic (what comparison is made between invoice amount and market benchmark), parameters (threshold ratio, minimum transaction count), and data prerequisites (what data sources beyond the standard transaction feed are required).")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 80 }, children: [smallRun("Compare TBML-INVOICE-001 to NRB-STRUCT-001 on four dimensions: (a) data requirements, (b) false positive risk, (c) regulatory defensibility, and (d) dependency on data sources outside the core banking system. What does this comparison tell you about the relative difficulty of commercial vs. retail monitoring?")] }),
  ]),

  exerciseBox([
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Part C — Project Sentinel: The Link Rule  [Synthesis / Stretch]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("LINK-CROSS-001 is the cross-case link rule: it fires when a Northgate-alerted account appears as a beneficiary in Meridian's incoming payment ledger within a 90-day window — the moment the two cases become one. Your task is to design LINK-CROSS-001.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Task:")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 60 }, children: [smallRun("Write the rule logic for LINK-CROSS-001 in plain English (two to three sentences) and in the pseudo-code format used in Section 4.7. The rule must specify: the trigger condition (what must already be true), the detection logic (what transaction pattern is detected), the lookback window, and the output (what alert or case linkage is generated).")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 60 }, children: [smallRun("What are the main false positive risks for LINK-CROSS-001? Consider: (a) legitimate commercial customers who receive payments from accounts that happen to have been alerted for unrelated reasons, (b) the impact of a high noisy alert rate in NRB-STRUCT-001 on LINK-CROSS-001's precision. How would you mitigate each risk?")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 80 }, children: [smallRun("LINK-CROSS-001 creates an organisational design question: who owns it? The Northgate structuring alerts are reviewed by Northgate's retail L1 team. Meridian's TBML alerts would be reviewed by a commercial financial crime team. When LINK-CROSS-001 fires and the two cases merge, which team leads the investigation? What governance mechanism should Project Sentinel implement to ensure neither team drops the case?")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallItalic("In Chapter 5, you will apply K-Means clustering to refine monitoring thresholds for the Northgate accounts. In Chapter 6, you will calibrate those thresholds — and see how the calibration of NRB-STRUCT-001 affects the probability that LINK-CROSS-001 fires.")] }),
  ]),
  spacer(),

  h2("Further Reading and Research Topics"),
  numbered("FATF Report on Trade-Based Money Laundering (2006, updated 2020 — freely available at fatf-gafi.org). Chapter 3 describes the over-invoicing typology and provides worked red flag examples. Compare the FATF red flags with those you identified for TBML-INVOICE-001."),
  numbered("[AUTHOR FLAG: 'FCG 8.2' is FCA Financial Crime Guide notation, not FFIEC manual notation. The FFIEC manual uses a different section structure. This sentence mixes two separate documents. Please confirm: is the intended reference (a) the FCA's Financial Crime Guide (FCG) 8.2, or (b) a specific section of the FFIEC BSA/AML Examination Manual? Replace with the correct document title, section number, and URL.] Read [correct document] on scenario design. [Correct regulator] expects firms to be able to demonstrate that scenarios are derived from a documented typology assessment. Review the guidance and assess whether your TBML-INVOICE-001 specification would satisfy the relevant standard."),
  numbered("Research Question: FinCEN's Financial Trend Analysis (FTA) reports periodically identify the most commonly reported typologies in US SARs. Download the most recent FTA report. Is trade-based money laundering among the top ten typologies? What does this tell you about the relative detection rate of TBML versus other typologies?"),
  numbered("Design challenge: The EGMONT Group publishes case studies of cross-border financial intelligence sharing that uncovered TBML schemes (egmontgroup.org). Read two case studies. In each case, identify: what data source was decisive in linking the trade activity to the underlying crime, and whether that data source would be available to a US retail bank's Transaction Monitoring Framework."),
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
    headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } }, children: [new TextRun({ text: "Applied AML Analytics  |  Chapter 4", font: "Arial", size: 18, color: MID_BLUE })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: "Arial", size: 18, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "888888" })] })] }) },
    children
  }]
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/Book1_Chapter4.docx', buf); console.log('Done: Book1_Chapter4.docx'); });

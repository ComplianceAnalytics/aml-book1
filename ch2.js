const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat
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
function takeawayBox(items) {
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026], rows: [new TableRow({ children: [new TableCell({ borders: cellBorder("1A7A4A"), width: { size: 9026, type: WidthType.DXA }, shading: { fill: "E6F9F0", type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 180, right: 180 }, children: [new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Key Takeaways", font: "Arial", size: 22, bold: true, color: "1A7A4A" })] }), ...items.map(t => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [smallRun(t)] }))] })] })] });
}
function regTable(headers, rows, widths) {
  const hRow = new TableRow({ children: headers.map((h, i) => new TableCell({ borders: cellBorder("999999"), width: { size: widths[i], type: WidthType.DXA }, shading: { fill: DARK_NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 18, bold: true, color: WHITE })] })] })) });
  const dRows = rows.map((row, ri) => new TableRow({ children: row.map((cell, ci) => new TableCell({ borders: cellBorder("CCCCCC"), width: { size: widths[ci], type: WidthType.DXA }, shading: { fill: ri % 2 === 0 ? "FFFFFF" : LIGHT_GREY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 18, color: "222222" })] })] })) }));
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: widths, rows: [hRow, ...dRows] });
}

// ════════════════════════════════════════════════════════════════════════════
const children = [

  h1("Chapter 2: Key Regulations and the Regulatory Landscape"),
  spacer(),

  calloutMixed("Learning Objectives — By the end of this chapter you will be able to:", [
    numbered("Identify the principal AML legislation in the US, EU, UK, and Singapore and describe its core requirements.", "numbers"),
    numbered("Apply the correct regulatory framework to a transaction monitoring scenario based on the institution's jurisdiction.", "numbers"),
    numbered("Explain the role of FATF, FFIEC, and JMLSG as guidance bodies and distinguish them from statutory regulators.", "numbers"),
    numbered("Determine which regulatory obligations were triggered by the Northgate structuring scenario from Chapter 1.", "numbers"),
  ], "E8EEFF"),
  spacer(),

  h2("2.1 Business Context: Why Regulation Shapes Analytics"),
  body("Regulation is not a constraint on good analytics — it is the reason good analytics exists. Every scenario you design, every threshold you calibrate, every alert you review, and every SAR you file is situated within a legal framework that defines what you must do, what you must not do, and what you must be able to demonstrate to an examiner."),
  body("Understanding the regulatory landscape is therefore not background knowledge. It is operational knowledge. When an analyst calibrates a threshold, they are making a decision that will be examined against regulatory expectations. When they decide not to file a SAR, that decision is a legal one, not just an analytical one."),
  body("This chapter introduces the main regulatory regimes relevant to AML transaction monitoring. We focus on four jurisdictions: the United States, the European Union, the United Kingdom, and Singapore. These are not the only jurisdictions that matter, but they are the most influential — between them, they set the tone for AML regulation globally."),

  h2("2.2 The International Foundation: FATF"),
  body("The Financial Action Task Force (FATF) is the international standard-setting body for AML and counter-terrorist financing (CFT). Established in 1989, it currently has 37 member states plus the European Commission and Gulf Co-operation Council."),
  body("FATF does not make law. It publishes Recommendations — currently 40 — that member countries are expected to implement in their national legislation. Countries that fail to comply with FATF standards can be placed on the FATF \"grey list\" or \"black list\", which signals to international financial institutions that they should apply heightened due diligence to transactions involving those countries."),

  h3("2.2.1 The 40 Recommendations: What They Require"),
  body("The 40 Recommendations cover four broad areas relevant to transaction monitoring:"),
  bullet("Risk-based approach (one of the most frequently misused terms in AML — we examine what it actually means in practice in Chapter 4): Countries and institutions should identify, assess, and understand their ML/TF risks and apply resources proportionally. This is the foundational principle of modern AML — not every customer or transaction carries the same risk."),
  bullet("Customer Due Diligence (CDD): Financial institutions must verify customer identity, understand the nature of the business relationship, and conduct enhanced due diligence for higher-risk customers."),
  bullet("Transaction monitoring and SAR filing: Institutions must monitor transactions and report suspicious activity to the relevant financial intelligence unit."),
  bullet("International co-operation: Countries must share financial intelligence and co-operate with cross-border investigations."),
  spacer(),

  callout("Risk Perspective",
    "FATF's risk-based approach is not a licence to do less. It means you must be able to justify the level of scrutiny applied to each customer category. 'We did not monitor this because it was low risk' is only defensible if you can demonstrate how you assessed that risk. The documented risk assessment is the artefact a regulator examines — not the monitoring decision itself. Regulators expect documented evidence of the risk-assessment process, not just its conclusion.",
    "FFF3E6"),
  spacer(),

  h2("2.3 United States"),
  body("The United States has the most developed and, in some respects, most prescriptive AML regulatory framework in the world. It is also the most extraterritorial: US enforcement actions reach non-US institutions that process dollar transactions or maintain US correspondent accounts. Four pieces of legislation form its backbone."),

  h3("2.3.1 The Bank Secrecy Act (BSA), 1970"),
  body("The BSA is the foundational US AML statute. It requires financial institutions to assist US government agencies in detecting and preventing money laundering. Its core requirements are:"),
  bullet("Currency Transaction Reports (CTRs): Banks must file a CTR for any cash transaction exceeding $10,000."),
  bullet("Suspicious Activity Reports (SARs): Banks must file a SAR when they know, suspect, or have reason to suspect that a transaction involves funds from illegal activity, or that the transaction is designed to evade reporting requirements."),
  bullet("Customer Identification Programme (CIP): Banks must verify customer identity at account opening."),
  bullet("Record-keeping: Banks must maintain records of certain transactions and customer information for defined periods."),
  spacer(),

  body("The Financial Crimes Enforcement Network (FinCEN), a bureau of the US Department of the Treasury, enforces the BSA. FinCEN issues interpretive guidance and publishes SAR data that informs AML analytics work nationally."),

  h3("2.3.2 The Money Laundering Control Act, 1986"),
  body("This Act criminalised money laundering for the first time in US federal law. Before 1986, money laundering was not itself a crime — only the underlying predicate offence was. The Act created two new criminal offences: knowingly conducting a financial transaction involving the proceeds of specified unlawful activity, and knowingly engaging in a transaction designed to evade reporting requirements. The latter offence is particularly relevant to structuring detection."),

  h3("2.3.3 The USA PATRIOT Act, 2001"),
  body("Enacted following the September 2001 terrorist attacks, the Patriot Act significantly expanded AML obligations. Its most important contributions to transaction monitoring are:"),
  bullet("Enhanced Customer Due Diligence: Banks must identify and verify the beneficial owners of legal entity customers."),
  bullet("Correspondent banking due diligence: Banks must apply enhanced due diligence to accounts held by foreign financial institutions."),
  bullet("Information sharing: Section 314 enables banks to share information with each other and with law enforcement about suspected money laundering, subject to safe harbour protections."),
  spacer(),

  h3("2.3.4 The Anti-Money Laundering Act (AMLA), 2020"),
  body("The AMLA 2020 is the most significant update to US AML law in two decades. It introduced:"),
  bullet("Beneficial ownership registry: FinCEN is establishing a national registry of beneficial owners of companies formed in the US — a significant tool for structuring investigations where shell companies are used."),
  bullet("Innovation office: FinCEN established an office to promote technological innovation in AML, explicitly acknowledging that machine learning and AI have a role to play."),
  bullet("Effectiveness standards: For the first time, US law requires that AML programmes be effective, not merely compliant. This has significant implications for how analytics teams must document and evidence their work."),
  spacer(),

  h3("2.3.5 SR 26-2 and OCC 2026 — Model Risk Management"),
  body("The US model risk management framework originates not from AML law but from banking supervision. In 2026, the Federal Reserve and the Office of the Comptroller of the Currency (OCC) jointly issued SR 26-2 ('Guidance on Model Risk Management'), superseding the earlier SR 11-7 (2011) and establishing the current standard for how banks must govern, validate, and document any analytical model — including AML transaction monitoring models."),
  body("SR 26-2 defines a model broadly: any quantitative method, system, or approach that applies statistical, economic, financial, or mathematical theories or techniques to transform inputs into quantitative estimates. Under this definition, a rule-based TM scenario, a segmentation model, and an ML-based alert scoring system are all models subject to model risk management requirements."),
  body("The core requirements — model development, validation by an independent function, ongoing monitoring, and documented governance — are ones we apply specifically to AML analytics throughout this book and build into a five-pillar framework in Chapter 9."),
  spacer(),

  h2("2.4 European Union"),
  body("EU AML regulation is built on a series of Anti-Money Laundering Directives (AMLDs), which member states are required to transpose into national law. The Directives establish minimum standards; member states may implement stricter requirements."),
  spacer(),

  regTable(
    ["Directive", "Year", "Key Additions"],
    [
      ["AMLD 1", "1991", "First EU AML framework. Established CDD requirements and SAR obligations for credit and financial institutions."],
      ["AMLD 2", "2001", "Extended scope to notaries, accountants, auditors, and lawyers. Enhanced CDD for politically exposed persons (PEPs)."],
      ["AMLD 3", "2005", "Introduced the risk-based approach. Required customer risk assessment and enhanced due diligence for high-risk customers."],
      ["AMLD 4", "2015", "Strengthened beneficial ownership transparency. Established national beneficial ownership registers."],
      ["AMLD 5", "2018", "Extended regulation to virtual currency exchanges and custodian wallet providers. Expanded access to beneficial ownership registers. Widened definition of PEPs."],
      ["AMLD 6", "2020", "Expanded the list of predicate offences for money laundering to 22. Introduced criminal liability for legal entities. Strengthened cooperation between member states."],
    ],
    [1500, 800, 6726]
  ),
  spacer(),

  body("The EU has consolidated its AML framework under a new Anti-Money Laundering Authority (AMLA), which became operational in 2025 and holds direct supervisory powers over the highest-risk cross-border financial institutions. This marks a significant shift from the previous model, where AML supervision was primarily a national responsibility. Whether the EU's traditional compliance-led framework will prove effective as crypto assets and decentralised finance become mainstream is a question we examine in Chapter 10."),

  h3("2.4.1 FATF and the EU"),
  body("The EU is a member of FATF and its legislative framework is designed to implement FATF's 40 Recommendations. In practice, the EU's AML Directives often go further than FATF minimum standards, particularly on beneficial ownership transparency and the scope of obliged entities."),

  h2("2.5 United Kingdom"),
  body("The UK's AML regime was historically aligned with EU law through the AML Directives. Since leaving the EU, the UK has retained substantially the same framework but now develops its rules independently."),

  h3("2.5.1 The Money Laundering Regulations (MLRs)"),
  body("The Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017 (as amended) are the primary implementing legislation for AML obligations on UK financial institutions. They set out requirements for:"),
  bullet("Customer due diligence, including enhanced due diligence for higher-risk situations."),
  bullet("Ongoing monitoring of business relationships and transactions."),
  bullet("Policies, controls, and procedures to prevent money laundering."),
  bullet("Staff training and awareness."),
  spacer(),

  h3("2.5.2 The Financial Conduct Authority (FCA)"),
  body("The FCA is the primary AML supervisor for most UK financial services firms, including retail banks. It conducts thematic reviews and individual firm supervision, and has the power to impose unlimited fines and criminal sanctions. Its publication \"Financial Crime: A Guide for Firms\" sets out its expectations in considerable detail and is essential reading for any UK-based AML professional."),

  h3("2.5.3 The Proceeds of Crime Act (POCA) 2002"),
  body("POCA 2002 criminalises money laundering and tipping off. Its definition of money laundering is intentionally broad: it covers the acquisition, use, or possession of criminal property, regardless of which crime generated it. The tipping off offence — disclosing to a customer that a SAR has been or is about to be filed — is a criminal offence carrying up to two years imprisonment. Every analyst working with SARs must understand this."),

  h3("2.5.4 PRA Supervisory Statement SS1/23 — Model Risk Management"),
  body("The PRA's SS1/23 establishes supervisory expectations for model risk management at UK banks. While not AML-specific, it is directly relevant to any analytical model used in a Transaction Monitoring Framework — including segmentation models, threshold calibration models, and ML-based alert scoring. The principles in SS1/23 parallel those in the US Federal Reserve's SR 26-2 guidance (Section 2.3.5). We synthesise both into a five-pillar framework for AML model validation in Chapter 9."),

  h2("2.6 Singapore"),
  body("Singapore's AML framework is smaller in scope than the US or EU frameworks but notable for its pragmatism and technological sophistication. We cover its three core components. The framework is administered by the Monetary Authority of Singapore (MAS) and reflects Singapore's position as one of the world's major financial centres."),

  h3("2.6.1 The Corruption, Drug Trafficking and Other Serious Crimes (Confiscation of Benefits) Act (CDSA)"),
  body("The CDSA criminalises money laundering in Singapore. It applies to the proceeds of a wide range of serious crimes and imposes obligations to report knowledge or suspicion of money laundering to the Suspicious Transaction Reporting Office (STRO)."),

  h3("2.6.2 MAS Notice 1070"),
  body("MAS Notice 1070 (\"Prevention of Money Laundering and Countering the Financing of Terrorism — Banks\") sets out the requirements for CDD, ongoing monitoring, and suspicious transaction reporting for Singapore-licensed banks. It is broadly aligned with FATF standards and explicitly references the risk-based approach."),

  h3("2.6.3 MAS Technology Risk Management Guidelines"),
  body("The MAS TRM Guidelines are relevant to any technology system used in AML — including transaction monitoring systems. They require banks to manage the risks associated with technology systems and to ensure those systems are resilient, accurate, and well-governed. The principles in these guidelines overlap significantly with model risk management frameworks elsewhere."),

  h2("2.7 Key Guidance Bodies: FFIEC and JMLSG"),
  body("Beyond the statutory regulators, two guidance bodies are particularly important for AML transaction monitoring practitioners."),

  h3("2.7.1 FFIEC — BSA/AML Examination Manual"),
  body("The Federal Financial Institutions Examination Council (FFIEC) publishes the BSA/AML Examination Manual, the definitive guide to how US bank examiners assess AML compliance. While it is a US document, it is widely referenced internationally because of its detail and practical focus. Analysts should be familiar with its sections on transaction monitoring, suspicious activity identification, and red flags — we draw on these extensively in Chapter 7."),

  h3("2.7.2 JMLSG — Guidance for the UK Financial Sector"),
  body("The Joint Money Laundering Steering Group (JMLSG) is a private sector body that publishes guidance for UK financial services firms on how to comply with the Money Laundering Regulations. Its guidance is not legally binding, but HM Treasury has approved it, and courts may take compliance with JMLSG guidance into account when considering whether a firm has met its legal obligations. It is the closest thing the UK has to a practitioners' manual for AML compliance."),

  callout("From School to Practice",
    "You may be familiar with the concept of 'regulatory arbitrage' from economics or finance courses — the idea that firms choose their domicile based on regulatory burden. In AML, the opposite pressure applies. International institutions must comply with the most demanding standard across all the jurisdictions in which they operate. A US bank with a Singapore branch cannot apply weaker standards in Singapore just because MAS has different rules — it must apply whichever framework is more demanding on each specific point. This is why senior AML professionals must understand multiple regulatory regimes simultaneously.",
    "E8F4E8"),
  spacer(),

  h2("2.8 Regulatory Comparison: Key Requirements by Jurisdiction"),
  spacer(),

  regTable(
    ["Requirement", "US", "EU", "UK", "Singapore"],
    [
      ["Mandatory SAR/STR Filing", "Yes (BSA)", "Yes (AMLDs)", "Yes (POCA 2002 / MLRs)", "Yes (CDSA)"],
      ["Risk-Based Approach", "Yes (AMLA 2020)", "Yes (AMLD 3+)", "Yes (MLRs)", "Yes (MAS Notice 1070)"],
      ["Beneficial Ownership Register", "Yes (AMLA 2020 / FinCEN)", "Yes (AMLD 4+)", "Yes (MLRs)", "Partial (ACRA — Accounting and Corporate Regulatory Authority)"],
      ["Crypto / Virtual Assets Covered", "Yes (FinCEN guidance)", "Yes (AMLD 5)", "Yes (MLRs 2019 amendment)", "Yes (MAS PSA)"],
      ["Model Risk Framework Required", "Yes (SR 26-2)", "Indirect (EBA ICT)", "Yes (PRA SS1/23)", "Yes (MAS TRM)"],
      ["Tipping-Off Offence", "Yes (BSA)", "Yes (AMLDs)", "Yes (POCA 2002 s.333A)", "Yes (CDSA)"],
    ],
    [2500, 1500, 1500, 1500, 2026]
  ),
  spacer(),

  h2("2.9 Risk Considerations"),
  body("The regulatory landscape has several important risk dimensions for AML analysts."),

  bulletMixed([smallBold("Regulatory change risk: "), smallRun("The landscape evolves constantly. A scenario that was adequate two years ago may have coverage gaps today if regulators have issued new typologies or guidance. Analysts must build regular regulatory horizon-scanning into their review cycles.")]),
  bulletMixed([smallBold("Jurisdictional complexity: "), smallRun("Large institutions operate across multiple jurisdictions simultaneously. The same transaction may trigger obligations in two or more regulatory regimes. Building scenarios that satisfy multiple frameworks simultaneously requires careful documentation.")]),
  bulletMixed([smallBold("Guidance vs. legislation: "), smallRun("FFIEC guidance and JMLSG publications are not law, but in a regulatory examination, failure to follow them requires explanation. Treat authoritative guidance as a near-mandatory standard unless you have documented reasons for departing from it.")]),
  bulletMixed([smallBold("Safe harbour limitations: "), smallRun("Filing a SAR generally provides a bank with safe harbour against civil liability for the underlying transaction. It does not protect the bank from regulatory action if the quality or timeliness of SAR filing is inadequate.")]),
  spacer(),

  takeawayBox([
    "FATF sets the international standard. National legislation implements it, sometimes with additional requirements.",
    "US: BSA (1970), MLCA (1986), Patriot Act (2001), AMLA (2020) — FinCEN is the primary enforcement body.",
    "EU: Six Anti-Money Laundering Directives. AMLD 5 and 6 are the most current and most relevant.",
    "UK: Money Laundering Regulations + POCA 2002. FCA supervises. Tipping off is a criminal offence.",
    "Singapore: CDSA + MAS Notice 1070. MAS TRM Guidelines cover technology risk in AML systems.",
    "FFIEC Examination Manual and JMLSG guidance are not law but are treated as near-mandatory standards by practitioners.",
    "Model risk management frameworks (SR 26-2 (US), PRA SS1/23 (UK), MAS TRM) directly govern how AML analytics models must be built and validated.",
  ]),
  spacer(),

  // Exercise 2.1
  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Exercise 2.1 — The Regulatory Landscape Applied  [Foundation → Intermediate]", font: "Arial", size: 22, bold: true, color: "2E75B6" })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Part A — The Regulatory Landscape Applied  [Foundation → Intermediate]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Recap: "), smallRun("In Exercise 1.1, you identified suspicious behaviours in the Northgate structuring scenario and formed a preliminary view on whether the pattern warranted escalation.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Objective: "), smallRun("Apply the appropriate regulatory framework to the Northgate scenario and determine the bank's obligations.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Scenario update: "), smallRun("[AUTHOR FLAG: Throughout the book Northgate Retail Bank is a UK-incorporated institution supervised by the FCA. This scenario update describes it as 'a US federally regulated institution supervised by FinCEN' — inconsistent with all other chapters. If the exercise is intended to allow students to apply either UK or US framework (as Task 1 implies), the scenario description should be neutral or explicitly UK. Please confirm whether to change to 'Northgate Retail Bank is a UK-regulated institution supervised by the FCA' or revise the task instruction to reflect a US-only framing.]")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Task:")] }),
    numbered("Identify which legislation and regulatory guidance applies to this scenario, using either UK or US regulatory guidance. If using US: which statute creates the obligation to report suspicious activity (e.g. Bank Secrecy Act), and which guidance manual should the analyst consult (e.g. FFIEC BSA/AML Examination Manual)? If using UK: which statute applies (e.g. POCA 2002), and which guidance body's manual should the analyst consult (e.g. JMLSG)? Your answer should reference the specific statute and guidance document.", "numbers2"),
    numbered("Using the FFIEC guidance (Part I, Chapter 6 — available free at ffiec.gov), identify at least three 'red flag' indicators from the FFIEC list that are present in the Northgate scenario.", "numbers2"),
    numbered("At what point, if any, does the bank have a legal obligation to file a SAR? Does the bank need to be certain that money laundering is occurring? Draft a one-paragraph justification for or against filing, referencing the appropriate legal threshold.", "numbers2"),
    numbered("The pattern involves structuring — deposits consistently below the $10,000 reporting threshold. Is structuring itself an offence under UK law? Under US law? How does this affect the bank's analytical focus? Note that the US CTR threshold is $10,000 and the UK threshold is $10,000. What are the implications of this difference for a structuring detection scenario at a bank operating in both jurisdictions?", "numbers2"),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Discussion Questions:")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("If Northgate also had a US branch, and the same pattern occurred across both jurisdictions, which additional regulatory obligations would apply?")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 }, children: [smallRun("The AMLA 2020 introduced an 'effectiveness' standard for AML programmes in the US. If this standard were applied in the UK, what would it require Northgate to demonstrate about its Transaction Monitoring Framework?")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallItalic("See the Instructor's Solutions Manual for worked answers. In Chapter 3, we trace this same scenario through the full transaction monitoring lifecycle — from raw data to SAR filing.")] }),
  ]),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Part B — Meridian Trading Ltd: Regulatory Obligations  [Applied]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("We continue with Meridian Trading Ltd — the US import/export business introduced in Exercise 1.2. Northgate Retail Bank holds a business current account for Meridian, registered under SIC code 46690, with two named directors. The account has been open for 14 months. Over that period, Meridian has received 23 incoming wire transfers from overseas counterparties totalling USD 1.4 million, and has sent 31 outgoing wires to four overseas beneficiaries. No EDD review has been conducted since account opening.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Task:")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 60 }, children: [smallRun("Under the UK MLR 2017 / POCA 2002 requirements, what CDD and EDD obligations apply to Meridian as a legal entity customer? Specifically: what must the bank verify about its beneficial owners, and when should EDD have been triggered? Reference the specific MLR regulation number where possible.")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 60 }, children: [smallRun("The FATF Recommendation on Trade-Based Money Laundering (TBML) states that banks should apply enhanced scrutiny to commercial customers whose transaction patterns involve high-value international wires inconsistent with their stated business activity. What does this mean in practice for Northgate's obligations toward Meridian? What information would the bank need to assess whether the wires are consistent with Meridian's stated business?")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 80 }, children: [smallRun("In the US, correspondent banking relationships trigger enhanced due diligence under the Patriot Act Section 312. If Northgate had a correspondent relationship with a US bank through which Meridian's overseas wires were processed, what additional obligations would that US correspondent bank have? How does this create a chain of regulatory responsibility that the US bank should be aware of?")] }),
    new Paragraph({ spacing: { after: 0 }, children: [smallItalic("In Chapter 3, we trace Meridian's transaction data through the TM lifecycle. In Chapter 4, we see for the first time that the Northgate Accounts and Meridian are connected.")] }),
  ]),
  spacer(),

  h2("Further Reading and Research Topics"),
  numbered("Read the FATF 40 Recommendations (freely available at fatf-gafi.org). Focus on Recommendations 10 (CDD), 20 (Reporting of Suspicious Transactions), and 29 (Financial Intelligence Units). Consider how each maps onto Northgate's situation."),
  numbered("Download and read Section 5.2 of the FFIEC BSA/AML Examination Manual (\"Suspicious Activity Monitoring\"). Compare the US examiner's definition of adequate monitoring with what you observe in the Northgate scenario."),
  numbered("Research Question: The UK's NCA publishes an annual SARs report. What does the most recent report say about the quality of SARs received from the banking sector? What are the most common deficiencies?"),
  numbered("The EU's AMLA became operational in 2025. Research its supervisory scope. Which types of institutions does it directly supervise, and what does this mean for transaction monitoring programmes at those institutions? How does direct EU-level supervision change the accountability framework for AML analytics teams?"),
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
    headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } }, children: [new TextRun({ text: "Applied AML Analytics  |  Chapter 2", font: "Arial", size: 18, color: MID_BLUE })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: "Arial", size: 18, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "888888" })] })] }) },
    children
  }]
});
Packer.toBuffer(doc).then(buf => { fs.writeFileSync('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/Book1_Chapter2.docx', buf); console.log('Done: Book1_Chapter2.docx'); });

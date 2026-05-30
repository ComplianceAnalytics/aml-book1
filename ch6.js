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
  { reference: "numbers3", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
];

const cellBorder = (c = "CCCCCC") => ({ top: { style: BorderStyle.SINGLE, size: 1, color: c }, bottom: { style: BorderStyle.SINGLE, size: 1, color: c }, left: { style: BorderStyle.SINGLE, size: 1, color: c }, right: { style: BorderStyle.SINGLE, size: 1, color: c } });
const run = t => new TextRun({ text: t, font: "Arial", size: 22, color: "222222" });
const bold = t => new TextRun({ text: t, bold: true, font: "Arial", size: 22, color: "222222" });
const italic = t => new TextRun({ text: t, italics: true, font: "Arial", size: 22, color: "222222" });
const smallRun = t => new TextRun({ text: t, font: "Arial", size: 20, color: "222222" });
const smallBold = t => new TextRun({ text: t, bold: true, font: "Arial", size: 20, color: "222222" });
const smallItalic = t => new TextRun({ text: t, italics: true, font: "Arial", size: 20, color: "222222" });
const code = t => new TextRun({ text: t, font: "Courier New", size: 18, color: "1A1A2E" });

function body(text) { return new Paragraph({ spacing: { after: 160 }, children: [run(text)] }); }
function para(runs, opts = {}) { return new Paragraph({ spacing: { after: 160 }, ...opts, children: runs }); }
function bullet(text) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 100 }, children: [smallRun(text)] }); }
function bulletMixed(runs) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 100 }, children: runs }); }
function numbered(text, ref = "numbers") { return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 100 }, children: [smallRun(text)] }); }
function numberedMixed(runs, ref = "numbers") { return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 100 }, children: runs }); }
function spacer() { return new Paragraph({ spacing: { after: 200 }, children: [run("")] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function codeBlock(lines) {
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026], rows: [new TableRow({ children: [new TableCell({ borders: cellBorder("AAAAAA"), width: { size: 9026, type: WidthType.DXA }, shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 200, right: 200 }, children: lines.map(l => new Paragraph({ spacing: { after: 40 }, children: [code(l)] })) })] })] });
}

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

  h1("Chapter 6: Tuning and Calibration"),
  spacer(),

  calloutMixed("Learning Objectives — By the end of this chapter you will be able to:", [
    numbered("Explain the ATL/BTL framework and the regulatory and operational trade-offs in threshold setting.", "numbers"),
    numbered("Apply hypergeometric sampling to estimate the suspicious activity rate below the line.", "numbers"),
    numbered("Conduct a rule responsiveness analysis and interpret the results.", "numbers"),
    numbered("Calibrate the Northgate structuring scenario threshold using sampling and responsiveness data.", "numbers"),
  ], "E8EEFF"),
  spacer(),

  h2("6.1 Business Context: Why Thresholds Matter and What it Means to Set Them Wrong"),
  body("Every threshold in a transaction monitoring scenario is a policy decision. Set it too low and you generate thousands of alerts per week, most of which are noisy alerts, consuming analyst capacity and masking the genuine signals beneath the noise. Set it too high and you miss suspicious activity that falls below the line, creating coverage gaps that may allow financial crime to proceed undetected — with consequences for the bank, for the financial system, and for the integrity of the intelligence the bank provides to law enforcement."),
  body("Neither error is cost-free. The operational cost of over-alerting is measurable: staff hours, technology costs, and the opportunity cost of analysts spending time on noisy alerts instead of genuine investigations. The regulatory cost of under-alerting is potentially existential: enforcement action, civil money penalties, reputational damage, and in extreme cases, loss of banking licence."),
  body("Threshold calibration — the process of setting and adjusting scenario parameters to achieve the appropriate balance between coverage and precision — is therefore one of the most consequential activities in the Transaction Monitoring Framework. It is also one of the most scrutinised. Regulators expect institutions to document their calibration methodology, justify their threshold choices with data, and demonstrate that they have tested what they are missing below the line."),
  body("This chapter provides the methodology for doing exactly that. We cover the ATL/BTL framework, hypergeometric sampling for below-the-line risk estimation, responsiveness analysis, the L1/L2/L3 review workflow, and the documentation standards required to defend a calibration exercise to a regulator. We then apply the full methodology to the Northgate structuring scenario."),
  spacer(),

  h2("6.2 The ATL/BTL Framework"),
  body("We introduced the above-the-line and below-the-line distinction in Chapter 3. Here we develop it in full."),
  para([bold("Above the line (ATL)"), run(" is the population of transactions or accounts that generate an alert under a given scenario at a given threshold. Every entity in the ATL is reviewed by an analyst. The ATL has a measurable SAR rate: the proportion of reviewed alerts that result in a SAR being filed. This is the institution's primary precision metric.")]),
  para([bold("Below the line (BTL)"), run(" is the population of transactions or accounts that do not generate an alert. This population is, by definition, unreviewed — unless a specific sampling exercise is conducted. The BTL is where the institution's coverage risk lives. If the threshold is set too high, genuine suspicious activity accumulates in the BTL, undetected.")]),
  body("The threshold is the dividing line between ATL and BTL. Lowering the threshold moves accounts from BTL to ATL: more accounts are reviewed, more alerts are generated, but more suspicious activity is caught. Raising the threshold does the reverse."),
  spacer(),

  regTable(
    ["Population", "Definition", "Measurable?", "Key Metric"],
    [
      ["ATL", "Accounts/transactions that triggered an alert", "Yes — fully reviewed", "SAR rate in alerts (precision)"],
      ["BTL", "Accounts/transactions below the alert threshold", "Partially — via sampling", "Estimated SAR rate below the line"],
      ["True Positives", "ATL accounts that are genuinely suspicious", "Yes — if correctly identified at review", "SAR count, SAR rate"],
      ["False Positives", "ATL accounts that are not genuinely suspicious", "Yes — dismissed at review", "Alert dismiss rate, (1 - SAR rate)"],
      ["Noisy Alerts (above line)", "ATL accounts investigation finds non-suspicious", "Yes — reviewed above the line", "Noisy alert rate = Noisy alerts / Total ATL alerts"],
      ["False Negatives", "BTL accounts that are genuinely suspicious", "Only via sampling or hindsight", "Estimated via hypergeometric sampling"],
    ],
    [1400, 2800, 1800, 3026]
  ),
  spacer(),

  h2("6.3 The Noisy Alert Problem — and Why 'False Positive' Is the Wrong Frame"),
  calloutMixed("Terminology Correction: Noisy Alert vs False Positive", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "The AML industry routinely misuses the term 'false positive.' Before examining the problem, this distinction must be established:", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallBold("Noisy alert (correct term for most cases): "), smallRun("An alert that fits the design intent of the scenario — the scenario fired correctly — but investigation determines the activity is non-suspicious. The alert was legitimate. The scenario did its job. Non-SAR-worthy alerts are noise, not false positives in the technical sense. Calling them 'false positives' implies the scenario malfunctioned. It did not.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallBold("False positive (as used in AML operations): "), smallRun("An alert caused by code bugs, data errors, or scenario design flaws that does not fit the spirit of the scenario. In standard ML/statistics usage, a false positive is any negative-class instance classified as positive regardless of cause; in AML operations, the term is reserved for alerts where the system failed — not for alerts the scenario correctly fired but investigation closed as non-suspicious. For example: a scenario designed to catch large cash deposits fires on a salary payment because the transaction type code was mapped incorrectly. This is a false positive — the system failed. It is a materially different problem from noise.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "Well-defined models and well-calibrated scenarios produce legitimate alerts — even if most of those alerts are closed as non-suspicious. The industry's habit of calling all closed alerts 'false positives' mischaracterises a coverage trade-off as a system malfunction, and drives threshold-raising decisions that create genuine coverage gaps. This book uses 'noisy alert' for the former and reserves 'false positive' for the latter.", font: "Arial", size: 20, color: "222222", italics: true })] }),
  ], "FFF3E6"),
  spacer(),
  body("With that distinction established: high noisy alert rates are a real operational problem. Every noisy alert consumes analyst time without generating useful intelligence. When noisy alert rates are high, they create three compounding problems."),
  body("The claim that '90% of AML alerts are false positives' is one of the most repeated statistics in the industry. It is also one of the least precise. The noisy alert rate depends on the scenario, the threshold, the segmentation, and the quality of the underlying data. A poorly calibrated structuring rule applied to an unsegmented population will have a very different noisy alert rate from a well-tuned rule applied to a properly segmented personal account cluster. Citing a single number across all scenarios and all institutions obscures more than it reveals. Throughout this chapter, we treat the noisy alert rate as a scenario-specific, segment-specific metric — not an industry-wide generality."),
  bulletMixed([smallBold("Operational cost: "), smallRun("Analyst time is finite. At 45 minutes per alert review, a team of 10 analysts can process approximately 90 alerts per day, or around 1,900 per month. If the TMS generates 5,000 alerts per month, the team has a structural capacity deficit regardless of how efficient individual reviews are.")]),
  bulletMixed([smallBold("Alert fatigue: "), smallRun("As described in Chapter 3, high noisy alert rates degrade the quality of individual alert reviews. Analysts who review 95 noisy alerts before reaching a genuine case are less likely to identify the genuine case with full rigour.")]),
  bulletMixed([smallBold("Regulatory risk: "), smallRun("Paradoxically, an excessively high alert volume can itself create regulatory risk. If an institution cannot demonstrate that it has the capacity to review all alerts within required timeframes, examiners may conclude that the Transaction Monitoring Framework is inadequate — even if the scenarios are well-designed.")]),
  spacer(),

  callout("Risk Consideration",
    "A common institutional response to high noisy alert rates is to raise thresholds — reducing alert volume by moving accounts from ATL to BTL. This addresses the operational problem but creates a coverage problem. The correct response is to investigate the root cause: is the threshold too low? Is the scenario logic imprecise? Is the customer population poorly segmented? Raising thresholds without investigation is tuning by volume target, not by risk.",
    "FFF3E6"),
  spacer(),

  h2("6.4 The False Negative Problem"),
  body("A false negative is a genuinely suspicious account or transaction that falls below the alert threshold and is therefore never reviewed. False negatives are harder to identify than false positives — by definition, they are invisible unless specifically sought out."),
  body("The regulatory consequence of false negatives is severe. If a regulator discovers — through a law enforcement inquiry, an SAR tipoff, or an examination — that the institution was missing substantial suspicious activity because its thresholds were set too high, the institution faces enforcement action for failing to maintain an effective monitoring programme. The defence 'we didn't know because our threshold was set this way' is not available — the institution is expected to have tested what it is missing."),
  body("This is why BTL sampling is not optional. The correct goal of BTL sampling is not simply to estimate how much suspicious activity the institution is missing — it is to estimate the probability of missing the minimum required number of SARs within the institution's defined risk appetite. Risk appetite, as defined in this book, is the institution's documented tolerance for financial crime risk, including an acceptable level of false negatives. The BTL sampling exercise produces a statistical estimate of the BTL SAR rate; the institution then assesses whether that rate falls within its defined risk appetite. If it does, the threshold is defensible. If it does not, the threshold must be adjusted. The methodology for this estimation is hypergeometric sampling."),
  spacer(),

  h2("6.5 Hypergeometric Sampling"),
  calloutMixed("From School to Practice: Hypergeometric Sampling in AML", [
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "In statistics, hypergeometric sampling is used to estimate population parameters from a sample drawn without replacement — that is, once a unit is selected, it is removed from the sampling pool. You may have encountered it in quality control or survey sampling contexts. In AML tuning, we apply it to the below-the-line population: the transactions that did NOT generate an alert. Our goal is to estimate how much suspicious activity we are missing — and to do so with a defined level of statistical confidence. The key challenge is that we do not know the size of the 'defective' sub-population (genuinely suspicious accounts) within the BTL. We are estimating it from a sample. The hypergeometric distribution gives us the probability framework for that estimation.", font: "Arial", size: 20, color: "333333", italics: true })] }),
  ], "E8F0FF"),
  spacer(),

  h3("6.5.1 The Mathematics of Hypergeometric Sampling in AML"),
  body("Consider a BTL population of N accounts. We hypothesise that M of these accounts are genuinely suspicious (M is unknown). We draw a sample of n accounts from the BTL, without replacement, and review each one. We find k accounts that appear suspicious."),
  body("The hypergeometric distribution models the probability of finding exactly k suspicious accounts in a sample of n, given a population of N with M truly suspicious accounts:"),
  spacer(),

  calloutMixed("Hypergeometric Probability Formula", [
    new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "P(X = k) = C(M, k) * C(N-M, n-k) / C(N, n)", font: "Courier New", size: 20, bold: true, color: DARK_NAVY })] }),
    new Paragraph({ spacing: { after: 40 }, children: [smallRun("Where: N = BTL population size; M = unknown number of truly suspicious accounts in BTL; n = sample size; k = observed suspicious accounts in sample; C(a,b) = binomial coefficient ('a choose b').")] }),
    new Paragraph({ spacing: { after: 0 }, children: [smallRun("In practice, we use this distribution to construct a confidence interval around our estimate of M/N (the true BTL SAR rate). We observe k/n in the sample and use the hypergeometric distribution to determine the range of M values that would have produced our observed sample with a given probability.")] }),
  ], "F0F4FF"),
  spacer(),

  h3("6.5.2 Designing a Sampling Exercise"),
  body("Before conducting a BTL sampling exercise, the institution must define:"),
  bulletMixed([smallBold("Sample scope: "), smallRun("Which scenario's BTL population is being sampled? For a rolling cash deposit rule at a given threshold, the BTL population is all accounts that had cash transaction activity in the review period but did not trigger an alert.")]),
  bulletMixed([smallBold("Sample size: "), smallRun("The minimum sample size required to achieve a given confidence level and precision. This is calculated using the hypergeometric (or, for large populations, binomial) approximation. For a population of N=2,000 BTL accounts, to achieve 95% confidence that the true SAR rate is within +/- 2%, a sample of approximately 238 accounts is required (using the conservative assumption of 50% base rate for maximum variance).")]),
  bulletMixed([smallBold("Selection methodology: "), smallRun("Random selection, using a documented random number generator. The selection must be truly random — not convenience-based — to ensure the sample is representative of the full BTL population.")]),
  bulletMixed([smallBold("Review criteria: "), smallRun("Each sampled account is reviewed by a qualified analyst using the same criteria as a standard L2 investigation. The review outcome is recorded as: no suspicion, possible suspicion, or confirmed suspicion (SAR-worthy). The institution must define in advance what constitutes a SAR-worthy finding in this context.")]),
  spacer(),

  h3("6.5.3 Sample Size Calculation"),
  body("For large BTL populations, the required sample size can be approximated using the formula for estimating a proportion with a given margin of error and confidence level:"),
  spacer(),

  calloutMixed("Sample Size Formula (Binomial Approximation for Large Populations)", [
    new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "n = (Z^2 * p * (1-p)) / E^2", font: "Courier New", size: 20, bold: true, color: DARK_NAVY })] }),
    new Paragraph({ spacing: { after: 40 }, children: [smallRun("Where: Z = z-score for desired confidence level (1.96 for 95%); p = estimated population proportion (use 0.5 for maximum conservatism if unknown); E = acceptable margin of error (e.g. 0.02 for +/- 2%).")] }),
    new Paragraph({ spacing: { after: 0 }, children: [smallRun("Example: 95% confidence, +/- 2% margin, p = 0.5: n = (1.96^2 * 0.5 * 0.5) / 0.02^2 = 3.8416 * 0.25 / 0.0004 = 2401. For finite populations, apply the finite population correction: n_adj = n / (1 + (n-1)/N). For N = 2000: n_adj = 2401 / (1 + 2400/2000) = 2401 / 2.2 = 1091.")] }),
  ], "F0F4FF"),
  spacer(),

  body("Using p=0.5 produces the most conservative — and largest — sample size. At 45 minutes per review, the FPC-adjusted sample of 1,091 accounts requires approximately 818 analyst hours — roughly 5 FTE-months. This is operationally significant. In practice, institutions with prior tuning data may use a lower p value based on historical BTL SAR rates (for example, p=0.02 if prior exercises have consistently found a 2% BTL SAR rate), substantially reducing the required sample. However, the institution must be prepared to justify its choice of p to an examiner — particularly if the lower p produces a materially smaller sample that turns out to have underestimated the true BTL SAR rate."),
  h3("6.5.4 Interpreting the Results"),
  body("After reviewing the sample, the institution calculates the observed SAR rate (k/n). It then constructs a 95% confidence interval around this estimate. If the confidence interval falls within the institution's acceptable BTL SAR rate — typically defined in the TM policy as a threshold below which the risk of missing suspicious activity is considered manageable — then the threshold is defensible."),
  body("What constitutes an acceptable BTL SAR rate? There is no universal regulatory standard. The institution must make a documented judgement — based on the BTL sampling results, the responsiveness curve, and the risk profile of the BTL population — that the estimated BTL SAR rate is proportionate to the coverage risk the institution is prepared to accept. A BTL SAR rate above 1-2% is typically considered an indicator that the threshold should be lowered. The institution must also consider the absolute number of suspicious accounts potentially missed — a 0.5% SAR rate in a BTL of 50,000 accounts implies 250 suspicious accounts going unreviewed."),
  spacer(),

  h2("6.6 Rule Responsiveness Analysis"),
  calloutMixed("Step 0: Validate Critical Data Elements Before Tuning", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Before running any responsiveness analysis, confirm that the data the rule depends on is present, accurate, and complete. For NRB-STRUCT-001, the Critical Data Elements (CDEs) are: transaction type (cash vs. non-cash), transaction amount, transaction date, account identifier, customer CRR score, and account type. If any CDE is failing — missing from the feed, stale, or mapped incorrectly — the responsiveness results are unreliable. A rule run on corrupted data produces a corrupted alert count.", font: "Arial", size: 20, color: "333333", italics: true })] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "CDE validation follows the four-step DQ framework introduced in Chapter 3: (1) Lineage — confirm each CDE originates from the correct source system and is mapped accurately into the TMS feed; (2) Reconciliation — verify that the volume and values of records received match the source system for the analysis period; (3) CDE Testing — check each CDE for completeness (% populated), accuracy (spot-check against source), and timeliness (feed latency vs. monitoring window); (4) Feedback Loop — route any data quality findings to the source system owners for remediation, and document the finding in the tuning rationale.", font: "Arial", size: 20, color: "333333", italics: true })] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "If material CDE failures are found — for example, if the cash transaction feed excludes ATM deposits, or if 20% of CRR scores are stale — the tuning exercise should be paused until remediation is confirmed. Tuning on bad data produces a defensible-looking document and an indefensible threshold.", font: "Arial", size: 20, color: "333333", italics: true })] }),
  ], "FFF3E6"),
  spacer(),
  body("A responsiveness analysis examines how sensitive the alert volume is to changes in threshold. The goal is to understand the shape of the alert curve: does a small change in threshold produce a large change in alert volume, or a small one? This is operationally important because it determines how much 'room' the institution has to tune the threshold in either direction."),
  h3("6.6.1 Conducting a Responsiveness Analysis"),
  body("To conduct a responsiveness analysis for the Northgate structuring scenario, we run the scenario at multiple threshold values and record the alert count at each. We plot the results as a responsiveness curve — alert count on the y-axis, threshold on the x-axis."),
  body("For the Northgate dataset, running the structuring rule at three threshold values gives the following illustrative results:"),
  spacer(),

  regTable(
    ["Threshold (USD)", "Alert Count", "Est. SAR Rate", "SAR Count", "Analyst Hours", "BTL Population"],
    [
      ["5,000", "142", "12%", "17", "107", "358"],
      ["7,500", "86", "12%", "10", "65", "414"],
      ["9,000", "51", "12%", "6", "38", "449"],
    ],
    [1400, 1300, 1300, 1300, 1300, 2426]
  ),
  spacer(),

  callout("Note — Constant SAR Rate Assumption",
    "For simplicity, this table holds the SAR rate constant at 12% across all three thresholds. In practice, the SAR rate typically increases as the threshold increases for many scenario types, because higher thresholds filter out more non-suspicious activity, concentrating genuine suspicion in the ATL population. For cash structuring rules specifically, this relationship may be reversed: sophisticated structuring deliberately clusters transactions near the detection threshold, so raising it can filter out the suspicious activity itself rather than the noise. A responsiveness analysis that shows a falling SAR rate as the threshold rises is a diagnostic signal — it may indicate a structuring population that is adapting to the threshold rather than a miscalibrated scenario. Empirical testing via the responsiveness analysis is essential before assuming the standard direction applies. A realistic responsiveness analysis for a general scenario might show SAR rates of 8% at USD 5,000, 12% at USD 7,500, and 18% at USD 9,000. The exercise code invites you to model this by varying SAR_RATE with threshold rather than holding it fixed. The analytical principles in this chapter apply regardless of which assumption you use.",
    "E8EEFF"),
  spacer(),
  body("The responsiveness curve for this scenario is relatively smooth: each USD 2,500 increase in threshold reduces alert volume by approximately 40%. This is a moderately sensitive scenario — the threshold has meaningful leverage over alert volume, but changes are not so sharp that small adjustments produce large swings in analyst workload."),
  body("A steep responsiveness curve — where a small threshold change produces a large change in alert volume — indicates that many accounts are clustered near the threshold. This can indicate poor segmentation (accounts with very different risk profiles are being evaluated against the same threshold) or a threshold that sits at a natural concentration point in the transaction distribution."),
  spacer(),

  h2("6.7 The Tuning Decision: Documenting and Defending Threshold Calibration"),
  body("A threshold calibration exercise is not complete until it is documented. The documentation must satisfy two audiences: the internal governance process (model risk management, audit, senior management) and the regulatory examiner."),
  body("The tuning rationale document should include:"),
  bulletMixed([smallBold("Objective: "), smallRun("What is the purpose of this calibration exercise? Is it the initial deployment of a new scenario, an annual review, or a response to a specific performance concern?")]),
  bulletMixed([smallBold("Data period: "), smallRun("Over what time period was the analysis conducted? The analysis period should be long enough to capture seasonal variation and at least one full monitoring cycle.")]),
  bulletMixed([smallBold("Responsiveness analysis: "), smallRun("Present the alert counts, SAR rates, and analyst hours at each threshold tested. Show the responsiveness curve.")]),
  bulletMixed([smallBold("BTL sampling results: "), smallRun("Present the sampling methodology, sample size, observed BTL SAR rate, and confidence interval. State explicitly whether the result is within the institution's acceptable BTL SAR rate.")]),
  bulletMixed([smallBold("Threshold decision: "), smallRun("State the chosen threshold and the rationale. If multiple thresholds were within acceptable parameters, explain why this one was selected. If a trade-off was made between coverage and capacity, document it explicitly.")]),
  bulletMixed([smallBold("Data quality findings: "), smallRun("Record the results of the CDE validation step (Step 0). If any data quality issues were identified during the exercise, state the finding, its impact on the tuning results, and the remediation action taken or planned. This closes the DQ feedback loop and ensures the governance record reflects the data conditions under which the threshold was set.")]),
  bulletMixed([smallBold("Approval: "), smallRun("Record who approved the tuning decision, at what level of governance, and on what date. This document is retained as part of the institution's model risk management records under SR 26-2 (US) / PRA SS1/23 (UK) and is subject to independent model validation.")]),
  bulletMixed([smallBold("Next review date: "), smallRun("State when the threshold will next be reviewed. Most institutions conduct annual tuning reviews as a minimum; more frequent reviews are appropriate when the customer population is changing rapidly.")]),
  spacer(),

  h2("6.8 L1/L2/L3 Investigation Levels"),
  body("We described L1, L2, and L3 review in full in Chapter 3. Here we focus on how tuning decisions affect the workload and risk profile at each level."),
  h3("6.8.1 Level 1 Review"),
  body("L1 triage is the first human checkpoint. Tuning that reduces alert volume at L1 frees capacity for more thorough review per alert. But it also concentrates risk: a higher threshold means the scenario is doing more of the filtering, and errors in the scenario design have greater consequence. An over-tuned scenario (threshold set too high) may produce an L1 queue that appears productive — most alerts escalate — but only because the obvious noisy alerts have been removed, not because the scenario is detecting more suspicious activity."),

  h3("6.8.2 Level 2 Review"),
  body("Tuning affects L2 through its effect on L1 escalation rates. If L1 analysts are overwhelmed and making hasty decisions, L2 receives cases that should have been closed at L1. If L1 dismissal rates are too high — because a precise, high-threshold scenario gives analysts over-confidence in dismissal — L2 receives a concentrated caseload but risks systematic under-escalation of borderline cases."),

  h3("6.8.3 Level 3 Review"),
  body("L3 covers specialist review: complex multi-jurisdiction cases, high-profile customers, and cases with supervisory notification obligations. Tuning does not directly affect L3 volume except through the escalation chain from L2."),
  callout("Note — L1/L2/L3 and the Three Lines of Defence",
    "The L1/L2/L3 levels are investigation tiers — not the Three Lines of Defence (3LoD). L1, L2, and L3 review sits within the 1.5th Line (Operations). The tuning rationale is reviewed and challenged by FinCrime Risk (2nd Line). Independent model review — validating the tuning methodology and results — is conducted by Internal Audit or Model Risk (3rd Line). Understanding this governance chain matters: when a tuning failure is identified, the question is not just 'which review tier missed it?' but 'which line of defence failed to catch it?'",
    "E8EEFF"),
  spacer(),

  calloutMixed("From School to Practice — Precision, Recall, and Tuning", [
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "Precision and recall from machine learning map directly onto the tuning concepts we have been discussing. Precision is the proportion of alerts (ATL accounts) that are genuinely suspicious — equivalently, the SAR rate in alerts. Recall is the proportion of all genuinely suspicious accounts that generate an alert — equivalently, the coverage of the truly suspicious population. The difference from standard ML is that in AML you cannot compute recall directly, because you do not know the true size of the suspicious population. You do not have a labelled test set. Hypergeometric sampling is one way to estimate recall — or more precisely, to estimate how much of the suspicious population you are missing. The precision-recall trade-off framework applies just as it does in ML: raising the threshold increases precision (fewer noisy alerts per alert) but reduces recall (more suspicious accounts fall below the line). The AML practitioner must navigate this trade-off with a regulatory constraint: recall cannot fall below the level at which the institution is deemed to have a material surveillance gap.", font: "Arial", size: 20, color: "333333", italics: true })] }),
  ], "E8F0FF"),
  spacer(),

  h2("6.9 Applying Tuning to the Northgate Scenario"),
  body("We now apply the full tuning methodology to the Northgate structuring scenario, using the customer dataset from Chapter 5 and the scenario specification from Chapter 4."),
  body("The structuring rule (NRB-STRUCT-001) is run at three thresholds: USD 5,000, USD 7,500, and USD 9,000. For each threshold, we calculate alert volume, estimated SAR count (assuming a 12% SAR rate in alerts, consistent with the labelled dataset), analyst hours required (at 45 minutes per alert), and the BTL population size."),
  body("The results (shown in the table in Section 6.6) indicate the following:"),
  bulletMixed([smallBold("USD 5,000: "), smallRun("Generates 142 alerts and requires 107 analyst hours per review cycle. The SAR count is 17. The BTL population of 358 accounts should be sampled to estimate the BTL SAR rate.")]),
  bulletMixed([smallBold("USD 7,500: "), smallRun("Generates 86 alerts and requires 65 analyst hours. The SAR count is 10. A smaller BTL population of 414 accounts is not reviewed.")]),
  bulletMixed([smallBold("USD 9,000: "), smallRun("Generates 51 alerts and requires only 38 analyst hours. But the BTL population of 449 accounts is larger, and the risk of missing suspicious activity increases. The Northgate mule accounts, with a monthly cash-in of USD 8,200, would fall below this threshold and be completely missed.")]),
  spacer(),

  body("The threshold choice is therefore not simply a question of operational efficiency. At USD 9,000, the mule network falls below the line and is completely missed. At USD 7,500, the mule accounts — with avg_monthly_cash_in of USD 8,200 — are above the threshold and would generate alerts, but only narrowly: a small reduction in deposit activity or a single missed transaction could drop them below the line. At USD 5,000, they are clearly above the line — but so are many legitimate customers in the personal account cluster."),
  body("Segmentation addresses this by applying different thresholds to different clusters. In the K=3 clustering from Chapter 5, the Northgate customer population splits into three segments. An illustrative segmented tuning outcome would set thresholds as follows: Cluster 0 (standard retail, avg_monthly_cash_in ~USD 400): threshold USD 3,500; Cluster 1 (medium-volume elevated-risk, where mule accounts sit, avg_monthly_cash_in ~USD 8,200): threshold USD 6,500; Cluster 2 (cash-intensive business, avg_monthly_cash_in ~USD 20,000+): threshold USD 15,000. At USD 6,500 applied to Cluster 1, the mule accounts are clearly above the line. The cash-intensive business cluster is not over-alerted because it operates under a higher threshold appropriate to its legitimate volumes. Exercise 6.1 Part A asks you to derive these segment-specific thresholds from the responsiveness and sampling data."),
  spacer(),

  calloutMixed("Tuning Protocol Summary", [
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Purpose: "), smallRun("Calibrate scenario threshold(s) to achieve appropriate balance between ATL coverage and BTL risk, with full governance documentation.")] }),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Prerequisites: "), smallRun("Active scenario with defined CDE list; historical transaction data covering at least one full monitoring cycle; defined BTL SAR rate tolerance (from TM policy); analyst capacity for BTL sampling review.")] }),
    new Paragraph({ spacing: { after: 40 }, children: [smallBold("Step-by-Step Protocol:")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [smallBold("Step 0 — Validate CDEs: "), smallRun("Confirm all Critical Data Elements are complete, accurate, and timely before running any analysis. Document any failures.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [smallBold("Step 1 — Responsiveness Analysis: "), smallRun("Run the scenario at multiple threshold values. Record alert count, estimated SAR count, analyst hours, and BTL population size at each.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [smallBold("Step 2 — BTL Sampling: "), smallRun("For each candidate threshold, calculate the required sample size and conduct a structured BTL review. Record observed SAR rate and 95% CI.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [smallBold("Step 3 — Threshold Decision: "), smallRun("Select threshold based on responsiveness curve, BTL sampling results, and institutional risk tolerance. Document the rationale for the choice.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [smallBold("Step 4 — Documentation: "), smallRun("Produce tuning rationale document covering all eight elements (Section 6.7), including DQ findings.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallBold("Step 5 — Governance Approval: "), smallRun("Submit to 2nd Line (FinCrime Risk) for review. Retain in model governance register. Schedule independent validation by 3rd Line. Set next review date.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [smallBold("Common Pitfalls: "), smallRun("Tuning on unvalidated data; skipping BTL sampling; setting threshold to hit a volume target rather than a risk level; tuning the full population without segment-specific analyses; failing to document DQ issues that affected the analysis.")] }),
  ], "E8EEFF"),
  spacer(),

  h2("6.10 Colab Walkthrough: Introducing Rule 2 — Velocity"),
  body("Tuning Rule 1 reveals a limitation: the cash-deposit structuring rule monitors aggregate value but not transaction frequency. An account making 25 rapid transfers over 3 days — each below the threshold individually — may not trigger Rule 1 at all. Velocity is the second risk dimension. Rule 2 monitors the number of transactions within a short rolling window and complements Rule 1's value-based approach."),
  body("The code below implements Rule 2 (NRB-VELOC-001). It extends the existing apply_rule_1() function and is built into the same codebase you have been using since Chapter 4."),
  codeBox("📊 Colab Preview: Rule 2 — Transaction Velocity", [
    "import pandas as pd",
    "",
    "def apply_rule_2(df_txn, max_txns=10, window_days=7):",
    "    \"\"\"Rule NRB-VELOC-001: >max_txns transactions in window_days.\"\"\"",
    "    df = df_txn.copy().sort_values(['account_id', 'txn_date'])",
    "    df['rolling_cnt'] = (",
    "        df.groupby('account_id', group_keys=False)",
    "          .apply(lambda g: g.set_index('txn_date')['txn_id']",
    "                            .rolling(f'{window_days}D').count()",
    "                            .reset_index(drop=True))",
    "    )",
    "    alerts = (",
    "        df[df['rolling_cnt'] > max_txns]",
    "          .groupby('account_id')",
    "          .agg(peak_7d_count=('rolling_cnt', 'max'))",
    "          .reset_index()",
    "    )",
    "    return alerts",
    "",
    "df_txn  = pd.read_csv('nb_transactions.csv', parse_dates=['txn_date'])",
    "rule2_alerts = apply_rule_2(df_txn)",
    "print(f'Rule 2 generated {len(rule2_alerts)} alerts')",
    "",
    "# Which accounts trigger BOTH rules? — the highest-priority alerts",
    "rule1_alerts = apply_rule_1(df_txn)  # from Chapter 4",
    "both = rule1_alerts.merge(rule2_alerts, on='account_id', how='inner')",
    "print(f'Accounts triggering both Rule 1 and Rule 2: {len(both)}')",
  ]),
  outputBox("▶ Real Output — Rule 2 Alerts and Cross-Rule Overlap", [
    "Rule 1 alerts: 47",
    "Rule 2 alerts: 357",
    "",
    "Rule 2 — top 5 by peak transaction count:",
    "account_id  peak_txn_count  peak_window_end  short_gap_count",
    "   ACC0235              12       2023-10-02               24",
    "   ACC0284              11       2023-12-12               39",
    "   ACC0246              11       2023-08-01               39",
    "   ACC0380              11       2023-04-03               37",
    "   ACC0313              11       2023-06-09               28",
    "",
    "Accounts triggering BOTH Rule 1 and Rule 2: 46",
    "  Includes: ACC0001, ACC0002, ACC0003, ACC0004, ACC0005, ACC0006 ...",
  ]),
  imageBlock('/sessions/intelligent-blissful-clarke/mnt/aml-book1/ch6_rule2_overlap.png', 400, 233),
  body("Rule 2 generates 357 alerts — a broader net than Rule 1's 47, because velocity is a common feature of high-frequency retail banking, not just structuring. The critical insight is in the overlap: 46 accounts trigger both rules, including all six mule accounts (ACC0001–ACC0006). These double-triggered accounts are the highest-priority alerts in the queue. Exercise 6.1 Part C asks you to tune Rule 2's parameters to reduce false positives without losing the mule accounts from the overlap group."),
  spacer(),

  h2("6.11 Risk Considerations"),
  calloutMixed("Risk Considerations", [
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Over-tuning (gaming the metric): "), smallRun("Institutions under pressure to reduce alert volumes may tune thresholds to achieve a target volume rather than a target risk level. This is metric gaming. If thresholds are raised until the alert queue is 'manageable', the institution may be systematically missing suspicious activity. Tuning should always be anchored to risk evidence — responsiveness analysis and BTL sampling — not to operational convenience.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Under-tuning (regulatory risk): "), smallRun("Institutions that do not tune their scenarios at all — that deploy a scenario with initial parameters and never review them — accumulate drift between the monitoring threshold and the actual risk presented by the customer population. As the customer population changes, the threshold becomes progressively less appropriate. Regular tuning cycles — at minimum annual — are a regulatory expectation.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Documentation requirements: "), smallRun("The tuning decision must be documented to a standard that would survive regulatory examination. The documentation should be contemporaneous — produced at the time of the decision, not reconstructed after the fact. It should be retained in accordance with the institution's record-keeping obligations (typically five years in the UK) and be retrievable on demand.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [smallBold("Segmented tuning: "), smallRun("When segmentation is applied (as in Chapter 5), each segment must be tuned separately. A single threshold applied to a segmented population defeats the purpose of segmentation. The tuning rationale must address each segment individually, including separate BTL sampling exercises for each segment where the BTL population is material.")] }),
  ], "FFF3E6"),
  spacer(),

  takeawayBox([
    "Threshold setting is a policy decision with measurable regulatory consequences. Both over-alerting and under-alerting create risk: the former destroys analyst capacity; the latter creates surveillance gaps.",
    "The ATL/BTL framework divides the customer population at the alert threshold. ATL is reviewed; BTL is not — unless a sampling exercise is conducted.",
    "Hypergeometric sampling is the primary tool for estimating the BTL SAR rate. It gives the institution a statistically grounded estimate of how much suspicious activity it is missing.",
    "The sample size formula (Z^2 * p * (1-p) / E^2) gives the minimum sample required for a given confidence level and margin of error. For finite populations, apply the finite population correction.",
    "A responsiveness analysis shows how alert volume changes as the threshold changes. A steep responsiveness curve indicates that many accounts cluster near the threshold.",
    "The tuning rationale document must cover: objective, data period, responsiveness analysis, BTL sampling results, threshold decision, approval, and next review date.",
    "Precision maps to the SAR rate in alerts (ATL). Recall maps to coverage of the truly suspicious population. In AML, recall cannot be computed directly — it must be estimated via BTL sampling.",
    "At USD 9,000, the Northgate mule accounts (monthly cash-in USD 8,200) fall below the threshold and are missed. Segmented thresholds allow the personal account cluster to be monitored at a lower threshold without generating excess alerts for the cash-intensive business cluster.",
    "Tuning should be anchored to risk evidence, not operational targets. Tuning to a volume metric is regulatory risk, not risk management.",
    "An institution conducting its first structured BTL sampling exercise is transitioning from Basic to Established maturity. At the Advanced stage, tuning is a documented annual cycle with stable methodology, segment-specific analyses, and independent validation results on file.",
  ]),
  spacer(),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Exercise 6.1 — Calibrating the Northgate Structuring Scenario  [Advanced]", font: "Arial", size: 22, bold: true, color: "2E75B6" })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Recap: "), smallRun("In Exercise 5.1 you segmented the Northgate customer population. Now you calibrate the monitoring threshold for each segment.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Colab Extension: "), smallRun("Section 6.10 introduced two functions — apply_rule_1() and apply_rule_2(). Both are pre-loaded in the Chapter 6 Colab notebook. Parts A and B work with Rule 1 tuning. Part C (new) asks you to tune Rule 2's parameters using the same responsiveness methodology. The Extended Exercise in Part D invites you to design a third rule of your own.")] }),
    spacer(),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Part A — Responsiveness Analysis (Rule 1)  [Advanced]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("Using the dataset from Exercise 5.1 and the structuring rule from Exercise 4.1, run the rule at thresholds of USD 6,000, USD 7,500, and USD 9,000 (sum of cash deposits in a 30-day rolling window). For each threshold and each cluster segment from Chapter 5, report:")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("Number of alerts generated.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("Estimated SAR count (assume 12% of alerts in the dataset are SAR-worthy, based on the is_sar_worthy column).") ] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("Analyst hours required (assume 45 minutes per alert review).")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 }, children: [smallRun("The BTL population size for each segment at each threshold.")] }),
    spacer(),
  ]),

  exerciseBox([
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Part B — Hypergeometric Sampling Design  [Advanced]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("For the USD 9,000 threshold applied to the personal account cluster (the cluster containing the mule network), design a hypergeometric sampling exercise for the BTL population.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("Calculate the minimum sample size required to achieve 95% confidence that the true BTL SAR rate is within +/- 2%. Show your calculation using the binomial approximation formula with finite population correction.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("Describe the review criteria that would be applied to each sampled account. What would constitute a SAR-worthy finding in this context?")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 }, children: [smallRun("If the sampling exercise finds that 4 of the sampled accounts appear SAR-worthy, calculate the estimated BTL SAR rate and its 95% confidence interval. Is this within an acceptable range? Justify your answer.")] }),
    spacer(),
  ]),

  exerciseBox([
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Part C — Threshold Recommendation and Tuning Rationale  [Advanced]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("Based on your analysis in Parts A and B:")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("Which threshold would you recommend for the personal account cluster, and why? Your recommendation must be supported by the responsiveness analysis and the BTL sampling results.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 }, children: [smallRun("Write a one-page tuning rationale in the format described in Section 6.7. The rationale should be written as if it will be presented to the model risk management committee for approval and retained for regulatory examination.")] }),
    spacer(),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Python code:"), smallRun(" (save as tune_northgate.py)")] }),
    codeBlock([
      "import numpy as np, pandas as pd",
      "from scipy.stats import hypergeom",
      "",
      "# Load dataset from Exercise 5.1",
      "# df = pd.read_csv('northgate_customers.csv')",
      "# For self-contained use, regenerate inline:",
      "np.random.seed(42); n_total = 500",
      "cash_in = np.concatenate([np.random.lognormal(6.0,0.5,350),",
      "    np.random.lognormal(8.2,0.4,100), np.random.lognormal(9.0,0.3,50)])",
      "txn_cnt = np.maximum(np.concatenate([np.random.poisson(2.1,350),",
      "    np.random.poisson(8.5,100), np.random.poisson(4.3,50)]),1).astype(float)",
      "age = np.concatenate([np.random.randint(12,120,350),",
      "    np.random.randint(6,60,100), np.random.randint(3,18,50)])",
      "is_sar = np.concatenate([np.zeros(450), np.ones(50)]).astype(int)",
      "df = pd.DataFrame({'avg_monthly_cash_in': cash_in,",
      "    'avg_transaction_count': txn_cnt,",
      "    'account_age_months': age, 'is_sar_worthy': is_sar})",
      "",
      "SAR_RATE = 0.12",
      "MIN_TXN  = 3",
      "WINDOW   = 30  # days (simulated as monthly here)",
      "",
      "print('=== Responsiveness Analysis ===')",
      "results = []",
      "for thresh in [6000, 7500, 9000]:",
      "    # Apply rule: cash_in > thresh AND txn_count >= MIN_TXN",
      "    atl = df[(df['avg_monthly_cash_in'] > thresh) &",
      "             (df['avg_transaction_count'] >= MIN_TXN)]",
      "    btl = df[~((df['avg_monthly_cash_in'] > thresh) &",
      "               (df['avg_transaction_count'] >= MIN_TXN))]",
      "    n_alerts = len(atl)",
      "    est_sar  = round(n_alerts * SAR_RATE)",
      "    hrs      = round(n_alerts * 0.75, 1)  # 45 min = 0.75 hr",
      "    n_btl    = len(btl)",
      "    results.append([thresh, n_alerts, f'{SAR_RATE*100:.0f}%', est_sar, hrs, n_btl])",
      "    print(f'Threshold USD {thresh:,}: Alerts={n_alerts}, SARs~{est_sar},",
      "          Hrs={hrs}, BTL={n_btl}')",
      "",
      "print()",
      "print('=== BTL Sampling Calculation (USD 9,000 threshold) ===')",
      "Z, p, E = 1.96, 0.5, 0.02",
      "n_inf = (Z**2 * p * (1-p)) / E**2",
      "N_btl = results[2][5]  # BTL at USD 9,000",
      "n_adj = n_inf / (1 + (n_inf - 1) / N_btl)",
      "n_sample = int(np.ceil(n_adj))",
      "print(f'BTL population N = {N_btl}')",
      "print(f'Unadjusted sample size: {n_inf:.0f}')",
      "print(f'FPC-adjusted sample size: {n_sample}')",
      "",
      "# Observed: 4 SAR-worthy in sample",
      "k_obs = 4",
      "obs_rate = k_obs / n_sample",
      "# Simplified CI — for production, use exact methods (e.g., Clopper-Pearson)",
      "lower = hypergeom.ppf(0.025, N_btl, round(obs_rate*N_btl), n_sample) / n_sample",
      "upper = hypergeom.ppf(0.975, N_btl, round(obs_rate*N_btl), n_sample) / n_sample",
      "print(f'Observed BTL SAR rate: {obs_rate*100:.2f}%')",
      "print(f'95% CI: [{lower*100:.2f}%, {upper*100:.2f}%]')",
    ]),
    spacer(),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("R code:"), smallRun(" (save as tune_northgate.R)")] }),
    codeBlock([
      "set.seed(42)",
      "n_total <- 500",
      "cash_in <- c(rlnorm(350,6.0,0.5), rlnorm(100,8.2,0.4), rlnorm(50,9.0,0.3))",
      "txn_cnt <- pmax(c(rpois(350,2.1), rpois(100,8.5), rpois(50,4.3)), 1)",
      "age <- c(sample(12:120,350,T), sample(6:60,100,T), sample(3:18,50,T))",
      "is_sar <- c(rep(0,450), rep(1,50))",
      "df <- data.frame(avg_monthly_cash_in=cash_in,",
      "    avg_transaction_count=txn_cnt,",
      "    account_age_months=age, is_sar_worthy=is_sar)",
      "",
      "SAR_RATE <- 0.12; MIN_TXN <- 3",
      "",
      "cat('=== Responsiveness Analysis ===\\n')",
      "results <- data.frame()",
      "for (thresh in c(6000, 7500, 9000)) {",
      "  atl <- df[df$avg_monthly_cash_in > thresh &",
      "             df$avg_transaction_count >= MIN_TXN, ]",
      "  btl <- df[!(df$avg_monthly_cash_in > thresh &",
      "               df$avg_transaction_count >= MIN_TXN), ]",
      "  n_alerts <- nrow(atl)",
      "  est_sar  <- round(n_alerts * SAR_RATE)",
      "  hrs      <- round(n_alerts * 0.75, 1)",
      "  n_btl    <- nrow(btl)",
      "  cat(sprintf('Threshold USD %d: Alerts=%d, SARs~%d, Hrs=%.1f, BTL=%d\\n',",
      "              thresh, n_alerts, est_sar, hrs, n_btl))",
      "  results <- rbind(results,",
      "    data.frame(threshold=thresh, alerts=n_alerts,",
      "               est_sars=est_sar, hours=hrs, btl=n_btl))",
      "}",
      "",
      "cat('\\n=== BTL Sampling (USD 9,000) ===\\n')",
      "Z <- 1.96; p <- 0.5; E <- 0.02",
      "n_inf <- (Z^2 * p * (1-p)) / E^2",
      "N_btl <- results$btl[results$threshold==9000]",
      "n_adj <- n_inf / (1 + (n_inf - 1) / N_btl)",
      "n_sample <- ceiling(n_adj)",
      "cat(sprintf('BTL population N = %d\\n', N_btl))",
      "cat(sprintf('Unadjusted n: %.0f\\n', n_inf))",
      "cat(sprintf('FPC-adjusted n: %d\\n', n_sample))",
      "",
      "k_obs <- 4",
      "obs_rate <- k_obs / n_sample",
      "ci_lo <- qhyper(0.025, round(obs_rate*N_btl), N_btl-round(obs_rate*N_btl),",
      "                n_sample) / n_sample",
      "ci_hi <- qhyper(0.975, round(obs_rate*N_btl), N_btl-round(obs_rate*N_btl),",
      "                n_sample) / n_sample",
      "cat(sprintf('Observed BTL SAR rate: %.2f%%\\n', obs_rate*100))",
      "cat(sprintf('95%% CI: [%.2f%%, %.2f%%]\\n', ci_lo*100, ci_hi*100))",
    ]),
    spacer(),
    new Paragraph({ spacing: { after: 80 }, children: [smallItalic("This exercise brings together scenario design (Chapter 4), segmentation (Chapter 5), and calibration (Chapter 6) into a single integrated analysis. The tuning rationale you produce in Part C represents the kind of documentation that a regulator or internal audit function would expect to see in a model governance file.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallItalic("In Chapter 7, we assess the coverage of the full scenario ruleset — not just the structuring rule — by mapping it against published typologies and red flags, and identifying the financial crime risks that the current programme does not detect.")] }),
  ]),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Part B — Meridian Trading Ltd: Calibrating the TBML Threshold  [Applied / Out-of-the-Box]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("We continue with Meridian Trading Ltd and the TBML-INVOICE-001 rule you designed in Chapter 4's Part B. The rule fires when Meridian's invoice-to-market-price ratio exceeds a parameter (RATIO_THRESHOLD) for a commodity type. Project Sentinel's data scientist needs to calibrate RATIO_THRESHOLD. She has 14 months of Meridian's invoice data and a commodity price benchmark feed (average import prices by HS code from HMRC trade statistics).")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 60 }, children: [smallRun("Meridian has issued 89 invoices over 14 months. Of these, 23 have a commodity code of HS 8414 (compressors). Market benchmark prices for HS 8414 range from USD 2,200 to USD 4,800 per unit (HMRC trade statistics, 2023). Meridian's invoices for HS 8414 average USD 8,950 per unit — 186% of the benchmark midpoint. Propose a RATIO_THRESHOLD for TBML-INVOICE-001 and justify it. What is the estimated noisy alert rate at your proposed threshold if 15% of UK HS 8414 importers legitimately operate above the benchmark midpoint by more than 50%?")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 60 }, children: [smallRun("The data scientist wants to perform a below-the-line sampling exercise for TBML-INVOICE-001 — but the population of commercial accounts with invoice data is only 47 accounts. Apply the hypergeometric sampling methodology from Part A to this small population. At what minimum sample size would the results be statistically meaningful? Is it feasible to sample at this level, and if not, what is the alternative approach for estimating below-the-line risk?")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 80 }, children: [smallRun("LINK-CROSS-001 (from Chapter 4 Part C) can only fire if both NRB-STRUCT-001 and TBML-INVOICE-001 have already fired on the relevant accounts. Explain how the calibration of each component rule affects the probability that LINK-CROSS-001 will fire on a genuine Northgate/Meridian connection. If RATIO_THRESHOLD is set too conservatively (too high), what is the consequence for the network detection capability?")] }),
  ]),

  exerciseBox([
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Part C — Project Sentinel: The Calibration Governance Record  [Synthesis / Stretch]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("Every threshold calibration decision in Project Sentinel must be documented in a Calibration Governance Record — a formal model governance artefact that records the analytical basis, the decision made, the assumptions relied upon, and the monitoring commitment going forward. This Part requires you to produce two governance documents.")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 60 }, children: [smallRun("Draft a Calibration Governance Record (approximately 300 words) for the RATIO_THRESHOLD parameter in TBML-INVOICE-001. Your record must cover: (a) the purpose of the parameter and the rule it governs, (b) the analytical approach used to derive the threshold value (reference your Part B answer), (c) the key assumptions (including the source and known limitations of the HMRC benchmark), (d) the approved threshold value and the name and role of the approver, and (e) the conditions that would trigger a threshold review (for example, a change in commodity market prices of more than 20%).")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 80 }, children: [smallRun("Design a post-deployment monitoring plan for TBML-INVOICE-001. Specify four metrics that the model owner should track monthly. For each metric, state: what it measures, the formula or data source, and the threshold that would trigger a formal model review. At least one metric must address LINK-CROSS-001 interaction (i.e., the downstream effect of TBML-INVOICE-001's calibration on the cross-case link rule).")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallItalic("In Chapter 7, you will map the full Northgate and Meridian scenario set against published typologies to assess whether the programme has material gaps. In Chapter 9, you will validate TBML-INVOICE-001 formally under the five-pillar framework.")] }),
  ]),
  spacer(),

  h2("Further Reading and Research Topics"),
  numbered("The OCC's 'Model Risk Management' guidance (OCC Bulletin 2011-12) remains the definitive US reference on threshold calibration as a modelling decision requiring governance documentation. Read Section 3 ('Model Development and Implementation') and identify the four elements that must be documented for any model assumption — and check your Calibration Governance Record against them."),
  numbered("Stattman, A. (2007), 'Statistical Methods for AML Threshold Calibration', Journal of Financial Crime, 14(4). This paper presents a worked example of hypergeometric sampling applied to a structuring scenario at a European retail bank. Compare the author's sampling approach to the method in Section 6.4. What assumption does the author make that Section 6.4 explicitly relaxes?"),
  numbered("Research Question: The FCA's Dear CEO Letter on Transaction Monitoring (2021) states that firms must be able to demonstrate that thresholds are 'calibrated to the firm's specific risk profile.' Download and read the letter. What evidence does FCA say it will request when reviewing a firm's threshold calibration decisions?"),
  numbered("Design challenge: PRA SS1/23 on model risk management requires that model governance includes a 'model change policy.' Draft a one-page model change policy for NRB-STRUCT-001 that specifies: what constitutes a material change (requiring full re-validation), what constitutes a minor change (requiring only model owner approval), and the maximum time between periodic recalibration reviews."),
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
    headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } }, children: [new TextRun({ text: "Applied AML Analytics  |  Chapter 6", font: "Arial", size: 18, color: MID_BLUE })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: "Arial", size: 18, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "888888" })] })] }) },
    children
  }]
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/Book1_Chapter6.docx', buf); console.log('Done: Book1_Chapter6.docx'); });

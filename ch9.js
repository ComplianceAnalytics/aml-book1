const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat
} = require('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/node_modules/docx');
const fs = require('fs');

const DARK_NAVY="1A1A2E",MID_BLUE="2C3E6B",LIGHT_GREY="F0F2F8",ACCENT_BLUE="4472C4",WHITE="FFFFFF";
const cb=(c="CCCCCC")=>({top:{style:BorderStyle.SINGLE,size:1,color:c},bottom:{style:BorderStyle.SINGLE,size:1,color:c},left:{style:BorderStyle.SINGLE,size:1,color:c},right:{style:BorderStyle.SINGLE,size:1,color:c}});
const s=(t,o={})=>new TextRun({text:t,font:"Arial",size:20,color:"222222",...o});
const sb=(t)=>s(t,{bold:true});
const si=(t)=>s(t,{italics:true});
const r=(t)=>new TextRun({text:t,font:"Arial",size:22,color:"222222"});

const numCfg=[
  {reference:"bullets",levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
  {reference:"numbers",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
  {reference:"numbers2",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
];

const body=(t)=>new Paragraph({spacing:{after:160},children:[r(t)]});
const bullet=(t)=>new Paragraph({numbering:{reference:"bullets",level:0},spacing:{after:100},children:[s(t)]});
const bulletMixed=(runs)=>new Paragraph({numbering:{reference:"bullets",level:0},spacing:{after:100},children:runs});
const num=(t,ref="numbers")=>new Paragraph({numbering:{reference:ref,level:0},spacing:{after:100},children:[s(t)]});
const spacer=()=>new Paragraph({spacing:{after:200},children:[r("")]});
const pb=()=>new Paragraph({children:[new PageBreak()]});
const h1=(t)=>new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:360,after:200},children:[new TextRun({text:t,font:"Arial",size:36,bold:true,color:DARK_NAVY})]});
const h2=(t)=>new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:280,after:160},children:[new TextRun({text:t,font:"Arial",size:28,bold:true,color:MID_BLUE})]});
const h3=(t)=>new Paragraph({heading:HeadingLevel.HEADING_3,spacing:{before:200,after:120},children:[new TextRun({text:t,font:"Arial",size:24,bold:true,color:MID_BLUE})]});

const box=(children,fill,border)=>new Table({width:{size:9026,type:WidthType.DXA},columnWidths:[9026],rows:[new TableRow({children:[new TableCell({borders:cb(border),width:{size:9026,type:WidthType.DXA},shading:{fill,type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:180,right:180},children})]})]});
const callout=(label,text,fill="E8EEFF")=>box([new Paragraph({spacing:{after:80},children:[s(label,{bold:true,color:MID_BLUE})]}),new Paragraph({spacing:{after:0},children:[si(text)]})],fill,ACCENT_BLUE);
const calloutM=(label,paras,fill="E8EEFF")=>box([new Paragraph({spacing:{after:80},children:[s(label,{bold:true,color:MID_BLUE})]}),...paras],fill,ACCENT_BLUE);
const exBox=(ch)=>box(ch,"EBF3FC","2E75B6");
const tkBox=(items)=>box([new Paragraph({spacing:{after:80},children:[new TextRun({text:"Key Takeaways",font:"Arial",size:22,bold:true,color:"1A7A4A"})]}), ...items.map(t=>new Paragraph({numbering:{reference:"bullets",level:0},spacing:{after:80},children:[s(t)]}))], "E6F9F0","1A7A4A");

const tbl=(headers,rows,widths)=>{
  const hR=new TableRow({children:headers.map((h,i)=>new TableCell({borders:cb("999999"),width:{size:widths[i],type:WidthType.DXA},shading:{fill:DARK_NAVY,type:ShadingType.CLEAR},margins:{top:80,bottom:80,left:120,right:120},children:[new Paragraph({children:[s(h,{bold:true,color:WHITE})]})]}))} );
  const dR=rows.map((row,ri)=>new TableRow({children:row.map((cell,ci)=>new TableCell({borders:cb("CCCCCC"),width:{size:widths[ci],type:WidthType.DXA},shading:{fill:ri%2===0?"FFFFFF":LIGHT_GREY,type:ShadingType.CLEAR},margins:{top:80,bottom:80,left:120,right:120},children:[new Paragraph({children:[s(cell)]})]}))}));
  return new Table({width:{size:9026,type:WidthType.DXA},columnWidths:widths,rows:[hR,...dR]});
};

const children=[
  h1("Chapter 9: Model Validation Framework"),
  spacer(),
  calloutM("Learning Objectives — By the end of this chapter you will be able to:",[
    num("Apply each of the five pillars of model validation to an AML transaction monitoring model."),
    num("Interpret the requirements of SR 26-2 (US) and PRA SS1/23 (UK) in the context of TM analytics models."),
    num("Identify common model validation failures and describe their regulatory consequences."),
    num("Produce a structured validation summary for the Northgate structuring scenario model suite."),
  ]),
  spacer(),

  h2("9.1 Business Context: Validation Is a Regulatory Requirement"),
  body("Every AML transaction monitoring model — every scenario, every segmentation cluster, every ML triage algorithm — is subject to model risk management (MRM) requirements. This is not optional. The US Federal Reserve's SR 26-2 guidance and the UK Prudential Regulation Authority's SS1/23 standard both establish explicit expectations for how models must be developed, validated, and governed."),
  body("Model validation is the process of independently assessing whether a model is fit for its intended purpose. The key word is independently. A model cannot be validly validated by the team that built it. The validation must be conducted by a separate function — or at minimum, by individuals who were not involved in the model's design — and its findings must be documented, escalated, and acted upon."),
  body("Many AML teams underestimate the scope of what counts as a 'model' under these frameworks. If a system uses data, applies a methodology, and produces an output that informs a business decision, it is almost certainly a model. That includes the NRB-STRUCT-001 scenario, the K-Means segmentation from Chapter 5, and the Isolation Forest from Chapter 8. All three require validation."),
  body("The independence requirement maps directly onto the Three Lines of Defence framework. The 1.5th Line (Operations) develops and uses models — it owns the scenario, runs the calibration, applies the triage model. The 2nd Line (FinCrime Risk / Model Risk Management) validates them independently: it cannot have been involved in the model's design and must be empowered to issue findings that override the 1st/1.5th Line's preferences. The 3rd Line (Audit / Independent Model Review) provides periodic independent assurance over both the models and the validation process itself — assessing whether the 2nd Line's validation function is itself adequate. SR 26-2's independence requirement and PRA SS1/23's principle of appropriate challenge both operationalise through this structure."),

  h2("9.2 What Counts as a Model in AML TM?"),
  body("SR 26-2 defines a model as 'a quantitative method, system, or approach that applies statistical, economic, financial, or mathematical theories, techniques, and assumptions to process input data into quantitative estimates'. In AML, this captures:"),
  bullet("Scenario rules: the rule logic, threshold parameters, and lookback windows in NRB-STRUCT-001 are model components. The threshold is an assumption about the boundary between normal and suspicious behaviour."),
  bullet("Segmentation models: K-Means is explicitly a quantitative method. The cluster boundaries are model outputs. The assignment of a customer to a peer group is a model-driven decision."),
  bullet("ML triage models: Isolation Forest is a statistical algorithm. Its contamination parameter is an assumption. Its anomaly scores are quantitative estimates that drive analyst workflow."),
  bullet("Calibration models: the hypergeometric sampling exercise from Chapter 6 is a statistical methodology that produces a quantitative estimate (the BTL SAR rate) that informs the threshold decision."),
  spacer(),
  callout("Risk Perspective","'We do not use models — we just use rules' is not a defensible position with regulators. Rules encode assumptions about thresholds, lookback windows, and customer scope. Those assumptions constitute a model under SR 26-2. If your Transaction Monitoring Framework has not assessed its scenarios against the five pillars, it has unvalidated models in production.","FFF3E6"),
  spacer(),

  h2("9.3 MRM Regulatory Requirements by Jurisdiction"),
  spacer(),
  tbl(
    ["Jurisdiction","Regulation","Key Requirements for AML TM Models"],
    [
      ["United States","SR 26-2 (Federal Reserve / OCC, 2026)","Three-component framework: (1) Model development — documented methodology, assumptions, and limitations; (2) Model validation — independent assessment of conceptual soundness, data quality, and performance; (3) Model governance — inventory, approval, change management, ongoing monitoring."],
      ["United Kingdom","PRA SS1/23 (2023)","Model inventory requirement for all material models. Independent validation by a function separate from model development. Validation must assess: purpose and scope, methodology, data quality, performance, and documentation. Board-level accountability for model risk."],
      ["European Union","CRR / EBA Guidelines / forthcoming AMLA","Indirect applicability at present. EBA/GL/2020/14 (ICT and security risk management guidelines) applies governance and testing requirements to technology systems including model-driven monitoring tools. No dedicated AML model risk framework equivalent to SR 26-2 currently exists. However, the forthcoming Anti-Money Laundering Authority (AMLA), which assumes direct supervisory powers over high-risk obliged entities from 2025, is expected to issue model governance standards for TM systems — potentially creating an EU-equivalent framework. Institutions with EU presence should monitor AMLA's regulatory technical standards as they are published."],
      ["Singapore","MAS Notice 1070 / TRM Guidelines","Risk management principles require that technology systems used for AML monitoring are subject to governance and oversight. TRM Guidelines require testing, change management, and incident management for critical systems."],
    ],
    [1500,2000,5526]
  ),
  spacer(),

  h2("9.4 The Five Pillars of AML Model Validation"),
  body("The five-pillar framework presented here is our synthesis of the regulatory requirements across SR 26-2 (US), PRA SS1/23 (UK), and MAS TRM into a single operational framework for AML model validation. SR 26-2 uses a three-component structure (development, validation, governance); PRA SS1/23 uses its own principles. The five pillars map to both — and are designed to be actionable in a practitioner context where the regulatory documents are the authority but a working checklist is what gets used."),
  callout("Finding Severity Scale","Throughout the five pillars, validation findings are rated on a four-point severity scale. Critical: the model must be suspended from production pending remediation — the risk of continued use outweighs the operational cost of suspension. High: material remediation required within 30 days; continued use must be approved by a senior governance authority. Medium: remediation required within 90 days; ongoing monitoring enhanced in the interim. Low: remediation at the next scheduled review cycle; no immediate operational impact. This scale applies across all pillars and all model types.","E8EEFF"),
  spacer(),
  body("Each pillar addresses a distinct dimension of model risk."),

  h3("Pillar 1 — Model Governance"),
  body("Governance is the foundation on which all other validation work rests. Without a clear governance structure, even a technically excellent model cannot be adequately managed over time."),
  bullet("Model inventory: every model must be registered in a firm-wide model inventory. Entry includes: model name, owner, purpose, methodology, risk tier, validation status, and last validation date."),
  bullet("Ownership and accountability: each model must have a named owner responsible for its performance, documentation, and compliance with governance requirements."),
  bullet("Change management: any change to a model — threshold adjustment, parameter update, feature addition — must go through a documented approval process before deployment."),
  bullet("Approval workflow: models must be approved before deployment by an authority commensurate with their risk tier. A material AML model typically requires sign-off from the Chief Risk Officer or equivalent."),
  spacer(),

  h3("Pillar 2 — Model Framework"),
  body("The framework document is the model's technical specification. It must be sufficient for a competent reviewer — including an external examiner — to understand what the model does, why it was designed that way, and what its limitations are."),
  bullet("Purpose statement: what business problem does the model solve? What regulatory requirement does it address?"),
  bullet("Methodology: what algorithm, rule logic, or statistical approach is used? Why was this approach chosen over alternatives?"),
  bullet("Inputs and outputs: what data does the model consume? What does it produce? What decisions does its output inform?"),
  bullet("Assumptions and limitations: what assumptions underlie the methodology? Under what conditions would the model perform poorly or fail?"),
  spacer(),

  h3("Pillar 3 — Data Quality"),
  body("A model is only as good as its inputs. Data quality assessment is one of the most important and most frequently neglected parts of model validation in AML. Critical/Key Data Elements (CDE/KDE) are the specific data fields a model requires to function correctly — the transaction amount for a cash threshold rule, the CRR score for a risk-based segmentation, the account age for a triage model. Critical/Key Data Elements (CDE/KDE) (KDEs) are the subset of CDEs that are most material to the model's output: if a CDE/KDE is corrupted, the model fails in its core purpose. Every model has a defined CDE set; every validation must test them. The DQ assessment follows four sequential steps:"),
  calloutM("The DQ Validation Protocol — Four Sequential Steps",[
    new Paragraph({spacing:{after:80},children:[sb("Step 1 — Lineage: "),s("Where does each CDE come from? Map each field from its source system (core banking, CDD, payment ledger) through any transformation layers to the model's input table. A field whose provenance cannot be established cannot be validated. Lineage documentation is the prerequisite for all subsequent steps — without it, a reconciliation failure cannot be attributed to a root cause.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Step 2 — Reconciliation: "),s("Does the data in the model's input match the source system? Row counts, aggregate totals, and key field distributions should be reconciled between source and model input at each scheduled monitoring run. A 2% unexplained shortfall in transaction counts is a material reconciliation failure. Reconciliation outputs must be retained as evidence in the model governance register.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Step 3 — CDE Identification and Testing: "),s("Test each CDE across five dimensions: (1) Completeness — what proportion of records have a non-null value? A cash deposit amount field with 15% nulls is a material CDE completeness failure. (2) Uniqueness — are there duplicated records? Duplicate transactions inflate alert counts and distort aggregate features used in ML models. (3) Referential Integrity — do foreign key relationships hold? A customer ID in the transaction table with no match in the CDD table is an orphaned record; the model cannot access CDD features for that customer. (4) Distribution — is the field distribution consistent with expectation and prior periods? An occupation code field where 40% of values are 'Unknown' in one month vs. 5% in the prior month signals an upstream data problem. (5) Missing Values and Illegal Characters — are there values that pass a null check but are not valid? A transaction amount of '-99999' or an occupation code of '0000' is an illegal-character problem masquerading as completeness. The standard four industry dimensions (Completeness, Accuracy, Timeliness, Consistency) map into this step: Completeness and Accuracy are addressed by CDE testing dimensions (1)–(5); Timeliness is assessed by checking whether data is available before the monitoring run's scheduled execution; Consistency is assessed by Referential Integrity and cross-system Distribution checks.")]}),
    new Paragraph({spacing:{after:0},children:[sb("Step 4 — Feedback Loop: "),s("DQ findings from the validation must be routed back to the data owners and data engineering teams responsible for the source systems. A finding with no feedback loop will recur at the next validation cycle. The model governance register should track each DQ finding, the data owner responsible, and the remediation timeline. Closing the loop is what distinguishes a DQ assessment from a DQ inventory.")]}),
  ],"E8EEFF"),
  callout("No Data is Bad Data","A null occupation code is not random noise — it is information about the onboarding process, the data migration, or the customer's willingness to disclose. Missing or imperfect data is not 'bad'; it tells you something. The validation question is not 'is the data perfect?' but 'does the model account for what the data cannot tell it?' A model that imputes missing CRR scores as the population mean, without documenting this as a limitation, is making an untested assumption that may systematically under-flag high-risk customers who declined to provide CDD information. Validation must surface these assumptions — they are the hidden inputs that often drive the most consequential model outputs.","FFF3E6"),
  spacer(),

  h3("Pillar 4 — Model Methodology"),
  body("Methodology validation assesses whether the chosen approach is conceptually sound and fit for purpose. For AML models, this means asking whether the model would work — not just whether it is implemented correctly."),
  bullet("Conceptual soundness: is the methodology appropriate for the problem? Using K-Means for segmentation is conceptually sound; using it to classify individual transactions as suspicious is not."),
  bullet("Backtesting: does the model produce the expected output when applied to historical data? For a scenario rule, this means checking whether it would have generated alerts on known SAR cases. Note the fundamental limitation: backtesting in AML can only test against known SARs — which are themselves the output of the current model. A scenario that missed suspicious activity in the past generated no SAR for that activity, so the backtest will not detect the miss. This circular dependency means backtesting tests whether the model would have caught what was already caught; it cannot test whether it would catch what was missed. BTL sampling (Chapter 6) and coverage assessment (Chapter 7) are essential complements to backtesting precisely because they probe what the model does not see."),
  bullet("Benchmarking: how does the model perform relative to a challenger model or an expert judgement baseline? A scenario that generates fewer SARs per analyst hour than manual review is not adding value."),
  bullet("Sensitivity analysis: how sensitive is the model output to small changes in input parameters? A threshold model that generates wildly different alert volumes for a $500 change in the threshold has poor stability."),
  spacer(),

  h3("Pillar 5 — Model Documentation"),
  body("Documentation is both the output of the validation process and evidence that the process was conducted properly. A validation without documentation is a validation that cannot be demonstrated to a regulator."),
  bullet("Validation report: a structured document covering: scope, methodology, findings (with severity ratings), recommendations, and management response."),
  bullet("Finding severity ratings: findings are typically rated as Critical (model must be suspended), High (remediation required within 30 days), Medium (remediation within 90 days), or Low (remediation at next review cycle)."),
  bullet("Management response: for each finding, model owners must document their agreed remediation action and timeline. Disagreements must be escalated."),
  bullet("Ongoing monitoring: validation is not a one-time event. Models must be monitored continuously for performance degradation, data drift, and changes in the operating environment."),
  spacer(),

  h2("9.5 Common Validation Failures and Regulatory Consequences"),
  spacer(),
  tbl(
    ["Validation Failure","Regulatory Consequence"],
    [
      ["No model inventory — scenarios and ML models not registered","Matter Requiring Attention (MRA) in US examination; supervisory concern in FinCEN review. Immediate requirement to construct inventory."],
      ["No independent validation — model validated by its own development team","Enforcement action risk. SR 26-2 explicitly requires independence. Finding will be rated High or Critical."],
      ["Data quality not assessed — no documentation of input data completeness or accuracy","Model output reliability cannot be established. Regulator may question all SARs produced by the model during the unvalidated period."],
      ["No backtesting evidence — model not tested against known SAR cases","Conceptual soundness cannot be demonstrated. Regulator may require suspension pending remediation."],
      ["Threshold changes deployed without approval","Change management failure. Creates gap in the audit trail. May require retrospective review of all alerts generated at the unapproved threshold."],
      ["Validation findings not remediated — management response without action","Demonstrates that governance is performative rather than effective. Escalation to senior management and potential enforcement action."],
    ],
    [3500,5526]
  ),
  spacer(),

  callout("From School to Practice","You may be familiar with cross-validation, train-test splits, and accuracy metrics from machine learning coursework. These are methodology validation techniques — they assess whether a model generalises beyond its training data. In AML model validation, methodology assessment is only one of five pillars. A model that passes every statistical test but has no governance structure, no data quality assessment, and no documentation has failed validation under SR 26-2 (US) and PRA SS1/23 (UK). The regulatory framework is broader than the technical framework.","E8F4E8"),
  spacer(),

  h2("9.6 Applying the Five Pillars to the Northgate Model Suite"),
  body("We now apply the five-pillar framework to the three models built for the Northgate scenario throughout this book: the NRB-STRUCT-001 scenario rule, the K-Means segmentation, and the Isolation Forest triage model."),
  spacer(),
  tbl(
    ["Pillar","Requirements","NRB-STRUCT-001 (Scenario Rule)","K-Means Segmentation","Isolation Forest Triage"],
    [
      ["1 — Governance","Model inventory entry; named owner; change management process","Finding: No formal inventory entry. Recommendation: Register model with risk tier 'High' given regulatory scope.","Finding: Not in inventory. Recommendation: Register with tier 'Medium'; changes to K require approval.","Finding: Not in inventory. Recommendation: Register with tier 'High'; any retraining requires approval."],
      ["2 — Framework","Purpose, methodology, inputs, outputs, assumptions, limitations documented","Partially documented. Rule logic is clear; assumptions about lookback window not documented. Recommendation: Complete framework document.","Methodology documented in Chapter 5. Assumption that K=3 is optimal not fully justified. Recommendation: Add silhouette analysis to documentation.","Purpose and methodology documented. Contamination=0.12 assumption requires justification. Recommendation: Link to calibration exercise from Ch 6."],
      ["3 — Data Quality","Lineage, Reconciliation, CDE Testing (5 dimensions), Feedback Loop","CDE Finding (High): Cash deposit amount completeness not assessed against source system — lineage undocumented. Recommendation: Establish lineage map; implement CDE completeness check with >98% threshold; reconcile to core banking daily.","CDE Finding (High): CRR score has 8% null rate — a CDE/KDE for this model. K-Means silently assigns nulls to nearest centroid; undocumented behaviour that may systematically misclassify high-risk customers who declined CDD disclosure. Recommendation: Imputation strategy required; document as model limitation; add to feedback loop for CDD data remediation.","CDE Finding (Medium): days_since_last_alert has no DQ check. Recommendation: Assert non-null and non-negative before each model run; add to reconciliation checklist."],
      ["4 — Methodology","Conceptual soundness; backtesting; benchmarking; sensitivity analysis","Finding: No backtesting against known SAR cases. Recommendation: Apply rule to 12-month historical data; calculate retrospective SAR rate.","Finding: No benchmarking against top-down segmentation alternative. Recommendation: Compare K-Means clusters to product-based segmentation.","Finding: No sensitivity analysis on contamination parameter. Recommendation: Run at 0.08, 0.12, 0.16 and document impact on top-20 SAR rate."],
      ["5 — Documentation","Validation report with findings, severity ratings, management response, ongoing monitoring plan","No validation report exists. All findings above are High severity. Recommendation: Complete validation and produce report within 30 days.","No validation report exists. Findings rated Medium. Recommendation: Complete validation within 60 days.","No validation report exists. Findings rated High given ML complexity. Recommendation: Complete validation within 30 days; include explainability assessment."],
    ],
    [1600,1800,1876,1876,1876]
  ),
  spacer(),

  body("A note on severity ratings: NRB-STRUCT-001 and Isolation Forest findings are rated High because both models directly govern SAR-triggering decisions — NRB-STRUCT-001 generates the alerts that analysts review; Isolation Forest determines which of those alerts reach an analyst first. A failure in either model has a direct and immediate impact on SAR output quality. K-Means findings are rated Medium because the segmentation model influences threshold selection and peer group definition indirectly — a K-Means failure degrades calibration quality over time but does not produce immediate, observable SAR errors. In a programme where SAR quality is under regulatory scrutiny, this distinction may need revisiting."),

  h2("9.7 Scenario Design Evaluation"),
  body("Scenario design evaluation — how to assess whether a scenario achieves adequate coverage of its target typology — was introduced in the scenario design methodology (Chapter 4, Section 4.6). This section provides the formal validation framework."),
  body("The key question in scenario design evaluation is not precision or recall in the conventional ML sense — it is coverage. Does the scenario logic, as implemented, address the typology it was designed to detect? The evaluation chain is: Risks → Red Flags → Typologies → Scenarios → Parameters. Each link in the chain must be documented and traceable. A validator reviewing a deployed scenario asks: is the scenario traceable to a documented regulatory red flag? Does the logic correctly encode that red flag? Are the parameters calibrated to produce alerts at the right sensitivity level for the target typology?"),
  calloutM("Cross-Reference: Scenario Design Chain", [
    new Paragraph({spacing:{after:80},children:[s("Chapter 4 introduced the five-step scenario design chain: (1) Identify risks from regulatory red flags → (2) Select/design typologies → (3) Design scenarios → (4) Set parameters → (5) Test and validate. Model validation in Chapter 9 provides the independent verification that this chain was executed correctly. Validation does not redesign the scenario — it tests whether the design was sound.")]}),
    new Paragraph({spacing:{after:0},children:[s("Chapter 6 introduced hypergeometric BTL sampling as the methodology for estimating the false negative rate and assessing whether it falls within the institution's risk appetite. In a model validation context, BTL sampling results are a required input to Pillar 4 (Model Methodology) — the validator must assess whether the sampling methodology is sound and whether the BTL SAR rate, as estimated, is within the institution's documented risk appetite threshold.")]}),
  ], "E8EEFF"),
  body("Risk appetite connects to validation criteria: the institution must document what level of missed suspicious activity is acceptable (the risk appetite threshold), and the model validation must confirm that the BTL sampling results demonstrate the threshold is met. This is the mechanism by which risk appetite — defined in governance — is operationalised through analytics. If the BTL SAR rate exceeds the risk appetite threshold, the model fails validation on coverage grounds, regardless of its precision and recall on the ATL population."),
  body("L1/L2/L3 investigation sits within the First Line (1LoD) — per the correction in Chapter 3. When model validation assesses the alert review process, it must reflect this: the validation is assessing a First Line operational control, challenged by the Second Line (model risk / FinCrime compliance) and independently reviewed by the Third Line (Internal Audit/IMR). Validation documentation must correctly position the alert review tiers within the 3LoD framework."),
  spacer(),

  h2("9.8 Risk Considerations"),
  bulletMixed([sb("Independence of validation: "),s("The most common governance failure is validation conducted by the team that built the model. In smaller organisations where full independence is impractical, compensating controls are required — and must be documented as such. Documenting the independence limitation and the compensating controls is not a weakness; claiming independence where none exists is. Examples of compensating controls: external third-party review, peer review by a team in a different jurisdiction or business line, or enhanced documentation standards subject to senior management sign-off.")]),
  bulletMixed([sb("Model drift: "),s("A model that was valid at the time of its last review may no longer be valid today. Transaction patterns shift, customer populations change, and money-laundering methods evolve. Ongoing monitoring — tracking alert volumes, SAR rates, data quality metrics, and feature distributions — is the early warning system for model drift.")]),
  bulletMixed([sb("Challenger models: "),s("SR 26-2 recommends that material models be periodically benchmarked against challenger models — alternative methodologies applied to the same problem. For the Northgate segmentation, a rule-based top-down segmentation is a natural challenger to K-Means.")]),
  bulletMixed([sb("Regulatory examination of ML models: "),s("Examiners are increasingly technically sophisticated. Expect to be asked not just 'do you have a validation?' but 'can you explain how the model makes its decisions?', 'what happens if a key data field is missing?', and 'how do you know the model is still performing as intended?'")]),
  spacer(),

  tkBox([
    "Every AML TM model — scenario rules, segmentation, ML triage — is subject to model risk management requirements under SR 26-2 (US) and PRA SS1/23 (UK). The five pillars are our synthesis of those requirements into a single operational framework.",
    "The five pillars are: Model Governance, Model Framework, Data Quality, Model Methodology, and Model Documentation. All five must be addressed. Pillar 3 (Data Quality) follows a four-step protocol: Lineage → Reconciliation → CDE Testing → Feedback Loop.",
    "Model validation must be independent of model development — mapping to the 2nd Line in the Three Lines of Defence. Where full independence is impractical, compensating controls must be documented.",
    "Common failures include: missing model inventory, no backtesting evidence, unassessed CDEs, and findings that receive management responses but no remediation action.",
    "Ongoing monitoring is required. A validation completed two years ago does not guarantee a model is still fit for purpose today. Alert volume drift, SAR rate drift, and feature distribution drift are early warning indicators.",
    "An institution that has completed model inventory, independent validation, and operationalised ongoing monitoring has reached the Established maturity stage. Multiple validation cycles with documented governance response and demonstrated remediation moves it to Advanced.",
    "Chapter 10 extends the Northgate case study to frontier techniques — including Entity Consolidation and graph/network analysis — that also require model validation under this framework.",
  ]),
  spacer(),

  exBox([
    new Paragraph({spacing:{after:100},children:[new TextRun({text:"Exercise 9.1 — Validate the Northgate Model Suite  [Advanced]",font:"Arial",size:22,bold:true,color:"2E75B6"})]}),
    new Paragraph({spacing:{after:80},children:[sb("Recap: "),s("In Exercise 8.1 you applied ML triage to the Northgate alert population. You have now built three models: NRB-STRUCT-001 (scenario rule), K-Means segmentation (Chapter 5), and Isolation Forest triage (Chapter 8). Now validate all three against the five pillars.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part A — Model Framework Documents: "),s("For each of the three models, write a Model Framework document (one paragraph per model) covering: purpose, methodology, inputs, outputs, key assumptions, and one material limitation.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part B — Data Quality Assessment: "),s("Use the 500-customer dataset from Chapter 5 for NRB-STRUCT-001 and K-Means; use the 200-alert dataset from Chapter 8 for Isolation Forest. Following the four-step DQ protocol (Lineage → Reconciliation → CDE Testing → Feedback Loop), assess data quality for each model. Specifically: (1) What is the null rate for each CDE used by each model? (2) For NRB-STRUCT-001, what is the impact on alert volume if transaction_amount is null for 15% of records? (3) For K-Means, what happens to cluster assignments if crr_score is imputed as the population mean — and what type of customer is most likely to have a missing CRR score?")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part C — Validation Finding: "),s("Write one formal validation finding for the most material weakness you identified across the three models. Use the standard format: Observation | Risk | Root Cause | Recommendation | Proposed Management Response. Rate the severity (Critical / High / Medium / Low) and justify your rating.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part D — Ongoing Monitoring Plan: "),s("Define four metrics that should be monitored monthly for the Northgate model suite. For each metric, specify: what it measures, how it is calculated, and what threshold would trigger a model review.")]}),
    new Paragraph({spacing:{after:80},children:[si("See the Instructor's Solutions Manual for worked answers. In Chapter 10, we look forward — extending the Northgate scenario to address the emerging threat of crypto-based money mules.")]}),
  ]),

  exBox([
    new Paragraph({spacing:{after:100},children:[new TextRun({text:"Part E — Meridian Trading Ltd: Extending the Validation to TBML-INVOICE-001  [Applied / Out-of-the-Box]",font:"Arial",size:20,bold:true,color:MID_BLUE})]}),
    new Paragraph({spacing:{after:80},children:[s("Project Sentinel's model suite now includes four models: the three Northgate models from Parts A–D, plus TBML-INVOICE-001 (the Meridian commercial scenario). Apply the five-pillar validation framework to TBML-INVOICE-001.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:60},children:[s("Pillar 3 is Data Quality. Apply the DQ four-step protocol (Lineage → Reconciliation → CDE Testing → Feedback Loop) to the Meridian invoice data. You established in Chapter 3's Part B that SWIFT MT700 data has significant lineage complexity. What is the CDE null rate for 'commodity HS code' across Meridian's 89 invoices if 27 of them carry only a free-text commodity description with no structured HS code? Rate the severity of this finding (Low / Medium / High / Critical) and justify your rating with reference to the 'No Data is Bad Data' principle.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:60},children:[s("Pillar 4 is Model Methodology. TBML-INVOICE-001 uses a commodity price benchmark ratio as its detection logic. The 3rd Line internal auditor challenges this: 'The benchmark is based on HMRC average import prices, which are lagged by 6 months. Over-invoicing by less than 1.8x the lagged benchmark would not fire the rule — but it is still suspicious.' Write the 2nd Line model risk manager's response. Reference the backtesting circular dependency note from the chapter and explain what independent benchmark source would strengthen the model's methodology.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:80},children:[s("Write a combined findings summary for the four-model suite (three Northgate models + TBML-INVOICE-001). Produce a table: Model | Pillar | Finding | Severity | Owner. Rank by severity. Which model has the most material finding, and what should Project Sentinel remediate first?")]}),
  ]),

  exBox([
    new Paragraph({spacing:{after:80},children:[new TextRun({text:"Part F — Project Sentinel: The MRC Paper  [Synthesis / Stretch]",font:"Arial",size:20,bold:true,color:MID_BLUE})]}),
    new Paragraph({spacing:{after:80},children:[s("Project Sentinel must present a Model Risk Committee (MRC) paper summarising the validation outcomes for the four-model suite. The MRC includes: the CRO (chair), the Head of Financial Crime (1st Line), the Head of Model Risk (2nd Line), and the Chief Internal Auditor (3rd Line). Your paper must be no longer than 500 words. It must cover: executive summary of findings, severity-ranked finding table (from Part E question 3), the remediation priority and timeline, and the conditions under which the MRC should convene an extraordinary review before the next scheduled quarterly meeting.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:60},children:[s("Write the MRC paper. Your paper must be well-structured (with clear headings), written in a register appropriate for a senior governance committee, and must not exceed 500 words. Mark any section that goes over a sub-limit with '[OVERLENGTH]' — regulatory governance documents must demonstrate discipline.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:80},children:[s("The 3rd Line internal auditor has reviewed the draft MRC paper and has flagged the following statement as requiring rewrite: 'The TBML-INVOICE-001 model has been validated and is approved for production use, subject to the remediation of the HS code CDE null rate finding.' The auditor's challenge: 'This statement mischaracterises the validation outcome. A model with a Critical DQ finding is not validated — it is conditionally approved pending remediation, which is a materially different governance status.' Rewrite the statement to reflect the correct governance position, in no more than 50 words. Then write a one-paragraph explanation of why the distinction matters from a regulatory risk perspective.")]}),
    new Paragraph({spacing:{after:80},children:[si("This is the penultimate exercise in the book. In Chapter 10, the Northgate investigation takes a new turn: the mule network has moved to crypto, and Project Sentinel must extend its capabilities to meet the emerging threat.")]}),
  ]),
  spacer(),

  h2("Further Reading and Research Topics"),
  num("Board of Governors of the Federal Reserve System / OCC, 'Supervisory Guidance on Model Risk Management' (SR 26-2, OCC 2026). This is the definitive US standard for model risk management. Read Section IV ('Validation') in full. Map each of the four validation activities described onto the five-pillar framework from this chapter. Where do they align, and where does the five-pillar framework go further?"),
  num("PRA SS1/23, 'Model Risk Management Principles for Banks'. This is the UK equivalent of SR 26-2, published in 2023. Compare Section 4 ('Model validation') with Section 9.2 ('Validation') of SR 26-2. What is the single most significant difference in the UK standard's expectations for AML model validation?"),
  num("Research Question: The BCBS 'Principles for effective risk data aggregation and risk reporting' (BCBS 239, 2013) requires banks to maintain data quality standards across all risk models. Although written for market and credit risk, its principles apply directly to AML model data governance. Read Principles 2 through 6. For each, write one sentence explaining how it applies to the Northgate model suite."),
  num("Case study: The FCA's Final Notice for Commerzbank AG London Branch (2020, available at fca.org.uk) cited, among other failings, inadequate AML model validation and data quality controls. Read the Final Notice. Identify three specific failings that correspond to findings in this chapter's five-pillar framework. Which pillar does each failing correspond to, and what remediation would have prevented it?"),
  spacer(),
  pb(),
];

const doc = new Document({
  numbering: { config: numCfg },
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
    headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } }, children: [new TextRun({ text: "Applied AML Analytics  |  Chapter 9", font: "Arial", size: 18, color: MID_BLUE })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: "Arial", size: 18, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "888888" })] })] }) },
    children
  }]
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/Book1_Chapter9.docx', buf); console.log('Done: Book1_Chapter9.docx'); });

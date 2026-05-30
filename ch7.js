const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat, ImageRun
} = require('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/node_modules/docx');
const fs = require('fs');

const DARK_NAVY="1A1A2E", MID_BLUE="2C3E6B", LIGHT_GREY="F0F2F8", ACCENT_BLUE="4472C4", WHITE="FFFFFF";
const cellBorder=(c="CCCCCC")=>({top:{style:BorderStyle.SINGLE,size:1,color:c},bottom:{style:BorderStyle.SINGLE,size:1,color:c},left:{style:BorderStyle.SINGLE,size:1,color:c},right:{style:BorderStyle.SINGLE,size:1,color:c}});
const s=(t,opts={})=>new TextRun({text:t,font:"Arial",size:20,color:"222222",...opts});
const sb=(t)=>s(t,{bold:true});
const si=(t)=>s(t,{italics:true});
const r=(t)=>new TextRun({text:t,font:"Arial",size:22,color:"222222"});
const rb=(t)=>new TextRun({text:t,font:"Arial",size:22,bold:true,color:"222222"});

const numCfg=[
  {reference:"bullets",levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
  {reference:"numbers",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
  {reference:"numbers2",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
];

const body=(t,after=160)=>new Paragraph({spacing:{after},children:[r(t)]});
const bodyMixed=(runs,after=160)=>new Paragraph({spacing:{after},children:runs});
const bullet=(t)=>new Paragraph({numbering:{reference:"bullets",level:0},spacing:{after:100},children:[s(t)]});
const bulletMixed=(runs)=>new Paragraph({numbering:{reference:"bullets",level:0},spacing:{after:100},children:runs});
const num=(t,ref="numbers")=>new Paragraph({numbering:{reference:ref,level:0},spacing:{after:100},children:[s(t)]});
const numMixed=(runs,ref="numbers")=>new Paragraph({numbering:{reference:ref,level:0},spacing:{after:100},children:runs});
const spacer=()=>new Paragraph({spacing:{after:200},children:[r("")]});
const pb=()=>new Paragraph({children:[new PageBreak()]});
const h1=(t)=>new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:360,after:200},children:[new TextRun({text:t,font:"Arial",size:36,bold:true,color:DARK_NAVY})]});
const h2=(t)=>new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:280,after:160},children:[new TextRun({text:t,font:"Arial",size:28,bold:true,color:MID_BLUE})]});
const h3=(t)=>new Paragraph({heading:HeadingLevel.HEADING_3,spacing:{before:200,after:120},children:[new TextRun({text:t,font:"Arial",size:24,bold:true,color:MID_BLUE})]});

const box=(children,fill,border)=>new Table({width:{size:9026,type:WidthType.DXA},columnWidths:[9026],rows:[new TableRow({children:[new TableCell({borders:cellBorder(border),width:{size:9026,type:WidthType.DXA},shading:{fill,type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:180,right:180},children})]})]});
const codeBox=(label,lines)=>new Table({width:{size:9026,type:WidthType.DXA},columnWidths:[9026],rows:[new TableRow({children:[new TableCell({borders:cellBorder(ACCENT_BLUE),width:{size:9026,type:WidthType.DXA},shading:{fill:"F0F4FF",type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:200,right:200},children:[new Paragraph({spacing:{after:100},children:[s(label,{bold:true,color:MID_BLUE})]}), ...lines.map(l=>new Paragraph({spacing:{after:40},children:[new TextRun({text:l,font:"Courier New",size:18,color:"1A2856"})]}))]})]})]});
const outputBox=(label,lines)=>new Table({width:{size:9026,type:WidthType.DXA},columnWidths:[9026],rows:[new TableRow({children:[new TableCell({borders:cellBorder("2E7D32"),width:{size:9026,type:WidthType.DXA},shading:{fill:"F1F8E9",type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:200,right:200},children:[new Paragraph({spacing:{after:100},children:[s(label,{bold:true,color:"2E7D32"})]}), ...lines.map(l=>new Paragraph({spacing:{after:40},children:[new TextRun({text:l,font:"Courier New",size:18,color:"1A3300"})]}))]})]})]});
const imageBlock=(imagePath,w,h)=>new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:120,after:160},children:[new ImageRun({data:fs.readFileSync(imagePath),transformation:{width:w,height:h}})]});
const callout=(label,text,fill="E8EEFF")=>box([new Paragraph({spacing:{after:80},children:[s(label,{bold:true,color:MID_BLUE})]}),new Paragraph({spacing:{after:0},children:[si(text)]})],fill,ACCENT_BLUE);
const calloutMixed=(label,paras,fill="E8EEFF")=>box([new Paragraph({spacing:{after:80},children:[s(label,{bold:true,color:MID_BLUE})]}),...paras],fill,ACCENT_BLUE);
const exBox=(children)=>box(children,"EBF3FC","2E75B6");
const tkBox=(items)=>box([new Paragraph({spacing:{after:80},children:[new TextRun({text:"Key Takeaways",font:"Arial",size:22,bold:true,color:"1A7A4A"})]}), ...items.map(t=>new Paragraph({numbering:{reference:"bullets",level:0},spacing:{after:80},children:[s(t)]}))], "E6F9F0","1A7A4A");

const regTable=(headers,rows,widths)=>{
  const hRow=new TableRow({children:headers.map((h,i)=>new TableCell({borders:cellBorder("999999"),width:{size:widths[i],type:WidthType.DXA},shading:{fill:DARK_NAVY,type:ShadingType.CLEAR},margins:{top:80,bottom:80,left:120,right:120},children:[new Paragraph({children:[s(h,{bold:true,color:WHITE})]})]}))} );
  const dRows=rows.map((row,ri)=>new TableRow({children:row.map((cell,ci)=>new TableCell({borders:cellBorder("CCCCCC"),width:{size:widths[ci],type:WidthType.DXA},shading:{fill:ri%2===0?"FFFFFF":LIGHT_GREY,type:ShadingType.CLEAR},margins:{top:80,bottom:80,left:120,right:120},children:[new Paragraph({children:[s(cell)]})]}))}));
  return new Table({width:{size:9026,type:WidthType.DXA},columnWidths:widths,rows:[hRow,...dRows]});
};

const children=[
  h1("Chapter 7: Risk and Coverage Assessments"),
  spacer(),
  calloutMixed("Learning Objectives — By the end of this chapter you will be able to:",[
    num("Construct a risk coverage matrix that maps typologies to scenarios and surfaces analytical gaps.",),
    num("Use FFIEC red flags to evaluate whether a scenario adequately covers a given money-laundering typology."),
    num("Apply basic NLP techniques to extract red flag indicators from regulatory text automatically."),
    num("Assess the coverage of the Northgate structuring scenario and propose remediation for identified gaps."),
  ]),
  spacer(),

  h2("7.1 Business Context: Coverage Is a Regulatory Expectation"),
  body("Regulators do not simply ask whether a bank has transaction monitoring scenarios. They ask whether those scenarios cover the risks the bank has identified in its risk assessment. A bank that has assessed structuring as a high risk but has no scenario that detects cash deposits just below the reporting threshold has a material gap — and that gap is indefensible."),
  body("Risk and coverage assessment is the process of systematically answering the question: do our scenarios detect the behaviours we have identified as risks? It connects the risk assessment function (which says what risks exist) to the analytics function (which says what the system can detect). Without this bridge, a Transaction Monitoring Framework may be operationally active but strategically blind."),
  body("In operational practice, risk and coverage assessment is the first stage of the TM lifecycle — the stage that determines what scenarios are needed before they are designed. It is the risk assessment that tells you what to build; the coverage matrix that tells you whether you built it. We present the methodology here — in Chapter 7, after you have designed, segmented, and tuned a scenario — so that you can evaluate your own work against the same standard an examiner would apply. In a programme built from scratch, this chapter should logically precede Chapter 4."),
  body("Coverage assessment is also one dimension of model validation under SR 26-2 (US) and PRA SS1/23 (UK). It tests whether the model — the scenario set — addresses its stated purpose. A scenario that exists but does not cover its target typology fails model validation on scope, regardless of how well it is calibrated. We cover the full model validation framework in Chapter 9."),
  body("This chapter introduces the methodology for risk coverage mapping, shows you how to use FFIEC red flags as the benchmark, and explains how NLP tools can automate parts of the process. By the end, you will have a structured way to answer a question that regulators ask in every AML examination."),

  calloutMixed("Typology Framework: Both Ends of the TM Process", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "The typology and red flag framework is not only a scenario design tool — it must be applied at both ends of the TM process:", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [sb("Front end — Scenario Design (covered in Chapter 4): "), s("Typologies and regulatory red flags drive the Risks → Red Flags → Typologies → Scenarios → Parameters chain. Every scenario must be traceable to at least one documented typology.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [sb("Back end — Investigation (covered in Chapter 3): "), s("Investigators must apply typological awareness during case review. An investigator who identifies a red flag in a case that is not covered by any existing scenario has identified a coverage gap. That observation should feed back into the coverage assessment process. The back-end typology application is what enables the TM lifecycle to function as a feedback loop — not just a one-way detection engine.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "Coverage assessment — this chapter — sits at the intersection of both ends: it verifies that the scenarios designed at the front end are detecting what they should, and that the observations made at the back end are feeding back into the scenario development cycle.", font: "Arial", size: 20, color: "222222", italics: true })] }),
  ], "E8EEFF"),
  spacer(),

  h2("7.2 The Coverage Assessment Methodology"),
  body("A coverage assessment follows four steps. Each step builds on the last, and the output of the final step is a documented gap analysis that is defensible to an examiner."),
  calloutMixed("Coverage Assessment Protocol — Prerequisites and Governance",[
    new Paragraph({spacing:{after:60},children:[sb("Owner: "),s("Coverage assessment is a 2nd Line (FinCrime Risk / AML Risk) function. FinCrime Risk owns both the risk assessment and the coverage matrix. Data and Analytics provides the scenario inventory and the technical coverage analysis. The output is reviewed at the governance forum and subject to 3rd Line (Audit/IMR) independent challenge.")]}),
    new Paragraph({spacing:{after:60},children:[sb("Prerequisites: "),s("The following must be assembled before the assessment begins: (1) the current firm-wide risk assessment, identifying the typologies assessed as relevant and their severity ratings; (2) the full deployed scenario library, with each scenario's stated purpose and encoded red flags; (3) current regulatory guidance (FFIEC manual, JMLSG guidance, applicable FATF typology reports); (4) access to scenario performance data (alert volumes, SAR rates) from the prior 12 months.")]}),
    new Paragraph({spacing:{after:60},children:[sb("Documentation output: "),s("A dated, signed coverage matrix showing coverage status (Full / Partial / Gap) for each red flag against each scenario. Accompanied by a gap analysis narrative that assigns a risk rating and remediation timeline to each gap. The document is retained in the model governance register.")]}),
    new Paragraph({spacing:{after:0},children:[sb("Review frequency: "),s("At minimum annually. Additionally triggered by: publication of new FCA/JMLSG/FATF guidance; material change in the institution's product set or customer base; regulatory examination finding; significant change in the typology landscape (e.g., emergence of a new mule typology or payment method).")]}),
  ],"E8EEFF"),
  spacer(),
  num("Typology inventory: compile the full list of money-laundering typologies relevant to your institution. These come from your firm-wide risk assessment, FATF typology reports, FFIEC red flag lists, and JMLSG guidance. For a retail bank, structuring, money mule activity, and third-party payments are almost always on this list."),
  num("Scenario inventory: compile the full list of TM scenarios currently deployed. For each scenario, document its purpose, the typology it addresses, and the red flags it encodes."),
  num("Coverage mapping: create a matrix. Rows are red flags or typology indicators. Columns are scenarios. Each cell indicates whether the scenario covers that red flag, partially covers it, or does not cover it."),
  num("Gap analysis: identify red flags with no or partial coverage. For each gap, assess the risk: how common is this behaviour? How severe is the consequence of missing it? What is the cost of building a scenario to address it?"),
  spacer(),

  h2("7.3 FFIEC Red Flags for Structuring"),
  calloutMixed("Coverage Taxonomy: Three Coverage States", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Every red flag in the coverage matrix must be assigned one of three coverage states. These states are used consistently throughout this book and in Chapter 9 (Model Validation):", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [sb("Full Coverage: "), s("The risk or red flag is fully addressed by an existing scenario or control. The scenario is deployed, data quality is confirmed, and calibration has been validated. The risk is considered controlled.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [sb("Partial Coverage: "), s("The risk is addressed but gaps remain. For example: a scenario exists but does not cover all variants of the typology; or the scenario logic is sound but the required CDE/KDE data is incomplete; or the scenario covers the red flag for one customer segment but not another. Partial coverage requires a documented remediation plan and timeline.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [sb("No Coverage: "), s("The risk has been identified — through the risk assessment, regulatory red flag lists, or investigator feedback — but no control exists to address it. No Coverage findings represent the institution's most significant regulatory exposure and require immediate escalation to the governance forum.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "Coverage state is not static. A scenario that achieves Full Coverage today may degrade to Partial Coverage if the underlying CDE data quality deteriorates, if the threshold is raised without recalibration, or if the typology evolves in a way that the existing scenario logic no longer captures. Coverage assessments must treat coverage state as a point-in-time snapshot, not a permanent designation.", font: "Arial", size: 20, color: "222222", italics: true })] }),
  ], "E8F0FF"),
  spacer(),

  body("The FFIEC BSA/AML Examination Manual is the definitive reference for US examiners. Its red flag lists are used internationally as a benchmark for scenario coverage, regardless of jurisdiction. For structuring, the following red flags are documented in the FFIEC manual."),
  callout("Jurisdictional Note — USD vs USD Thresholds","The FFIEC manual uses USD throughout, with the Currency Transaction Report (CTR) threshold set at $10,000. The table below adapts these indicators to USD for consistency with the Northgate case study used in this book. UK practitioners should note that there is no mandatory cash reporting threshold in the UK equivalent to the US CTR regime — the relevant UK framework is the Suspicious Activity Report (SAR) obligation under the Proceeds of Crime Act 2002 (POCA 2002), which applies to knowledge or suspicion of money laundering rather than to a fixed cash threshold. The FFIEC structuring indicators should therefore be read as behavioural patterns to detect, not as threshold-specific rules tied to a reporting obligation.","FFF3E6"),
  spacer(),
  regTable(
    ["Red Flag","Description","Detection Approach"],
    [
      ["Deposits just below reporting threshold","Cash deposits consistently at $9,000–$9,999 (or local equivalent), suggesting deliberate avoidance of the reporting trigger.","Threshold rule on single-transaction cash amount."],
      ["Multiple individuals, same account","Several unrelated individuals making deposits into the same account, suggesting coordinated mule activity.","Rule on count of distinct depositors per account in a rolling window."],
      ["Depositor unfamiliar with account holder","Branch observation: depositor cannot state the account holder's name or relationship. Not automated — requires human reporting.","Manual escalation trigger; cannot be automated without narrative data."],
      ["Rapid transfer after deposit","Funds transferred out within 1–3 business days of cash deposit, before they 'settle' into normal account usage.","Time-to-transfer rule: flag accounts where >80% of deposits are followed by outward transfer within 72 hours."],
      ["Multiple branches, same day","Same individual makes deposits at two or more branches on the same day.","Geo-rule: flag accounts receiving deposits from multiple branch codes on the same calendar date."],
      ["Round-number avoidance","Deposits at $8,000, $8,500, $9,000 rather than round numbers, suggesting calculated sizing.","Statistical rule: flag clustering of deposit amounts in the $7,500–$9,999 band."],
      ["No plausible business purpose","Deposits inconsistent with the account holder's stated occupation or business activity.","CRR/CDD mismatch rule: compare cash volume to expected profile based on occupation code."],
      ["Structuring over multiple days","Daily deposits below threshold that sum to a large amount over 7–30 days.","Rolling-window aggregate rule: flag accounts where rolling 30-day cash total exceeds threshold."],
    ],
    [2000,4226,2800]
  ),
  spacer(),

  h2("7.4 Building the Coverage Matrix"),
  body("We now apply the coverage matrix methodology to the Northgate scenario from Chapter 4. The NRB-STRUCT-001 rule detects a rolling 30-day cash deposit total exceeding the threshold, segmented by peer group. Let us assess which red flags it covers."),
  spacer(),
  regTable(
    ["Red Flag","Covered by NRB-STRUCT-001?","Coverage Mechanism","Gap?","Data Readiness"],
    [
      ["Deposits just below threshold","Partial","NRB-STRUCT-001 detects aggregate structuring: a rolling cash total that exceeds the threshold across multiple deposits. Single-deposit proximity structuring — where each individual deposit sits just below the threshold — is a distinct behaviour not captured by the rolling aggregate rule.","Yes — no single-transaction proximity rule.","Cash transaction records with individual deposit amount and timestamp. Available in most core banking systems."],
      ["Multiple individuals, same account","No","The rule monitors total cash volume, not depositor identity count.","Yes — material gap.","Depositor identity (name or ID) captured at the branch must flow to the TM system as a structured field. Frequently absent — a common data readiness failure in retail banks."],
      ["Depositor unfamiliar with account holder","No","Cannot be automated; requires branch observation and escalation.","Yes — process gap, not analytical.","Branch teller narrative. No structured data field exists; requires a branch escalation workflow feeding a case management system."],
      ["Rapid transfer after deposit","No","NRB-STRUCT-001 does not include a time-to-transfer component.","Yes — material gap.","Settlement timestamps on inbound cash and outbound payment transactions. Typically available; requires joining cash and payment ledgers on account and date."],
      ["Multiple branches, same day","No","No geo-dimension in the current rule.","Yes — gap.","Branch code on each cash transaction. Availability varies — not all core banking systems capture branch of origin for cash deposits consistently."],
      ["Round-number avoidance","No","No statistical distribution check on deposit amounts.","Yes — gap.","Cash transaction amounts. Available; requires statistical analysis of amount clustering in the sub-threshold band."],
      ["No plausible business purpose","Partial","CRR segmentation incorporates occupation risk, but not a transaction-vs-CDD profile mismatch check.","Partial — needs dedicated CDD mismatch rule.","Occupation codes from the CDD system, joined to transaction volume data. Requires CDD-to-transaction linkage — often a data integration challenge across systems."],
      ["Rolling-window aggregate","Yes","Core mechanism of NRB-STRUCT-001.","No — fully covered.","Rolling 30-day cash deposit total per account. Available and in use."],
    ],
    [1800,1300,2426,1300,2200]
  ),
  spacer(),
  body("This matrix immediately reveals that NRB-STRUCT-001, while a well-designed rule for its stated purpose, covers only one of eight FFIEC structuring red flags fully. Four represent material gaps — behaviours that would not be detected under the current scenario set. Critically, three of those gaps also carry data readiness problems: the data required to detect the behaviour is not currently flowing into the TM system in usable form."),

  calloutMixed("Architectural Limitations — Some Gaps Cannot Be Closed by Rules Alone",[
    new Paragraph({spacing:{after:80},children:[s("Several gaps in the coverage matrix above are not simply analytical problems — they are architectural ones. The 'multiple individuals, same account' gap cannot be closed by a new rule if depositor identity is not captured in a structured field at the branch and passed to the TM system. The 'multiple branches, same day' gap requires branch-of-origin data that many core banking systems do not surface.")]}),
    new Paragraph({spacing:{after:80},children:[s("Closing these gaps requires Entity Consolidation (Chapter 4) — linking depositor identity records across accounts and transactions — and may ultimately require graph-level analysis to detect the coordinated network behaviour that simple account-level rules cannot see.")]}),
    new Paragraph({spacing:{after:0},children:[s("This is an important lesson in the sequencing of Transaction Monitoring Framework development: coverage assessment identifies not just missing scenarios but missing data infrastructure. The remediation roadmap must address both.")]}),
  ],"FFF3E6"),
  body("The Northgate case study illustrates this tension clearly. NRB-STRUCT-001 detects that individual accounts are receiving large cash volumes — but it cannot see that six accounts are part of the same coordinated network. That network-level detection problem is the subject of Chapter 8, where we apply machine learning triage and graph analysis to the alert population this scenario set generates."),
  spacer(),

  callout("Risk Perspective","A coverage gap is not just an analytical shortcoming — it is a regulatory liability. If a SAR is filed by another institution on a customer you were monitoring, and your examination reveals that your scenario set did not cover the red flag that should have triggered your own SAR, that gap becomes part of the regulatory record. Coverage assessments must be documented, dated, and acted upon.","FFF3E6"),
  spacer(),

  h2("7.5 NLP for Coverage Automation"),
  body("Manually comparing scenarios against regulatory red flag lists is time-consuming and error-prone. Natural Language Processing (NLP) can automate significant parts of the process — specifically, the extraction of candidate red flag phrases from regulatory documents."),
  body("The approach is straightforward: parse the regulatory text, extract noun phrases and key entities, and score each against the vocabulary of your existing scenarios. Phrases with no match in any scenario are candidate coverage gaps."),

  callout("From School to Practice","You may have studied NLP in the context of sentiment analysis, machine translation, or text classification. In coverage assessment, we use a simpler but highly practical application: information extraction. We are not classifying the sentiment of a regulatory document — we are extracting the specific phrases it uses to describe suspicious behaviour, then checking whether those phrases map to anything in our scenario library. Note that 'precision' and 'recall' carry a specific meaning in NLP that differs subtly from their use in transaction monitoring. In an NLP extraction task, precision measures how many of the extracted phrases are genuine red flags (not noise), and recall measures how many of the genuine red flags in the document were extracted. In TM, by contrast, precision measures how many alerts correspond to genuine suspicious activity, and recall measures how many suspicious cases generated an alert. Both usages are about the quality of a classifier — but the classifier, and what it classifies, are different. In coverage assessment NLP, recall is more important: missing a genuine regulatory red flag is a more serious error than extracting a phrase that turns out to be noise.","E8F4E8"),
  spacer(),

  body("The following Python example uses spaCy to extract noun phrases from a sample regulatory paragraph and match them against a simple scenario vocabulary index. In a full implementation, this would run against the complete FFIEC manual or JMLSG guidance."),
  spacer(),
  regTable(
    ["Language","Code"],
    [
      ["Python","import spacy\nnlp = spacy.load('en_core_web_sm')\n\ntext = \"\"\"Customers who make cash deposits in amounts just below the Currency Transaction Report\nthreshold, particularly if they make multiple deposits on the same day at different branches,\nmay be attempting to structure transactions to avoid reporting requirements.\"\"\"\n\n# Vocabulary index: phrases already encoded in deployed scenarios\nscenario_vocab = {\n    'cash deposits', 'reporting threshold', 'rolling window', 'aggregate deposits'\n}\n\ndoc = nlp(text)\nprint('Noun phrases (candidate red flags):')\nfor chunk in doc.noun_chunks:\n    phrase = chunk.text.lower()\n    covered = any(v in phrase or phrase in v for v in scenario_vocab)\n    status = 'COVERED' if covered else 'POTENTIAL GAP'\n    print(f' - {chunk.text}  [{status}]')"],
    ],
    [1000,8026]
  ),
  spacer(),
  body("The output would label phrases such as 'cash deposits' as COVERED (present in the scenario vocabulary) and 'different branches' or 'the same day' as POTENTIAL GAP (no matching scenario encodes a multi-branch or same-day constraint). The vocabulary index is built from the documented red flags of each deployed scenario — maintaining it is a governance task, not just a technical one."),
  body("A practical limitation of this approach is that regulatory text uses varied vocabulary: 'structuring', 'layering', 'placement', and 'smurfing' may all refer to overlapping behaviours, and a simple noun-phrase extractor will not recognise these as synonyms. A production-grade implementation requires a controlled vocabulary or ontology — often curated manually by AML subject matter experts — to map variant phrasings to canonical typology concepts. The NLP automates the extraction; the expertise provides the interpretation."),
  bodyMixed([s("In practice, NLP-assisted coverage assessment is rarely a one-click process. It is most effective as a "),si("pre-screening"),s(" tool that reduces the manual effort of reading hundreds of pages of regulatory guidance, flagging candidate phrases for human review rather than making autonomous coverage determinations. The analyst's judgement — and knowledge of how each scenario is actually implemented — remains essential.")]),

  h2("7.6 Impact Assessments"),
  body("When a coverage gap is identified, the next step is an impact assessment. This determines how serious the gap is and what remediation is required. A structured impact assessment covers four areas."),
  bullet("Scope: how many customers and transactions does this gap affect? Use your transaction data to estimate the population that exhibits the uncovered red flag behaviour."),
  bullet("Risk rating: how likely is the uncovered behaviour to represent actual money laundering, and how severe is the consequence of missing it? Use the firm's risk appetite framework to assign a rating (high, medium, low)."),
  bullet("Remediation: what scenario or process change would close the gap? What is the implementation timeline and cost?"),
  bullet("Interim controls: while a new scenario is being built and tested, what manual controls can partially mitigate the gap? Enhanced branch reporting, periodic lookback reviews, and targeted transaction sampling are common interim measures."),
  spacer(),

  h2("7.7 Forensic AI: An Agentic Framework for Risk and Coverage Assessment [Advanced]"),
  body("Traditional risk and coverage assessments are manual, time-consuming, and point-in-time. A compliance team that completes a coverage assessment in January is working with regulatory intelligence that may already be outdated by March. The emergence of agentic AI — systems where multiple AI agents work autonomously in a coordinated pipeline — offers a qualitatively different approach to continuous coverage assessment."),
  body("The following five-agent framework describes how an agentic AI architecture could automate and accelerate the risk and coverage assessment process. This is an exploratory model: the underlying technology is available, and pilot implementations are in development, but production deployment in regulated AML environments remains early-stage. The framework is presented here to prepare practitioners for its near-term arrival."),
  calloutMixed("Forensic AI: Five-Agent Framework for Risk and Coverage Assessment", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Agent 1 — Horizon Scanning (Input: Regulatory Sources)", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [s("Continuously monitors regulatory sources: FinCEN advisories, FFIEC examination manual updates, FATF typology publications, OCC bulletins, FBI financial crime alerts, and court/prosecution records. When new content is published, the agent extracts red flags and typologies using NLP, classifies them by typology category, and flags changes since the last assessment cycle. Output: an updated red flag inventory with source citations and change delta.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Agent 2 — Scenario Inventory Analyst (Input: TMS Configuration)", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [s("Reads the current deployed scenario library — scenario specifications, encoded red flags, parameters, and data dependencies — and generates a structured inventory. For each scenario, the agent maps the encoded red flags to the canonical typology ontology, flags data quality dependencies, and identifies last-validated date. Output: a current-state scenario inventory in machine-readable format.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Agent 3 — Coverage Mapper (Input: Red Flag Inventory + Scenario Inventory)", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [s("Runs the coverage matrix computation: for each red flag in the Agent 1 inventory, it checks whether any scenario in the Agent 2 inventory covers it (Full), partially covers it (Partial), or does not cover it (No Coverage). It applies the three-state coverage taxonomy. Output: a continuously updated coverage matrix.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Agent 4 — Gap Analyst (Input: Coverage Matrix)", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [s("For each No Coverage or Partial Coverage finding, the agent generates a structured gap assessment: risk rating (based on typology severity and customer population exposure), scope estimate (using transaction data to size the population exhibiting the uncovered behaviour), and a draft scenario specification for the remediation. Output: ranked gap assessment report with draft remediation specifications.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Agent 5 — Governance Reporter (Input: Gap Assessments)", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [s("Produces formatted governance outputs for human review: an executive summary of the coverage state, a prioritised remediation roadmap, and a dated, signed-off-ready coverage assessment document. The human governance layer — sign-off by the Head of Financial Crime Risk — remains mandatory. The agent produces the evidence pack; the decision is human.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "Key principle: the five-agent framework does not replace human judgment. It compresses the cycle time from annual to continuous, surfaces emerging gaps before examiners do, and produces a defensible evidence pack. The institution's risk appetite decisions — what constitutes acceptable coverage, what to prioritise for remediation — remain with human governance.", font: "Arial", size: 20, color: "222222", italics: true })] }),
  ], "E8EEFF"),
  spacer(),

  h2("7.8 Colab Walkthrough: Introducing Rule 3 — High-Risk Country Counterparty"),
  body("The coverage matrix in Section 7.4 reveals a gap: Rules 1 and 2 monitor cash deposits and transaction velocity within the bank. Neither detects customers sending funds to counterparties in high-risk jurisdictions — a distinct typology (layering via cross-border transfer) that the structuring rules are blind to. Rule 3 closes this gap."),
  body("The code below implements Rule 3 (NRB-GEO-003). It is built into the same codebase as Rules 1 and 2 and uses the counterparty reference table that has been available in the dataset since Chapter 3."),
  codeBox("📊 Colab Preview: Rule 3 — High-Risk Country Counterparty", [
    "import pandas as pd",
    "",
    "# FATF and OFAC high-risk jurisdictions (illustrative — must be maintained)",
    "HIGH_RISK_COUNTRIES = ['KP', 'IR', 'MM', 'SY', 'YE', 'AF', 'LY']",
    "",
    "def apply_rule_3(df_txn, df_cpty, high_risk_countries, min_txns=2, min_amount=5000):",
    "    \"\"\"Rule NRB-GEO-003: transactions with high-risk country counterparties.\"\"\"",
    "    hr_cpty = df_cpty[",
    "        df_cpty['country_code'].isin(high_risk_countries)",
    "    ]['counterparty_id']",
    "    hr_txns = df_txn[df_txn['counterparty_id'].isin(hr_cpty)].copy()",
    "    results = []",
    "    for acct, grp in hr_txns.groupby('account_id'):",
    "        total = grp['amount'].sum()",
    "        countries = df_cpty.loc[",
    "            df_cpty['counterparty_id'].isin(grp['counterparty_id']),",
    "            'country_code'].unique().tolist()",
    "        if len(grp) >= min_txns and total >= min_amount:",
    "            results.append({",
    "                'account_id':      acct,",
    "                'hr_txn_count':    len(grp),",
    "                'total_hr_amount': round(total, 2),",
    "                'countries':       ', '.join(sorted(countries)),",
    "            })",
    "    return pd.DataFrame(results)",
    "",
    "df_txn  = pd.read_csv('nb_transactions.csv', parse_dates=['txn_date'])",
    "df_cpty = pd.read_csv('nb_counterparties.csv')",
    "rule3_alerts = apply_rule_3(df_txn, df_cpty, HIGH_RISK_COUNTRIES)",
    "print(f'Rule NRB-GEO-003 alerts: {len(rule3_alerts)}')",
    "print(rule3_alerts.sort_values('total_hr_amount', ascending=False).head(5).to_string(index=False))",
  ]),
  outputBox("▶ Real Output — Rule 3 Alerts (high-risk country counterparty)", [
    "Rule 3 alerts: 265",
    "",
    "Top 5 by total high-risk amount:",
    "account_id  hr_txn_count  total_hr_amount              countries",
    "   ACC0187             3         36898.23             KP, LY, SY",
    "   ACC0002             4         34701.64                     AF",
    "   ACC0446            11         32106.19 AF, IR, KP, LY, SY, YE",
    "   ACC0012             6         32055.95             AF, IR, SY",
    "   ACC0481             9         30905.82     AF, KP, LY, SY, YE",
  ]),
  imageBlock('/sessions/intelligent-blissful-clarke/mnt/aml-book1/ch7_rule3_countries.png', 400, 233),
  body("Rule NRB-GEO-003 generates 265 alerts — a broader pool than Rule 1, because many legitimate customers also transact with counterparties in high-risk jurisdictions. The chart shows the distribution of high-risk transactions by country code across the full dataset. Notice that ACC0002, one of the six mule accounts, appears in the top 5 by total high-risk amount. With all three rules now active — NRB-STRUCT-001 (cash structuring), NRB-VEL-002 (velocity), NRB-GEO-003 (high-risk country) — the Northgate scenario set covers three distinct detection dimensions. Exercise 7.1 asks you to map these three rules against the FFIEC red flag list and document which gaps remain."),
  spacer(),

  h2("7.9 Risk Considerations"),
  bulletMixed([sb("Coverage does not equal detection: "),s("Before assessing whether a scenario is effectively calibrated, first verify that the CDEs it depends on are complete and accurate. A scenario with corrupted or missing CDE data provides nominal coverage on paper while generating no usable alerts in practice. The CDE validation step (Chapter 6, Step 0) applies equally to coverage assessments: a scenario cannot cover a red flag it cannot observe. Once data quality is confirmed, assess calibration: a scenario that technically covers a red flag but uses a threshold set too high, or a lookback window too short, provides nominal coverage without practical protection. Coverage assessments must assess not just whether a scenario exists but whether its data foundations and calibration are fit for purpose.")]),
  bulletMixed([sb("Gaming the coverage matrix: "),s("Analysts under pressure may write broad scenarios specifically to achieve coverage metrics, without regard for whether the scenario actually generates useful alerts. An examiner will test the quality of coverage, not just its existence.")]),
  bulletMixed([sb("Regulatory text evolves: "),s("FFIEC guidance, JMLSG publications, and FATF typology reports are updated periodically. A coverage assessment conducted two years ago may be materially out of date. Build regulatory horizon-scanning into the coverage review cycle — at minimum annually, and whenever major guidance is published.")]),
  bulletMixed([sb("Process gaps cannot be automated away: "),s("Some red flags — such as 'depositor unfamiliar with account holder' — require human observation at the branch. No analytical model can compensate for a failure in the branch reporting process. TM analytics and front-line controls must work together.")]),
  spacer(),

  tkBox([
    "Coverage assessment is the first stage of the TM lifecycle — it determines what scenarios are needed before they are built. In a programme built from scratch, it precedes design, segmentation, and calibration; it is presented here so you can evaluate completed work against the same standard an examiner would apply.",
    "Risk coverage assessment links the firm-wide risk assessment to the TM scenario set, bridging strategy and analytics.",
    "The FFIEC BSA/AML Examination Manual red flag lists are the international benchmark for scenario coverage, regardless of jurisdiction. UK practitioners should read the behavioural indicators rather than the USD threshold specifics.",
    "A coverage matrix maps each red flag to the scenarios that cover it — gaps are visible immediately. Adding a data readiness column reveals whether gaps are analytical or architectural.",
    "NLP can automate extraction of candidate red flags from regulatory text, accelerating coverage assessments — but the vocabulary index that maps extracted phrases to scenario coverage requires human AML expertise to maintain.",
    "Impact assessments prioritise gaps by scope and risk, and drive the remediation roadmap. Some gaps require new scenarios; others require data infrastructure investment before a scenario can be built.",
  ]),
  spacer(),

  exBox([
    new Paragraph({spacing:{after:100},children:[new TextRun({text:"Exercise 7.1 — Coverage Assessment for Northgate  [Advanced]",font:"Arial",size:22,bold:true,color:"2E75B6"})]}),
    new Paragraph({spacing:{after:80},children:[sb("Recap: "),s("In Exercise 6.1 you calibrated the threshold for the Northgate structuring scenario. Now assess whether the full three-rule scenario set provides adequate coverage of the structuring typology.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Colab Extension: "),s("Section 7.8 introduced Rule 3 (apply_rule_3). The Chapter 7 Colab notebook pre-loads all three rules and the nb_counterparties dataset. Cell 1 runs all three rules and produces a combined alert table. Part A asks you to map these three rules against the FFIEC red flag list. Part D asks you to design a fourth rule of your own that closes one remaining gap.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part A — Coverage Matrix (Three Rules): "),s("Using the eight FFIEC structuring red flags in Section 7.3, map Rules 1, 2, and 3 against each red flag. Record: which red flags are covered by at least one rule? Which remain uncovered? Identify the two highest-risk uncovered red flags and propose — in one sentence each — the scenario that would address them.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part B — NLP Extraction: "),s("If you have not already installed spaCy, run the following two commands in your terminal before starting this exercise: "),si("pip install spacy"),s(" followed by "),si("python -m spacy download en_core_web_sm"),s(". Write a Python function that takes any paragraph of regulatory text as input and returns a deduplicated list of candidate red flag noun phrases using spaCy. Apply it to the following FFIEC paragraph:"),]}),
    new Paragraph({spacing:{after:80},children:[si("'Individuals who make multiple cash deposits on the same day, particularly at different branch locations, or who appear nervous and unfamiliar with the account holder, may be engaged in structuring to evade Currency Transaction Report requirements.'")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part C — Impact Assessment: "),s("For the 'multiple individuals, same account' gap identified in Section 7.4, write a structured impact assessment covering: estimated scope (use the Chapter 5 dataset — how many accounts have more than 3 distinct cash depositors?), risk rating with justification, proposed new scenario specification, and interim control recommendation.")]}),
    new Paragraph({spacing:{after:80},children:[si("See the Instructor's Solutions Manual for worked answers. In Chapter 8, we apply machine learning triage to the alert population this scenario set generates.")]}),
  ]),

  exBox([
    new Paragraph({spacing:{after:100},children:[new TextRun({text:"Part D — Meridian Trading Ltd: NLP on Trade Documents  [Applied / Out-of-the-Box]",font:"Arial",size:20,bold:true,color:MID_BLUE})]}),
    new Paragraph({spacing:{after:80},children:[s("We continue with Meridian Trading Ltd. You have applied NLP to Northgate's short transaction narratives (Part B). Now apply it to a qualitatively different text type: Meridian's invoice goods descriptions. Meridian's invoices describe shipments of 'industrial compressors, model XC-1200, CIF Rotterdam', 'precision measurement equipment, HS 9026, FOB Shanghai', and 'hydraulic cylinder assemblies, non-standard specification, DDU Gdańsk'. Unlike transaction narratives, these descriptions are longer, more technical, and contain standardised trade terminology (Incoterms, HS codes) alongside ambiguous commodity names.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:60},children:[s("Adapt the spaCy NLP function from Part B to extract: (a) commodity noun phrases, (b) trade route information (origin/destination place names using NER LOCATION tags), and (c) any HS codes or model numbers present. Apply it to the three Meridian invoice descriptions above. What does the output tell you that a simple keyword search would not?")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:60},children:[s("The commodity description 'non-standard specification' in one of Meridian's invoices is a TBML red flag — it prevents commodity price benchmarking by making the item unique. How would you modify the NLP pipeline to flag descriptions that contain trade-opacity indicators (e.g., 'non-standard', 'custom design', 'prototype', 'modified')? Write the additional extraction logic.")] }),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:80},children:[s("Compare the NLP challenges in Northgate's transaction narratives versus Meridian's invoice descriptions on four dimensions: (a) text length and vocabulary, (b) presence of structured vs. free-text fields, (c) language ambiguity, and (d) regulatory relevance of extracted entities. What does this comparison imply about whether a single NLP pipeline can serve both retail and commercial TM monitoring?")]}),
  ]),

  exBox([
    new Paragraph({spacing:{after:80},children:[new TextRun({text:"Part E — Project Sentinel: LLM-Assisted SAR Drafting  [Synthesis / Stretch]",font:"Arial",size:20,bold:true,color:MID_BLUE})]}),
    new Paragraph({spacing:{after:80},children:[s("LINK-CROSS-001 has fired. The analyst has confirmed both NRB-STRUCT-001 (six Northgate Accounts) and TBML-INVOICE-001 (Meridian) are active. The investigation has revealed that the six Northgate mule accounts and Meridian's two directors share overlapping beneficial ownership. The case is now a combined investigation touching retail structuring, trade-based money laundering, and beneficial ownership concealment. The analyst must draft a SAR that covers all three typologies coherently. Write a prompt for a hypothetical LLM-assisted SAR drafting tool — following the guidance in Section 7.6.3 — that would produce a SAR narrative meeting the NCA's quality expectations.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:60},children:[s("Write the prompt. Your prompt must specify: the role the LLM should adopt, the facts it should incorporate (drawn from the Northgate and Meridian scenario data accumulated across Chapters 1–7), the structure of the SAR narrative it should produce (opening, body, typology identification, action taken), and any content it must explicitly not generate (for example, speculation about outcomes or legal conclusions).")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:80},children:[s("Under SR 26-2 (US) and PRA SS1/23 (UK), the use of a generative AI model to produce regulatory submissions is a model governance event — not merely a productivity tool. Write a 150-word governance note that Project Sentinel's model risk manager could include in the model inventory entry for the LLM-assisted SAR drafting tool. Your note must address: model purpose, the human review requirement, the key model limitation (hallucination risk in a regulatory context), and the sign-off process.")]}),
    new Paragraph({spacing:{after:80},children:[si("In Chapter 8, ML triage is applied to the alert population this scenario set generates. The combined Northgate/Meridian alert will be among the highest-priority outputs.")]}),
  ]),
  spacer(),

  h2("Further Reading and Research Topics"),
  num("The FFIEC BSA/AML Examination Manual, Section 7 ('Suspicious Activity Reporting') sets out the US examiner's standard for SAR quality. [AUTHOR FLAG: The original text cited 'FinCEN's Financial Crime Guide FCG 3.2' as the UK equivalent — FCG 3.2 is not a recognised document identifier for any regulatory authority. The UK equivalent is NCA SAR guidance or JMLSG Part I §6. Please confirm the intended reference and replace with the correct document name and URL.] Identify three requirements that are present in one jurisdiction's standard but absent or less prescriptive in the other."),
  num("Read the NCA's 'SARs in Action' series (available at nationalcrimeagency.gov.uk). These case studies describe how SARs filed by UK banks have contributed to criminal convictions. Select one case study that involves trade-based money laundering and identify: what transaction monitoring flag triggered the SAR, what additional investigation the bank conducted, and what information in the SAR was decisive for law enforcement."),
  num("Research Question: 'Coverage bias' in a Transaction Monitoring Framework means that certain money laundering typologies are systematically underdetected — not because they are rare, but because the programme was not designed to detect them. Review the FATF's 2021 report 'Opportunities and Challenges of New Technologies for AML/CFT'. Which three typologies does the FATF identify as most systematically underdetected in current TM programmes, and what technological approach does it propose for each?"),
  num("Design challenge: Write a one-page 'typology gap register' for the Northgate programme as it stands at the end of Chapter 7 (NRB-STRUCT-001 + TBML-INVOICE-001 + LINK-CROSS-001). Format: Typology | FATF Reference | Coverage Status (Detected / Partially Detected / Not Detected) | Gap Risk Rating | Proposed Remediation. Include at least six typologies."),
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
    headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } }, children: [new TextRun({ text: "Applied AML Analytics  |  Chapter 7", font: "Arial", size: 18, color: MID_BLUE })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: "Arial", size: 18, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "888888" })] })] }) },
    children
  }]
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/Book1_Chapter7.docx', buf); console.log('Done: Book1_Chapter7.docx'); });

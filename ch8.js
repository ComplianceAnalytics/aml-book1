const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat, ImageRun
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
const codeBox=(label,lines)=>new Table({width:{size:9026,type:WidthType.DXA},columnWidths:[9026],rows:[new TableRow({children:[new TableCell({borders:cb(ACCENT_BLUE),width:{size:9026,type:WidthType.DXA},shading:{fill:"F0F4FF",type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:200,right:200},children:[new Paragraph({spacing:{after:100},children:[s(label,{bold:true,color:MID_BLUE})]}), ...lines.map(l=>new Paragraph({spacing:{after:40},children:[new TextRun({text:l,font:"Courier New",size:18,color:"1A2856"})]}))]})]})]});
const outputBox=(label,lines)=>new Table({width:{size:9026,type:WidthType.DXA},columnWidths:[9026],rows:[new TableRow({children:[new TableCell({borders:cb("2E7D32"),width:{size:9026,type:WidthType.DXA},shading:{fill:"F1F8E9",type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:200,right:200},children:[new Paragraph({spacing:{after:100},children:[s(label,{bold:true,color:"2E7D32"})]}), ...lines.map(l=>new Paragraph({spacing:{after:40},children:[new TextRun({text:l,font:"Courier New",size:18,color:"1A3300"})]}))]})]})]});
const imageBlock=(imagePath,w,h)=>new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:120,after:160},children:[new ImageRun({data:fs.readFileSync(imagePath),transformation:{width:w,height:h}})]});
const tkBox=(items)=>box([new Paragraph({spacing:{after:80},children:[new TextRun({text:"Key Takeaways",font:"Arial",size:22,bold:true,color:"1A7A4A"})]}), ...items.map(t=>new Paragraph({numbering:{reference:"bullets",level:0},spacing:{after:80},children:[s(t)]}))], "E6F9F0","1A7A4A");

const tbl=(headers,rows,widths)=>{
  const hR=new TableRow({children:headers.map((h,i)=>new TableCell({borders:cb("999999"),width:{size:widths[i],type:WidthType.DXA},shading:{fill:DARK_NAVY,type:ShadingType.CLEAR},margins:{top:80,bottom:80,left:120,right:120},children:[new Paragraph({children:[s(h,{bold:true,color:WHITE})]})]}))} );
  const dR=rows.map((row,ri)=>new TableRow({children:row.map((cell,ci)=>new TableCell({borders:cb("CCCCCC"),width:{size:widths[ci],type:WidthType.DXA},shading:{fill:ri%2===0?"FFFFFF":LIGHT_GREY,type:ShadingType.CLEAR},margins:{top:80,bottom:80,left:120,right:120},children:[new Paragraph({children:[s(cell)]})]}))}));
  return new Table({width:{size:9026,type:WidthType.DXA},columnWidths:widths,rows:[hR,...dR]});
};

const children=[
  h1("Chapter 8: Alert Triage and Machine Learning"),
  spacer(),
  calloutM("Learning Objectives — By the end of this chapter you will be able to:",[
    num("Identify the main sources of noise and false positives in TM alert populations and explain their operational impact."),
    num("Describe the alert lifecycle — hibernation, escalation, and expiration — and the criteria governing each transition."),
    num("Apply Isolation Forest to score and rank a TM alert population by anomalousness."),
    num("Compare ML-based triage to rule-based triage on the Northgate alert population and explain the trade-offs."),
  ]),
  spacer(),

  h2("8.1 Business Context: Alert Volume Is the Operational Problem"),
  callout("Terminology Note — Alert Triage vs Event Triage","This chapter is titled 'Alert Triage' because it focuses on scoring and ranking alerts — discrete outputs of the TM system — before they reach an analyst. The frontier of AML analytics also includes event triage, which operates at an earlier stage: scoring individual transactions or events before they are aggregated into alerts, enabling the system to suppress low-risk events before they ever generate alert volume. The distinction matters architecturally. Alert triage reduces the analyst's queue; event triage reduces the queue before it forms. Both are addressed in the Knowledge Document's frontier model (Entity Consolidation + Unsupervised ML + Graph/Network Analysis + Event Triage). This chapter focuses on alert triage using unsupervised ML; event-level and graph-level techniques are introduced in Chapter 10.","E8EEFF"),
  spacer(),
  body("Transaction monitoring generates alerts. That is what it is designed to do. The structural challenge is that, at most institutions, the large majority of those alerts do not result in a SAR. Alert noise rates vary significantly by scenario, threshold, segmentation, and data quality — see Chapter 6 §6.3 for the analytical treatment. What the frequently cited high-noise-rate statistics capture is a real phenomenon: at most institutions, the majority of analyst time is spent on alerts that do not ultimately warrant a SAR. The precise rate is institution-specific, not an industry constant."),
  body("The question is not what the number is, but why it is so high — and what the institution is doing about it. Chapters 5 and 6 addressed two of the main causes: poor segmentation and threshold miscalibration. This chapter addresses the operational symptom: a queue of alerts that arrives faster than analysts can review them with the diligence each case deserves."),
  body("A bank with a million active accounts and ten monitoring scenarios might generate 5,000 alerts per month. If most are not SAR-worthy, analysts spend the vast majority of their time reviewing transactions that have nothing to do with money laundering — while the alerts that do matter are buried in the queue. Machine learning triage addresses this by scoring and ranking alerts before they reach an analyst, surfacing the most anomalous cases to the top of the queue so that analysts work in order of priority rather than in order of arrival. This chapter explains how to build such a model and — equally important — what its limitations are."),

  h2("8.2 Sources of Noise and False Positives"),
  body("Understanding where false positives come from is the first step to reducing them. The main sources are:"),
  bulletMixed([sb("Threshold miscalibration: "),s("The most common cause. A threshold set too low — because analysts want to avoid missing anything — generates enormous volumes of alerts for legitimate behaviour. Chapter 6 addressed this directly through hypergeometric sampling and responsiveness analysis.")]),
  bulletMixed([sb("Segmentation mismatch: "),s("A customer monitored against the wrong peer group will be flagged for behaviour that is normal for their actual profile. A business account monitored against personal account thresholds will generate alerts for every normal transaction. Chapter 5 addressed this through segmentation.")]),
  bulletMixed([sb("Data quality errors: "),s("Miscoded transaction types, missing merchant category codes, duplicated records, and incorrect account flags all generate spurious alerts. A missing merchant category code is not random noise — it tells you something about the data pipeline. The triage model should treat missing values as informative rather than as gaps to be imputed away: a 'No Data is Bad Data' principle applied to the alert population. A scenario that fires because a field is missing has identified a data quality problem, not a suspicious customer. The only structural remedy is upstream data quality; the triage model can flag DQ-driven alerts for routing to a data remediation workflow rather than an analyst queue. Data quality is addressed further in Chapter 9.")]),
  bulletMixed([sb("Legitimate but unusual behaviour: "),s("Customers whose behaviour is genuinely unusual — seasonal workers, event organisers, people who have recently changed financial circumstances — may generate alerts that are explainable but require investigation time to resolve.")]),
  bulletMixed([sb("Scenario design weaknesses: "),s("Scenarios that do not incorporate context — account age, customer type, relationship history — alert on superficial patterns that an experienced analyst would dismiss in seconds. Better scenario design reduces this, but ML triage is a more scalable solution.")]),
  spacer(),

  h2("8.3 The Alert Lifecycle"),
  body("Not every alert needs to be reviewed immediately. The alert lifecycle manages the flow of alerts through the system, ensuring that analyst time is allocated to the most time-sensitive and most suspicious cases. The conclusion of each review stage is a disposition — a documented decision, with reasons and evidence, determining whether the alert or case is suspicious. The disposition is the audit record of the analyst's judgement; it must be specific enough to withstand regulatory scrutiny."),
  spacer(),
  tbl(
    ["Status","Description","Criteria"],
    [
      ["New","Alert has been generated by the TM system and is awaiting initial review.","All alerts begin here."],
      ["In Review (L1)","Alert is being assessed by a first-line analyst to determine whether it warrants escalation.","Assigned from the New queue, typically by priority score."],
      ["Hibernated","Alert has been deferred because additional information is expected (e.g., a pending customer response, a batch data feed, or a related alert still being investigated).","L1 analyst determines that the alert cannot be fairly assessed without further data."],
      ["Escalated (L2/L3)","Alert has been escalated to a senior analyst or investigator for full case investigation.","L1 analyst determines the alert is 'interesting' (L2) or 'SAR-worthy' (L3)."],
      ["Closed — No Action","Alert reviewed and found to have a satisfactory explanation. No further action required.","L1 disposition: not suspicious."],
      ["Expired","Alert has reached its maximum age without being reviewed or escalated, and the time window for effective investigation has passed.","System-enforced age limit, typically 30–45 days for most scenarios."],
      ["SAR Filed","A Suspicious Activity Report has been filed as a result of the investigation.","L3 disposition confirmed by compliance officer."],
    ],
    [1800,4226,3000]
  ),
  spacer(),
  body("Alert fatigue is what happens when analysts spend so much time reviewing false positives that they begin to close alerts without proper scrutiny. It is not a personal failing — it is a systemic risk that arises from poor triage and inadequate resource allocation. Regulators have specifically cited alert fatigue (from noisy alerts) as a root cause in several major AML enforcement actions."),

  callout("Risk Perspective — Alert Expiration","Alert expiration is a regulatory red flag. An institution with a material population of expired alerts — alerts that aged out without review — has a structural capacity problem that cannot be defended by citing resource constraints. Examiners will ask: how many alerts expired in the review period? Which scenarios produced them? What was the estimated SAR rate in the expired population? If high-risk scenarios are producing expired alerts, the institution has, in effect, switched off its own monitoring for those customers. This finding can escalate from an operational deficiency to a supervisory concern about programme adequacy.","FFF3E6"),
  callout("Risk Perspective — Alert Fatigue","Alert fatigue is detectable. Warning signs include: rising SAR rates in escalated cases (suggesting analysts are only escalating when forced to), falling average review times (suggesting alerts are not being properly investigated), and a declining ratio of L2 escalations to L1 closures. Monitor these metrics proactively — and report them to the governance forum, not just to operations management.","FFF3E6"),
  spacer(),

  h2("8.4 Unsupervised Machine Learning for Alert Triage"),
  body("Supervised machine learning — training a model on labelled examples of suspicious and non-suspicious alerts — is the natural first instinct for triage. The problem is labels. Confirmed SAR cases represent a tiny fraction of the total alert population, and they reflect only the suspicious activity that was detected. They tell us nothing about the activity that was missed."),
  body("Unsupervised machine learning does not require labels. It identifies anomalies — alerts that are statistically unusual relative to the rest of the population — without needing to know in advance what 'suspicious' looks like. This is a much better fit for AML, where the ground truth is always incomplete."),

  h3("8.4.1 Isolation Forest"),
  callout("From School to Practice","You may have encountered anomaly detection in your coursework as a problem of finding outliers in a dataset. Isolation Forest is one of the most effective algorithms for this task. It works by randomly partitioning the feature space using decision trees. Normal data points require many partitions to isolate because they are surrounded by similar points. Anomalous points are isolated in very few partitions because they are different from everything else. In AML triage, a short isolation path means a suspicious alert — the algorithm assigns it a high anomaly score, and it rises to the top of the analyst queue.","E8F4E8"),
  spacer(),
  body("Isolation Forest has several properties that make it particularly well-suited to AML triage:"),
  bullet("It makes no assumptions about the distribution of the data — AML transaction features are rarely Gaussian."),
  bullet("It scales well to large datasets — important when an alert population may run to tens of thousands."),
  bullet("The contamination parameter allows the analyst to specify the expected proportion of anomalies, which maps naturally to the expected SAR rate from calibration."),
  bullet("Its results are relatively stable and consistent, which supports the audit trail requirements of model governance."),
  spacer(),
  body("The core implementation in Python is straightforward. The key decisions are: which features to include, how to handle missing values, and what contamination rate to set."),
  spacer(),
  tbl(
    ["Language","Code"],
    [
      ["Python (Isolation Forest + SHAP)",
"import pandas as pd\nimport numpy as np\nfrom sklearn.ensemble import IsolationForest\nimport shap\n\n# Generate synthetic alert dataset (200 alerts, 12% SAR rate)\nnp.random.seed(42)\nn = 200\ndf = pd.DataFrame({\n    'alert_id': range(1, n+1),\n    'transaction_amount': np.random.lognormal(9, 0.8, n),\n    'transaction_count_30d': np.random.poisson(4, n) + 1,\n    'account_age_months': np.random.exponential(36, n).astype(int) + 1,\n    'counterparty_count': np.random.poisson(2, n) + 1,\n    'crr_score': np.random.randint(1, 5, n),\n    'days_since_last_alert': np.random.exponential(45, n).astype(int),\n    'is_sar': np.random.binomial(1, 0.12, n)\n})\n\n# Spike SAR cases with anomalous features\nsar_idx = df[df['is_sar']==1].index\ndf.loc[sar_idx, 'transaction_amount'] *= np.random.uniform(1.5, 3.0, len(sar_idx))\ndf.loc[sar_idx, 'counterparty_count'] += np.random.randint(2, 6, len(sar_idx))\ndf.loc[sar_idx, 'days_since_last_alert'] = np.random.randint(1, 10, len(sar_idx))\n\n# Features for model\nfeatures = ['transaction_amount','transaction_count_30d','account_age_months',\n            'counterparty_count','crr_score','days_since_last_alert']\nX = df[features]\n\n# Fit Isolation Forest\niforest = IsolationForest(contamination=0.12, random_state=42)\ndf['anomaly_score'] = -iforest.score_samples(X)  # higher = more anomalous\n\n# Rank and evaluate\ntop20 = df.nlargest(20, 'anomaly_score')\nprint(f'SAR rate in top 20: {top20.is_sar.mean():.1%}')\nprint(f'SAR rate overall: {df.is_sar.mean():.1%}')\n\n# SHAP explanation for top alert\nexplainer = shap.Explainer(iforest, X)\nshap_values = explainer(X.iloc[[df['anomaly_score'].idxmax()]])\nshap.plots.waterfall(shap_values[0])"],
      ["R (isotree)","library(isotree)\nlibrary(ggplot2)\n\nset.seed(42)\nn <- 200\ndf <- data.frame(\n  alert_id = 1:n,\n  transaction_amount = rlnorm(n, 9, 0.8),\n  transaction_count_30d = rpois(n, 4) + 1,\n  account_age_months = ceiling(rexp(n, 1/36)),\n  counterparty_count = rpois(n, 2) + 1,\n  crr_score = sample(1:4, n, replace=TRUE),\n  days_since_last_alert = ceiling(rexp(n, 1/45)),\n  is_sar = rbinom(n, 1, 0.12)\n)\n\n# Spike SAR features\nsar_rows <- which(df$is_sar == 1)\ndf$transaction_amount[sar_rows] <- df$transaction_amount[sar_rows] * runif(length(sar_rows), 1.5, 3)\ndf$counterparty_count[sar_rows] <- df$counterparty_count[sar_rows] + sample(2:6, length(sar_rows), replace=TRUE)\ndf$days_since_last_alert[sar_rows] <- sample(1:10, length(sar_rows), replace=TRUE)\n\nfeatures <- c('transaction_amount','transaction_count_30d','account_age_months',\n              'counterparty_count','crr_score','days_since_last_alert')\n\n# Fit Isolation Forest\nmodel <- isolation.forest(df[, features], ntrees=100, nthreads=1)\ndf$anomaly_score <- predict(model, df[, features])\n\n# Top 20 and SAR rate\ntop20 <- df[order(-df$anomaly_score)[1:20], ]\ncat('SAR rate in top 20:', mean(top20$is_sar), '\\n')\ncat('Overall SAR rate:', mean(df$is_sar), '\\n')"],
    ],
    [1000,8026]
  ),
  spacer(),

  callout("Pedagogical Note — Synthetic Data and Guaranteed Separation","In the code above, SAR-worthy alerts are deliberately constructed with elevated feature values ('spiked'). This guarantees that SAR cases are more anomalous than non-SAR cases — which is the outcome the exercise is designed to demonstrate. In production data, suspicious accounts may not be the most anomalous by simple feature magnitude. A sophisticated mule operation may transact at volumes indistinguishable from a legitimate cash-intensive business, with the pattern of behaviour — timing, counterparty structure, layering sequence — carrying the signal rather than the raw amounts. The exercise illustrates the method; real-world model performance will depend heavily on the quality of the features and the nature of the typology being detected.","FFF3E6"),
  callout("R Users — Explainability in Section 8.4.2","The Python code in Section 8.4.1 includes SHAP for per-alert feature attribution. The R code above does not include a SHAP equivalent. R users working through Exercise 8.1 Part C should either: (a) use the Python implementation for the SHAP section; or (b) use variable importance from the isotree package (predict(model, df[, features], type='avg_depth') combined with a manual feature contribution analysis). The iml package (model-agnostic interpretation for R) is a more complete alternative that provides Shapley-value approximations for any model class.","E8EEFF"),
  spacer(),

  h3("8.4.2 Explainability with SHAP"),
  body("A triage model that surfaces an alert at the top of the queue must be able to explain why. An analyst who sees a high anomaly score but no explanation cannot investigate effectively — and a regulator who asks why an alert was prioritised deserves a coherent answer."),
  body("SHAP (SHapley Additive exPlanations) provides model-agnostic feature importance scores for individual predictions. For each alert, SHAP tells you which features contributed most to the anomaly score and in which direction. An alert with a high score driven by 'transaction_amount' and 'counterparty_count' tells the analyst exactly where to focus."),
  body("Explainability is not optional in AML. The SR 26-2 (US) and PRA SS1/23 (UK) requirements for model documentation explicitly require that model outputs be interpretable and that limitations be understood. A black-box triage model that cannot explain its own decisions will not survive a model validation review."),

  h2("8.5 Applying ML Triage to the Northgate Scenario"),
  body("The 200-alert synthetic dataset represents the output of running the NRB-STRUCT-001 scenario on the 500-customer population from Chapter 5, at the USD 7,500 threshold established in Chapter 6. Each alert corresponds to one customer account that breached the rolling 30-day cash threshold. The 12% SAR rate — 24 of the 200 alerts — is calibrated to match the expected SAR rate from the Chapter 6 hypergeometric analysis. This continuity is intentional: the same customer population, the same scenario, the same threshold, now being triaged by a machine learning model."),
  body("We apply Isolation Forest with contamination set to 0.12 (matching the known SAR rate from calibration). The features are: transaction amount, transaction count in the past 30 days, account age, counterparty count, CRR score, and days since last alert."),
  body("The expected result is that Isolation Forest surfaces a materially higher SAR rate in the top 20 alerts than a simple rule-based ranking (sorting by transaction amount). In the worked example in the solutions manual, Isolation Forest achieves a top-20 SAR rate of approximately 45–55%, compared to 20–25% for amount-based sorting. This difference represents a significant reduction in analyst effort per confirmed SAR."),
  callout("Risk Perspective","A higher SAR rate in the top 20 does not mean the model is detecting more money laundering — it means it is prioritising alerts more efficiently. The remaining 180 alerts still need to be reviewed. Triage does not reduce the total workload; it allocates it more intelligently. This distinction matters when communicating model value to management and to examiners.","FFF3E6"),
  body("A further limitation is visible in the Northgate case study itself: Isolation Forest scores individual accounts in isolation. It can identify that account A7 is anomalous relative to the alert population — but it cannot see that A7, A8, A9, A10, A11, and A12 are part of the same coordinated mule network, transacting in a structured pattern designed to stay below individual detection thresholds. Network-level detection — identifying connected components, shared counterparties, and fund-flow paths across accounts — requires graph analysis techniques that operate above the individual-alert level. This is the subject of Chapter 10, which extends the Northgate case study to the network."),
  spacer(),

  h2("8.6 Colab Walkthrough: ML Triage on Three Rules"),
  body("By Chapter 8 the system built across Chapters 3–7 generates alerts from three rules. The ML triage layer runs on top of all of them — scoring each alert by anomalousness regardless of which rule triggered it. The code below is the core of the Chapter 8 Colab notebook. It builds the feature matrix from the alert pool and fits Isolation Forest."),
  codeBox("📊 Colab Preview: Isolation Forest Triage on the Alert Pool", [
    "import pandas as pd",
    "import numpy as np",
    "from sklearn.ensemble import IsolationForest",
    "",
    "# Load data (generated in Section 0)",
    "df_txn  = pd.read_csv('nb_transactions.csv', parse_dates=['txn_date'])",
    "df_cpty = pd.read_csv('nb_counterparties.csv')",
    "HIGH_RISK_COUNTRIES = ['KP', 'IR', 'MM', 'SY', 'YE', 'AF', 'LY']",
    "",
    "# Rule alerts (apply_rule_1/2/3 already defined in earlier cells)",
    "alerts_r1 = apply_rule_1(df_txn)",
    "alerts_r2 = apply_rule_2(df_txn)",
    "alerts_r3 = apply_rule_3(df_txn, df_cpty, HIGH_RISK_COUNTRIES)",
    "all_alerted = (set(alerts_r1['account_id']) |",
    "               set(alerts_r2['account_id']) |",
    "               set(alerts_r3['account_id']))",
    "",
    "# Build feature matrix for ML scoring",
    "feats = df_txn.groupby('account_id').agg(",
    "    total_cash_in = ('amount',",
    "        lambda x: x[df_txn.loc[x.index,'txn_type']=='CASH_IN'].sum()),",
    "    txn_count     = ('txn_id', 'count'),",
    "    cash_ratio    = ('txn_type', lambda x: (x=='CASH_IN').mean()),",
    ").fillna(0)",
    "hr_ids = set(df_cpty[df_cpty['country_code'].isin(HIGH_RISK_COUNTRIES)]['counterparty_id'])",
    "feats['hr_ratio'] = df_txn.groupby('account_id')['counterparty_id'].apply(",
    "    lambda x: x.isin(hr_ids).mean()).fillna(0)",
    "feats['rule1_flag'] = feats.index.isin(alerts_r1['account_id']).astype(int)",
    "feats['rule2_flag'] = feats.index.isin(alerts_r2['account_id']).astype(int)",
    "feats['rule3_flag'] = feats.index.isin(alerts_r3['account_id']).astype(int)",
    "",
    "alert_feats = feats[feats.index.isin(all_alerted)].copy()",
    "feature_cols = ['total_cash_in','txn_count','cash_ratio','hr_ratio',",
    "                'rule1_flag','rule2_flag','rule3_flag']",
    "X = alert_feats[feature_cols].values",
    "",
    "# Fit Isolation Forest — contamination = estimated fraction of genuine anomalies",
    "iso = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)",
    "alert_feats['if_score'] = iso.score_samples(X)  # lower = more anomalous",
    "",
    "ranked = alert_feats.sort_values('if_score').reset_index()",
    "ranked['rank'] = ranked.index + 1",
    "print('Top 10 accounts by anomaly score (lower if_score = more anomalous):')",
    "print(ranked[['rank','account_id','total_cash_in','cash_ratio',",
    "              'hr_ratio','rule1_flag','rule2_flag','rule3_flag','if_score']].head(10).to_string(index=False))",
  ]),
  outputBox("▶ Real Output — Isolation Forest Rankings (all 392 alerted accounts)", [
    "Alerted accounts — R1: 47, R2: 357, R3: 265",
    "Union (unique accounts in alert pool): 392",
    "",
    "Mule account rankings (rank 1 = most anomalous):",
    "account_id  rank    if_score",
    "   ACC0003     1   -0.767447",
    "   ACC0005     2   -0.755597",
    "   ACC0002     3   -0.736023",
    "   ACC0001     4   -0.732443",
    "   ACC0004     5   -0.723678",
    "   ACC0006     6   -0.720158",
  ]),
  imageBlock('/sessions/intelligent-blissful-clarke/mnt/aml-book1/ch8_isolation_forest.png', 400, 267),
  body("The Isolation Forest ranks all six mule accounts in positions 1–6 out of 392 alerted accounts. Their anomaly scores are substantially more negative than the rest of the alert pool — a direct consequence of the unique combination of features: 100% cash-in ratio, high transaction volume, and multiple rule flags. The chart shows the score distribution across all alerted accounts, with mule accounts marked in red. Exercise 8.1 asks you to interpret these results: what would it mean if a mule account did not appear at the top — and what does that tell you about the feature design choices?"),
  spacer(),

  h2("8.7 Risk Considerations"),
  bulletMixed([sb("Over-reliance on ML scores: "),s("Analysts must not treat a high anomaly score as a finding. It is a signal, not a conclusion. The investigation — gathering evidence, assessing the customer's explanation, making the L1/L2/L3 disposition — must still be conducted properly.")]),
  bulletMixed([sb("Model drift: "),s("Money launderers adapt. A mule network that becomes aware that high counterparty counts attract attention will diversify. Over time, the feature distributions that the model learned will shift, and the model's discriminatory power will degrade. Models must be monitored for drift and retrained periodically.")]),
  bulletMixed([sb("Regulatory expectations for model governance: "),s("An ML triage model is a model under SR 26-2 (US) and PRA SS1/23 (UK). It requires validation against the five pillars covered in Chapter 9: conceptual soundness, data integrity, performance testing, sensitivity analysis, and ongoing monitoring. 'We just use it for prioritisation' is not a defence. The triage model is deployed by the 1.5th Line (Operations), validated by the 2nd Line (Model Risk Management / FinCrime Risk), and subject to independent review by the 3rd Line (Audit/IMR). These governance relationships mirror those of any other AML model and are covered in full in Chapter 9.")]),
  bulletMixed([sb("Algorithmic bias: "),s("If the training data (even implicitly, through feature selection) encodes demographic patterns, the model may flag customers in certain groups at higher rates. CRR score, account age, and counterparty count can all carry demographic correlations. Bias testing is part of model validation.")]),
  spacer(),

  tkBox([
    "Most TM alerts at retail banks do not result in SARs. The alert-to-SAR ratio is scenario-specific, not an industry constant — its precision depends on the quality of segmentation, threshold calibration, and data. Triage addresses the operational symptom; Chapters 5 and 6 addressed the structural causes.",
    "The alert lifecycle — new, in review, hibernated, escalated, expired, SAR-filed — manages alert flow and governs analyst prioritisation. Alert expiration is a regulatory red flag. Alert fatigue is a systemic risk detectable through review-time and escalation-ratio metrics.",
    "Unsupervised ML (Isolation Forest) scores alerts by anomalousness without requiring labelled training data, making it well-suited to AML where the ground truth is always incomplete.",
    "Permutation importance provides a model-agnostic proxy for feature contribution: shuffle each feature, measure how far mule accounts drop in the ranked queue. Features whose shuffling most degrades recall are the model's load-bearing pillars.",
    "ML triage models require model governance: inventory, documentation, validation against the five pillars (Chapter 9), and 2nd/3rd Line oversight. 'We just use it for prioritisation' is not a defence.",
    "This chapter covers alert triage. The frontier also includes entity-level and graph-level detection — identifying connected networks rather than isolated anomalous accounts. These techniques are introduced in Chapter 10.",
  ]),
  spacer(),

  exBox([
    new Paragraph({spacing:{after:100},children:[new TextRun({text:"Exercise 8.1 — ML Triage for the Northgate Alert Population  [Advanced]",font:"Arial",size:22,bold:true,color:"2E75B6"})]}),
    new Paragraph({spacing:{after:80},children:[sb("Recap: "),s("In Exercise 7.1 you assessed the coverage of the three-rule Northgate scenario set. Now apply ML triage to the alert pool those rules generate.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Colab Extension: "),s("Section 8.6 showed the Isolation Forest codebase. The Chapter 8 Colab notebook pre-loads all three rule functions and the Northgate dataset, builds the seven-feature matrix, and fits the model. Your job is to interpret the output — not to write the model code. The notebook guides you through Parts A–D. Part E (Extended) invites you to run the contamination sensitivity analysis and report what changes.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part A — Triage Output: "),s("Run Section 1 in the Chapter 8 notebook. Report: how many accounts are in the combined three-rule alert pool? List the top 6 accounts by anomaly score with their feature values (total_cash_in, cash_ratio, hr_ratio, rule flags). Do all six known Northgate mule accounts appear in positions 1–6?")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part B — Feature Interpretation: "),s("For the top-ranked account (rank 1), describe in plain English why Isolation Forest assigned it the lowest (most anomalous) score. Reference at least two of the seven features and explain what each indicates in an AML context. Write this as a one-paragraph analyst note suitable for a case file.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part C — Contamination Parameter: "),s("The notebook's Section 2 runs the contamination sensitivity analysis (contamination 0.01 to 0.20). Report: do the mule account ranks change materially as contamination increases? What contamination value would you set if your bank's compliance team estimated that 3% of all alerted accounts represent genuine suspicious activity?")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part D — Model Governance: "),s("Write a one-paragraph model purpose statement for the Isolation Forest triage model, suitable for inclusion in a model inventory. Include: purpose, methodology, inputs (name all seven features), outputs, and one key limitation. The statement should be understandable to a model validator who has not read this book.")]}),
    new Paragraph({spacing:{after:80},children:[si("See the Instructor's Solutions Manual for worked answers and sample governance language. In Chapter 9, we validate the full model suite — the rule, the segmentation, and this triage model — against the five-pillar SR 11-7 / PRA CS 6/23 framework.")]}),
  ]),

  exBox([
    new Paragraph({spacing:{after:100},children:[new TextRun({text:"Part E — Permutation Importance and Feature Design  [Applied / Out-of-the-Box]",font:"Arial",size:20,bold:true,color:MID_BLUE})]}),
    new Paragraph({spacing:{after:80},children:[s("Section 2 of the notebook runs a permutation importance analysis: each feature is shuffled in turn, the model is re-fitted, and the average mule rank is recorded. Features whose shuffling most degrades mule recall are the model's load-bearing pillars.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:60},children:[s("Which two features have the highest permutation importance (i.e., shuffling them most damages mule recall)? Explain in one sentence why each feature is load-bearing given what you know about the Northgate mule accounts.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:60},children:[s("If rule1_flag has low permutation importance, does that mean NRB-STRUCT-001 is a poor rule? Argue for and against this conclusion in no more than 100 words, considering how the flag interacts with the continuous features.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:80},children:[s("Propose one additional feature you would add to the next version of the model (beyond the seven already in use). Describe: (a) how it would be computed from the Northgate dataset, (b) which mule behaviour it would capture that the current features do not, and (c) what data quality risks it introduces.")]}),
  ]),

  exBox([
    new Paragraph({spacing:{after:80},children:[new TextRun({text:"Part F — Project Sentinel: Governance Forum  [Synthesis / Stretch]",font:"Arial",size:20,bold:true,color:MID_BLUE})]}),
    new Paragraph({spacing:{after:80},children:[s("Project Sentinel's data scientist presents the triage model to the governance forum (1st Line compliance officer, 2nd Line model risk manager, Head of Financial Crime).")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:60},children:[s("The compliance officer asks: 'If an account scores low on the Isolation Forest triage model, can the analyst deprioritise it?' Write the data scientist's answer — technically accurate, regulatory sound, and no longer than 100 words.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:80},children:[s("The model risk manager asks: 'What is the single biggest model risk in using Isolation Forest for AML alert triage, and what would you do to mitigate it?' Write the data scientist's answer in no more than 150 words. Your answer must reference at least one of the five pillars from Chapter 9's preview and explain what governance action would be required before the model can be used to deprioritise any alert.")]}),
    new Paragraph({spacing:{after:80},children:[si("See the Instructor's Solutions Manual for worked answers and sample governance document language. In Chapter 9, we validate the full model suite against the five-pillar framework.")]}),
  ]),
  spacer(),

  h2("8.8 Supervised Machine Learning: End-to-End Workflow"),
  body("Unsupervised ML (Isolation Forest) does not require labelled data. Supervised ML does — and with the right data and careful preparation, it offers higher discriminatory power. This section covers the end-to-end supervised ML workflow for AML event triage."),
  calloutM("Supervised ML Workflow for AML Event Triage", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Stage 1: Feature Engineering Design", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [s("Features are the variables the model uses to score each alert or event. In AML, features are like rules with thresholds set statistically rather than by human judgement. A feature such as 'value of cash deposits in the past 30 days' is a continuous variable that feeds the model — the model learns what values of that feature are associated with SAR outcomes. Good feature engineering is the single most important determinant of model performance; no algorithm compensates for poorly designed features. The ~30-feature framework in Section 8.10 provides a standard starting point.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Stage 2: Data Preparation and SAR Cleansing", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [s("Raw SAR data is the primary positive-label source. It requires cleansing before use (see Section 8.9). The negative class (non-SAR) is selected from reviewed alerts closed as non-suspicious — with care to exclude cases where the non-suspicious conclusion was itself an error. Class imbalance must be addressed: SAR cases are rare. Standard approaches include SMOTE (synthetic minority oversampling), class-weighting, and threshold adjustment during scoring.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Stage 3: Model Training and Hyperparameter Tuning", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [s("Split the dataset into training (70%), validation (15%), and holdout test (15%) sets. Use the training set to fit the model and the validation set to tune hyperparameters (e.g., learning rate, max depth, n_estimators for XGBoost). Cross-validation on the training set reduces overfitting. The holdout test set is used only once — for final performance evaluation.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Stage 4: Output and Feedback Loop", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [s("The model outputs a probability score for each alert (0 = not suspicious, 1 = suspicious). Alerts are ranked by score and routed to analysts. As analysts complete reviews and reach dispositions, those outcomes feed back into the training dataset for the next model iteration. The feedback loop is the mechanism by which the model improves over time — but it requires careful management: if the feedback loop introduces the same biases present in the original training data, the model will learn to replicate those biases more efficiently. Governance of the feedback loop is a model risk concern.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "From raw data to model output: raw transaction data → feature engineering (compute 30-day aggregates, derive ratios, join reference data) → feature matrix → model training → probability scores → analyst queue ranked by score → dispositions → feedback loop → model retraining.", font: "Arial", size: 20, color: "222222", italics: true })] }),
  ], "E8EEFF"),
  spacer(),

  h2("8.9 SAR Data Cleansing for Supervised ML"),
  body("SAR data is the primary source of positive labels for supervised ML in AML. Its quality directly determines model quality — and it is structurally noisy. Three types of noise must be addressed before any supervised training:"),
  calloutM("SAR Data Cleansing: Three Noise Types", [
    new Paragraph({ spacing: { after: 80 }, children: [sb("Noise Type 1 — Defensive SARs: "), s("Filed 'just in case' with no positive link to the features or typologies the model is designed to detect. A defensive SAR on a structuring model filed because a customer is PEP (not because of deposit patterns) contaminates the structuring model's training data. Cleansing approach: classify SARs by typology match; exclude SARs where the filing rationale does not correspond to the scenario's target typology.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [sb("Noise Type 2 — Stale or Superseded SARs: "), s("Filed on behaviour that was later explained (continuation filing not accompanied by new evidence), or on accounts subsequently closed as low-risk after a full EDD review. Cleansing approach: apply a recency filter; cross-reference SAR population against subsequent CDD/EDD outcomes.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [sb("Noise Type 3 — Missing Positive Link Between SAR and Features: "), s("SAR filed based on information not available in the transactional feature set (e.g., a law enforcement tipoff). The model cannot learn from these cases — the SAR outcome is not explained by the available features. Cleansing approach: exclude SARs where the filing narrative references information not representable in the feature matrix.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "After cleansing, the remaining SAR population is the 'clean positives' dataset. Document the cleansing decisions: what criteria were applied, how many SARs were excluded and why. This documentation is a model governance artefact — model validators will ask why the training labels were selected as they were.", font: "Arial", size: 20, color: "222222", italics: true })] }),
  ], "FFF3E6"),
  spacer(),

  h2("8.10 Event Triage: Features for ML Scoring"),
  body("Event triage operates at the transaction or event level — scoring individual transactions before they are aggregated into alerts, enabling low-risk events to be suppressed before they reach the alert queue. The input data for event triage feature building combines four data sources: alert data, event data, customer reference data, and transaction history. Features are like rules with thresholds set statistically by the model rather than manually by an analyst."),
  body("The following ~30-feature framework is a standard starting point for event triage ML. It is organised into three categories. This list should be validated and adapted to the institution's specific product mix, customer population, and deployed scenarios."),
  calloutM("Category 1 — Reference Data Features (~8-10 features)", [
    new Paragraph({ spacing: { after: 60 }, children: [s("These features describe who the customer is. They change slowly and are sourced from the customer reference system and KYC/CDD records.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("CRR Score: "), s("Customer Risk Rating (1–5). Primary risk classifier.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("Risk Category: "), s("Band derived from CRR (Low / Medium / High).")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("Customer Type: "), s("Personal / Business / Correspondent / Other.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("Account Type: "), s("Current / Savings / Business / Other.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("Jurisdiction: "), s("Country of registration / domicile.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("Industry / SIC Code: "), s("Sector classification.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("Account Age / Tenure (months): "), s("Number of months since account opening.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [sb("KYC/CDD Status and Last Review Date: "), s("Whether CDD is current; days since last review.")] }),
  ], "E8F0FF"),
  calloutM("Category 2 — Activity-Based Features (~12-15 features)", [
    new Paragraph({ spacing: { after: 60 }, children: [s("These features describe what the customer does. They are computed from transaction history over defined lookback windows.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("30-Day Inbound Value: "), s("Total value of inbound transactions in the past 30 days.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("30-Day Inbound Volume: "), s("Count of inbound transactions.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("30-Day Outbound Value: "), s("Total value of outbound transactions.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("30-Day Outbound Volume: "), s("Count of outbound transactions.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("7-Day Inbound Value: "), s("Short-window inbound value (captures rapid accumulation).")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("7-Day Outbound Value: "), s("Short-window outbound value (captures rapid dispersal).")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("30-Day Cash Value: "), s("Total cash transaction value (in and out combined).")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("30-Day Cash Volume: "), s("Count of cash transactions.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("30-Day Wire Value: "), s("Total wire transfer value.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("30-Day Wire Volume: "), s("Count of wire transfers.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("Unique Counterparties (30-Day): "), s("Number of distinct counterparties in the lookback window.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [sb("Average Transaction Size: "), s("Mean transaction value over 30 days.")] }),
  ], "E8F0FF"),
  calloutM("Category 3 — Customised / Derived Features (~8-10 features)", [
    new Paragraph({ spacing: { after: 60 }, children: [s("These features are derived or flagged, often requiring joins across data sources. They encode domain knowledge about specific risk indicators.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("Sanctions Flag: "), s("Binary — is any party to the transaction on a sanctions list?")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("PEP Flag: "), s("Binary — is the customer or a connected party a Politically Exposed Person?")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("Previous Fraud Flag: "), s("Binary — has the customer had a confirmed fraud incident?")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("Previous SAR Flag: "), s("Binary — has a SAR been filed on this customer previously?")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("High-Risk Jurisdiction Value (30-Day): "), s("Total value of transactions involving high-risk jurisdictions (as defined in institution's risk appetite).")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("High-Risk Jurisdiction Volume (30-Day): "), s("Count of such transactions.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("Round-Amount Count: "), s("Number of transactions with amounts rounded to the nearest 1,000 (a structuring and placement indicator).")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [sb("Rapid In-and-Out Ratio: "), s("Ratio of outbound value within 48 hours of inbound value over the lookback window (layering indicator).")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [sb("Dormancy Flag: "), s("Binary — has the account been dormant for a defined period prior to the current activity (accounts reactivated for money laundering)?")] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "This list is a starting framework. The institution's data scientist should validate and finalise it based on the integrated exercise dataset, deployed scenarios, and specific typologies in scope. See Appendix for the full feature reference table.", font: "Arial", size: 20, color: "222222", italics: true })] }),
  ], "E8F0FF"),
  spacer(),

  h2("8.11 XGBoost for AML Event Triage"),
  body("XGBoost (Extreme Gradient Boosting) is the algorithm of choice for supervised AML event triage. It handles tabular data well, is robust to missing values (a common feature in AML datasets), provides native feature importance, and achieves high predictive performance with interpretable outputs. It is also natively supported by SHAP, enabling per-prediction explanations that meet regulatory expectations."),
  calloutM("Why XGBoost Suits AML Event Triage", [
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [sb("Handles class imbalance: "), s("The scale_pos_weight parameter directly addresses the SAR/non-SAR imbalance by upweighting the minority class.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [sb("Robust to missing values: "), s("XGBoost learns optimal split directions for missing values during training — critical in AML where CDE/KDE completeness varies.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [sb("Feature importance: "), s("Native feature importance (gain, cover, frequency) provides a first-pass explanation of which features drive the model — satisfying the SR 26-2 requirement for model documentation.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [sb("SHAP compatibility: "), s("TreeSHAP provides exact, fast SHAP values for XGBoost models — enabling per-alert explanation at inference time.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [sb("Regularisation: "), s("L1 (alpha) and L2 (lambda) regularisation reduce overfitting on small SAR populations.")] }),
  ], "E8EEFF"),
  calloutM("XGBoost Worked Example: AML Event Triage (Python)", [
    new Paragraph({ spacing: { after: 60 }, children: [s("The following example trains an XGBoost classifier on a synthetic AML feature dataset and evaluates performance with AML-relevant metrics.")] }),
    new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "import xgboost as xgb\nimport pandas as pd\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import precision_score, recall_score, roc_auc_score\nimport shap\n\n# Synthetic feature dataset (replace with real data)\nnp.random.seed(42)\nn = 2000\ndf = pd.DataFrame({\n    'crr_score': np.random.randint(1, 6, n),\n    'cash_30d_value': np.random.exponential(2000, n),\n    'wire_30d_value': np.random.exponential(5000, n),\n    'unique_counterparties_30d': np.random.poisson(3, n),\n    'rapid_inout_ratio': np.random.beta(1, 5, n),\n    'round_amount_count': np.random.poisson(0.5, n),\n    'account_age_months': np.random.randint(1, 120, n),\n    'prev_sar_flag': np.random.binomial(1, 0.05, n),\n    'pep_flag': np.random.binomial(1, 0.03, n),\n    'high_risk_jurisdiction_value': np.random.exponential(1000, n),\n})\ndf['is_sar'] = ((df['crr_score'] >= 4) & (df['cash_30d_value'] > 5000)).astype(int)\nX = df.drop('is_sar', axis=1)\ny = df['is_sar']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)\nscale = (y_train == 0).sum() / (y_train == 1).sum()\nmodel = xgb.XGBClassifier(n_estimators=200, max_depth=4, learning_rate=0.05, scale_pos_weight=scale, eval_metric='logloss', random_state=42)\nmodel.fit(X_train, y_train)\ny_pred_prob = model.predict_proba(X_test)[:, 1]\ny_pred = (y_pred_prob >= 0.5).astype(int)\nprint(f'ROC-AUC: {roc_auc_score(y_test, y_pred_prob):.3f}')\nprint(f'Precision: {precision_score(y_test, y_pred):.3f}')\nprint(f'Recall: {recall_score(y_test, y_pred):.3f}')\nexplainer = shap.TreeExplainer(model)\nshap_values = explainer.shap_values(X_test)\ntop_alert_idx = y_pred_prob.argmax()\nfor feat, val in sorted(zip(X_test.columns, shap_values[top_alert_idx]), key=lambda x: abs(x[1]), reverse=True)[:5]:\n    print(f'  {feat}: SHAP={val:.3f}')", font: "Courier New", size: 18, color: "222222" })] }),
  ], "F0F0F0"),
  body("In a real AML deployment, evaluate the model at multiple probability thresholds rather than defaulting to 0.5. For AML triage, the relevant metric is not overall accuracy but the SAR rate in the top-N scored alerts — how efficiently the model surfaces the cases that actually result in SARs. Plot the precision-recall curve and select the threshold that achieves the institution's target precision at an operationally sustainable recall level."),
  spacer(),

  h2("Further Reading and Research Topics"),
  exBox([
    new Paragraph({spacing:{after:100},children:[new TextRun({text:"Exercise 8.4 — Supervised ML with XGBoost  [Advanced]",font:"Arial",size:22,bold:true,color:"2E75B6"})]}),
    new Paragraph({spacing:{after:80},children:[sb("Objective: "),s("Build, evaluate, and interpret a supervised XGBoost classifier for AML event triage using the ~30-feature framework from Section 8.11.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Dataset: "),s("Use the integrated book-wide synthetic dataset from Chapter 5 (500 accounts) extended with the feature set from Section 8.11. The is_sar_worthy column from Chapter 5 is your label. Augment the dataset with the additional features from Categories 2 and 3 (simulate using the distributions described in the feature framework — see Instructor's Solutions Manual for the data generation script).")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part A — SAR Data Cleansing: "),s("Before training, apply the three-stage cleansing process from Section 8.9. Identify which simulated SARs in the dataset are 'defensive' (CRR flag only, no cash pattern) and exclude them from training. Report: how many SARs were excluded? What is the class balance before and after cleansing?")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part B — Model Training: "),s("Train an XGBoost classifier using the code framework from Section 8.11. Use 5-fold cross-validation on the training set to tune: n_estimators (try 100, 200, 300), max_depth (try 3, 4, 5), and learning_rate (try 0.01, 0.05, 0.1). Report: the best hyperparameter combination and the validation ROC-AUC at each setting.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part C — Evaluation: "),s("Evaluate on the holdout test set. Report: ROC-AUC, precision at threshold 0.5, recall at threshold 0.5, and SAR rate in the top 20 scored accounts. Compare to a baseline of sorting by CRR score alone. Which approach performs better at surfacing SARs in the top 20?")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part D — SHAP Feature Importance: "),s("Apply TreeSHAP to the trained model. Report: the top 5 features by mean absolute SHAP value. For the top-scored account, write a three-sentence analyst note explaining why it was prioritised, referencing the SHAP values by name.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part E — Governance Documentation: "),s("Write a model inventory entry for the XGBoost triage model, covering: purpose, methodology, inputs (feature list), outputs (probability score), training data source, cleansing decisions, key limitations, and governance tier (1st/2nd/3rd Line responsibilities).")]}),
    new Paragraph({spacing:{after:80},children:[si("Code framework provided in Section 8.10. See Instructor's Solutions Manual for expected outputs, sample SHAP plots, and worked governance documentation.")]}),
  ]),
  spacer(),

  num("Liu, Fei Tony, Ting, Kai Ming, and Zhou, Zhi-Hua (2008), 'Isolation Forest', Proceedings of the IEEE International Conference on Data Mining. This is the original Isolation Forest paper. Read Sections 2 and 3 (the algorithm and complexity analysis). What assumption about anomaly distribution does the algorithm rely on, and does that assumption hold for AML alert data?"),
  num("Lundberg, Scott M. and Lee, Su-In (2017), 'A Unified Approach to Interpreting Model Predictions', Advances in Neural Information Processing Systems, 30. This is the SHAP paper. Read the introduction and the section on SHAP values for tree models. Why does Shapley value allocation satisfy the property of consistency — and why does consistency matter for regulatory explainability?"),
  num("Research Question: The FCA's Discussion Paper DP21/4 ('Artificial Intelligence and Machine Learning') asks how regulators should assess algorithmic models used in financial services. Download it. The FCA uses the term 'explained AI' — what does it require, and how does SHAP-based explanation satisfy (or fail to satisfy) FCA's standard?"),
  num("Design challenge: The EBA Guidelines on Internal Governance (EBA/GL/2021/05) require that algorithmically driven decisions be subject to human oversight. Write a one-page 'human-in-the-loop' protocol for the Isolation Forest triage model. Specify: which outputs require mandatory human review regardless of score, what the analyst must document when overriding a low triage score, and what the quarterly governance review of triage output must cover."),
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
    headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } }, children: [new TextRun({ text: "Applied AML Analytics  |  Chapter 8", font: "Arial", size: 18, color: MID_BLUE })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: "Arial", size: 18, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "888888" })] })] }) },
    children
  }]
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/Book1_Chapter8.docx', buf); console.log('Done: Book1_Chapter8.docx'); });

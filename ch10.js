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
  h1("Chapter 10: The Future of AML"),
  spacer(),
  calloutM("Learning Objectives — By the end of this chapter you will be able to:",[
    num("Describe the key technological and regulatory developments reshaping AML transaction monitoring."),
    num("Assess the limitations of current TM approaches when applied to crypto assets and decentralised finance."),
    num("Evaluate how AI advancements change both the tools available to analysts and the threats they face."),
    num("Redesign the Northgate structuring scenario to detect crypto-based money mules, applying the full methodology from this book."),
  ]),
  spacer(),

  h2("10.1 Business Context: The Landscape Does Not Stand Still"),
  body("Everything in this book describes how AML transaction monitoring works today. It will not describe how it works in five years. The techniques are sound — segmentation, threshold calibration, coverage assessment, ML triage, model validation — but the environment in which they operate is changing rapidly."),
  body("Three forces are driving that change. First, the technology available to financial institutions is advancing: graph neural networks, large language models, and real-time streaming analytics are moving from research to production. Second, the technology available to criminals is advancing at the same pace — and criminals face fewer governance constraints. Third, the regulatory framework is adapting to new financial products, particularly crypto assets, that did not exist when most of the regulatory infrastructure in this book was designed."),
  body("This chapter introduces you to those forces. It does not make predictions — the AML profession has a poor track record of forecasting the precise shape of future threats. Instead, it gives you the conceptual tools to evaluate new developments as they emerge and to extend the analytical framework from this book to whatever environment you encounter in practice."),

  h2("10.2 FinTech, Digital Banking, and Embedded Finance"),
  body("The boundaries of the banking system are blurring. Ten years ago, a retail bank customer had a current account, a savings account, and perhaps a credit card. Today, the same customer may use a challenger bank for day-to-day spending, a buy-now-pay-later (BNPL) provider for purchases, a payment app for peer-to-peer transfers, and a crypto exchange for investment. Each of these providers may or may not be subject to AML obligations equivalent to a traditional bank."),
  body("This fragmentation creates monitoring gaps. A money mule who receives funds into a traditional bank account and immediately transfers them to a BNPL provider, then to a crypto exchange, leaves a transaction trail that no single institution can see in full. Each institution sees only its own slice. The coordinated cross-institution view that would reveal the full picture requires either information sharing (limited by legal constraints) or regulatory extension to all participants in the value chain."),
  bullet("BNPL providers have come under increasing regulatory scrutiny. The FCA has extended its regulatory perimeter to cover most BNPL products in the UK — readers should verify the precise effective date, as FCA's BNPL regulation timeline has shifted across successive consultation rounds and the implementation phasing may differ from earlier projections. The direction of travel is unambiguous: BNPL is moving within full AML obligations. Institutions offering or distributing BNPL products should assume coverage and act accordingly."),
  bullet("Open Banking and account aggregation services create new data flows — and new attack surfaces. An aggregation API that exposes transaction data to third parties creates a channel for information leakage that traditional TM systems are not designed to monitor."),
  bullet("Embedded finance — financial services delivered through non-financial platforms (e.g., a supermarket offering current accounts) — creates new customer relationships that may not be subject to the same CDD standards as traditional banks."),
  spacer(),
  body("Neobanks — digital-first institutions that combine traditional banking services with crypto and blockchain capabilities — are emerging as the major players in this new regulatory landscape. They straddle the boundary between traditional and crypto finance, which makes them both uniquely positioned for innovation and uniquely exposed to regulatory risk. A Neobank that allows seamless movement between a current account, a crypto wallet, and a DeFi yield product creates precisely the multi-instrument layering environment that traditional TM scenarios are not designed to monitor. Regulators are watching Neobanks closely; several have already received enforcement action for inadequate TM frameworks relative to the complexity of their product set."),
  spacer(),

  h2("10.3 Blockchain, Crypto Assets, and Decentralised Finance"),
  body("The Binance case — a $4.3 billion settlement in 2023 — demonstrated that crypto exchanges are not immune to AML obligations. It also demonstrated how severe the consequences of non-compliance can be. Crypto has moved from a niche technology to a mainstream financial instrument, and regulators have moved with it."),

  h3("10.3.1 How Blockchain Works — The AML-Relevant Features"),
  body("A blockchain is a distributed public ledger. Every transaction is recorded permanently and is visible to anyone with access to the network. Addresses — not names — are the unit of identity. The same person can control thousands of addresses, and addresses can be created instantly and at no cost."),
  body("These features create an unusual AML environment. On one hand, blockchain transactions are more transparent than traditional banking: every transaction is publicly recorded. On the other hand, the pseudonymity of addresses means that linking a transaction to a real-world identity requires additional analytical work — blockchain analytics."),

  h3("10.3.2 Money-Laundering Methods in Crypto"),
  tbl(
    ["Method","How It Works","Detection Challenge"],
    [
      ["Mixers / Tumblers","Combine transactions from multiple users so that inputs cannot be matched to outputs. The criminal deposits dirty crypto and receives clean crypto in return.","Identifying mixer addresses is possible with blockchain analytics tools, but mixers constantly change structure to evade detection."],
      ["Chain-hopping","Convert value across multiple blockchains (e.g., Bitcoin to Ethereum to Monero) to break the transaction trail.","Requires monitoring across multiple chains simultaneously. Privacy coins (Monero, Zcash) are specifically designed to resist tracing."],
      ["Peer-to-Peer (P2P) exchanges","Use informal P2P platforms that match buyers and sellers directly, often with weak or no KYC.","P2P platforms operating below regulatory thresholds may not be subject to AML obligations in some jurisdictions."],
      ["Layering through DeFi","Use decentralised finance protocols (automated market makers, liquidity pools) to layer transactions without any central counterparty that could file a SAR.","DeFi protocols have no legal entity to impose AML obligations on. Regulatory frameworks are still developing."],
      ["NFT wash trading","Buy and sell NFTs between addresses controlled by the same person at escalating prices to create the appearance of legitimate income.","Transaction monitoring must identify intra-network transfers where both sides are controlled by the same beneficial owner."],
    ],
    [1800,3526,3700]
  ),
  spacer(),

  h3("10.3.3 Blockchain Analytics Tools"),
  body("Blockchain analytics firms have built databases that cluster addresses by likely ownership, tag known criminal addresses (mixer services, sanctioned exchanges, darknet markets), and trace transaction flows across complex networks. The vendor landscape is consolidating rapidly: Ciphertrace (now integrated into Mastercard's crypto monitoring suite) and Chainalysis lead in coverage breadth; Elliptic and TRM Labs are strong alternatives with different regional and asset-class strengths. Institutions evaluating blockchain analytics tools should assess: which blockchains are covered, how address clustering is performed and validated, how frequently sanctioned entity lists are updated, and what API integration is available for TM data pipelines."),
  body("These tools do not replace TM scenario design — they augment it. A bank that accepts crypto deposits needs to integrate blockchain analytics data into its TM data model, applying the same segmentation, calibration, and coverage assessment disciplines from this book to a new data source."),
  body("The industry has invested heavily in KYT — Know Your Transaction — tools that trace crypto transaction flows across the blockchain. These tools are useful, but they address the wrong end of the problem. The core challenge in crypto AML is not KYT but KYC: knowing who controls the wallet, not merely what the wallet did. Without reliable beneficial ownership information, transaction tracing produces a detailed graph of pseudonymous addresses that cannot be connected to a legal person. KYT is a supplement to KYC, not a substitute for it. The most analytically sophisticated transaction graph is of limited regulatory value if the beneficial owner of the controlling address cannot be identified."),
  body("Graph-based approaches — including both blockchain analytics and the GNN techniques discussed below — depend on a prerequisite: entity consolidation. In AML, entity consolidation means combining customer records that refer to the same underlying entity into a single monitoring profile, so that the full picture of that entity's behaviour is visible before analysis begins. Without entity consolidation, the transaction graph contains duplicate or fragmented nodes, and the network structure is distorted. Entity consolidation (combining entities for monitoring purposes) is distinct from entity resolution (resolving identities for investigative purposes) — both are essential to graph-based AML, and neither is delivered automatically by the analytics tools that operate downstream of them."),
  body("Integrating blockchain analytics data also introduces new data quality challenges. Blockchain data has DQ issues that traditional banking data does not: address reuse ambiguity (an address used by multiple parties), unconfirmed transactions (present in the mempool but not yet settled on-chain), chain reorganisations (rare but capable of invalidating confirmed transaction records), and probabilistic address clustering (the analytics firm's attribution of an address to an entity is an estimate, not a fact). The author's DQ validation protocol (Lineage → Reconciliation → CDE Testing → Feedback Loop) applies to blockchain data feeds with added complexity in the Reconciliation step — the 'source of truth' for an unconfirmed transaction is not fixed until block confirmation."),
  callout("From School to Practice","Graph neural networks (GNNs) extend the neural network architecture to graph-structured data — networks of nodes and edges. In a blockchain transaction graph, each address is a node and each transaction is a directed edge. A GNN can learn that a particular address is suspicious not just because of its own transaction history, but because of who it transacts with — and who those counterparties transact with in turn. This is structurally identical to the money-mule detection problem we have been working on throughout this book. The seventeen Northgate mules form a connected subgraph in the bank's transaction network. NRB-STRUCT-001 monitors individual nodes — each account in isolation. A GNN would score the subgraph structure itself, detecting the network that the individual rule cannot see. This is the distinction between account-level and network-level detection, and it is why graph analysis is a frontier capability rather than an incremental improvement to existing methods.","E8F4E8"),
  spacer(),

  h2("10.4 The Metaverse and Virtual Economies"),
  body("Virtual economies — in-game currency systems, virtual real estate markets, NFT marketplaces — are emerging as a potential vector for money laundering. The standard analytical instinct is to map Metaverse money laundering onto the familiar three-stage model: Placement (converting criminal fiat into a virtual asset), Layering (transacting within the virtual economy to obscure origin), and Integration (converting back to fiat). This instinct, while understandable, may be analytically misleading in close-looped virtual economies — and it is the starting point of the author's published research on this topic."),
  callout("Author's Framework — Settle → Stake → Blend","In 'Reinventing AML Frameworks for the Metaverse' (Haibo Zhang), the author argues that the traditional Placement → Layering → Integration model does not adequately describe money laundering in close-looped virtual economies — environments where value can be created, transacted, and realised entirely within the virtual world without ever requiring fiat conversion. The author proposes an alternative three-stage model: Settle (acquiring a position within the virtual economy — purchasing virtual land, staking in a DeFi protocol, or establishing an in-game persona with economic capacity), Stake (using that position to generate apparent legitimate income — rental income from virtual real estate, yield from staking, or rewards from gameplay), and Blend (allowing virtual income to blend with criminal proceeds, making the mixed fund appear to have a legitimate virtual-economy origin). The Settle → Stake → Blend model describes a structurally different laundering cycle in which the criminal need not convert to and from fiat at all — value remains within the virtual economy, appreciating and generating apparent returns that obscure the criminal origin of the underlying stake.","FFF3E6"),
  body("The regulatory implication is significant. If the traditional three-stage model does not apply, then the detection techniques designed around it — monitoring for rapid fiat-to-crypto conversion, tracking mixer usage, applying the travel rule — are not calibrated to detect this behaviour. A monitoring programme focused on conversion events will be structurally blind to laundering that occurs entirely within a close-looped economy."),
  body("The scale of this risk is currently assessed as moderate. Virtual economies are relatively small compared to traditional financial markets, and conversion to and from fiat remains a chokepoint for most virtual economy laundering. However, as virtual economies grow in scale, as in-world assets become more liquid, and as decentralised platforms reduce the visibility of conversion events, the Settle → Stake → Blend pathway will become increasingly material."),
  calloutM("The On-Chain Regulatory Compliance Framework (OCRCF) and Meta Standards",[
    new Paragraph({spacing:{after:80},children:[s("The author's published work proposes a regulatory model for the Metaverse: Compliance as a Service (CaaS), implemented through the On-Chain Regulatory Compliance Framework (OCRCF). Traditional regulatory models impose AML obligations on centralised intermediaries — banks, exchanges, brokers — that can be licensed, supervised, and sanctioned. In decentralised virtual economies, there may be no intermediary to bear the obligation. The OCRCF proposes that compliance obligations be embedded directly into the blockchain infrastructure as smart contracts: self-executing code that enforces AML rules at the protocol level. A transaction that violates a compliance rule is rejected by the protocol before it is recorded, rather than flagged by a surveillance system after the fact.")]}),
    new Paragraph({spacing:{after:80},children:[s("Underpinning the OCRCF is the concept of Meta Standards — global, non-governmental, virtual-economy-native AML standards with three components. The Defense Outlet is the reporting and escalation mechanism for flagged activity — the functional equivalent of a SAR, but native to the virtual economy. The Defense Oracle is the shared intelligence layer that identifies and tags suspicious addresses and entities across virtual economies — a decentralised equivalent of the blockchain analytics vendor databases described in Section 10.3.3. The Handshake Protocol is the authentication mechanism that confirms a participant's compliance status before allowing high-value transactions — the virtual equivalent of CDD at account opening.")]}),
    new Paragraph({spacing:{after:0},children:[s("Meta Standards are deliberately non-jurisdictional — designed to operate across the virtual economies of multiple countries and platforms simultaneously. This is a necessary design choice: virtual economies do not respect national borders, and a jurisdictionally-bound compliance framework cannot be effective in a globally distributed environment. The author's papers ('Reinventing AML Frameworks for the Metaverse' and 'Characteristics of Financial Crime Compliance Framework in the Blockchain Era') provide a detailed treatment of the OCRCF and Meta Standards architecture.")]}),
  ],"E8EEFF"),
  body("Analysts should monitor FATF's typology reports on virtual assets — updated annually — for the most current assessment of emerging risks in this space. The conceptual frameworks above are the author's analytical contributions to a field where regulatory consensus is still forming; they should be read as a structured basis for thinking about the problem, not as settled regulatory practice."),

  h2("10.5 AI and Large Language Models in AML"),
  h3("10.5.1 Where AI Is Adding Value"),
  bulletMixed([s("SAR narrative generation: large language models can draft SAR narratives from structured case data, reducing analyst time on administrative tasks. Human review of the draft remains essential — the analyst is responsible for accuracy, not the model. An LLM used for SAR narrative drafting is a model under SR 26-2 (US) and PRA SS1/23 (UK) and requires model inventory registration, validation, and governance documentation — even if it is marketed as a productivity tool rather than a detection model. The five-pillar framework from Chapter 9 applies: purpose, methodology, data quality, methodology validation, and documentation are all required.")]),
  bullet("Regulatory text analysis: LLMs can parse lengthy regulatory guidance and extract obligations, red flags, and definitions at scale — automating the first step of the coverage assessment process from Chapter 7."),
  bullet("Customer risk assessment: ML models trained on CDD data can produce more nuanced customer risk ratings than rule-based CRR models, incorporating a wider range of signals."),
  bullet("Real-time monitoring: streaming ML models applied to transaction data as it is generated — rather than in nightly batch runs — can dramatically reduce the time between suspicious activity and alert generation."),
  spacer(),

  h3("10.5.2 The Adversarial Dimension"),
  body("AI is available to criminals as well as compliance functions. The adversarial dimension of AML is evolving rapidly."),
  bulletMixed([sb("Probing detection rules: "),s("A sophisticated criminal operation can probe a bank's detection rules by conducting test transactions just below known thresholds. AI can automate this probing at scale, identifying detection gaps far more efficiently than manual experimentation.")]),
  bulletMixed([sb("Synthetic identity fraud: "),s("Generative AI can produce convincing synthetic identities — with fabricated documents, social media histories, and financial records — that pass CDD checks. The money mule of 2030 may not be a real person.")]),
  bulletMixed([sb("Adaptive money laundering: "),s("ML models can be trained to evade detection by a specific TM system, if the adversary has sufficient visibility into the system's behaviour. This is a long-term systemic risk rather than an immediate operational one — but it underlines why the analytics profession must stay ahead of the technology curve.")]),
  spacer(),

  h2("10.6 The Future of the AML Analytics Profession"),
  body("The skills that define an excellent AML analyst in 2026 are not identical to those that will define one in 2031. The core judgement — understanding risk, evaluating evidence, making defensible decisions — is permanent. The technical toolkit is evolving."),
  spacer(),
  tbl(
    ["Skill Area","Current State","Direction of Travel"],
    [
      ["Statistical modelling","K-Means, hypergeometric sampling, regression — well-established in most teams.","Graph analytics, network analysis, and streaming statistics will become standard requirements."],
      ["Machine learning","Isolation Forest, gradient boosting — increasingly deployed but often without adequate governance.","GNNs, transformer-based models, and federated learning (for cross-institution monitoring) will enter production."],
      ["Regulatory knowledge","Focus on domestic jurisdiction (US/UK/EU/Singapore).","Cross-jurisdictional complexity will increase as crypto, DeFi, and embedded finance create multi-regulatory operating environments."],
      ["AI governance","Emerging — most teams are building model inventories and validation frameworks for the first time.","AI auditing, algorithmic bias testing, and explainability documentation will become standard job requirements."],
      ["Data engineering","Basic SQL and Python for data extraction and analysis.","Real-time streaming (Kafka, Spark), graph databases (Neo4j), and blockchain data integration will be required skills."],
    ],
    [1800,3226,4000]
  ),
  spacer(),

  h2("10.7 Risk Considerations"),
  bulletMixed([sb("Technology risk in AML systems: "),s("Advanced AI systems introduce new model risks: more complex failure modes, harder-to-detect bias, and greater dependence on data pipeline integrity. The five-pillar validation framework from Chapter 9 applies with even greater force to AI-driven TM systems.")]),
  bulletMixed([sb("Regulatory lag: "),s("The regulatory framework consistently lags the technology. AMLD 5 addressed crypto assets in 2018, seven years after Bitcoin became widely used. Analysts and their institutions must act in the gap: apply the spirit of existing obligations to new technologies before explicit guidance arrives. Waiting for a regulation to be published before treating a new financial product with AML seriousness is not a defensible position — it is a predictable gap that examiners will flag as a failure of risk management judgement.")]),
  bulletMixed([sb("Over-reliance on external tools: "),s("Blockchain analytics tools from Chainalysis, Elliptic, and TRM Labs are powerful but imperfect. They make probabilistic assessments of address ownership that carry significant uncertainty. Treating their outputs as definitive findings — rather than as inputs to human investigation — is a governance failure.")]),
  bulletMixed([sb("The explainability imperative: "),s("As AI models become more complex, the pressure for explainability will increase, not decrease. Regulators, courts, and customers will demand clear explanations for adverse decisions. The analyst who can explain their model's reasoning in plain English will be more valuable than the analyst who can only improve its accuracy metric.")]),
  spacer(),

  tkBox([
    "FinTech fragmentation, crypto assets, Neobanks, and embedded finance create cross-institutional monitoring gaps that no single institution can close alone. The regulatory perimeter is expanding to cover these participants — institutions should not wait for the regulation to arrive.",
    "Blockchain is pseudonymous, not anonymous. KYT (Know Your Transaction) is a supplement to KYC, not a substitute. The core problem remains beneficial ownership. Blockchain analytics tools trace flows — but require entity consolidation and the same governance discipline as any other AML model.",
    "The traditional Placement → Layering → Integration model may not apply in close-looped virtual economies. The Settle → Stake → Blend alternative, the OCRCF, and the Meta Standards framework (Defense Outlet, Defense Oracle, Handshake Protocol) represent the author's published contribution to this emerging field.",
    "AI is available to both compliance functions and criminals. SAR narrative LLMs, real-time streaming models, and GNNs are all models under SR 26-2 (US) and PRA SS1/23 (UK) — they require governance regardless of how they are marketed.",
    "Graph neural networks represent one of the most significant methodological advances for AML — they can detect network-level suspicion that rule-based and individual-account ML approaches structurally cannot. Entity consolidation is the prerequisite; without it, the graph is distorted before analysis begins.",
    "The five-pillar model validation framework applies with greater, not lesser, force to AI-driven TM systems. The analyst who can explain model reasoning in plain English will be more valuable than the one who can only improve its accuracy metric.",
    "An institution that can evaluate and incorporate new analytical technologies — graph analytics, blockchain data feeds, AI-driven triage — through its existing governance and validation framework, without requiring a transformation programme for each one, has reached the Matured stage of the TM lifecycle maturity model.",
  ]),
  spacer(),

  exBox([
    new Paragraph({spacing:{after:100},children:[new TextRun({text:"Exercise 10.1 — Redesigning the Northgate Scenario for Crypto Money Mules  [Advanced]",font:"Arial",size:22,bold:true,color:"2E75B6"})]}),
    new Paragraph({spacing:{after:80},children:[sb("Recap: "),s("In Exercise 9.1 you validated the Northgate model suite against the five pillars. The investigation has now revealed a new development: the mule network has begun routing funds through a crypto exchange before converting back to fiat. The exchange is registered in a jurisdiction with weak AML controls.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part A — Data Requirements: "),s("Identify the new data sources the bank would need to detect the crypto-routing pattern. For each, describe: what the data contains, how the bank would obtain it (internal systems, third-party provider, or regulatory sharing), and the practical barriers to obtaining it in real time.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part B — Hybrid Rule Design: "),s("Redesign NRB-STRUCT-001 as a hybrid scenario (NRB-STRUCT-002) that detects the following pattern: (1) multiple cash deposits below the reporting threshold in a 30-day window (the original structuring pattern), (2) rapid outward transfer to an address associated with a crypto exchange within 72 hours, (3) an inward transfer from a different crypto exchange or fiat ramp within 14 days. Write the full rule specification using the methodology from Chapter 4, including typology, red flags, logic, parameters, customer scope, and limitations.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Part C — Vendor Requirements: "),s("You have been asked to evaluate blockchain analytics tools to support NRB-STRUCT-002. Write a one-page vendor requirements specification. If you have not written a vendor requirements document before, use the following structure: Background (one paragraph explaining why the bank needs the tool and what regulatory obligation it supports), Functional Requirements (a numbered list of specific capabilities the tool must have), Non-Functional Requirements (governance documentation the vendor must provide — model methodology disclosure, data lineage, SLA, regulatory examination support), and Evaluation Criteria (how you will score competing vendors). Your specification should cover at minimum: required blockchain coverage, address clustering methodology and validation approach, sanctioned entity list update frequency, API integration specification, and SR 26-2 (US) / PRA SS1/23 (UK) compliance documentation requirements.")]}),
    new Paragraph({spacing:{after:80},children:[sb("Discussion: "),s("The mule network has now adapted to the rule you designed in Chapter 4. What does this tell you about the limitations of rule-based monitoring? How does this strengthen the case for the ML-based approaches from Chapter 8? Is there a monitoring approach that is genuinely adaptive rather than merely reactive?")]}),
    new Paragraph({spacing:{after:80},children:[si("See the Instructor's Solutions Manual for worked answers and a full sample vendor requirements specification.")]}),
  ]),

  exBox([
    new Paragraph({spacing:{after:100},children:[new TextRun({text:"Part D — Meridian Trading Ltd: The Full Network in One Graph  [Applied]",font:"Arial",size:20,bold:true,color:MID_BLUE})]}),
    new Paragraph({spacing:{after:80},children:[s("The investigation has evolved. The GNN from Section 10.3.3 now reveals a three-layer subgraph: Layer 1 — the six Northgate mule accounts (retail cash structuring, placement); Layer 2 — Meridian Trading Ltd (TBML, over-invoicing, layering); Layer 3 — a cluster of crypto wallet addresses connected to Meridian's principals, routed through the same weak-AML-jurisdiction exchange identified in Parts A and B (integration/obfuscation). This is the complete Northgate → Meridian → Crypto arc — the full three-stage ML cycle visible in a single graph.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:60},children:[s("Apply the Settle → Stake → Blend framework from Section 10.4 to the full three-layer arc. Map each layer to a stage: which layer corresponds to Settle (placement), which to Stake (layering/consolidation), which to Blend (integration/obfuscation)? For each layer, identify the specific detection technique from this book that is best suited to detect it — and name the chapter in which that technique was introduced.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:60},children:[s("The GNN requires new data for Layer 3 (on-chain wallet transactions). Apply the DQ four-step protocol (from Chapter 3 and Chapter 9) to the blockchain data feed. What are the CDE/KDEs for a crypto GNN node? What new lineage challenges does on-chain data introduce compared to the retail transaction feed used in earlier chapters?")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:80},children:[s("At what maturity stage (Nascent / Basic / Established / Advanced / Matured) is a Transaction Monitoring Framework that can detect Layer 1 and Layer 2 but not Layer 3? What single investment would move it to the next maturity stage — in terms of data, models, or governance? Be specific: name the technology, the data source, and the governance prerequisite.")]}),
  ]),

  exBox([
    new Paragraph({spacing:{after:80},children:[new TextRun({text:"Part E — Project Sentinel: The Capstone Synthesis  [Synthesis / Stretch — This is the book's final exercise]",font:"Arial",size:20,bold:true,color:MID_BLUE})]}),
    new Paragraph({spacing:{after:80},children:[s("Project Sentinel's Head of Financial Crime has been asked by the FCA to submit a TMS Effectiveness Assessment — a structured self-assessment of the bank's Transaction Monitoring Framework, covering all models deployed from Chapters 4 through 10. The assessment must address: what the programme detected (confirmed suspicious activity), what it missed (known gaps confirmed by law enforcement feedback), what has been validated (models that have passed a formal five-pillar validation), and what remediation is planned. This is the book's culminating exercise: it requires you to synthesise everything you have built, tested, validated, and governed across all ten chapters.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:60},children:[s("Write the TMS Effectiveness Assessment (approximately 600 words). Structure it with these four headings: (1) Programme Overview — the models deployed, their typology coverage, and the customer populations monitored; (2) Detected Activity — a summary of what the programme would have detected in the Northgate/Meridian scenario, with reference to which specific model(s) fired and what the outcome was; (3) Known Gaps and Missed Activity — the material gaps identified across Chapters 7 and 9, including the crypto-routing extension from Chapter 10; (4) Remediation Plan — the three highest-priority actions, with owners, timelines, and success criteria. Write in a regulatory register: factual, specific, and free of weasel words.")]}),
    new Paragraph({numbering:{reference:"numbers2",level:0},spacing:{after:80},children:[s("Grade the TMS on the three-point scale used by the FCA in its assessment framework [AUTHOR FLAG: FinCEN uses this Effective / Partially Effective / Not Effective terminology in the US context; for UK bank Northgate/Project Sentinel, the relevant supervisor is the FCA. Please confirm whether to attribute this scale to the FCA or to frame it as a generic industry assessment scale not tied to a specific regulator]: Effective (programme is operating as designed, with no material gaps), Partially Effective (programme has material gaps but management has identified them and remediation is in progress), or Not Effective (programme has material gaps and no credible remediation plan). State your grade, provide a one-paragraph justification referencing the specific evidence from the assessment, and identify the single action that would be required to upgrade the grade by one level.")]}),
    new Paragraph({spacing:{after:80},children:[si("This is the final exercise in the book. The Northgate mule network has been detected, linked to Meridian Trading Ltd, and traced through three layers of money laundering — placement, layering, and integration — using every technique introduced across Chapters 1 through 10. The programme is not perfect. The crypto layer was a step ahead. But it is documented, governed, and improving. That is what an effective TMS looks like in practice.")]}),
  ]),
  spacer(),

  h2("Further Reading and Research Topics"),
  num("Financial Action Task Force, 'Virtual Assets and Virtual Asset Service Providers' (FATF Guidance, 2019, updated 2021). This is the FATF's definitive guidance on crypto AML obligations. Read Sections 3 and 4 (risk assessment and AML programme requirements for VASPs). What obligations does FATF impose on banks that interact with VASPs as correspondent partners, and how would these obligations change Project Sentinel's blockchain data acquisition strategy?"),
  num("Chainalysis, 'The Crypto Crime Report' (published annually — free registration at chainalysis.com). The most recent report provides data on the volume and typology of on-chain money laundering. Download the most recent edition. What percentage of crypto crime proceeds were processed through DeFi protocols versus centralised exchanges? What does this imply for the adequacy of exchange-only blockchain analytics coverage?"),
  num("Research Question: The FCA's 'Guidance on Cryptoassets' (FCA Policy Statement PS19/22) and the subsequent FCA registration regime for crypto asset businesses created a new supervisory framework for UK-based crypto firms. Review FCA's published list of registered and rejected cryptoasset businesses. What does the rejection rate tell you about the maturity of AML controls in the UK crypto sector — and what risk does this create for banks that receive fiat from crypto-to-fiat conversions at unregistered firms?"),
  num("Capstone challenge: You have now completed all ten chapters and all case studies. Return to Chapter 1's Exercise 1.1 Part A, question 1: 'What three behaviours in the scenario description do you find most suspicious, and why?' Write a new answer — but this time, draw on everything you have learned. Your answer should reference: the specific typology each behaviour corresponds to, the regulatory obligation it triggers, the TM rule that would detect it, and the model governance requirement that would govern that rule. Compare your answer to what you wrote (or would have written) at the start of the book. What has changed?"),
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
    headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } }, children: [new TextRun({ text: "Applied AML Analytics  |  Chapter 10", font: "Arial", size: 18, color: MID_BLUE })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: "Arial", size: 18, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "888888" })] })] }) },
    children
  }]
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/Book1_Chapter10.docx', buf); console.log('Done: Book1_Chapter10.docx'); });

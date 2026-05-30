# GLOSSARY.md — AML TM Key Vocabulary
*Authoritative definitions for use across both books. Do not deviate from these in drafts.*

---

| Term | Definition |
|---|---|
| **AML** | Anti-Money Laundering — the set of laws, regulations, and procedures intended to prevent criminals from disguising illegally obtained funds as legitimate income |
| **TM / Transaction Monitoring** | A programmable system for transactional surveillance; can extend to fraud, market abuse, and sanctions screening |
| **Analytics Protocols** | A control framework ensuring proper alignment of algorithms, data, and business knowledge in the execution of AML analytics |
| **Alert** | A signal from a system or manual process that warrants investigation |
| **Event** | Any evidence potentially valuable for creating or contributing to an investigation; broader than an alert |
| **Infractions** | Vendor term: rule-triggered events that may not yet be definitive alerts |
| **Case** | A collection of information compiled to investigate potentially suspicious behaviour |
| **Disposition** | A conclusion with reasons and evidence determining whether a case is suspicious |
| **SAR** | Suspicious Activity Report (US terminology) |
| **STR** | Suspicious Transaction Report (Canada and some other jurisdictions) |
| **SAR-worthy** | A case that merits filing a SAR based on the evidence and investigation findings |
| **L1 Investigation** | First-level disposition: the alert is not interesting; closed without escalation |
| **L2 Investigation** | Second-level disposition: the alert is interesting; escalated for further review |
| **L3 Investigation** | Third-level disposition: the alert is SAR-worthy; a SAR/STR is filed |
| **ATL (Above the Line)** | Transactions or behaviours above a threshold that trigger an alert |
| **BTL (Below the Line)** | Transactions or behaviours below a threshold that do not trigger an alert |
| **Controls** | Means to manage risks — automatic or manual; includes policies, procedures, processes, and systems |
| **Red Flags** | Indicators that raise concerns about specific types of financial crime |
| **Typologies** | Broad classifications of financial crime behaviours; used to design monitoring scenarios |
| **Scenarios** | Computer-implementable rules encoding logic derived from typologies and red flags |
| **Rules** | Specific, parameterised logical conditions within a TM system that trigger alerts |
| **CRR** | Customer Risk Rating — risk categories assigned based on policies, reference data, and transactional data |
| **Peer Groups / Segments** | Groups of customers expected to exhibit similar transactional behaviours; used interchangeably in this book |
| **Risk Tolerance** | An organisation's baseline acceptance of financial crime risks |
| **Risk Appetite** | An organisation's willingness to take on financial crime risks; a broader concept encompassing policies and tolerance |
| **KYC** | Know Your Customer — the process of verifying the identity of clients |
| **CDD** | Customer Due Diligence — the process of assessing customer risk and understanding the nature of their business |
| **EDD** | Enhanced Due Diligence — additional scrutiny applied to higher-risk customers |
| **BAU** | Business as Usual — routine, day-to-day operational activities |
| **DQ / Data Quality** | The degree to which data meets the standards required for a specific use case; measured across dimensions including completeness, accuracy, timeliness, and consistency |
| **ILA** | Individual Learning Algorithm — a personalised ML model that learns the behaviour of individual customers |
| **DRA** | Dynamic Risk Assessment — a continuously updated risk score that adapts to new transactional behaviour |
| **UML** | Unsupervised Machine Learning — ML techniques that identify patterns without labelled training data; used in alert triage and anomaly detection |
| **TDA** | Topological Data Analysis — a mathematical approach to detecting hidden patterns in complex, high-dimensional data |
| **NLP** | Natural Language Processing — AI techniques used to parse and analyse regulatory text and typology documents |
| **RPA** | Robotic Process Automation — software tools that automate repetitive rule-based tasks such as data gathering and report generation |
| **MRM** | Model Risk Management — the governance framework for controlling risks arising from the use of quantitative models |
| **SR 11-7** | Federal Reserve / OCC supervisory guidance on model risk management (US) |
| **PRA CS 6/23** | Prudential Regulation Authority Consultation Statement 6/23 — UK model risk management supervisory standard |
| **BSA** | Bank Secrecy Act (US, 1970) — foundational US AML law requiring financial institutions to assist in detecting money laundering |
| **AMLD** | Anti-Money Laundering Directive (EU) — series of EU directives establishing AML standards across member states |
| **FATF** | Financial Action Task Force — the international standard-setting body for AML/CFT; publishes the 40 Recommendations |
| **FinCEN** | Financial Crimes Enforcement Network — US bureau of the Treasury Department; issues AML guidance and enforces BSA |
| **FCA** | Financial Conduct Authority — UK financial services regulator |
| **MAS** | Monetary Authority of Singapore — Singapore's central bank and financial regulator |
| **FFIEC** | Federal Financial Institutions Examination Council — publishes the BSA/AML Examination Manual used by US bank examiners |
| **JMLSG** | Joint Money Laundering Steering Group — publishes UK AML/CFT guidance for financial services |
| **Five Pillars** | The five components of AML model validation: Model Governance, Model Framework, Data Quality, Model Methodology, Model Documentation |

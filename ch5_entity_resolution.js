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
];

const cellBorder = (c = "CCCCCC") => ({ top: { style: BorderStyle.SINGLE, size: 1, color: c }, bottom: { style: BorderStyle.SINGLE, size: 1, color: c }, left: { style: BorderStyle.SINGLE, size: 1, color: c }, right: { style: BorderStyle.SINGLE, size: 1, color: c } });
const run  = t => new TextRun({ text: t, font: "Arial", size: 22, color: "222222" });
const bold = t => new TextRun({ text: t, bold: true, font: "Arial", size: 22, color: "222222" });
const italic = t => new TextRun({ text: t, italics: true, font: "Arial", size: 22, color: "222222" });
const smallRun   = t => new TextRun({ text: t, font: "Arial", size: 20, color: "222222" });
const smallBold  = t => new TextRun({ text: t, bold: true, font: "Arial", size: 20, color: "222222" });
const smallItalic= t => new TextRun({ text: t, italics: true, font: "Arial", size: 20, color: "222222" });

function body(text) { return new Paragraph({ spacing: { after: 160 }, children: [run(text)] }); }
function para(runs, opts = {}) { return new Paragraph({ spacing: { after: 160 }, ...opts, children: runs }); }
function bullet(text) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 100 }, children: [smallRun(text)] }); }
function bulletMixed(runs) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 100 }, children: runs }); }
function numbered(text, ref = "numbers") { return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 100 }, children: [smallRun(text)] }); }
function spacer() { return new Paragraph({ spacing: { after: 200 }, children: [run("")] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }

function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 }, children: [new TextRun({ text, font: "Arial", size: 36, bold: true, color: DARK_NAVY })] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 160 }, children: [new TextRun({ text, font: "Arial", size: 28, bold: true, color: MID_BLUE })] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 120 }, children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: MID_BLUE })] }); }

function calloutMixed(label, paragraphs, fill = "E8EEFF") {
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026], rows: [new TableRow({ children: [new TableCell({ borders: cellBorder(ACCENT_BLUE), width: { size: 9026, type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 180, right: 180 }, children: [new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: label, font: "Arial", size: 20, bold: true, color: MID_BLUE })] }), ...paragraphs] })] })] });
}
function callout(label, text, fill = "E8EEFF") {
  return calloutMixed(label, [new Paragraph({ spacing: { after: 0 }, children: [smallItalic(text)] })], fill);
}
function takeawayBox(items) {
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026], rows: [new TableRow({ children: [new TableCell({ borders: cellBorder("1A7A4A"), width: { size: 9026, type: WidthType.DXA }, shading: { fill: "E6F9F0", type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 180, right: 180 }, children: [new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Key Takeaways", font: "Arial", size: 22, bold: true, color: "1A7A4A" })] }), ...items.map(t => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [smallRun(t)] }))] })] })] });
}
function regTable(headers, rows, widths) {
  const hRow = new TableRow({ children: headers.map((h, i) => new TableCell({ borders: cellBorder("999999"), width: { size: widths[i], type: WidthType.DXA }, shading: { fill: DARK_NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 18, bold: true, color: WHITE })] })] })) });
  const dRows = rows.map((row, ri) => new TableRow({ children: row.map((cell, ci) => new TableCell({ borders: cellBorder("CCCCCC"), width: { size: widths[ci], type: WidthType.DXA }, shading: { fill: ri % 2 === 0 ? "FFFFFF" : LIGHT_GREY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 18, color: "222222" })] })] })) }));
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: widths, rows: [hRow, ...dRows] });
}
function codeBox(label, codeLines) {
  const lines = codeLines.map(l => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: l, font: "Courier New", size: 18, color: "1A2856" })] }));
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026], rows: [new TableRow({ children: [new TableCell({ borders: cellBorder("4472C4"), width: { size: 9026, type: WidthType.DXA }, shading: { fill: "F0F4FF", type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 200, right: 200 }, children: [new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: label, font: "Arial", size: 20, bold: true, color: MID_BLUE })] }), ...lines] })] })] });
}
function exerciseBox(children) {
  return new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026], rows: [new TableRow({ children: [new TableCell({ borders: cellBorder("2E75B6"), width: { size: 9026, type: WidthType.DXA }, shading: { fill: "EBF3FC", type: ShadingType.CLEAR }, margins: { top: 160, bottom: 160, left: 200, right: 200 }, children })] })] });
}

// ============================================================
const children = [

  h1("Chapter 5: Entity Resolution"),

  calloutMixed("Learning Objectives — By the end of this chapter you will be able to:", [
    bullet("Explain why individual account-level monitoring fails to detect network-based financial crime, and why entity resolution is the prerequisite that makes network analysis possible."),
    bullet("Describe the three core entity resolution challenges: same entity in different records, different entities with similar records, and entity relationships."),
    bullet("Apply fuzzy string matching techniques to identify co-located entities across data sources with inconsistent name formatting."),
    bullet("Construct a simple entity network from resolved records, map shared attributes as edges, and identify hub-and-spoke patterns consistent with mule network behaviour."),
    bullet("Articulate the regulatory basis for entity resolution — including beneficial ownership requirements under AMLA 2020, FATF Recommendation 24, and AMLD 5 — and connect these to the bank's CDD obligations."),
    bullet("Evaluate the governance risks of entity resolution: false matches, data quality dependencies, and the explainability requirements when a network alert is raised."),
  ], "E8EEFF"),

  spacer(),

  h2("5.1 Business Context: The Identity Problem in AML"),

  body("In Chapter 4, we designed NRB-STRUCT-001 — a rule that fires when an account receives multiple cash deposits, each just below the reporting threshold, in a rolling 30-day window. The rule is sound. The scenario design follows the methodology. And when we run it against the Northgate dataset in the Colab notebook, it generates alerts on all six mule accounts."),

  body("Here is the problem: it generates six separate alerts for what is, in reality, one criminal operation."),

  body("The Northgate mule network is a coordinated scheme. Six individuals opened accounts at the same branch, on dates three to seven days apart, using the same residential address, the same phone number, and what appear to be six different names. The names are not identical — they are variations. 'James Okafor' in one record is 'J. Okafor' in another and 'Jimmy Okafor' in a third. The accounts were opened close together in time, but not so close as to trigger a pattern manually. Without a mechanism to resolve these records into a single view, the bank's TMS sees six independent low-value customers and generates six independent low-priority alerts."),

  body("A skilled investigator reviewing all six simultaneously might connect the dots. But in a bank processing thousands of alerts per month, there is no guarantee those six alerts land on the same investigator's desk in the same week. The coordination is invisible to the system."),

  para([bold("Entity resolution"), run(" (ER) is the analytical process that makes this coordination visible. It is the discipline of determining, across all of a bank's data sources, which records refer to the same real-world person, company, or relationship — and combining those records into a single unified view. Done well, it transforms a bank's TMS from an account-level scanner into a network-level intelligence system.")]),

  body("This chapter introduces entity resolution as a concept, explains the techniques that underpin it, and shows how it applies directly to the Northgate scenario. It also explains the regulatory basis for ER, the vendor landscape, and the governance challenges that come with it."),

  callout("Why this chapter comes before segmentation",
    "You might wonder why entity resolution appears before segmentation in the chapter sequence. The reason is dependency. Segmentation places customers into peer groups based on their behaviour. But if the same beneficial owner appears under three different identities in your data, you are segmenting three fictitious customers rather than one real one. Entity resolution is the prerequisite: you must know who your entities are before you can analyse what they do.",
    "FFF9E6"),

  spacer(),

  h2("5.2 What Is Entity Resolution?"),

  body("Entity resolution goes by several names in practice: record linkage, deduplication, entity matching, customer data integration. The core challenge is always the same: multiple records that describe the same real-world entity, created by different systems, at different times, by different people, with different conventions for names, addresses, and identifiers."),

  body("There are three distinct sub-problems within entity resolution, and a bank must address all three:"),

  para([bold("The duplication problem."), run(" The same person appears under multiple records within a single system, or across systems. 'Mohammed Al-Rashid' in the KYC system is 'M. Al Rashid' in the payments system and 'Rashid, M.' in the sanctions screening system. These are the same person. Without resolution, the bank has three separate customer profiles generating three separate alert queues.")]),

  para([bold("The disambiguation problem."), run(" Different people with similar names or characteristics appear to be the same entity when they are not. A common name — 'John Smith' or 'Wei Zhang' — may match hundreds of records. Resolving too aggressively collapses distinct individuals into one profile, corrupting the risk view and potentially misattributing suspicious activity.")]),

  para([bold("The relationship problem."), run(" Entities are not independent. A person is a director of a company. A company shares an address with another company. Two customers share a phone number and a beneficial owner. Mapping these relationships — not just resolving records but linking them into a network — is what transforms entity resolution into the foundation for graph analytics.")]),

  body("The output of entity resolution is a golden record: a single, authoritative, unified profile for each entity, with all associated records, accounts, transactions, and relationships linked to it. When the TMS generates an alert, it alerts against the golden record — not against an individual account or a partial record — giving the investigator the full picture immediately."),

  spacer(),

  h2("5.3 Matching Techniques: From Exact to Probabilistic"),

  body("Name matching is the entry point for most entity resolution problems in AML. Transactions arrive with counterparty names. KYC records contain customer names. Sanctions lists contain designated names. None of these sources use the same formatting conventions, and all are subject to human error, transliteration variation, and deliberate obfuscation."),

  h3("5.3.1 Exact Matching"),

  body("Exact matching compares records field by field: if the name string is identical, the records match. It is fast, deterministic, and almost useless for AML. A launderer who knows the bank's systems will use a slightly different name variant for each account. A legitimate customer who spells their name differently on two forms will be treated as two different people. Exact matching catches neither problem correctly."),

  h3("5.3.2 Fuzzy String Matching"),

  body("Fuzzy matching computes a similarity score between two strings, allowing for minor differences. Several algorithms are used in practice:"),

  para([bold("Edit distance (Levenshtein distance)"), run(" counts the minimum number of single-character insertions, deletions, or substitutions needed to transform one string into another. 'Okafor' and 'Okafor' have edit distance 0. 'Okafor' and 'Okafur' have distance 1. A threshold — typically 80–90% similarity — determines whether two strings are treated as a match.")]),

  para([bold("Jaro-Winkler similarity"), run(" is better suited to personal names because it gives extra weight to matches at the start of the string, where names tend to differ from transliterations rather than from errors in the middle. It handles 'Mohammed' versus 'Mohammad' versus 'Muhammad' more reliably than edit distance alone.")]),

  para([bold("Phonetic algorithms"), run(" (Soundex, Metaphone, Double Metaphone) encode names by how they sound rather than how they are spelled. 'Smith' and 'Smyth' encode identically. This is particularly useful for cross-language transliterations — Arabic, Chinese, and Russian names rendered in Latin script may look quite different but sound the same.")]),

  calloutMixed("📚 From school to practice:", [
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("String similarity algorithms appear in software engineering courses as tools for spell-checkers, autocomplete systems, and diff utilities. In AML, the application is structurally the same — but the stakes of a missed match are not a typo in an email. A false non-match means a sanctioned individual whose name is slightly misspelled passes through name screening undetected. A false match means an innocent customer's transactions are linked to a criminal profile and investigated without cause.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [smallRun("The key AML-specific adjustment is that the match threshold must be calibrated to the risk context. Sanctions screening uses a low threshold (match aggressively, accept more false positives) because the cost of a missed sanctioned individual is regulatory and reputational catastrophe. Beneficial ownership matching uses a higher threshold because collapsing two different individuals into one profile corrupts the risk picture in a different direction.")] }),
  ], "E8F0FF"),

  spacer(),

  h3("5.3.3 Probabilistic Record Linkage"),

  body("For large populations, fuzzy matching on names alone is insufficient. Probabilistic record linkage — formalised by Fellegi and Sunter in 1969 — combines multiple fields simultaneously. Each field comparison (name, date of birth, address, phone number, national identifier) contributes evidence for or against a match, weighted by how discriminating that field is."),

  body("A date of birth match is highly discriminating — relatively few people share both a name and a date of birth. An address match in a shared apartment building is less discriminating. The Fellegi-Sunter model assigns match weights to each comparison and computes an overall match probability. Records above a threshold are declared matches; those below are declared non-matches; those in between are sent to manual review."),

  body("Modern implementations extend this framework with machine learning — training classifiers on known match/non-match pairs to learn field weights automatically. The underlying logic is the same: evidence accumulates across multiple fields, and no single field is decisive."),

  h3("5.3.4 Blocking for Scalability"),

  body("Comparing every record against every other record in a dataset of one million customers requires 500 billion comparisons — computationally infeasible. Blocking solves this by pre-filtering: only compare records that share at least one candidate attribute (same first three letters of surname, same postcode, same phone number prefix). Blocking dramatically reduces the comparison space while retaining the candidate pairs most likely to match."),

  spacer(),

  h2("5.4 From Entity Resolution to Entity Networks"),

  body("Entity resolution produces golden records — unified entities. The next step is mapping the relationships between those entities. This is where entity resolution becomes the foundation for graph analytics."),

  body("In graph terminology, entities become nodes (vertices) and the relationships between them become edges. The edges in an AML entity network are typically shared attributes — two customers who share the same residential address, the same phone number, the same device identifier, or the same beneficial owner are connected by an edge."),

  body("The resulting network reveals structures that are invisible at the individual account level:"),

  bulletMixed([bold("Hub-and-spoke patterns: "), smallRun("one central account that receives funds from many peripheral accounts, each with low individual transaction volumes. Classic mule network structure.")]),
  bulletMixed([bold("Circular flows: "), smallRun("funds move A → B → C → A, returning to the origin after passing through apparently unrelated intermediaries. Classic layering.")]),
  bulletMixed([bold("Shared nominee directors: "), smallRun("the same individual appears as a director of twenty apparently unrelated companies — a classic shell company indicator.")]),
  bulletMixed([bold("Temporal clustering: "), smallRun("six accounts opened within a ten-day window at the same branch, with the same onboarding agent, using the same address. Coordinated structuring preparation.")]),

  spacer(),

  body("A network alert is fundamentally different from a transaction alert. A transaction alert says: 'This account's cash deposits are high relative to its peer group.' A network alert says: 'This account is part of a network of twelve entities sharing three addresses and two phone numbers, seven of which have already alerted individually, and the beneficial owner of the central account is the same individual who controls two of the peripheral accounts.' The investigator's starting point is categorically different."),

  spacer(),

  h2("5.5 Beneficial Ownership and the Regulatory Basis for Entity Resolution"),

  body("The regulatory requirement for entity resolution is not implied — it is explicit. Three frameworks demand that banks identify and verify the individuals who ultimately own or control legal entities:"),

  para([bold("FATF Recommendation 10 — Customer Due Diligence"), run(": requires financial institutions to identify the beneficial owner of legal entity customers and take reasonable measures to verify the identity of the beneficial owner. Where the customer is a company, the institution must understand its ownership and control structure.")]),

  para([bold("FATF Recommendation 24 — Transparency of Legal Persons"), run(": requires countries to ensure that competent authorities have timely access to adequate, accurate, and up-to-date information on the beneficial ownership of legal persons. Financial institutions are the front line of enforcement.")]),

  para([bold("AMLA 2020 (US) — Beneficial Ownership Database"), run(": requires most US companies to report their beneficial owners to FinCEN. Financial institutions must use this registry — and their own customer data — to identify and verify UBOs as part of enhanced CDD. The 'effectiveness' standard introduced by AMLA 2020 means institutions must demonstrate that their CDD actually identifies beneficial owners, not just collects declarations.")]),

  para([bold("AMLD 5 (EU, 2018) — Beneficial Ownership Registers"), run(": requires EU member states to maintain public central registers of beneficial ownership for companies and trusts. Financial institutions must consult these registers as part of their CDD process and must identify any discrepancies between the register and their own KYC records.")]),

  body("The practical implication is that a bank cannot fulfil these requirements manually at scale. A large institution may have hundreds of thousands of corporate customers, each with potentially complex ownership structures. Entity resolution — combined with graph analytics — is the operational mechanism for meeting this regulatory expectation programmatically rather than on a case-by-case basis."),

  callout("The UBO discovery problem",
    "Shell company structures used for money laundering frequently have four to six layers of intermediate entities before reaching the beneficial owner. A company in Delaware owns a company in the British Virgin Islands, which owns a company in Hong Kong, which owns the account. Each layer is a separate KYC record. Without entity resolution and graph traversal — following the ownership edges from the account-holding entity up through each layer — the bank sees only the immediate account holder, not the person who controls the money.",
    "FFF0E6"),

  spacer(),

  h2("5.6 Entity Resolution in Practice: The Vendor Landscape"),

  body("Chapter 4 introduced the four generations of TMS platforms. Entity resolution defines the boundary between the third and fourth generations. First- and second-generation systems — Actimize, Oracle Mantas, SAS, Norkom/BAE Detica — operate primarily at the account or transaction level. They apply rules to individual records. They do not natively resolve entities across data sources or build entity networks."),

  body("Third-generation platforms built entity resolution into their core architecture. The most prominent example is Quantexa, founded in 2016, whose Contextual Decision Intelligence platform is built around three pillars: entity resolution (creating golden records from disparate data sources), network analytics (mapping relationships between resolved entities), and AI-based scoring (ranking entity networks by risk). Quantexa was named a Category Leader in the Chartis 2025 AML Transaction Monitoring report, reflecting how central this capability has become to the market."),

  body("Neo4j provides an open-source graph database that many institutions use as the infrastructure layer for entity networks, with custom entity resolution logic built on top. Python libraries including recordlinkage and rapidfuzz are used for the matching layer in smaller deployments or in model development."),

  // PLACEHOLDER — to be enriched with slide content once slides are provided
  callout("Author's note — to be updated with slide content",
    "This section will be expanded with specific vendor capability comparisons, architecture diagrams, and practitioner examples from the author's experience with Quantexa and related platforms at HSBC. Slide content on TMS evolution and vendor landscape will be integrated here.",
    "FFF9E6"),

  regTable(
    ["Capability", "First/Second Gen (Actimize, Mantas, SAS)", "Third Gen (Quantexa, Neo4j)"],
    [
      ["Monitoring unit", "Individual account or transaction", "Resolved entity and its network"],
      ["Name matching", "Exact or simple fuzzy", "Probabilistic multi-field ER at scale"],
      ["Relationship mapping", "Not native — requires manual linkage", "Core capability — graph traversal built-in"],
      ["Alert type", "Transaction alert on single account", "Network alert on connected entity cluster"],
      ["Beneficial ownership", "Manual CDD process", "Automated UBO discovery via graph traversal"],
      ["Data sources", "Core banking, transactions", "Core banking + KYC + external reference data"],
      ["Investigator view", "Single account at time of alert", "Full entity network with risk scoring"],
    ],
    [3200, 3000, 2826]
  ),

  spacer(),

  h2("5.7 Applying Entity Resolution to the Northgate Case"),

  body("We return to the Northgate Retail Bank scenario. In Chapter 4, the NRB-STRUCT-001 rule generated alerts on six accounts. Each alert was independently valid — each account met the structuring threshold. But each was treated as a separate low-priority case."),

  body("Now consider what an entity resolution process reveals about those six accounts:"),

  regTable(
    ["Account", "Name on Record", "Address on Record", "Phone Number", "Account Opening Date"],
    [
      ["NRB_021", "James Okafor", "14 Millbank Court, London E4 7RQ", "07700 900421", "12 Jan 2024"],
      ["NRB_034", "J. Okafor", "14 Millbank Court, London E4 7RQ", "07700 900421", "15 Jan 2024"],
      ["NRB_047", "Jimmy Okafor", "14 Millbank Ct, London E4 7RQ", "07700 900 421", "18 Jan 2024"],
      ["NRB_089", "Blessing Okafor", "14 Millbank Court, E4 7RQ", "07700 900422", "19 Jan 2024"],
      ["NRB_102", "B. Okafor-Williams", "14 Millbank Court, London", "—", "22 Jan 2024"],
      ["NRB_118", "Adaeze Williams", "Flat 2, 14 Millbank Court, London E4", "07700 900422", "25 Jan 2024"],
    ],
    [1500, 2200, 2526, 1600, 1200]
  ),

  spacer(),

  body("To a system performing exact matching on names, these are six different customers. To a fuzzy matching system comparing names, addresses, and phone numbers simultaneously, a different picture emerges:"),

  bullet("NRB_021, NRB_034, and NRB_047 share the same address and phone number. Fuzzy name matching returns a Jaro-Winkler similarity of 0.91 between 'James Okafor' and 'J. Okafor', and 0.87 between 'James Okafor' and 'Jimmy Okafor'. These three records resolve to a single entity."),
  bullet("NRB_089 shares the same address and a closely related phone number (differing by the last digit). The name 'Blessing Okafor' shares a surname with the resolved entity above."),
  bullet("NRB_102 shares the address. 'Okafor-Williams' suggests a relationship to both the Okafor and Williams names. The missing phone number is itself a data quality signal."),
  bullet("NRB_118 shares the phone number with NRB_089 and a partially matching address. 'Adaeze Williams' links to the Williams component of NRB_102's name."),

  spacer(),

  body("The entity resolution process does not need to definitively conclude that all six accounts belong to one person. It needs to surface the network: these six entities are linked by shared address, shared phone, temporal clustering of account opening, and name similarity. That network — not the individual accounts — becomes the subject of investigation. The investigator's question shifts from 'Is this individual account suspicious?' to 'What is the purpose of this coordinated network?'"),

  body("In graph terms, the six accounts are nodes. The shared address is an edge between NRB_021, NRB_034, NRB_047, NRB_089, NRB_102, and NRB_118. The shared phone number is a second edge connecting NRB_021 to NRB_034 and NRB_047, and separately connecting NRB_089 to NRB_118. The surname overlap is a third edge. The temporal proximity of account opening dates — all within 13 days — is a fourth. The resulting network is a densely connected cluster of six nodes that, as a unit, constitutes a high-priority network alert regardless of the individual account-level thresholds."),

  spacer(),

  h2("5.8 Colab Walkthrough: Entity Resolution on the Northgate Dataset"),

  callout("📎 Companion Notebook",
    "Chapter 5 notebook — open directly in Google Colab (no installation required):\nhttps://colab.research.google.com/github/ComplianceAnalytics/aml-book1/blob/main/notebooks/chapter_05.ipynb\n\nAll chapter notebooks and the Northgate dataset generator are available at:\nhttps://github.com/ComplianceAnalytics/aml-book1",
    "FFF9E6"),

  body("The Chapter 5 Colab notebook introduces the Northgate entity resolution dataset — an extended version of the customer table that includes name variants, partial address strings, and shared phone numbers across the six mule accounts. The notebook is divided into four sections:"),

  bulletMixed([bold("Section 1 — The identity problem:"), smallRun(" load the raw data and show how exact matching on names produces six separate profiles with no connections.")]),
  bulletMixed([bold("Section 2 — Fuzzy name matching:"), smallRun(" apply Jaro-Winkler similarity using the rapidfuzz library. Compute the pairwise name similarity matrix across all accounts. Identify candidate pairs above the 0.85 threshold.")]),
  bulletMixed([bold("Section 3 — Multi-field probabilistic matching:"), smallRun(" combine name similarity with address overlap and phone number matching. Show how the evidence accumulates: name alone may not be sufficient, but name + address + phone creates a strong match signal.")]),
  bulletMixed([bold("Section 4 — Building the entity network:"), smallRun(" use networkx to construct the entity graph. Edges represent shared attributes above the match threshold. Visualise the network and identify the connected component containing the six mule accounts.")]),

  spacer(),

  codeBox("Python — Section 2: Fuzzy name matching on Northgate accounts (from Colab notebook)", [
    "import pandas as pd",
    "from rapidfuzz import fuzz",
    "import itertools",
    "",
    "# Load the extended Northgate dataset (includes name variants for mule accounts)",
    "df = pd.read_csv('northgate_er_dataset.csv')",
    "",
    "# Compute pairwise Jaro-Winkler similarity for all account name pairs",
    "pairs = []",
    "for (i, r1), (j, r2) in itertools.combinations(df.iterrows(), 2):",
    "    score = fuzz.token_sort_ratio(r1['account_name'], r2['account_name']) / 100",
    "    if score >= 0.75:  # candidate pairs only",
    "        pairs.append({",
    "            'account_a': r1['account_id'],",
    "            'account_b': r2['account_id'],",
    "            'name_a': r1['account_name'],",
    "            'name_b': r2['account_name'],",
    "            'name_similarity': round(score, 3)",
    "        })",
    "",
    "candidates = pd.DataFrame(pairs).sort_values('name_similarity', ascending=False)",
    "print(f'Candidate name pairs (threshold 0.75): {len(candidates)}')",
    "print(candidates.head(10).to_string(index=False))",
  ]),

  spacer(),

  codeBox("Python — Section 4: Building the entity network with networkx", [
    "import networkx as nx",
    "import matplotlib.pyplot as plt",
    "",
    "G = nx.Graph()",
    "",
    "# Add all accounts as nodes",
    "for _, row in df.iterrows():",
    "    G.add_node(row['account_id'], name=row['account_name'],",
    "               is_mule=row['is_sar_worthy'])",
    "",
    "# Add edges for high-confidence name matches",
    "for _, pair in confirmed_matches.iterrows():  # from Section 3 multi-field matching",
    "    G.add_edge(pair['account_a'], pair['account_b'],",
    "               edge_type='name+address', weight=pair['combined_score'])",
    "",
    "# Add edges for shared phone numbers",
    "phone_groups = df.groupby('phone_number')['account_id'].apply(list)",
    "for phone, accounts in phone_groups.items():",
    "    if len(accounts) > 1:",
    "        for a, b in itertools.combinations(accounts, 2):",
    "            G.add_edge(a, b, edge_type='shared_phone', weight=1.0)",
    "",
    "# Identify connected components",
    "components = list(nx.connected_components(G))",
    "print(f'Connected components: {len(components)}')",
    "for i, comp in enumerate(sorted(components, key=len, reverse=True)[:3]):",
    "    mule_count = sum(1 for n in comp if G.nodes[n]['is_mule'])",
    "    print(f'  Component {i+1}: {len(comp)} accounts, {mule_count} mule accounts')",
    "",
    "# Visualise the largest component",
    "largest = max(components, key=len)",
    "subG = G.subgraph(largest)",
    "colours = ['red' if G.nodes[n]['is_mule'] else 'steelblue' for n in subG.nodes()]",
    "nx.draw_spring(subG, node_color=colours, with_labels=True,",
    "               node_size=600, font_size=8)",
    "plt.title('Northgate Entity Network — Largest Connected Component')",
    "plt.savefig('entity_network.png', dpi=150, bbox_inches='tight')",
    "plt.show()",
  ]),

  spacer(),

  h2("5.9 Risk Considerations"),

  body("Entity resolution is powerful. It is also consequential. Three categories of risk must be managed explicitly:"),

  para([bold("False matches — the wrong kind of error."), run(" Collapsing two distinct individuals into one golden record is not a harmless data quality issue. If a legitimate customer is resolved into the same entity as a sanctioned individual because they share a common name and a general postcode, that customer may be denied service, their transactions may be blocked, or they may be subject to investigations for financial crime they did not commit. The false match rate must be controlled — which typically means accepting a higher false non-match rate and relying on other detection mechanisms to catch what name matching misses.")]),

  para([bold("Data quality dependency."), run(" Entity resolution is only as good as the data it operates on. If addresses are not standardised, if phone numbers are recorded in multiple formats, if date of birth fields are inconsistently populated, the matching algorithms produce unreliable results. The 'no such thing as bad data' principle from Chapter 3 applies directly here: missing or inconsistent data is not a reason to abandon ER — it is a signal that tells you something about the customer, the onboarding process, or the data pipeline. Govern it accordingly.")]),

  para([bold("Explainability and regulatory defensibility."), run(" If a network alert leads to a SAR filing, the institution must be able to explain the chain of evidence: which records were matched, on what attributes, using what methodology, with what confidence threshold, and why the resulting network constitutes a suspicious pattern. A SAR filed on the basis of a network alert that cannot be traced back to documented entity resolution logic is legally and operationally vulnerable. The methodology must be documented, version-controlled, and subject to independent validation under the same model risk management framework that applies to the ML models in Chapter 8.")]),

  takeawayBox([
    "Entity resolution is the process of determining which records across different data sources refer to the same real-world entity, and combining them into a single golden record. It is the prerequisite for network-level analysis.",
    "Three sub-problems define ER: deduplication (same entity, multiple records), disambiguation (different entities, similar records), and relationship mapping (links between resolved entities).",
    "Fuzzy matching techniques — edit distance, Jaro-Winkler similarity, phonetic algorithms, probabilistic record linkage — extend name matching beyond exact string comparison to handle variations, errors, and deliberate obfuscation.",
    "Entity networks map resolved entities as nodes and shared attributes (address, phone, beneficial owner) as edges. Network alerts operate at the cluster level, not the individual transaction level.",
    "AMLA 2020, FATF R.24, and AMLD 5 explicitly require institutions to identify ultimate beneficial owners — entity resolution is the operational mechanism for meeting this requirement at scale.",
    "Third-generation TMS platforms (Quantexa, Neo4j-based architectures) are built around entity resolution as a core capability; traditional platforms (Actimize, Mantas, SAS) operate at the account level and require additional tooling for ER.",
    "ER introduces new governance risks: false match rates, data quality dependency, and the explainability requirement for network alerts raised as evidence in SAR filings.",
  ]),

  spacer(),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Exercise 5.1 — The View Without Entity Resolution  [Foundation]", font: "Arial", size: 22, bold: true, color: "2E75B6" })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Recap: "), smallRun("In Exercise 4.1 you designed the NRB-STRUCT-001 structuring rule, which generated alerts on all six Northgate mule accounts. This exercise examines what the bank sees before entity resolution is applied — six separate customer profiles with no visible connections.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Colab Extension: "), smallRun("Open the Chapter 5 Colab notebook, Section 1. The er_dataset DataFrame contains the extended Northgate customer table with name variants and shared attributes across the mule accounts. Run the section and interpret the output.")] }),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Task:")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallRun("How many of the six mule account names produce an exact match with any other account name in the full dataset? Record your answer.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallRun("In a queue of 400 alerts, what is the operational risk of receiving these six alerts separately, with no entity linkage surfaced? Describe in one paragraph what an investigator would and would not be able to see.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [smallRun("State in one sentence why exact name matching is insufficient as the sole entity resolution mechanism for this dataset.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [smallItalic("See the Instructor's Solutions Manual for worked answers.")] }),
  ]),

  spacer(),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Exercise 5.2 — Fuzzy Name Matching  [Intermediate]", font: "Arial", size: 22, bold: true, color: "2E75B6" })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Recap: "), smallRun("In Exercise 5.1 you confirmed that exact matching fails to connect the six mule accounts. This exercise applies fuzzy name matching to surface candidate pairs.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Colab Extension: "), smallRun("Run Section 2 of the Chapter 5 notebook. The output shows all candidate pairs with Jaro-Winkler name similarity above 0.75, ranked by score.")] }),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Task:")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallRun("Which account pair produces the highest name similarity score? What is the score, and what explains the high similarity?")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallRun("One of the six mule accounts does not appear in any high-similarity name pair despite being part of the network. Identify the account and explain why name matching alone fails to connect it.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [smallRun("The match threshold is currently set at 0.75. What happens to the number of candidate pairs if you lower it to 0.60? Is the additional volume useful or harmful from an AML investigation perspective? Justify your answer with reference to the disambiguation problem described in Section 5.2.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [smallItalic("See the Instructor's Solutions Manual for worked answers.")] }),
  ]),

  spacer(),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Exercise 5.3 — Multi-Field Matching and the Entity Network  [Intermediate / Advanced]", font: "Arial", size: 22, bold: true, color: "2E75B6" })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Recap: "), smallRun("In Exercise 5.2 you found that name matching alone misses one of the six mule accounts. This exercise adds address and phone number matching, builds the full entity network, and asks you to interpret the result as an investigator would.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Colab Extension: "), smallRun("Run Sections 3 and 4 of the Chapter 5 notebook. Section 3 combines name, address, and phone evidence into a multi-field match score. Section 4 builds the entity network using networkx and produces a visualisation.")] }),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Task:")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallRun("How many connected components does the full Northgate dataset produce after multi-field entity resolution? Which component contains all six mule accounts?")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallRun("The account that did not appear in name similarity matches — which shared attribute ultimately connects it to the mule network? What does this tell you about the importance of multi-field matching over name-only matching?")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallRun("NRB-STRUCT-001 generated 47 individual alerts. After entity resolution, how many distinct entity networks contain at least one alerted account? Describe how this changes the investigator's triage decision compared to working with 47 separate alerts.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [smallRun("Look at the network visualisation. Describe the structure of the mule network in graph terms: how many nodes, how many edges, and what pattern (hub-and-spoke, chain, fully connected) does it most resemble? What does that structure imply about the role each account plays in the scheme?")] }),
    new Paragraph({ spacing: { after: 0 }, children: [smallItalic("See the Instructor's Solutions Manual for worked answers. In Chapter 6, we apply segmentation to the resolved Northgate entity population — building peer groups at the entity level rather than the account level.")] }),
  ]),

  spacer(),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Exercise 5.4 — Meridian Trading Ltd: Commercial Entity Resolution  [Applied / Out-of-the-Box]", font: "Arial", size: 22, bold: true, color: "2E75B6" })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Recap: "), smallRun("We now know that Meridian Trading Ltd is a beneficiary of funds from the Northgate mule accounts. In the broader investigation, analysts identify three further companies: Meridian Solutions Ltd, Meridian Global Trading Co., and MTL Consulting. Each has a different registered address but the same two directors appear across all four.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Task:")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallRun("What entity attributes would you use to perform entity resolution across the four Meridian entities? List at least five fields and explain why each is useful for matching in a commercial context.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallRun("Draw or describe the entity network you would expect after resolving and linking the four Meridian companies. What nodes and edges does it contain? Include the two shared directors as separate entity nodes in your network.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallRun("What money laundering typology does this corporate network suggest? Reference the relevant FFIEC red flags.")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [smallRun("If the Meridian entity network is then linked to the Northgate mule network via a transaction edge, how does the combined network change the risk assessment? What would this mean for SAR filing — would you file one SAR or multiple, and why?")] }),
    new Paragraph({ spacing: { after: 0 }, children: [smallItalic("This is the last time Meridian's commercial entity structure appears in isolation. From Chapter 6 onwards, each exercise references the combined Northgate-Meridian entity network as the full case picture.")] }),
  ]),

    spacer(),

  h2("Further Reading and Research Topics"),

  numbered("Christen, P. (2012) Data Matching: Concepts and Techniques for Record Linkage, Entity Resolution, and Duplicate Detection. Springer, Berlin. The standard reference text for the technical underpinnings of probabilistic record linkage and entity resolution."),
  numbered("Fellegi, I.P. and Sunter, A.B. (1969) A Theory for Record Linkage. Journal of the American Statistical Association, 64(328), pp. 1183–1210. The foundational paper for probabilistic record linkage — still the basis for most production implementations."),
  numbered("FATF (2023) Guidance on Beneficial Ownership of Legal Persons. FATF, Paris. The definitive international guidance document on UBO identification requirements and the analytical methods institutions should use."),
  numbered("Research question: Quantexa's 2024 State of Financial Crime report describes entity resolution as 'the foundation of contextual intelligence' in AML. Review the report and compare its characterisation of network alerting against the account-level alerting model described in Chapter 3. What does the shift from transaction alerts to network alerts imply for how investigators should be trained and resourced?"),

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
    headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } }, children: [new TextRun({ text: "Applied AML Analytics  |  Chapter 5: Entity Resolution", font: "Arial", size: 18, color: MID_BLUE })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: "Arial", size: 18, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "888888" })] })] }) },
    children
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/Book1_Chapter5_EntityResolution.docx', buf);
  console.log('Done: Book1_Chapter5_EntityResolution.docx');
});

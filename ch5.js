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

  h1("Chapter 5: Segmentation"),
  spacer(),

  calloutMixed("Learning Objectives — By the end of this chapter you will be able to:", [
    numbered("Explain why segmentation improves TM scenario performance and reduces false positives.", "numbers"),
    numbered("Apply K-Means clustering to a customer transaction dataset and interpret the results in a risk context.", "numbers"),
    numbered("Evaluate a segmentation model for regulatory defensibility.", "numbers"),
    numbered("Determine which segment the Northgate mule network belongs to and explain the implications for monitoring.", "numbers"),
  ], "E8EEFF"),
  spacer(),

  h2("5.1 Business Context: Why One Threshold Does Not Fit All Customers"),
  body("In Chapter 4, we designed a structuring rule with a single threshold: USD 7,500 in rolling 30-day cash deposits. That threshold was a starting point — a reasonable calibration for a typical personal current account customer. But Northgate Retail Bank does not serve only typical customers. Its portfolio includes low-income account holders, market traders, seasonal workers, cash-intensive sole traders, and high-net-worth individuals who maintain significant cash reserves."),
  body("Applying the same threshold to all of them produces predictable problems. For a market trader whose weekly cash income legitimately exceeds USD 3,000, a USD 7,500 monthly threshold generates alerts on nearly every account — most of them false positives. For a low-income customer whose normal monthly cash transactions total USD 400, a USD 7,500 threshold is so high relative to their profile that it would miss substantial structuring activity."),
  body("Segmentation solves this problem by grouping customers into peer groups and applying monitoring parameters appropriate to each group. A customer is assessed not against a universal standard but against the behaviour of their peers — customers who share relevant characteristics. This approach is both more precise (fewer noisy alerts) and more sensitive (better coverage of genuinely anomalous behaviour)."),
  body("Segmentation is not merely a technical optimisation. It is a regulatory expectation. 'Risk-based approach' is one of the most overused phrases in AML. Here is what it means in practice: proportionality. A risk-based approach — mandated by FATF and implemented in national AML legislation — requires that monitoring intensity be proportionate to risk. Proportionality requires differentiation. Differentiation requires segmentation."),
  spacer(),

  h2("5.2 What is Segmentation in AML Transaction Monitoring?"),
  body("In the context of AML, segmentation is the process of dividing the customer population into groups — peer groups — within which individual behaviour can be meaningfully compared. The key word is 'meaningfully'. A peer group is only useful if the customers in it are genuinely similar in their expected transaction behaviour. We use 'segment' and 'peer group' interchangeably throughout this book — both refer to a grouping of customers expected to exhibit similar transactional behaviour."),
  para([bold("Top-down segmentation"), run(" starts with pre-defined categories based on customer attributes: account type, industry classification, geography, or customer relationship type. It applies expert judgement to define the groups and then assigns customers to them.")]),
  para([bold("Bottom-up segmentation"), run(" starts with the data and allows groups to emerge from observed transaction behaviour. Clustering algorithms are the primary tool. Bottom-up segmentation can identify groups that expert judgement would not have anticipated — but it requires careful interpretation to be operationally meaningful and regulatorily defensible.")]),
  body("In practice, most institutions use a hybrid approach: top-down categories as the primary segmentation structure, with bottom-up clustering used to refine groups within those categories or to identify anomalous sub-populations."),
  calloutMixed("Concept: Orthogonality in Segmentation", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Top-down and bottom-up segmentation must be orthogonal — they should be measuring different dimensions of the same customer population, not duplicating each other. Orthogonality means the two approaches are independent: knowing a customer's top-down segment (e.g. 'small business, medium risk') tells you nothing predictive about which bottom-up cluster they will fall into, and vice versa.", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Why does orthogonality matter? Because if your top-down and bottom-up segments are correlated, you are not gaining additional information — you are producing redundant peer groups that converge on the same monitoring thresholds. The value of combining both approaches is that they catch different things: top-down catches structural risk (this customer type is inherently higher risk); bottom-up catches behavioural anomaly (this customer behaves differently from their structural peers).", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Example — The Pizza Restaurant Problem: A money launderer opens a pizza restaurant as a front business. Top-down segmentation assigns them to the 'food and beverage, small business, medium risk' segment — a legitimate category with many genuine peers. Within that segment, bottom-up clustering reveals their transaction behaviour is an outlier: the cash-in volume is three standard deviations above the cluster centroid for similar restaurants in similar locations. The bottom-up anomaly is invisible to top-down analysis; the top-down category is the cover story. Only by combining orthogonal approaches — and looking for customers who are structurally normal but behaviourally anomalous — can the analyst surface the pattern.", font: "Arial", size: 20, color: "222222", italics: true })] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "The test for orthogonality: can you compute the bottom-up cluster assignment from the top-down attributes, or vice versa? If yes, your dimensions are not independent. Revisit your feature selection before proceeding.", font: "Arial", size: 20, color: "222222" })] }),
  ], "E8EEFF"),
  spacer(),
  spacer(),

  h2("5.3 Top-Down Segmentation"),
  body("Top-down segmentation classifies customers into groups defined by the institution, using attributes available at account opening or updated during the customer relationship. The most common classification variables are:"),
  bulletMixed([smallBold("Product type: "), smallRun("Personal current account, business current account, savings account, mortgage offset account. Different products attract different transaction patterns and different regulatory requirements.")]),
  bulletMixed([smallBold("Industry or occupation: "), smallRun("A cash-intensive business (market stall, taxi firm, convenience store) will have very different expected cash transaction volumes than a salaried employee. Industry classification using standard codes (SIC/NAICS) allows peer groups to be constructed at an appropriate level of granularity.")]),
  bulletMixed([smallBold("Geography: "), smallRun("Customers operating in high-risk jurisdictions, or making frequent cross-border transactions, may warrant separate peer groups and different thresholds from domestic customers.")]),
  bulletMixed([smallBold("Customer risk rating (CRR): "), smallRun("The customer's overall AML risk score, assigned at onboarding and updated through periodic review. CRR is an output of the KYC process and incorporates factors such as PEP status, high-risk jurisdiction exposure, and prior suspicious activity flags.")]),
  spacer(),

  body("Top-down segmentation is straightforward to implement and easy to explain to an examiner. Its limitation is that it relies on the accuracy of the attribute data — if occupation codes are stale, or industry classifications are inaccurate, the peer groups are misleading. Occupation codes and industry classifications are Critical Data Elements (CDEs) for top-down segmentation: if they fail data quality testing, the segment assignments are wrong from the start. Chapter 7 covers the DQ framework for identifying and testing CDEs. It also cannot capture behavioural variation within a category: not all market traders behave the same way, and treating them as a single peer group may mask genuine anomalies."),
  callout("Risk Consideration — No Data is Bad Data",
    "A blank occupation field is not simply missing data — it is information. It may indicate an incomplete onboarding process, a data migration error, or a customer who declined to provide the information. Each of these carries a different risk implication. Clustering algorithms handle missing values differently: some exclude the record from the analysis; some impute a default value. Neither approach accounts for what the missing data might signal. Before running any segmentation model, the analyst must decide: what does a missing occupation field mean in this population, and how should the model treat it? The wrong answer will misclassify customers from the outset.",
    "FFF3E6"),
  spacer(),

  h2("5.4 Bottom-Up Segmentation: Data-Driven Clustering"),
  body("Bottom-up segmentation uses statistical algorithms to group customers by the similarity of their observed transaction behaviour, without pre-defining what the groups should look like. The most widely used technique is K-Means clustering, but other algorithms — including hierarchical clustering and topological methods — have important roles in specific contexts."),
  body("The appeal of bottom-up segmentation is that it is empirically grounded. The groups emerge from actual behaviour, not from classification categories that may be outdated or inaccurate. A customer classified as 'personal account, employed, low risk' may exhibit transaction behaviour that clusters with cash-intensive business accounts — a discrepancy that top-down segmentation would not surface but that bottom-up clustering would."),
  body("The challenge is interpretability. An algorithm can produce a grouping; it cannot explain what the grouping means. That interpretation requires domain expertise. We examine the two most common techniques — K-Means and hierarchical clustering — in the following sections."),
  spacer(),

  calloutMixed("Standard 8-Dimension Monthly Summary Framework for Bottom-Up Segmentation", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "A practical starting point for bottom-up segmentation is an 8-dimension monthly summary framework built from transaction data. This framework captures four transaction type categories, each measured by both value and volume, yielding 8 dimensions per customer per month:", font: "Arial", size: 20, color: "222222" })] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallBold("Top transaction type by volume — Value"), smallRun(" (e.g. total value of cash deposits if cash is the highest-volume type for this customer)")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallBold("Top transaction type by volume — Volume"), smallRun(" (count of transactions in the highest-volume category)")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallBold("Second transaction type by volume — Value")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallBold("Second transaction type by volume — Volume")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallBold("Third transaction type by volume — Value")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallBold("Third transaction type by volume — Volume")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallBold("All other transaction types combined — Value"), smallRun(" (aggregate of all remaining types)")] }),
    new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [smallBold("All other transaction types combined — Volume")] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "The 'top 3 by volume + everything else' structure ensures the framework is adaptive: it does not pre-define what transaction types matter for each customer. For a cash-intensive business, the top type will likely be cash; for an international trader, it may be wire transfers. This flexibility makes the 8-dimension framework applicable across diverse customer populations without requiring separate feature engineering per segment. The framework produces a compact, interpretable feature set that is well-suited to K-Means clustering.", font: "Arial", size: 20, color: "222222", italics: true })] }),
  ], "E8F0FF"),
  spacer(),

  h2("5.5 K-Means Clustering"),
  calloutMixed("From School to Practice: K-Means in AML", [
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "You know K-Means from your degree: assign K centroids, assign each data point to its nearest centroid, recalculate centroids, repeat until convergence. In AML, the output is not just a cluster label that tells you which group a data point belongs to. It is a peer group that will determine the threshold a customer is monitored against. A customer assigned to a high-volume cluster will be monitored against a higher threshold; one assigned to a low-volume cluster against a lower one. The stakes of a poorly formed cluster are therefore regulatory and financial: over-cluster a low-risk population into a high-risk group and you miss suspicious activity; under-cluster a high-risk population into a low-risk group and you generate alerts on legitimate customers while missing the ones you should be catching.", font: "Arial", size: 20, color: "333333", italics: true })] }),
  ], "E8F0FF"),
  spacer(),

  h3("5.5.1 The Algorithm"),
  body("K-Means partitions N observations into K clusters, where each observation belongs to the cluster with the nearest mean (centroid). The algorithm proceeds as follows:"),
  numbered("Initialise K centroids, either randomly or using a deterministic method such as K-Means++ (which spreads initial centroids to reduce sensitivity to random initialisation)."),
  numbered("Assign each customer to the cluster whose centroid is closest, using Euclidean distance in feature space."),
  numbered("Recalculate each centroid as the mean of all customers assigned to that cluster."),
  numbered("Repeat steps 2 and 3 until cluster assignments stabilise (convergence) or a maximum iteration count is reached."),
  spacer(),

  body("The algorithm minimises within-cluster variance — the sum of squared distances from each point to its cluster centroid (the 'inertia' or 'within-cluster sum of squares', WCSS). The resulting clusters are compact and well-separated in feature space, which in AML terms means customers within a cluster are behaviourally similar and customers across clusters are behaviourally different."),

  h3("5.5.2 Choosing K"),
  para([bold("Choosing K"), run(" — the number of clusters — is the most consequential decision in a K-Means analysis. There is no universally correct value. Too few clusters (small K) groups behaviourally diverse customers together, producing imprecise peer comparisons. Too many clusters (large K) produces groups so small that individual anomalies are statistically unreliable.")]),
  body("Two standard methods help identify appropriate values of K:"),
  bulletMixed([smallBold("The elbow method: "), smallRun("Plot inertia against K. As K increases, inertia decreases (more clusters always reduces within-cluster variance). The 'elbow' — the point where the rate of decrease markedly slows — indicates a reasonable K. In practice, the elbow is often ambiguous. Always interpret it alongside domain knowledge.")]),
  bulletMixed([smallBold("The silhouette score: "), smallRun("For each point, the silhouette score measures how similar it is to its own cluster compared to neighbouring clusters. Scores range from -1 (point fits a neighbouring cluster better than its assigned cluster) to +1 (well-clustered). The average silhouette score across all points peaks at the optimal K. A mean score above 0.5 is often cited as a rule of thumb for relatively clean, low-dimensional data. In high-dimensional or noisy real-world datasets — such as AML transaction features — acceptable scores may be lower; domain context and business interpretability should inform the judgement alongside the metric.")]),
  bulletMixed([smallBold("The Pseudo F-Statistic (Calinski-Harabasz Index): "), smallRun("This metric measures the ratio of between-cluster variance to within-cluster variance. A high Pseudo F indicates clusters that are well-separated from each other AND internally compact — exactly what good segmentation requires. Formally: Pseudo-F = [B/(K-1)] / [W/(N-K)], where B is the between-group sum of squares, W is the within-group sum of squares, K is the number of clusters, and N is the total number of observations. The optimal K maximises the Pseudo F. Unlike the elbow method, this metric gives a single objective value rather than requiring visual interpretation of a curve. In AML segmentation, the Pseudo F complements the silhouette score: silhouette measures how well individual points are assigned; Pseudo F measures how well the clustering structure as a whole separates distinct behavioural groups.")]),
  spacer(),

  h3("5.5.3 Interpreting Clusters in a Business Context"),
  body("A cluster is a mathematical construct. Its business meaning must be assigned by a practitioner. After running K-Means, the analyst should examine each cluster in terms of:"),
  bullet("The centroid values: what is the average monthly cash-in, transaction count, account age, and risk score for customers in this cluster?"),
  bullet("The spread within the cluster: are customers tightly grouped around the centroid, or is there substantial variation?"),
  bullet("The composition of the cluster: is it dominated by a particular customer type, occupation, or product?"),
  bullet("The alignment with known risk categories: does the cluster correspond to a recognisable risk profile — for example, cash-intensive small businesses, dormant accounts, or high-frequency transactors?"),
  spacer(),

  body("Once each cluster has a business interpretation, it can be assigned a monitoring threshold. The threshold for a cluster of low-volume, low-frequency personal account holders will be different — and should be lower — than the threshold for a cluster of cash-intensive business accounts."),

  h3("5.5.4 Regulatory Defensibility"),
  body("Regulators expect institutions to be able to explain their segmentation approach. 'The algorithm produced four clusters' is not an adequate explanation. The institution must be able to articulate what each cluster represents, why the cluster boundaries are appropriate, how thresholds were set for each cluster, and what quality assurance was performed on the clustering output."),
  body("This requires documentation. A segmentation model should have a model development document (MDD) that covers: the data used, the features selected and why, the algorithm chosen and why, the K selection methodology, the business interpretation of each cluster, and the validation results. The MDD is a key artefact under model risk management frameworks — SR 26-2 (US) and PRA SS1/23 (UK), both introduced in Chapter 2. It is subject to independent model validation before deployment and periodic review thereafter. Chapter 9 covers the full validation framework. The governance lifecycle for a segmentation model runs: design → validate → approve → deploy → monitor → periodic review → retire or update. Each step must be documented and auditable."),
  spacer(),

  h2("5.6 Hierarchical Clustering"),
  body("K-Means requires you to specify K in advance. Hierarchical clustering does not. Instead, it builds a tree of cluster merges (agglomerative) or splits (divisive) and outputs a dendrogram — a diagram that shows how clusters merge as the distance threshold increases."),
  para([bold("Agglomerative hierarchical clustering"), run(" starts with each customer as its own cluster and merges the two most similar clusters at each step, until all customers belong to a single cluster. The analyst then cuts the dendrogram at a height that produces the desired number of clusters — or uses a statistical criterion to identify the optimal cut.")]),
  body("The advantage of hierarchical clustering over K-Means in AML contexts is that it is particularly well-suited to small populations where the structure of relationships matters more than the geometry of cluster centroids. For example, when segmenting a population of private banking clients — a small, diverse group — hierarchical clustering may reveal a dendrogram structure that provides more actionable intelligence than K-Means centroids."),
  body("The limitation is computational: agglomerative hierarchical clustering scales as O(n^2) in memory and O(n^3) in time for naive implementations, making it impractical for customer populations of hundreds of thousands. For large populations, K-Means is preferred; hierarchical clustering is reserved for sub-populations or specialist analyses."),
  spacer(),

  h2("5.7 Topological Data Analysis (TDA) [Advanced]"),
  calloutMixed("From School to Practice — Topological Data Analysis", [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Topological Data Analysis applies tools from algebraic topology — specifically persistent homology — to detect structural features in high-dimensional data that traditional distance-based methods miss. The intuition is this: where clustering asks 'which points are close together?', TDA asks 'what is the shape of the data?' In AML, this distinction matters when the structure of suspicious activity is not a compact cluster but a ring, a loop, or a connected chain.", font: "Arial", size: 20, color: "333333", italics: true })] }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "Example — Correspondent Banking Pseudo-Customers: A large bank maintains correspondent banking relationships with dozens of overseas institutions, each represented in the transaction data as a single account ('pseudo-customer'). K-Means clustering groups these pseudo-customers by transaction volume and frequency — but TDA applied to the transaction graph reveals a structural pattern invisible to clustering: three correspondent accounts, geographically unrelated and in different volume clusters, consistently route funds through an intermediate jurisdiction before settlement. The three accounts form a topological structure — a connected chain — in the transaction graph, even though they are statistically distant in feature space. TDA identifies this chain as a persistent structural feature. K-Means would classify the three accounts as belonging to separate, normal clusters. This is the core advantage of TDA for AML network analysis: it surfaces coordination patterns that cluster-based methods, by design, cannot detect. This remains an emerging technique in operational AML, but its theoretical advantages for network analysis are well-established.", font: "Arial", size: 20, color: "333333", italics: true })] }),
  ], "E8F0FF"),
  spacer(),

  body("In practical AML deployments, TDA is most often used in conjunction with graph analytics to identify structural anomalies in transaction networks. Rather than replacing clustering, it complements it: clustering identifies unusual individual customer profiles; TDA identifies unusual network structures that span multiple customers."),
  body("A full treatment of TDA mathematics — including simplicial complexes, Betti numbers, and persistence diagrams — is beyond the scope of this chapter. Interested readers should consult the Further Reading references. The operational takeaway is that TDA offers a qualitatively different lens on transaction data and is particularly valuable when the suspicious activity involves coordination across multiple accounts. TDA's ability to detect structural network features — rings, loops, connected chains — complements the graph neural network (GNN) approach introduced in Chapter 10 §10.3, where the Northgate mule network is analysed as a connected subgraph; both techniques identify coordination that individual-account methods cannot see."),
  spacer(),

  h2("5.8 Applying Segmentation to the Northgate Scenario"),
  h3("5.8.1 The Dataset"),
  body("For the exercises in this chapter and Chapter 6, we use a synthetic dataset representing 500 personal current account customers at Northgate Retail Bank. The dataset is structured in two categories, reflecting the two types of data used in TM analytics:"),
  spacer(),
  body("Category 1 — Reference Data: Customer attributes that describe who the customer is, their risk classification, and their relationship to the institution. Reference data is typically static or slow-moving."),
  spacer(),

  regTable(
    ["Column", "Type", "Description"],
    [
      ["customer_id", "String", "Unique customer identifier (NRB_001 to NRB_500)"],
      ["customer_type", "Categorical", "Account holder type: 'personal' or 'business'"],
      ["account_type", "Categorical", "Product type: current account, savings, etc."],
      ["geography", "Categorical", "State or region of account registration"],
      ["crr_score", "Integer", "Customer risk rating: 1 (low) to 5 (high) — output of KYC process"],
      ["risk_category", "Categorical", "Risk band derived from CRR: Low / Medium / High"],
      ["account_age_months", "Integer", "Number of months since account opening (tenure indicator)"],
    ],
    [2000, 1400, 5626]
  ),
  spacer(),
  body("Category 2 — Transactional Data / Transaction Summaries: Numeric behavioural metrics derived from transaction history. These are the features used in bottom-up clustering. They are numeric, time-windowed, and updated periodically."),
  spacer(),

  regTable(
    ["Column", "Type", "Description"],
    [
      ["avg_monthly_cash_in", "Numeric", "Average monthly cash deposit total (USD) over the prior 12 months"],
      ["avg_transaction_count", "Numeric", "Average number of cash deposit transactions per month"],
      ["avg_monthly_wire_out", "Numeric", "Average monthly outbound wire transfer value (USD)"],
      ["unique_counterparties_30d", "Integer", "Number of distinct counterparties in the most recent 30-day window"],
      ["is_sar_worthy", "Binary", "Ground truth label: 1 = associated with a known SAR outcome (exercise use only — not available to the TMS in production)"],
    ],
    [2200, 1400, 5426]
  ),
  spacer(),

  body("The dataset is generated synthetically to reflect realistic distributions for a US retail bank: most customers have low cash transaction volumes, a small proportion are cash-intensive, and a further small proportion exhibit the elevated volumes and risk scores associated with structuring behaviour."),
  spacer(),

  h3("5.8.2 The Mule Network in the Cluster Structure"),
  body("The Northgate mule network accounts have the following characteristics, based on the transaction data from earlier chapters:"),
  bulletMixed([smallBold("avg_monthly_cash_in: "), smallRun("USD 8,200")]),
  bulletMixed([smallBold("avg_transaction_count: "), smallRun("4.2 deposits per month")]),
  bulletMixed([smallBold("account_age_months: "), smallRun("8 months")]),
  bulletMixed([smallBold("customer_type: "), smallRun("personal")]),
  bulletMixed([smallBold("crr_score: "), smallRun("2 (medium)")]),
  spacer(),

  body("This profile places the mule accounts in an interesting position in the cluster structure. Their cash-in volume (USD 8,200 per month) is significantly above the typical personal account customer, whose average monthly cash-in is around USD 650. But their transaction count (4.2 per month) is relatively low — suggesting that each deposit is relatively large. Their account age (8 months) is short relative to the general population, which skews toward accounts of 3 or more years. Their CRR of 2 reflects a medium risk profile: not the highest-risk segment, but elevated relative to a standard retail customer."),
  body("In a K=3 clustering exercise on the full dataset, these characteristics typically place the mule accounts in a 'medium-volume, elevated-risk' cluster — not in the cash-intensive business cluster (which has much higher transaction counts) and not in the standard retail cluster (which has much lower volumes). This matters for threshold calibration: the threshold applied to this cluster will be higher than the standard retail threshold, potentially allowing the mule accounts to continue accumulating cash without triggering the structuring rule."),
  callout("Key Insight — Segmentation and Calibration Must Be Done Together",
    "Segmentation can inadvertently make detection harder if thresholds are not recalibrated per segment. Assigning the Northgate mule accounts to a medium-volume cluster — and applying that cluster's threshold — may raise the bar that their behaviour needs to cross before triggering an alert. A threshold appropriate for the cluster's typical member is not necessarily appropriate for detecting the most suspicious members of that cluster. This is precisely why segmentation and threshold calibration must be performed together, not sequentially. Chapter 6 addresses this directly.",
    "FFF3E6"),
  spacer(),

  h2("5.9 Colab Walkthrough: K-Means in Practice"),
  body("The following code applies K-Means (K=3) to the Northgate customer population using three behavioural features: average monthly cash in, transaction frequency, and cash-to-total ratio. Run it in the Chapter 5 Colab notebook to see which cluster each customer falls into — and crucially, which cluster contains the six mule accounts. The cluster labels from this step feed directly into the threshold tuning exercise in Chapter 6."),
  codeBox("📊 Colab Preview: Segmenting the Northgate Customer Population", [
    "import pandas as pd",
    "from sklearn.cluster import KMeans",
    "from sklearn.preprocessing import StandardScaler",
    "",
    "df_txn  = pd.read_csv('nb_transactions.csv', parse_dates=['txn_date'])",
    "df_cust = pd.read_csv('nb_customers.csv')",
    "",
    "# Build customer-level behavioural features",
    "feats = df_txn.groupby('account_id').agg(",
    "    avg_monthly_cash_in = ('amount',",
    "        lambda x: x[df_txn.loc[x.index,'txn_type']=='CASH_IN'].sum() / 12),",
    "    txn_frequency       = ('txn_id', 'count'),",
    "    cash_ratio          = ('txn_type',",
    "        lambda x: (x == 'CASH_IN').mean()),",
    ").fillna(0)",
    "",
    "# Standardise before clustering",
    "scaler = StandardScaler()",
    "X = scaler.fit_transform(feats)",
    "",
    "# Fit K-Means with K=3",
    "km = KMeans(n_clusters=3, random_state=42, n_init='auto')",
    "feats['segment'] = km.fit_predict(X)",
    "",
    "# Summarise each segment",
    "print(feats.groupby('segment').agg(",
    "    n_customers = ('txn_frequency', 'count'),",
    "    avg_cash_in = ('avg_monthly_cash_in', 'mean'),",
    "    avg_freq    = ('txn_frequency', 'mean'),",
    ").round(0))",
  ]),
  outputBox("▶ Real Output — K-Means Cluster Summary (K=3)", [
    "          n_customers  avg_cash_in  avg_freq",
    "segment                                    ",
    "0                 235        452.0      28.0",
    "1                 259        967.0      63.0",
    "2                   6      48473.0      66.0",
    "",
    "Mule account segments: [2 2 2 2 2 2]",
  ]),
  imageBlock('/sessions/intelligent-blissful-clarke/mnt/aml-book1/ch5_kmeans_scatter.png', 400, 267),
  body("The output shows three behavioural segments. Segment 2 contains exactly six customers — all six mule accounts (ACC0001–ACC0006) — with an average monthly cash-in of USD 48,473, an order of magnitude higher than the other two segments. The scatter chart makes this separation visually clear: the mule accounts (★) cluster in an isolated region of high cash volume and high transaction frequency. Exercise 5.1 asks you to label each segment with a business description and assign monitoring parameters appropriate to the risk level of each group."),
  spacer(),

  h2("5.10 Risk Considerations"),
  calloutMixed("Risk Considerations", [
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Over-segmentation: "), smallRun("Too many segments produces peer groups so small that the peer comparison loses statistical power. A cluster of twelve customers cannot reliably establish what 'normal' looks like for that group. Minimum cluster sizes should be defined as part of the segmentation governance framework.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Under-segmentation: "), smallRun("Too few segments groups behaviourally diverse customers together. Thresholds calibrated for the average of a diverse group will be too high for the low-end customers and too low for the high-end customers. The result is simultaneously over-alerting in some sub-populations and under-alerting in others.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Gaming: "), smallRun("If a customer becomes aware that monitoring thresholds vary by segment, and that they can influence their segment assignment by manipulating the characteristics used for clustering, they may do so. This is a known risk in any segmented monitoring system. Mitigation involves using multiple segmentation features, including some that are difficult to manipulate (such as account age), and reviewing segment assignments periodically against behavioural change.")] }),
    new Paragraph({ spacing: { after: 0 }, children: [smallBold("Regulatory examination of clusters: "), smallRun("Examiners will want to understand not just the clustering methodology but the business interpretation of each cluster and the thresholds assigned to it. Institutions should maintain clear documentation of the segmentation rationale and be prepared to demonstrate that each cluster is interpretable, defensible, and consistently applied.")] }),
  ], "FFF3E6"),
  spacer(),

  takeawayBox([
    "Segmentation divides the customer population into peer groups and applies monitoring parameters appropriate to each group. It reduces false positives and improves coverage simultaneously.",
    "Top-down segmentation uses pre-defined attributes (product, industry, CRR). Bottom-up segmentation uses clustering algorithms to derive groups from observed behaviour.",
    "K-Means is the most widely used clustering algorithm in AML. It partitions customers into K groups by minimising within-cluster variance. Choosing K requires both statistical analysis (elbow method, silhouette score) and business judgement.",
    "Clusters must be interpreted in business terms: what type of customer does each cluster represent, what transaction behaviour is normal in that cluster, and what threshold is appropriate?",
    "Regulatory defensibility requires documentation: data used, features selected, algorithm chosen, K selection rationale, cluster interpretation, and validation results.",
    "Hierarchical clustering is suited to small populations and provides a dendrogram that reveals the structure of cluster relationships without requiring K to be specified in advance.",
    "TDA identifies structural features in high-dimensional data — including ring structures in transaction networks — that distance-based clustering methods miss.",
    "The Northgate mule accounts fall in a medium-volume, elevated-risk cluster. Their cluster assignment affects the threshold they are monitored against, which is why segmentation and threshold calibration must be done together.",
    "An institution implementing its first segmentation model is transitioning from Basic to Established maturity. Institutions at the Advanced stage have completed multiple rounds of segmentation review and validation, with documented evidence that segment boundaries remain appropriate as the customer population evolves.",
  ]),
  spacer(),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Exercise 5.1 — Segmenting the Northgate Customer Population  [Intermediate / Advanced]", font: "Arial", size: 22, bold: true, color: "2E75B6" })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Recap: "), smallRun("In Exercise 4.1 you designed the structuring rule. Now we add segmentation to improve its precision and ensure that monitoring thresholds are appropriate for each customer group.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Colab Extension: "), smallRun("Section 5.9 of the text showed K-Means applied to three behavioural features. This exercise extends that codebase. Open the Chapter 5 Colab notebook: the feats DataFrame and the fitted km model from Section 5.9 are already in memory in Cell 1. Part A asks you to experiment with K and additional features. Part B uses the cluster labels produced by the notebook to set segment-specific thresholds for Rule 1.")] }),
    spacer(),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Part A — Extend the K-Means Model  [Intermediate]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("Use the code below to generate the synthetic Northgate dataset and apply K-Means clustering with K=3 and K=5. Plot the clusters using a scatter plot of avg_monthly_cash_in vs avg_transaction_count, with cluster membership shown by colour. Then answer:")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallBold("Note on ground truth: "), smallRun("In this exercise, is_sar_worthy = 1 is concentrated in the elevated-risk sub-population for clarity of illustration. In a real dataset, suspicious activity appears in any segment — genuine SARs emerge from standard retail customers; some elevated-risk accounts are legitimately active. This is precisely why below-the-line sampling (Chapter 6) is essential: segment assignment alone cannot confirm where the suspicious activity is hiding.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("Which value of K produces more interpretable peer groups? Justify your choice using the elbow method, silhouette score, and business interpretation of the clusters.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("Name each cluster based on its centroid characteristics and propose a monitoring threshold appropriate to each cluster.")] }),
    spacer(),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("Python code:"), smallRun(" (save as generate_and_cluster.py)")] }),
    codeBlock([
      "import numpy as np, pandas as pd, matplotlib.pyplot as plt",
      "from sklearn.cluster import KMeans",
      "from sklearn.preprocessing import StandardScaler",
      "from sklearn.metrics import silhouette_score",
      "",
      "np.random.seed(42)",
      "n = 500",
      "",
      "# Generate synthetic customer population",
      "cash_in = np.concatenate([",
      "    np.random.lognormal(6.0, 0.5, 350),   # Standard retail: low-medium volume",
      "    np.random.lognormal(8.2, 0.4, 100),   # Cash-intensive: high volume",
      "    np.random.lognormal(9.0, 0.3, 50)     # Elevated risk: very high volume",
      "])",
      "txn_count = np.concatenate([",
      "    np.random.poisson(2.1, 350),",
      "    np.random.poisson(8.5, 100),",
      "    np.random.poisson(4.3, 50)",
      "])",
      "age = np.concatenate([",
      "    np.random.randint(12, 120, 350),",
      "    np.random.randint(6, 60, 100),",
      "    np.random.randint(3, 18, 50)",
      "])",
      "cust_type = ['personal']*350 + ['business']*100 + ['personal']*50",
      "crr = np.concatenate([",
      "    np.random.choice([1,2], 350, p=[0.7,0.3]),",
      "    np.random.choice([2,3], 100, p=[0.4,0.6]),",
      "    np.random.choice([2,3,4], 50, p=[0.3,0.4,0.3])",
      "])",
      "is_sar = np.concatenate([np.zeros(350), np.zeros(100), np.ones(50)]).astype(int)",
      "ids = [f'NRB_{str(i+1).zfill(3)}' for i in range(n)]",
      "",
      "df = pd.DataFrame({'customer_id': ids, 'avg_monthly_cash_in': np.round(cash_in,2),",
      "    'avg_transaction_count': np.round(np.maximum(txn_count,1).astype(float),1),",
      "    'account_age_months': age, 'customer_type': cust_type,",
      "    'crr_score': crr, 'is_sar_worthy': is_sar})",
      "df.to_csv('northgate_customers.csv', index=False)",
      "",
      "# Cluster on numeric features only",
      "features = df[['avg_monthly_cash_in','avg_transaction_count',",
      "               'account_age_months','crr_score']]",
      "scaler = StandardScaler()",
      "X = scaler.fit_transform(features)",
      "",
      "# Elbow method",
      "inertias = []",
      "for k in range(2,9):",
      "    km = KMeans(n_clusters=k, random_state=42, n_init=10)",
      "    km.fit(X)",
      "    inertias.append(km.inertia_)",
      "plt.figure(); plt.plot(range(2,9), inertias, 'bo-')",
      "plt.xlabel('K'); plt.ylabel('Inertia'); plt.title('Elbow Method')",
      "plt.savefig('elbow.png', dpi=150); plt.close()",
      "",
      "# Fit K=3 and K=5",
      "for k in [3, 5]:",
      "    km = KMeans(n_clusters=k, random_state=42, n_init=10)",
      "    labels = km.fit_predict(X)",
      "    sil = silhouette_score(X, labels)",
      "    print(f'K={k} | Silhouette: {sil:.3f}')",
      "    df[f'cluster_k{k}'] = labels",
      "    plt.figure(figsize=(8,5))",
      "    for c in range(k):",
      "        mask = labels == c",
      "        plt.scatter(df.loc[mask,'avg_monthly_cash_in'],",
      "                    df.loc[mask,'avg_transaction_count'],",
      "                    label=f'Cluster {c}', alpha=0.6, s=30)",
      "    # Plot mule network point",
      "    plt.scatter([8200],[4.2], color='red', marker='*', s=200,",
      "                label='Mule accounts', zorder=5)",
      "    plt.xlabel('Avg Monthly Cash-In (USD)')",
      "    plt.ylabel('Avg Transaction Count / Month')",
      "    plt.title(f'K-Means K={k} — Northgate Customer Segmentation')",
      "    plt.legend(); plt.tight_layout()",
      "    plt.savefig(f'clusters_k{k}.png', dpi=150); plt.close()",
      "",
      "print('Dataset saved. Plots saved.')",
    ]),
    spacer(),
    new Paragraph({ spacing: { after: 60 }, children: [smallBold("R code:"), smallRun(" (save as cluster_northgate.R)")] }),
    codeBlock([
      "set.seed(42)",
      "n <- 500",
      "",
      "cash_in <- c(rlnorm(350, 6.0, 0.5), rlnorm(100, 8.2, 0.4), rlnorm(50, 9.0, 0.3))",
      "txn_count <- c(rpois(350,2.1), rpois(100,8.5), rpois(50,4.3))",
      "txn_count <- pmax(txn_count, 1)",
      "age <- c(sample(12:120,350,T), sample(6:60,100,T), sample(3:18,50,T))",
      "cust_type <- c(rep('personal',350), rep('business',100), rep('personal',50))",
      "crr <- c(sample(c(1,2),350,T,c(0.7,0.3)),",
      "         sample(c(2,3),100,T,c(0.4,0.6)),",
      "         sample(c(2,3,4),50,T,c(0.3,0.4,0.3)))",
      "is_sar <- c(rep(0,450), rep(1,50))",
      "ids <- sprintf('NRB_%03d', 1:n)",
      "",
      "df <- data.frame(customer_id=ids, avg_monthly_cash_in=round(cash_in,2),",
      "  avg_transaction_count=round(txn_count,1), account_age_months=age,",
      "  customer_type=cust_type, crr_score=crr, is_sar_worthy=is_sar)",
      "write.csv(df, 'northgate_customers.csv', row.names=FALSE)",
      "",
      "library(cluster)",
      "features <- scale(df[,c('avg_monthly_cash_in','avg_transaction_count',",
      "                         'account_age_months','crr_score')])",
      "",
      "# Elbow method",
      "inertias <- sapply(2:8, function(k) kmeans(features,k,nstart=10)$tot.withinss)",
      "png('elbow_R.png'); plot(2:8, inertias, type='b', xlab='K', ylab='Inertia',",
      "  main='Elbow Method'); dev.off()",
      "",
      "for (k in c(3,5)) {",
      "  km <- kmeans(features, k, nstart=10)",
      "  sil <- mean(silhouette(km$cluster, dist(features))[,3])",
      "  cat(sprintf('K=%d | Silhouette: %.3f\\n', k, sil))",
      "  df[[paste0('cluster_k',k)]] <- km$cluster",
      "  png(sprintf('clusters_k%d_R.png', k), width=800, height=500)",
      "  plot(df$avg_monthly_cash_in, df$avg_transaction_count,",
      "       col=rainbow(k)[km$cluster], pch=16, cex=0.6,",
      "       xlab='Avg Monthly Cash-In (USD)',",
      "       ylab='Avg Transaction Count / Month',",
      "       main=sprintf('K-Means K=%d — Northgate Segmentation', k))",
      "  points(8200, 4.2, col='red', pch=8, cex=2, lwd=2)",
      "  legend('topright', legend=c(paste('Cluster',1:k),'Mule accounts'),",
      "         col=c(rainbow(k),'red'), pch=c(rep(16,k),8))",
      "  dev.off()",
      "}",
      "cat('Done.\\n')",
    ]),
    spacer(),
  ]),

  exerciseBox([
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Part B — The Mule Network in the Cluster Structure  [Advanced]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("The Northgate mule accounts have the following characteristics: avg_monthly_cash_in = USD 8,200; avg_transaction_count = 4.2/month; account_age_months = 8; customer_type = personal; crr_score = 2.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("Using the K=3 or K=5 solution from Part A (whichever you judged superior), determine which cluster the mule accounts would be assigned to. Show your calculation: project the mule account characteristics into the standardised feature space and compute the distance to each centroid.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [smallRun("What does the cluster assignment tell you about the monitoring threshold that would be applied to these accounts? Is this threshold appropriate for detecting their behaviour? Explain the risk.")] }),
    new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 }, children: [smallRun("Propose a modification to the segmentation approach — either to the feature set, the value of K, or the threshold assignment methodology — that would improve detection of the mule network without substantially increasing noisy alert rates for legitimate customers in the same cluster.")] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallItalic("In Chapter 6, we calibrate the threshold for each segment using hypergeometric sampling and responsiveness analysis.")] }),
  ]),

  exerciseBox([
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Part C — Meridian Trading Ltd: Commercial Peer Group Design  [Applied / Out-of-the-Box]", font: "Arial", size: 20, bold: true, color: MID_BLUE })] }),
    new Paragraph({ spacing: { after: 80 }, children: [smallRun("The K-Means clustering in Parts A and B segmented Northgate's personal current account population. Meridian Trading Ltd — a business current account — falls outside that segmentation entirely. Project Sentinel's data scientist must design a separate peer group for commercial accounts. Meridian's profile: SIC code 46690 (Wholesale of other machinery/equipment), annual turnover USD 2.1 million (self-declared), 14 months trading history, two directors, primarily international wire activity.")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 60 }, children: [smallRun("What variables would you use to construct a peer group for Meridian? Propose five features (including at least one that is specific to commercial accounts and not available for retail accounts). For each, state the data source, the CDE classification (yes/no), and the main quality risk.")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 60 }, children: [smallRun("The data scientist cannot find a sufficient number of US import/export businesses with similar SIC code and turnover in the bank's customer population to form a statistically meaningful peer group. She proposes a proxy: use SEC/State business registry data to identify all UK-registered SIC 46690 businesses with turnover between USD 1 million and USD 5 million and treat them as the peer universe, supplementing with internal account data where available. Identify at least three survivorship biases or selection biases in this proxy approach that could distort the peer comparison.")] }),
    new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { after: 0 }, children: [smallRun("Given the difficulty of constructing a statistically robust peer group for Meridian, Project Sentinel's compliance officer suggests applying a fixed absolute threshold to all commercial accounts rather than a peer-relative threshold. Evaluate this proposal. What are the false positive and false negative risks? Is a fixed threshold regulatory defensible under a risk-based approach? What would you recommend instead?")] }),
  ]),
  spacer(),

  h2("Further Reading and Research Topics"),
  numbered("FCA Guidance Consultation GC19/3: Guidance on the use of algorithms in financial services. This document sets out the FCA's expectations for the governance, validation, and documentation of algorithmic models — including segmentation models that determine which customers are subject to enhanced monitoring. Pay particular attention to Section 3 on explainability requirements."),
  numbered("Hartigan, J.A. and Wong, M.A. (1979), 'Algorithm AS 136: A K-Means Clustering Algorithm', Applied Statistics, 28(1), 100–108. This is the original paper describing the K-Means algorithm. Read Section 2 (the algorithm) and Section 4 (convergence). What does the original paper say about initialisation sensitivity — and what does this imply for reproducibility of AML segmentation runs?"),
  numbered("Research Question: The Basel Committee on Banking Supervision's 'Sound management of risks related to money laundering and financing of terrorism' (2020) states that banks should use a risk-based approach when determining monitoring intensity. How does customer segmentation operationalise this requirement? Write a one-paragraph explanation in the style of a model governance document."),
  numbered("The FCA's Financial Crime Guide section 8.1.3 discusses the use of peer group analysis in AML programmes. Download and read it. The FCA states that peer groups should be 'meaningful and appropriate.' Evaluate whether your Chapter 5 K-Means peer groups would satisfy this standard — and what evidence you would need to produce to demonstrate it to an examiner."),
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
    headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } }, children: [new TextRun({ text: "Applied AML Analytics  |  Chapter 5", font: "Arial", size: 18, color: MID_BLUE })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", font: "Arial", size: 18, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "888888" })] })] }) },
    children
  }]
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync('/sessions/intelligent-blissful-clarke/mnt/aml-book1/AML_Book_Project/Book1_Chapter5.docx', buf); console.log('Done: Book1_Chapter5.docx'); });

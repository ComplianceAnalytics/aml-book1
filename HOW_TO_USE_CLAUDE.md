# HOW_TO_USE_CLAUDE.md — Session Guide for Haibo Zhang

This file explains how to work with Claude effectively for the AML book project.

---

## Starting a Session

At the start of each writing session, paste or attach the relevant files and say what you want to accomplish. Example:

> "Here's my CLAUDE.md and BOOK1_OUTLINE.md. I want to draft Chapter 5 on Segmentation today. It should cover K-Means, hierarchical clustering, and TDA, with a worked example and exercises in Python."

The more context you give, the better the output.

---

## What Claude Can Do for Your Books

### Drafting
- Draft full chapter sections from your outline notes
- Write introductions, learning objectives, and summaries for each chapter
- Write exercise questions and worked answers (flag for your review)
- Draft case study narratives (anonymised)

### Editing
- Edit for clarity, precision, and consistent tone (see VOICE_GUIDE.md)
- Check that terminology matches GLOSSARY.md definitions
- Suggest structural improvements to argument flow
- Tighten verbose sections

### Research Support
- Summarise regulatory documents (FFIEC, JMLSG, FATF) into usable content
- Find and cite relevant AML fines and enforcement cases
- Explain technical concepts (K-Means, TDA, UML) clearly for different audience levels
- Draft regulatory comparison tables

### Technical Writing
- Write Python and R code examples for exercises
- Document model validation procedures
- Write template instructions and playbook steps

### Document Production
- **docx skill** → formatted Word chapter files, ready for editing or submission
- **xlsx skill** → Excel templates: Team Size Calculator, Risk Coverage Mapping Sheet, tuning templates
- **pdf skill** → final compiled sections or reference documents

---

## Skills to Use

| Task | Skill |
|---|---|
| Writing/editing a chapter as a Word file | **docx** |
| Creating any Excel template or calculator | **xlsx** |
| Producing a PDF reference document | **pdf** |
| Writing and running Python/R code | Built-in (no skill needed) |

---

## Reference Files in This Folder

| File | Purpose |
|---|---|
| `CLAUDE.md` | Master project context — share at start of every session |
| `VOICE_GUIDE.md` | Tone, style, and writing conventions |
| `BOOK1_OUTLINE.md` | Full chapter outline for Book 1 |
| `BOOK2_OUTLINE.md` | Full chapter outline for Book 2 |
| `GLOSSARY.md` | Authoritative AML terminology definitions |
| `HOW_TO_USE_CLAUDE.md` | This file |

---

## Tips for Best Results

1. **Share the relevant outline chapter** when asking Claude to draft — it gives better structure
2. **Paste in your own notes or bullet points** and ask Claude to develop them into prose
3. **Ask Claude to match the voice guide** explicitly: "Draft this in the style described in VOICE_GUIDE.md"
4. **Review all regulatory claims** — Claude will flag where it is uncertain, but you should verify citations
5. **Iterate** — ask Claude to revise, tighten, or expand specific sections rather than starting over
6. **For templates and tools** — describe the columns, logic, and use case clearly so Claude builds them correctly

---

## What Claude Will Not Do

- Invent regulatory statistics or fake citations — it will flag uncertainties and ask you to verify
- Override the GLOSSARY.md definitions — if a term conflicts, it will flag it
- Produce final regulatory advice — this is a book, not legal counsel

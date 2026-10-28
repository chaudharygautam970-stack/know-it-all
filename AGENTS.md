# AGENTS.md — Intelligence Hub Operating Instructions for AI Agents & Developers

This document defines the strict operating standards, architectural boundaries, and implementation rules for any human developer or AI coding agent modifying the Intelligence Hub codebase.

---

## 1. Project Mission & Core Philosophy

**Intelligence Hub** is a web-based intelligence and opportunity discovery platform organizing news, AI and technology developments, scholarships, internships, grants, and government schemes.

The platform is built on four non-negotiable principles:
1. **Source Transparency & Attribution**: Every article or opportunity must retain its original source name, publisher, retrieved timestamp, and direct link to the primary reporting outlet.
2. **Zero Automated Article Rewriting**: Never automatically summarize or paraphrase third-party news in a way that risks distorting facts or violating copyright law.
3. **Anti-Fabrication Verification**: Never invent eligibility criteria, deadlines, or funding amounts. If a provider has not explicitly stated a field, mark it explicitly as `unknown` / `Not explicitly stated`.
4. **Transparent Material Corrections**: All updates to published records must be recorded in an immutable public audit log with timestamp, author, previous value, new value, and reason.

---

## 2. Technology Stack & Directory Conventions

- **Framework**: Next.js (App Router convention) with React 19
- **Language**: TypeScript (`strict: true`)
- **Styling**: Tailwind CSS with custom design tokens for statuses and surfaces
- **Runtime & Local Server**: Modern Node.js (`v24+`), using native `--experimental-strip-types` and native `node:test`
- **Future Database / Auth (Phase 3+)**: Supabase PostgreSQL with Row Level Security (RLS) and Supabase Auth

### Directory Tree:
```
intelligence-hub/
├── AGENTS.md                 # Agent and developer guidelines (this document)
├── README.md                 # User-facing setup, principles, and roadmap
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript compiler settings
├── tailwind.config.ts        # Design tokens and theme extensions
├── postcss.config.js         # Tailwind PostCSS configuration
├── next.config.ts            # Security headers & content security policy
├── .env.example              # Safe environment variable template (no real secrets)
├── tests/                    # Automated test suites
│   ├── domain-rules.test.ts  # Verification & copyright compliance unit tests
│   └── sample-data.test.ts   # Demonstration dataset schema tests
└── src/
    ├── app/                  # Next.js App Router views
    │   ├── layout.tsx        # Global application shell & navigation
    │   ├── page.tsx          # Homepage Intelligence Dashboard
    │   ├── news/page.tsx     # General News feed
    │   ├── ai-tech/page.tsx  # AI & Technology feed
    │   ├── opportunities/page.tsx # Opportunity Discovery feed
    │   ├── search/page.tsx   # Search & multi-facet filters
    │   ├── saved/page.tsx    # Bookmarked items & notes
    │   ├── login/page.tsx    # Auth placeholder (Phase 3 Supabase)
    │   ├── admin/page.tsx    # Verification & moderation console
    │   └── globals.css       # Global stylesheet & design tokens
    ├── components/
    │   ├── layout/           # Navbar, Footer, DemoBanner
    │   └── ui/               # Badge, StatusIndicator, AttributionNotice, CorrectionNotice
    ├── lib/
    │   ├── design-system.ts  # Status calculation, date formatting, label maps
    │   ├── validation.ts     # Domain input validators
    │   └── sample-data.ts    # Labelled sample demonstration data
    ├── types/
    │   └── index.ts          # Core domain TypeScript definitions
    └── server.js             # Standalone local HTTP server & API
```

---

## 3. Strict Operating Rules for Agents

### Rule A: News & Copyright Standards
- Do **not** reproduce complete third-party articles.
- Preserve the original `sourceUrl` and attribution text.
- If content is syndicated, explicitly mark it and link back to the original reporting agency.
- Never invent publication times or publishers.

### Rule B: Opportunity Verification Standards
- Dynamic status calculation must use `determineOpportunityStatus`:
  - `open`: deadline is $> 7$ days in the future.
  - `closing_soon`: deadline is $\le 7$ days in the future.
  - `closed`: deadline is in the past.
  - `unknown`: deadline is not explicitly given by the provider.
- Never guarantee funding or eligibility to any user.

### Rule C: Phased Implementation Workflow
1. **Phase 1**: Foundation, design system, layout, routes, and sample data. *(Current)*
2. **Phase 2**: Complete interactive frontend with search, filters, and local bookmarks.
3. **Phase 3**: Supabase PostgreSQL database, Row Level Security, and Supabase Auth.
4. **Phase 4**: Permitted RSS and API content ingestion pipelines.
5. **Phase 5**: Administrative verification, moderation queues, and correction workflows.
6. **Phase 6**: Security review, production audit, and deployment.

**Do not jump ahead to future phases without user confirmation.**

### Rule D: Security Rules
- **Never commit API keys, database credentials, or service role keys.**
- Use `.env.example` as a template with placeholder values only.
- In production, enforce Row Level Security for all user data.
- Validate all incoming data using `src/lib/validation.ts`.

---

## 4. Verification & Testing Commands

To run the automated test suite locally:
```bash
node --experimental-strip-types --test tests/**/*.test.ts
```

To run the local development server:
```bash
node src/server.js
```
The server binds to `http://localhost:3000`.

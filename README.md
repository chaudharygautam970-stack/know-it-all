# Intelligence Hub

An open, verifiable web-based intelligence and opportunity discovery platform organizing news, AI & technology developments, scholarships, internships, grants, and government schemes.

---

## 1. Project Philosophy & Core Principles

Intelligence Hub is engineered around four core pillars:

1. **Source Transparency & Attribution**: Every piece of information preserves its original reporting URL, publishing entity, and retrieval timestamp. We never reproduce entire articles without documented authorization, nor do we invent summaries.
2. **Anti-Fabrication Verification**: Unknown fields (such as discretionary grant amounts, unannounced deadlines, or non-specific eligibility rules) are represented explicitly as `unknown` / `Not explicitly stated`. We never invent dates or financial figures.
3. **Transparent Corrections**: If any source information changes or an error is identified, material modifications are logged in an immutable, visible audit trail with timestamp, modifier, and reasoning.
4. **Security by Design**: Secrets and credentials stay strictly on the server (`.env.local`), database operations enforce Supabase Row Level Security (RLS), and user inputs undergo strict schema validation.

---

## 2. Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router convention, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing enabled)
- **Styling & Design System**: [Tailwind CSS](https://tailwindcss.com/) with accessible design tokens
- **Data & Auth (Phase 3+)**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security & Supabase Auth)
- **Ingestion (Phase 4+)**: Permitted RSS feeds and authenticated APIs with documented licensing
- **Testing**: Built-in Node.js native test runner (`node:test`) with TypeScript stripping

---

## 3. Directory Structure

```
intelligence-hub/
├── AGENTS.md                 # Agent & contributor implementation manual
├── README.md                 # Project architecture, principles, and roadmap
├── package.json              # Project dependencies, scripts, and ESM config
├── tsconfig.json             # Strict TypeScript configuration
├── tailwind.config.ts        # Design system tokens (statuses, verification, surfaces)
├── postcss.config.js         # PostCSS pipeline for Tailwind CSS
├── next.config.ts            # Next.js security headers & CSP
├── .env.example              # Safe template for environment variables (no secrets)
├── .gitignore                # Protects secrets and build artifacts
├── tests/
│   ├── domain-rules.test.ts  # Verification & copyright compliance unit tests (9 tests)
│   └── sample-data.test.ts   # Demonstration dataset schema tests (3 tests)
└── src/
    ├── app/                  # Next.js App Router views
    │   ├── layout.tsx        # Global application shell & navigation
    │   ├── page.tsx          # Homepage Intelligence Dashboard
    │   ├── news/page.tsx     # General News & Policy feed
    │   ├── ai-tech/page.tsx  # AI & Technology feed
    │   ├── opportunities/page.tsx # Opportunity Discovery feed
    │   ├── search/page.tsx   # Global search & discovery interface
    │   ├── saved/page.tsx    # Saved items & personal notes
    │   ├── login/page.tsx    # Authentication entrypoint (Phase 3 Supabase roadmap)
    │   ├── admin/page.tsx    # Administrative verification & moderation console
    │   └── globals.css       # Design tokens, variables, focus rings, accessibility
    ├── components/
    │   ├── layout/
    │   │   ├── DemoBanner.tsx # Persistent demonstration data disclaimer
    │   │   ├── Navbar.tsx     # Responsive navigation bar & mobile drawer
    │   │   └── Footer.tsx     # Transparent attribution & repository links
    │   └── ui/
    │       ├── AttributionNotice.tsx # Original source attribution & license notice
    │       ├── Badge.tsx             # Semantic type & verification badges
    │       ├── CorrectionNotice.tsx  # Transparent audit history of modifications
    │       └── StatusIndicator.tsx   # Color-coded opportunity deadline pills
    ├── lib/
    │   ├── design-system.ts  # Dynamic status calculation & formatting helpers
    │   ├── validation.ts     # Input validation enforcing copyright & domain rules
    │   └── sample-data.ts    # Labelled sample demonstration data
    ├── types/
    │   └── index.ts          # Strongly typed domain models & schemas
    └── server.js             # Standalone local HTTP server & REST API
```

---

## 4. Phase 1 Accomplishments

- [x] **Project Foundation & TypeScript Setup**: Next.js App Router layout, page components, and types configured.
- [x] **Design System & Tailwind CSS**: Theme tokens for 4 opportunity statuses (`open`, `closing_soon`, `closed`, `unknown`) and 4 verification tiers (`verified`, `unverified`, `disputed`, `under_review`).
- [x] **Navigation Shell**: Responsive desktop navbar, quick search bar, and mobile navigation drawer.
- [x] **Homepage Dashboard**: Key metric cards, urgent closing-soon alert box, and highlights grid.
- [x] **Placeholder Routes**:
  - `/news` — General News & Policy Feed
  - `/ai-tech` — AI & Technology Feed
  - `/opportunities` — Opportunity Discovery with filter controls
  - `/search` — Global search & multi-facet filters
  - `/saved` — Saved items & notes
  - `/login` — Authentication placeholder explaining Phase 3 Supabase Auth roadmap
  - `/admin` — Verification & moderation console with audit queue
- [x] **Sample Demonstration Data**: Realistic, labelled sample datasets with explicit unknown flags.
- [x] **Automated Test Suites**: 12/12 unit tests passing for copyright rules and sample data schemas.
- [x] **Operating Instructions**: Comprehensive `AGENTS.md` created.

---

## 5. Running the Project Locally

### 1. Run Automated Tests
Execute the domain rules and data integrity test suite:
```bash
node --experimental-strip-types --test tests/**/*.test.ts
```

### 2. Start the Local Server
Run the local HTTP application server:
```bash
node src/server.js
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to interact with the application.

---

## 6. Phased Roadmap

- [x] **Phase 1: Project Foundation, Routes, & Design System**
- [ ] **Phase 2: Frontend MVP with Interactive Search & Filters**
- [ ] **Phase 3: Database, Authentication, and Saved Items (Supabase)**
- [ ] **Phase 4: Permitted Data Ingestion (RSS & APIs)**
- [ ] **Phase 5: Verification and Administration Workflows**
- [ ] **Phase 6: Security Review, Testing, and Deployment**

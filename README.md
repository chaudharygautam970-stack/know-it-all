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
│   └── sample-data.test.ts   # Demonstration dataset & slug routing tests (6 tests)
└── src/
    ├── app/                  # Next.js App Router views
    │   ├── layout.tsx        # Global application shell & navigation
    │   ├── page.tsx          # Homepage Overview Dashboard
    │   ├── news/
    │   │   ├── page.tsx      # General News & Policy feed with category filters
    │   │   └── [slug]/page.tsx # News record detail page
    │   ├── technology/
    │   │   └── page.tsx      # AI & Technology Radar with domain filters
    │   ├── ai-tech/
    │   │   └── page.tsx      # Alias pointing to /technology
    │   ├── opportunities/
    │   │   ├── page.tsx      # Opportunity Discovery with type, status & region filters
    │   │   └── [slug]/page.tsx # Opportunity full specification detail page
    │   ├── search/page.tsx   # Global unified search & multi-facet filters
    │   ├── saved/page.tsx    # Saved items, persistent local bookmarks & notes
    │   ├── login/page.tsx    # Authentication entrypoint (Phase 3 Supabase roadmap)
    │   ├── admin/page.tsx    # Administrative verification & moderation console
    │   └── globals.css       # Design tokens, variables, focus rings, accessibility
    ├── components/
    │   ├── layout/
    │   │   ├── DemoBanner.tsx # Persistent demonstration data disclaimer
    │   │   ├── Navbar.tsx     # Dark graphite primary navigation & mobile drawer
    │   │   └── Footer.tsx     # Transparent attribution & repository links
    │   └── ui/
    │       ├── AttributionNotice.tsx # Original source attribution & license notice
    │       ├── Badge.tsx             # Semantic type & verification badges
    │       ├── BookmarkButton.tsx    # Interactive bookmark button with local storage sync
    │       ├── CorrectionNotice.tsx  # Transparent audit history of modifications
    │       ├── EmptyState.tsx        # Reusable empty states with filter reset action
    │       ├── NewsCard.tsx          # Editorial intelligence card with detail link
    │       ├── OpportunityCard.tsx   # Structured specification card with status badge
    │       └── StatusIndicator.tsx   # Color-coded opportunity deadline pills
    ├── lib/
    │   ├── data/
    │   │   ├── news.ts          # Sample news across India, World, Business, Science, Policy
    │   │   ├── technology.ts    # Sample technology (LLMs, Agents, Startups, Dev Tools)
    │   │   └── opportunities.ts # Sample scholarships, internships, grants, schemes
    │   ├── design-system.ts     # Dynamic status calculation & formatting helpers
    │   ├── validation.ts        # Input validation enforcing copyright & domain rules
    │   └── sample-data.ts       # Central aggregator and slug resolution utilities
    ├── types/
    │   └── index.ts             # Strongly typed domain models & schemas
    └── server.js                # Standalone local HTTP server & REST API
```

---

## 4. Phase 2 Deliverables Completed

- [x] **Primary Navigation**: Dark graphite navigation bar with Overview, News, AI & Technology, Opportunities, Saved Items, and Search; live bookmark counter badge and mobile drawer.
- [x] **Homepage / Overview Dashboard**:
  - Section A: Dashboard header with overview title, search input, and quick category shortcuts.
  - Section B: Featured developments grid with editorial cards and detail page links.
  - Section C: Latest general and policy news listing with source attribution.
  - Section D: AI & Technology Radar tracking LLMs, autonomous agents, and compilers.
  - Section E: Opportunity discovery feed with scholarships, grants, and schemes.
  - Section F: Deadline awareness box highlighting opportunities closing within 7 days.
  - Section G: Working view-all navigation links for every section.
- [x] **News Page (`/news`)**: Real-time keyword search, 7 category filters (India, World, Business, Science, Policy, Environment, All), date sorting, and empty state.
- [x] **AI & Technology Page (`/technology` & `/ai-tech`)**: Technical intelligence radar with domain filters (LLMs, AI Agents, Dev Tools, Startups, Research), date sorting, and detail links.
- [x] **Opportunities Page (`/opportunities`)**: Catalog with filters for opportunity types (Scholarships, Internships, Grants, Schemes, Fellowships), deadline status (Open, Closing Soon, Closed, Deadline Not Provided), region, and sorting.
- [x] **Detail Pages**:
  - `/news/[slug]` — Full attribution, publisher link, authorized brief excerpt, tags, and transparent correction history.
  - `/opportunities/[slug]` — Program specification, issuing organization, region, funding value, application deadline pill, eligibility criteria, verification evidence link, and official portal link.
  - Graceful Not-Found handling for invalid slugs.
- [x] **Global Search Page (`/search`)**: Cross-cutting search matching titles, excerpts, provider names, and tags, with result-type tabs (All, Opportunities, Technology, News), query preservation from navbar, and clear button.
- [x] **Saved Items (`/saved`)**: Working bookmarks stored in browser `localStorage`. Pinned items persist across page refreshes, prevent duplicates, and allow personal research notes.
- [x] **Centralized Sample Data Module**: Structured under `src/lib/data/` with stable unique IDs, slugs, and explicit unknown field disclosures.
- [x] **Automated Test Suites**: 15/15 unit tests passing.

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
- [x] **Phase 2: Frontend MVP with Interactive Search, Filters, Detail Pages & Bookmarks**
- [ ] **Phase 3: Database, Authentication, and Saved Items (Supabase PostgreSQL & Auth)**
- [ ] **Phase 4: Permitted Data Ingestion (RSS & APIs)**
- [ ] **Phase 5: Verification and Administration Workflows**
- [ ] **Phase 6: Security Review, Testing, and Deployment**

# Intelligence Hub

An open, verifiable web-based intelligence and opportunity discovery platform that organizes news, AI & technology developments, scholarships, internships, grants, and government schemes.

## 1. Project Philosophy & Core Principles

Intelligence Hub is engineered around four core pillars:
1. **Source Transparency**: Every piece of information preserves its original reporting URL, publishing entity, and retrieval timestamp. We never reproduce entire articles without documented authorization, nor do we invent summaries.
2. **Anti-Fabrication Verification**: Unknown fields (such as discretionary grant amounts, unannounced deadlines, or non-specific eligibility rules) are represented explicitly as `unknown` / `unspecified`. We never invent dates or financial figures.
3. **Transparent Corrections**: If any source information changes or an error is identified, material modifications are logged in an immutable, visible audit trail with timestamp, modifier, and reasoning.
4. **Security by Design**: Secrets and credentials stay strictly on the server (`.env.local`), database operations enforce Supabase Row Level Security (RLS), and user inputs undergo strict schema validation.

---

## 2. Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing enabled)
- **Styling & Design System**: [Tailwind CSS](https://tailwindcss.com/) with accessible design tokens
- **Data & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security & Supabase Auth)
- **Ingestion**: Permitted RSS feeds and authenticated APIs with documented licensing
- **Testing**: Built-in Node.js native test runner (`node:test`) with TypeScript stripping

---

## 3. Architecture & Directory Structure

```
intelligence-hub/
├── .env.example             # Safe template for environment variables (no secrets)
├── next.config.ts           # Next.js security headers & content security policy
├── package.json             # Project dependencies, scripts, and ESM config
├── postcss.config.js        # PostCSS pipeline for Tailwind CSS
├── tailwind.config.ts       # Design system tokens (statuses, verification, surfaces)
├── tsconfig.json            # Strict TypeScript configuration
├── tests/
│   └── domain-rules.test.ts # Automated test suite for copyright & verification rules
└── src/
    ├── app/
    │   └── globals.css      # Design tokens, variables, focus rings, accessibility
    ├── components/
    │   ├── ui/
    │   │   ├── AttributionNotice.tsx # Original source attribution & license notice
    │   │   ├── Badge.tsx             # Semantic type & verification badges
    │   │   ├── CorrectionNotice.tsx  # Transparent audit history of modifications
    │   │   └── StatusIndicator.tsx   # Color-coded opportunity deadline pills
    │   └── layout/                   # Header, responsive navigation drawer, footer
    ├── lib/
    │   ├── design-system.ts # Status calculation, date formatting, label lookups
    │   └── validation.ts    # Input validation enforcing copyright & domain rules
    └── types/
        └── index.ts         # Strongly-typed domain models & verification schemas
```

---

## 4. News & Opportunity Verification Standards

### Section 5: News & Copyright Enforcement
- **No Automatic Rewriting**: Headlines and excerpts must match source attribution without automated paraphrasing that distorts facts.
- **Original Source Links**: Readers are always provided with the direct link to the primary publisher.
- **Syndication Transparency**: Syndicated or wire agency articles are explicitly marked with links to the original reporting outlet.

### Section 6: Opportunity Verification Standards
- **Explicit Unknowns**: If a provider does not state a deadline, the status is displayed as `Deadline Unspecified` (`unknown`), rather than guessing or leaving a blank.
- **Dynamic Status Lifecycle**:
  - `Open`: Deadline is greater than 7 days in the future.
  - `Closing Soon`: Deadline is within 7 calendar days.
  - `Closed`: Deadline has elapsed.
  - `Deadline Unspecified`: Ongoing, rolling, or unstated by provider.
- **No Funding Guarantees**: We explicitly emphasize that listings do not guarantee user eligibility or funding receipt.

---

## 5. Development Roadmap (Phased Workflow)

- [x] **Phase 1: Project Foundation & Design System**
  - Architecture and directory tree setup.
  - TypeScript types for news, opportunities, verifications, and audit logs.
  - Design tokens for statuses (`open`, `closing_soon`, `closed`, `unknown`) and verification states.
  - Foundation UI components (`AttributionNotice`, `StatusIndicator`, `CorrectionNotice`, `Badge`).
  - Automated test suite verifying attribution enforcement, anti-fabrication rules, and deadline logic.
- [ ] **Phase 2: Frontend MVP with Clearly Labelled Sample Data**
  - Responsive Dashboard, News Feed, AI/Tech Feed, Opportunity Discovery, Search/Filters.
  - Demonstration data clearly marked to prevent misinterpretation as real-time information.
- [ ] **Phase 3: Database, Authentication, and Saved Items**
  - Supabase schema migrations, RLS policies, user authentication, and bookmarks.
- [ ] **Phase 4: Permitted Data Ingestion**
  - Safe RSS/API ingestion pipelines respecting rate limits and publisher permissions.
- [ ] **Phase 5: Verification and Administration**
  - Moderator/Admin interface to verify claims, dispute inaccuracies, and log corrections.
- [ ] **Phase 6: Security Review, Testing, and Deployment**
  - Comprehensive security audits, end-to-end testing, and production deployment.

---

## 6. Running Tests & Development

Run the domain rules verification test suite:
```bash
node --experimental-strip-types --test tests/domain-rules.test.ts
```

// @ts-check
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data store initialized from verified sample dataset
let newsItems = [
  {
    id: "news-001",
    title: "National Quantum Computing Initiative Announces Academic Research Grants",
    url: "https://www.example.gov/science/quantum-initiative-2026",
    category: "ai-tech",
    attribution: {
      sourceName: "National Science Foundation",
      sourceUrl: "https://www.example.gov/science",
      publisher: "Office of Science & Technology",
      retrievedAt: "2026-10-28T08:00:00Z",
      isSyndicated: false,
    },
    publishedAt: "2026-10-27T14:30:00Z",
    discoveredAt: "2026-10-27T15:00:00Z",
    isLicensed: true,
    licensingNotes: "Public Domain U.S. Government Work",
    tags: ["Quantum", "Research Grants", "Federal", "Physics"],
    correctionHistory: [
      {
        id: "corr-news-1",
        timestamp: "2026-10-27T18:00:00Z",
        fieldChanged: "title",
        previousValue: "National Quantum Initiative Announces Industry Grants",
        newValue: "National Quantum Computing Initiative Announces Academic Research Grants",
        reason: "Clarified that initial funding round is restricted to accredited academic research institutes.",
        recordedBy: "admin_verifier_01",
      },
    ],
  },
  {
    id: "news-002",
    title: "Open Evaluation Standards Released for Autonomous Decision-Making Systems",
    url: "https://www.example-standards.org/press/ai-safety-metrics-v2",
    category: "ai-tech",
    attribution: {
      sourceName: "Global AI Safety Consortium",
      sourceUrl: "https://www.example-standards.org",
      publisher: "Consortium Press",
      retrievedAt: "2026-10-28T09:15:00Z",
      isSyndicated: true,
      originalReportingUrl: "https://www.example-standards.org/reports/safety-benchmarks-2026",
    },
    publishedAt: "2026-10-28T07:45:00Z",
    discoveredAt: "2026-10-28T08:00:00Z",
    isLicensed: true,
    licensingNotes: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    tags: ["AI Safety", "Benchmarks", "Standards", "Open Source"],
    correctionHistory: [],
  },
  {
    id: "news-003",
    title: "International Renewable Energy Exchange Upgrades Grid Interconnection Protocols",
    url: "https://www.example-energy.int/news/grid-modernization-october",
    category: "general",
    attribution: {
      sourceName: "International Energy Exchange",
      sourceUrl: "https://www.example-energy.int",
      publisher: "Energy Secretariat",
      retrievedAt: "2026-10-28T06:00:00Z",
      isSyndicated: false,
    },
    publishedAt: "2026-10-26T12:00:00Z",
    discoveredAt: "2026-10-26T13:30:00Z",
    isLicensed: false,
    licensingNotes: "Standard publisher copyright - fair use headline attribution",
    tags: ["Clean Energy", "Infrastructure", "Global Policy"],
    correctionHistory: [],
  },
  {
    id: "news-004",
    title: "Semiconductor Workforce Development Fund Expands Apprenticeship Allocations",
    url: "https://www.example.gov/labor/chips-workforce-allocations",
    category: "general",
    attribution: {
      sourceName: "Department of Labor",
      sourceUrl: "https://www.example.gov/labor",
      publisher: "Employment & Training Administration",
      retrievedAt: "2026-10-28T04:20:00Z",
      isSyndicated: false,
    },
    publishedAt: "2026-10-25T16:00:00Z",
    discoveredAt: "2026-10-25T17:10:00Z",
    isLicensed: true,
    licensingNotes: "Public Domain Government Notice",
    tags: ["Semiconductors", "Workforce", "Apprenticeships", "Economy"],
    correctionHistory: [],
  },
];

let opportunities = [
  {
    id: "opp-001",
    title: "Doctoral Research Fellowship in Safe Autonomous Systems",
    opportunityType: "scholarship",
    providerName: "Institute for Advanced Machine Learning",
    providerType: "university",
    sourceUrl: "https://www.example-uni.edu/admissions/fellowships/safe-ai-2027",
    description: "Fully funded 3-year doctoral research stipend focusing on verification methods for machine learning models and formal guarantees.",
    eligibilityCriteria: "Applicants must hold a Master's degree in Computer Science, Applied Mathematics, or a related discipline with demonstrated research experience.",
    isEligibilityExplicit: true,
    fundingAmount: "$48,000 / year stipend + full tuition waiver",
    isFundingExplicit: true,
    deadline: "2026-11-03T23:59:59Z",
    isDeadlineExplicit: true,
    status: "closing_soon",
    verification: {
      status: "verified",
      lastVerifiedAt: "2026-10-27T10:00:00Z",
      verifiedBy: "moderator_lead",
      evidenceUrl: "https://www.example-uni.edu/bulletins/verified-grants-2026.pdf",
      notes: "Confirmed through university graduate admissions portal.",
    },
    correctionHistory: [],
    tags: ["AI Research", "PhD", "Tuition Waiver", "Machine Learning"],
    createdAt: "2026-10-15T09:00:00Z",
    updatedAt: "2026-10-27T10:00:00Z",
  },
  {
    id: "opp-002",
    title: "National Small Business Green Technology Commercialization Grant",
    opportunityType: "grant",
    providerName: "Federal Department of Energy & Innovation",
    providerType: "government",
    sourceUrl: "https://www.example.gov/energy/sbir-phase1-green-tech",
    description: "Early-stage non-dilutive seed capital for small enterprises deploying scalable decarbonization and grid-resilience technology solutions.",
    eligibilityCriteria: "For-profit entities with fewer than 500 employees, majority locally owned, proposing novel clean-tech prototypes.",
    isEligibilityExplicit: true,
    fundingAmount: "Up to $275,000 for Phase I feasibility",
    isFundingExplicit: true,
    deadline: "2026-12-15T17:00:00Z",
    isDeadlineExplicit: true,
    status: "open",
    verification: {
      status: "verified",
      lastVerifiedAt: "2026-10-26T14:30:00Z",
      verifiedBy: "system_rss_crawler",
      evidenceUrl: "https://www.example.gov/grants/feed-item-8829",
      notes: "Official grant announcement indexed via approved federal API.",
    },
    correctionHistory: [],
    tags: ["CleanTech", "Government Grant", "Small Business", "Non-Dilutive"],
    createdAt: "2026-10-20T11:00:00Z",
    updatedAt: "2026-10-26T14:30:00Z",
  },
  {
    id: "opp-003",
    title: "Undergraduate Systems & High-Performance Computing Summer Internship",
    opportunityType: "internship",
    providerName: "Cray Research Computing Laboratories",
    providerType: "employer",
    sourceUrl: "https://www.example-labs.com/careers/internships/systems-2027",
    description: "12-week paid engineering internship working on parallel distributed storage architectures and kernel performance profiling.",
    eligibilityCriteria: "Current undergraduate students pursuing computer science or computer engineering graduating between Dec 2027 and June 2028.",
    isEligibilityExplicit: true,
    fundingAmount: "$38.50 / hour + housing assistance stipend",
    isFundingExplicit: true,
    deadline: "2026-11-25T23:59:59Z",
    isDeadlineExplicit: true,
    status: "open",
    verification: {
      status: "verified",
      lastVerifiedAt: "2026-10-28T07:00:00Z",
      verifiedBy: "moderator_tech",
      evidenceUrl: "https://www.example-labs.com/careers/verified-roles.json",
      notes: "Verified against direct employer career portal posting.",
    },
    correctionHistory: [],
    tags: ["Summer 2027", "HPC", "Systems", "Paid Internship"],
    createdAt: "2026-10-18T13:00:00Z",
    updatedAt: "2026-10-28T07:00:00Z",
  },
  {
    id: "opp-004",
    title: "Agricultural Micro-Irrigation Modernization Scheme",
    opportunityType: "scheme",
    providerName: "State Department of Rural Development",
    providerType: "government",
    sourceUrl: "https://www.example.gov/agriculture/schemes/drip-subsidy",
    description: "Capital subsidy program for farmers implementing sensor-assisted micro-irrigation and water conservation mechanisms.",
    eligibilityCriteria: null,
    isEligibilityExplicit: false,
    fundingAmount: null,
    isFundingExplicit: false,
    deadline: null,
    isDeadlineExplicit: false,
    status: "unknown",
    verification: {
      status: "verified",
      lastVerifiedAt: "2026-10-24T12:00:00Z",
      verifiedBy: "admin_verifier_02",
      evidenceUrl: "https://www.example.gov/agriculture/gazette-notification-49.pdf",
      notes: "Subsidy tiers depend on district agro-climatic zone; explicit criteria not stated globally.",
    },
    correctionHistory: [
      {
        id: "corr-opp-4-1",
        timestamp: "2026-10-25T09:00:00Z",
        fieldChanged: "fundingAmount",
        previousValue: "Up to 80% subsidy",
        newValue: null,
        reason: "Removed inferred percentage; official guidelines state subsidy is determined individually by regional committee.",
        recordedBy: "admin_verifier_02",
      },
    ],
    tags: ["Agriculture", "Subsidy", "Water Conservation", "Rural Development"],
    createdAt: "2026-10-12T08:00:00Z",
    updatedAt: "2026-10-25T09:00:00Z",
  },
  {
    id: "opp-005",
    title: "Civic Open Data & Algorithmic Transparency Project Grant",
    opportunityType: "grant",
    providerName: "Open Civic Foundation",
    providerType: "grant_provider",
    sourceUrl: "https://www.example-foundation.org/grants/civic-data-2026",
    description: "Grant support for independent journalists, academics, and civic technologists auditing public sector algorithmic risk assessment tools.",
    eligibilityCriteria: "Non-profit organizations, university research groups, and accredited independent investigative newsrooms.",
    isEligibilityExplicit: true,
    fundingAmount: "Grants ranging from $25,000 to $75,000",
    isFundingExplicit: true,
    deadline: "2026-10-15T23:59:59Z",
    isDeadlineExplicit: true,
    status: "closed",
    verification: {
      status: "verified",
      lastVerifiedAt: "2026-10-28T00:00:00Z",
      verifiedBy: "system_cron",
      evidenceUrl: "https://www.example-foundation.org/grants/civic-data-2026",
      notes: "Deadline elapsed on October 15, 2026. Portal closed for this cycle.",
    },
    correctionHistory: [],
    tags: ["Civic Tech", "Transparency", "Auditing", "Public Interest"],
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-10-28T00:00:00Z",
  },
  {
    id: "opp-006",
    title: "Regional STEM Innovation Stipend for High School Graduates",
    opportunityType: "scholarship",
    providerName: "Tech Forward Foundation",
    providerType: "grant_provider",
    sourceUrl: "https://www.example-techforward.org/stipends/2026",
    description: "One-time transitional stipend for underrepresented students matriculating into undergraduate electrical engineering or physics degrees.",
    eligibilityCriteria: "Graduating high school seniors with verified admission to an accredited bachelor's STEM program.",
    isEligibilityExplicit: true,
    fundingAmount: "$5,000 single lump-sum grant",
    isFundingExplicit: true,
    deadline: "2026-11-04T18:00:00Z",
    isDeadlineExplicit: true,
    status: "closing_soon",
    verification: {
      status: "under_review",
      lastVerifiedAt: "2026-10-27T16:00:00Z",
      verifiedBy: "moderator_lead",
      evidenceUrl: "https://www.example-techforward.org/press/annual-stipends",
      notes: "Pending confirmation from donor trust concerning final applicant cap.",
    },
    correctionHistory: [],
    tags: ["Scholarship", "High School Seniors", "STEM", "Engineering"],
    createdAt: "2026-10-21T15:30:00Z",
    updatedAt: "2026-10-27T16:00:00Z",
  },
];

let savedItemIds = new Set();
let savedNotes = {};

const PORT = 3000;

const server = http.createServer((req, res) => {
  // CORS & Security Headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  const parsedUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;

  // --------------------------------------------------------------------------
  // API Routes
  // --------------------------------------------------------------------------
  if (pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }));
  }

  if (pathname === "/api/data" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        isDemo: true,
        disclaimer:
          "DEMONSTRATION DATA MODE: All records below are simulated sample data for testing and demonstration purposes. Sourcing standards and attribution links reflect real specifications.",
        news: newsItems,
        opportunities: opportunities,
        savedIds: Array.from(savedItemIds),
        savedNotes: savedNotes,
      })
    );
  }

  if (pathname === "/api/bookmark" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { id, note } = JSON.parse(body);
        if (savedItemIds.has(id)) {
          savedItemIds.delete(id);
          delete savedNotes[id];
        } else {
          savedItemIds.add(id);
          if (note) savedNotes[id] = note;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ success: true, savedIds: Array.from(savedItemIds) }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  if (pathname === "/api/verify" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { id, status, evidenceUrl, notes, adminId } = JSON.parse(body);
        const opp = opportunities.find((o) => o.id === id);
        if (!opp) {
          res.writeHead(404, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Opportunity not found" }));
        }
        opp.verification = {
          status,
          lastVerifiedAt: new Date().toISOString(),
          verifiedBy: adminId || "admin_session",
          evidenceUrl: evidenceUrl || opp.verification.evidenceUrl,
          notes: notes || opp.verification.notes,
        };
        opp.updatedAt = new Date().toISOString();
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ success: true, opportunity: opp }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  if (pathname === "/api/correct" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { id, type, fieldChanged, previousValue, newValue, reason, recordedBy } = JSON.parse(body);
        const list = type === "news" ? newsItems : opportunities;
        const item = list.find((i) => i.id === id);
        if (!item) {
          res.writeHead(404, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Item not found" }));
        }

        const correction = {
          id: `corr-${Date.now()}`,
          timestamp: new Date().toISOString(),
          fieldChanged,
          previousValue: previousValue !== undefined ? previousValue : item[fieldChanged] || null,
          newValue,
          reason,
          recordedBy: recordedBy || "moderator_session",
        };

        item.correctionHistory.unshift(correction);
        if (fieldChanged && fieldChanged in item) {
          item[fieldChanged] = newValue;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ success: true, item }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  // --------------------------------------------------------------------------
  // Web Application Frontend
  // --------------------------------------------------------------------------
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(renderFullHtmlPage());
});

function renderFullHtmlPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Intelligence Hub — Verified Intelligence & Opportunity Discovery</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          colors: {
            brand: {
              50: '#eef2ff',
              100: '#e0e7ff',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
            }
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Inter', sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col">

  <!-- Top Demo Banner -->
  <div class="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-semibold flex items-center justify-between border-b border-amber-600/20">
    <div class="flex items-center gap-2 max-w-6xl mx-auto w-full">
      <span class="inline-block px-1.5 py-0.5 bg-amber-950 text-amber-100 rounded text-[10px] tracking-wide uppercase">Demonstration Data</span>
      <span class="truncate">All records displayed are simulated sample data for interface testing and verification workflows. Citations and URLs follow official formats.</span>
    </div>
  </div>

  <!-- Main Navbar -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
          IH
        </div>
        <div>
          <h1 class="text-base font-bold text-slate-900 leading-tight">Intelligence Hub</h1>
          <p class="text-[11px] text-slate-500 hidden sm:block">Reliable News, AI & Opportunity Discovery</p>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="flex-1 max-w-md mx-2">
        <div class="relative">
          <input
            id="searchInput"
            type="text"
            placeholder="Search keywords, providers, or grants..."
            class="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            oninput="handleSearch(this.value)"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Navigation tabs -->
      <nav class="hidden md:flex items-center gap-1 text-xs font-medium">
        <button onclick="setView('dashboard')" class="nav-btn px-3 py-2 rounded-md hover:bg-slate-100 transition-colors active-tab" data-view="dashboard">Dashboard</button>
        <button onclick="setView('news')" class="nav-btn px-3 py-2 rounded-md hover:bg-slate-100 transition-colors" data-view="news">General News</button>
        <button onclick="setView('aitech')" class="nav-btn px-3 py-2 rounded-md hover:bg-slate-100 transition-colors" data-view="aitech">AI & Tech</button>
        <button onclick="setView('opportunities')" class="nav-btn px-3 py-2 rounded-md hover:bg-slate-100 transition-colors" data-view="opportunities">Opportunities</button>
        <button onclick="setView('saved')" class="nav-btn px-3 py-2 rounded-md hover:bg-slate-100 transition-colors relative" data-view="saved">
          Saved
          <span id="savedCountBadge" class="ml-1 px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold">0</span>
        </button>
        <button onclick="setView('admin')" class="nav-btn px-3 py-2 rounded-md text-amber-700 hover:bg-amber-50 transition-colors font-semibold" data-view="admin">Admin Console</button>
        <button onclick="setView('login')" class="ml-1 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors" data-view="login">Sign In</button>
      </nav>

      <!-- Mobile Menu Toggle -->
      <button onclick="toggleMobileMenu()" class="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div id="mobileMenu" class="hidden md:hidden border-t border-slate-200 bg-white px-4 py-2 space-y-1 text-xs font-medium">
      <button onclick="setView('dashboard'); toggleMobileMenu();" class="block w-full text-left py-2 px-3 rounded hover:bg-slate-100">Dashboard</button>
      <button onclick="setView('news'); toggleMobileMenu();" class="block w-full text-left py-2 px-3 rounded hover:bg-slate-100">General News</button>
      <button onclick="setView('aitech'); toggleMobileMenu();" class="block w-full text-left py-2 px-3 rounded hover:bg-slate-100">AI & Tech</button>
      <button onclick="setView('opportunities'); toggleMobileMenu();" class="block w-full text-left py-2 px-3 rounded hover:bg-slate-100">Opportunities</button>
      <button onclick="setView('saved'); toggleMobileMenu();" class="block w-full text-left py-2 px-3 rounded hover:bg-slate-100">Saved Items</button>
      <button onclick="setView('admin'); toggleMobileMenu();" class="block w-full text-left py-2 px-3 rounded text-amber-700 hover:bg-amber-50">Admin Console</button>
      <button onclick="setView('login'); toggleMobileMenu();" class="block w-full text-left py-2 px-3 rounded font-bold text-indigo-600 hover:bg-indigo-50">Sign In (Phase 3 Roadmap)</button>
    </div>
  </header>

  <!-- Main Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

    <!-- VIEW 1: DASHBOARD -->
    <div id="view-dashboard" class="view-panel space-y-6">
      <div class="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Intelligence Dashboard</h2>
          <p class="text-xs text-slate-500 mt-0.5">Real-time overview of verified opportunities, research funding, and technical developments.</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Live Platform Healthy
          </span>
        </div>
      </div>

      <!-- Summary KPI Metric Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Opportunities</div>
          <div class="mt-2 flex items-baseline justify-between">
            <span id="kpiTotalOpp" class="text-2xl font-bold text-slate-900">6</span>
            <span class="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-medium">Cataloged</span>
          </div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Closing Soon</div>
          <div class="mt-2 flex items-baseline justify-between">
            <span id="kpiClosingSoon" class="text-2xl font-bold text-amber-600">2</span>
            <span class="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">&le; 7 Days</span>
          </div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Verified Sources</div>
          <div class="mt-2 flex items-baseline justify-between">
            <span id="kpiVerified" class="text-2xl font-bold text-emerald-600">5</span>
            <span class="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">100% Attributed</span>
          </div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">News Discovered</div>
          <div class="mt-2 flex items-baseline justify-between">
            <span id="kpiNews" class="text-2xl font-bold text-slate-900">4</span>
            <span class="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">AI & General</span>
          </div>
        </div>
      </div>

      <!-- Urgent Closing Soon Notice -->
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-amber-100 text-amber-800 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-amber-900">Time-Sensitive Opportunities Requiring Attention</h3>
            <p class="text-xs text-amber-700 mt-0.5">2 opportunities have confirmed deadlines closing within the next 7 calendar days.</p>
            <div id="urgentOppList" class="mt-3 space-y-2">
              <!-- Injected dynamically -->
            </div>
          </div>
        </div>
      </div>

      <!-- Fast Access Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Recent Intelligence Highlights -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-slate-900">Latest Intelligence Feed</h3>
            <button onclick="setView('news')" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800">View All &rarr;</button>
          </div>
          <div id="dashboardNewsList" class="space-y-3">
            <!-- Injected dynamically -->
          </div>
        </div>

        <!-- Featured Grants & Scholarships -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-slate-900">Featured Discovery</h3>
            <button onclick="setView('opportunities')" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Browse Catalog &rarr;</button>
          </div>
          <div id="dashboardOppList" class="space-y-3">
            <!-- Injected dynamically -->
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 2: GENERAL NEWS -->
    <div id="view-news" class="view-panel hidden space-y-6">
      <div class="border-b border-slate-200 pb-4">
        <h2 class="text-xl font-bold text-slate-900">General News Feed</h2>
        <p class="text-xs text-slate-500 mt-0.5">Directly attributed reporting, economic developments, workforce announcements, and public policy.</p>
      </div>
      <div id="generalNewsList" class="space-y-4">
        <!-- Injected dynamically -->
      </div>
    </div>

    <!-- VIEW 3: AI & TECH FEED -->
    <div id="view-aitech" class="view-panel hidden space-y-6">
      <div class="border-b border-slate-200 pb-4">
        <h2 class="text-xl font-bold text-slate-900">AI & Technology Developments</h2>
        <p class="text-xs text-slate-500 mt-0.5">Scientific research breakthroughs, safety evaluations, computational milestones, and technical standards.</p>
      </div>
      <div id="aiTechNewsList" class="space-y-4">
        <!-- Injected dynamically -->
      </div>
    </div>

    <!-- VIEW 4: OPPORTUNITY DISCOVERY -->
    <div id="view-opportunities" class="view-panel hidden space-y-6">
      <div class="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Opportunity Discovery</h2>
          <p class="text-xs text-slate-500 mt-0.5">Verified scholarships, internships, grants, and government schemes with transparent sourcing.</p>
        </div>
        <div class="text-xs text-slate-500">
          Showing <span id="oppResultCount" class="font-bold text-slate-900">6</span> opportunities
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <!-- Filter Row 1: Types -->
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="font-semibold text-slate-700 mr-1">Type:</span>
          <button onclick="setFilter('type', 'all')" class="filter-type px-2.5 py-1 rounded-full border text-xs font-medium bg-indigo-50 text-indigo-700 border-indigo-200" data-val="all">All Types</button>
          <button onclick="setFilter('type', 'scholarship')" class="filter-type px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 text-slate-600 border-slate-200" data-val="scholarship">Scholarships</button>
          <button onclick="setFilter('type', 'internship')" class="filter-type px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 text-slate-600 border-slate-200" data-val="internship">Internships</button>
          <button onclick="setFilter('type', 'grant')" class="filter-type px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 text-slate-600 border-slate-200" data-val="grant">Grants</button>
          <button onclick="setFilter('type', 'scheme')" class="filter-type px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 text-slate-600 border-slate-200" data-val="scheme">Govt Schemes</button>
        </div>

        <!-- Filter Row 2: Statuses -->
        <div class="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-slate-100">
          <span class="font-semibold text-slate-700 mr-1">Status:</span>
          <button onclick="setFilter('status', 'all')" class="filter-status px-2.5 py-1 rounded-full border text-xs font-medium bg-indigo-50 text-indigo-700 border-indigo-200" data-val="all">All Statuses</button>
          <button onclick="setFilter('status', 'open')" class="filter-status px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 text-slate-600 border-slate-200" data-val="open">Open</button>
          <button onclick="setFilter('status', 'closing_soon')" class="filter-status px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 text-slate-600 border-slate-200" data-val="closing_soon">Closing Soon (&le;7d)</button>
          <button onclick="setFilter('status', 'closed')" class="filter-status px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 text-slate-600 border-slate-200" data-val="closed">Closed</button>
          <button onclick="setFilter('status', 'unknown')" class="filter-status px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 text-slate-600 border-slate-200" data-val="unknown">Deadline Unspecified</button>
        </div>
      </div>

      <!-- Opportunities Card Feed -->
      <div id="opportunitiesList" class="space-y-4">
        <!-- Injected dynamically -->
      </div>
    </div>

    <!-- VIEW 5: SAVED ITEMS -->
    <div id="view-saved" class="view-panel hidden space-y-6">
      <div class="border-b border-slate-200 pb-4">
        <h2 class="text-xl font-bold text-slate-900">Saved Opportunities & News</h2>
        <p class="text-xs text-slate-500 mt-0.5">Your bookmarked intelligence items and personal research notes.</p>
      </div>
      <div id="savedItemsList" class="space-y-4">
        <!-- Injected dynamically -->
      </div>
    </div>

    <!-- VIEW 6: ADMINISTRATIVE CONSOLE -->
    <div id="view-admin" class="view-panel hidden space-y-6">
      <div class="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase">Staff Role</span>
            <h2 class="text-xl font-bold text-slate-900">Verification & Moderation Console</h2>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Audit records, attach evidence URLs, verify claims, and record transparent public corrections.</p>
        </div>
      </div>

      <!-- Quick Action Controls -->
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 class="text-sm font-bold text-slate-900">Administrative Actions</h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          In compliance with <strong>Section 5 (News and Copyright Rules)</strong> and <strong>Section 6 (Opportunity Verification Rules)</strong>, moderators must never invent requirements or claim verification without official evidence links. All material edits produce permanent audit log entries.
        </p>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th class="py-2.5 px-3">Title / Item</th>
                <th class="py-2.5 px-3">Type</th>
                <th class="py-2.5 px-3">Provider / Source</th>
                <th class="py-2.5 px-3">Current Verification</th>
                <th class="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="adminTableBody" class="divide-y divide-slate-100">
              <!-- Injected dynamically -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Transparent Audit & Correction Log -->
      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 class="text-sm font-bold text-slate-900">Global Material Change & Correction Log</h3>
        <p class="text-xs text-slate-500">Every change to fields, deadlines, funding, or titles is permanently recorded here for public transparency.</p>
        <div id="adminAuditLog" class="space-y-2">
          <!-- Injected dynamically -->
        </div>
      </div>
    </div>

    <!-- VIEW 7: LOGIN PLACEHOLDER (PHASE 3 ROADMAP) -->
    <div id="view-login" class="view-panel hidden max-w-md mx-auto py-8 space-y-6">
      <div class="text-center space-y-1">
        <div class="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
          IH
        </div>
        <h2 class="text-xl font-bold text-slate-900">Sign In to Intelligence Hub</h2>
        <p class="text-xs text-slate-500">Synchronize bookmarked opportunities, research alerts, and moderation actions.</p>
      </div>

      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input type="email" disabled placeholder="user@example.edu" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed text-xs" />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Password</label>
            <input type="password" disabled placeholder="••••••••••••" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed text-xs" />
          </div>
          <button type="button" disabled class="w-full py-2.5 bg-slate-300 text-slate-500 rounded-lg font-semibold text-xs cursor-not-allowed">
            Sign In (Locked in Phase 1)
          </button>
        </div>

        <div class="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-900 space-y-1.5">
          <div class="font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-indigo-500" aria-hidden="true"></span>
            Phase 3 Architectural Roadmap
          </div>
          <p class="text-[11px] leading-relaxed text-indigo-800">
            Per Phase 1 security requirements, live authentication is scheduled for <strong>Phase 3</strong>. It will utilize Supabase Auth with server-side session cookies, email magic links, and Row Level Security policies.
          </p>
        </div>
      </div>

      <div class="text-center">
        <button onclick="setView('dashboard')" class="text-xs font-semibold text-indigo-600 hover:underline">
          &larr; Return to Dashboard
        </button>
      </div>
    </div>

  </main>

  <!-- Verification Action Modal -->
  <div id="verifyModal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
      <div class="flex items-center justify-between border-b pb-3">
        <h3 class="text-sm font-bold text-slate-900">Update Verification Status</h3>
        <button onclick="closeVerifyModal()" class="text-slate-400 hover:text-slate-600">&times;</button>
      </div>
      <input type="hidden" id="modalOppId" />
      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-medium text-slate-700 mb-1">Target Item</label>
          <div id="modalOppTitle" class="p-2 bg-slate-50 rounded text-slate-800 font-semibold border text-xs"></div>
        </div>
        <div>
          <label class="block font-medium text-slate-700 mb-1">Verification Status</label>
          <select id="modalVerifyStatus" class="w-full p-2 border rounded bg-white">
            <option value="verified">Verified (Official Source Confirmed)</option>
            <option value="under_review">Under Review (Pending Donor Confirmation)</option>
            <option value="disputed">Disputed (Contradictory Information)</option>
            <option value="unverified">Unverified (Third-Party Aggregator)</option>
          </select>
        </div>
        <div>
          <label class="block font-medium text-slate-700 mb-1">Official Evidence URL (Required)</label>
          <input type="url" id="modalEvidenceUrl" placeholder="https://provider.gov/bulletin.pdf" class="w-full p-2 border rounded" />
        </div>
        <div>
          <label class="block font-medium text-slate-700 mb-1">Verifier Notes</label>
          <textarea id="modalVerifyNotes" rows="2" placeholder="Confirmed through official portal..." class="w-full p-2 border rounded"></textarea>
        </div>
      </div>
      <div class="flex justify-end gap-2 pt-2 border-t">
        <button onclick="closeVerifyModal()" class="px-3 py-1.5 rounded text-xs text-slate-600 hover:bg-slate-100">Cancel</button>
        <button onclick="submitVerification()" class="px-4 py-1.5 rounded text-xs bg-indigo-600 text-white font-medium hover:bg-indigo-700">Save Verification</button>
      </div>
    </div>
  </div>

  <!-- Material Correction Modal -->
  <div id="correctModal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
      <div class="flex items-center justify-between border-b pb-3">
        <h3 class="text-sm font-bold text-slate-900">Record Material Correction</h3>
        <button onclick="closeCorrectModal()" class="text-slate-400 hover:text-slate-600">&times;</button>
      </div>
      <input type="hidden" id="correctItemId" />
      <input type="hidden" id="correctItemType" />
      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-medium text-slate-700 mb-1">Item</label>
          <div id="correctItemTitle" class="p-2 bg-slate-50 rounded text-slate-800 font-semibold border text-xs"></div>
        </div>
        <div>
          <label class="block font-medium text-slate-700 mb-1">Field Corrected</label>
          <input type="text" id="correctField" placeholder="e.g. deadline, fundingAmount, title" class="w-full p-2 border rounded" />
        </div>
        <div>
          <label class="block font-medium text-slate-700 mb-1">New Value</label>
          <input type="text" id="correctNewVal" placeholder="Enter corrected value" class="w-full p-2 border rounded" />
        </div>
        <div>
          <label class="block font-medium text-slate-700 mb-1">Reason for Material Correction</label>
          <textarea id="correctReason" rows="2" placeholder="Official source updated deadline..." class="w-full p-2 border rounded"></textarea>
        </div>
      </div>
      <div class="flex justify-end gap-2 pt-2 border-t">
        <button onclick="closeCorrectModal()" class="px-3 py-1.5 rounded text-xs text-slate-600 hover:bg-slate-100">Cancel</button>
        <button onclick="submitCorrection()" class="px-4 py-1.5 rounded text-xs bg-amber-600 text-white font-medium hover:bg-amber-700">Publish Transparent Correction</button>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <p class="font-medium text-slate-700">Intelligence Hub — Discovery & Verification Platform</p>
        <p class="text-[11px] text-slate-400 mt-0.5">Enforcing source attribution, zero automated summary rewriting, and explicit unknown field disclosures.</p>
      </div>
      <div class="flex items-center gap-4 text-slate-500">
        <span>Phase 2: Frontend MVP</span>
        <span>•</span>
        <span>Node.js v24</span>
        <span>•</span>
        <a href="https://example.gov" target="_blank" rel="noopener noreferrer" class="hover:underline">Open Standards</a>
      </div>
    </div>
  </footer>

  <!-- Application Logic Client Script -->
  <script>
    let appData = { news: [], opportunities: [], savedIds: [], savedNotes: {} };
    let activeView = 'dashboard';
    let searchQuery = '';
    let filterType = 'all';
    let filterStatus = 'all';

    async function loadData() {
      try {
        const res = await fetch('/api/data');
        appData = await res.json();
        renderAll();
      } catch (e) {
        console.error('Failed to load data:', e);
      }
    }

    function setView(view) {
      activeView = view;
      document.querySelectorAll('.view-panel').forEach(el => el.classList.add('hidden'));
      const activePanel = document.getElementById('view-' + view);
      if (activePanel) activePanel.classList.remove('hidden');

      document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-view') === view) {
          btn.classList.add('bg-indigo-50', 'text-indigo-700', 'font-bold');
        } else {
          btn.classList.remove('bg-indigo-50', 'text-indigo-700', 'font-bold');
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function toggleMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      menu.classList.toggle('hidden');
    }

    function handleSearch(val) {
      searchQuery = (val || '').toLowerCase().trim();
      renderAll();
    }

    function setFilter(category, val) {
      if (category === 'type') {
        filterType = val;
        document.querySelectorAll('.filter-type').forEach(b => {
          if (b.getAttribute('data-val') === val) {
            b.className = 'filter-type px-2.5 py-1 rounded-full border text-xs font-medium bg-indigo-50 text-indigo-700 border-indigo-200';
          } else {
            b.className = 'filter-type px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 text-slate-600 border-slate-200';
          }
        });
      } else if (category === 'status') {
        filterStatus = val;
        document.querySelectorAll('.filter-status').forEach(b => {
          if (b.getAttribute('data-val') === val) {
            b.className = 'filter-status px-2.5 py-1 rounded-full border text-xs font-medium bg-indigo-50 text-indigo-700 border-indigo-200';
          } else {
            b.className = 'filter-status px-2.5 py-1 rounded-full border text-xs font-medium bg-slate-50 text-slate-600 border-slate-200';
          }
        });
      }
      renderOpportunities();
    }

    function renderStatusBadge(status) {
      const styles = {
        open: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        closing_soon: 'bg-amber-50 text-amber-800 border-amber-200',
        closed: 'bg-rose-50 text-rose-800 border-rose-200',
        unknown: 'bg-slate-100 text-slate-700 border-slate-200'
      };
      const dots = {
        open: 'bg-emerald-500',
        closing_soon: 'bg-amber-500',
        closed: 'bg-rose-500',
        unknown: 'bg-slate-400'
      };
      const labels = {
        open: 'Open',
        closing_soon: 'Closing Soon',
        closed: 'Closed',
        unknown: 'Deadline Unspecified'
      };
      return \`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border \${styles[status] || styles.unknown}">
        <span class="w-1.5 h-1.5 rounded-full \${dots[status] || dots.unknown}"></span>
        \${labels[status] || status}
      </span>\`;
    }

    function renderVerificationBadge(verification) {
      if (!verification) return '';
      const { status, evidenceUrl } = verification;
      const styles = {
        verified: 'bg-emerald-50 text-emerald-700 border-emerald-300',
        under_review: 'bg-blue-50 text-blue-700 border-blue-300',
        disputed: 'bg-rose-50 text-rose-700 border-rose-300',
        unverified: 'bg-slate-100 text-slate-600 border-slate-300'
      };
      const labels = {
        verified: '✓ Official Verified Source',
        under_review: 'ℹ Under Review',
        disputed: '⚠ Disputed Record',
        unverified: '○ Unverified Source'
      };
      const inner = \`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border \${styles[status] || styles.unverified}">\${labels[status] || status}</span>\`;
      if (evidenceUrl) {
        return \`<a href="\${evidenceUrl}" target="_blank" rel="noopener noreferrer" title="View official evidence" class="hover:opacity-80">\${inner}</a>\`;
      }
      return inner;
    }

    function renderAttributionBlock(attribution, publishedAt, isLicensed, licensingNotes) {
      let syndicatedNotice = '';
      if (attribution.isSyndicated && attribution.originalReportingUrl) {
        syndicatedNotice = \`<div class="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded mt-1">
          Syndicated wire content. <a href="\${attribution.originalReportingUrl}" target="_blank" rel="noopener noreferrer" class="underline font-semibold">View original reporting</a>
        </div>\`;
      }

      let licenseHtml = isLicensed && licensingNotes ? \`<div class="text-[11px] text-slate-500 italic mt-0.5">License: \${licensingNotes}</div>\` : '';

      return \`<div class="text-xs text-slate-500 border-t border-slate-100 pt-3 mt-3 space-y-1">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <span class="font-semibold text-slate-700">Source:</span>
            <a href="\${attribution.sourceUrl}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1">
              \${attribution.sourceName}
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            \${attribution.publisher && attribution.publisher !== attribution.sourceName ? \`<span class="text-slate-400">(\${attribution.publisher})</span>\` : ''}
          </div>
          \${publishedAt ? \`<span class="text-[11px] text-slate-400">Published: \${new Date(publishedAt).toUTCString()}</span>\` : ''}
        </div>
        \${syndicatedNotice}
        \${licenseHtml}
      </div>\`;
    }

    function renderCorrectionDrawer(corrections) {
      if (!corrections || corrections.length === 0) return '';
      const id = 'corr-drawer-' + Math.random().toString(36).substring(2, 9);
      const rows = corrections.map(c => \`
        <div class="py-1 text-[11px] border-b border-amber-200/50 last:border-none">
          <div class="flex justify-between font-medium text-amber-900">
            <span>Field: <code>\${c.fieldChanged}</code></span>
            <span>\${new Date(c.timestamp).toUTCString()}</span>
          </div>
          <div class="text-slate-600 mt-0.5">Reason: \${c.reason}</div>
          \${c.previousValue ? \`<div class="text-slate-400 line-through">Prior: \${c.previousValue}</div>\` : ''}
        </div>
      \`).join('');

      return \`
        <div class="mt-3 rounded border border-amber-200 bg-amber-50/60 p-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-medium text-amber-900 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              \${corrections.length} Transparent Correction\${corrections.length > 1 ? 's' : ''} on record
            </span>
            <button onclick="document.getElementById('\${id}').classList.toggle('hidden')" class="underline text-amber-800 text-[11px] font-semibold">Toggle Audit</button>
          </div>
          <div id="\${id}" class="hidden mt-2 pt-2 border-t border-amber-200/60 space-y-1">
            \${rows}
          </div>
        </div>
      \`;
    }

    async function toggleBookmark(id) {
      await fetch('/api/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      await loadData();
    }

    function renderOpportunities() {
      const container = document.getElementById('opportunitiesList');
      const filtered = appData.opportunities.filter(opp => {
        if (filterType !== 'all' && opp.opportunityType !== filterType) return false;
        if (filterStatus !== 'all' && opp.status !== filterStatus) return false;
        if (searchQuery) {
          const text = (opp.title + ' ' + opp.description + ' ' + opp.providerName + ' ' + (opp.tags || []).join(' ')).toLowerCase();
          if (!text.includes(searchQuery)) return false;
        }
        return true;
      });

      document.getElementById('oppResultCount').textContent = filtered.length;

      if (filtered.length === 0) {
        container.innerHTML = '<div class="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">No opportunities match the selected filters.</div>';
        return;
      }

      container.innerHTML = filtered.map(opp => {
        const isSaved = appData.savedIds.includes(opp.id);
        const deadlineText = opp.isDeadlineExplicit && opp.deadline
          ? new Date(opp.deadline).toUTCString()
          : '<span class="text-slate-400 italic">Not explicitly stated by provider</span>';

        const fundingText = opp.isFundingExplicit && opp.fundingAmount
          ? opp.fundingAmount
          : '<span class="text-slate-400 italic">Discretionary / Not explicitly stated</span>';

        const eligibilityText = opp.isEligibilityExplicit && opp.eligibilityCriteria
          ? opp.eligibilityCriteria
          : '<span class="text-slate-400 italic">Refer directly to provider portal</span>';

        const typeLabels = {
          scholarship: 'Scholarship',
          internship: 'Internship',
          grant: 'Grant',
          scheme: 'Government Scheme'
        };

        const providerLabels = {
          government: 'Government Official',
          university: 'Accredited University',
          employer: 'Verified Employer',
          grant_provider: 'Philanthropic Foundation',
          unknown: 'Third-Party'
        };

        return \`
          <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all space-y-4">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">\${typeLabels[opp.opportunityType]}</span>
                  \${renderStatusBadge(opp.status)}
                  \${renderVerificationBadge(opp.verification)}
                </div>
                <h3 class="text-base font-bold text-slate-900 leading-snug">\${opp.title}</h3>
                <div class="text-xs text-slate-600 font-medium">Provider: <span class="text-slate-900 font-semibold">\${opp.providerName}</span> (\${providerLabels[opp.providerType]})</div>
              </div>
              <button onclick="toggleBookmark('\${opp.id}')" class="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors \${isSaved ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}">
                \${isSaved ? '★ Saved' : '☆ Save'}
              </button>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed">\${opp.description}</p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Funding / Stipend</span>
                <span class="font-semibold text-slate-800">\${fundingText}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Application Deadline</span>
                <span class="font-semibold text-slate-800">\${deadlineText}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Eligibility</span>
                <span class="text-slate-700 block truncate" title="\${opp.eligibilityCriteria || 'See provider'}">\${eligibilityText}</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-1.5">
              \${(opp.tags || []).map(t => \`<span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">#\${t}</span>\`).join('')}
            </div>

            \${renderCorrectionDrawer(opp.correctionHistory)}

            <div class="text-xs border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2">
              <span class="text-slate-400 text-[11px]">Last verified: \${opp.verification?.lastVerifiedAt ? new Date(opp.verification.lastVerifiedAt).toUTCString() : 'Pending verification'}</span>
              <a href="\${opp.sourceUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors">
                Apply on Official Site
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
        \`;
      }).join('');
    }

    function renderNewsFeed(containerId, category) {
      const container = document.getElementById(containerId);
      const filtered = appData.news.filter(n => {
        if (category && n.category !== category) return false;
        if (searchQuery) {
          const text = (n.title + ' ' + n.attribution.sourceName + ' ' + (n.tags || []).join(' ')).toLowerCase();
          if (!text.includes(searchQuery)) return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        container.innerHTML = '<div class="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">No articles match current search query.</div>';
        return;
      }

      container.innerHTML = filtered.map(item => {
        const isSaved = appData.savedIds.includes(item.id);
        return \`
          <article class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold \${item.category === 'ai-tech' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'} uppercase">
                    \${item.category === 'ai-tech' ? 'AI & Technology' : 'General News'}
                  </span>
                </div>
                <h3 class="text-base font-bold text-slate-900 leading-snug">
                  <a href="\${item.url}" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-600 transition-colors">
                    \${item.title}
                  </a>
                </h3>
              </div>
              <button onclick="toggleBookmark('\${item.id}')" class="px-2.5 py-1 rounded text-xs font-semibold border \${isSaved ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}">
                \${isSaved ? '★' : '☆'}
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-1.5">
              \${(item.tags || []).map(t => \`<span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">#\${t}</span>\`).join('')}
            </div>

            \${renderCorrectionDrawer(item.correctionHistory)}
            \${renderAttributionBlock(item.attribution, item.publishedAt, item.isLicensed, item.licensingNotes)}
          </article>
        \`;
      }).join('');
    }

    function renderSaved() {
      const container = document.getElementById('savedItemsList');
      const allItems = [...appData.opportunities, ...appData.news];
      const saved = allItems.filter(i => appData.savedIds.includes(i.id));

      document.getElementById('savedCountBadge').textContent = saved.length;

      if (saved.length === 0) {
        container.innerHTML = '<div class="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">No saved items yet. Click the "Save" button on any opportunity or news item to bookmark it.</div>';
        return;
      }

      container.innerHTML = saved.map(item => \`
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-4">
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-400">\${item.opportunityType || item.category}</span>
            <h4 class="text-sm font-bold text-slate-900">\${item.title}</h4>
            <div class="text-xs text-slate-500 mt-1">Source: \${item.providerName || item.attribution?.sourceName}</div>
          </div>
          <div class="flex items-center gap-2">
            <a href="\${item.sourceUrl || item.url}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium">Visit Source</a>
            <button onclick="toggleBookmark('\${item.id}')" class="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded text-xs font-medium">Remove</button>
          </div>
        </div>
      \`).join('');
    }

    function renderDashboard() {
      const opps = appData.opportunities;
      const news = appData.news;

      document.getElementById('kpiTotalOpp').textContent = opps.length;
      document.getElementById('kpiClosingSoon').textContent = opps.filter(o => o.status === 'closing_soon').length;
      document.getElementById('kpiVerified').textContent = opps.filter(o => o.verification?.status === 'verified').length;
      document.getElementById('kpiNews').textContent = news.length;

      // Urgent Closing Soon items
      const urgent = opps.filter(o => o.status === 'closing_soon');
      document.getElementById('urgentOppList').innerHTML = urgent.map(o => \`
        <div class="bg-white p-3 rounded-lg border border-amber-200 flex items-center justify-between gap-2">
          <div>
            <div class="text-xs font-bold text-slate-900">\${o.title}</div>
            <div class="text-[11px] text-amber-800 mt-0.5">Deadline: \${new Date(o.deadline).toUTCString()} &bull; Provider: \${o.providerName}</div>
          </div>
          <button onclick="setView('opportunities')" class="px-2.5 py-1 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-700">Review</button>
        </div>
      \`).join('');

      // Highlights
      document.getElementById('dashboardNewsList').innerHTML = news.slice(0, 3).map(n => \`
        <div class="border-b border-slate-100 pb-2.5 last:border-none">
          <span class="text-[10px] font-bold uppercase \${n.category === 'ai-tech' ? 'text-purple-600' : 'text-blue-600'}">\${n.category}</span>
          <a href="\${n.url}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-slate-900 hover:text-indigo-600 block truncate mt-0.5">\${n.title}</a>
          <span class="text-[11px] text-slate-400">\${n.attribution.sourceName} &bull; \${new Date(n.publishedAt).toLocaleDateString()}</span>
        </div>
      \`).join('');

      document.getElementById('dashboardOppList').innerHTML = opps.slice(0, 3).map(o => \`
        <div class="border-b border-slate-100 pb-2.5 last:border-none">
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded uppercase">\${o.opportunityType}</span>
            \${renderStatusBadge(o.status)}
          </div>
          <div class="text-xs font-semibold text-slate-900 truncate mt-1">\${o.title}</div>
          <div class="text-[11px] text-slate-500">\${o.fundingAmount || 'Discretionary'} &bull; \${o.providerName}</div>
        </div>
      \`).join('');
    }

    function renderAdmin() {
      const tbody = document.getElementById('adminTableBody');
      tbody.innerHTML = appData.opportunities.map(opp => \`
        <tr class="hover:bg-slate-50">
          <td class="py-2.5 px-3">
            <div class="font-semibold text-slate-900">\${opp.title}</div>
            <div class="text-[10px] text-slate-400">ID: \${opp.id}</div>
          </td>
          <td class="py-2.5 px-3">
            <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px] uppercase">\${opp.opportunityType}</span>
          </td>
          <td class="py-2.5 px-3 text-slate-700 font-medium">\${opp.providerName}</td>
          <td class="py-2.5 px-3">\${renderVerificationBadge(opp.verification)}</td>
          <td class="py-2.5 px-3 text-right space-x-1">
            <button onclick="openVerifyModal('\${opp.id}', '\${opp.title.replace(/'/g, "\\\\'")}', '\${opp.verification?.status}')" class="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-semibold text-[11px] hover:bg-indigo-100">Verify</button>
            <button onclick="openCorrectModal('\${opp.id}', 'opportunity', '\${opp.title.replace(/'/g, "\\\\'")}')" class="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded font-semibold text-[11px] hover:bg-amber-100">Correct</button>
          </td>
        </tr>
      \`).join('');

      // Global Audit Log
      const allCorrections = [];
      [...appData.opportunities, ...appData.news].forEach(item => {
        (item.correctionHistory || []).forEach(corr => {
          allCorrections.push({ ...corr, itemTitle: item.title });
        });
      });

      const auditContainer = document.getElementById('adminAuditLog');
      if (allCorrections.length === 0) {
        auditContainer.innerHTML = '<div class="text-xs text-slate-400">No corrections on record.</div>';
      } else {
        auditContainer.innerHTML = allCorrections.map(c => \`
          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div class="flex items-center justify-between font-bold text-slate-800">
              <span>Correction on: "\${c.itemTitle}"</span>
              <span class="text-slate-400 font-normal text-[11px]">\${new Date(c.timestamp).toUTCString()}</span>
            </div>
            <div class="mt-1 text-slate-600">Field: <code class="bg-white px-1 border rounded">\${c.fieldChanged}</code> &bull; Recorded by: <span class="font-medium">\${c.recordedBy}</span></div>
            <div class="mt-1 text-slate-700"><strong>Reason:</strong> \${c.reason}</div>
            \${c.previousValue ? \`<div class="mt-0.5 text-slate-400 text-[11px] line-through">Prior Value: \${c.previousValue}</div>\` : ''}
          </div>
        \`).join('');
      }
    }

    function renderAll() {
      renderDashboard();
      renderNewsFeed('generalNewsList', 'general');
      renderNewsFeed('aiTechNewsList', 'ai-tech');
      renderOpportunities();
      renderSaved();
      renderAdmin();
    }

    // Modal Operations
    function openVerifyModal(id, title, status) {
      document.getElementById('modalOppId').value = id;
      document.getElementById('modalOppTitle').textContent = title;
      document.getElementById('modalVerifyStatus').value = status || 'verified';
      document.getElementById('verifyModal').classList.remove('hidden');
    }
    function closeVerifyModal() {
      document.getElementById('verifyModal').classList.add('hidden');
    }
    async function submitVerification() {
      const id = document.getElementById('modalOppId').value;
      const status = document.getElementById('modalVerifyStatus').value;
      const evidenceUrl = document.getElementById('modalEvidenceUrl').value;
      const notes = document.getElementById('modalVerifyNotes').value;

      if (!evidenceUrl) {
        alert('Evidence URL is strictly required by verification integrity rules.');
        return;
      }

      await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, evidenceUrl, notes, adminId: 'admin_session_user' })
      });
      closeVerifyModal();
      await loadData();
    }

    function openCorrectModal(id, type, title) {
      document.getElementById('correctItemId').value = id;
      document.getElementById('correctItemType').value = type;
      document.getElementById('correctItemTitle').textContent = title;
      document.getElementById('correctModal').classList.remove('hidden');
    }
    function closeCorrectModal() {
      document.getElementById('correctModal').classList.add('hidden');
    }
    async function submitCorrection() {
      const id = document.getElementById('correctItemId').value;
      const type = document.getElementById('correctItemType').value;
      const fieldChanged = document.getElementById('correctField').value;
      const newValue = document.getElementById('correctNewVal').value;
      const reason = document.getElementById('correctReason').value;

      if (!fieldChanged || !reason || reason.length < 5) {
        alert('Field changed and a descriptive reason (minimum 5 chars) are required for public audit.');
        return;
      }

      await fetch('/api/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, fieldChanged, newValue, reason, recordedBy: 'admin_session_user' })
      });
      closeCorrectModal();
      await loadData();
    }

    // Initial load: parse URL pathname to set initial view
    const initialPath = window.location.pathname.replace(/^\\//, '').replace(/\\/$/, '');
    const pathToViewMap = {
      '': 'dashboard',
      'news': 'news',
      'ai-tech': 'aitech',
      'opportunities': 'opportunities',
      'search': 'opportunities',
      'saved': 'saved',
      'login': 'login',
      'admin': 'admin'
    };
    if (pathToViewMap[initialPath]) {
      activeView = pathToViewMap[initialPath];
    }
    loadData();
  </script>
</body>
</html>`;
}

server.listen(PORT, () => {
  console.log(`[Intelligence Hub] Local web server listening on http://localhost:${PORT}`);
});

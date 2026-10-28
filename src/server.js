// @ts-check
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SAMPLE_NEWS_DATA } from "./lib/data/news.ts";
import { SAMPLE_TECH_DATA } from "./lib/data/technology.ts";
import { SAMPLE_OPPORTUNITIES_DATA } from "./lib/data/opportunities.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data store initialized from our structured datasets
let newsData = [...SAMPLE_NEWS_DATA];
let techData = [...SAMPLE_TECH_DATA];
let opportunitiesData = [...SAMPLE_OPPORTUNITIES_DATA];

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
        news: newsData,
        technology: techData,
        opportunities: opportunitiesData,
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
        const opp = opportunitiesData.find((o) => o.id === id);
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

  // --------------------------------------------------------------------------
  // Web Application Frontend: Serves HTML SPA with client-side router
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
  <title>Intelligence Hub — Editorial Intelligence & Opportunity Radar</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
    :focus-visible { outline: 2px solid #6366f1; outline-offset: 2px; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">

  <!-- Top Demo Banner -->
  <aside aria-label="Demonstration Notice" class="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-semibold flex items-center justify-between border-b border-amber-600/30">
    <div class="max-w-7xl mx-auto w-full flex items-center gap-2">
      <span class="inline-block px-1.5 py-0.5 bg-amber-950 text-amber-100 rounded text-[10px] tracking-wide uppercase font-bold">
        Demonstration Data Mode
      </span>
      <span class="truncate">
        All records displayed are simulated sample data for testing and verification workflows. Sourcing and URLs follow official formats.
      </span>
    </div>
  </aside>

  <!-- Dark Graphite Primary Navigation Header -->
  <header class="bg-slate-950 text-slate-100 border-b border-slate-800 sticky top-0 z-30 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <!-- Brand Logo & Name -->
      <a href="/" onclick="navigateTo(event, '/')" class="flex items-center gap-3 group focus:outline-none shrink-0">
        <div class="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow group-hover:bg-indigo-500 transition-colors">
          IH
        </div>
        <div>
          <span class="text-base font-bold text-white tracking-tight leading-tight block">Intelligence Hub</span>
          <span class="text-[10px] text-slate-400 font-medium tracking-wide uppercase hidden sm:block">Discovery & Verification</span>
        </div>
      </a>

      <!-- Global Search Input in Header -->
      <div class="flex-1 max-w-xs md:max-w-sm mx-2">
        <form onsubmit="handleGlobalSearchSubmit(event)" class="relative">
          <input
            id="globalNavSearchInput"
            type="text"
            placeholder="Search intelligence & opportunities..."
            class="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-400 transition-all"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </form>
      </div>

      <!-- Primary Navigation Links -->
      <nav class="hidden lg:flex items-center gap-1 text-xs font-medium">
        <a href="/" onclick="navigateTo(event, '/')" class="nav-item px-3 py-2 rounded-md transition-colors text-slate-300 hover:text-white hover:bg-slate-900" data-route="/">Overview</a>
        <a href="/news" onclick="navigateTo(event, '/news')" class="nav-item px-3 py-2 rounded-md transition-colors text-slate-300 hover:text-white hover:bg-slate-900" data-route="/news">News</a>
        <a href="/technology" onclick="navigateTo(event, '/technology')" class="nav-item px-3 py-2 rounded-md transition-colors text-slate-300 hover:text-white hover:bg-slate-900" data-route="/technology">AI & Technology</a>
        <a href="/opportunities" onclick="navigateTo(event, '/opportunities')" class="nav-item px-3 py-2 rounded-md transition-colors text-slate-300 hover:text-white hover:bg-slate-900" data-route="/opportunities">Opportunities</a>
        <a href="/saved" onclick="navigateTo(event, '/saved')" class="nav-item px-3 py-2 rounded-md transition-colors text-slate-300 hover:text-white hover:bg-slate-900 relative" data-route="/saved">
          Saved Items
          <span id="navSavedBadge" class="ml-1.5 px-1.5 py-0.2 bg-indigo-500 text-white rounded-full text-[10px] font-bold">0</span>
        </a>
        <a href="/search" onclick="navigateTo(event, '/search')" class="nav-item px-3 py-2 rounded-md transition-colors text-slate-300 hover:text-white hover:bg-slate-900" data-route="/search">Search</a>

        <div class="h-4 w-px bg-slate-800 mx-2" aria-hidden="true"></div>

        <!-- Account / Profile Placeholder -->
        <div class="flex items-center gap-2 pl-1">
          <div class="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-300 font-semibold" title="Researcher Profile">
            RP
          </div>
          <a href="/login" onclick="navigateTo(event, '/login')" class="text-slate-400 hover:text-slate-200 text-xs font-medium hidden xl:inline-block">Sign In</a>
        </div>
      </nav>

      <!-- Mobile Hamburger Button -->
      <button type="button" onclick="toggleMobileMenu()" class="lg:hidden p-2 text-slate-300 hover:text-white rounded-md focus:outline-none" aria-label="Toggle menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
    </div>

    <!-- Mobile Responsive Navigation Drawer -->
    <div id="mobileMenu" class="hidden lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1 text-xs font-medium">
      <a href="/" onclick="navigateTo(event, '/'); toggleMobileMenu();" class="block py-2.5 px-3 rounded text-slate-200 hover:bg-slate-900">Overview</a>
      <a href="/news" onclick="navigateTo(event, '/news'); toggleMobileMenu();" class="block py-2.5 px-3 rounded text-slate-200 hover:bg-slate-900">News</a>
      <a href="/technology" onclick="navigateTo(event, '/technology'); toggleMobileMenu();" class="block py-2.5 px-3 rounded text-slate-200 hover:bg-slate-900">AI & Technology</a>
      <a href="/opportunities" onclick="navigateTo(event, '/opportunities'); toggleMobileMenu();" class="block py-2.5 px-3 rounded text-slate-200 hover:bg-slate-900">Opportunities</a>
      <a href="/saved" onclick="navigateTo(event, '/saved'); toggleMobileMenu();" class="block py-2.5 px-3 rounded text-slate-200 hover:bg-slate-900">Saved Items</a>
      <a href="/search" onclick="navigateTo(event, '/search'); toggleMobileMenu();" class="block py-2.5 px-3 rounded text-slate-200 hover:bg-slate-900">Search</a>
      <div class="pt-2 border-t border-slate-800">
        <a href="/login" onclick="navigateTo(event, '/login'); toggleMobileMenu();" class="block py-2 px-3 rounded text-indigo-400 hover:bg-slate-900 font-semibold">Researcher Account / Sign In</a>
      </div>
    </div>
  </header>

  <!-- Main View Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

    <!-- VIEW 1: OVERVIEW DASHBOARD -->
    <div id="view-overview" class="view-panel space-y-8">
      <!-- Section A: Dashboard Header -->
      <section class="space-y-4">
        <div class="border-b border-slate-200 pb-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-600">Editorial Intelligence Platform</span>
              <h1 class="text-2xl font-bold text-slate-900 mt-0.5">Global Intelligence & Opportunity Radar</h1>
              <p class="text-xs text-slate-500 max-w-2xl mt-1 leading-relaxed">
                Centralized discovery for verified scholarships, research fellowships, technological breakthroughs, and official policy announcements.
              </p>
            </div>
            <div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Phase 2 Interactive MVP
              </span>
            </div>
          </div>
        </div>

        <!-- Search Input & Quick Shortcuts -->
        <div class="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <form onsubmit="handleDashboardSearch(event)" class="relative">
            <input
              id="dashboardSearchInput"
              type="text"
              placeholder="Search across all news, AI developments, grants, and scholarships..."
              class="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
            <svg class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button type="submit" class="absolute right-1.5 top-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold transition-colors">
              Search
            </button>
          </form>

          <div class="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span class="font-semibold text-slate-700 mr-1">Quick Discovery:</span>
            <button onclick="navigateWithQuery('/opportunities', 'type', 'scholarship')" class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">Scholarships</button>
            <button onclick="navigateWithQuery('/opportunities', 'type', 'grant')" class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">Research Grants</button>
            <button onclick="navigateWithQuery('/technology', 'category', 'llm')" class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">LLMs</button>
            <button onclick="navigateWithQuery('/technology', 'category', 'agents')" class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">AI Agents</button>
            <button onclick="navigateWithQuery('/opportunities', 'type', 'scheme')" class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium">Govt Schemes</button>
          </div>
        </div>
      </section>

      <!-- Section F: Deadline Awareness (Time-Sensitive Opportunities) -->
      <section class="bg-amber-50/70 border border-amber-200 rounded-xl p-4 sm:p-5 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="p-1.5 bg-amber-100 text-amber-800 rounded">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h2 class="text-sm font-bold text-amber-950">Deadline Awareness & Urgent Applications</h2>
              <p class="text-[11px] text-amber-800">Opportunities with verified deadlines closing within the next 7 calendar days.</p>
            </div>
          </div>
          <button onclick="navigateWithQuery('/opportunities', 'status', 'closing_soon')" class="text-xs font-semibold text-amber-900 underline hover:no-underline">
            View Closing Soon &rarr;
          </button>
        </div>
        <div id="urgentDeadlineList" class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <!-- Injected dynamically -->
        </div>
      </section>

      <!-- Section B: Featured Developments -->
      <section class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h2 class="text-base font-bold text-slate-900">Featured Intelligence & Technology Highlights</h2>
            <p class="text-xs text-slate-500">Priority research disclosures, benchmark standards, and strategic announcements.</p>
          </div>
          <a href="/technology" onclick="navigateTo(event, '/technology')" class="text-xs font-bold text-indigo-600 hover:underline">View All Tech &rarr;</a>
        </div>
        <div id="overviewFeaturedList" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Injected dynamically -->
        </div>
      </section>

      <!-- Split Section: C. Latest News & D. AI Technology Radar -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- C. Latest News -->
        <section class="space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 class="text-base font-bold text-slate-900">Latest General & Policy News</h2>
              <p class="text-xs text-slate-500">Sourced reports, workforce funds, and economic pacts.</p>
            </div>
            <a href="/news" onclick="navigateTo(event, '/news')" class="text-xs font-bold text-indigo-600 hover:underline">View All News &rarr;</a>
          </div>
          <div id="overviewLatestNewsList" class="space-y-3">
            <!-- Injected dynamically -->
          </div>
        </section>

        <!-- D. AI & Technology Radar -->
        <section class="space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 class="text-base font-bold text-slate-900">AI & Technology Radar</h2>
              <p class="text-xs text-slate-500">LLMs, agent compiler tools, photonics, and vector indices.</p>
            </div>
            <a href="/technology" onclick="navigateTo(event, '/technology')" class="text-xs font-bold text-indigo-600 hover:underline">Radar Index &rarr;</a>
          </div>
          <div id="overviewTechRadarList" class="space-y-3">
            <!-- Injected dynamically -->
          </div>
        </section>
      </div>

      <!-- Section E: Opportunity Discovery Feed -->
      <section class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h2 class="text-base font-bold text-slate-900">Verified Opportunity Registry</h2>
            <p class="text-xs text-slate-500">Doctoral fellowships, seed grants, and government schemes with transparent verification.</p>
          </div>
          <a href="/opportunities" onclick="navigateTo(event, '/opportunities')" class="text-xs font-bold text-indigo-600 hover:underline">View All Opportunities &rarr;</a>
        </div>
        <div id="overviewOpportunitiesList" class="space-y-4">
          <!-- Injected dynamically -->
        </div>
      </section>
    </div>

    <!-- VIEW 2: NEWS PAGE -->
    <div id="view-news" class="view-panel hidden space-y-6">
      <div class="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">National & International News Feed</h1>
          <p class="text-xs text-slate-500 mt-1">Source-attributed headlines, public infrastructure accords, workforce allocations, and scientific findings.</p>
        </div>
        <div class="text-xs text-slate-500">
          Showing <strong id="newsResultCount">0</strong> records
        </div>
      </div>

      <!-- Control Bar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="relative w-full sm:max-w-md">
            <input
              id="newsFilterSearchInput"
              type="text"
              placeholder="Search news by headline, agency, or tag..."
              class="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              oninput="handleNewsSearch(this.value)"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="font-semibold text-slate-500">Sort:</span>
            <select id="newsSortSelect" onchange="renderNewsList()" class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <option value="newest">Latest Published</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span class="font-semibold text-slate-500 mr-1">Categories:</span>
          <button onclick="setNewsCategory('all')" class="news-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white" data-cat="all">All News</button>
          <button onclick="setNewsCategory('india')" class="news-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-cat="india">India</button>
          <button onclick="setNewsCategory('world')" class="news-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-cat="world">World</button>
          <button onclick="setNewsCategory('business')" class="news-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-cat="business">Business</button>
          <button onclick="setNewsCategory('science')" class="news-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-cat="science">Science</button>
          <button onclick="setNewsCategory('politics')" class="news-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-cat="politics">Public Policy</button>
          <button onclick="setNewsCategory('environment')" class="news-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-cat="environment">Environment</button>
        </div>
      </div>

      <div id="newsPageList" class="space-y-4">
        <!-- Injected dynamically -->
      </div>
    </div>

    <!-- VIEW 3: AI & TECHNOLOGY PAGE -->
    <div id="view-technology" class="view-panel hidden space-y-6">
      <div class="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">AI & Technology Intelligence Radar</h1>
          <p class="text-xs text-slate-500 mt-1">Tracking LLM inference breakthroughs, multi-agent compilers, photonics startups, and open evaluation standards.</p>
        </div>
        <div class="text-xs text-slate-500">
          Tracking <strong id="techResultCount">0</strong> technical dispatches
        </div>
      </div>

      <!-- Control Bar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="relative w-full sm:max-w-md">
            <input
              id="techFilterSearchInput"
              type="text"
              placeholder="Search tech by keywords (e.g., speculative, agents, quantum)..."
              class="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              oninput="handleTechSearch(this.value)"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="font-semibold text-slate-500">Sort:</span>
            <select id="techSortSelect" onchange="renderTechList()" class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <option value="newest">Latest Published</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span class="font-semibold text-slate-500 mr-1">Domains:</span>
          <button onclick="setTechCategory('all')" class="tech-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white" data-cat="all">All Technology</button>
          <button onclick="setTechCategory('ai-tech')" class="tech-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-cat="ai-tech">Artificial Intelligence</button>
          <button onclick="setTechCategory('llm')" class="tech-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-cat="llm">Large Language Models</button>
          <button onclick="setTechCategory('agents')" class="tech-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-cat="agents">AI Agents</button>
          <button onclick="setTechCategory('dev-tools')" class="tech-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-cat="dev-tools">Developer Tools</button>
          <button onclick="setTechCategory('startups')" class="tech-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-cat="startups">Startups</button>
          <button onclick="setTechCategory('research')" class="tech-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-cat="research">Research</button>
        </div>
      </div>

      <div id="techPageList" class="space-y-4">
        <!-- Injected dynamically -->
      </div>
    </div>

    <!-- VIEW 4: OPPORTUNITIES PAGE -->
    <div id="view-opportunities" class="view-panel hidden space-y-6">
      <div class="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Opportunity Discovery Catalog</h1>
          <p class="text-xs text-slate-500 mt-1">Searchable registry of verified scholarships, paid internships, capital grants, and government schemes.</p>
        </div>
        <div class="text-xs text-slate-500">
          Showing <strong id="oppsResultCount">0</strong> opportunities
        </div>
      </div>

      <!-- Control Bar -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="relative w-full sm:max-w-md">
            <input
              id="oppsFilterSearchInput"
              type="text"
              placeholder="Search by title, provider, field, or tag..."
              class="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              oninput="handleOppsSearch(this.value)"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="font-semibold text-slate-500">Region:</span>
              <select id="oppsRegionSelect" onchange="renderOpportunitiesList()" class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
                <option value="all">All Regions</option>
              </select>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="font-semibold text-slate-500">Sort:</span>
              <select id="oppsSortSelect" onchange="renderOpportunitiesList()" class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
                <option value="deadline_soonest">Deadline Soonest</option>
                <option value="latest">Recently Added</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Type Pills -->
        <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span class="font-semibold text-slate-500 mr-1">Type:</span>
          <button onclick="setOppType('all')" class="opp-type-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white" data-type="all">All</button>
          <button onclick="setOppType('scholarship')" class="opp-type-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-type="scholarship">Scholarships</button>
          <button onclick="setOppType('internship')" class="opp-type-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-type="internship">Internships</button>
          <button onclick="setOppType('grant')" class="opp-type-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-type="grant">Grants</button>
          <button onclick="setOppType('scheme')" class="opp-type-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-type="scheme">Govt Schemes</button>
          <button onclick="setOppType('fellowship')" class="opp-type-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-type="fellowship">Fellowships</button>
        </div>

        <!-- Status Pills -->
        <div class="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span class="font-semibold text-slate-500 mr-1">Status:</span>
          <button onclick="setOppStatus('all')" class="opp-status-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white" data-status="all">All</button>
          <button onclick="setOppStatus('open')" class="opp-status-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-status="open">Open</button>
          <button onclick="setOppStatus('closing_soon')" class="opp-status-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-status="closing_soon">Closing Soon (≤7d)</button>
          <button onclick="setOppStatus('closed')" class="opp-status-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-status="closed">Closed</button>
          <button onclick="setOppStatus('unknown')" class="opp-status-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200" data-status="unknown">Deadline Not Provided</button>
        </div>
      </div>

      <div id="oppsPageList" class="space-y-4">
        <!-- Injected dynamically -->
      </div>
    </div>

    <!-- VIEW 5: SEARCH PAGE -->
    <div id="view-search" class="view-panel hidden space-y-6">
      <div class="border-b border-slate-200 pb-4">
        <h1 class="text-2xl font-bold text-slate-900">Global Intelligence Search</h1>
        <p class="text-xs text-slate-500 mt-1">Unified query engine searching across national news, AI breakthroughs, scholarships, and government schemes.</p>
      </div>

      <div class="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div class="relative">
          <input
            id="pageSearchInput"
            type="text"
            placeholder="Search keywords, agencies, grant programs, research domains..."
            class="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            oninput="handleSearchPageInput(this.value)"
          />
          <svg class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <button type="button" onclick="clearSearchPageInput()" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-sm font-bold">&times;</button>
        </div>

        <div class="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-semibold border-t border-slate-100">
          <button onclick="setSearchTab('all')" class="search-tab-btn px-3 py-1.5 rounded-lg bg-indigo-600 text-white" data-tab="all">All Results (<span id="searchTabAllCount">0</span>)</button>
          <button onclick="setSearchTab('opportunities')" class="search-tab-btn px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" data-tab="opportunities">Opportunities (<span id="searchTabOppsCount">0</span>)</button>
          <button onclick="setSearchTab('technology')" class="search-tab-btn px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" data-tab="technology">Technology (<span id="searchTabTechCount">0</span>)</button>
          <button onclick="setSearchTab('news')" class="search-tab-btn px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" data-tab="news">General News (<span id="searchTabNewsCount">0</span>)</button>
        </div>
      </div>

      <div id="searchResultsList" class="space-y-6">
        <!-- Injected dynamically -->
      </div>
    </div>

    <!-- VIEW 6: SAVED ITEMS PAGE -->
    <div id="view-saved" class="view-panel hidden space-y-6">
      <div class="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Saved Research & Bookmarks</h1>
          <p class="text-xs text-slate-500 mt-1">Personal repository of pinned scholarships, research grants, and technical intelligence dispatches.</p>
        </div>
        <div class="text-xs text-slate-500">
          <strong id="savedPageCount">0</strong> items saved in local workspace
        </div>
      </div>

      <div id="savedItemsContainer" class="space-y-4">
        <!-- Injected dynamically -->
      </div>
    </div>

    <!-- VIEW 7: NEWS DETAIL PAGE -->
    <div id="view-news-detail" class="view-panel hidden max-w-4xl mx-auto space-y-6">
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <a href="/" onclick="navigateTo(event, '/')" class="hover:underline">Home</a>
        <span>/</span>
        <a href="/news" onclick="navigateTo(event, '/news')" class="hover:underline">News</a>
        <span>/</span>
        <span id="newsDetailBreadcrumb" class="text-slate-800 font-medium truncate max-w-xs">Article Detail</span>
      </div>

      <article class="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div class="space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span id="newsDetailCategory" class="px-2.5 py-1 rounded text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider"></span>
              <span id="newsDetailDate" class="text-xs text-slate-500"></span>
            </div>
            <div id="newsDetailBookmarkContainer"></div>
          </div>

          <h1 id="newsDetailTitle" class="text-xl sm:text-2xl font-bold text-slate-900 leading-snug"></h1>

          <div class="text-xs text-slate-600 font-medium">
            Reporting Source: <a id="newsDetailSourceLink" href="#" target="_blank" rel="noopener noreferrer" class="text-indigo-600 underline font-semibold"></a>
            <span id="newsDetailPublisher" class="text-slate-500"></span>
          </div>
        </div>

        <div id="newsDetailExcerptBox" class="bg-slate-50 p-4 rounded-lg border-l-4 border-indigo-600 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
          <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Authorized Briefing Summary</span>
          <p id="newsDetailExcerpt"></p>
        </div>

        <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-2">
          <div class="font-semibold text-slate-800 flex items-center gap-1.5">
            <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Copyright & Source Attribution Notice
          </div>
          <p class="leading-relaxed">
            In compliance with Intelligence Hub publication ethics (Section 5), third-party articles are never automatically rewritten or reproduced in full without documented licensing authorization. Please access the complete reporting directly at the original publisher.
          </p>
          <div class="pt-1">
            <a id="newsDetailOfficialBtn" href="#" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors">
              Read Full Article at Publisher
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-xs font-semibold text-slate-500 mr-1">Filed Under:</span>
          <div id="newsDetailTags" class="flex flex-wrap gap-1.5"></div>
        </div>

        <div id="newsDetailCorrections"></div>
        <div id="newsDetailAttribution"></div>
      </article>

      <div class="flex items-center justify-between text-xs pt-2">
        <a href="/news" onclick="navigateTo(event, '/news')" class="text-indigo-600 hover:underline font-semibold">&larr; Return to News Feed</a>
        <a href="/search" onclick="navigateTo(event, '/search')" class="text-slate-500 hover:text-slate-800">Search Related Dispatches &rarr;</a>
      </div>
    </div>

    <!-- VIEW 8: OPPORTUNITY DETAIL PAGE -->
    <div id="view-opportunity-detail" class="view-panel hidden max-w-4xl mx-auto space-y-6">
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <a href="/" onclick="navigateTo(event, '/')" class="hover:underline">Home</a>
        <span>/</span>
        <a href="/opportunities" onclick="navigateTo(event, '/opportunities')" class="hover:underline">Opportunities</a>
        <span>/</span>
        <span id="oppDetailBreadcrumb" class="text-slate-800 font-medium truncate max-w-xs">Opportunity Detail</span>
      </div>

      <article class="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div class="space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <span id="oppDetailType" class="px-2.5 py-1 rounded text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider"></span>
              <span id="oppDetailStatus"></span>
              <span id="oppDetailVerification"></span>
              <span id="oppDetailRegion" class="text-xs text-slate-500"></span>
            </div>
            <div id="oppDetailBookmarkContainer"></div>
          </div>

          <h1 id="oppDetailTitle" class="text-xl sm:text-2xl font-bold text-slate-900 leading-snug"></h1>

          <div class="text-xs text-slate-600 font-medium">
            Issuing Entity: <span id="oppDetailProvider" class="font-semibold text-slate-900"></span>
          </div>
        </div>

        <!-- Spec Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">Funding / Grant Value</span>
            <span id="oppDetailFunding" class="text-sm font-bold text-slate-900"></span>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">Application Deadline</span>
            <span id="oppDetailDeadline" class="text-sm font-bold text-slate-900"></span>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">Verification State</span>
            <span id="oppDetailVerificationText" class="text-sm font-bold text-slate-900 capitalize"></span>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <h2 class="text-sm font-bold text-slate-900">Program Description</h2>
          <p id="oppDetailDescription" class="text-xs sm:text-sm text-slate-700 leading-relaxed"></p>
        </div>

        <!-- Eligibility -->
        <div class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h2 class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Eligibility Criteria
          </h2>
          <p id="oppDetailEligibility" class="text-xs text-slate-700 leading-relaxed"></p>
        </div>

        <!-- Source Verification Record -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
          <div class="font-semibold text-slate-800 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            Source Verification Record
          </div>
          <p id="oppDetailVerificationMeta" class="text-[11px] leading-relaxed"></p>
          <div id="oppDetailEvidenceLink" class="pt-1"></div>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Tags:</span>
          <div id="oppDetailTags" class="flex flex-wrap gap-1.5"></div>
        </div>

        <div id="oppDetailCorrections"></div>

        <div class="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <span class="text-xs text-slate-400">Official Primary Sourcing Verified</span>
          <a id="oppDetailApplyBtn" href="#" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors">
            Apply on Official Portal
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </article>

      <div class="flex items-center justify-between text-xs pt-2">
        <a href="/opportunities" onclick="navigateTo(event, '/opportunities')" class="text-indigo-600 hover:underline font-semibold">&larr; Return to Opportunities Directory</a>
      </div>
    </div>

    <!-- VIEW 9: LOGIN ROADMAP PLACEHOLDER -->
    <div id="view-login" class="view-panel hidden max-w-md mx-auto py-8 space-y-6">
      <div class="text-center space-y-1">
        <div class="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">IH</div>
        <h2 class="text-xl font-bold text-slate-900">Sign In to Intelligence Hub</h2>
        <p class="text-xs text-slate-500">Synchronize bookmarked opportunities, research alerts, and moderation actions.</p>
      </div>

      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input type="email" disabled placeholder="researcher@example.edu" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed text-xs" />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Password</label>
            <input type="password" disabled placeholder="••••••••••••" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed text-xs" />
          </div>
          <button type="button" disabled class="w-full py-2.5 bg-slate-300 text-slate-500 rounded-lg font-semibold text-xs cursor-not-allowed">
            Sign In (Locked in Phase 2)
          </button>
        </div>

        <div class="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-900 space-y-1.5">
          <div class="font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
            Phase 3 Authentication Roadmap
          </div>
          <p class="text-[11px] leading-relaxed text-indigo-800">
            Per project specifications, live authentication is introduced in <strong>Phase 3</strong> with Supabase Auth, session cookies, and Row Level Security.
          </p>
        </div>
      </div>

      <div class="text-center">
        <button onclick="navigateTo(event, '/')" class="text-xs font-semibold text-indigo-600 hover:underline">
          &larr; Return to Overview Dashboard
        </button>
      </div>
    </div>

    <!-- VIEW 10: ADMIN MODERATION CONSOLE (STAFF ONLY) -->
    <div id="view-admin" class="view-panel hidden space-y-6">
      <div class="border-b border-slate-200 pb-4">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase">Staff Console</span>
          <h1 class="text-xl font-bold text-slate-900">Verification & Moderation Console</h1>
        </div>
        <p class="text-xs text-slate-500 mt-0.5">Audit records, attach evidence URLs, verify claims, and record transparent public corrections.</p>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h2 class="text-sm font-bold text-slate-900">Catalog Verification Queue</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th class="py-2.5 px-3">Title / Record</th>
                <th class="py-2.5 px-3">Type</th>
                <th class="py-2.5 px-3">Provider</th>
                <th class="py-2.5 px-3">Status</th>
                <th class="py-2.5 px-3">Verification Tier</th>
              </tr>
            </thead>
            <tbody id="adminTableBody" class="divide-y divide-slate-100"></tbody>
          </table>
        </div>
      </div>
    </div>

  </main>

  <!-- Footer -->
  <footer class="bg-slate-950 text-slate-400 border-t border-slate-800 py-8 text-xs mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="font-bold text-slate-100">Intelligence Hub</span>
          <span class="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">v0.2.0-MVP</span>
        </div>
        <p class="text-[11px] text-slate-500 mt-1">
          Editorial intelligence discovery adhering to strict source attribution, non-rewritten headlines, and verified opportunity registries.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-4 text-xs">
        <a href="/news" onclick="navigateTo(event, '/news')" class="hover:text-slate-200 transition-colors">News</a>
        <span>•</span>
        <a href="/technology" onclick="navigateTo(event, '/technology')" class="hover:text-slate-200 transition-colors">AI & Tech</a>
        <span>•</span>
        <a href="/opportunities" onclick="navigateTo(event, '/opportunities')" class="hover:text-slate-200 transition-colors">Opportunities</a>
        <span>•</span>
        <a href="/search" onclick="navigateTo(event, '/search')" class="hover:text-slate-200 transition-colors">Search</a>
        <span>•</span>
        <a href="/admin" onclick="navigateTo(event, '/admin')" class="text-slate-500 hover:text-slate-400 transition-colors">Staff Console</a>
        <span>•</span>
        <a href="https://github.com/chaudharygautam970-stack/know-it-all" target="_blank" rel="noopener noreferrer" class="hover:underline text-indigo-400 font-semibold">GitHub</a>
      </div>
    </div>
  </footer>

  <!-- Client-side Interactive Controller -->
  <script>
    let appData = { news: [], technology: [], opportunities: [], savedIds: [] };
    let activeNewsCat = 'all';
    let newsSearchQuery = '';
    let activeTechCat = 'all';
    let techSearchQuery = '';
    let activeOppType = 'all';
    let activeOppStatus = 'all';
    let activeOppRegion = 'all';
    let oppSearchQuery = '';
    let searchPageTab = 'all';
    let searchPageQuery = '';

    const STORAGE_KEY = 'intelligence_hub_saved_items';

    // Local Storage Helpers
    function getSavedItems() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }

    function isItemSaved(id) {
      const items = getSavedItems();
      return items.some(i => i.id === id);
    }

    function toggleSave(id, itemType, slug, title, sourceName, categoryOrType) {
      try {
        let items = getSavedItems();
        const index = items.findIndex(i => i.id === id);
        if (index >= 0) {
          items.splice(index, 1);
        } else {
          items.push({
            id,
            itemType,
            slug,
            title,
            sourceName,
            categoryOrType,
            savedAt: new Date().toISOString()
          });
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        updateSavedCount();
        renderCurrentView();
      } catch (err) {
        console.error('Bookmark error:', err);
      }
    }

    function updateSavedCount() {
      const count = getSavedItems().length;
      const badge = document.getElementById('navSavedBadge');
      if (badge) badge.textContent = count;
      const pageCount = document.getElementById('savedPageCount');
      if (pageCount) pageCount.textContent = count;
    }

    // Router
    function navigateTo(e, path) {
      if (e) e.preventDefault();
      window.history.pushState({}, '', path);
      handleRoute();
    }

    window.addEventListener('popstate', handleRoute);

    function handleRoute() {
      const path = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);

      // Hide all panels
      document.querySelectorAll('.view-panel').forEach(p => p.classList.add('hidden'));

      // Update Nav active indicators
      document.querySelectorAll('.nav-item').forEach(el => {
        const r = el.getAttribute('data-route');
        if (r === path || (r === '/technology' && (path === '/technology' || path === '/ai-tech'))) {
          el.className = 'nav-item px-3 py-2 rounded-md transition-colors bg-slate-800 text-white font-bold border border-slate-700';
        } else {
          el.className = 'nav-item px-3 py-2 rounded-md transition-colors text-slate-300 hover:text-white hover:bg-slate-900';
        }
      });

      if (path === '/' || path === '') {
        showView('view-overview');
        renderOverview();
      } else if (path === '/news') {
        showView('view-news');
        renderNewsList();
      } else if (path.startsWith('/news/')) {
        const slug = path.replace('/news/', '');
        showView('view-news-detail');
        renderNewsDetail(slug);
      } else if (path === '/technology' || path === '/ai-tech') {
        showView('view-technology');
        renderTechList();
      } else if (path.startsWith('/technology/')) {
        const slug = path.replace('/technology/', '');
        showView('view-news-detail');
        renderNewsDetail(slug);
      } else if (path === '/opportunities') {
        showView('view-opportunities');
        if (urlParams.get('type')) activeOppType = urlParams.get('type');
        if (urlParams.get('status')) activeOppStatus = urlParams.get('status');
        renderOpportunitiesList();
      } else if (path.startsWith('/opportunities/')) {
        const slug = path.replace('/opportunities/', '');
        showView('view-opportunity-detail');
        renderOpportunityDetail(slug);
      } else if (path === '/search') {
        showView('view-search');
        const q = urlParams.get('q') || '';
        document.getElementById('pageSearchInput').value = q;
        searchPageQuery = q;
        renderSearchResults();
      } else if (path === '/saved') {
        showView('view-saved');
        renderSavedItemsPage();
      } else if (path === '/login') {
        showView('view-login');
      } else if (path === '/admin') {
        showView('view-admin');
        renderAdminQueue();
      } else {
        showView('view-overview');
        renderOverview();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showView(viewId) {
      const panel = document.getElementById(viewId);
      if (panel) panel.classList.remove('hidden');
    }

    function renderCurrentView() {
      const path = window.location.pathname;
      if (path === '/') renderOverview();
      else if (path === '/news') renderNewsList();
      else if (path === '/technology' || path === '/ai-tech') renderTechList();
      else if (path === '/opportunities') renderOpportunitiesList();
      else if (path === '/saved') renderSavedItemsPage();
      else if (path === '/search') renderSearchResults();
    }

    function toggleMobileMenu() {
      const el = document.getElementById('mobileMenu');
      el.classList.toggle('hidden');
    }

    // Navigation Search Handlers
    function handleGlobalSearchSubmit(e) {
      e.preventDefault();
      const val = document.getElementById('globalNavSearchInput').value.trim();
      navigateTo(null, '/search?q=' + encodeURIComponent(val));
    }

    function handleDashboardSearch(e) {
      e.preventDefault();
      const val = document.getElementById('dashboardSearchInput').value.trim();
      navigateTo(null, '/search?q=' + encodeURIComponent(val));
    }

    function navigateWithQuery(path, param, val) {
      navigateTo(null, path + '?' + param + '=' + encodeURIComponent(val));
    }

    // UI Badges & Formatters
    function renderStatusPill(status) {
      const map = {
        open: { label: 'Open', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
        closing_soon: { label: 'Closing Soon', cls: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
        closed: { label: 'Closed', cls: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-500' },
        unknown: { label: 'Deadline Not Provided', cls: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' }
      };
      const cfg = map[status] || map.unknown;
      return \`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border \${cfg.cls}">
        <span class="w-1.5 h-1.5 rounded-full \${cfg.dot}"></span>
        \${cfg.label}
      </span>\`;
    }

    function renderVerificationPill(verification) {
      if (!verification) return '';
      const map = {
        verified: { label: '✓ Verified Source', cls: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
        under_review: { label: 'ℹ Under Review', cls: 'bg-blue-50 text-blue-700 border-blue-300' },
        disputed: { label: '⚠ Disputed Record', cls: 'bg-rose-50 text-rose-700 border-rose-300' },
        unverified: { label: '○ Unverified', cls: 'bg-slate-100 text-slate-600 border-slate-300' }
      };
      const cfg = map[verification.status] || map.unverified;
      if (verification.evidenceUrl) {
        return \`<a href="\${verification.evidenceUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border \${cfg.cls} hover:opacity-80" title="Inspect official verification evidence">\${cfg.label}</a>\`;
      }
      return \`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border \${cfg.cls}">\${cfg.label}</span>\`;
    }

    function renderBookmarkBtn(id, itemType, slug, title, sourceName, categoryOrType) {
      const saved = isItemSaved(id);
      const safeTitle = title.replace(/'/g, "\\\\'");
      const safeSource = sourceName.replace(/'/g, "\\\\'");
      const safeCat = categoryOrType.replace(/'/g, "\\\\'");
      return \`<button type="button" onclick="toggleSave('\${id}', '\${itemType}', '\${slug}', '\${safeTitle}', '\${safeSource}', '\${safeCat}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors \${saved ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}">
        <span class="\${saved ? 'text-amber-500 font-bold' : 'text-slate-400'}">\${saved ? '★ Saved' : '☆ Save'}</span>
      </button>\`;
    }

    function renderCorrectionDrawer(corrections) {
      if (!corrections || corrections.length === 0) return '';
      const drawerId = 'corr-' + Math.random().toString(36).substring(2, 8);
      return \`<div class="rounded border border-amber-200 bg-amber-50/60 p-2 text-xs">
        <div class="flex items-center justify-between">
          <span class="font-medium text-amber-900 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            \${corrections.length} Transparent Correction\${corrections.length > 1 ? 's' : ''} on record
          </span>
          <button type="button" onclick="document.getElementById('\${drawerId}').classList.toggle('hidden')" class="underline text-amber-800 text-[11px] font-semibold">View Audit</button>
        </div>
        <div id="\${drawerId}" class="hidden mt-2 pt-2 border-t border-amber-200/60 space-y-1">
          \${corrections.map(c => \`
            <div class="text-[11px] py-1 border-b border-amber-200/40 last:border-none">
              <div class="flex justify-between font-medium text-amber-950">
                <span>Field: <code>\${c.fieldChanged}</code></span>
                <span>\${new Date(c.timestamp).toUTCString()}</span>
              </div>
              <div class="text-slate-600 mt-0.5">Reason: \${c.reason}</div>
              \${c.previousValue ? \`<div class="text-slate-400 line-through">Prior: \${c.previousValue}</div>\` : ''}
            </div>
          \`).join('')}
        </div>
      </div>\`;
    }

    // OVERVIEW RENDERER
    function renderOverview() {
      // 1. Urgent deadlines
      const urgent = appData.opportunities.filter(o => o.status === 'closing_soon');
      const urgentContainer = document.getElementById('urgentDeadlineList');
      if (urgent.length === 0) {
        urgentContainer.innerHTML = '<div class="col-span-2 p-3 bg-white rounded border text-center text-xs text-slate-500">No opportunities closing within 7 days.</div>';
      } else {
        urgentContainer.innerHTML = urgent.map(opp => \`
          <div class="bg-white p-3.5 rounded-lg border border-amber-200 flex flex-col justify-between gap-2 shadow-sm">
            <div>
              <div class="flex items-center justify-between gap-2 text-[11px]">
                <span class="font-bold uppercase text-amber-800">\${opp.opportunityType}</span>
                <span class="text-rose-600 font-semibold">Closing: \${new Date(opp.deadline).toUTCString()}</span>
              </div>
              <h3 class="text-xs font-bold text-slate-900 mt-1">
                <a href="/opportunities/\${opp.slug}" onclick="navigateTo(event, '/opportunities/\${opp.slug}')" class="hover:text-indigo-600">\${opp.title}</a>
              </h3>
              <div class="text-[11px] text-slate-500 mt-0.5">Provider: \${opp.providerName} • 📍 \${opp.region}</div>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
              <span class="font-semibold text-slate-700">\${opp.fundingAmount || 'Discretionary funding'}</span>
              <a href="/opportunities/\${opp.slug}" onclick="navigateTo(event, '/opportunities/\${opp.slug}')" class="font-bold text-amber-900 hover:underline">View Details &rarr;</a>
            </div>
          </div>
        \`).join('');
      }

      // 2. Featured Tech
      document.getElementById('overviewFeaturedList').innerHTML = appData.technology.slice(0, 2).map(renderNewsCardHtml).join('');

      // 3. Latest News
      document.getElementById('overviewLatestNewsList').innerHTML = appData.news.slice(0, 4).map(item => \`
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span class="font-bold uppercase text-blue-600">\${item.category}</span>
            <span>\${new Date(item.publishedAt).toLocaleDateString()}</span>
          </div>
          <h3 class="text-xs font-bold text-slate-900 leading-snug">
            <a href="/news/\${item.slug}" onclick="navigateTo(event, '/news/\${item.slug}')" class="hover:text-indigo-600">\${item.title}</a>
          </h3>
          <p class="text-[11px] text-slate-600 line-clamp-2">\${item.excerpt || ''}</p>
          <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
            <span>Source: <strong>\${item.attribution.sourceName}</strong></span>
            <a href="/news/\${item.slug}" onclick="navigateTo(event, '/news/\${item.slug}')" class="text-indigo-600 font-semibold hover:underline">Read &rarr;</a>
          </div>
        </div>
      \`).join('');

      // 4. Tech Radar
      document.getElementById('overviewTechRadarList').innerHTML = appData.technology.slice(2, 6).map(item => \`
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span class="font-bold uppercase text-purple-600">\${item.category}</span>
            <span>\${new Date(item.publishedAt).toLocaleDateString()}</span>
          </div>
          <h3 class="text-xs font-bold text-slate-900 leading-snug">
            <a href="/news/\${item.slug}" onclick="navigateTo(event, '/news/\${item.slug}')" class="hover:text-indigo-600">\${item.title}</a>
          </h3>
          <p class="text-[11px] text-slate-600 line-clamp-2">\${item.excerpt || ''}</p>
          <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
            <span>Source: <strong>\${item.attribution.sourceName}</strong></span>
            <a href="/news/\${item.slug}" onclick="navigateTo(event, '/news/\${item.slug}')" class="text-indigo-600 font-semibold hover:underline">View Details &rarr;</a>
          </div>
        </div>
      \`).join('');

      // 5. Opportunities
      document.getElementById('overviewOpportunitiesList').innerHTML = appData.opportunities.slice(0, 3).map(renderOpportunityCardHtml).join('');
    }

    // NEWS LIST RENDERER
    function handleNewsSearch(val) {
      newsSearchQuery = val.toLowerCase().trim();
      renderNewsList();
    }

    function setNewsCategory(cat) {
      activeNewsCat = cat;
      document.querySelectorAll('.news-cat-btn').forEach(b => {
        if (b.getAttribute('data-cat') === cat) {
          b.className = 'news-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white';
        } else {
          b.className = 'news-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200';
        }
      });
      renderNewsList();
    }

    function renderNewsList() {
      const container = document.getElementById('newsPageList');
      const sortVal = document.getElementById('newsSortSelect').value;

      let filtered = [...appData.news];
      if (activeNewsCat !== 'all') {
        filtered = filtered.filter(n => n.category === activeNewsCat);
      }
      if (newsSearchQuery) {
        filtered = filtered.filter(n =>
          n.title.toLowerCase().includes(newsSearchQuery) ||
          (n.excerpt && n.excerpt.toLowerCase().includes(newsSearchQuery)) ||
          n.attribution.sourceName.toLowerCase().includes(newsSearchQuery) ||
          n.tags.some(t => t.toLowerCase().includes(newsSearchQuery))
        );
      }

      filtered.sort((a, b) => {
        const tA = new Date(a.publishedAt).getTime();
        const tB = new Date(b.publishedAt).getTime();
        return sortVal === 'newest' ? tB - tA : tA - tB;
      });

      document.getElementById('newsResultCount').textContent = filtered.length;

      if (filtered.length === 0) {
        container.innerHTML = \`<div class="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-2">
          <p class="text-sm font-bold text-slate-800">No news articles match your filter</p>
          <p class="text-xs text-slate-500">Try adjusting your search query or selecting 'All News'.</p>
          <button onclick="setNewsCategory('all'); document.getElementById('newsFilterSearchInput').value=''; newsSearchQuery='';" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold">Reset</button>
        </div>\`;
        return;
      }

      container.innerHTML = filtered.map(renderNewsCardHtml).join('');
    }

    // TECH LIST RENDERER
    function handleTechSearch(val) {
      techSearchQuery = val.toLowerCase().trim();
      renderTechList();
    }

    function setTechCategory(cat) {
      activeTechCat = cat;
      document.querySelectorAll('.tech-cat-btn').forEach(b => {
        if (b.getAttribute('data-cat') === cat) {
          b.className = 'tech-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white';
        } else {
          b.className = 'tech-cat-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200';
        }
      });
      renderTechList();
    }

    function renderTechList() {
      const container = document.getElementById('techPageList');
      const sortVal = document.getElementById('techSortSelect').value;

      let filtered = [...appData.technology];
      if (activeTechCat !== 'all') {
        filtered = filtered.filter(t => t.category === activeTechCat);
      }
      if (techSearchQuery) {
        filtered = filtered.filter(t =>
          t.title.toLowerCase().includes(techSearchQuery) ||
          (t.excerpt && t.excerpt.toLowerCase().includes(techSearchQuery)) ||
          t.attribution.sourceName.toLowerCase().includes(techSearchQuery) ||
          t.tags.some(tag => tag.toLowerCase().includes(techSearchQuery))
        );
      }

      filtered.sort((a, b) => {
        const tA = new Date(a.publishedAt).getTime();
        const tB = new Date(b.publishedAt).getTime();
        return sortVal === 'newest' ? tB - tA : tA - tB;
      });

      document.getElementById('techResultCount').textContent = filtered.length;

      if (filtered.length === 0) {
        container.innerHTML = \`<div class="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-2">
          <p class="text-sm font-bold text-slate-800">No technology dispatches found</p>
          <p class="text-xs text-slate-500">Try adjusting your keyword filter.</p>
          <button onclick="setTechCategory('all'); document.getElementById('techFilterSearchInput').value=''; techSearchQuery='';" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold">Reset</button>
        </div>\`;
        return;
      }

      container.innerHTML = filtered.map(renderNewsCardHtml).join('');
    }

    // OPPORTUNITIES LIST RENDERER
    function handleOppsSearch(val) {
      oppSearchQuery = val.toLowerCase().trim();
      renderOpportunitiesList();
    }

    function setOppType(type) {
      activeOppType = type;
      document.querySelectorAll('.opp-type-btn').forEach(b => {
        if (b.getAttribute('data-type') === type) {
          b.className = 'opp-type-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white';
        } else {
          b.className = 'opp-type-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200';
        }
      });
      renderOpportunitiesList();
    }

    function setOppStatus(status) {
      activeOppStatus = status;
      document.querySelectorAll('.opp-status-btn').forEach(b => {
        if (b.getAttribute('data-status') === status) {
          b.className = 'opp-status-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white';
        } else {
          b.className = 'opp-status-btn px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200';
        }
      });
      renderOpportunitiesList();
    }

    function renderOpportunitiesList() {
      const container = document.getElementById('oppsPageList');
      const sortVal = document.getElementById('oppsSortSelect').value;
      const regionVal = document.getElementById('oppsRegionSelect').value;

      let filtered = [...appData.opportunities];
      if (activeOppType !== 'all') {
        filtered = filtered.filter(o => o.opportunityType === activeOppType);
      }
      if (activeOppStatus !== 'all') {
        filtered = filtered.filter(o => o.status === activeOppStatus);
      }
      if (regionVal !== 'all') {
        filtered = filtered.filter(o => o.region === regionVal);
      }
      if (oppSearchQuery) {
        filtered = filtered.filter(o =>
          o.title.toLowerCase().includes(oppSearchQuery) ||
          o.description.toLowerCase().includes(oppSearchQuery) ||
          o.providerName.toLowerCase().includes(oppSearchQuery) ||
          o.region.toLowerCase().includes(oppSearchQuery) ||
          o.tags.some(tag => tag.toLowerCase().includes(oppSearchQuery))
        );
      }

      filtered.sort((a, b) => {
        if (sortVal === 'title') return a.title.localeCompare(b.title);
        if (sortVal === 'deadline_soonest') {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      document.getElementById('oppsResultCount').textContent = filtered.length;

      if (filtered.length === 0) {
        container.innerHTML = \`<div class="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-2">
          <p class="text-sm font-bold text-slate-800">No opportunities matched your active filters</p>
          <p class="text-xs text-slate-500">Try resetting the type or status filters to broaden results.</p>
          <button onclick="setOppType('all'); setOppStatus('all'); oppSearchQuery=''; document.getElementById('oppsFilterSearchInput').value='';" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold">Reset Filters</button>
        </div>\`;
        return;
      }

      container.innerHTML = filtered.map(renderOpportunityCardHtml).join('');
    }

    // SEARCH PAGE RENDERER
    function handleSearchPageInput(val) {
      searchPageQuery = val.toLowerCase().trim();
      renderSearchResults();
    }

    function clearSearchPageInput() {
      document.getElementById('pageSearchInput').value = '';
      searchPageQuery = '';
      renderSearchResults();
    }

    function setSearchTab(tab) {
      searchPageTab = tab;
      document.querySelectorAll('.search-tab-btn').forEach(b => {
        if (b.getAttribute('data-tab') === tab) {
          b.className = 'search-tab-btn px-3 py-1.5 rounded-lg bg-indigo-600 text-white';
        } else {
          b.className = 'search-tab-btn px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200';
        }
      });
      renderSearchResults();
    }

    function renderSearchResults() {
      const q = searchPageQuery;
      const allNews = appData.news;
      const allTech = appData.technology;
      const allOpps = appData.opportunities;

      const filterFn = (text) => !q || text.toLowerCase().includes(q);

      const matchedNews = allNews.filter(n =>
        filterFn(n.title + ' ' + (n.excerpt || '') + ' ' + n.attribution.sourceName + ' ' + n.tags.join(' '))
      );
      const matchedTech = allTech.filter(t =>
        filterFn(t.title + ' ' + (t.excerpt || '') + ' ' + t.attribution.sourceName + ' ' + t.tags.join(' '))
      );
      const matchedOpps = allOpps.filter(o =>
        filterFn(o.title + ' ' + o.description + ' ' + o.providerName + ' ' + o.region + ' ' + o.tags.join(' '))
      );

      document.getElementById('searchTabAllCount').textContent = matchedNews.length + matchedTech.length + matchedOpps.length;
      document.getElementById('searchTabOppsCount').textContent = matchedOpps.length;
      document.getElementById('searchTabTechCount').textContent = matchedTech.length;
      document.getElementById('searchTabNewsCount').textContent = matchedNews.length;

      const container = document.getElementById('searchResultsList');

      if ((matchedNews.length + matchedTech.length + matchedOpps.length) === 0) {
        container.innerHTML = \`<div class="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-2">
          <p class="text-sm font-bold text-slate-800">No results found for "\${q}"</p>
          <p class="text-xs text-slate-500">Check spelling or try a broader research term.</p>
          <button onclick="clearSearchPageInput()" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold">Clear Query</button>
        </div>\`;
        return;
      }

      let html = '';

      if ((searchPageTab === 'all' || searchPageTab === 'opportunities') && matchedOpps.length > 0) {
        html += \`<div class="space-y-3">
          <h2 class="text-sm font-bold uppercase tracking-wider text-slate-500 border-b pb-1">Opportunities (\${matchedOpps.length})</h2>
          <div class="space-y-4">\${matchedOpps.map(renderOpportunityCardHtml).join('')}</div>
        </div>\`;
      }

      if ((searchPageTab === 'all' || searchPageTab === 'technology') && matchedTech.length > 0) {
        html += \`<div class="space-y-3">
          <h2 class="text-sm font-bold uppercase tracking-wider text-purple-600 border-b pb-1">AI & Technology Developments (\${matchedTech.length})</h2>
          <div class="space-y-4">\${matchedTech.map(renderNewsCardHtml).join('')}</div>
        </div>\`;
      }

      if ((searchPageTab === 'all' || searchPageTab === 'news') && matchedNews.length > 0) {
        html += \`<div class="space-y-3">
          <h2 class="text-sm font-bold uppercase tracking-wider text-blue-600 border-b pb-1">General & Policy News (\${matchedNews.length})</h2>
          <div class="space-y-4">\${matchedNews.map(renderNewsCardHtml).join('')}</div>
        </div>\`;
      }

      container.innerHTML = html;
    }

    // SAVED ITEMS RENDERER
    function renderSavedItemsPage() {
      const items = getSavedItems();
      const container = document.getElementById('savedItemsContainer');
      document.getElementById('savedPageCount').textContent = items.length;

      if (items.length === 0) {
        container.innerHTML = \`<div class="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-3">
          <div class="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center text-xl font-bold">★</div>
          <h2 class="text-sm font-bold text-slate-900">No saved items yet</h2>
          <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Click the "Save" button on any opportunity or news card to pin it to your personal workspace. Saved records survive page refreshes.
          </p>
          <a href="/opportunities" onclick="navigateTo(event, '/opportunities')" class="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">Browse Opportunities Catalog</a>
        </div>\`;
        return;
      }

      container.innerHTML = items.map(item => {
        const detailUrl = item.itemType === 'opportunity' ? '/opportunities/' + item.slug : '/news/' + item.slug;
        return \`
          <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase">\${item.categoryOrType}</span>
                  <span class="text-[11px] text-slate-400">Saved \${new Date(item.savedAt).toLocaleDateString()}</span>
                </div>
                <h3 class="text-base font-bold text-slate-900">
                  <a href="\${detailUrl}" onclick="navigateTo(event, '\${detailUrl}')" class="hover:text-indigo-600">\${item.title}</a>
                </h3>
                <div class="text-xs text-slate-500">Source / Provider: <strong>\${item.sourceName}</strong></div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <a href="\${detailUrl}" onclick="navigateTo(event, '\${detailUrl}')" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold">Open Detail</a>
                <button type="button" onclick="handleSavedPageRemove('\${item.id}')" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold">Remove</button>
              </div>
            </div>
            <div class="pt-2 border-t border-slate-100 text-xs text-slate-600">
              \${item.userNotes ? \`<div><strong>Note:</strong> \${item.userNotes}</div>\` : \`<div class="italic text-slate-400">No notes attached.</div>\`}
            </div>
          </div>
        \`;
      }).join('');
    }

    function handleSavedPageRemove(id) {
      let items = getSavedItems();
      items = items.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      updateSavedCount();
      renderSavedItemsPage();
    }

    // DETAIL RENDERERS
    function renderNewsDetail(slug) {
      const all = [...appData.news, ...appData.technology];
      const item = all.find(n => n.slug === slug);
      if (!item) {
        document.getElementById('view-news-detail').innerHTML = \`
          <div class="bg-white p-8 rounded-xl border text-center space-y-3">
            <h2 class="text-base font-bold text-slate-900">Article Record Not Found</h2>
            <p class="text-xs text-slate-500">No news or technology intelligence dispatch was found with the slug "\${slug}".</p>
            <a href="/news" onclick="navigateTo(event, '/news')" class="inline-block px-4 py-2 bg-indigo-600 text-white rounded text-xs font-semibold">&larr; Return to News</a>
          </div>
        \`;
        return;
      }

      document.getElementById('newsDetailBreadcrumb').textContent = item.title;
      document.getElementById('newsDetailCategory').textContent = item.category;
      document.getElementById('newsDetailDate').textContent = 'Published ' + new Date(item.publishedAt).toUTCString();
      document.getElementById('newsDetailTitle').textContent = item.title;
      document.getElementById('newsDetailSourceLink').textContent = item.attribution.sourceName;
      document.getElementById('newsDetailSourceLink').href = item.attribution.sourceUrl;
      document.getElementById('newsDetailPublisher').textContent = item.attribution.publisher && item.attribution.publisher !== item.attribution.sourceName ? ' (Publisher: ' + item.attribution.publisher + ')' : '';
      document.getElementById('newsDetailExcerpt').textContent = item.excerpt || 'No authorized briefing summary on record.';
      document.getElementById('newsDetailOfficialBtn').href = item.url;
      document.getElementById('newsDetailBookmarkContainer').innerHTML = renderBookmarkBtn(item.id, 'news', item.slug, item.title, item.attribution.sourceName, item.category);

      document.getElementById('newsDetailTags').innerHTML = item.tags.map(t => \`<span class="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium text-slate-600">#\${t}</span>\`).join('');
      document.getElementById('newsDetailCorrections').innerHTML = renderCorrectionDrawer(item.correctionHistory);
    }

    function renderOpportunityDetail(slug) {
      const opp = appData.opportunities.find(o => o.slug === slug);
      if (!opp) {
        document.getElementById('view-opportunity-detail').innerHTML = \`
          <div class="bg-white p-8 rounded-xl border text-center space-y-3">
            <h2 class="text-base font-bold text-slate-900">Opportunity Record Not Found</h2>
            <p class="text-xs text-slate-500">No opportunity program was found matching "\${slug}".</p>
            <a href="/opportunities" onclick="navigateTo(event, '/opportunities')" class="inline-block px-4 py-2 bg-indigo-600 text-white rounded text-xs font-semibold">&larr; Return to Opportunities</a>
          </div>
        \`;
        return;
      }

      document.getElementById('oppDetailBreadcrumb').textContent = opp.title;
      document.getElementById('oppDetailType').textContent = opp.opportunityType;
      document.getElementById('oppDetailStatus').innerHTML = renderStatusPill(opp.status);
      document.getElementById('oppDetailVerification').innerHTML = renderVerificationPill(opp.verification);
      document.getElementById('oppDetailRegion').textContent = '📍 ' + opp.region;
      document.getElementById('oppDetailTitle').textContent = opp.title;
      document.getElementById('oppDetailProvider').textContent = opp.providerName + ' (' + opp.providerType + ')';

      document.getElementById('oppDetailFunding').textContent = opp.isFundingExplicit && opp.fundingAmount ? opp.fundingAmount : 'Not explicitly stated by provider';
      document.getElementById('oppDetailDeadline').textContent = opp.isDeadlineExplicit && opp.deadline ? new Date(opp.deadline).toUTCString() : 'Deadline not provided';
      document.getElementById('oppDetailVerificationText').textContent = opp.verification.status.replace('_', ' ');

      document.getElementById('oppDetailDescription').textContent = opp.description;
      document.getElementById('oppDetailEligibility').textContent = opp.isEligibilityExplicit && opp.eligibilityCriteria ? opp.eligibilityCriteria : 'Eligibility criteria are not globally summarized in provider bulletins. Please consult the issuing institution directly.';

      document.getElementById('oppDetailVerificationMeta').innerHTML = 'Last verified: <strong>' + (opp.verification.lastVerifiedAt ? new Date(opp.verification.lastVerifiedAt).toUTCString() : 'Pending') + '</strong> by ' + (opp.verification.verifiedBy || 'Automated Feed') + (opp.verification.notes ? ' — Note: ' + opp.verification.notes : '');
      document.getElementById('oppDetailEvidenceLink').innerHTML = opp.verification.evidenceUrl ? \`<a href="\${opp.verification.evidenceUrl}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 underline font-medium">Inspect Official Verification Evidence Document &rarr;</a>\` : '';

      document.getElementById('oppDetailTags').innerHTML = opp.tags.map(t => \`<span class="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium text-slate-600">#\${t}</span>\`).join('');
      document.getElementById('oppDetailCorrections').innerHTML = renderCorrectionDrawer(opp.correctionHistory);
      document.getElementById('oppDetailApplyBtn').href = opp.sourceUrl;
      document.getElementById('oppDetailBookmarkContainer').innerHTML = renderBookmarkBtn(opp.id, 'opportunity', opp.slug, opp.title, opp.providerName, opp.opportunityType);
    }

    function renderAdminQueue() {
      document.getElementById('adminTableBody').innerHTML = appData.opportunities.map(opp => \`
        <tr class="hover:bg-slate-50">
          <td class="py-2.5 px-3">
            <div class="font-semibold text-slate-900">\${opp.title}</div>
            <div class="text-[10px] text-slate-400">ID: \${opp.id}</div>
          </td>
          <td class="py-2.5 px-3 uppercase text-[10px] font-bold text-slate-500">\${opp.opportunityType}</td>
          <td class="py-2.5 px-3 text-slate-700 font-medium">\${opp.providerName}</td>
          <td class="py-2.5 px-3">\${renderStatusPill(opp.status)}</td>
          <td class="py-2.5 px-3">\${renderVerificationPill(opp.verification)}</td>
        </tr>
      \`).join('');
    }

    // HTML Component Builders
    function renderNewsCardHtml(item) {
      return \`
        <article class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">\${item.category}</span>
                <span class="text-[11px] text-slate-400">\${new Date(item.publishedAt).toLocaleDateString()}</span>
              </div>
              <h3 class="text-base font-bold text-slate-900 leading-snug">
                <a href="/news/\${item.slug}" onclick="navigateTo(event, '/news/\${item.slug}')" class="hover:text-indigo-600 transition-colors">\${item.title}</a>
              </h3>
            </div>
            \${renderBookmarkBtn(item.id, 'news', item.slug, item.title, item.attribution.sourceName, item.category)}
          </div>
          \${item.excerpt ? \`<p class="text-xs text-slate-600 leading-relaxed">\${item.excerpt}</p>\` : ''}
          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            \${item.tags.map(t => \`<span class="px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px] font-medium border border-slate-100">#\${t}</span>\`).join('')}
          </div>
          \${renderCorrectionDrawer(item.correctionHistory)}
          <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <a href="/news/\${item.slug}" onclick="navigateTo(event, '/news/\${item.slug}')" class="text-indigo-600 hover:underline font-semibold">Read Record Detail &rarr;</a>
            <a href="\${item.url}" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-slate-800 text-[11px] inline-flex items-center gap-1">
              Original Publisher
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        </article>
      \`;
    }

    function renderOpportunityCardHtml(opp) {
      const funding = opp.isFundingExplicit && opp.fundingAmount ? opp.fundingAmount : 'Not explicitly stated';
      const deadline = opp.isDeadlineExplicit && opp.deadline ? new Date(opp.deadline).toUTCString() : 'Deadline not provided';
      const eligibility = opp.isEligibilityExplicit && opp.eligibilityCriteria ? opp.eligibilityCriteria : 'Refer to issuing organization portal';

      return \`
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all space-y-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="space-y-1 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">\${opp.opportunityType}</span>
                \${renderStatusPill(opp.status)}
                \${renderVerificationPill(opp.verification)}
                <span class="text-[11px] text-slate-500">📍 \${opp.region}</span>
              </div>
              <h3 class="text-base font-bold text-slate-900 leading-snug">
                <a href="/opportunities/\${opp.slug}" onclick="navigateTo(event, '/opportunities/\${opp.slug}')" class="hover:text-indigo-600 transition-colors">\${opp.title}</a>
              </h3>
              <div class="text-xs text-slate-600 font-medium">Organization: <span class="font-semibold text-slate-900">\${opp.providerName}</span> (\${opp.providerType})</div>
            </div>
            \${renderBookmarkBtn(opp.id, 'opportunity', opp.slug, opp.title, opp.providerName, opp.opportunityType)}
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">\${opp.description}</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Funding / Grant</span>
              <span class="font-semibold text-slate-800 block truncate">\${funding}</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Application Deadline</span>
              <span class="font-semibold text-slate-800 block truncate">\${deadline}</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Eligibility</span>
              <span class="text-slate-700 block truncate" title="\${opp.eligibilityCriteria || 'See portal'}">\${eligibility}</span>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-1.5">
            \${opp.tags.map(t => \`<span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">#\${t}</span>\`).join('')}
          </div>
          \${renderCorrectionDrawer(opp.correctionHistory)}
          <div class="text-xs border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2">
            <a href="/opportunities/\${opp.slug}" onclick="navigateTo(event, '/opportunities/\${opp.slug}')" class="text-indigo-600 hover:underline font-semibold">View Full Specification &rarr;</a>
            <a href="\${opp.sourceUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors">
              Official Portal
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        </div>
      \`;
    }

    // Initial Startup
    async function initApp() {
      try {
        const res = await fetch('/api/data');
        appData = await res.json();

        // Populate region dropdown
        const regions = Array.from(new Set(appData.opportunities.map(o => o.region)));
        const regionSelect = document.getElementById('oppsRegionSelect');
        if (regionSelect) {
          regionSelect.innerHTML = '<option value="all">All Regions</option>' + regions.map(r => \`<option value="\${r}">\${r}</option>\`).join('');
        }

        updateSavedCount();
        handleRoute();
      } catch (err) {
        console.error('Failed to initialize app data:', err);
      }
    }

    initApp();
  </script>
</body>
</html>`;
}

server.listen(PORT, () => {
  console.log(`[Intelligence Hub Phase 2] Local server listening on http://localhost:${PORT}`);
});

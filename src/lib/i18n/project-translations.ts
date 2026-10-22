import type { Project, Post } from '@/types/database.types';
import type { Locale } from './types';

interface ProjectTranslation {
  title?: string;
  summary?: string;
  problem?: string;
  features?: string[];
  limitations?: string;
}

interface PostTranslation {
  title?: string;
  excerpt?: string;
}

export const PROJECT_TRANSLATIONS_EN: Record<string, ProjectTranslation> = {
  photogpay: {
    title: 'PhotoGPay — Photo Selection Tool for Photographers',
    summary:
      'Google Drive integrated photo selection tool for photographers. Clients pick their favorites without login, and photographers copy all selected filenames in 1-click for Lightroom.',
    problem:
      'Photography clients often send messy screenshots on WhatsApp or manual photo numbers, causing photographers to spend hours matching files one by one with a high risk of editing the wrong images.',
    features: [
      'Instant photo gallery integration directly from Google Drive folders',
      '1-Click copy of all selected filenames directly to clipboard',
      'Zero-friction client gallery access without account creation or app installation',
      'Native compatibility with batch search in Adobe Lightroom & macOS Finder',
    ],
    limitations:
      'Initial preview thumbnail resolution depends on JPG size synchronized from Google Drive.',
  },
  stockflow: {
    title: 'StockFlow — Inventory & Order Management System',
    summary:
      'Single source of truth for stock movement, supplier purchase orders, and sales cycles based on an atomic warehouse ledger.',
    problem:
      'Spreadsheet-based inventory tracking in MSMEs and distributors suffers from stock discrepancies, missing audit trails during revisions, and accidental overselling during simultaneous orders.',
    features: [
      'Append-only ledger stock mutation tracking with complete audit trail',
      'Atomic transaction validation to guarantee Zero Negative Stock',
      'Automated COGS valuation using the Weighted Average Cost (WAC) method',
      'Point of Sale cashier simulation & catalog-integrated purchase orders',
      'Strict Role-Based Access Control (RBAC) between Admins and Operations Staff',
    ],
    limitations:
      'External hardware barcode scanner support currently operates via standard keyboard wedge emulation.',
  },
  nexapos: {
    title: 'NexaPOS — Modern Retail Point of Sale',
    summary:
      'Web-based retail cashier system with Paper & Ink design aesthetics, real-time revenue analytics, category management, and automated low-stock warnings.',
    problem:
      'Conventional retail cashier apps often feature cluttered interfaces confusing for beginner cashiers, lag during cart calculation, and lack early alerts for depleted stock on store shelves.',
    features: [
      'High-speed cashier interface with high-contrast Paper & Ink layout',
      'Interactive daily sales chart and revenue contribution by product category',
      'Instant visual warnings for inventory dipping below critical thresholds',
      'Recent cashier transaction ledger with customizable date range filters',
    ],
    limitations:
      'Physical receipt printing currently utilizes the standard browser print dialog.',
  },
  hubflow: {
    title: 'HubFlow — CRM & Contact Management System',
    summary:
      'Centralized SaaS CRM platform for client contact tracking, relational company directories, dynamic tag segmentation, and pipeline prospect monitoring.',
    problem:
      'Business teams frequently lose track of prospective clients because contact details are scattered across personal phonebooks, separate emails, and lack relational linking to parent companies.',
    features: [
      'Relational contact and company directory management',
      'Dynamic tagging taxonomy powered by PostgreSQL junction tables',
      'Metric card overview for new contacts (last 7 days), companies, and active tags',
      'Dual-mode storage support: Live Supabase DB and Local Storage Demo',
    ],
    limitations:
      'Mass outreach email dispatch is currently handled via the system default email client.',
  },
  'servis-ac-ops': {
    title: 'Prima Sejuk AC Service — Operations & Dispatch System',
    summary:
      'Internal HVAC maintenance management app: technician work order dispatching, daily assignment board, and operational revenue auditing.',
    problem:
      'Residential and commercial AC servicing businesses suffer from technician schedule overlaps, missing spare parts upon site arrival, and delayed service fee verification.',
    features: [
      'Central dispatch command center and technician photo review approval queue',
      'Daily field technician visual timeline schedule board',
      'Customer maintenance history database, service locations, and AC capacity (PK)',
      'Role simulation switcher (Owner, Ops Admin, Field Technician)',
    ],
    limitations:
      'Real-time technician location tracking relies on status milestone check-ins.',
  },
  'ecommerce-analytics': {
    title: 'Nusantara Store — E-commerce Analytics & Executive Dashboard',
    summary:
      'Executive SaaS analytics dashboard for modern online retailers. Interactive visualization of net revenue velocity, category contribution, and regional performance across top 5 cities.',
    problem:
      'Online store owners struggle to decipher sales performance trends and regional payment preferences because transaction data is fragmented across multiple channels without unified visual intelligence.',
    features: [
      'Interactive revenue trend and order velocity charts built with Recharts',
      'Regional revenue breakdown across major Indonesian economic hubs',
      'Market share distribution of digital payment methods (QRIS, E-Wallet, VA, COD)',
      'Top Selling Products rankings with unit volume and revenue metrics',
    ],
    limitations:
      'Demo environment uses synthetic commercial transaction data for privacy compliance.',
  },
  'maison-laura-parfumerie': {
    title: "Maison L'Aura — Haute Parfumerie & Curated Scents",
    summary:
      'Boutique luxury e-commerce for small-batch artisan perfumes featuring Playfair editorial typography, olfactory family curation, and real-time shopping cart.',
    problem:
      'Fragrance e-commerce sites often feel generic and fail to showcase scent pyramid nuances, hand-poured artisan craftsmanship, or deliver an intimate shopping experience.',
    features: [
      'Luxurious editorial typography with Playfair Display and warm champagne hues',
      'Catalog curation based on olfactory families and signature compositions',
      'Artisan product cards with bottle size selectors (Select Size)',
      'Interactive shopping bag drawer with streamlined checkout preview',
    ],
    limitations:
      'Monthly discovery sample box subscription module is slated for version 2.0 release.',
  },
  'community-forum': {
    title: 'Community Forum — Discussion & Knowledge Hub',
    summary:
      'Modern tech community forum platform with threaded discussions, identity verification, topic categorization, and lightning-fast search.',
    problem:
      'Technical discussions and peer knowledge sharing on general social media quickly get buried and are nearly impossible to reference long-term.',
    features: [
      'Threaded discussions organized by interest categories and tags',
      'Identity Guard system for contributor authentication and role rights',
      'Fast search filtering across community discussions and articles',
      'Interactive toast notifications for new replies and thread engagements',
    ],
    limitations:
      'Advanced WYSIWYG markdown editor integration is currently under development.',
  },
  'publiqa-blog': {
    title: 'Publiqa — Modern Content & Publishing Platform',
    summary:
      'Independent content publishing and editorial blog platform featuring executive metrics, article lifecycle management, and content taxonomy.',
    problem:
      'Legacy blogging CMS platforms are bogged down by heavy dependencies, sub-optimal Core Web Vitals, and convoluted writing workflows.',
    features: [
      'Executive dashboard summarizing article count, active categories, and monthly velocity',
      'Centralized article lifecycle management from draft to published',
      'High-performance architecture built on Next.js App Router',
      'Minimalist editorial typography optimized for both readers and authors',
    ],
    limitations:
      'Multi-author peer review editorial workflows are planned for an upcoming release.',
  },
  'brandlab-launchpad': {
    title: 'BrandLab Launchpad — Curated High-Converting Landing Pages',
    summary:
      'A suite of 6 high-converting landing pages inside a single integrated architecture. Precision-designed with brand identity, color themes, and distinct typography for various business verticals.',
    problem:
      'Businesses and agencies struggle to create high-converting landing pages because generic templates ignore visual hierarchy, color psychology, and typography appropriate for specific market niches.',
    features: [
      'Collection of 6 standalone landing page templates with unique visual brandings',
      'Smooth scroll triggers and entrance micro-animations powered by Framer Motion',
      'Lightweight Next.js App Router foundation achieving 99+ Core Web Vitals',
      'Conversion-tested CTA forms, pricing tables, and social proof components',
      'Flawless responsive behavior from 320px mobile up to ultra-wide displays',
    ],
    limitations:
      'Templates are production-ready to connect with any database, payment provider, or CRM webhook.',
  },
  'company-profile-suite': {
    title: 'Enterprise & Agency Showcase — 6 Modern Company Profile Templates',
    summary:
      'Multi-industry showcase suite of 6 modern company profiles: Commercial Photography, Luxury Real Estate, Wedding Studio, Insurance, Fleet Management, and Corporate Law Firm.',
    problem:
      'Traditional company profiles are rigid, slow on mobile devices, and fail to project credibility to prospective clients. Businesses require modern digital representations with clear multi-page structures.',
    features: [
      '6 full multi-page business websites covering key commercial sectors',
      'Intuitive navigation: Home, About Us, Services, Team, and Contact',
      'Direct Call-to-Action integrations for WhatsApp inquiries and consultation booking',
      'Ultra-responsive layouts with near-instant load speeds and high Web Vitals scores',
      'Credibility components: milestone counters, marquee partner logos, reviews, and FAQs',
    ],
    limitations:
      'Content and page structures across all templates can be customized modularly.',
  },
};

export const POST_TRANSLATIONS_EN: Record<string, PostTranslation> = {
  'memilih-indexeddb-vs-sqlite-wasm': {
    title: 'Choosing IndexedDB vs SQLite WASM for Offline-First Applications',
    excerpt:
      'Technical evaluation of browser local storage engines for NexaPOS: performance, bundle overhead, and schema migration trade-offs.',
  },
};

/**
 * Localize project data based on locale
 */
export function localizeProject(project: Project, locale: Locale): Project {
  if (locale === 'id') return project;

  const translation = PROJECT_TRANSLATIONS_EN[project.slug];
  if (!translation) return project;

  return {
    ...project,
    title: translation.title || project.title,
    summary: translation.summary || project.summary,
    problem: translation.problem || project.problem,
    features: translation.features || project.features,
    limitations: translation.limitations || project.limitations,
  };
}

/**
 * Localize post data based on locale
 */
export function localizePost(post: Post, locale: Locale): Post {
  if (locale === 'id') return post;

  const translation = POST_TRANSLATIONS_EN[post.slug];
  if (!translation) return post;

  return {
    ...post,
    title: translation.title || post.title,
    excerpt: translation.excerpt || post.excerpt,
    seo_title: translation.title || post.seo_title,
    seo_description: translation.excerpt || post.seo_description,
  };
}

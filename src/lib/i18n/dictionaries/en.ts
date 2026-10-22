import type { Dictionary } from '../types';

export const enDictionary: Dictionary = {
  common: {
    localeName: 'English',
    loading: 'Loading...',
    openLink: 'Open link',
  },
  nav: {
    labs: 'Labs',
    notes: 'Notes',
    about: 'About',
    privacy: 'Privacy',
    github: 'GitHub',
    menuTitle: 'Navigation Menu',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    toggleLanguage: 'Select Language',
  },
  home: {
    badge: 'INDIE SOFTWARE LAB',
    tagline: 'A place for things in progress.',
    description:
      'An independent workspace for building, testing, and documenting digital products.',
    selectedProjectsHeading: 'Selected Projects',
    selectedProjectsSub: 'Active experiments, prototypes, and digital products',
    viewAllProjects: 'View all',
    recentNotesHeading: 'Recent Notes & Logs',
    recentNotesSub: 'Documentation of technical decisions, architecture, and learnings',
    viewAllNotes: 'All notes',
    methodLabel: 'Working Principles — The Tinkerbench Method',
    methodText: 'The order of priority at Tinkerbench is never reversed: ',
    methodHighlight: 'build a real project → test under real conditions → document the process → ship',
    methodEnd: '. Never a storefront of claims without working code.',
    readAboutLab: 'Read more about the lab →',
  },
  footer: {
    tagline: 'A place for things in progress.',
    rights: '© 2026 Tinkerbench Labs. All works in progress.',
    builtWith: 'Built with Next.js 16 & Supabase · Warm Editorial Workshop',
  },
  labs: {
    badge: 'Project Directory',
    title: 'Labs',
    description:
      'A collection of software projects: from Concept (experimental ideas & prototypes) to Production (stable & ready-to-use apps).',
    filterStatus: 'Status:',
    filterCategory: 'Category:',
    filterTag: 'Tag:',
    allStatus: 'All Statuses',
    allCategories: 'All Categories',
    searchPlaceholder: 'Search by title, category, or tag (e.g., photography, retail)...',
    searchLabel: 'Search projects',
    resetFilter: 'Reset Filters',
    noProjects: 'No projects match your search filters.',
    noProjectsSub: 'Try adjusting your search query or reset the status and project type filters above.',
    categories: {
      web_app: 'Web App',
      pwa: 'PWA',
      saas: 'SaaS',
      ecommerce: 'E-Commerce',
      landing_page: 'Landing Page',
    },
    maturities: {
      concept: 'CONCEPT',
      production: 'PRODUCTION',
    },
  },
  notes: {
    badge: 'Journal & Technical Notes',
    title: 'Notes',
    description:
      'First-hand notes from the build bench: rationale behind tech choices, architectural trade-offs, failed experiments, and real-time release logs.',
    searchLabel: 'Search notes',
    searchPlaceholder: 'Search technical topics or build log notes...',
    pageOf: 'Page {current} of {total}',
    prevPage: '← Previous',
    nextPage: 'Next →',
    noNotes: 'No notes match your search query.',
    noNotesSub: 'Check out the active prototypes and projects we are currently building in the Labs directory.',
    openLabsBtn: 'Explore Labs Directory →',
    minRead: 'min read',
  },
  about: {
    badge: 'INDEPENDENT SOFTWARE LAB',
    title: 'About Tinkerbench Labs',
    tagline: 'A place for things in progress',
    introLead:
      'Tinkerbench is an independent software lab for building, testing, and documenting personal and client-grade digital products.',
    originHeading: 'A place for things in progress',
    originP1:
      'Too many software ideas stay confined to wishful thinking or languish in private local git repositories without ever facing the real world. Tinkerbench was built as an open workshop bench: a workshop where ideas are turned into tangible, robust applications that users can test and evaluate immediately.',
    originP2Lead: 'While operating as an independent lab, ',
    originP2Bold: 'I am fully open to professional collaboration and client projects.',
    originP2Mid:
      ' If you find prototypes, architectures, or production systems here that match your business goals — whether for ',
    originP2End:
      'bespoke website design, custom web applications, PWAs, or end-to-end SaaS engineering — we can discuss and build it together.',
    originP3:
      'Zero agency bureaucracy and no over-promising: you consult and collaborate directly with the developer who designs the system logic and writes the code from line one.',
    principlesHeading: 'Three Core Principles',
    principle1Title: '1. Build Real & Functional Systems',
    principle1Desc:
      'Prioritizing working systems that resolve actual friction with high performance, rather than superficial aesthetic mock-ups devoid of database integrity.',
    principle2Title: '2. Test Under Real Conditions',
    principle2Desc:
      'Optimizing software for actual user scenarios: responsive on small mobile displays (320px), zero-lag initial load times, and offline-first capabilities.',
    principle3Title: '3. Transparent & Direct Communication',
    principle3Desc:
      'Documenting architectural decisions, technical trade-offs, and project timelines honestly and transparently with clients and collaborators.',
    servicesHeading: 'Available Services & Collaboration',
    servicesDesc:
      'Have a digital product idea, need custom operational or cashier systems, or want to launch a high-performance website for your enterprise? Key domains I deliver:',
    servicesList: [
      'Custom Web Application & Dashboard',
      'PWA & Offline-First POS System',
      'High-Performance Showcase & Portfolio',
      'Fullstack MVP & SaaS Prototype',
      'Landing Page',
      'Company Profile',
    ],
    connectHeading: "Let's Connect & Start Your Project",
    connectDesc:
      'If you are interested in co-building a product, purchasing or tailoring a system from Labs, or simply want to consult on technical architecture:',
    chatWa: 'WhatsApp Chat (Project Inquiry)',
    sendEmail: 'Send Email',
    github: 'GitHub',
  },
  privacy: {
    badge: 'Privacy & Data',
    title: 'Privacy Policy',
    intro:
      'Tinkerbench Labs respects the privacy of every visitor. Our approach is minimalist and transparent.',
    sec1Title: '1. Zero Personal Tracking',
    sec1Desc:
      'This website does not load cross-site tracking cookies, behavioral ad pixels, or browser device-fingerprinting scripts.',
    sec2Title: '2. No Visitor Accounts or Message Storage',
    sec2Desc:
      'We do not require account registration to read notes or test project demos. Direct contact links (such as WhatsApp or Email) route directly to their respective official platforms without persisting message logs in this site database.',
    sec3Title: '3. Hosting & Infrastructure Logs',
    sec3Desc:
      'This website is hosted via Vercel and Supabase. Standard server logs (IP address and user agent) are processed by infrastructure providers solely for network reliability, DDoS mitigation, and performance auditing.',
  },
  projectDetail: {
    breadcrumbLabs: 'Labs',
    notFound: 'Project Not Found',
    publishedOn: 'Published:',
    tryDemo: 'Try Live Demo',
    demoUnavailable: 'Public demo is not yet opened for',
    sourceCode: 'Source Code',
    chatWa: 'Interested? WhatsApp Chat',
    askCustomize: 'Request Customization',
    sendFeedback: 'Send Feedback',
    problemSolved: 'Problem Solved',
    techDetails: 'Technical Details & Approach',
    keyFeatures: 'Key Features',
    techStack: 'Tech Stack & Tools',
    currentLimitations: 'Current Scope & Limitations',
    buildLog: 'Build Log',
    relatedNotes: 'Notes Related to this Project',
  },
  noteDetail: {
    breadcrumbNotes: 'Notes',
    notFound: 'Note Not Found',
    minRead: 'min read',
    updatedOn: 'Updated:',
    relatedProject: 'Related to project:',
    openLab: 'Open Lab →',
    otherNotes: 'Other Notes from the Same Project',
  },
};

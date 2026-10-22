export type Locale = 'id' | 'en';

export interface Dictionary {
  common: {
    localeName: string;
    loading: string;
    openLink: string;
  };
  nav: {
    labs: string;
    notes: string;
    about: string;
    privacy: string;
    github: string;
    menuTitle: string;
    openMenu: string;
    closeMenu: string;
    toggleLanguage: string;
  };
  home: {
    badge: string;
    tagline: string;
    description: string;
    selectedProjectsHeading: string;
    selectedProjectsSub: string;
    viewAllProjects: string;
    recentNotesHeading: string;
    recentNotesSub: string;
    viewAllNotes: string;
    methodLabel: string;
    methodText: string;
    methodHighlight: string;
    methodEnd: string;
    readAboutLab: string;
  };
  footer: {
    tagline: string;
    rights: string;
    builtWith: string;
  };
  labs: {
    badge: string;
    title: string;
    description: string;
    filterStatus: string;
    filterCategory: string;
    filterTag: string;
    allStatus: string;
    allCategories: string;
    searchPlaceholder: string;
    searchLabel: string;
    resetFilter: string;
    noProjects: string;
    noProjectsSub: string;
    categories: {
      web_app: string;
      pwa: string;
      saas: string;
      ecommerce: string;
      landing_page: string;
    };
    maturities: {
      concept: string;
      production: string;
    };
  };
  notes: {
    badge: string;
    title: string;
    description: string;
    searchLabel: string;
    searchPlaceholder: string;
    pageOf: string;
    prevPage: string;
    nextPage: string;
    noNotes: string;
    noNotesSub: string;
    openLabsBtn: string;
    minRead: string;
  };
  about: {
    badge: string;
    title: string;
    tagline: string;
    introLead: string;
    originHeading: string;
    originP1: string;
    originP2Lead: string;
    originP2Bold: string;
    originP2Mid: string;
    originP2End: string;
    originP3: string;
    principlesHeading: string;
    principle1Title: string;
    principle1Desc: string;
    principle2Title: string;
    principle2Desc: string;
    principle3Title: string;
    principle3Desc: string;
    servicesHeading: string;
    servicesDesc: string;
    servicesList: string[];
    connectHeading: string;
    connectDesc: string;
    chatWa: string;
    sendEmail: string;
    github: string;
  };
  privacy: {
    badge: string;
    title: string;
    intro: string;
    sec1Title: string;
    sec1Desc: string;
    sec2Title: string;
    sec2Desc: string;
    sec3Title: string;
    sec3Desc: string;
  };
  projectDetail: {
    breadcrumbLabs: string;
    notFound: string;
    publishedOn: string;
    tryDemo: string;
    demoUnavailable: string;
    sourceCode: string;
    chatWa: string;
    askCustomize: string;
    sendFeedback: string;
    problemSolved: string;
    techDetails: string;
    keyFeatures: string;
    techStack: string;
    currentLimitations: string;
    buildLog: string;
    relatedNotes: string;
  };
  noteDetail: {
    breadcrumbNotes: string;
    notFound: string;
    minRead: string;
    updatedOn: string;
    relatedProject: string;
    openLab: string;
    otherNotes: string;
  };
}

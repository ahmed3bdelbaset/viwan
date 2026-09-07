'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'ar'

export const DICTIONARY = {
  en: {
    nav: {
      home: 'Home',
      projects: 'Projects',
      services: 'Services',
      studio: 'The Firm',
      howWeWork: 'How We Work',
      careers: 'Careers',
      contact: 'Contact',
      consultation: '30 Minutes Free Consultation',
    },
    hero: {
      eyebrow: 'Spaces for a better tomorrow',
      title1: 'Integrated thinking.',
      title2: 'Precise execution.',
      title3: '',
      subtitle:
        'VIWAN brings architecture, engineering, interiors, landscape, and technical expertise together under one integrated consultancy. We develop projects from concept through documentation and delivery, combining design clarity with engineering precision to create environments that are functional, enduring, and deeply connected to their context.',
      explore: 'Explore Our Work',
      consultation: '30 Minutes Free Consultation',
      scroll: 'Scroll',
      people: 'People',
      places: 'Places',
      purpose: 'Purpose',
    },
    marquee: [
      'CAIRO',
      'RIYADH',
      'DUBAI',
      'INTEGRATED ARCHITECTURE',
      'BESPOKE LUXURY INTERIORS',
      'LANDSCAPE MASTERPLANNING',
      'MULTIDISCIPLINARY BIM ENGINEERING',
    ],
    whoWeAre: {
      index: '01',
      label: 'About VIWAN',
      heading: 'We create places with purpose.',
      body: 'VIWAN is an integrated architecture, engineering and design consultancy creating thoughtful environments through architecture, interiors, landscape and multidisciplinary engineering.',
      button: 'About the Firm',
      badge1: 'A more',
      badge2: 'human',
      badge3: 'built',
      badge4: 'environment',
    },
    selectedProjects: {
      index: '02',
      label: 'Selected Projects',
      heading: 'Selected Work',
      viewAll: 'View All Projects',
      scope: 'Scope',
      viewProject: 'View Project',
    },
    servicesPreview: {
      index: '04',
      label: 'What We Do',
      heading: 'One integrated consultancy. Multiple disciplines.',
      explore: 'Explore Services',
      items: [
        {
          n: '01',
          title: 'Architecture',
          preview: ['Concept Design', 'Design Development', 'Technical Documentation'],
        },
        {
          n: '02',
          title: 'Interior Design',
          preview: ['Spatial Planning', 'Materials', 'FF&E', 'Lighting'],
        },
        {
          n: '03',
          title: 'Landscape',
          preview: ['Masterplanning', 'Hardscape', 'Softscape'],
        },
        {
          n: '04',
          title: 'Engineering',
          preview: ['Technical Coordination', 'BIM', 'Structural + MEP'],
        },
      ],
    },
    featuredProject: {
      index: '05',
      label: 'Featured Project / 2026',
      name: 'Private Villa',
      location: 'New Cairo',
      disciplines: 'Architecture · Interior · Landscape',
      view: 'View Project',
    },
    philosophy: {
      index: '06',
      label: 'Philosophy',
      quote: 'Design is not decoration. It is how space works, feels and lasts.',
    },
    processPreview: {
      index: '07',
      label: 'Process',
      heading: 'From concept to reality.',
      button: 'How We Work',
      steps: [
        { n: '01', title: 'Discover', short: 'Understand the project.' },
        { n: '02', title: 'Define', short: 'Create the direction.' },
        { n: '03', title: 'Design', short: 'Shape the idea.' },
        { n: '04', title: 'Develop', short: 'Turn ideas into detail.' },
        { n: '05', title: 'Coordinate', short: 'Make everything work together.' },
        { n: '06', title: 'Deliver', short: 'From drawing to reality.' },
      ],
    },
    cinematicBreak: {
      brand: 'VIWAN / Architecture & Design',
      tagline: 'Spaces that belong',
    },
    impact: {
      index: '08',
      label: 'OUR IMPACT',
      heading: 'Proven Scale & Architectural Rigor',
      sub: 'Trusted by premier regional developers and private homeowners.',
      metrics: [
        { value: '45+', label: 'Delivered Projects', sub: 'Across Egypt & Saudi Arabia' },
        { value: '140K+', label: 'm² Coordinated', sub: 'Precision BIM & Architecture' },
        { value: '4', label: 'In-House Disciplines', sub: 'Architecture · Interior · Landscape · MEP' },
        { value: '3', label: 'Regional Hubs', sub: 'Cairo · Riyadh · Dubai' },
      ],
      partnersLabel: 'DEVELOPMENT PARTNERS',
    },
    finalCta: {
      eyebrow: 'Have a project in mind?',
      title: "Let's shape what comes next.",
      consultation: '30 Minutes Free Consultation',
      startProject: 'Start a Project',
    },
    footer: {
      tagline: 'Integrated Architecture, Engineering & Design Consultancy',
      allRights: 'All rights reserved.',
      backToTop: 'Back to top',
    },
    projectsPage: {
      heroEyebrow: 'OUR PROJECTS',
      heroTitle1: 'Real Projects.',
      heroTitle2: 'Lasting Impact.',
      heroSubtitle:
        'A selection of our work across architecture, interiors, landscape, urban design and engineering — delivering spaces that inspire people and shape better environments.',
      brandPeople: 'PEOPLE',
      brandPlaces: 'PLACES',
      brandPurpose: 'PURPOSE',

      viewAll: 'VIEW ALL',
      sortBy: 'SORT BY',
      sortLatest: 'Latest (2024–2026)',
      sortEgypt: 'Egypt Projects',
      sortKsa: 'Saudi Arabia Projects',

      readyEyebrow: 'READY TO START?',
      readyTitle: "Let's turn your vision into reality.",
      freeConsultationCta: '30 MINUTES FREE CONSULTATION',
      startProjectCta: 'START A PROJECT',

      faqEyebrow: 'INQUIRIES & METHODOLOGY',
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle:
        'Authoritative insights into our international architectural framework, project delivery timelines, regional operations across Egypt and Saudi Arabia, and 5D BIM budget control.',
      faqs: [
        {
          num: '01',
          q: 'What is the comprehensive delivery process, and what is the typical timeline from concept to handover?',
          a: 'Our architectural practice adheres to the international RIBA / AIA stages: (1) Strategic Brief & Feasibility, (2) Concept Architecture & Masterplanning, (3) Detailed Spatial Design & BIM Modeling, (4) Statutory Authorities & Permitting, (5) Technical Documentation & BOQ Tendering, (6) Construction & On-Site Supervision, and (7) Commissioning & Handover. Private luxury residences typically span 12 to 18 months, while large-scale commercial or masterplanned developments require 24 to 36 months depending on municipal approvals and site terrain.',
        },
        {
          num: '02',
          q: 'How does VIWAN coordinate cross-border projects between Egypt, Saudi Arabia, and the Gulf region?',
          a: 'We operate a multi-hub collaborative model. Our central design studio in Cairo drives architectural concept creation, parametric modeling, and advanced BIM coordination, while our regional teams in Riyadh and Dubai oversee local municipal compliance (including the Saudi Building Code SBC and SASO certifications), authority submissions, and on-site contractor management. Cloud-based Common Data Environments (CDE) keep clients and engineering consultants connected in real time.',
        },
        {
          num: '03',
          q: 'What is the structural difference between Full Turnkey Design-Build (EPC) and Traditional Architectural Consultation?',
          a: 'Traditional consultation isolates architectural design from execution, frequently resulting in contractor disputes, budget inflation, and compromised details. Under VIWAN’s Turnkey (EPC) model, our studio assumes single-point contractual responsibility for architectural design, structural/MEP engineering, bespoke interior fit-out, rare material procurement, and site construction under a Guaranteed Maximum Price (GMP). This eliminates finger-pointing and ensures built reality exactly mirrors the approved 3D renders.',
        },
        {
          num: '04',
          q: 'How do you establish construction budget certainty and prevent financial scope creep?',
          a: 'Budget predictability is integrated into our workflow from Day 1 using 5D BIM modeling, which directly links 3D architectural geometry to verified market cost data. Before construction begins, we deliver itemized Bills of Quantities (BOQs), material specifications, and rigorous value engineering that safeguards architectural aesthetics while eliminating avoidable waste. Any client-initiated design modification requires formal impact analysis and signed approval prior to procurement.',
        },
        {
          num: '05',
          q: 'How are municipal building permits, zoning codes, and statutory civil defense approvals managed?',
          a: 'Our in-house regulatory compliance team analyzes municipal masterplan guidelines, floor-area ratios (FAR), setbacks, and civil defense requirements before schematic designs are frozen. We coordinate with licensed local engineering bodies across New Cairo, Sheikh Zayed, the New Administrative Capital, and Riyadh Municipalities to expedite statutory approvals, preventing costly delays or redesign requirements.',
        },
        {
          num: '06',
          q: 'How do you engineer passive sustainability and climate resilience for arid Middle Eastern environments?',
          a: 'Sustainability is an inherent structural principle. We employ passive solar orientation, ventilated double-skin facades clad in local limestone and travertine, deep structural cantilevers for natural shading, internal microclimate courtyards with evaporative water features, low-emissivity (Low-E) double glazing, and intelligent VRF cooling systems. These architectural measures reduce cooling energy loads by up to 35% and provide superior acoustic and thermal comfort.',
        },
      ],

      eyebrow: 'Portfolio / 02',
      title: 'Architecture shaped by context, proportion and experience.',
      subtitle:
        'A curated selection of private residences, bespoke luxury interiors, landscape environments and engineering coordination across Cairo, Ain Sokhna and Riyadh.',
      all: 'All',
      showing: 'Showing',
      works: 'Works',
      viewProject: 'View Project',
    },
    servicesPage: {
      heroEyebrow: 'OUR SERVICES',
      heroTitle: 'Integrated Design Solutions.',
      heroSubtitle:
        'From vision to execution, we provide a complete range of architectural, design and engineering services, delivering spaces that are functional, beautiful and built to last.',
      brandPeople: 'PEOPLE',
      brandPlaces: 'PLACES',
      brandPurpose: 'PURPOSE',

      overviewEyebrow: 'SERVICES OVERVIEW',
      overviewTitle: 'A complete journey.',
      overviewSubtitle:
        'We bring together design creativity, technical expertise and project management to deliver integrated solutions — from early concept to final delivery and beyond.',
      overviewCta: "LET'S TALK ABOUT YOUR PROJECT",

      learnMore: 'LEARN MORE',

      readyEyebrow: 'READY TO START?',
      readyTitle: "Let's build something great.",
      freeConsultationCta: '30 MINUTES FREE CONSULTATION',
      contactUsCta: 'CONTACT US',

      eyebrow: 'Expertise / 03',
      title: 'One integrated firm. Multiple disciplines.',
      subtitle:
        'We eliminate the fragmentation between architecture, interior design, landscape and engineering. Every project is conceived, coordinated and detailed under a single unified methodology.',
      deliverablesTitle: 'Core Deliverables & Scope',
      requestService: 'Request Service',
      viewWorks: 'View Works',
      bimEyebrow: 'Technical Coordination',
      bimTitle: 'Precision Engineering & BIM Coordination',
      bimSubtitle:
        'Great architecture collapses without precise engineering. At VIWAN, structural feasibility, MEP systems, clash detection and construction documentation are embedded into the design from day one.',
    },
    studioPage: {
      eyebrow: 'The Firm / 04',
      title: 'Integrated thinking. Precise execution.',
      subtitle:
        'VIWAN brings architecture, engineering, interiors, landscape, and technical expertise together under one integrated consultancy. We develop projects from concept through documentation and delivery, combining design clarity with engineering precision to create environments that are functional, enduring, and deeply connected to their context.',
      manifestoIndex: '01',
      manifestoLabel: 'OUR MANIFESTO',
      manifestoHeading: 'Design is not decoration. It is how space works, feels and lasts.',
      manifestoP1:
        'Every project begins with listening — understanding the terrain, the light, the cultural rituals of the inhabitants, and the long-term intent of the development.',
      manifestoP2:
        'We reject superficial trends in favor of enduring proportion, authentic natural materials (travertine, warm limestones, fluted timber, patinated bronze), and seamless functional flow.',
      exploreProcess: 'Explore Our Process',
      joinTeam: 'Join the Team',
      impactIndex: '02',
      impactLabel: 'OUR IMPACT',
      impactHeading: 'Measurable Architectural Excellence',
      impactSub: 'Delivering high-performance spatial environments across the Middle East.',
      trustedBy: 'TRUSTED BY LEADING DEVELOPERS & PRIVATE CLIENTS',
      markets: 'EGYPT · SAUDI ARABIA · UAE',
      craftIndex: '03',
      craftLabel: 'MATERIALITY & CRAFT',
      craftHeading: 'Authentic Textures & Built Truth',
      craftSub:
        'We curate stones, timbers, linens, and patinated metals that age with dignity. Space is not just perceived with the eyes; it is felt through sound, temperature, and touch.',
    },
    howWeWorkPage: {
      heroEyebrow: 'METHODOLOGY & PROCESS',
      heroTitle1: 'From Initial Sketch',
      heroTitle2: 'To Built Reality.',
      heroSubtitle:
        'A disciplined, transparent, six-stage architectural process designed to eliminate uncertainty, ensure budget alignment, and deliver timeless spaces without compromise.',
      brandPeople: 'DISCOVERY',
      brandPlaces: 'RIGOR',
      brandPurpose: 'DELIVERY',
      explorePhasesCta: 'EXPLORE PHASES (6)',
      bookConsultationCta: 'SCHEDULE 30-MIN ADVISORY',
      eyebrow: 'Methodology / 05',
      title: 'From initial sketch to built reality.',
      subtitle:
        'A disciplined, transparent, six-stage architectural process designed to eliminate uncertainty, ensure budget alignment, and deliver timeless spaces without compromise.',
      calloutEyebrow: 'EXCEPTIONAL PLACES • LASTING VALUE',
      calloutHeading: 'The right property\nchanges what comes next.',
      calloutSub:
        'Discover distinguished properties and investment opportunities selected for their location, character, and potential — with trusted guidance from the first search to the final decision.',
      scheduleAdvisory: 'Schedule 30 Minutes Consultation',
    },
    careersPage: {
      eyebrow: 'CAREERS AT VIWAN',
      title: 'Build What Matters.',
      subtitle:
        'Join a multidisciplinary team passionate about creating meaningful spaces and shaping a better tomorrow.',
      joinOurTeamCta: 'JOIN OUR TEAM',
      viewPositionsCta: 'JOIN OUR TEAM',
      viewAllPositions: 'VIEW ALL POSITIONS',
      studioCultureCta: 'OUR STUDIO CULTURE',
      brandPeople: 'PEOPLE',
      brandIdeas: 'IDEAS',
      brandGrowth: 'GROWTH',
      brandImpact: 'IMPACT',

      // 01 / Why Viwan
      whyEyebrow: '01 / WHY VIWAN',
      whyHeading: 'A place to grow, create and belong.',
      whySubtitle:
        'We believe great work comes from great people. At VIWAN, we foster a collaborative, inspiring and supportive environment where your talent can make a real impact.',
      pillars: [
        {
          num: '01',
          title: 'Meaningful Projects',
          desc: 'Work on diverse and impactful projects across architecture, interiors, and landscape.',
        },
        {
          num: '02',
          title: 'Collaborative Culture',
          desc: 'A supportive and inclusive team fostering open dialogue across disciplines.',
        },
        {
          num: '03',
          title: 'Continuous Learning',
          desc: 'Develop your skills and grow with us through workshops, mentorship, and certifications.',
        },
        {
          num: '04',
          title: 'Balanced Life',
          desc: 'We value well-being inside and outside work, encouraging healthy creative momentum.',
        },
      ],

      // 02 / Open Positions
      openRolesLabel: '02 / OPEN POSITIONS',
      opportunitiesHeading: 'Current Opportunities',
      openInCairo: 'Cairo Studio / Hybrid Options',
      positionsSub: 'Explore our active openings or reach out to introduce your work to our leadership team.',
      spontaneousTitle: "Don't see your role?",
      spontaneousDesc:
        'We are always looking for exceptional talent in architectural design, 3D visualization, and site engineering.',
      spontaneousEmail: 'careers@viwan.studio',
      spontaneousBtn: 'General Application',
      roleOverview: 'Role Overview',
      keyResponsibilities: 'Key Responsibilities',
      requirementsSkills: 'Requirements & Qualifications',
      softwareMastery: 'Required Software',
      applyForThisRole: 'Apply For This Position',

      // 03 / Life at Viwan
      lifeEyebrow: '03 / LIFE AT VIWAN',
      lifeHeading: 'More than a workplace.',
      lifeSubtitle:
        'From design discussions to shared ideas, we create a work environment that inspires creativity, collaboration and continuous development.',
      galleryLabels: [
        'Design Discussion & Pin-up Wall',
        'Physical Models & Drafting Still Life',
        'Studio Entrance & Spatial Philosophy',
        'Courtyard Shading & Material Light',
      ],

      // Modal & Application Form
      applyHeading: 'Join the VIWAN Team',
      applySub: 'Please share your details and portfolio link below.',
      applyReceivedTitle: 'Application Submitted Successfully',
      applyReceivedMsg:
        'Thank you! Our recruitment team will review your credentials and get in touch shortly.',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone / WhatsApp Number',
      portfolioLink: 'Portfolio / CV Link (Behance, Google Drive, or Web)',
      coverNote: 'Brief Introduction / Cover Note',
      experienceLevel: 'Years of Experience',
      sendApplication: 'Submit Application',
      sendingApplication: 'Submitting...',
      closeModal: 'Close',

      // Ready bottom CTA
      readyEyebrow: 'READY TO TAKE THE NEXT STEP?',
      readyTitle: "Let's build the future together.",
      sendCvCta: 'SEND YOUR CV',
      contactUsCta: 'CONTACT US',
      applyNowCta: 'SEND YOUR CV',
      exploreProjectsCta: 'CONTACT US',
    },
    contactPage: {
      heroEyebrow: 'CONTACT VIWAN',
      heroTitle: "Let's start a conversation.",
      heroSubtitle:
        "Tell us about your project, and we'll help shape the right direction from the very first discussion.",
      brandPeople: 'PEOPLE',
      brandPlaces: 'PLACES',
      brandPurpose: 'PURPOSE',

      inquiryEyebrow: 'GET IN TOUCH',
      inquiryTitle: 'Project Inquiry',

      fullName: 'Name',
      fullNamePlaceholder: 'Your full name',
      company: 'Company',
      companyPlaceholder: 'Your company name',
      email: 'Email',
      emailPlaceholder: 'you@company.com',
      phone: 'Phone',
      phonePlaceholder: '+20 100 000 0000',
      location: 'Project Location',
      locationPlaceholder: 'Select location',
      type: 'Project Type',
      typePlaceholder: 'Select project type',
      size: 'Project Size',
      sizePlaceholder: 'Select project size',
      budget: 'Estimated Budget',
      budgetPlaceholder: 'Select estimated budget',
      stage: 'Project Stage',
      stagePlaceholder: 'Select project stage',
      message: 'Message',
      messagePlaceholder: 'Tell us about your project, your goals, and any other details…',
      submitBtn: 'SEND PROJECT INQUIRY',
      submittingBtn: 'SENDING INQUIRY…',

      inquiryReceivedTitle: 'Inquiry Received',
      inquiryReceivedMsg:
        'Thank you for reaching out to VIWAN. Our design directors have received your brief and will contact you promptly.',
      sendAnother: 'Send another inquiry',

      studioEyebrow: 'OUR STUDIO',
      studioTitle: 'Contact Information',
      studioName: 'VIWAN',
      studioRole: 'Integrated Architecture, Engineering & Design Consultancy',
      studioCity: 'Cairo, Egypt',
      studioEmail: 'info@viwan.studio',
      studioPhone: '+20 100 956 5380',
      studioLinkedin: 'LinkedIn',
      studioInstagram: 'Instagram',
      studioWebsite: 'www.viwan.studio',

      mapCaption: 'Based in Cairo, Working across Egypt and the region.',
      mapTagline: 'EGYPT / MIDDLE EAST BEYOND BORDERS',

      calloutTitle: 'Prefer to speak first?',
      calloutSubtitle: "Book a complimentary consultation and let's discuss your vision.",
      calloutButton: 'BOOK A FREE CONSULTATION',

      channels: {
        general: {
          title: 'General Inquiries',
          desc: 'For general questions about VIWAN, our studio, or potential collaborations.',
          email: 'info@viwan.studio',
        },
        projects: {
          title: 'New Projects',
          desc: "Share your project brief and let's explore how we can bring it to life.",
          email: 'start@viwan.studio',
        },
        careers: {
          title: 'Careers',
          desc: "We're always looking for exceptional talent to join our team.",
          linkText: 'careers@viwan.studio',
        },
      },

      bottomCta: {
        eyebrow: 'A MORE HUMAN TOMORROW',
        title: "Let's shape what comes next.",
        brandPeople: 'PEOPLE',
        brandPlaces: 'PLACES',
        brandPossibilities: 'POSSIBILITIES',
        consultationBtn: '30 MINUTES FREE CONSULTATION',
        startProjectBtn: 'START A PROJECT',
      },
    },
    consultationPage: {
      eyebrow: 'Direct Advisory / 08',
      title: '30 Minutes Free Architectural Consultation',
      subtitle:
        'Speak directly with a VIWAN design director. We will assess your site feasibility, spatial objectives, and outline the initial architectural road map.',
      agendaIndex: '01',
      agendaLabel: 'AGENDA & VALUE',
      agendaHeading: 'What We Cover During the Session',
      agendaSub:
        'A focused, high-value conversation without sales pressure, tailored exclusively to your project.',
      item1Title: 'Site & Program Assessment',
      item1Desc: 'Reviewing plot dimensions, orientation, topography, and local building codes.',
      item2Title: 'Budget & Phasing Advice',
      item2Desc:
        'Realistic cost benchmarks per square meter for high-end architecture, fit-out, and MEP.',
      item3Title: 'BIM & Engineering Strategy',
      item3Desc: 'How integrated coordination prevents costly site mistakes and project delays.',
      locationNoteTitle: 'Virtual or In-Office',
      locationNoteDesc:
        'Sessions can be hosted via Google Meet / Zoom or in person at our New Cairo / Riyadh offices.',
      reservationIndex: '02',
      reservationLabel: 'RESERVATION',
      reservationHeading: 'Reserve Your Session',
      reservationSub:
        'Choose your preferred timing and our team will coordinate the video meeting link.',
      sessionRequestedTitle: 'Session Requested',
      sessionRequestedMsg:
        'A calendar invitation and confirmation has been sent to your email. We look forward to speaking with you!',
      bookAnother: 'Book another session',
      preferredDate: 'Preferred Date',
      preferredTime: 'Preferred Time Window',
      notesLabel: 'Project Location & Scope Summary',
      confirmBtn: 'Confirm 30-Minute Advisory',
      securingBtn: 'Securing Slot...',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      projects: 'المشاريع',
      services: 'الخدمات',
      studio: 'عن المكتب',
      howWeWork: 'مراحل العمل',
      careers: 'الوظائف',
      contact: 'تواصل معنا',
      consultation: 'استشارة مجانية',
    },
    hero: {
      eyebrow: 'مساحات معمارية لغد أفضل',
      title1: 'فكر متكامل.',
      title2: 'تنفيذ هندسي دقيق.',
      title3: '',
      subtitle:
        'يجمع VIWAN بين العمارة والهندسة والتصميم الداخلي واللاندسكيب والخبرة التقنية تحت مظلة استشارية هندسية متكاملة. نطور المشاريع من الفكرة الأولية حتى المخططات التنفيذية والتسليم بالموقع، موازنين بين وضوح الرؤية التصميمية والدقة الهندسية لخلق بيئات وظيفية تدوم وترتبط بعمق بمحيطها.',
      explore: 'استكشف أعمالنا',
      consultation: 'استشارة مجانية 30 دقيقة',
      scroll: 'مرر للأسفل',
      people: 'الإنسان',
      places: 'المكان',
      purpose: 'الغاية',
    },
    marquee: [
      'القاهرة',
      'الرياض',
      'دبي',
      'عمارة متكاملة',
      'تصميم داخلي فاخر',
      'لاندسكيب ومخططات عامة',
      'هندسة وتنسيق BIM متقدم',
    ],
    whoWeAre: {
      index: '01',
      label: 'عن VIWAN',
      heading: 'نصنع أماكن ذات غاية وأثر مستدام.',
      body: 'VIWAN مكتب استشارات هندسية وتصميم متكامل للهندسة المعمارية والتصميم الداخلي واللاندسكيب، يبتكر بيئات فراغية متميزة عبر المزج بين أصالة النسب ودقة التنسيق الهندسي.',
      button: 'عن المكتب',
      badge1: 'بيئة',
      badge2: 'عمرانية',
      badge3: 'أكثر',
      badge4: 'إنسانية',
    },
    selectedProjects: {
      index: '02',
      label: 'مشاريع مختارة',
      heading: 'أعمال مختارة',
      viewAll: 'عرض كافة المشاريع',
      scope: 'نطاق العمل',
      viewProject: 'عرض المشروع',
    },
    servicesPreview: {
      index: '04',
      label: 'ماذا نقدم',
      heading: 'مكتب استشارات واحد. تخصصات متكاملة.',
      explore: 'استكشف التخصصات',
      items: [
        {
          n: '01',
          title: 'الهندسة المعمارية',
          preview: ['التصميم المبدئي', 'تطوير التصميم', 'المخططات التنفيذية'],
        },
        {
          n: '02',
          title: 'التصميم الداخلي',
          preview: ['التوزيع الفراغي', 'اختيار الخامات', 'الأثاث والفرش', 'تصميم الإضاءة'],
        },
        {
          n: '03',
          title: 'اللاندسكيب',
          preview: ['المخططات العامة', 'العناصر الصلبة Hardscape', 'المساحات الخضراء Softscape'],
        },
        {
          n: '04',
          title: 'التنسيق الهندسي والـ BIM',
          preview: ['التنسيق الفني', 'نمذجة BIM', 'التكامل الإنشائي والكهروميكانيكي'],
        },
      ],
    },
    featuredProject: {
      index: '05',
      label: 'مشروع مميز / 2026',
      name: 'فيلا خاصة راقية',
      location: 'القاهرة الجديدة',
      disciplines: 'عمارة · تصميم داخلي · لاندسكيب',
      view: 'عرض المشروع',
    },
    philosophy: {
      index: '06',
      label: 'فلسفتنا المعمارية',
      quote: 'التصميم ليس مجرد ديكور وزخرفة، بل هو كيف يعمل الفراغ، وكيف يبدو شعوره، وكيف يدوم للأجيال.',
    },
    processPreview: {
      index: '07',
      label: 'منهجية العمل',
      heading: 'من الفكرة المبدئية إلى الواقع المعماري.',
      button: 'كيف نعمل',
      steps: [
        { n: '01', title: 'الاستكشاف (Discover)', short: 'فهم أهداف المشروع والاحتياجات.' },
        { n: '02', title: 'التوجيه (Define)', short: 'صياغة التوجه المعماري والبرنامج الفراغي.' },
        { n: '03', title: 'التصميم (Design)', short: 'بلورة الكتلة والواجهات والكتل المعمارية.' },
        { n: '04', title: 'التطوير (Develop)', short: 'تحويل الأفكار إلى تفاصيل وخامات دقيقة.' },
        { n: '05', title: 'التنسيق (Coordinate)', short: 'تنسيق العمارة والإنشائي والـ MEP عبر BIM.' },
        { n: '06', title: 'التسليم (Deliver)', short: 'من المخططات إلى التنفيذ الواقعي بالموقع.' },
      ],
    },
    cinematicBreak: {
      brand: 'VIWAN / استشارات هندسية وتصميم معماري',
      tagline: 'مساحات تنتمي لبيئتها',
    },
    impact: {
      index: '08',
      label: 'أثرنا وإنجازاتنا',
      heading: 'أرقام حقيقية ودقة هندسية موثوقة',
      sub: 'محل ثقة كبار المطورين العقاريين وملاك الفيلات الفاخرة.',
      metrics: [
        { value: '45+', label: 'مشروع منجز', sub: 'في مصر والمملكة العربية السعودية' },
        { value: '140K+', label: 'م² تم تنسيقها', sub: 'بدقة BIM والتصميم المعماري' },
        { value: '4', label: 'تخصصات متكاملة', sub: 'عمارة · داخلي · لاندسكيب · MEP' },
        { value: '3', label: 'أسواق إقليمية', sub: 'القاهرة · الرياض · دبي' },
      ],
      partnersLabel: 'شركاء التطوير العقاري',
    },
    finalCta: {
      eyebrow: 'هل لديك مشروع في بالك؟',
      title: 'لنصنع معاً ما هو قادم.',
      consultation: 'استشارة مجانية 30 دقيقة',
      startProject: 'ابدأ مشروعاً معنا',
    },
    footer: {
      tagline: 'استشارات متكاملة في العمارة، التصميم الداخلي، اللاندسكيب والهندسة',
      allRights: 'جميع الحقوق محفوظة لـ VIWAN.',
      backToTop: 'العودة للأعلى',
    },
    projectsPage: {
      heroEyebrow: 'مشاريعنا الهندسية',
      heroTitle1: 'مشاريع حقيقية.',
      heroTitle2: 'أثر هندسي يدوم.',
      heroSubtitle:
        'مجموعة مختارة من أعمالنا في العمارة والتصميم الداخلي واللاندسكيب والتخطيط العمراني والهندسة — نبتكر فراغات تلهم الإنسان وتبني بيئات أفضل.',
      brandPeople: 'الإنسان',
      brandPlaces: 'المكان',
      brandPurpose: 'الغاية',

      viewAll: 'عرض الكل',
      sortBy: 'ترتيب حسب',
      sortLatest: 'الأحدث (2024–2026)',
      sortEgypt: 'مشاريع مصر',
      sortKsa: 'مشاريع السعودية',

      readyEyebrow: 'جاهز للبدء؟',
      readyTitle: 'دعنا نحول رؤيتك المعمارية إلى واقع ملموس.',
      freeConsultationCta: 'استشارة مجانية لمدة 30 دقيقة',
      startProjectCta: 'ابدأ مشروعك الآن',

      faqEyebrow: 'استفسارات ومنهجية العمل',
      faqTitle: 'الأسئلة الشائعة',
      faqSubtitle:
        'إجابات دقيقة وشاملة حول منهجيتنا المعمارية الدولية، مراحل وجداول تسليم المشاريع، عملياتنا الإقليمية بين مصر والسعودية، وضبط الميزانية بنمذجة 5D BIM.',
      faqs: [
        {
          num: '01',
          q: 'ما هي المراحل الأساسية لتطوير المشروع، وما هو الإطار الزمني النموذجي من الفكرة الأولية حتى التسليم؟',
          a: 'تعتمد منهجية إيوان على المعايير الدولية المعتمدة من المعهد الملكي للمعماريين (RIBA) والمعهد الأمريكي (AIA) عبر سبع مراحل متسلسلة: (1) دراسة الجدوى وتحديد الاحتياجات، (2) الفكرة التصميمية والمخطط العام، (3) التصميم الفراغي التفصيلي ونمذجة BIM، (4) استخراج التراخيص والموافقات البلدية، (5) وثائق التنفيذ ومناقصات جداول الكميات، (6) التنفيذ والإشراف الميداني، و(7) الفحص النهائي وتسليم المفتاح. تتراوح مدة الإقامات الخاصة الفاخرة بين 12 إلى 18 شهراً، بينما تستغرق المشاريع الاستثمارية الكبرى من 24 إلى 36 شهراً بحسب مساحة التطوير والتراخيص وطبيعة التضاريس.',
        },
        {
          num: '02',
          q: 'كيف يدير استوديو إيوان المشاريع الإقليمية العابرة للحدود في مصر والمملكة العربية السعودية والخليج؟',
          a: 'نعتمد نموذجاً تشغيلياً هجيناً؛ حيث يقود مركز التصميم الرئيس في القاهرة الدراسات المعمارية وتنسيق نمذجة البناء المتقدمة (BIM)، بينما تتولى مكاتبنا في الرياض ودبي المتابعة الميدانية والامتثال لكود البناء السعودي (SBC) ومتطلبات البلديات الخليجية، بالإضافة إلى إدارة المناقصات مع مقاولين معتمدين. يتم ربط فرق العمل رقمياً عبر منصة BIM سحابية توفر للعميل والمشرفين تقارير فورية وشفافية كاملة على مدار الساعة.',
        },
        {
          num: '03',
          q: 'ما الفرق الجوهري بين التنفيذ المتكامل الشامل (Turnkey EPC) والاستشارة المعمارية المنفصلة؟',
          a: 'في الاستشارة التقليدية، تنفصل مسؤولية التصميم عن المقاول المنفذ مما يولد خلافات في التنفيذ وتجاوزات في الميزانية. أما في نظام تسليم المفتاح المتكامل (Turnkey EPC) من إيوان، يتحمل الاستوديو المسؤولية التعاقدية الكاملة: من التصميم المعماري والداخلي، والأعمال الإنشائية والكهروميكانيكية، وتوريد الأحجار والمواد النادرة، وحتى الإشراف الميداني الدقيق بسعر سقف مضمون، مما يضمن مطابقة المبنى النهائي للرؤية المعمارية ثلاثية الأبعاد بنسبة 100%.',
        },
        {
          num: '04',
          q: 'كيف تضمنون استقرار الميزانية وتفادي الزيادات غير المتوقعة في تكاليف البناء؟',
          a: 'نضمن ضبط التكاليف منذ اليوم الأول عبر نمذجة 5D BIM التي تربط التصميم الهندسي مباشرة بجداول الكميات الدقيقة والأسعار السوقية المحدثة. نضع قبل بدء البناء دفاتر شروط تفصيلية للمواد وتوصيفات فنية صارمة مع دراسات هندسة القيمة (Value Engineering) التي تحافظ على فخامة التصميم دون هدر مالي، مع عدم اعتماد أي تعديل ميداني إلا بدراسة أثر مالي معتمدة وموقعة مسبقاً.',
        },
        {
          num: '05',
          q: 'كيف يتم التعامل مع التراخيص البلدية، اشتراطات البناء، والموافقات الحكومية الرسمية؟',
          a: 'يتولى فريق العلاقات الهندسية والتراخيص مراجعة اشتراطات البناء، ونسب البناء (FAR)، والارتدادات، وكود الحريق والسلامة منذ المسودات الأولى. نتعاون مع مكاتب محلية معتمدة في جهاز القاهرة الجديدة، الشيخ زايد، العاصمة الإدارية، وأمانات المدن في الرياض، مما يسرّع الحصول على رخص البناء وموافقات الدفاع المدني دون أي تعطيل أو حاجة لإعادة التصميم.',
        },
        {
          num: '06',
          q: 'كيف تطبقون معايير الاستدامة والتصميم المناخي الملائم لطقس وبيئة الشرق الأوسط؟',
          a: 'ننظر للاستدامة كجوهر للمنظومة المعمارية وليست مجرد إضافات شكلية. نعتمد التوجيه الشمسي المدروس، والواجهات المزدوجة المعزولة حرارياً بأحجار الترافيرتين والحجر الجيري الطبيعي، والكوابيل الكبيرة لتوفير الظلال، والأفنية الداخلية المزودة بعناصر مائية لتلطيف الهواء، مع زجاج منخفض الانبعاث (Low-E) وأنظمة تكييف متغيرة التدفق (VRF)، مما يخفض استهلاك الطاقة بنسب تتجاوز 35% ويوفر بيئة داخلية هادئة ومريحة حرارياً.',
        },
      ],

      eyebrow: 'معرض الأعمال / 02',
      title: 'عمارة تصيغها البيئة، ونسب تحكمها التجربة الإنسانية.',
      subtitle:
        'مجموعة مختارة من الفيلات السكنية الفاخرة، والتصميمات الداخلية المصممة خصيصاً، وبيئات اللاندسكيب والتنسيق الهندسي بالقاهرة والرياض.',
      all: 'الكل',
      showing: 'عرض',
      works: 'مشاريع',
      viewProject: 'عرض المشروع',
    },
    servicesPage: {
      heroEyebrow: 'خدماتنا المعمارية والتصميمية',
      heroTitle: 'حلول تصميمية وهندسية متكاملة.',
      heroSubtitle:
        'من الرؤية الأولية حتى التنفيذ الواقعي، نقدم باقة متكاملة من الخدمات المعمارية والتصميمية والهندسية، لنبتكر فراغات وظيفية، ساحرة، وبنيت لتدوم للأجيال.',
      brandPeople: 'الإنسان',
      brandPlaces: 'المكان',
      brandPurpose: 'الغاية',

      overviewEyebrow: 'نظرة عامة على الخدمات',
      overviewTitle: 'رحلة تصميمية متكاملة.',
      overviewSubtitle:
        'نجمع بين الإبداع التصميمي، والخبرة الهندسية الفائقة، وإدارة المشاريع الاحترافية لنقدم حلولاً متكاملة — من أول فكرة مبدئية حتى التسليم النهائي وما بعده.',
      overviewCta: 'تحدث معنا حول مشروعك',

      learnMore: 'اعرف المزيد',

      readyEyebrow: 'جاهز للبدء؟',
      readyTitle: 'دعنا نبني صرحاً استثنائياً.',
      freeConsultationCta: 'استشارة مجانية لمدة 30 دقيقة',
      contactUsCta: 'تواصل معنا',

      eyebrow: 'التخصصات / 03',
      title: 'مكتب استشارات واحد. تخصصات متكاملة.',
      subtitle:
        'نلغي الفجوة التقليدية بين العمارة والتصميم الداخلي واللاندسكيب والهندسة؛ لنصمم وننسق كل تفصيلة تحت رؤية هندسية موحدة.',
      deliverablesTitle: 'أهم مخرجات ونطاق العمل',
      requestService: 'طلب الخدمة',
      viewWorks: 'عرض المشاريع',
      bimEyebrow: 'التنسيق الفني',
      bimTitle: 'الهندسة الدقيقة ونمذجة الـ BIM المتطورة',
      bimSubtitle:
        'العمارة العظيمة تفقد قيمتها بدون هندسة دقيقة. في VIWAN، تُدمج المخططات الإنشائية والأنظمة الكهروميكانيكية وكشف التعارضات منذ اليوم الأول.',
    },
    studioPage: {
      eyebrow: 'عن المكتب / 04',
      title: 'فكر متكامل. تنفيذ هندسي دقيق.',
      subtitle:
        'يجمع VIWAN بين العمارة والهندسة والتصميم الداخلي واللاندسكيب والخبرة التقنية تحت مظلة استشارية هندسية متكاملة. نطور المشاريع من الفكرة الأولية حتى المخططات التنفيذية والتسليم بالموقع، موازنين بين وضوح الرؤية التصميمية والدقة الهندسية لخلق بيئات وظيفية تدوم وترتبط بعمق بمحيطها.',
      manifestoIndex: '01',
      manifestoLabel: 'فلسفتنا المعمارية',
      manifestoHeading: 'التصميم ليس مجرد ديكور وزخرفة، بل هو كيف يعمل الفراغ، وكيف يبدو شعوره، وكيف يدوم للأجيال.',
      manifestoP1:
        'يبدأ كل مشروع بالاستماع الدقيق — لفهم طبيعة الأرض، وزوايا سقوط الضوء الطبيعي، ونمط حياة الملاك، والهدف طويل الأمد للتطوير.',
      manifestoP2:
        'نرفض الصيحات المؤقتة لصالح النسب الخالدة، واستخدام الخامات الطبيعية الأصيلة (الترافيرتين، الأحجار الدافئة، الأخشاب المضلعة، والبرونز المعتّق).',
      exploreProcess: 'استكشف منهجيتنا',
      joinTeam: 'انضم للفريق',
      impactIndex: '02',
      impactLabel: 'أثرنا وإنجازاتنا',
      impactHeading: 'تميز معماري ملموس وموثق بالأرقام',
      impactSub: 'تنفيذ بيئات معمارية عالية الأداء في الشرق الأوسط.',
      trustedBy: 'محل ثقة كبار المطورين والملاك',
      markets: 'مصر · المملكة العربية السعودية · الإمارات',
      craftIndex: '03',
      craftLabel: 'الخامات والحِرفة',
      craftHeading: 'أصالة الملمس وصدق البناء',
      craftSub:
        'نختار بعناية الأحجار والأخشاب والكتان والمعادن التي تعتق بوقار وتزيد جمالاً بمرور السنين.',
    },
    howWeWorkPage: {
      heroEyebrow: 'منهجية العمل والمسار الهندسي',
      heroTitle1: 'من الخط الأول والاسكتش،',
      heroTitle2: 'إلى واقع معماري متكامل.',
      heroSubtitle:
        'مسار استشاري منضبط وشفاف عبر 6 مراحل متتالية؛ يزيل الغموض، ويحكم ضبط الميزانيات، ويضمن تحويل الرؤى التصميمية إلى صروح عمرانية تدوم للأجيال.',
      brandPeople: 'الاكتشاف',
      brandPlaces: 'الدقة الهندسية',
      brandPurpose: 'التسليم والواقع',
      explorePhasesCta: 'استعراض مراحل العمل (6)',
      bookConsultationCta: 'احجز استشارة 30 دقيقة',
      eyebrow: 'المنهجية / 05',
      title: 'من الخطوط الأولى حتى اكتمال البناء.',
      subtitle:
        'مسار عمل هندسي دقيق وشفاف في 6 مراحل يقضي على المفاجآت ويضمن تطابق الميزانية مع الواقع.',
      milestones: 'مخرجات ومحطات المرحلة',
      calloutEyebrow: 'أماكن استثنائية • قيمة خالدة',
      calloutHeading: 'العقار المناسب\nيصنع فارق ما هو قادم.',
      calloutSub:
        'اكتشف عقارات متميزة وفرصاً استثمارية مختارة بعناية لموقعها، وطابعها المعماري، وإمكانياتها الواعدة — مع إرشاد موثوق من مرحلة البحث الأولى وحتى القرار النهائي.',
      scheduleAdvisory: 'احجز استشارة 30 دقيقة الآن',
    },
    careersPage: {
      eyebrow: 'الوظائف في VIWAN',
      title: 'ابنِ ما يترك أثراً حقيقياً.',
      subtitle:
        'انضم إلى فريق متعدد التخصصات شغوف بصناعة فراغات ذات معنى وبناء غدٍ أفضل.',
      joinOurTeamCta: 'انضم إلى فريقنا',
      viewPositionsCta: 'انضم إلى فريقنا',
      viewAllPositions: 'استعرض كافة الوظائف',
      studioCultureCta: 'ثقافة الاستوديو',
      brandPeople: 'الإنسان',
      brandIdeas: 'الأفكار',
      brandGrowth: 'التطور',
      brandImpact: 'الأثر',

      // 01 / Why Viwan
      whyEyebrow: '01 / لماذا VIWAN',
      whyHeading: 'بيئة للإبداع، والنمو، والانتماء.',
      whySubtitle:
        'نؤمن بأن العمل الاستثنائي ينبع من كفاءات استثنائية. في VIWAN، نوفر بيئة محفزة وداعمة تطلق طاقاتك ليصنع إبداعك فارقاً حقيقياً.',
      pillars: [
        {
          num: '01',
          title: 'مشاريع ذات قيمة',
          desc: 'العمل على مشاريع استثنائية ومتنوعة تترك أثراً حقيقياً في العمارة والتصميم.',
        },
        {
          num: '02',
          title: 'ثقافة تشاركية',
          desc: 'فريق متكامل بروح واحدة يتبادل الأفكار بلا حواجز بين كافة التخصصات.',
        },
        {
          num: '03',
          title: 'تطوير مستمر',
          desc: 'طوّر مهاراتك وانمُ معنا عبر ورش العمل والتدريب المستمر والاعتمادات الاحترافية.',
        },
        {
          num: '04',
          title: 'توازن وجودة حياة',
          desc: 'نقدر رفاهيتك وجودة حياتك داخل الاستوديو وخارجه لخلق إلهام مستدام.',
        },
      ],

      // 02 / Open Positions
      openRolesLabel: '02 / الوظائف الشاغرة',
      opportunitiesHeading: 'فرص الانضمام الحالية',
      openInCairo: 'استوديو القاهرة / خيارات عمل مرنة',
      positionsSub:
        'استكشف الفرص المتاحة حالياً عبر فرقنا أو تواصل معنا لتعريف الإدارة بأعمالك وخبراتك.',
      spontaneousTitle: 'لم تجد تخصصك الدقيق؟',
      spontaneousDesc:
        'نبحث دائماً عن أصحاب الموهبة المتفردة في التصميم المعماري، الإظهار ثلاثي الأبعاد، وإدارة المواقع.',
      spontaneousEmail: 'careers@viwan.studio',
      spontaneousBtn: 'تقديم طلب توظيف عام',
      roleOverview: 'نبذة عن الدور الوظيفي',
      keyResponsibilities: 'المسؤوليات الرئيسية',
      requirementsSkills: 'الشروط والمؤهلات المطلوبة',
      softwareMastery: 'البرمجيات المطلوبة',
      applyForThisRole: 'التقديم على هذه الوظيفة',

      // 03 / Life at Viwan
      lifeEyebrow: '03 / الحياة في VIWAN',
      lifeHeading: 'أكثر من مجرد بيئة عمل.',
      lifeSubtitle:
        'من حوارات التصميم إلى صياغة الأفكار المشتركة، نصنع بيئة يومية تلهم الإبداع والتعاون والتطور المستمر.',
      galleryLabels: [
        'حوارات التصميم وجدار النقد المعماري',
        'صناعة الماكيتات وأدوات الرسم الهندسي',
        'مدخل الاستوديو وفلسفة الفراغ',
        'ظلال أشجار الفناء الداخلي وانعكاس الخامات',
      ],

      // Modal & Application Form
      applyHeading: 'الانضمام لفريق VIWAN',
      applySub: 'يرجى تزويدنا ببياناتك ورابط ملف أعمالك (Portfolio) أدناه.',
      applyReceivedTitle: 'تم إرسال طلبك بنجاح',
      applyReceivedMsg:
        'شكراً لك! سيقوم فريق استقطاب المواهب بمراجعة ملف أعمالك والتواصل معك قريباً.',
      fullName: 'الاسم بالكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف / الواتساب',
      portfolioLink: 'رابط محفظة الأعمال (Behance / Drive / Web)',
      coverNote: 'رسالة قصيرة / لماذا VIWAN؟',
      experienceLevel: 'سنوات الخبرة',
      sendApplication: 'إرسال طلب التوظيف',
      sendingApplication: 'جاري الإرسال...',
      closeModal: 'إغلاق',

      // Ready bottom CTA
      readyEyebrow: 'مستعد للخطوة التالية؟',
      readyTitle: 'دعنا نبني المستقبل معاً.',
      sendCvCta: 'أرسل سيرتك الذاتية',
      contactUsCta: 'تواصل معنا',
      applyNowCta: 'أرسل سيرتك الذاتية',
      exploreProjectsCta: 'تواصل معنا',
    },
    contactPage: {
      heroEyebrow: 'تواصل مع VIWAN',
      heroTitle: 'لنبدأ حواراً معمارياً.',
      heroSubtitle:
        'أخبرنا عن مشروعك، وسنساعدك في صياغة المسار المعماري الصحيح منذ أول نقاش.',
      brandPeople: 'الإنسان',
      brandPlaces: 'المكان',
      brandPurpose: 'الغاية',

      inquiryEyebrow: 'تواصل معنا',
      inquiryTitle: 'استفسار عن مشروع',

      fullName: 'الاسم',
      fullNamePlaceholder: 'الاسم بالكامل',
      company: 'الشركة',
      companyPlaceholder: 'اسم الشركة أو الجهة',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'you@company.com',
      phone: 'رقم الهاتف',
      phonePlaceholder: '+20 100 000 0000',
      location: 'موقع المشروع',
      locationPlaceholder: 'اختر موقع المشروع',
      type: 'نوع المشروع',
      typePlaceholder: 'اختر نوع المشروع',
      size: 'مساحة المشروع',
      sizePlaceholder: 'اختر مساحة المشروع',
      budget: 'الميزانية التقديرية',
      budgetPlaceholder: 'اختر الميزانية التقديرية',
      stage: 'مرحلة المشروع',
      stagePlaceholder: 'اختر مرحلة المشروع',
      message: 'الرسالة',
      messagePlaceholder: 'أخبرنا عن تفاصيل مشروعك، أهدافك، وأي متطلبات أخرى…',
      submitBtn: 'إرسال استفسار المشروع',
      submittingBtn: 'جاري إرسال الاستفسار…',

      inquiryReceivedTitle: 'تم استلام طلبك بنجاح',
      inquiryReceivedMsg: 'شكراً لتواصلك مع VIWAN. استلم فريقنا البريف وسيتصل بك قريباً.',
      sendAnother: 'إرسال استفسار آخر',

      studioEyebrow: 'استوديو VIWAN',
      studioTitle: 'معلومات التواصل',
      studioName: 'VIWAN',
      studioRole: 'استشارات متكاملة في العمارة والهندسة والتصميم الداخلي',
      studioCity: 'القاهرة، مصر',
      studioEmail: 'info@viwan.studio',
      studioPhone: '+20 100 956 5380',
      studioLinkedin: 'لينكد إن',
      studioInstagram: 'إنستغرام',
      studioWebsite: 'www.viwan.studio',

      mapCaption: 'مقرنا في القاهرة، ونعمل عبر مصر وكافة أنحاء المنطقة.',
      mapTagline: 'مصر · الشرق الأوسط وما وراء الحدود',

      calloutTitle: 'تفضل التحدث هاتفياً أولاً؟',
      calloutSubtitle: 'احجز استشارة معمارية مجانية ودعنا نناقش رؤيتك.',
      calloutButton: 'احجز استشارة مجانية',

      channels: {
        general: {
          title: 'استفسارات عامة',
          desc: 'للأسئلة العامة حول استوديو VIWAN، أو فرص التعاون والشراكة.',
          email: 'info@viwan.studio',
        },
        projects: {
          title: 'مشاريع جديدة',
          desc: 'شاركنا موجز مشروعك ودعنا نستكشف كيف نحوّله إلى واقع معماري.',
          email: 'start@viwan.studio',
        },
        careers: {
          title: 'انضم لفريقنا',
          desc: 'نبحث دائماً عن مواهب معمارية وهندسية استثنائية للانضمام إلينا.',
          linkText: 'careers@viwan.studio',
        },
      },

      bottomCta: {
        eyebrow: 'من أجل غدٍ أكثر إنسانية',
        title: 'لنصنع معاً ما هو قادم.',
        brandPeople: 'الإنسان',
        brandPlaces: 'المكان',
        brandPossibilities: 'الآفاق',
        consultationBtn: 'استشارة مجانية 30 دقيقة',
        startProjectBtn: 'ابدأ مشروعك الآن',
      },
    },
    consultationPage: {
      eyebrow: 'استشارة مباشرة / 08',
      title: 'استشارة معمارية مجانية مدتها 30 دقيقة',
      subtitle:
        'تحدث مباشرة مع أحد مديري التصميم في VIWAN لتقييم موقعك وتحديد خارطة الطريق المبدئية لمشروعك.',
      agendaIndex: '01',
      agendaLabel: 'محاور الجلسة',
      agendaHeading: 'ما الذي نغطيه خلال الـ 30 دقيقة؟',
      agendaSub: 'حوار معماري استراتيجي مركّز ومصمم خصيصاً لمشروعك بدون أي التزام.',
      item1Title: 'تقييم الموقع والبرنامج الفراغي',
      item1Desc: 'مراجعة أبعاد الأرض وزوايا التوجيه والاشتراطات البنائية.',
      item2Title: 'إرشادات الميزانية ومراحل التنفيذ',
      item2Desc: 'تقديرات واقعية لتكلفة المتر المربع للعمارة والتشطيب الفاخر والـ MEP.',
      item3Title: 'استراتيجية الـ BIM وتفادي الأخطاء',
      item3Desc: 'كيف يحميك التنسيق الهندسي المسبق من التكاليف المهدرة وتأخيرات الموقع.',
      locationNoteTitle: 'عبر الفيديو أو بمقر المكتب',
      locationNoteDesc: 'يمكن عقد الجلسة عبر Google Meet / Zoom أو في مكاتبنا بالقاهرة أو الرياض.',
      reservationIndex: '02',
      reservationLabel: 'حجز الموعد',
      reservationHeading: 'اختر الموعد المناسب لك',
      reservationSub: 'اختر التوقيت المفضل وسيرسل لك فريقنا رابط الاجتماع الافتراضي.',
      sessionRequestedTitle: 'تم حجز الجلسة المبدئية',
      sessionRequestedMsg: 'أرسلنا دعوة التقويم إلى بريدك الإلكتروني. نتطلع للقاء والحديث معك!',
      bookAnother: 'حجز جلسة أخرى',
      preferredDate: 'التاريخ المفضل',
      preferredTime: 'الفترة المفضلة',
      notesLabel: 'موقع المشروع وأهم الأسئلة للاستشارة',
      confirmBtn: 'تأكيد حجز الاستشارة المجانية',
      securingBtn: 'جاري تأكيد الحجز...',
    },
  },
}

interface LanguageContextType {
  lang: Language
  dir: 'ltr' | 'rtl'
  toggleLang: () => void
  isAr: boolean
  setLang: (l: Language) => void
  t: typeof DICTIONARY['en']
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  isAr: false,
  dir: 'ltr',
  toggleLang: () => {},
  setLang: () => {},
  t: DICTIONARY.en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('viwan_lang') as Language | null
    if (saved === 'ar' || saved === 'en') {
      setLangState(saved)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('viwan_lang', lang)
  }, [lang, mounted])

  const toggleLang = () => {
    setLangState((prev) => (prev === 'en' ? 'ar' : 'en'))
  }

  const setLang = (l: Language) => {
    setLangState(l)
  }

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isAr: lang === 'ar',
        dir: lang === 'ar' ? 'rtl' : 'ltr',
        toggleLang,
        setLang,
        t: DICTIONARY[lang],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

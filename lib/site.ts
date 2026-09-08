export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Services', href: '/services' },
  { label: 'Studio', href: '/studio' },
  { label: 'How We Work', href: '/how-we-work' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
] as const

export const CONTACT = {
  city: 'Cairo, Egypt',
  email: 'info@viwan.net',
  phone: '+20 100 000 0000',
  whatsapp: 'https://wa.me/201000000000',
  website: 'viwan.net',
  linkedin: 'https://linkedin.com/company/viwan',
  instagram: 'https://instagram.com/viwan.studio',
  facebook: 'https://facebook.com/viwan.studio',
  youtube: 'https://youtube.com/@viwanstudio',
  behance: 'https://behance.net/viwan',
}

export const PROCESS = [
  {
    n: '01',
    title: 'Discover',
    heading: 'Understand the project.',
    short: 'Understand the project.',
    items: ['Client Brief', 'Site', 'Needs', 'Budget', 'Vision', 'Timeline'],
  },
  {
    n: '02',
    title: 'Define',
    heading: 'Create the direction.',
    short: 'Create the direction.',
    items: ['Program', 'Design Brief', 'References', 'Goals', 'Constraints'],
  },
  {
    n: '03',
    title: 'Design',
    heading: 'Shape the idea.',
    short: 'Shape the idea.',
    items: ['Concept', 'Plans', 'Massing', 'Materials', 'Visuals'],
  },
  {
    n: '04',
    title: 'Develop',
    heading: 'Turn ideas into detail.',
    short: 'Turn ideas into detail.',
    items: ['Design Development', 'Material Selection', 'Technical Decisions', 'Details'],
  },
  {
    n: '05',
    title: 'Coordinate',
    heading: 'Make everything work together.',
    short: 'Make everything work together.',
    items: ['Architecture', 'Structure', 'MEP', 'BIM', 'Coordination'],
  },
  {
    n: '06',
    title: 'Deliver',
    heading: 'From drawing to reality.',
    short: 'From drawing to reality.',
    items: [
      'Construction Documentation',
      'Tender Support',
      'Site Coordination',
      'Implementation Support',
    ],
  },
] as const

export const SERVICES = [
  {
    n: '01',
    slug: 'architecture',
    title: 'Architecture',
    description:
      'We create architecture shaped by context, function, proportion and human experience.',
    preview: ['Concept Design', 'Design Development', 'Technical Documentation'],
    items: [
      'Concept Design',
      'Schematic Design',
      'Design Development',
      'Architectural Documentation',
      'Façade Design',
      'BIM Coordination',
    ],
    image: '/images/project-private-residence.png',
  },
  {
    n: '02',
    slug: 'interior-design',
    title: 'Interior Design',
    description:
      'Interiors approached as a complete spatial experience — balancing function, materiality, light and detail to create environments with a distinctive identity.',
    preview: ['Spatial Planning', 'Materials', 'FF&E', 'Lighting'],
    items: [
      'Space Planning',
      'Interior Concept',
      'Materials & Finishes',
      'FF&E',
      'Lighting Design',
      'Technical Drawings',
      'Styling',
      'Execution Coordination',
    ],
    image: '/images/interior-living-fireplace.jpg',
  },
  {
    n: '03',
    slug: 'landscape',
    title: 'Landscape',
    description:
      'Outdoor environments designed as an extension of architecture — rooted in place, climate and the way people move through space.',
    preview: ['Masterplanning', 'Hardscape', 'Softscape'],
    items: [
      'Landscape Concept',
      'Masterplanning',
      'Hardscape',
      'Softscape',
      'Outdoor Living',
      'Public Realm',
      'Landscape Details',
    ],
    image: '/images/project-hillside-villa.png',
  },
  {
    n: '04',
    slug: 'engineering',
    title: 'Engineering',
    description:
      'Technical precision that turns design intent into buildable reality — coordinated, documented and ready for construction.',
    preview: ['Technical Coordination', 'BIM', 'Structural + MEP'],
    items: [
      'Structural Coordination',
      'MEP Coordination',
      'BIM',
      'Shop Drawing Review',
      'Technical Documentation',
      'Construction Support',
    ],
    image: '/images/project-commercial-riyadh.png',
  },
] as const

export const VALUES = [
  { title: 'Clarity', text: 'Simple ideas. Lasting impact.' },
  { title: 'Function', text: 'Spaces that truly work.' },
  { title: 'Materiality', text: 'Honest, enduring materials.' },
  { title: 'Human Experience', text: 'People at the center of every decision.' },
  { title: 'Technical Precision', text: 'Ideas built with confidence.' },
] as const

export const CONSULTATION_TOPICS = [
  'Architecture',
  'Interior Design',
  'Landscape',
  'Project Feasibility',
  'Design Direction',
  'Scope of Work',
  'Project Process',
] as const

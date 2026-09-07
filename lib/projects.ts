export type Discipline = 'Architecture' | 'Interior Design' | 'Landscape' | 'Engineering'

export type GalleryItem = {
  src: string
  caption: string
  category: 'Architecture' | 'Interiors' | 'Landscape' | 'Details'
}

export type Project = {
  slug: string
  index: string
  name: string
  location: string
  country: string
  year: string
  type: string
  disciplines: Discipline[]
  scope: string[]
  tagline: string
  heading: string
  description: string
  philosophy: string
  cover: string
  interior: string
  cinematic: string
  gallery: GalleryItem[]
  featured?: boolean
}

export const PROJECTS: Project[] = [
  {
    slug: 'private-residence-01',
    index: '01',
    name: 'Private Residence 01',
    location: 'New Cairo',
    country: 'Egypt',
    year: '2026',
    type: 'Private Residence',
    disciplines: ['Architecture', 'Interior Design', 'Landscape'],
    scope: [
      'Architecture Design',
      'Interior Design',
      'Landscape Design',
      'Technical Documentation',
      'Engineering Coordination',
    ],
    tagline: 'A home in harmony with its surroundings.',
    heading: 'A refined balance of architecture and nature.',
    description:
      'This private residence was designed as a serene retreat where modern architecture meets a warm, timeless atmosphere. The design embraces open spaces, natural materials and a strong connection to the outdoors, creating a home that feels both elegant and personal. Travertine volumes are layered with vertical wood screens and expansive glazing, allowing the garden and pool to become part of daily life inside the house.',
    philosophy:
      'A dialogue between modern living and natural serenity, where every space is intentionally crafted to enhance the way people live.',
    cover: '/images/project-private-residence.png',
    interior: '/images/interior-living-marble.jpg',
    cinematic: '/images/hero-villa.png',
    featured: true,
    gallery: [
      { src: '/images/project-private-residence.png', caption: 'Exterior View', category: 'Architecture' },
      { src: '/images/interior-living-marble.jpg', caption: 'Living Area', category: 'Interiors' },
      { src: '/images/interior-dining.png', caption: 'Dining Area', category: 'Interiors' },
      { src: '/images/interior-bedroom.png', caption: 'Master Bedroom', category: 'Interiors' },
      { src: '/images/detail-courtyard.png', caption: 'Courtyard', category: 'Landscape' },
      { src: '/images/material-stone.png', caption: 'Travertine Detail', category: 'Details' },
    ],
  },
  {
    slug: 'lake-house',
    index: '02',
    name: 'Lake House',
    location: 'Ain Sokhna',
    country: 'Egypt',
    year: '2025',
    type: 'Private Residence',
    disciplines: ['Architecture', 'Landscape'],
    scope: ['Architecture Design', 'Landscape Design', 'Technical Documentation'],
    tagline: 'Rooted in the landscape. Designed for a slower, richer life.',
    heading: 'A quiet structure resting on water.',
    description:
      'The Lake House is a low, horizontal composition that extends over calm water on a timber deck. A cantilevered roof shelters the living spaces while travertine walls anchor the house to its site. Reeds, olive trees and native planting soften the edge between architecture and landscape, so the building appears to have always belonged there.',
    philosophy: 'Architecture lives longer when it belongs.',
    cover: '/images/project-lake-house.png',
    interior: '/images/interior-living-fireplace.jpg',
    cinematic: '/images/project-lake-house.png',
    gallery: [
      { src: '/images/project-lake-house.png', caption: 'Exterior at Dawn', category: 'Architecture' },
      { src: '/images/interior-living-fireplace.jpg', caption: 'Living Area', category: 'Interiors' },
      { src: '/images/project-hillside-villa.png', caption: 'Terraces', category: 'Landscape' },
      { src: '/images/material-wood.png', caption: 'Timber Cladding', category: 'Details' },
    ],
  },
  {
    slug: 'the-urban-retreat',
    index: '03',
    name: 'The Urban Retreat',
    location: 'Cairo',
    country: 'Egypt',
    year: '2025',
    type: 'Apartment',
    disciplines: ['Interior Design'],
    scope: ['Interior Design', 'FF&E', 'Lighting Design', 'Styling'],
    tagline: 'A refined urban sanctuary that balances warmth, materiality and modern living.',
    heading: 'Calm, material and deeply personal.',
    description:
      'A complete interior transformation of a city apartment into a warm, layered retreat. Dark walnut panelling, travertine surfaces and a linear fireplace create a sense of stillness, while carefully controlled lighting shapes the mood from morning to night. Every piece of furniture and every finish was selected to feel timeless rather than fashionable.',
    philosophy: 'Spaces shaped by purpose, character and detail.',
    cover: '/images/interior-living-fireplace.jpg',
    interior: '/images/interior-dining.png',
    cinematic: '/images/interior-living-fireplace.jpg',
    gallery: [
      { src: '/images/interior-living-fireplace.jpg', caption: 'Living Area', category: 'Interiors' },
      { src: '/images/interior-dining.png', caption: 'Dining', category: 'Interiors' },
      { src: '/images/interior-bedroom.png', caption: 'Bedroom', category: 'Interiors' },
      { src: '/images/material-fabric.png', caption: 'Textiles', category: 'Details' },
      { src: '/images/material-metal.png', caption: 'Bronze & Stone', category: 'Details' },
    ],
  },
  {
    slug: 'hillside-villa',
    index: '04',
    name: 'Hillside Villa',
    location: 'Ain Sokhna',
    country: 'Egypt',
    year: '2026',
    type: 'Private Villa',
    disciplines: ['Architecture', 'Landscape', 'Engineering'],
    scope: ['Architecture Design', 'Landscape Design', 'Structural Coordination', 'BIM'],
    tagline: 'Rooted in the landscape.',
    heading: 'Built into the slope, open to the sea.',
    description:
      'Set into a steep coastal site, the villa steps down the hillside in a series of stone terraces. Wide external stairs move through native planting toward the sea, and each level opens onto its own shaded outdoor room. Structural and MEP coordination through BIM allowed the complex terracing to be resolved precisely before construction began.',
    philosophy: 'Nature. Architecture. People.',
    cover: '/images/project-hillside-villa.png',
    interior: '/images/interior-bedroom.png',
    cinematic: '/images/project-hillside-villa.png',
    gallery: [
      { src: '/images/project-hillside-villa.png', caption: 'Approach', category: 'Landscape' },
      { src: '/images/interior-bedroom.png', caption: 'Master Suite', category: 'Interiors' },
      { src: '/images/detail-courtyard.png', caption: 'Stone Courtyard', category: 'Architecture' },
      { src: '/images/material-stone.png', caption: 'Stone Detail', category: 'Details' },
    ],
  },
  {
    slug: 'commercial-project-03',
    index: '05',
    name: 'Urban Commercial Hub',
    location: 'Riyadh',
    country: 'KSA',
    year: '2025',
    type: 'Commercial',
    disciplines: ['Architecture', 'Interior Design', 'Engineering'],
    scope: ['Architecture Design', 'Interior Design', 'Technical Documentation', 'MEP Coordination'],
    tagline: 'A civic presence in limestone and bronze.',
    heading: 'Precision at an urban scale.',
    description:
      'A mixed-use commercial building on a prominent Riyadh plaza. Deep recessed windows and bronze vertical fins control the harsh desert light while giving the limestone façade rhythm and depth. Full technical documentation and MEP coordination were delivered alongside the design, ensuring a seamless transition from concept to construction.',
    philosophy: 'Design is not decoration. It is how space works, feels and lasts.',
    cover: '/images/project-commercial-riyadh.png',
    interior: '/images/project-executive-office.png',
    cinematic: '/images/project-commercial-riyadh.png',
    gallery: [
      { src: '/images/project-commercial-riyadh.png', caption: 'Plaza Façade', category: 'Architecture' },
      { src: '/images/project-executive-office.png', caption: 'Executive Office', category: 'Interiors' },
      { src: '/images/material-metal.png', caption: 'Bronze Fins', category: 'Details' },
    ],
  },
  {
    slug: 'private-majlis',
    index: '06',
    name: 'Private Majlis',
    location: 'Riyadh',
    country: 'KSA',
    year: '2024',
    type: 'Luxury Living',
    disciplines: ['Interior Design'],
    scope: ['Interior Design', 'Bespoke Furniture', 'Lighting Design'],
    tagline: 'Sophisticated spaces rooted in tradition, expressed with contemporary elegance.',
    heading: 'Tradition, reinterpreted.',
    description:
      'A private majlis that honours the ritual of gathering. Backlit geometric screens in carved wood wrap the room, low seating follows the perimeter, and a single brass pendant marks the centre. Contemporary in its restraint, traditional in its generosity.',
    philosophy: 'Every detail contributes to a more meaningful way of living.',
    cover: '/images/project-majlis.png',
    interior: '/images/project-majlis.png',
    cinematic: '/images/project-majlis.png',
    gallery: [
      { src: '/images/project-majlis.png', caption: 'Majlis', category: 'Interiors' },
      { src: '/images/material-wood.png', caption: 'Carved Screens', category: 'Details' },
      { src: '/images/material-fabric.png', caption: 'Upholstery', category: 'Details' },
    ],
  },
]

export const DISCIPLINE_FILTERS = [
  'All',
  'Architecture',
  'Interior Design',
  'Landscape',
  'Engineering',
] as const

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug)
}

export function getNextProject(slug: string) {
  const i = PROJECTS.findIndex((p) => p.slug === slug)
  return PROJECTS[(i + 1) % PROJECTS.length]
}

export const FEATURED_PROJECT = PROJECTS.find((p) => p.featured) ?? PROJECTS[0]
export const HOME_PROJECTS = PROJECTS.slice(0, 3)

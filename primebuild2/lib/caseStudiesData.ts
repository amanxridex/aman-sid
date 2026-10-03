export interface CaseStudy {
  slug: string;
  name: string;
  cuisine: string;
  locations: string;
  founders: string;
  headline: string;
  heroStat: string;
  heroStatLabel: string;
  image: string;
  stats: { label: string; value: string }[];
  quote: string;
  story: string[];
  results: string[];
  tags: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'ealing-kitchen-extension',
    name: 'Ealing Kitchen Extension',
    cuisine: 'Rear Home Extension',
    locations: 'Bradley Gardens, Ealing, London W13',
    founders: 'The Miller Family',
    headline: 'Single-storey rear extension with Crittall-style glazing, large central kitchen island, and rooflights',
    heroStat: '£78,000',
    heroStatLabel: 'Fixed-Price JCT Contract',
    image: '/images/projects_unique/proj_7.jpg',
    stats: [
      { label: 'Contract Value', value: '£78,000' },
      { label: 'Variations', value: '£0.00' },
      { label: 'Timeline', value: '11 Weeks' }
    ],
    quote: 'Prime Build delivered our kitchen extension exactly to the penny and on time. Having a friendly site team who kept the house tidy made all the difference.',
    story: [
      'The homeowners wanted to transform a narrow, dark Victorian rear kitchen into a bright, open-plan family kitchen diner opening out to the garden.',
      'We handled the foundation excavation, steel RSJ beam installation to open up the back wall, Crittall-style French doors, and three large flat rooflights.',
      'The project was signed off by Ealing Building Control on the first inspection with zero snagging delays.'
    ],
    results: [
      'Completed in 11 weeks on fixed-price contract',
      'Full Building Control sign-off and 10-year warranty',
      'Zero surprise variation invoices'
    ],
    tags: ['Kitchen Extension', 'Single Storey', 'West London']
  },
  {
    slug: 'albert-road-renovation',
    name: 'Albert Road House Renovation',
    cuisine: 'Victorian Ground-Floor Refurb',
    locations: 'Albert Road, London N22',
    founders: 'David & Sarah',
    headline: 'Structural wall removal, open-plan kitchen diner, engineered oak flooring, and garden doors',
    heroStat: '£85,000',
    heroStatLabel: 'Fixed-Price JCT Contract',
    image: '/images/projects_unique/proj_6.jpg',
    stats: [
      { label: 'Contract Value', value: '£85,000' },
      { label: 'Variations', value: '£0.00' },
      { label: 'Timeline', value: '12 Weeks' }
    ],
    quote: 'Our Victorian terrace feels completely transformed. Clean site, daily updates, and transparent billing from start to finish.',
    story: [
      'A ground-floor reconfiguration of a classic Victorian terrace in North London, opening up the compartmentalized layout into a cohesive modern living space.',
      'Installed structural steel support, modern handleless kitchen, underfloor heating, and new double-glazed rear access doors.',
      'Delivered on budget within 12 working weeks.'
    ],
    results: [
      'Full structural engineer sign-off',
      'Energy-efficient underfloor heating installed',
      'Delivered on target date'
    ],
    tags: ['Renovation', 'Victorian Terrace', 'North London']
  },
  {
    slug: 'clapham-loft-conversion',
    name: 'Clapham Dormer Loft Conversion',
    cuisine: 'Loft & En-Suite',
    locations: 'Clapham, London SW4',
    founders: 'James Thornton',
    headline: 'Rear dormer conversion creating a generous master bedroom suite, walk-in shower room, and Velux rooflights',
    heroStat: '£54,000',
    heroStatLabel: 'Fixed-Price JCT Contract',
    image: '/images/projects_unique/proj_13.jpg',
    stats: [
      { label: 'Contract Value', value: '£54,000' },
      { label: 'Variations', value: '£0.00' },
      { label: 'Timeline', value: '8 Weeks' }
    ],
    quote: 'Fast, professional, and courteous trades. The new loft bedroom and shower room have added enormous value and space to our home.',
    story: [
      'Converted unused attic space into an expansive master bedroom with integrated bespoke eaves storage and a luxury en-suite wet room.',
      'Handled all scaffolding, structural roof alterations, timber floor joist reinforcement, insulation, and plastering.'
    ],
    results: [
      'Completed in 8 weeks with minimal disruption',
      'Lambeth Building Control completion certificate issued',
      '10-year structural warranty provided'
    ],
    tags: ['Loft Conversion', 'Dormer', 'South London']
  },
  {
    slug: 'wandsworth-side-return',
    name: 'Wandsworth Side-Return Extension',
    cuisine: 'Side-Return & Patio',
    locations: 'Wandsworth, London SW18',
    founders: 'Emma & Richard',
    headline: 'Side infill extension gaining 22 sq metres of internal space with seamless flush-level garden threshold',
    heroStat: '£65,000',
    heroStatLabel: 'Fixed-Price JCT Contract',
    image: '/images/projects_unique/proj_8.jpg',
    stats: [
      { label: 'Contract Value', value: '£65,000' },
      { label: 'Variations', value: '£0.00' },
      { label: 'Timeline', value: '9 Weeks' }
    ],
    quote: 'The side return unlocked so much extra space in our ground floor. The team was super communicative and finished right on time.',
    story: [
      'Infilled the narrow unused side alley to double the kitchen width and create a bright dining zone with continuous glazed roof panels.'
    ],
    results: [
      'Gained 22 sq m of usable family living area',
      'Wandsworth Council planning and building sign-off',
      'Zero variations'
    ],
    tags: ['Side Return', 'Kitchen Diner', 'South West London']
  }
];

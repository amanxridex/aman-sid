export interface ProjectItem {
  id: string;
  title: string;
  category: "Residential" | "Commercial" | "Conversion" | "Refurbishment";
  location: string;
  borough: string;
  timeline: string;
  budgetRange: string;
  summary: string;
  challenge: string;
  solution: string;
  imageAfter: string;
  imageBeforeDesc: string;
  stats: { label: string; value: string }[];
  scope: string[];
}

export const projectsData: ProjectItem[] = [
  {
    id: "chelsea-townhouse-overhaul",
    title: "The Chelsea Townhouse Modernization",
    category: "Refurbishment",
    location: "London",
    borough: "Royal Borough of Kensington and Chelsea",
    timeline: "20 Weeks",
    budgetRange: "£320,000",
    summary: "A complete four-storey Victorian townhouse transformation featuring open-plan basement engineering, Crittall glass extensions, and bespoke acoustic isolation.",
    challenge: "The property had significant historic subsidence, strict conservation area restrictions, and cramped, compartmentalized room layouts that blocked natural light.",
    solution: "Installed 4 concealed RSJ steel goalposts, excavated a deepened lightwell, installed floor-to-ceiling slimline glazing, and incorporated smart climate zoning throughout all four floors.",
    imageAfter: "/images/hero_london_residence.jpg",
    imageBeforeDesc: "Dark compartmentalized Victorian rooms, failing damp subfloor, dated 1980s electrical wiring.",
    stats: [
      { label: "Floor Area", value: "310 m²" },
      { label: "Added Value", value: "+28%" },
      { label: "Energy Rating", value: "B (From E)" },
      { label: "Project Lead", value: "Senior Prime Builds Team" }
    ],
    scope: [
      "Full structural strip-out and steel frame installation",
      "Bespoke Italian kitchen with Calacatta marble island",
      "Four luxury en-suite bathrooms with concealed rainfall showers",
      "Heritage sash window refurbishment with acoustic double glazing",
      "Full Part L compliant insulation and zoned underfloor heating"
    ]
  },
  {
    id: "camden-architectural-kitchen",
    title: "Camden Townhouse Rear & Kitchen Extension",
    category: "Residential",
    location: "London",
    borough: "Camden",
    timeline: "14 Weeks",
    budgetRange: "£165,000",
    summary: "Side-return and rear wrap-around extension with black Crittall architectural doors, polished marble waterfall island, and flush courtyard integration.",
    challenge: "Narrow side alleyway with zero external rear access, requiring all structural steel and concrete to be transported through controlled internal hoarding.",
    solution: "Engineered segmented steel connections assembled on-site, installed high-thermal triple glazing, and laid flush light oak flooring extending seamlessly from the dining room.",
    imageAfter: "/images/london_kitchen_extension.jpg",
    imageBeforeDesc: "Narrow galley kitchen with no garden sightline, dark dining area, dilapidated side return alleyway.",
    stats: [
      { label: "New Floor Space", value: "+54 m²" },
      { label: "Natural Daylight Gain", value: "+180%" },
      { label: "Completion Speed", value: "On Schedule" },
      { label: "Client Satisfaction", value: "10/10 Score" }
    ],
    scope: [
      "Piled concrete groundworks with Thames Water build-over sign-off",
      "Bespoke royal blue fluted kitchen joinery with concealed pantry",
      "Continuous marble waterfall breakfast bar",
      "Full Crittall glass doors and structural glass rooflight",
      "Automated electric blinds and integrated ceiling sound system"
    ]
  },
  {
    id: "regents-park-mansard-loft",
    title: "Regents Park Master Suite Loft Conversion",
    category: "Conversion",
    location: "London",
    borough: "Westminster / Regents Park",
    timeline: "9 Weeks",
    budgetRange: "£78,000",
    summary: "Bespoke Mansard loft conversion creating an expansive master sanctuary with triple Velux rooflights, exposed architectural oak trusses, and luxury wetroom.",
    challenge: "Complex roofline geometry with shared party walls requiring delicate structural shoring and minimal disruption to the occupied lower floors.",
    solution: "Craned pre-fabricated steel floor beams into position in a single morning, framed the Mansard with high-grade multi-foil acoustic insulation, and crafted a bespoke timber staircase.",
    imageAfter: "/images/london_loft_conversion.jpg",
    imageBeforeDesc: "Uninsulated, dark Victorian attic space filled with redundant cold water tanks and low clearance.",
    stats: [
      { label: "Ceiling Height", value: "2.65 m" },
      { label: "Added Bedrooms", value: "1 Luxury Suite" },
      { label: "Property Equity", value: "+£120,000" },
      { label: "Acoustic Rating", value: "54 dB Attenuation" }
    ],
    scope: [
      "Mansard structural conversion with zinc roof cladding",
      "Triple automated rain-sensor Velux skylights",
      "Exposed treated oak structural collar ties",
      "Frameless glass wetroom with concealed brass thermostatic controls",
      "Custom eaves storage wardrobes finished in deep architectural blue"
    ]
  },
  {
    id: "mayfair-boutique-office",
    title: "Mayfair Headquarters Commercial Fit-Out",
    category: "Commercial",
    location: "London",
    borough: "City of Westminster / Mayfair",
    timeline: "12 Weeks",
    budgetRange: "£290,000",
    summary: "Cat B commercial fit-out for a premier London private equity firm featuring acoustic glass meeting suites, reception joinery, and HVAC engineering.",
    challenge: "Grade II listed commercial premises with strict landlord requirements, no noisy works during standard business hours, and stringent fire compliance.",
    solution: "Executed all structural work via phased night shifts, integrated concealed fire-rated glazed systems, and designed custom timber acoustic paneling.",
    imageAfter: "/images/london_commercial_fitout.jpg",
    imageBeforeDesc: "Outdated 1990s suspended ceiling grid, tired carpet tiles, inefficient electric storage heaters.",
    stats: [
      { label: "Workplace Capacity", value: "45 Stations" },
      { label: "Acoustic Seclusion", value: "Rw 48dB" },
      { label: "Turnover Time", value: "12 Weeks Dead" },
      { label: "BREEAM Standard", value: "Very Good" }
    ],
    scope: [
      "Custom reception desk with fluted architectural paneling",
      "Crittall-framed acoustic boardroom and teleconference pods",
      "Exposed architectural service ducts painted industrial white",
      "Polished concrete-effect luxury commercial vinyl flooring",
      "Integrated smart card access and CCTV security infrastructure"
    ]
  },
  {
    id: "kensington-master-bathroom",
    title: "Kensington Luxury Wetroom & Spa Sanctuary",
    category: "Residential",
    location: "London",
    borough: "Kensington",
    timeline: "5 Weeks",
    budgetRange: "£38,000",
    summary: "A bespoke master wetroom utilizing bookmatched Italian Calacatta marble slabs, a floating navy vanity, and frameless walk-in rainfall enclosure.",
    challenge: "Timber joist subfloor prone to vibration and potential movement, requiring zero-deflection structural reinforcement for large-format porcelain slabs.",
    solution: "Laid 25mm structural marine ply over sistered joists, installed Schluter-DITRA-HEAT uncoupling membrane with continuous tanking, and plumbed concealed brassware.",
    imageAfter: "/images/london_luxury_bathroom.jpg",
    imageBeforeDesc: "Damp 1970s acrylic bath suite, leaking mixer valve, discoloured grouting.",
    stats: [
      { label: "Waterproofing", value: "100% Guaranteed" },
      { label: "Floor Heating", value: "Zoned Touchscreen" },
      { label: "Finish Level", value: "Ultra-Prime" },
      { label: "Deflection", value: "Zero Tolerance" }
    ],
    scope: [
      "Complete Schluter wetroom tanking system",
      "Continuous concealed floor drainage channel",
      "Bespoke matte navy wall-hung vanity with brushed gold taps",
      "Backlit anti-fog architectural mirror with warm ambient LEDs",
      "Fluted freestanding stone soaking bathtub"
    ]
  }
];

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: "Residential" | "Commercial" | "Conversion" | "Refurbishment";
  timeline: string;
  avgCostLondon: string;
  features: string[];
  stages: { title: string; desc: string }[];
  deliverables: string[];
  image: string;
  quotePrompt: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: "house-refurbishment",
    title: "Full House Refurbishment",
    shortDesc: "Complete interior and structural renovation of London townhouses and apartments, combining heritage preservation with contemporary luxury.",
    fullDesc: "Prime Builds provides comprehensive end-to-end refurbishment services across London. We strip properties down to their structural core and rebuild them with superior acoustic insulation, bespoke architectural joinery, high-efficiency MEP engineering, and immaculate finishing.",
    category: "Refurbishment",
    timeline: "12 – 24 Weeks",
    avgCostLondon: "From £1,800 / m²",
    features: [
      "Full structural re-engineering and RSJ steel beam installation",
      "Subfloor heating and acoustic dampening systems",
      "Full rewiring, smart home lighting and climate integration",
      "Bespoke Italian plastering and architectural mouldings",
      "10-Year Prime Builds structural guarantee"
    ],
    stages: [
      { title: "Strip-Out & Structural Survey", desc: "Precision structural review, hazardous material removal, and load-bearing assessment." },
      { title: "First Fix Engineering", desc: "Complete installation of new electrical circuits, plumbing, gas mains, and underfloor pipework." },
      { title: "Interior Architecture", desc: "Drylining, acoustic insulation, microcement or plastering, and custom sub-frames." },
      { title: "Second Fix & Fine Finishes", desc: "Fitting fixtures, brassware, joinery, bespoke doors, and specialist surface coatings." }
    ],
    deliverables: ["Full Building Control Sign-Off", "NICEIC & Gas Safe Certificates", "10-Year Insurance Guarantee", "O&M Manual"],
    image: "/images/hero_london_residence.jpg",
    quotePrompt: "Request a structural feasibility audit for your London house refurbishment."
  },
  {
    id: "loft-conversion",
    title: "Loft & Attic Conversions",
    shortDesc: "Transform unused London roof spaces into master bedroom suites, light-flooded studies, or luxury en-suite sanctuaries.",
    fullDesc: "London lofts hold immense potential. We engineer bespoke Mansard, Dormer, Hip-to-Gable, and Velux conversions that maximize natural daylight, comply strictly with London borough planning constraints, and add up to 25% to your property value.",
    category: "Conversion",
    timeline: "6 – 10 Weeks",
    avgCostLondon: "From £48,000",
    features: [
      "Dormer, Mansard, Hip-to-Gable & Velux skylight designs",
      "Reinforced steel floor joists and structural calculations",
      "Bespoke timber staircases aligned with existing period architecture",
      "Integrated luxury ensuite wetrooms and dressing rooms",
      "Superior thermal insulation exceeding Part L London building regulations"
    ],
    stages: [
      { title: "Architectural Planning & Permitted Development", desc: "Drafting detailed architectural elevations and securing Lawful Development Certificates." },
      { title: "Structural Steel Frame Installation", desc: "Craning steel beams into place to reinforce floor spans without disturbing lower storeys." },
      { title: "Roof Alteration & Glazing", desc: "Erecting dormer frames, installing high-spec Velux skylights, and weatherproofing." },
      { title: "Insulation & Fit-Out", desc: "Multi-foil insulation, acoustic boarding, master suite plumbing, and bespoke wardrobes." }
    ],
    deliverables: ["Structural Engineer Calculations", "Party Wall Agreement Assistance", "Building Control Completion Notice", "10-Year Guarantee"],
    image: "/images/london_loft_conversion.jpg",
    quotePrompt: "Get an instant calculation on permitted development and loft feasibility."
  },
  {
    id: "home-extensions",
    title: "Architectural Extensions",
    shortDesc: "Single, double-storey, side-return, and wrap-around extensions engineered to unlock expansive open-plan London living.",
    fullDesc: "Expand your ground-floor living footprint with bespoke architectural glass extensions. We seamlessly blend historic Victorian, Edwardian, and Georgian brickwork with modern Crittall glazing, seamless level thresholds, and panoramic roof lanterns.",
    category: "Residential",
    timeline: "10 – 18 Weeks",
    avgCostLondon: "From £2,400 / m²",
    features: [
      "Side return, rear extension and wrap-around structural configurations",
      "Thermally broken Crittall-style doors and frameless glass rooflights",
      "Seamless flush indoor-outdoor threshold integration",
      "Deep reinforced trench and piled foundations for London clay subsoils",
      "Full planning permission and Thames Water build-over approval management"
    ],
    stages: [
      { title: "Substructure & Excavation", desc: "Piling, groundworks, concrete slab pouring, and drainage rerouting." },
      { title: "Structural Steel Superstructure", desc: "Erecting goalpost steels to support the rear of the property safely." },
      { title: "Envelope Weatherproofing", desc: "Matching London stock brickwork, installing structural glazing and flat roof membranes." },
      { title: "Internal Unification", desc: "Knocking through existing walls to create unified light-filled living zones." }
    ],
    deliverables: ["Thames Water Build-Over Agreement", "Structural Calculations Package", "Approved Inspector Sign-Off", "10-Year Warranty"],
    image: "/images/london_kitchen_extension.jpg",
    quotePrompt: "Schedule an on-site extension assessment for your London home."
  },
  {
    id: "kitchen-renovation",
    title: "Bespoke Kitchen Renovation",
    shortDesc: "Custom-crafted architectural kitchens, marble waterfall islands, integrated luxury appliances, and precision joinery.",
    fullDesc: "The kitchen is the architectural centerpiece of every London home. Prime Builds collaborates with premier European stone fabricators and UK master cabinetmakers to build kitchens that marry culinary performance with clean aesthetic sophistication.",
    category: "Residential",
    timeline: "4 – 8 Weeks",
    avgCostLondon: "From £25,000",
    features: [
      "Custom fluted and hand-painted bespoke cabinetry",
      "Bookmatched Calacatta and Quartzite waterfall stone islands",
      "Concealed architectural pantry doors and breakfast stations",
      "Integrated smart appliances (Miele, Gaggenau, Bora induction hobs)",
      "Recessed architectural cove lighting and under-cabinet LED tracks"
    ],
    stages: [
      { title: "Layout & Ergonomic Design", desc: "3D CAD spatial visualization, appliance specification, and work-triangle planning." },
      { title: "Services First Fix", desc: "Dedicated high-amp electrical runs, water filtration lines, and exterior extraction." },
      { title: "Cabinetry Installation", desc: "Precision scribing and alignment of custom solid wood carcass and door fronts." },
      { title: "Worktop Templating & Fitting", desc: "Laser templating and seamless CNC fabrication of luxury stone worktops." }
    ],
    deliverables: ["Appliance Manufacturer Guarantees", "Gas & Electrical Sign-Off", "Stone Care Kit", "Prime Builds Craft Warranty"],
    image: "/images/london_kitchen_extension.jpg",
    quotePrompt: "Design your luxury kitchen layout with our London interior architects."
  },
  {
    id: "luxury-bathrooms",
    title: "Luxury Bathrooms & Wetrooms",
    shortDesc: "Spa-grade wetrooms, walk-in rainfall enclosures, bespoke vanity units, and Italian porcelain craftsmanship.",
    fullDesc: "We transform London bathrooms into restorative private sanctuaries. Using premium tanking waterproofing membranes, flush concealed linear drains, wall-hung sanitaryware, and brushed brass or matt black thermostatic fixtures.",
    category: "Residential",
    timeline: "3 – 6 Weeks",
    avgCostLondon: "From £15,000",
    features: [
      "100% waterproof Schluter tanking membrane barrier guarantee",
      "Continuous large-format porcelain and bookmatched marble slab tiling",
      "Flush concealed linear drains for curbless zero-threshold walk-in showers",
      "Thermostatic rainfall shower systems and dual thermostatic valves",
      "Concealed underfloor heating with digital programmable touchscreens"
    ],
    stages: [
      { title: "Substrate Preparation", desc: "Complete strip, floor reinforcement, and structural damp-proofing." },
      { title: "Tanking & Wetroom Formation", desc: "Schluter waterproofing membrane application and gradient floor screeding." },
      { title: "Precision Tiling & Mitred Edges", desc: "Laser-aligned tile layout, 45-degree mitred external corners, and epoxy grouting." },
      { title: "Sanitaryware Commissioning", desc: "Fitting concealed cisterns, floating basins, illuminated mirrors, and brassware." }
    ],
    deliverables: ["Watertight Tanking Certificate", "Electrical Part P Certificate", "2-Year Workmanship Guarantee"],
    image: "/images/london_luxury_bathroom.jpg",
    quotePrompt: "Consult with our bathroom refurbishment team for a bespoke layout."
  },
  {
    id: "commercial-fitouts",
    title: "Commercial Fit-Outs & Refurbishment",
    shortDesc: "High-spec commercial transformations for prime London offices, boutique retail, showrooms, and hospitality venues.",
    fullDesc: "From Mayfair boutique showrooms to dynamic tech offices in Shoreditch and City of London headquarters, Prime Builds delivers turnkey Category A and Category B commercial fit-outs with strict adherence to tight business timelines and minimum operational downtime.",
    category: "Commercial",
    timeline: "6 – 16 Weeks",
    avgCostLondon: "From £850 / m²",
    features: [
      "Turnkey Cat A & Cat B commercial office and retail fit-outs",
      "Acoustic glass partitioning, crittall meeting pods, and boardroom suites",
      "Full HVAC, mechanical ventilation, and fresh-air heat recovery systems",
      "Data cabling, server room installations, and access control infrastructure",
      "Out-of-hours and weekend phased working to minimize commercial disruption"
    ],
    stages: [
      { title: "Space Planning & CDM Compliance", desc: "Workplace flow analysis, building management approvals, and Health & Safety filing." },
      { title: "Demolition & Structural Alteration", desc: "Clearing existing tenancies and installing new partition frameworks." },
      { title: "M&E Commercial Services", desc: "Installing commercial ventilation, power distribution boards, and fire safety systems." },
      { title: "Architectural Fit & Branding", desc: "Bespoke reception desks, acoustic wall finishes, commercial flooring, and sign-off." }
    ],
    deliverables: ["CDM 2015 Safety File", "Fire Strategy Sign-Off", "Building Control Certification", "Fast-Track Handover"],
    image: "/images/london_commercial_fitout.jpg",
    quotePrompt: "Request a commercial workplace feasibility audit and tender estimate."
  },
  {
    id: "property-maintenance",
    title: "Structural Repairs & Maintenance",
    shortDesc: "Responsive structural repairs, period facade restoration, underpinning, and scheduled maintenance for London estates.",
    fullDesc: "London's distinctive building fabric demands deep structural knowledge. We provide structural crack stitching, underpinning, timber rot restoration, brick repointing with traditional lime mortar, and ongoing preventive maintenance for premium residential estates.",
    category: "Residential",
    timeline: "Ongoing / 1 – 4 Weeks",
    avgCostLondon: "Custom Tender",
    features: [
      "Helical crack stitching and structural masonry stabilization",
      "Traditional London lime mortar repointing and brick tinting",
      "Roofing repairs, lead flashing replacements, and guttering overhauls",
      "Dry rot, wet rot, and rising damp rectification",
      "Annual preventive property health audits for London landlords and estates"
    ],
    stages: [
      { title: "Diagnostic Survey", desc: "Thermal imaging, moisture meters, and structural movement analysis." },
      { title: "Engineered Remediation Plan", desc: "Producing structural engineer-approved method statements." },
      { title: "Execution", desc: "Applying structural ties, underpinning, or lime mortar detailing." },
      { title: "Certification", desc: "Issuing formal structural warranty certificates." }
    ],
    deliverables: ["Structural Engineer Sign-Off", "Masonry Stabilization Certificate", "Preventive Maintenance Schedule"],
    image: "/images/hero_london_residence.jpg",
    quotePrompt: "Book a structural inspection or maintenance audit."
  },
  {
    id: "painting-decorating",
    title: "Architectural Painting & Fine Finishes",
    shortDesc: "Flawless airless spray application, specialist Italian microcement, Venetian plastering, and heritage London decorating.",
    fullDesc: "The difference between good and exceptional construction lies in the surface finish. Our master decorators specialize in high-pressure airless spray painting for factory-smooth joinery, Italian Venetian polished plaster, microcement seamless floors, and hand-applied designer wallpapers.",
    category: "Refurbishment",
    timeline: "1 – 3 Weeks",
    avgCostLondon: "From £35 / m²",
    features: [
      "Dust-free Festool sanding and meticulous wall preparation",
      "Airless spray painting for mirrorsmooth woodwork and cabinetry",
      "Specialist polished Venetian plaster and textured microcement",
      "Heritage colour matching (Farrow & Ball, Little Greene, Paint & Paper Library)",
      "Protective exterior weather-resistant micro-porous coatings"
    ],
    stages: [
      { title: "Surface Preparation", desc: "Meticulous skimming, dust-free sanding, filling, and stain-blocking primer application." },
      { title: "Undercoating", desc: "Spraying or rolling high-build undercoats to achieve uniform density." },
      { title: "Fine Finishing", desc: "Applying topcoats with precision edge cutting and zero roller stipple." },
      { title: "Final Inspection", desc: "High-intensity spotlight snagging review to guarantee absolute perfection." }
    ],
    deliverables: ["Touch-Up Paint Archive", "Substrate Preparation Guarantee", "Complete Protection of Flooring & Furnishings"],
    image: "/images/london_kitchen_extension.jpg",
    quotePrompt: "Request an estimate for premium London decorating."
  }
];

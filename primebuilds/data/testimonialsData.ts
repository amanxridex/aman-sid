export interface TestimonialItem {
  id: string;
  clientName: string;
  projectType: string;
  borough: string;
  score: string;
  quote: string;
  detail: string;
  completionDate: string;
  verified: boolean;
}

export const testimonialsData: TestimonialItem[] = [
  {
    id: "test-1",
    clientName: "David & Eleanor M.",
    projectType: "Full House Refurbishment & Rear Extension",
    borough: "Chelsea, London",
    score: "9.9 / 10",
    quote: "The team at Prime Builds were a genuine pleasure to work with. From the initial structural engineer survey to the final kitchen fitting, their attention to detail and transparency on costings was faultless.",
    detail: "Full overhaul of a 4-storey Chelsea Victorian townhouse including basement stabilization and bespoke Crittall extension. Delivered 5 days ahead of schedule.",
    completionDate: "London, Recent Completion",
    verified: true
  },
  {
    id: "test-2",
    clientName: "Marcus Sterling (MD, Sterling Capital)",
    projectType: "Commercial Office Fit-Out & Boardroom",
    borough: "Mayfair, London",
    score: "10 / 10",
    quote: "I wanted to pass on my sincere appreciation for the hard work and team spirit Prime Builds brought to our Mayfair headquarters. The project was completed on an aggressive timeline without disrupting our daily operations.",
    detail: "Cat B commercial fitout covering 4,500 sq ft, acoustic meeting suites, custom timber wall panelling and high-spec mechanical services.",
    completionDate: "London, Recent Completion",
    verified: true
  },
  {
    id: "test-3",
    clientName: "Sophia & Julian K.",
    projectType: "Mansard Loft Conversion & Wetroom",
    borough: "Regents Park, London",
    score: "9.8 / 10",
    quote: "We were thrilled with the loft conversion. You can really tell these guys specialize in London properties and know how to work within strict council planning constraints. We have already recommended them to our neighbors.",
    detail: "Full Mansard structural conversion with exposed oak rafters, triple Velux rooflights, and luxury master en-suite wetroom.",
    completionDate: "London, Recent Completion",
    verified: true
  },
  {
    id: "test-4",
    clientName: "Camilla H.",
    projectType: "Architectural Kitchen & Living Overhaul",
    borough: "Camden, London",
    score: "10 / 10",
    quote: "Prime Builds worked seamlessly alongside our architect, providing highly qualified workmanship and adding genuine value to our property. Their on-site communication and cleanliness was exemplary.",
    detail: "Side-return structural opening with continuous marble waterfall island and integrated smart home heating controls.",
    completionDate: "London, Recent Completion",
    verified: true
  }
];

export const londonBoroughs = [
  { name: "Chelsea & Kensington", projects: "42+ Projects Completed", code: "SW3 / SW7 / W8" },
  { name: "Regents Park & Marylebone", projects: "28+ Projects Completed", code: "NW1 / W1" },
  { name: "Camden Town & Primrose Hill", projects: "35+ Projects Completed", code: "NW1 / NW3" },
  { name: "Mayfair & Westminster", projects: "31+ Projects Completed", code: "W1 / SW1" },
  { name: "Hampstead & Highgate", projects: "26+ Projects Completed", code: "NW3 / N6" },
  { name: "Islington & Clerkenwell", projects: "29+ Projects Completed", code: "N1 / EC1" },
  { name: "Richmond & Barnes", projects: "22+ Projects Completed", code: "TW9 / SW13" },
  { name: "Wandsworth & Battersea", projects: "38+ Projects Completed", code: "SW11 / SW18" }
];

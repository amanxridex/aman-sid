// HouseHunt Master Real Estate Dataset & Offline-First Data Engine
// Designed for high visual fidelity, realistic NCR market data, and 100% resilient offline demos.

(function () {
    const rawProperties = [
        // ================= APARTMENTS (BUY & RENT) =================
        {
            id: 1,
            title: "Godrej Woods 3 BHK Luxury Residence",
            property_type: "Apartment",
            type: "Apartment",
            intent: "Buy",
            price: 18500000,
            city: "Noida",
            location: "Sector 43, Noida",
            location_text: "Sector 43, Central Noida, Uttar Pradesh",
            status: "approved",
            tag: "Verified",
            images: [
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                bhk: "3 BHK",
                beds: 3,
                bedrooms: 3,
                bath: 3,
                bathrooms: 3,
                area: 2085,
                carpet_area: 1650,
                built_up: 2085,
                floor: 14,
                total_floors: 34,
                facing: "North-East",
                furnishing: "Semi-Furnished",
                gated: true,
                society: "Godrej Woods",
                parking: "2 Covered",
                power: "100% Backup",
                possession: "Ready to Move",
                rera: "UPRERAPRJ7047",
                loan_approved: true,
                clubhouse: true,
                pool: true,
                gym: true,
                maintenance: "₹ 4,500/mo"
            },
            description: "An urban forest sanctuary featuring 1,100+ native trees, heated indoor pool, sky lounge, and modular Italian kitchen. Prime connectivity to Noida-Greater Noida Expressway and Botanical Garden Metro.",
            owner_id: "dev-godrej",
            owner_name: "Godrej Properties Sales",
            owner_role: "Developer Partner",
            owner_phone: "+91 98112 34567",
            owner_email: "sales@godrejproperties.com"
        },
        {
            id: 2,
            title: "DLF The Crest 4 BHK Ultra Luxury",
            property_type: "Apartment",
            type: "Apartment",
            intent: "Buy",
            price: 64000000,
            city: "Gurgaon",
            location: "DLF Phase 5, Gurgaon",
            location_text: "Park Drive, DLF Phase 5, Golf Course Road, Gurgaon",
            status: "approved",
            tag: "Exclusive",
            images: [
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                bhk: "4 BHK",
                beds: 4,
                bedrooms: 4,
                bath: 5,
                bathrooms: 5,
                area: 3500,
                carpet_area: 2850,
                built_up: 3500,
                floor: 18,
                total_floors: 36,
                facing: "East",
                furnishing: "Fully Furnished",
                gated: true,
                society: "DLF The Crest",
                parking: "3 Dedicated Covered",
                power: "24x7 Full Backup",
                possession: "Ready to Move",
                rera: "HRERA-48/2017",
                loan_approved: true,
                servant: true,
                clubhouse: true,
                pool: true,
                theatre: true
            },
            description: "World-class architecture designed by Hafeez Contractor with interior design by Richmond International. Panoramic views of DLF Golf Course, high-speed elevators, and climate-controlled VRV air-conditioning.",
            owner_id: "dev-dlf",
            owner_name: "DLF Luxury Homes",
            owner_role: "Direct Developer",
            owner_phone: "+91 99990 88880",
            owner_email: "crest@dlf.in"
        },
        {
            id: 3,
            title: "ATS Pristine 3 BHK Garden View Flat",
            property_type: "Apartment",
            type: "Apartment",
            intent: "Rent",
            price: 42000,
            city: "Noida",
            location: "Sector 150, Noida",
            location_text: "Sector 150, Sports City, Noida Expressway",
            status: "approved",
            tag: "Verified",
            images: [
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                bhk: "3 BHK",
                beds: 3,
                bedrooms: 3,
                bath: 3,
                bathrooms: 3,
                area: 1750,
                carpet_area: 1390,
                built_up: 1750,
                floor: 7,
                total_floors: 22,
                facing: "North-East",
                furnishing: "Semi-Furnished",
                gated: true,
                society: "ATS Pristine",
                parking: "1 Covered",
                deposit: "₹ 84,000",
                maintenance: "Included",
                tenant_pref: "Family / Working Professionals",
                avail_date: "Immediate"
            },
            description: "Corner 3 BHK with unobstructed greenery views overlooking the low-density green belt of Sector 150. Wood finish wardrobes, modular kitchen with chimney, and 3 spacious balconies.",
            owner_id: "owner-sharma",
            owner_name: "Pooja Sharma",
            owner_role: "Property Owner",
            owner_phone: "+91 98101 22334",
            owner_email: "pooja.sharma@gmail.com"
        },
        {
            id: 4,
            title: "2 BHK Smart Home near Cyber City",
            property_type: "Apartment",
            type: "Apartment",
            intent: "Rent",
            price: 32000,
            city: "Gurgaon",
            location: "Sector 24, Gurgaon",
            location_text: "Near DLF Cyber Hub, Sector 24, Gurgaon",
            status: "approved",
            tag: "New Launch",
            images: [
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                bhk: "2 BHK",
                beds: 2,
                bedrooms: 2,
                bath: 2,
                bathrooms: 2,
                area: 1200,
                carpet_area: 980,
                built_up: 1200,
                floor: 5,
                total_floors: 14,
                facing: "North",
                furnishing: "Fully Furnished",
                gated: true,
                society: "Ambience Greens",
                parking: "1 Covered",
                deposit: "₹ 64,000",
                maintenance: "₹ 2,800/mo",
                tenant_pref: "Bachelors or Families",
                avail_date: "Immediate"
            },
            description: "Walking distance to Rapid Metro and Cyber City office parks. Fully furnished with smart TV, sofa set, double beds, AC in all rooms, refrigerator, and RO water system.",
            owner_id: "owner-verma",
            owner_name: "Amit Verma",
            owner_role: "Property Owner",
            owner_phone: "+91 98734 56123",
            owner_email: "amit.verma@outlook.com"
        },
        {
            id: 5,
            title: "Mahagun Moderne 3 BHK + Servant Room",
            property_type: "Apartment",
            type: "Apartment",
            intent: "Buy",
            price: 13500000,
            city: "Noida",
            location: "Sector 78, Noida",
            location_text: "Sector 78, Central Noida Metro Belt",
            status: "approved",
            tag: "Verified",
            images: [
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                bhk: "3 BHK",
                beds: 3,
                bedrooms: 3,
                bath: 3,
                bathrooms: 3,
                area: 1850,
                carpet_area: 1450,
                built_up: 1850,
                floor: 9,
                total_floors: 26,
                facing: "North-East",
                furnishing: "Semi-Furnished",
                gated: true,
                society: "Mahagun Moderne",
                parking: "1 Reserved Basement",
                possession: "Ready to Move",
                rera: "UPRERA-1944",
                loan_approved: true,
                servant: true
            },
            description: "Directly opposite Sector 76 Metro Station. Features huge central park, Olympic size pool, modern clubhouse, grocery stores on site, and 3-tier electronic security.",
            owner_id: "owner-gupta",
            owner_name: "Rajesh Gupta",
            owner_role: "Direct Owner",
            owner_phone: "+91 98111 90812",
            owner_email: "rajesh.gupta@gmail.com"
        },
        {
            id: 6,
            title: "Vasant Kunj DDA SFS Flats 2 BHK",
            property_type: "Apartment",
            type: "Apartment",
            intent: "Rent",
            price: 38000,
            city: "Delhi",
            location: "Vasant Kunj, Delhi",
            location_text: "Sector D, Pocket 2, Vasant Kunj, South Delhi",
            status: "approved",
            tag: "Verified",
            images: [
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                bhk: "2 BHK",
                beds: 2,
                bedrooms: 2,
                bath: 2,
                bathrooms: 2,
                area: 1100,
                carpet_area: 920,
                built_up: 1100,
                floor: 2,
                total_floors: 4,
                facing: "South-East",
                furnishing: "Semi-Furnished",
                gated: true,
                society: "DDA SFS Pocket 2",
                parking: "Open Society Parking",
                deposit: "₹ 76,000",
                maintenance: "₹ 1,500/mo",
                tenant_pref: "Family / Embassy / Corporates"
            },
            description: "Surrounded by lush Sanjay Van greens and seconds from DLF Promenade and Ambience Mall. Peaceful residential enclave with round-the-clock water and private security guards.",
            owner_id: "owner-khanna",
            owner_name: "Sunil Khanna",
            owner_role: "Direct Owner",
            owner_phone: "+91 98100 45678",
            owner_email: "sunil.khanna@delhi.gov.in"
        },

        // ================= LUXURY VILLAS =================
        {
            id: 7,
            title: "Jaypee Greens Pavilion 4 BHK Grand Villa",
            property_type: "Villa",
            type: "Villa",
            intent: "Buy",
            price: 52000000,
            city: "Greater Noida",
            location: "Jaypee Greens, Greater Noida",
            location_text: "Jaypee Greens Golf Course, Pari Chowk, Greater Noida",
            status: "approved",
            tag: "Featured",
            images: [
                "https://images.unsplash.com/photo-1580587767513-399888175bb9?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                bhk: "4 BHK",
                beds: 4,
                bedrooms: 4,
                bath: 5,
                bathrooms: 5,
                area: 4800,
                carpet_area: 4100,
                plot_area: "450 Sq.Yd",
                floor: "G+2",
                total_floors: 3,
                facing: "North-East",
                furnishing: "Fully Furnished",
                gated: true,
                society: "Jaypee Greens Golf Course",
                parking: "3 Cars Inside Portico",
                pool: true,
                garden: true,
                servant: true,
                theatre: true,
                possession: "Ready to Move",
                rera: "UPRERA-0012",
                loan_approved: true
            },
            description: "Signature Greg Norman championship golf-course facing villa. Private landscaped lawn, infinity plunge pool, double-height Italian marble foyer, and smart home automation system.",
            owner_id: "dev-jaypee",
            owner_name: "Premier Estates Luxury Desk",
            owner_role: "Authorized Channel Partner",
            owner_phone: "+91 97111 88822",
            owner_email: "villas@premierestates.in"
        },
        {
            id: 8,
            title: "Sobha International City 5 BHK Presidential Villa",
            property_type: "Villa",
            type: "Villa",
            intent: "Buy",
            price: 78000000,
            city: "Gurgaon",
            location: "Sector 109, Gurgaon",
            location_text: "Dwarka Expressway, Sector 109, Gurgaon",
            status: "approved",
            tag: "Exclusive",
            images: [
                "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                bhk: "5 BHK",
                beds: 5,
                bedrooms: 5,
                bath: 6,
                bathrooms: 6,
                area: 5600,
                carpet_area: 4900,
                plot_area: "500 Sq.Yd",
                floor: "G+2 with Private Lift",
                total_floors: 3,
                facing: "East",
                furnishing: "Semi-Furnished",
                gated: true,
                society: "Sobha International City",
                parking: "4 Covered Garage",
                pool: true,
                gym: true,
                servant: true,
                possession: "Ready to Move",
                rera: "HRERA-109/2018",
                loan_approved: true
            },
            description: "Unmatched construction precision by Sobha. Features private OTIS glass elevator, rooftop terrace garden with BBQ setup, Italian bathroom fixtures, and solar backup power.",
            owner_id: "dev-sobha",
            owner_name: "Sobha Realty Direct",
            owner_role: "Developer Representative",
            owner_phone: "+91 99100 77123",
            owner_email: "sales@sobha-ncr.com"
        },
        {
            id: 9,
            title: "Prateek Edifice Spanish Villa 4 BHK",
            property_type: "Villa",
            type: "Villa",
            intent: "Rent",
            price: 85000,
            city: "Noida",
            location: "Sector 107, Noida",
            location_text: "Sector 107, Noida Expressway Link",
            status: "approved",
            tag: "Verified",
            images: [
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1580587767513-399888175bb9?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                bhk: "4 BHK",
                beds: 4,
                bedrooms: 4,
                bath: 4,
                bathrooms: 4,
                area: 3600,
                carpet_area: 2950,
                plot_area: "300 Sq.Yd",
                floor: "Duplex G+1",
                total_floors: 2,
                facing: "North",
                furnishing: "Fully Furnished",
                gated: true,
                society: "Prateek Edifice Villas",
                parking: "2 Covered",
                deposit: "₹ 1,70,000",
                maintenance: "₹ 5,000/mo",
                tenant_pref: "Expat / Corporate CXO",
                avail_date: "Within 15 Days"
            },
            description: "Spanish architecture duplex villa with private courtyard, imported Italian leather furniture, Bosch kitchen appliances, and direct access to clubhouse and tennis court.",
            owner_id: "owner-anand",
            owner_name: "Col. Vivek Anand (Retd)",
            owner_role: "Property Owner",
            owner_phone: "+91 98188 12345",
            owner_email: "col.anand@yahoo.co.in"
        },

        // ================= INDEPENDENT HOUSES & BUILDER FLOORS =================
        {
            id: 10,
            title: "South Extension II Luxury Builder Floor 3 BHK",
            property_type: "Independent House",
            type: "Independent House",
            intent: "Buy",
            price: 37500000,
            city: "Delhi",
            location: "South Ext, Delhi",
            location_text: "South Extension Part 2, New Delhi",
            status: "approved",
            tag: "Verified",
            images: [
                "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                bhk: "3 BHK",
                beds: 3,
                bedrooms: 3,
                bath: 3,
                bathrooms: 3,
                area: 2250,
                carpet_area: 1850,
                built_up: 2250,
                floor: "Second Floor with Stilt Lift",
                total_floors: 4,
                facing: "North-East",
                furnishing: "Semi-Furnished",
                gated: true,
                parking: "2 Reserved Stilt Slots",
                power: "Dedicated Inverter + Generator Line",
                possession: "Ready to Move",
                registry: "Freehold Clean Title",
                loan_approved: true,
                servant: true
            },
            description: "A-grade construction builder floor built on 300 sq. yard plot in prime South Delhi. Stilt car parking with private elevator, Italian marble flooring, and Kohler sensory sanitary fittings.",
            owner_id: "builder-delhi",
            owner_name: "Malhotra Builders & Developers",
            owner_role: "Direct Builder",
            owner_phone: "+91 98110 54321",
            owner_email: "malhotra.floors@gmail.com"
        },
        {
            id: 11,
            title: "DLF Phase 3 Gated Independent Floor 3 BHK",
            property_type: "Independent House",
            type: "Independent House",
            intent: "Rent",
            price: 55000,
            city: "Gurgaon",
            location: "DLF Phase 3, Gurgaon",
            location_text: "U Block, DLF Phase 3, Near Moulsari Avenue Metro, Gurgaon",
            status: "approved",
            tag: "New Launch",
            images: [
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                bhk: "3 BHK",
                beds: 3,
                bedrooms: 3,
                bath: 3,
                bathrooms: 3,
                area: 1950,
                carpet_area: 1550,
                built_up: 1950,
                floor: 1,
                total_floors: 4,
                facing: "East",
                furnishing: "Fully Furnished",
                gated: true,
                parking: "1 Reserved Car Stilt",
                deposit: "₹ 1,10,000",
                maintenance: "₹ 2,000/mo",
                tenant_pref: "MNC Executives & Families"
            },
            description: "Walking distance to Cyber City and Ambience Mall. Equipped with 4 split ACs, refrigerator, washing machine, modular wardrobes, and high-speed fiber internet ready.",
            owner_id: "owner-kapoor",
            owner_name: "Rohit Kapoor",
            owner_role: "Property Owner",
            owner_phone: "+91 98105 67890",
            owner_email: "rohit.kapoor@techcorp.com"
        },
        {
            id: 12,
            title: "Sector 15 Noida Independent Kothi 4 BHK",
            property_type: "Independent House",
            type: "Independent House",
            intent: "Buy",
            price: 28500000,
            city: "Noida",
            location: "Sector 15, Noida",
            location_text: "A Block, Sector 15, Close to Noida Metro",
            status: "approved",
            tag: "Verified",
            images: [
                "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                bhk: "4 BHK",
                beds: 4,
                bedrooms: 4,
                bath: 4,
                bathrooms: 4,
                area: 2700,
                carpet_area: 2200,
                plot_area: "200 Sq.Mtr",
                floor: "G+1 Independent Kothi",
                total_floors: 2,
                facing: "North-West",
                furnishing: "Semi-Furnished",
                gated: true,
                parking: "2 Inside Gate + 2 Outside",
                possession: "Ready to Move",
                registry: "Noida Authority Leasehold Clean",
                loan_approved: true
            },
            description: "Centrally located independent kothi 2 minutes from Delhi-Noida border. Front garden, wide 18-meter road, private terrace with gazebo, and robust earthquake-resistant structure.",
            owner_id: "owner-bhatia",
            owner_name: "Dr. Alok Bhatia",
            owner_role: "Direct Owner",
            owner_phone: "+91 98114 99001",
            owner_email: "dralokbhatia@gmail.com"
        },

        // ================= COMMERCIAL PROPERTIES =================
        {
            id: 13,
            title: "Cyber City Horizon Grade-A Corporate Office",
            property_type: "Commercial",
            type: "Commercial Office",
            intent: "Rent",
            price: 185000,
            city: "Gurgaon",
            location: "Cyber City, Gurgaon",
            location_text: "DLF Cyber City, Sector 25A, Gurgaon",
            status: "approved",
            tag: "Verified",
            images: [
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                area: 2500,
                carpet_area: 2050,
                built_up: 2500,
                floor: 6,
                total_floors: 16,
                furnishing: "Fully Furnished Plug & Play",
                washrooms: "2 Private + Executive Restroom",
                power: "50 kW 100% DG Backup",
                parking: "4 Reserved Basement",
                deposit: "6 Months Rent",
                lease_duration: "3 to 5 Years",
                suitable: "IT/Fintech / Corporate HQ",
                fire: "NFPA Certified Compliant"
            },
            description: "Plug & play 45 workstation office setup with 2 executive cabins, 12-seater conference room with video wall, server room, and modern cafeteria pantry.",
            owner_id: "comm-horizon",
            owner_name: "Horizon Commercial Realty",
            owner_role: "Commercial Brokerage",
            owner_phone: "+91 99991 23456",
            owner_email: "leasing@horizonrealty.com"
        },
        {
            id: 14,
            title: "Sector 62 IT Park Commercial Office Space",
            property_type: "Commercial",
            type: "Commercial Office",
            intent: "Buy",
            price: 24000000,
            city: "Noida",
            location: "Sector 62, Noida",
            location_text: "C-Block IT Zone, Sector 62, Noida",
            status: "approved",
            tag: "Verified",
            images: [
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                area: 3200,
                carpet_area: 2600,
                built_up: 3200,
                floor: 4,
                total_floors: 11,
                furnishing: "Bare Shell with Central AC",
                power: "60 kW DG Backup",
                parking: "5 Dedicated Bays",
                possession: "Immediate",
                roi: "8.5% Expected Yield",
                loan_approved: true
            },
            description: "Grade-A institutional IT building with LEED Gold certification. High rental yield asset pre-approved for IT/ITES and corporate office usage.",
            owner_id: "dev-ats",
            owner_name: "ATS Commercial Spaces",
            owner_role: "Direct Developer",
            owner_phone: "+91 98118 77733",
            owner_email: "corporate@atsgreens.com"
        },
        {
            id: 15,
            title: "High-Street Retail Showroom on Main Road",
            property_type: "Commercial",
            type: "Showroom",
            intent: "Rent",
            price: 95000,
            city: "Noida",
            location: "Sector 18, Noida",
            location_text: "Sector 18 Market, Atta Market Hub, Noida",
            status: "approved",
            tag: "Exclusive",
            images: [
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                area: 1250,
                carpet_area: 1100,
                built_up: 1250,
                floor: "Ground Floor Main Road Frontage",
                total_floors: 3,
                furnishing: "Fitted Glass Frontage",
                parking: "Common Market Plaza",
                deposit: "4 Months Rent",
                suitable: "Jewelry, Apparel, Electronics Brand Store",
                fire: "Compliant"
            },
            description: "Unbeatable footfall in Noida's premier retail district. 25-feet glass facade facing the main central boulevard, high ceiling, and 3-phase commercial electrical line.",
            owner_id: "owner-jain",
            owner_name: "Suresh Jain & Sons",
            owner_role: "Property Owner",
            owner_phone: "+91 98102 33445",
            owner_email: "jainretail18@gmail.com"
        },

        // ================= PLOTS & LAND =================
        {
            id: 16,
            title: "Gated Residential Villa Plot Sector 150",
            property_type: "Plot",
            type: "Plot",
            intent: "Buy",
            price: 21500000,
            city: "Noida",
            location: "Sector 150, Noida",
            location_text: "Shaheed Bhagat Singh Park Road, Sector 150, Noida",
            status: "approved",
            tag: "Verified",
            images: [
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                plot_area: "250 Sq.Yd",
                area: "2250 Sqft",
                plot_type: "Freehold Gated Township",
                facing: "North-East Corner",
                road: "18 Meters Wide Blacktop",
                boundary: "Constructed Boundary Wall with Gate",
                authority: "Noida Authority Approved",
                title_clear: true,
                registry: "Instant Registry & Mutation",
                loan_approved: "HDFC, SBI, ICICI Bank Approved",
                gated: true
            },
            description: "Rare residential corner plot in Sector 150 with complete underground electrical, sewage, and fiber optic infrastructure. Permissible construction: Basement + Stilt + 4 Floors.",
            owner_id: "land-noida",
            owner_name: "Aarambh Land Bank",
            owner_role: "Exclusive Brokerage",
            owner_phone: "+91 98180 11223",
            owner_email: "plots@aarambhrealty.com"
        },
        {
            id: 17,
            title: "Yamuna Expressway Industrial & Institutional Plot",
            property_type: "Plot",
            type: "Plot",
            intent: "Buy",
            price: 18000000,
            city: "Greater Noida",
            location: "Greater Noida West",
            location_text: "Sector 22D, Yamuna Expressway, Near Jewar Airport",
            status: "approved",
            tag: "New Launch",
            images: [
                "https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                plot_area: "500 Sq.Mtr",
                area: "5380 Sqft",
                plot_type: "YEIDA Allotted Freehold",
                facing: "East",
                road: "24 Meters Wide Arterial",
                boundary: "Demarcated Pillars",
                authority: "YEIDA Approved",
                title_clear: true,
                registry: "Allotment Letter Available",
                loan_approved: true
            },
            description: "High-potential capital growth plot situated 15 minutes from upcoming Noida International Airport (Jewar). Clear title with all development dues cleared with YEIDA.",
            owner_id: "owner-tiwari",
            owner_name: "Satish Tiwari",
            owner_role: "Direct Allottee",
            owner_phone: "+91 98108 44556",
            owner_email: "satish.tiwari@outlook.com"
        },
        {
            id: 18,
            title: "Golf Course Extension Gated Plot 300 Sq Yd",
            property_type: "Plot",
            type: "Plot",
            intent: "Buy",
            price: 45000000,
            city: "Gurgaon",
            location: "Sohna Road, Gurgaon",
            location_text: "Sector 65, Golf Course Extension Road, Gurgaon",
            status: "approved",
            tag: "Exclusive",
            images: [
                "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
            ],
            details: {
                plot_area: "300 Sq.Yd",
                area: "2700 Sqft",
                plot_type: "Gated Luxury Enclave",
                facing: "North",
                road: "12 Meter Paved Sector Road",
                boundary: "Gated Community Wall",
                authority: "DTCP Haryana Approved",
                title_clear: true,
                registry: "Freehold Registry",
                loan_approved: true,
                gated: true
            },
            description: "Prime residential plot within a gated township right off Golf Course Extension Road. Complete with club access, underground gas pipelines, and 24/7 armed security.",
            owner_id: "dev-m3m",
            owner_name: "M3M Luxury Land Desk",
            owner_role: "Developer Representative",
            owner_phone: "+91 99999 11224",
            owner_email: "land@m3m.com"
        }
    ];

    // Format prices cleanly for UI
    function formatPrice(p) {
        if (typeof p.price !== 'number') return p.price || 'Price on Request';
        if (p.intent === 'Rent') {
            return `₹ ${p.price.toLocaleString('en-IN')}/mo`;
        }
        const inCr = p.price / 10000000;
        if (inCr >= 1) return `₹ ${inCr.toFixed(2)} Cr`;
        return `₹ ${(p.price / 100000).toFixed(2)} L`;
    }

    // Standardize properties with all matching properties
    const formattedProperties = rawProperties.map(p => {
        const displayPrice = formatPrice(p);
        const mainImg = (p.images && p.images.length > 0) ? p.images[0] : 'assets/house.png';
        return {
            ...p,
            rawPrice: p.price,
            price: displayPrice,
            image: mainImg,
            // Fallback fields for legacy compatibility
            property_type: p.property_type || p.type,
            type: p.property_type || p.type,
            location: p.location || p.location_text || p.city,
            location_text: p.location_text || p.location || p.city,
            beds: p.details?.bhk || (p.details?.beds ? `${p.details.beds} BHK` : ''),
            area: p.details?.area ? `${p.details.area} sqft` : (p.details?.plot_area || '')
        };
    });

    // Top Developers dataset
    const topDevelopers = [
        {
            id: 1,
            name: "DLF Limited",
            short_code: "DLF",
            logo_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=200&q=80",
            experience: "75+ Years",
            projects: "150+ Delivered",
            link: "https://www.dlf.in"
        },
        {
            id: 2,
            name: "Godrej Properties",
            short_code: "GODREJ",
            logo_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80",
            experience: "32+ Years",
            projects: "90+ Delivered",
            link: "https://www.godrejproperties.com"
        },
        {
            id: 3,
            name: "Tata Housing",
            short_code: "TATA",
            logo_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80",
            experience: "40+ Years",
            projects: "70+ Delivered",
            link: "https://www.tatahousing.in"
        },
        {
            id: 4,
            name: "ATS Greens",
            short_code: "ATS",
            logo_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80",
            experience: "25+ Years",
            projects: "45+ Delivered",
            link: "https://www.atsgreens.com"
        },
        {
            id: 5,
            name: "Gaurs Group",
            short_code: "GAUR",
            logo_url: "https://images.unsplash.com/photo-1448630305452-114ad330c98e?auto=format&fit=crop&w=200&q=80",
            experience: "28+ Years",
            projects: "60+ Delivered",
            link: "https://www.gaursonsindia.com"
        },
        {
            id: 6,
            name: "M3M India",
            short_code: "M3M",
            logo_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80",
            experience: "15+ Years",
            projects: "50+ Delivered",
            link: "https://www.m3mindia.com"
        }
    ];

    // Expose globally to window
    window.propertyData = formattedProperties;
    window.developerData = topDevelopers;

    // Helper to get all combined properties (including any added dynamically in demo)
    window.getAllProperties = function () {
        try {
            const userProps = JSON.parse(localStorage.getItem('user_properties') || '[]');
            if (userProps && userProps.length > 0) {
                return [...userProps, ...formattedProperties];
            }
        } catch (e) {
            console.warn("Could not read local properties", e);
        }
        return formattedProperties;
    };

    // Helper to get single property by ID
    window.getPropertyById = function (id) {
        const all = window.getAllProperties();
        return all.find(p => String(p.id) === String(id));
    };

    console.log("HouseHunt Master Data Engine Loaded:", formattedProperties.length, "luxury properties ready.");
})();

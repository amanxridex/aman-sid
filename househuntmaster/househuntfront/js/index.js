const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://backend.househunt.live';

// Fetch helper with timeout to ensure UI never hangs on a slow/dead remote server
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 2500 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

let allData = [];
let currentIntent = 'Rent'; // Default tab

document.addEventListener('DOMContentLoaded', async () => {
    // Hide Splash Screen
    const splash = document.getElementById('appSplashScreen');
    if (splash) {
        setTimeout(() => {
            splash.style.opacity = '0';
            splash.style.visibility = 'hidden';
            setTimeout(() => splash.remove(), 600);
        }, 500);
    }

    // Show initial skeletons
    if (window.showSkeletons) {
        window.showSkeletons('featured-listings-container', 1);
        window.showSkeletons('near-you-container', 3);
        window.showSkeletons('top-listings-container', 3);
        window.showSkeletons('plots-container', 3);
    }

    // Load Properties & Developers
    await loadProperties();
    fetchAndRenderDevelopers();

    // Geolocation Logic
    setupLocationHeader();

    // User Profile / Auth Setup
    setupUserProfile();

    // Setup Category Navigation
    setupCategoryNavigation();

    // Setup Search & See-All Navigation
    setupSearchNavigation();

    // Setup Intent Tabs (Rent / Buy)
    setupIntentTabs();

    // Setup City Switcher
    setupCitySwitcher();

    // Setup Filter Bottom Sheet
    setupFilterSheet();

    if (window.lucide) {
        window.lucide.createIcons();
    }
});

// --- RENDER HELPERS ---
const renderSection = (containerId, items) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    
    if (!items || items.length === 0) {
        container.innerHTML = '<p style="padding: 15px; color: #64748b; font-size: 14px;">No properties found in this category.</p>';
        return;
    }

    items.forEach(prop => {
        const card = document.createElement('a');
        card.href = `html/property-view.html?id=${prop.id}`;
        card.style.textDecoration = 'none';
        
        const imgSrc = (prop.images && prop.images[0]) || prop.image || 'assets/house.png';
        const displayTag = prop.tag || (prop.intent === 'Rent' ? 'For Rent' : 'Verified');
        const displayTitle = prop.title || `${prop.beds ? prop.beds + ' ' : ''}${prop.type}`;

        card.innerHTML = `
            <div class="property-card">
                <img src="${imgSrc}" alt="${prop.type}" class="property-img" onerror="this.src='assets/house.png'; this.onerror=null;">
                <div class="tag">${displayTag}</div>
                <div class="property-details">
                    <div class="prop-price">${prop.price}</div>
                    <div class="prop-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${displayTitle}</div>
                    <div class="prop-loc"><i data-lucide="map-pin" style="width: 12px; height: 12px; display: inline; vertical-align: -1px;"></i> ${prop.location}</div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    if (window.lucide) window.lucide.createIcons();
};

const renderFeaturedSlider = (items) => {
    const container = document.getElementById('featured-listings-container');
    const dotsContainer = document.getElementById('slider-dots');
    if (!container) return;
    container.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';

    if (!items || items.length === 0) {
        container.innerHTML = '<div style="padding: 20px; color: #fff; text-align: center;">No featured properties currently available.</div>';
        return;
    }

    items.forEach((prop, index) => {
        const slide = document.createElement('div');
        slide.className = 'hero-slide';
        slide.onclick = () => window.location.href = `html/property-view.html?id=${prop.id}`;
        const imgSrc = (prop.images && prop.images[0]) || prop.image || 'assets/house.png';
        const displayTitle = prop.title || `${prop.beds ? prop.beds + ' ' : ''}${prop.type}`;

        slide.innerHTML = `
            <div class="hero-slide-content">
                <img src="${imgSrc}" alt="${prop.type}" onerror="this.src='assets/house.png'; this.onerror=null;">
                <div class="hero-overlay">
                    <div class="price">${prop.price}</div>
                    <h3 style="margin: 4px 0 0 0; font-size: 16px; font-weight: 700;">${displayTitle}</h3>
                    <p style="margin: 2px 0 0 0; font-size: 12px; opacity: 0.85;">${prop.location}</p>
                </div>
            </div>
        `;
        container.appendChild(slide);

        if (dotsContainer) {
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dotsContainer.appendChild(dot);
        }
    });

    let currentSlide = 0;
    const totalSlides = items.length;
    if (window.heroInterval) clearInterval(window.heroInterval);
    
    if (dotsContainer && totalSlides > 1) {
        const dots = dotsContainer.querySelectorAll('.dot');
        window.heroInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentSlide));
        }, 4000);
    }
};

const renderAllSections = (filteredData) => {
    // 1. Featured Slider (Top 5)
    renderFeaturedSlider(filteredData.slice(0, 5));

    // 2. Near You (Next 5)
    renderSection('near-you-container', filteredData.slice(5, 10));

    // 3. Top Listings (Next 5)
    renderSection('top-listings-container', filteredData.slice(10, 15));

    // 4. Investment Plots (Always from allData regardless of Rent/Buy tab)
    const plots = allData.filter(p => p.type && p.type.toLowerCase().includes('plot'));
    renderSection('plots-container', plots.length > 0 ? plots : allData.slice(0, 4));
};

// --- DATA LOADER ---
async function loadProperties() {
    let loadedFromApi = false;

    try {
        const response = await fetchWithTimeout(`${BACKEND_URL}/api/properties`, { timeout: 2000 });
        if (response.ok) {
            const liveData = await response.json();
            if (Array.isArray(liveData) && liveData.length > 0) {
                allData = liveData.map(p => {
                    let displayPrice = p.price;
                    if (typeof p.price === 'number') {
                        if (p.intent === 'Rent') {
                            displayPrice = `₹ ${p.price.toLocaleString('en-IN')}/mo`;
                        } else {
                            const inCr = p.price / 10000000;
                            if (inCr >= 1) displayPrice = `₹ ${inCr.toFixed(2)} Cr`;
                            else displayPrice = `₹ ${(p.price / 100000).toFixed(2)} L`;
                        }
                    } else if (!displayPrice) {
                        displayPrice = 'Price on Request';
                    }

                    return {
                        id: p.id,
                        title: p.title || `${p.property_type || p.type} in ${p.city || 'NCR'}`,
                        type: p.property_type || p.type || 'Apartment',
                        property_type: p.property_type || p.type || 'Apartment',
                        intent: p.intent || 'Buy',
                        price: displayPrice,
                        rawPrice: typeof p.price === 'number' ? p.price : 0,
                        city: p.city || 'Noida',
                        location: p.location || p.city || 'Delhi NCR',
                        location_text: p.location_text || p.location || 'Delhi NCR',
                        image: (p.images && p.images.length > 0) ? p.images[0] : (p.image || 'assets/house.png'),
                        images: (p.images && p.images.length > 0) ? p.images : [p.image || 'assets/house.png'],
                        beds: (p.details && (p.details.bhk || p.details.bedrooms || p.details.beds)) ? `${p.details.bhk || p.details.bedrooms || p.details.beds}` : '',
                        tag: p.status === 'approved' ? 'Verified' : 'Featured'
                    };
                });
                loadedFromApi = true;
            }
        }
    } catch (e) {
        console.warn("Backend unavailable or timed out. Seamlessly using HouseHunt luxury dataset.", e);
    }

    if (!loadedFromApi) {
        allData = window.getAllProperties ? window.getAllProperties() : (window.propertyData || []);
    }

    // Filter by selected city if applicable
    const activeCity = localStorage.getItem('userCity');
    let cityFiltered = allData;
    if (activeCity && activeCity !== 'India' && activeCity !== 'All') {
        const matchingCity = allData.filter(p => (p.city && p.city.toLowerCase() === activeCity.toLowerCase()) || (p.location && p.location.toLowerCase().includes(activeCity.toLowerCase())));
        if (matchingCity.length > 0) {
            cityFiltered = matchingCity;
        }
    }

    // Render active tab (Rent or Buy)
    const tabFiltered = cityFiltered.filter(p => p.intent === currentIntent);
    renderAllSections(tabFiltered.length > 0 ? tabFiltered : cityFiltered);
}

// --- DEVELOPERS LOADER ---
async function fetchAndRenderDevelopers() {
    const grid = document.getElementById('dynamic-developers-grid');
    if (!grid) return;

    let developers = null;

    try {
        const response = await fetchWithTimeout(`${BACKEND_URL}/api/developers`, { timeout: 2000 });
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                developers = data;
            }
        }
    } catch (err) {
        console.warn('Developer endpoint unavailable, using built-in developer registry.');
    }

    if (!developers || developers.length === 0) {
        developers = window.developerData || [
            { name: "DLF Limited", short_code: "DLF", experience: "75+ Years", projects: "150+ Delivered" },
            { name: "Godrej Properties", short_code: "GODREJ", experience: "32+ Years", projects: "90+ Delivered" },
            { name: "Tata Housing", short_code: "TATA", experience: "40+ Years", projects: "70+ Delivered" },
            { name: "ATS Greens", short_code: "ATS", experience: "25+ Years", projects: "45+ Delivered" },
            { name: "Gaurs Group", short_code: "GAUR", experience: "28+ Years", projects: "60+ Delivered" },
            { name: "M3M India", short_code: "M3M", experience: "15+ Years", projects: "50+ Delivered" }
        ];
    }

    grid.innerHTML = '';
    developers.forEach(dev => {
        const a = document.createElement('a');
        a.className = 'dev-card';
        a.href = dev.link || `html/explore.html?q=${encodeURIComponent(dev.name)}`;
        if (dev.link) a.target = '_blank';
        
        const logoHtml = dev.logo_url 
            ? `<img src="${dev.logo_url}" alt="${dev.name}" style="width: 100%; height: 50px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" onerror="this.outerHTML='<div class=\\'dev-logo\\'>${dev.short_code || dev.name.substring(0,3).toUpperCase()}</div>'">`
            : `<div class="dev-logo">${dev.short_code || dev.name.substring(0,3).toUpperCase()}</div>`;

        a.innerHTML = `
            ${logoHtml}
            <span style="font-weight: 700; font-size: 13px; color: #111;">${dev.name}</span>
            <span style="font-size: 11px; color: #64748b; margin-top: 2px;">${dev.experience || 'Verified Builder'}</span>
        `;
        grid.appendChild(a);
    });
}

// --- INTERACTIVE FEATURES & NAVIGATION ---
function setupCategoryNavigation() {
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const pEl = item.querySelector('p');
            if (!pEl) return;
            const type = pEl.textContent.toLowerCase();
            let page = 'explore.html';
            if (type.includes('independent')) page = 'category-independent.html';
            else if (type.includes('commercial')) page = 'category-commercial.html';
            else if (type.includes('apartment')) page = 'category-apartments.html';
            else if (type.includes('villa')) page = 'category-villas.html';
            else if (type.includes('plot')) page = 'category-plots.html';
            window.location.href = `html/${page}?mode=${currentIntent}`;
        });
    });
}

function setupSearchNavigation() {
    const searchInput = document.getElementById('propertySearchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const val = searchInput.value.trim();
                window.location.href = `html/explore.html?q=${encodeURIComponent(val)}&mode=${currentIntent}`;
            }
        });
    }

    // Connect See-All links
    document.querySelectorAll('.see-all').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `html/explore.html?mode=${currentIntent}`;
        });
    });
}

function setupIntentTabs() {
    const tabs = document.querySelectorAll('.listings-header .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentIntent = tab.textContent.includes('Rent') ? 'Rent' : 'Buy';
            
            const filtered = allData.filter(p => p.intent === currentIntent);
            renderAllSections(filtered);
        });
    });
}

function setupLocationHeader() {
    const locEl = document.getElementById('headerUserLocation');
    if (!locEl) return;

    const updateLocationUI = (city) => {
        locEl.innerHTML = `<i data-lucide="map-pin" style="width: 12px; height: 12px; margin-right: 4px; vertical-align: middle;"></i>${city}`;
        locEl.classList.remove('skeleton');
        locEl.style.height = 'auto';
        locEl.style.width = 'auto';
        if (window.lucide) window.lucide.createIcons();
    };

    const cachedCity = localStorage.getItem('userCity') || "Noida";
    updateLocationUI(cachedCity);
}

function setupUserProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    const nameEl = document.getElementById('headerUserName');
    const picEl = document.getElementById('headerProfilePic');
    const profileLink = document.getElementById('userProfile');

    if (user) {
        if (nameEl) {
            nameEl.innerText = user.name || "User";
            nameEl.classList.remove('skeleton');
            nameEl.style.height = 'auto';
            nameEl.style.width = 'auto';
        }
        if (picEl && user.photo) {
            picEl.src = user.photo;
            picEl.classList.remove('skeleton');
        }
        if (profileLink) profileLink.onclick = () => window.location.href = 'html/profile.html';
    } else {
        if (nameEl) {
            nameEl.innerText = "Guest User";
            nameEl.classList.remove('skeleton');
            nameEl.style.height = 'auto';
            nameEl.style.width = 'auto';
        }
        if (picEl) {
            picEl.src = "assets/profile.png";
            picEl.classList.remove('skeleton');
        }
        if (profileLink) profileLink.onclick = () => window.location.href = 'html/profile.html';
    }
}

function setupCitySwitcher() {
    const popularCities = [
        { name: "Noida", icon: "🏡" },
        { name: "Gurgaon", icon: "🏢" },
        { name: "Delhi", icon: "🏙️" },
        { name: "Greater Noida", icon: "🌳" },
        { name: "Ghaziabad", icon: "🚆" },
        { name: "Faridabad", icon: "🏗️" },
        { name: "Mumbai", icon: "🌊" },
        { name: "Bangalore", icon: "💻" }
    ];

    const citySheet = document.getElementById('citySheet');
    const cityOverlay = document.getElementById('cityOverlay');
    const cityGrid = document.getElementById('popularCitiesGrid');
    if (!citySheet || !cityGrid) return;

    const toggleCitySheet = () => {
        citySheet.classList.toggle('active');
        if (cityOverlay) cityOverlay.classList.toggle('active');
    };

    const locTrigger = document.getElementById('headerUserLocation');
    if (locTrigger) {
        locTrigger.style.cursor = 'pointer';
        locTrigger.onclick = (e) => {
            e.stopPropagation();
            toggleCitySheet();
        };
    }

    if (document.getElementById('closeCitySheet')) document.getElementById('closeCitySheet').onclick = toggleCitySheet;
    if (cityOverlay) cityOverlay.onclick = toggleCitySheet;

    const renderCities = (filter = "") => {
        cityGrid.innerHTML = "";
        popularCities.filter(c => c.name.toLowerCase().includes(filter.toLowerCase())).forEach(city => {
            const div = document.createElement('div');
            div.className = `city-option ${localStorage.getItem('userCity') === city.name ? 'active' : ''}`;
            div.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 5px;">${city.icon}</div>
                <span>${city.name}</span>
            `;
            div.onclick = () => {
                localStorage.setItem('userCity', city.name);
                const locEl = document.getElementById('headerUserLocation');
                if (locEl) {
                    locEl.innerHTML = `<i data-lucide="map-pin" style="width: 12px; height: 12px; margin-right: 4px; vertical-align: middle;"></i>${city.name}`;
                    if (window.lucide) window.lucide.createIcons();
                }
                toggleCitySheet();
                loadProperties();
            };
            cityGrid.appendChild(div);
        });
    };

    renderCities();

    const citySearch = document.getElementById('citySearchInput');
    if (citySearch) {
        citySearch.oninput = (e) => renderCities(e.target.value);
    }
}

function setupFilterSheet() {
    const filterBtn = document.querySelector('.filter-btn');
    const filterSheet = document.getElementById('filterSheet');
    const filterOverlay = document.getElementById('filterOverlay');
    const closeSheet = document.getElementById('closeSheet');
    const applyFilter = document.getElementById('applyFilter');

    if (!filterSheet) return;

    const toggleSheet = () => {
        filterSheet.classList.toggle('active');
        if (filterOverlay) filterOverlay.classList.toggle('active');
    };

    if (filterBtn) filterBtn.addEventListener('click', toggleSheet);
    if (closeSheet) closeSheet.addEventListener('click', toggleSheet);
    if (filterOverlay) filterOverlay.addEventListener('click', toggleSheet);
    if (applyFilter) applyFilter.addEventListener('click', () => {
        toggleSheet();
        window.location.href = `html/explore.html?mode=${currentIntent}`;
    });

    const pills = document.querySelectorAll('.pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pill.parentElement.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const resultsContainer = document.getElementById('explore-results');
    if (!resultsContainer) return;

    // Utility to parse price for sorting
    function parsePrice(priceStr) {
        if (!priceStr) return 0;
        if (typeof priceStr === 'number') return priceStr;
        let str = priceStr.toString().replace(/,/g, '');
        let num = parseFloat(str.replace(/[^0-9.]/g, ''));
        if (isNaN(num)) return 0;
        if (str.includes('Cr')) return num * 10000000;
        if (str.includes('L')) return num * 100000;
        return num;
    }

    let data = [];

    // Safe Data Loading
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? 'http://localhost:5000'
            : 'https://backend.househunt.live';

        const response = await fetch(`${BACKEND_URL}/api/properties`, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const dbProps = await response.json();
            if (Array.isArray(dbProps) && dbProps.length > 0) {
                data = dbProps.map(p => ({
                    id: p.id,
                    title: p.title || `${p.property_type || p.type} in ${p.city || 'NCR'}`,
                    type: p.property_type || p.type || 'Apartment',
                    intent: p.intent || 'Buy',
                    price: typeof p.price === 'number' 
                        ? (p.intent === 'Rent' ? `₹ ${p.price.toLocaleString('en-IN')}/mo` : (p.price >= 10000000 ? `₹ ${(p.price/10000000).toFixed(2)} Cr` : `₹ ${(p.price/100000).toFixed(2)} L`))
                        : (p.price || 'Price on Request'),
                    location: p.location_text || p.location || p.city || 'Delhi NCR',
                    area: p.details?.area ? `${p.details.area} sqft` : (p.details?.plot_area || ''),
                    beds: p.details?.bhk || (p.details?.beds ? `${p.details.beds} BHK` : ''),
                    image: (p.images && p.images[0]) || p.image || '../assets/house.png',
                    rawPrice: typeof p.price === 'number' ? p.price : parsePrice(p.price)
                }));
            }
        }
    } catch (e) {
        console.warn("Backend unavailable, using local luxury data.", e);
    }

    if (!data || data.length === 0) {
        const localProps = window.getAllProperties ? window.getAllProperties() : (window.propertyData || []);
        data = localProps.map(p => ({
            id: p.id,
            title: p.title || `${p.property_type || p.type} in ${p.city || 'NCR'}`,
            type: p.property_type || p.type || 'Apartment',
            intent: p.intent || 'Buy',
            price: p.price,
            location: p.location_text || p.location || p.city || 'Delhi NCR',
            area: p.details?.area ? `${p.details.area} sqft` : (p.details?.plot_area || ''),
            beds: p.details?.bhk || (p.details?.beds ? `${p.details.beds} BHK` : ''),
            image: (p.images && p.images[0]) || p.image || '../assets/house.png',
            rawPrice: p.rawPrice || parsePrice(p.price)
        }));
    }

    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q');
    const urlTypeFilter = urlParams.get('type');
    const urlIntentFilter = urlParams.get('intent') || urlParams.get('mode');
    const urlLocationFilter = urlParams.get('location') || urlParams.get('city');

    // DOM Elements
    const searchInput = document.querySelector('.search-box input');
    const filterChips = document.querySelectorAll('.f-chip');
    const filterBtn = document.querySelector('.filter-btn');
    
    // Filter Modal DOM Elements
    const filterModal = document.getElementById('filterModal');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const sortRadios = document.querySelectorAll('input[name="sortPrice"]');
    const locationSelect = document.getElementById('locationFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    
    // State
    let searchTerm = urlQuery ? urlQuery.toLowerCase() : '';
    if (searchInput && urlQuery) searchInput.value = urlQuery;

    let activeChip = 'All'; // 'All', 'Rent', 'Sale', 'Commercial'
    let activeSort = null;
    let activeLocation = urlLocationFilter ? urlLocationFilter : 'all';
    if (locationSelect && urlLocationFilter) {
        locationSelect.value = urlLocationFilter;
    }
    
    // Initial State from URL
    if (urlTypeFilter) {
        if (['Commercial', 'Shop', 'Showroom', 'Warehouse', 'Co-working'].some(t => t.toLowerCase().includes(urlTypeFilter.toLowerCase()))) {
            activeChip = 'Commercial';
        }
    } else if (urlIntentFilter) {
        if (urlIntentFilter.toLowerCase() === 'rent') activeChip = 'Rent';
        if (urlIntentFilter.toLowerCase() === 'buy' || urlIntentFilter.toLowerCase() === 'sale' || urlIntentFilter.toLowerCase() === 'sell') activeChip = 'Sale';
    }

    // Update chips UI based on initial state
    filterChips.forEach(chip => {
        if (chip.textContent === activeChip) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });

    // Filter Modal Interactions
    if (filterBtn && filterModal) {
        filterBtn.addEventListener('click', () => {
            filterModal.classList.add('active');
        });
    }

    if (closeFilterBtn && filterModal) {
        closeFilterBtn.addEventListener('click', () => {
            filterModal.classList.remove('active');
        });
    }

    if (filterModal) {
        filterModal.addEventListener('click', (e) => {
            if (e.target === filterModal) {
                filterModal.classList.remove('active');
            }
        });
    }

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const selectedSort = document.querySelector('input[name="sortPrice"]:checked');
            activeSort = selectedSort ? selectedSort.value : null;
            activeLocation = locationSelect ? locationSelect.value : 'all';
            
            filterModal.classList.remove('active');
            renderProperties();
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            if (sortRadios) sortRadios.forEach(r => r.checked = false);
            if (locationSelect) locationSelect.value = 'all';
            activeSort = null;
            activeLocation = 'all';
            
            filterModal.classList.remove('active');
            renderProperties();
        });
    }

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            renderProperties();
        });
    }

    // Chips click
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeChip = chip.textContent;
            renderProperties();
        });
    });

    function renderProperties() {
        let filteredData = [...data];
        let filterTitle = 'Properties';

        // 1. Apply Chip Filter
        if (activeChip === 'Rent') {
            filteredData = filteredData.filter(p => p.intent === 'Rent');
            filterTitle = 'Rental Properties';
        } else if (activeChip === 'Sale') {
            filteredData = filteredData.filter(p => p.intent === 'Buy');
            filterTitle = 'Properties for Sale';
        } else if (activeChip === 'Commercial') {
            const commercialKeywords = ['commercial', 'office', 'shop', 'showroom', 'warehouse', 'co-working'];
            filteredData = filteredData.filter(p => commercialKeywords.some(k => (p.type || '').toLowerCase().includes(k)));
            filterTitle = 'Commercial Properties';
        }
        
        // 2. Apply URL type filter if still relevant and activeChip is All
        if (activeChip === 'All' && urlTypeFilter) {
            filteredData = filteredData.filter(p => p.type.toLowerCase().includes(urlTypeFilter.toLowerCase()));
            filterTitle = urlTypeFilter;
        }

        // 3. Apply Search Filter
        if (searchTerm) {
            filteredData = filteredData.filter(p => {
                return (p.location && p.location.toLowerCase().includes(searchTerm)) ||
                       (p.title && p.title.toLowerCase().includes(searchTerm)) ||
                       (p.type && p.type.toLowerCase().includes(searchTerm)) ||
                       (p.intent && p.intent.toLowerCase().includes(searchTerm));
            });
        }

        // 4. Apply Modal Location Filter
        if (activeLocation && activeLocation !== 'all') {
            filteredData = filteredData.filter(p => p.location && p.location.toLowerCase().includes(activeLocation.toLowerCase()));
        }

        // 5. Apply Modal Sorting
        if (activeSort === 'lowToHigh') {
            filteredData.sort((a, b) => a.rawPrice - b.rawPrice);
        } else if (activeSort === 'highToLow') {
            filteredData.sort((a, b) => b.rawPrice - a.rawPrice);
        }

        // Clear container
        resultsContainer.innerHTML = '';

        // Add count
        const countHeader = document.createElement('div');
        countHeader.className = 'results-count';
        countHeader.style.cssText = 'padding: 12px 5px; font-weight: 700; color: #475569; font-size: 14px;';
        countHeader.textContent = `Showing ${filteredData.length} ${filterTitle} in NCR`;
        resultsContainer.appendChild(countHeader);

        // Load favorites from local storage
        const savedFavorites = JSON.parse(localStorage.getItem('househunt_favorites') || '[]');

        if (filteredData.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = 'text-align: center; padding: 50px 20px; color: #64748b;';
            emptyDiv.innerHTML = `
                <i data-lucide="search-x" style="width: 48px; height: 48px; margin-bottom: 12px; color: #94a3b8;"></i>
                <h3 style="font-size: 18px; color: #1e293b; margin-bottom: 8px;">No matching properties</h3>
                <p style="font-size: 14px;">Try clearing filters or search for another sector.</p>
                <button id="clearFiltersDirect" style="margin-top: 15px; padding: 10px 20px; background: #0066ff; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">Show All Properties</button>
            `;
            resultsContainer.appendChild(emptyDiv);
            document.getElementById('clearFiltersDirect').onclick = () => {
                searchTerm = '';
                if (searchInput) searchInput.value = '';
                activeChip = 'All';
                activeLocation = 'all';
                filterChips.forEach(c => c.classList.toggle('active', c.textContent === 'All'));
                renderProperties();
            };
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        // Render cards
        filteredData.forEach(prop => {
            const isFav = savedFavorites.includes(String(prop.id)) || savedFavorites.includes(Number(prop.id));
            const item = document.createElement('a');
            item.href = `property-view.html?id=${prop.id}`;
            item.className = 'list-item';
            
            const displayTitle = prop.title || `${prop.beds ? prop.beds + ' ' : ''}${prop.type}`;

            item.innerHTML = `
                <img src="${prop.image}" alt="${prop.type}" onerror="this.src='../assets/house.png'; this.onerror=null;">
                <div class="item-info">
                    <div class="item-price">${prop.price}</div>
                    <h3 style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 190px;">${displayTitle}</h3>
                    <p class="item-loc"><i data-lucide="map-pin" style="width: 11px; height: 11px; display: inline;"></i> ${prop.location}</p>
                    <div class="item-stats">
                        <span class="tag-pill" style="background: #f0f4ff; color: #0066ff; padding: 2px 8px; border-radius: 6px; font-weight: 700; font-size: 11px;">${prop.intent}</span>
                        ${prop.area ? `<span style="margin-left: 6px; font-size: 11px; color: #64748b;">${prop.area}</span>` : ''}
                    </div>
                </div>
                <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${prop.id}"><i data-lucide="heart"></i></button>
            `;
            
            resultsContainer.appendChild(item);
        });

        // Add event listeners to fav buttons
        document.querySelectorAll('.fav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const propId = btn.getAttribute('data-id');
                let favorites = JSON.parse(localStorage.getItem('househunt_favorites') || '[]');
                
                if (favorites.includes(propId) || favorites.includes(Number(propId))) {
                    favorites = favorites.filter(id => String(id) !== String(propId));
                    localStorage.setItem('househunt_favorites', JSON.stringify(favorites));
                    btn.classList.remove('active');
                } else {
                    favorites.push(propId);
                    localStorage.setItem('househunt_favorites', JSON.stringify(favorites));
                    btn.classList.add('active');
                }
            });
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Initial render
    renderProperties();
});

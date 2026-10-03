document.addEventListener('DOMContentLoaded', async () => {
    const BACKEND_URL = 'https://backend.househunt.live';
    let PROPERTIES = [];

    const quickChips = document.getElementById('quickChips');
    const featuredPlots = document.getElementById('featuredPlots');
    const filterContent = document.getElementById('filterContent');
    const standardList = document.getElementById('standardList');

    const urlParams = new URLSearchParams(window.location.search);
    // Ignore URL parameter for mode, plots are only for sale
    let currentMode = 'Buy';

    function formatPrice(p) {
        if (typeof p.price !== 'number') return p.price || 'Price on Request';
        if (p.intent === 'Rent') return `₹ ${p.price.toLocaleString()}/mo`;
        const inCr = p.price / 10000000;
        if (inCr >= 1) return `₹ ${inCr.toFixed(2)} Cr`;
        return `₹ ${(p.price / 100000).toFixed(2)} L`;
    }

    async function loadProperties() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const response = await fetch(`${BACKEND_URL}/api/properties`, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    PROPERTIES = data.map(p => ({ 
                        ...p, 
                        price: formatPrice(p),
                        location_text: p.city || (p.location_text ? p.location_text.split(',').slice(-2).join(',').trim() : (p.location || 'Delhi NCR'))
                    }));
                } else {
                    PROPERTIES = window.getAllProperties ? window.getAllProperties() : (window.propertyData || []);
                }
            } else {
                PROPERTIES = window.getAllProperties ? window.getAllProperties() : (window.propertyData || []);
            }
            renderData();
        } catch (e) {
            console.warn("Backend unavailable, using local luxury data.", e);
            PROPERTIES = window.getAllProperties ? window.getAllProperties() : (window.propertyData || []);
            renderData();
        }
    }

    const CHIPS_BUY = ['Investment opportunity 🔥', 'Ready to build', 'High appreciation', 'Near highway'];

    const PLOT_FILTERS = `
        <div class="filter-group">
            <div class="filter-title">💰 Price & Investment</div>
            <div class="option-grid">
                <div class="option selected" data-value="all">Any</div>
                <div class="option" data-value="Under 50L">Under 50L</div>
                <div class="option" data-value="50L-1Cr">50L-1Cr</div>
                <div class="option" data-value="1Cr+">1Cr+</div>
            </div>
        </div>
        <div class="filter-group">
            <div class="filter-title">📑 Legal & Ownership</div>
            <div class="option-grid">
                <div class="option" data-value="Freehold">Freehold</div>
                <div class="option" data-value="Title Clear">Title Clear</div>
                <div class="option" data-value="Approved">Authority Approved</div>
            </div>
        </div>
    `;

    const renderData = () => {
        // Enforce Plot category matching
        let filtered = PROPERTIES.filter(p => (p.property_type === 'Plot' || p.type === 'Plot' || (p.type && p.type.toLowerCase().includes('plot'))));
        renderFeatured(filtered.slice(0, 4));
        renderList(filtered);
    };

    const renderFeatured = (props) => {
        if (!featuredPlots) return;
        featuredPlots.innerHTML = props.length > 0 ? props.map(p => `
            <div class="plot-card" onclick="viewDetails('${p.id}')">
                <img src="${(p.images && p.images[0]) || p.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}" onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'">
                <div class="plot-info">
                    <div class="price">${p.price}</div>
                    <div class="area">${p.details?.plot_area || p.details?.area || 'Plot'}</div>
                    <div style="font-size: 10px; color: #666; margin-top: 4px;">${p.location_text || p.location}</div>
                </div>
            </div>
        `).join('') : '<p style="padding: 20px; color: #666;">No featured plots found.</p>';
    };

    const renderList = (props) => {
        if (!standardList) return;
        standardList.innerHTML = props.length > 0 ? props.map(p => `
            <div class="standard-card" onclick="viewDetails('${p.id}')">
                <img src="${(p.images && p.images[0]) || p.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}" onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'">
                <div class="standard-info">
                    <h3>${p.title || 'Premium Plot in ' + (p.location_text || p.location)}</h3>
                    <div class="price">${p.price}</div>
                    <div style="font-size: 12px; color: #666;">${p.details?.plot_area || p.details?.area || 'Plot Land'} • Freehold</div>
                </div>
            </div>
        `).join('') : '<p style="text-align: center; padding: 40px; color: #666;">No plots found.</p>';
    };

    window.viewDetails = (id) => {
        window.location.href = `property-view.html?id=${id}`;
    };

    const toggleSheet = (show) => {
        const sheet = document.getElementById('filterSheet');
        const overlay = document.getElementById('sheetOverlay');
        if (!sheet || !overlay) return;
        sheet.classList.toggle('open', show);
        overlay.style.display = show ? 'block' : 'none';
        setTimeout(() => overlay.style.opacity = show ? '1' : '0', 10);
    };

    document.getElementById('openMoreFilters').onclick = () => toggleSheet(true);
    document.getElementById('closeFilter').onclick = () => toggleSheet(false);
    document.getElementById('sheetOverlay').onclick = () => toggleSheet(false);
    document.getElementById('applyFilters').onclick = () => toggleSheet(false);

    const renderFilters = () => {
        if (filterContent) filterContent.innerHTML = PLOT_FILTERS;
        if (quickChips) quickChips.innerHTML = CHIPS_BUY.map(c => `<div class="chip">${c}</div>`).join('');
        
        document.querySelectorAll('.option').forEach(opt => {
            opt.onclick = () => {
                opt.parentElement.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
            };
        });
    };

    renderFilters();
    loadProperties();
});

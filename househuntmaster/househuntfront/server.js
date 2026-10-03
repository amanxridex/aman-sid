const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 5000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.map': 'application/json'
};

// Safe JSON parser helper
function getRequestBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
    });
}

const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // --- MOCK API ENDPOINTS ---
    if (pathname.startsWith('/api/')) {
        res.setHeader('Content-Type', 'application/json');

        if (pathname === '/api/developers') {
            res.writeHead(200);
            res.end(JSON.stringify([
                { name: 'DLF', logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=150&q=80', description: 'India’s largest luxury real estate developer' },
                { name: 'Godrej Properties', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80', description: 'Excellence and sustainability in luxury living' },
                { name: 'Tata Housing', logo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=150&q=80', description: 'Pioneers of holistic urban developments' },
                { name: 'M3M India', logo: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=150&q=80', description: 'Redefining luxury lifestyle in Delhi NCR' },
                { name: 'ATS HomeKraft', logo: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=150&q=80', description: 'Architectural elegance and serene greens' },
                { name: 'Gaurs Group', logo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=150&q=80', description: 'Building the nation with trust and pride' }
            ]));
            return;
        }

        if (pathname === '/api/properties' || pathname.startsWith('/api/properties?')) {
            // Read data.js fallback properties dynamically
            res.writeHead(200);
            res.end(JSON.stringify([
                {
                    id: '1',
                    title: 'Godrej Woods Ultra-Luxury Residences',
                    price: 18500000,
                    location: 'Sector 43',
                    city: 'Noida',
                    type: 'Apartment',
                    property_type: 'Apartment',
                    bedrooms: 4,
                    bathrooms: 4,
                    area: 2850,
                    sqft: 2850,
                    furnishing: 'Fully Furnished',
                    intent: 'sell',
                    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                    gallery: [
                        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
                    ],
                    seller_name: 'Godrej Signature Properties',
                    seller_phone: '+91 98100 23456',
                    description: 'Set amidst 1,100 trees, Godrej Woods brings an urban forest sanctuary to the heart of Sector 43, Noida.'
                },
                {
                    id: '2',
                    title: 'The Camellias, DLF Phase 5',
                    price: 75000000,
                    location: 'Golf Course Road',
                    city: 'Gurgaon',
                    type: 'Apartment',
                    property_type: 'Apartment',
                    bedrooms: 5,
                    bathrooms: 6,
                    area: 7400,
                    sqft: 7400,
                    furnishing: 'Ultra Luxury Furnished',
                    intent: 'sell',
                    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
                    seller_name: 'DLF Luxury Sales Group',
                    seller_phone: '+91 98111 88990',
                    description: 'India’s most celebrated address overlooking the prestigious DLF Golf and Country Club.'
                }
            ]));
            return;
        }

        if (pathname.startsWith('/api/chats/')) {
            if (req.method === 'POST') {
                const body = await getRequestBody(req);
                res.writeHead(201);
                res.end(JSON.stringify({
                    id: 'msg-' + Date.now(),
                    content: body.content || '',
                    sender_id: body.sender_id || 'user',
                    created_at: new Date().toISOString()
                }));
                return;
            }
            res.writeHead(200);
            res.end(JSON.stringify([]));
            return;
        }

        if (pathname === '/api/ai/chat') {
            const body = await getRequestBody(req);
            const query = (body.message || '').toLowerCase();
            let reply = "Hello! I am HuntAI, your personal Delhi NCR real estate advisor. I can help you find luxury penthouses in Gurgaon, tranquil forest residences in Noida, or commercial suites on Golf Course Road. What is your preferred budget and city?";
            if (query.includes('noida') || query.includes('godrej')) {
                reply = "For Noida, we highly recommend **Godrej Woods** in Sector 43 (starting from ₹1.85 Cr) and **ATS Knightsbridge** at Sector 124. Both offer world-class clubhouse amenities and rapid expressway connectivity.";
            } else if (query.includes('gurgaon') || query.includes('dlf')) {
                reply = "Gurgaon’s prime corridor along Golf Course Road features iconic addresses like **The Camellias DLF Phase 5** (₹7.5 Cr) and **M3M Golfestate**. Would you like to schedule an exclusive private walkthrough?";
            }
            res.writeHead(200);
            res.end(JSON.stringify({ reply }));
            return;
        }

        if (pathname.startsWith('/api/user/profile/')) {
            const body = await getRequestBody(req);
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, ...body }));
            return;
        }

        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
        return;
    }

    // --- STATIC FILES SERVING ---
    if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
    }

    let filePath = path.join(BASE_DIR, pathname);

    // Prevent directory traversal
    if (!filePath.startsWith(BASE_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Check if it's in html/ folder
            const htmlAltPath = path.join(BASE_DIR, 'html', pathname);
            fs.stat(htmlAltPath, (errAlt, statsAlt) => {
                if (!errAlt && statsAlt.isFile()) {
                    serveFile(htmlAltPath, res);
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`<h2>404 Not Found</h2><p>The requested URL ${pathname} was not found on this server.</p><a href="/">Return to Homepage</a>`);
                }
            });
            return;
        }
        serveFile(filePath, res);
    });
});

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error: ' + err.message);
            return;
        }
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
}

server.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 HouseHunt Luxury Real Estate Server Running!`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`📁 Serving directory: ${BASE_DIR}`);
    console.log(`=================================================\n`);
});

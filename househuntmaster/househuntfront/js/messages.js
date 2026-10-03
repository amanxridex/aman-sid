document.addEventListener('DOMContentLoaded', async () => {
    const BACKEND_URL = 'https://backend.househunt.live';
    let currentUser = JSON.parse(localStorage.getItem('user'));
    
    // Auto-login fallback if user clicked explore demo previously
    if (!currentUser && localStorage.getItem('househunt_demo_active') === 'true') {
        currentUser = { uid: 'demo-user-123', email: 'demo@househunt.live', name: 'Demo Client', role: 'Buyer & Host' };
        localStorage.setItem('user', JSON.stringify(currentUser));
    }
    
    // Fix for mobile keyboard covering the input
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            document.body.style.height = window.visualViewport.height + 'px';
            window.scrollTo(0, 0);
        });
        document.body.style.height = window.visualViewport.height + 'px';
    }
    
    if (!currentUser) {
        const mainContainer = document.getElementById('mainContainer') || document.body;
        mainContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 40px 20px; text-align: center; background: #fafafa;">
                <div style="width: 90px; height: 90px; background: linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    <i data-lucide="message-square" style="width: 44px; height: 44px; color: #4f46e5;"></i>
                </div>
                <h2 style="font-size: 24px; font-weight: 800; color: #111; margin-bottom: 10px; letter-spacing: -0.5px;">Client Messages</h2>
                <p style="color: #64748b; margin-bottom: 25px; font-size: 15px; line-height: 1.5; max-width: 320px;">Unlock client inquiries and seller chats to test real-time messaging.</p>
                <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 300px;">
                    <button id="quickDemoLoginBtn" style="background: linear-gradient(135deg, #2D68FF 0%, #4338CA 100%); color: white; border: none; padding: 14px 24px; border-radius: 14px; font-weight: 700; font-size: 15px; cursor: pointer; box-shadow: 0 8px 20px rgba(45,104,255,0.3); transition: transform 0.2s;">
                        Enter Demo Mode
                    </button>
                    <button onclick="window.location.href='login.html?returnTo=messages.html'" style="background: white; color: #111; border: 1px solid #e2e8f0; padding: 14px 24px; border-radius: 14px; font-weight: 600; font-size: 14px; cursor: pointer;">
                        Log In with Account
                    </button>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        document.getElementById('quickDemoLoginBtn')?.addEventListener('click', () => {
            const demoUser = { uid: 'demo-user-123', email: 'demo@househunt.live', name: 'Demo Client', role: 'Buyer & Host' };
            localStorage.setItem('user', JSON.stringify(demoUser));
            localStorage.setItem('househunt_demo_active', 'true');
            window.location.reload();
        });
        return;
    }

    const userId = currentUser.uid || currentUser.id || 'demo-user-123';
    const urlParams = new URLSearchParams(window.location.search);
    const activeChatId = urlParams.get('chat_id');

    const chatListView = document.getElementById('chatListView');
    const chatRoomView = document.getElementById('chatRoomView');
    const bottomNav = document.getElementById('bottomNav');
    
    // --- LIST VIEW LOGIC ---
    let allChats = [];
    let currentTab = 'exploring'; // 'exploring' or 'hosting'

    // Realistic Demo Chats Data
    const defaultDemoChats = [
        {
            id: 'chat-demo-1',
            buyer_id: userId,
            seller_id: 'host-101',
            buyer: { full_name: currentUser.name || 'You', avatar_url: '../assets/profile.png' },
            seller: { full_name: 'Vikramaditya Oberoi', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
            properties: {
                id: '1',
                title: 'Godrej Woods Ultra-Luxury Residences',
                city: 'Noida',
                price: 18500000
            },
            updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            messages: [
                { id: 'm1', sender_id: userId, content: 'Hi Vikramaditya, is the 4BHK penthouse unit available for a physical site visit this weekend?', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
                { id: 'm2', sender_id: 'host-101', content: 'Yes, absolutely! The penthouse tour can be arranged for this Saturday at 11:00 AM. I will have the project director greet you at the tower lobby.', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() }
            ]
        },
        {
            id: 'chat-demo-2',
            buyer_id: userId,
            seller_id: 'host-102',
            buyer: { full_name: currentUser.name || 'You', avatar_url: '../assets/profile.png' },
            seller: { full_name: 'Sunita Rao', avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
            properties: {
                id: '2',
                title: 'The Camellias, DLF Phase 5',
                city: 'Gurgaon',
                price: 75000000
            },
            updated_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            messages: [
                { id: 'm3', sender_id: userId, content: 'Hello, could you share the official brochure and payment schedule for the golf-facing floor?', timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString() },
                { id: 'm4', sender_id: 'host-102', content: 'Floor plans, 3D render walkthroughs, and bespoke payment milestones have been forwarded. Let me know when you would like to inspect the clubhouse.', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() }
            ]
        },
        {
            id: 'chat-demo-3',
            buyer_id: 'buyer-201',
            seller_id: userId,
            buyer: { full_name: 'Dr. Kabir Malhotra', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
            seller: { full_name: currentUser.name || 'You', avatar_url: '../assets/profile.png' },
            properties: {
                id: '5',
                title: 'DLF Cybercity Executive Commercial Suite',
                city: 'Gurgaon',
                price: 185000
            },
            updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            messages: [
                { id: 'm5', sender_id: 'buyer-201', content: 'Hello! I am seeking to lease this 3,200 sq.ft grade-A office space for our health-tech venture. Is possession immediate?', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() }
            ]
        },
        {
            id: 'chat-demo-4',
            buyer_id: 'buyer-202',
            seller_id: userId,
            buyer: { full_name: 'Ananya Sharma', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
            seller: { full_name: currentUser.name || 'You', avatar_url: '../assets/profile.png' },
            properties: {
                id: '4',
                title: 'Ultra-Luxury 4BHK Golf View Condo',
                city: 'Noida',
                price: 24500000
            },
            updated_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
            messages: [
                { id: 'm6', sender_id: 'buyer-202', content: 'Greetings! Does this listing include two reserved basement parking spaces?', timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString() }
            ]
        }
    ];

    function getStoredChats() {
        const stored = localStorage.getItem('househunt_demo_chats');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) { }
        }
        localStorage.setItem('househunt_demo_chats', JSON.stringify(defaultDemoChats));
        return defaultDemoChats;
    }

    function saveStoredChats(chats) {
        localStorage.setItem('househunt_demo_chats', JSON.stringify(chats));
    }
    
    // View Management
    if (activeChatId) {
        chatListView.style.display = 'none';
        bottomNav.style.display = 'none';
        chatRoomView.style.display = 'flex';
        loadChatRoom(activeChatId);
    } else {
        chatRoomView.style.display = 'none';
        chatListView.style.display = 'flex';
        bottomNav.style.display = 'flex';
        loadChatList();
    }

    async function loadChatList() {
        const container = document.getElementById('chatListContainer');
        const loading = document.getElementById('loadingChats');
        
        try {
            if (allChats.length === 0) {
                let fetchedSuccessfully = false;
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 2000);
                    const res = await fetch(`${BACKEND_URL}/api/chats/${userId}`, { signal: controller.signal });
                    clearTimeout(timeoutId);
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data) && data.length > 0) {
                            allChats = data;
                            fetchedSuccessfully = true;
                        }
                    }
                } catch (err) {
                    console.log('Backend chat fetch timed out or failed, using local demo chats:', err.message);
                }

                if (!fetchedSuccessfully) {
                    allChats = getStoredChats();
                }
            }
            
            if (loading) loading.style.display = 'none';
            
            // Filter based on tab
            const filteredChats = allChats.filter(chat => {
                if (currentTab === 'exploring') {
                    return chat.buyer_id === userId;
                } else {
                    return chat.seller_id === userId;
                }
            });
            
            if (filteredChats.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px; color: #888;">
                        <i data-lucide="message-square" style="width: 36px; height: 36px; stroke-width: 1.5; margin-bottom: 12px; color: #cbd5e1;"></i>
                        <p style="margin: 0; font-size: 15px; font-weight: 600;">No ${currentTab} inquiries yet.</p>
                        <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">When prospective buyers or hosts reply, conversations will appear here.</p>
                    </div>
                `;
                if (window.lucide) window.lucide.createIcons();
                return;
            }
            
            container.innerHTML = '';
            filteredChats.forEach(chat => {
                const isBuyer = chat.buyer_id === userId;
                const otherPerson = isBuyer ? chat.seller : chat.buyer;
                const property = chat.properties;
                const lastMsg = (chat.messages && chat.messages.length > 0) 
                    ? chat.messages[chat.messages.length - 1].content 
                    : `Inquiry regarding ${property?.title || 'property'}`;
                
                const div = document.createElement('div');
                div.className = 'chat-item';
                div.style.padding = '16px 20px';
                div.style.margin = '0 15px 12px 15px';
                div.style.borderRadius = '20px';
                div.style.background = 'white';
                div.style.border = '1px solid rgba(0,0,0,0.05)';
                div.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
                div.style.display = 'flex';
                div.style.gap = '15px';
                div.style.alignItems = 'center';
                div.style.cursor = 'pointer';
                div.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
                
                div.onmouseenter = () => {
                    div.style.transform = 'translateY(-2px)';
                    div.style.boxShadow = '0 6px 15px rgba(0,0,0,0.05)';
                    div.style.borderColor = 'rgba(0,0,0,0.1)';
                };
                div.onmouseleave = () => {
                    div.style.transform = 'translateY(0)';
                    div.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
                    div.style.borderColor = 'rgba(0,0,0,0.05)';
                };
                div.onclick = () => {
                    window.location.href = `messages.html?chat_id=${chat.id}`;
                };
                
                const otherName = otherPerson?.full_name || otherPerson?.name || otherPerson?.display_name || 'Client';
                const otherAvatar = otherPerson?.avatar_url || otherPerson?.photo || '../assets/profile.png';
                
                div.innerHTML = `
                    <div style="width: 52px; height: 52px; border-radius: 50%; background: #e5e7eb; overflow: hidden; flex-shrink: 0; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                        <img src="${otherAvatar}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='../assets/profile.png'">
                    </div>
                    <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${otherName}</h3>
                            <span style="font-size: 11px; color: #888; font-weight: 500;">${chat.updated_at ? new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}</span>
                        </div>
                        <p style="margin: 0 0 3px 0; font-size: 13px; color: #2D68FF; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Re: ${property?.title || 'Property'}</p>
                        <p style="margin: 0; font-size: 12px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lastMsg}</p>
                    </div>
                    <i data-lucide="chevron-right" style="width: 18px; height: 18px; color: #cbd5e1; flex-shrink: 0;"></i>
                `;
                container.appendChild(div);
            });
            if (window.lucide) window.lucide.createIcons();
        } catch (e) {
            console.error('Error rendering chats:', e);
            if (loading) loading.style.display = 'none';
        }
    }

    // Tab Switcher Logic
    const tabExploring = document.getElementById('tabExploring');
    const tabHosting = document.getElementById('tabHosting');

    if (tabExploring && tabHosting) {
        function switchTab(tab) {
            currentTab = tab;
            if (tab === 'exploring') {
                tabExploring.style.background = 'white';
                tabExploring.style.color = '#111';
                tabExploring.style.fontWeight = '700';
                tabExploring.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                
                tabHosting.style.background = 'transparent';
                tabHosting.style.color = '#666';
                tabHosting.style.fontWeight = '600';
                tabHosting.style.boxShadow = 'none';
            } else {
                tabHosting.style.background = 'white';
                tabHosting.style.color = '#111';
                tabHosting.style.fontWeight = '700';
                tabHosting.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                
                tabExploring.style.background = 'transparent';
                tabExploring.style.color = '#666';
                tabExploring.style.fontWeight = '600';
                tabExploring.style.boxShadow = 'none';
            }
            loadChatList();
        }

        tabExploring.addEventListener('click', () => switchTab('exploring'));
        tabHosting.addEventListener('click', () => switchTab('hosting'));
    }

    // --- CHAT ROOM LOGIC ---
    let messagePollInterval;
    
    async function loadChatRoom(chatId) {
        const messagesContainer = document.getElementById('messagesContainer');
        const sendBtn = document.getElementById('sendBtn');
        const input = document.getElementById('messageInput');
        
        let chats = getStoredChats();
        let currentChat = chats.find(c => c.id === chatId);

        // Remote attempt with safe timeout
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`${BACKEND_URL}/api/chats/${userId}`, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (res.ok) {
                const remoteChats = await res.json();
                if (Array.isArray(remoteChats)) {
                    const match = remoteChats.find(c => c.id === chatId);
                    if (match) currentChat = match;
                }
            }
        } catch (e) {
            // fallback
        }

        if (!currentChat) {
            // If chat was created dynamically from property-view (e.g. chat-1), create one on the fly
            const propId = chatId.replace('chat-', '');
            const prop = window.getPropertyById ? window.getPropertyById(propId) : null;
            currentChat = {
                id: chatId,
                buyer_id: userId,
                seller_id: prop ? prop.host_id : 'host-default',
                buyer: { full_name: currentUser.name || 'You', avatar_url: '../assets/profile.png' },
                seller: { full_name: prop ? prop.seller_name : 'Property Agent', avatar_url: prop ? prop.seller_image : '../assets/profile.png' },
                properties: {
                    id: prop ? prop.id : propId,
                    title: prop ? prop.title : 'Luxury Property',
                    city: prop ? prop.city : 'NCR'
                },
                updated_at: new Date().toISOString(),
                messages: [
                    { id: 'm-init', sender_id: 'host', content: `Hello! Thank you for your interest in ${prop ? prop.title : 'this property'}. How can we assist you with pricing, site tours, or floor plans today?`, timestamp: new Date().toISOString() }
                ]
            };
            chats.unshift(currentChat);
            saveStoredChats(chats);
        }
        
        const isBuyer = currentChat.buyer_id === userId;
        const otherPerson = isBuyer ? currentChat.seller : currentChat.buyer;
        const otherName = otherPerson?.full_name || otherPerson?.name || otherPerson?.display_name || 'Agent';
        const otherAvatar = otherPerson?.avatar_url || otherPerson?.photo || '../assets/profile.png';
        const propTitle = currentChat.properties?.title || 'Property';

        // Setup Header
        const headerTop = document.querySelector('.header-top');
        const chatTabs = document.querySelector('.chat-tabs');
        if (chatTabs) chatTabs.style.display = 'none';
        
        headerTop.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                <button onclick="window.location.href='messages.html'" style="background: #f1f5f9; border: none; width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;">
                    <i data-lucide="arrow-left" style="width: 18px; height: 18px; color: #111;"></i>
                </button>
                <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
                    <div style="width: 38px; height: 38px; border-radius: 50%; background: #eee; overflow: hidden; flex-shrink: 0; border: 1.5px solid #2D68FF;">
                        <img src="${otherAvatar}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='../assets/profile.png'">
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <h1 style="margin: 0; font-size: 16px; font-weight: 800; color: #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${otherName}</h1>
                        <p style="margin: 0; font-size: 11px; color: #2D68FF; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Re: ${propTitle}</p>
                    </div>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        
        let existingMessageIds = new Set();
        
        function renderMessage(msg) {
            if (existingMessageIds.has(msg.id)) return;
            existingMessageIds.add(msg.id);
            
            const isMe = msg.sender_id === userId;
            const bubble = document.createElement('div');
            bubble.style.maxWidth = '78%';
            bubble.style.padding = '12px 16px';
            bubble.style.borderRadius = isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px';
            bubble.style.background = isMe ? 'linear-gradient(135deg, #2D68FF 0%, #1e40af 100%)' : 'white';
            bubble.style.color = isMe ? 'white' : '#111';
            bubble.style.alignSelf = isMe ? 'flex-end' : 'flex-start';
            bubble.style.boxShadow = isMe ? '0 4px 15px rgba(45,104,255,0.2)' : '0 2px 10px rgba(0,0,0,0.04)';
            bubble.style.fontSize = '14px';
            bubble.style.lineHeight = '1.45';
            bubble.style.border = isMe ? 'none' : '1px solid rgba(0,0,0,0.04)';
            bubble.textContent = msg.content;
            
            messagesContainer.appendChild(bubble);
        }

        async function fetchMessages() {
            let messages = [];
            let fetched = false;
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);
                const res = await fetch(`${BACKEND_URL}/api/chats/${chatId}/messages`, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        messages = data;
                        fetched = true;
                    }
                }
            } catch (e) { }

            if (!fetched) {
                const storedKey = `househunt_chat_msgs_${chatId}`;
                const localSaved = localStorage.getItem(storedKey);
                if (localSaved) {
                    try { messages = JSON.parse(localSaved); } catch (e) { }
                } else if (currentChat.messages && currentChat.messages.length > 0) {
                    messages = currentChat.messages;
                } else {
                    messages = [
                        { id: 'm-default', sender_id: 'host', content: `Hello! Looking forward to helping you with ${propTitle}. Feel free to ask any questions regarding floor plans or visits.` }
                    ];
                }
            }

            messages.forEach(msg => renderMessage(msg));
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        await fetchMessages();
        
        function saveLocalMessage(msg) {
            const storedKey = `househunt_chat_msgs_${chatId}`;
            let list = [];
            try {
                list = JSON.parse(localStorage.getItem(storedKey) || '[]');
            } catch (e) { list = []; }
            if (list.length === 0 && currentChat.messages) {
                list = [...currentChat.messages];
            }
            list.push(msg);
            localStorage.setItem(storedKey, JSON.stringify(list));
            
            // update chat last updated
            chats = getStoredChats();
            const idx = chats.findIndex(c => c.id === chatId);
            if (idx !== -1) {
                chats[idx].updated_at = new Date().toISOString();
                chats[idx].messages = list;
                saveStoredChats(chats);
            }
        }

        async function sendMessage() {
            const text = input.value.trim();
            if (!text) return;
            
            input.value = '';
            
            const newMsg = {
                id: 'msg-' + Date.now(),
                sender_id: userId,
                content: text,
                timestamp: new Date().toISOString()
            };
            
            renderMessage(newMsg);
            saveLocalMessage(newMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Optional remote post
            try {
                fetch(`${BACKEND_URL}/api/chats/${chatId}/messages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sender_id: userId, content: text })
                }).catch(() => {});
            } catch (e) {}

            // Realistic client-side simulated reply after 1.2s for wow-factor demo!
            setTimeout(() => {
                const autoReplies = [
                    "Thank you for contacting us! I have notified our prime property consultant who will assist you with this immediately.",
                    "Noted! We have reserved your preferred inspection slot and our representative will call you shortly.",
                    "Certainly! All verified legal documentation, floor blueprints, and verified price sheets are ready for your review.",
                    "Understood. We can coordinate an on-site virtual 360-degree tour or private chauffeur pickup for your property visit."
                ];
                const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
                const replyMsg = {
                    id: 'reply-' + Date.now(),
                    sender_id: otherPerson?.id || 'host-reply',
                    content: replyText,
                    timestamp: new Date().toISOString()
                };
                renderMessage(replyMsg);
                saveLocalMessage(replyMsg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 1200);
        }
        
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const suggestions = document.querySelectorAll('.suggestion');

    const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000'
        : 'https://backend.househunt.live';

    const addMessage = (text, isUser = false, isTyping = false) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        const innerContent = isTyping ? `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        ` : text;

        msgDiv.innerHTML = `
            <div class="avatar">${isUser ? '👤' : '<img src="../assets/aipage.png" alt="AI">'}</div>
            <div class="text">${innerContent}</div>
        `;
        
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        if (window.gsap) {
            gsap.from(msgDiv, {
                y: 30,
                opacity: 0,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        }
        return msgDiv;
    };

    // Personalized Welcome Message
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const firstName = user.name ? user.name.split(' ')[0] : 'there';
    setTimeout(() => {
        addMessage(`Hi ${firstName}! I am **HuntAI**, your dedicated Delhi NCR real estate specialist. Tell me your preferred location, budget, or configuration (e.g. *"3 BHK in Noida under 2 Cr"*), and I'll find you the perfect match.`);
    }, 500);

    // Smart Local AI Response Engine
    const generateLocalResponse = (prompt) => {
        const lower = prompt.toLowerCase();
        const properties = window.getAllProperties ? window.getAllProperties() : (window.propertyData || []);

        let matched = properties.filter(p => {
            const text = `${p.title} ${p.type} ${p.location} ${p.city} ${p.intent} ${p.price} ${p.description}`.toLowerCase();
            if (lower.includes('noida') && text.includes('noida')) return true;
            if (lower.includes('gurgaon') && text.includes('gurgaon')) return true;
            if (lower.includes('delhi') && text.includes('delhi')) return true;
            if (lower.includes('villa') && (p.type.includes('Villa') || p.property_type === 'Villa')) return true;
            if (lower.includes('plot') && (p.type.includes('Plot') || p.property_type === 'Plot')) return true;
            if (lower.includes('rent') && p.intent === 'Rent') return true;
            if (lower.includes('3 bhk') && (text.includes('3 bhk') || text.includes('3 beds'))) return true;
            if (lower.includes('2 bhk') && (text.includes('2 bhk') || text.includes('2 beds'))) return true;
            return false;
        });

        if (matched.length === 0) {
            matched = properties.slice(0, 3);
        }

        const topPicks = matched.slice(0, 3);

        let responseText = `Here are the top verified options based on your search for **"${prompt}"**:\n\n`;
        topPicks.forEach(p => {
            responseText += `🏡 **[${p.title || p.type}](property-view.html?id=${p.id})**\n`;
            responseText += `- **Price:** ${p.price}\n`;
            responseText += `- **Location:** ${p.location}\n`;
            responseText += `- **Highlight:** ${p.details?.area ? p.details.area + ' sqft • ' : ''}${p.tag || 'Verified'}\n\n`;
        });

        responseText += `💡 *Tip: You can tap on any property title to view HD photos, floor plan, and connect directly with the owner without brokerage fees.*`;

        return responseText;
    };

    const handleSend = async () => {
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, true);
        userInput.value = '';

        // Typing Indicator
        const typingDiv = addMessage("", false, true);
        const typingTextContainer = typingDiv.querySelector('.text');

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);

            const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    typingTextContainer.innerHTML = window.marked ? marked.parse(aiResponse) : aiResponse;
                    return;
                }
            }
            throw new Error("Using fallback NLP engine");
        } catch (e) {
            // Intelligent domain-specific response
            setTimeout(() => {
                const fallbackResponse = generateLocalResponse(text);
                typingTextContainer.innerHTML = window.marked ? marked.parse(fallbackResponse) : fallbackResponse;
            }, 600);
        }
    };

    sendBtn.onclick = handleSend;
    userInput.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

    suggestions.forEach(s => {
        s.onclick = () => {
            userInput.value = s.innerText;
            handleSend();
        };
    });
});

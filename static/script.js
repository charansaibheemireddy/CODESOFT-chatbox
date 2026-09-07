const chatForm = document.getElementById('chatForm');
const userQuery = document.getElementById('userQuery');
const messagesContainer = document.getElementById('messagesContainer');
const welcomeCard = document.getElementById('welcomeCard');
const chatViewport = document.getElementById('chatViewport');

const JOKES = [
    "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
    "There are 10 types of people: those who understand binary, and those who don't.",
    "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
    "Why did the JavaScript developer wear glasses? Because they didn't C#."
];

const TECH_TIPS = [
    "💡 Tip: Use descriptive variable names — clean code is self-documenting.",
    "💡 Tip: Always sanitize user inputs to prevent security vulnerabilities.",
    "💡 Tip: Commit small and commit often!"
];

// Replicating your Python chatbot logic in JavaScript
function getChatbotResponse(input) {
    const clean = input.toLowerCase().trim();

    // 1. Greetings
    if (/\b(hello|hi|hey|hola|greetings|sup)\b/.test(clean)) {
        return "👋 Hello! I am your AI assistant. How can I help you today?";
    }
    // 2. Well-being
    else if (/\b(how are you|how's it going|how do you do)\b/.test(clean)) {
        return "⚡ I'm doing great, thank you for asking! Ready to help you with your tasks.";
    }
    // 3. Time & Date
    else if (/\b(time|date|day|clock)\b/.test(clean)) {
        const now = new Date();
        return `🕒 Today's date is <b>${now.toDateString()}</b> and the current time is <b>${now.toLocaleTimeString()}</b>.`;
    }
    // 4. Identity
    else if (/\b(who are you|your name|what do you do)\b/.test(clean)) {
        return "🤖 I am a rule-based AI chatbot built for my internship task!";
    }
    // 5. Jokes
    else if (/\b(joke|funny|laugh)\b/.test(clean)) {
        return `🎭 ${JOKES[Math.floor(Math.random() * JOKES.length)]}`;
    }
    // 6. Tips
    else if (/\b(tip|advice|quote|motivation)\b/.test(clean)) {
        return TECH_TIPS[Math.floor(Math.random() * TECH_TIPS.length)];
    }
    // 7. Basic Calculations
    else if (/\b(calculate|what is|compute)\b/.test(clean) || /\d+\s*[\+\-\*\/]\s*\d+/.test(clean)) {
        const expr = clean.replace(/[^0-9+\-*/().]/g, '');
        if (expr) {
            try {
                const res = Function(`'use strict'; return (${expr})`)();
                return `🔢 Calculation: <code>${expr} = ${res}</code>`;
            } catch (e) {
                return "⚠️ Could not compute that expression.";
            }
        }
    }
    // 8. Help
    else if (/\b(help|support|assist|features)\b/.test(clean)) {
        return "💡 <b>Things you can ask:</b><br>• Current <i>time</i> or <i>date</i><br>• Tell a <i>joke</i><br>• Give a <i>coding tip</i><br>• Math like <i>calculate 25 * 4</i><br>• Or say <i>bye</i>";
    }
    // 9. Farewell
    else if (/\b(bye|goodbye|exit|see you)\b/.test(clean)) {
        return "👋 Goodbye! Have a fantastic day ahead.";
    }
    // 10. Fallback
    else {
        return "🤔 I'm sorry, I didn't quite catch that. Could you please rephrase your question or type <b>'help'</b>?";
    }
}

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = userQuery.value.trim();
    if (!message) return;

    if (welcomeCard) welcomeCard.style.display = 'none';

    appendMessage(message, 'user');
    userQuery.value = '';

    showTyping();

    setTimeout(() => {
        removeTyping();
        const reply = getChatbotResponse(message);
        appendMessage(reply, 'bot');
    }, 400);
});

function appendMessage(text, sender) {
    const row = document.createElement('div');
    row.className = `message-row ${sender}`;
    const icon = sender === 'bot' ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user"></i>';

    row.innerHTML = sender === 'bot'
        ? `<div class="avatar-bubble">${icon}</div><div class="bubble-content">${text}</div>`
        : `<div class="bubble-content">${text}</div><div class="avatar-bubble">${icon}</div>`;

    messagesContainer.appendChild(row);
    chatViewport.scrollTop = chatViewport.scrollHeight;
}

function showTyping() {
    const indicator = document.createElement('div');
    indicator.id = 'activeTyping';
    indicator.className = 'message-row bot';
    indicator.innerHTML = `
        <div class="avatar-bubble"><i class="fa-solid fa-robot"></i></div>
        <div class="bubble-content typing">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    messagesContainer.appendChild(indicator);
    chatViewport.scrollTop = chatViewport.scrollHeight;
}

function removeTyping() {
    const el = document.getElementById('activeTyping');
    if (el) el.remove();
}

function sendPrompt(text) {
    userQuery.value = text;
    chatForm.dispatchEvent(new Event('submit'));
}

function clearMessages() {
    messagesContainer.innerHTML = '';
    if (welcomeCard) welcomeCard.style.display = 'flex';
}

function startNewChat() {
    clearMessages();
    userQuery.focus();
}

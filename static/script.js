const chatForm = document.getElementById('chatForm');
const userQuery = document.getElementById('userQuery');
const messagesContainer = document.getElementById('messagesContainer');
const welcomeCard = document.getElementById('welcomeCard');
const chatViewport = document.getElementById('chatViewport');

// Form Submit Handler
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userQuery.value.trim();
    if (!message) return;

    // Remove welcome placeholder on first interaction
    if (welcomeCard) {
        welcomeCard.style.display = 'none';
    }

    // 1. Render User Message
    appendMessage(message, 'user');
    userQuery.value = '';

    // 2. Show Animated Typing Indicator
    showTyping();

    // 3. Send Request to Flask API
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        removeTyping();

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        appendMessage(data.response, 'bot');
    } catch (err) {
        removeTyping();
        console.error("Connection Error:", err);
        appendMessage("⚠️ <b>Connection Error:</b> Ensure your Python server (`python app.py`) is running.", 'bot');
    }
});

// Append Message Bubbles
function appendMessage(htmlContent, sender) {
    const row = document.createElement('div');
    row.className = `message-row ${sender}`;

    const icon = sender === 'bot' 
        ? '<i class="fa-solid fa-robot"></i>' 
        : '<i class="fa-solid fa-user"></i>';

    if (sender === 'bot') {
        row.innerHTML = `
            <div class="avatar-bubble">${icon}</div>
            <div class="bubble-content">${htmlContent}</div>
        `;
    } else {
        row.innerHTML = `
            <div class="bubble-content">${htmlContent}</div>
            <div class="avatar-bubble">${icon}</div>
        `;
    }

    messagesContainer.appendChild(row);
    chatViewport.scrollTop = chatViewport.scrollHeight;
}

// Typing Indicator Helpers
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
    const active = document.getElementById('activeTyping');
    if (active) active.remove();
}

// Trigger Prompts from Sidebar
function sendPrompt(text) {
    userQuery.value = text;
    chatForm.dispatchEvent(new Event('submit'));
}

// Clear Messages
function clearMessages() {
    messagesContainer.innerHTML = '';
    if (welcomeCard) welcomeCard.style.display = 'flex';
}

function startNewChat() {
    clearMessages();
    userQuery.focus();
}

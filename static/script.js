const chatBody = document.getElementById('chatBody');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const clearChatBtn = document.getElementById('clearChat');
const voiceBtn = document.getElementById('voiceBtn');

// Send Message Handler
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // Display user message
    appendMessage(message, 'user');
    userInput.value = '';

    // Show AI typing animation
    showTypingIndicator();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        removeTypingIndicator();
        appendMessage(data.response, 'bot', data.timestamp);
    } catch (err) {
        removeTypingIndicator();
        appendMessage("⚠️ Could not connect to the Python server.", 'bot');
    }
});

// Append Message to UI
function appendMessage(text, sender, time = null) {
    const currentTime = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', `${sender}-message`);

    msgDiv.innerHTML = `
        <div class="message-content">${text}</div>
        <span class="timestamp">${currentTime}</span>
    `;

    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Quick Chip Action
function sendQuickPrompt(promptText) {
    userInput.value = promptText;
    chatForm.dispatchEvent(new Event('submit'));
}

// Typing Indicator
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatBody.appendChild(indicator);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Clear Chat
clearChatBtn.addEventListener('click', () => {
    chatBody.innerHTML = `
        <div class="message bot-message">
            <div class="message-content">✨ Chat cleared. How can I help you?</div>
            <span class="timestamp">Just now</span>
        </div>
    `;
});

// Voice Recognition (Web Speech API)
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    voiceBtn.addEventListener('click', () => {
        voiceBtn.style.color = '#ef4444';
        recognition.start();
    });

    recognition.onresult = (event) => {
        userInput.value = event.results[0][0].transcript;
        voiceBtn.style.color = '#fff';
        chatForm.dispatchEvent(new Event('submit'));
    };

    recognition.onerror = () => { voiceBtn.style.color = '#fff'; };
    recognition.onend = () => { voiceBtn.style.color = '#fff'; };
} else {
    voiceBtn.style.display = 'none'; // Hide if browser doesn't support
}

/* =========================================================
   ULTROX - Intelligent Local AI Assistant
   ========================================================= */


/* ================= DOM ELEMENTS ================= */

const chatForm = document.getElementById("chatForm");
const userQuery = document.getElementById("userQuery");
const messagesContainer =
    document.getElementById("messagesContainer");

const welcomeCard =
    document.getElementById("welcomeCard");

const chatViewport =
    document.getElementById("chatViewport");

const newChatBtn =
    document.getElementById("newChatBtn");

const clearChatBtn =
    document.getElementById("clearChatBtn");

const commandBtn =
    document.getElementById("commandBtn");

const commandModal =
    document.getElementById("commandModal");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const sendBtn =
    document.getElementById("sendBtn");


/* ================= DATA ================= */

const JOKES = [

    "Why do programmers prefer dark mode? Because light attracts bugs.",

    "A programmer's favorite place? The cache.",

    "Why did the developer go broke? Because he used up all his cache.",

    "There are only 10 kinds of people: those who understand binary and those who don't.",

    "Why do Java developers wear glasses? Because they don't see sharp."
];


const TECH_TIPS = [

    "Use meaningful variable names. Code is read more often than it is written.",

    "Always validate user input before processing it.",

    "Keep your functions small and focused on one responsibility.",

    "Use version control such as Git for important projects.",

    "Never store passwords as plain text. Use secure password hashing.",

    "Keep dependencies updated and remove packages you don't need.",

    "Use HTTPS whenever sensitive information is transmitted.",

    "Test edge cases instead of testing only normal inputs."
];


const SECURITY_TIPS = [

    "Use multi-factor authentication whenever possible.",

    "Never reuse passwords across important accounts.",

    "Keep your operating system and security software updated.",

    "Be suspicious of unexpected links and attachments.",

    "Use least privilege: give accounts only the permissions they need.",

    "Back up important data and periodically test your backups.",

    "Avoid exposing sensitive services directly to the public internet.",

    "Monitor authentication logs for unusual login activity.",

    "Never hard-code API keys, passwords, or secrets into public repositories.",

    "Use input validation and output encoding to reduce injection risks."
];


/* ================= STATE ================= */

let isTyping = false;

let conversation = [];


/* ================= HELPERS ================= */

function randomItem(array) {

    return array[
        Math.floor(Math.random() * array.length)
    ];
}


function getCurrentTime() {

    const now = new Date();

    return now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}


function getCurrentDate() {

    const now = new Date();

    return now.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}


/* ================= SAFE CALCULATOR ================= */

/*
   We intentionally do NOT use eval() or Function().
   Instead, only basic arithmetic characters are accepted.
*/

function calculateExpression(expression) {

    let clean = expression
        .replace(/,/g, "")
        .replace(/x/gi, "*")
        .replace(/÷/g, "/")
        .replace(/\s+/g, "");

    /*
       Allow only:

       numbers
       decimal points
       + - * / %
       parentheses
    */

    if (!/^[0-9+\-*/%.()]+$/.test(clean)) {
        return null;
    }

    /*
       Prevent suspicious repeated operators.
    */

    if (
        /[*/%]{2,}/.test(clean) ||
        /\.\.+/.test(clean)
    ) {
        return null;
    }

    /*
       Convert percentage:

       50% -> (50/100)

       This handles simple percentage calculations.
    */

    clean = clean.replace(
        /(\d+(?:\.\d+)?)%/g,
        "($1/100)"
    );

    /*
       Tokenizer + recursive descent parser.
    */

    let position = 0;


    function parseExpression() {

        let value = parseTerm();

        while (
            clean[position] === "+" ||
            clean[position] === "-"
        ) {

            const operator =
                clean[position++];

            const right = parseTerm();

            if (operator === "+") {
                value += right;
            } else {
                value -= right;
            }
        }

        return value;
    }


    function parseTerm() {

        let value = parseFactor();

        while (
            clean[position] === "*" ||
            clean[position] === "/"
        ) {

            const operator =
                clean[position++];

            const right = parseFactor();

            if (operator === "*") {

                value *= right;

            } else {

                if (right === 0) {
                    throw new Error(
                        "Division by zero"
                    );
                }

                value /= right;
            }
        }

        return value;
    }


    function parseFactor() {

        if (clean[position] === "+") {

            position++;

            return parseFactor();
        }


        if (clean[position] === "-") {

            position++;

            return -parseFactor();
        }


        if (clean[position] === "(") {

            position++;

            const value =
                parseExpression();

            if (clean[position] !== ")") {
                throw new Error("Invalid expression");
            }

            position++;

            return value;
        }


        const start = position;

        while (
            /[0-9.]/.test(
                clean[position] || ""
            )
        ) {
            position++;
        }


        if (start === position) {
            throw new Error("Invalid number");
        }


        const number =
            Number(clean.slice(start, position));


        if (!Number.isFinite(number)) {
            throw new Error("Invalid number");
        }


        return number;
    }


    try {

        const result =
            parseExpression();


        if (position !== clean.length) {
            return null;
        }


        if (!Number.isFinite(result)) {
            return null;
        }


        return Number(
            result.toFixed(10)
        );

    } catch {

        return null;
    }
}


/* ================= RESPONSE ENGINE ================= */

function getChatbotResponse(input) {

    const text = input
        .trim()
        .toLowerCase();


    /* Empty input */

    if (!text) {

        return "Please enter a message and I'll do my best to help.";
    }


    /* ================= GREETINGS ================= */

    if (
        /^(hi|hello|hey|hii|good morning|good afternoon|good evening|yo)\b/
            .test(text)
    ) {

        return randomItem([

            "Hello! I'm ULTROX. How can I help you?",

            "Hey! ULTROX is online and ready.",

            "Welcome back. What would you like to explore?",

            "Hello! Ask me about coding, cybersecurity, calculations, or my features."

        ]);
    }


    /* ================= HOW ARE YOU ================= */

    if (
        text.includes("how are you") ||
        text.includes("how r u") ||
        text.includes("how do you feel")
    ) {

        return "I'm running normally and ready to assist. What would you like to do?";
    }


    /* ================= IDENTITY ================= */

    if (
        text.includes("who are you") ||
        text.includes("what are you") ||
        text.includes("your name")
    ) {

        return (
            "I'm ULTROX — a local rule-based AI assistant " +
            "designed for coding, cybersecurity learning, " +
            "calculations, system information, and general assistance."
        );
    }


    /* ================= TIME ================= */

    if (
        text.includes("time") ||
        text.includes("date") ||
        text.includes("today")
    ) {

        return (
            `Current time: ${getCurrentTime()}\n` +
            `Date: ${getCurrentDate()}`
        );
    }


    /* ================= JOKE ================= */

    if (
        text.includes("joke") ||
        text.includes("make me laugh") ||
        text.includes("funny")
    ) {

        return randomItem(JOKES);
    }


    /* ================= CODING TIP ================= */

    if (
        text.includes("coding tip") ||
        text.includes("programming tip") ||
        text === "tip" ||
        text === "tips"
    ) {

        return randomItem(TECH_TIPS);
    }


    /* ================= SECURITY ================= */

    if (
        text.includes("security tip") ||
        text.includes("cybersecurity tip") ||
        text.includes("cyber security tip") ||
        text === "security" ||
        text.includes("cybersecurity")
    ) {

        return (
            "🛡️ Security Tip:\n\n" +
            randomItem(SECURITY_TIPS)
        );
    }


    /* ================= FEATURES ================= */

    if (
        text.includes("features") ||
        text.includes("what can you do") ||
        text.includes("commands") ||
        text.includes("help") ||
        text.includes("capabilities")
    ) {

        return (
            "ULTROX currently supports:\n\n" +

            "• Natural-language greetings\n" +
            "• Time and date information\n" +
            "• Developer jokes\n" +
            "• Coding tips\n" +
            "• Cybersecurity tips\n" +
            "• Safe arithmetic calculations\n" +
            "• System/browser information\n" +
            "• Local conversation history\n" +
            "• Command guide\n" +
            "• Responsive desktop and mobile UI\n\n" +

            "Try: \"calculate 25 * 8\" or \"give me a security tip\"."
        );
    }


    /* ================= SYSTEM CHECK ================= */

    if (
        text.includes("system check") ||
        text.includes("system status") ||
        text.includes("check system")
    ) {

        return (
            "🟢 ULTROX System Check\n\n" +

            "Interface: Operational\n" +
            "Chat Engine: Operational\n" +
            "Calculator: Operational\n" +
            "Security Mode: Enabled\n" +
            `Browser: ${navigator.userAgent.split(")")[0]})\n` +
            `Language: ${navigator.language}\n` +
            `Online Status: ${navigator.onLine ? "Online" : "Offline"}`
        );
    }


    /* ================= BROWSER ================= */

    if (
        text.includes("browser") ||
        text.includes("device information") ||
        text.includes("my system")
    ) {

        return (
            "Your browser environment reports:\n\n" +

            `Language: ${navigator.language}\n` +
            `Platform: ${navigator.platform}\n` +
            `Online: ${navigator.onLine ? "Yes" : "No"}\n` +
            `Screen: ${screen.width} × ${screen.height}\n` +
            `Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`
        );
    }


    /* ================= CALCULATOR ================= */

    const calculationMatch =
        text.match(
            /^(?:calculate|calc|what is|solve)\s+(.+)$/
        );


    if (calculationMatch) {

        const expression =
            calculationMatch[1];

        const result =
            calculateExpression(expression);


        if (result === null) {

            return (
                "I couldn't safely evaluate that expression.\n\n" +
                "Try something like:\n" +
                "calculate 25 * 8\n" +
                "calculate (100 + 50) / 3\n" +
                "calculate 20% * 500"
            );
        }


        return `🧮 Result: ${result}`;
    }


    /*
       Also recognize plain arithmetic input.
    */

    if (
        /^[0-9+\-*/%.()\sx÷]+$/i.test(text) &&
        /\d/.test(text) &&
        /[+\-*/%x÷]/i.test(text)
    ) {

        const result =
            calculateExpression(text);


        if (result !== null) {
            return `🧮 Result: ${result}`;
        }
    }


    /* ================= THANK YOU ================= */

    if (
        text.includes("thank you") ||
        text === "thanks" ||
        text === "thx"
    ) {

        return randomItem([

            "You're welcome! 🚀",

            "Anytime. ULTROX is ready for the next task.",

            "Glad I could help!"

        ]);
    }


    /* ================= FAREWELL ================= */

    if (
        /^(bye|goodbye|see you|exit|quit)\b/
            .test(text)
    ) {

        return "Goodbye! ULTROX will be here when you need it.";
    }


    /* ================= FALLBACK ================= */

    return (
        "I understand your message, but I don't have a specific " +
        "built-in response for that yet.\n\n" +

        "Try asking me to:\n" +

        "• calculate something\n" +
        "• give a cybersecurity tip\n" +
        "• give a coding tip\n" +
        "• tell a joke\n" +
        "• show the current time\n" +
        "• run a system check\n" +
        "• show my features"
    );
}


/* ================= MESSAGE UI ================= */

function appendMessage(sender, message) {

    const row =
        document.createElement("div");

    row.className =
        `message-row ${sender}`;


    const avatar =
        document.createElement("div");

    avatar.className =
        "avatar-bubble";


    const avatarIcon =
        document.createElement("i");

    avatarIcon.className =
        sender === "bot"
            ? "fa-solid fa-bolt"
            : "fa-solid fa-user";


    avatar.appendChild(avatarIcon);


    const bubble =
        document.createElement("div");

    bubble.className =
        "bubble-content";


    /*
       IMPORTANT:

       Use textContent rather than innerHTML
       for user-controlled text.
    */

    bubble.textContent = message;


    if (sender === "user") {

        row.appendChild(bubble);
        row.appendChild(avatar);

    } else {

        row.appendChild(avatar);
        row.appendChild(bubble);
    }


    messagesContainer.appendChild(row);


    conversation.push({
        sender,
        message,
        time: Date.now()
    });


    saveConversation();


    scrollToBottom();
}


/* ================= TYPING ================= */

function showTyping() {

    if (isTyping) {
        return;
    }

    isTyping = true;


    const row =
        document.createElement("div");

    row.className =
        "typing-row";

    row.id =
        "typingIndicator";


    const avatar =
        document.createElement("div");

    avatar.className =
        "avatar-bubble";

    avatar.innerHTML =
        '<i class="fa-solid fa-bolt"></i>';


    const typing =
        document.createElement("div");

    typing.className =
        "typing";


    typing.innerHTML = `
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    `;


    row.appendChild(avatar);
    row.appendChild(typing);

    messagesContainer.appendChild(row);


    scrollToBottom();
}


function removeTyping() {

    const indicator =
        document.getElementById(
            "typingIndicator"
        );


    if (indicator) {
        indicator.remove();
    }


    isTyping = false;
}


/* ================= SEND PROMPT ================= */

function sendPrompt(prompt) {

    if (!prompt || isTyping) {
        return;
    }


    userQuery.value = prompt;

    chatForm.requestSubmit();
}


/* ================= FORM SUBMIT ================= */

chatForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const input =
            userQuery.value.trim();


        if (!input || isTyping) {
            return;
        }


        if (input.length > 500) {

            appendMessage(
                "bot",
                "Please keep your message under 500 characters."
            );

            return;
        }


        /*
           Hide welcome screen after first message.
        */

        welcomeCard.style.display = "none";


        appendMessage(
            "user",
            input
        );


        userQuery.value = "";


        sendBtn.disabled = true;


        showTyping();


        /*
           Small delay makes the interaction
           feel more natural.
        */

        setTimeout(
            function () {

                removeTyping();


                const response =
                    getChatbotResponse(input);


                appendMessage(
                    "bot",
                    response
                );


                sendBtn.disabled = false;

                userQuery.focus();

            },
            450
        );
    }
);


/* ================= NEW CHAT ================= */

function startNewChat() {

    if (conversation.length > 0) {

        const confirmed =
            confirm(
                "Start a new conversation? Your current chat will be cleared."
            );


        if (!confirmed) {
            return;
        }
    }


    clearMessages(false);
}


/* ================= CLEAR CHAT ================= */

function clearMessages(ask = true) {

    if (
        ask &&
        conversation.length > 0
    ) {

        const confirmed =
            confirm(
                "Clear the current conversation?"
            );


        if (!confirmed) {
            return;
        }
    }


    messagesContainer.innerHTML = "";

    conversation = [];

    localStorage.removeItem(
        "ultroxConversation"
    );


    welcomeCard.style.display =
        "flex";


    userQuery.value = "";

    userQuery.focus();
}


/* ================= LOCAL STORAGE ================= */

function saveConversation() {

    try {

        localStorage.setItem(
            "ultroxConversation",
            JSON.stringify(conversation)
        );

    } catch (error) {

        console.warn(
            "Could not save conversation.",
            error
        );
    }
}


function loadConversation() {

    try {

        const saved =
            localStorage.getItem(
                "ultroxConversation"
            );


        if (!saved) {
            return;
        }


        const parsed =
            JSON.parse(saved);


        if (
            !Array.isArray(parsed) ||
            parsed.length === 0
        ) {
            return;
        }


        conversation = [];


        welcomeCard.style.display =
            "none";


        parsed.forEach(
            item => {

                if (
                    item &&
                    (
                        item.sender === "user" ||
                        item.sender === "bot"
                    ) &&
                    typeof item.message === "string"
                ) {

                    appendMessageWithoutSaving(
                        item.sender,
                        item.message
                    );
                }
            }
        );


        /*
           Rebuild state without duplicating
           localStorage entries.
        */

        conversation = parsed;

        scrollToBottom();

    } catch (error) {

        console.warn(
            "Could not load conversation.",
            error
        );

        localStorage.removeItem(
            "ultroxConversation"
        );
    }
}


function appendMessageWithoutSaving(
    sender,
    message
) {

    const row =
        document.createElement("div");

    row.className =
        `message-row ${sender}`;


    const avatar =
        document.createElement("div");

    avatar.className =
        "avatar-bubble";


    const icon =
        document.createElement("i");

    icon.className =
        sender === "bot"
            ? "fa-solid fa-bolt"
            : "fa-solid fa-user";


    avatar.appendChild(icon);


    const bubble =
        document.createElement("div");

    bubble.className =
        "bubble-content";


    bubble.textContent =
        message;


    if (sender === "user") {

        row.appendChild(bubble);
        row.appendChild(avatar);

    } else {

        row.appendChild(avatar);
        row.appendChild(bubble);
    }


    messagesContainer.appendChild(row);
}


/* ================= SCROLL ================= */

function scrollToBottom() {

    requestAnimationFrame(
        function () {

            chatViewport.scrollTo({
                top: chatViewport.scrollHeight,
                behavior: "smooth"
            });

        }
    );
}


/* ================= QUICK ACTIONS ================= */

document
    .querySelectorAll("[data-prompt]")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    sendPrompt(
                        button.dataset.prompt
                    );

                }
            );
        }
    );


/* ================= COMMAND MODAL ================= */

function openCommandModal() {

    commandModal.classList.add(
        "active"
    );
}


function closeCommandModal() {

    commandModal.classList.remove(
        "active"
    );
}


commandBtn.addEventListener(
    "click",
    openCommandModal
);


closeModalBtn.addEventListener(
    "click",
    closeCommandModal
);


commandModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === commandModal
        ) {

            closeCommandModal();
        }
    }
);


/* ================= KEYBOARD ================= */

document.addEventListener(
    "keydown",
    function (event) {

        /*
           Ctrl + K / Cmd + K
        */

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            userQuery.focus();

            return;
        }


        /*
           Escape closes modal.
        */

        if (event.key === "Escape") {

            closeCommandModal();

            return;
        }
    }
);


/* ================= BUTTON EVENTS ================= */

newChatBtn.addEventListener(
    "click",
    function () {

        startNewChat();

    }
);


clearChatBtn.addEventListener(
    "click",
    function () {

        clearMessages(true);

    }
);


/* ================= ONLINE STATUS ================= */

window.addEventListener(
    "online",
    function () {

        console.log(
            "ULTROX: Browser is online."
        );

    }
);


window.addEventListener(
    "offline",
    function () {

        console.log(
            "ULTROX: Browser is offline."
        );

    }
);


/* ================= STARTUP ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadConversation();

        userQuery.focus();

    }
);

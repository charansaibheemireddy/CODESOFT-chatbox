import re
import random
from datetime import datetime
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Sample intelligent knowledge base
JOKES = [
    "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
    "There are 10 types of people: those who understand binary, and those who don't.",
    "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
    "Why did the JavaScript developer wear glasses? Because they didn't C#."
]

TECH_TIPS = [
    "💡 Tip: Use descriptive variable names — clean code is self-documenting.",
    "💡 Tip: Always sanitize user inputs to prevent SQL injection and XSS.",
    "💡 Tip: Use Git branches for features to keep your main branch deployment-ready."
]

def get_chatbot_response(user_input):
    user_input = user_input.lower().strip()
    
    # 1. Greetings
    if re.search(r'\b(hello|hi|hey|hola|greetings|sup|yo)\b', user_input):
        return "👋 Hello there! I'm <b>Nexus AI</b>. Ask me anything, request a code tip, or try some math!"
        
    # 2. Well-being
    elif re.search(r'\b(how are you|how\'s it going|how do you do)\b', user_input):
        return "⚡ Systems running at 100% efficiency. Ready to build something great today!"
        
    # 3. Date & Time
    elif re.search(r'\b(time|date|day|clock|today)\b', user_input):
        now = datetime.now()
        return f"🕒 Today is <b>{now.strftime('%A, %B %d, %Y')}</b> and the system time is <b>{now.strftime('%I:%M:%S %p')}</b>."
        
    # 4. Identity
    elif re.search(r'\b(who are you|your name|what are you|creator)\b', user_input):
        return "🤖 I am <b>Nexus AI</b>, an intelligent rule-based virtual assistant powered by Python & Flask!"

    # 5. Jokes
    elif re.search(r'\b(joke|funny|laugh|humor)\b', user_input):
        return f"🎭 {random.choice(JOKES)}"

    # 6. Tips & Motivation
    elif re.search(r'\b(tip|advice|quote|motivation|inspire)\b', user_input):
        return random.choice(TECH_TIPS)

    # 7. Math evaluation (e.g. "calc 12 * 8" or "what is 50 + 25")
    elif re.search(r'\b(calculate|what is|compute|calc|\d+\s*[\+\-\*\/]\s*\d+)\b', user_input):
        clean_expr = re.sub(r'[^0-9+\-*/().]', '', user_input)
        if clean_expr:
            try:
                result = eval(clean_expr, {"__builtins__": None}, {})
                return f"🔢 <b>Calculation Result:</b> <code>{clean_expr} = {result}</code>"
            except Exception:
                return "⚠️ Could not compute that expression. Example format: <code>calculate 25 * 4</code>"

    # 8. Help / Capabilities
    elif re.search(r'\b(help|commands|features|menu)\b', user_input):
        return (
            "✨ <b>Available Capabilities:</b><br>"
            "• 🕒 <i>'What time is it?'</i><br>"
            "• 🎭 <i>'Tell me a joke'</i><br>"
            "• 💡 <i>'Give me a developer tip'</i><br>"
            "• 🔢 <i>'Calculate 128 * 4'</i><br>"
            "• 🚪 <i>'Goodbye'</i> to finish"
        )

    # 9. Farewell
    elif re.search(r'\b(bye|goodbye|exit|see you|cya)\b', user_input):
        return "👋 Have a fantastic day! Session is ready whenever you return."

    # 10. Fallback
    else:
        return "🤔 I couldn't match that query directly. Type <b>'help'</b> to see available commands or try rephrasing!"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json(force=True)
        user_message = data.get('message', '')
        
        if not user_message.strip():
            return jsonify({'response': "Please type a message first!"}), 400
            
        bot_reply = get_chatbot_response(user_message)
        return jsonify({
            'response': bot_reply,
            'timestamp': datetime.now().strftime("%I:%M %p")
        })
    except Exception as e:
        return jsonify({'response': f"Server Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

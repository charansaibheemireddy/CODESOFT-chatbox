import re
import random
from datetime import datetime
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

JOKES = [
    "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
    "There are 10 types of people in the world: those who understand binary, and those who don't.",
    "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'"
]

TIPS = [
    "Tip: Always write unit tests before refactoring complex logic!",
    "Tip: Use descriptive variable names — code is read more often than it is written.",
    "Tip: Don't forget `git status` before making a giant commit!"
]

def get_chatbot_response(user_input):
    user_input = user_input.lower().strip()
    
    # 1. Greetings
    if re.search(r'\b(hello|hi|hey|hola|greetings|sup)\b', user_input):
        return "👋 Hello! I am your AI Assistant. How can I help you today?"
        
    # 2. Well-being
    elif re.search(r'\b(how are you|how\'s it going|how do you do|what\'s up)\b', user_input):
        return "⚡ I am running at 100% optimal performance and ready to assist you!"
        
    # 3. Date and Time
    elif re.search(r'\b(time|date|day|clock)\b', user_input):
        now = datetime.now()
        return f"🕒 Current date is <b>{now.strftime('%A, %B %d, %Y')}</b> and the time is <b>{now.strftime('%I:%M:%S %p')}</b>."
        
    # 4. Identity & Purpose
    elif re.search(r'\b(who are you|your name|what do you do|bot info)\b', user_input):
        return "🤖 I am <b>Nova AI</b>, a rule-based intelligent chatbot developed with Python & Flask."

    # 5. Jokes
    elif re.search(r'\b(joke|funny|laugh|make me smile)\b', user_input):
        return random.choice(JOKES)

    # 6. Coding Tips & Inspiration
    elif re.search(r'\b(tip|advice|quote|motivation|inspire)\b', user_input):
        return random.choice(TIPS)

    # 7. Basic Math Expressions (e.g., "calculate 25 * 4" or "what is 10 + 2")
    elif re.search(r'\b(calculate|what is|compute)\b', user_input):
        expression = re.sub(r'[^0-9+\-*/().]', '', user_input)
        if expression:
            try:
                # Safe evaluation of basic arithmetic
                result = eval(expression, {"__builtins__": None}, {})
                return f"🔢 Result: <b>{expression} = {result}</b>"
            except Exception:
                return "I couldn't calculate that math expression. Please try something like `calculate 12 * 8`."

    # 8. Help & Features
    elif re.search(r'\b(help|features|commands|capabilities)\b', user_input):
        return (
            "💡 <b>Here is what you can ask me:</b><br>"
            "• Ask for <i>time</i> or <i>date</i><br>"
            "• Tell me to tell a <i>joke</i><br>"
            "• Ask for a <i>coding tip</i><br>"
            "• Calculate expressions (e.g., <i>calculate 45 * 12</i>)<br>"
            "• Or just say hello!"
        )

    # 9. Farewell
    elif re.search(r'\b(bye|goodbye|exit|see you|cya)\b', user_input):
        return "👋 Goodbye! Have a fantastic day ahead. Feel free to return anytime!"

    # 10. Fallback
    else:
        return "🤔 I didn't quite catch that. Try asking for <i>'help'</i> to see what I can do!"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    user_message = data.get('message', '')
    
    if not user_message.strip():
        return jsonify({'response': "Please provide a valid message."}), 400
        
    bot_reply = get_chatbot_response(user_message)
    return jsonify({
        'response': bot_reply,
        'timestamp': datetime.now().strftime("%I:%M %p")
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

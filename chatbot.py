import re
from datetime import datetime

def get_chatbot_response(user_input):
    # Normalize input to lowercase for easier matching
    user_input = user_input.lower().strip()
    
    # 1. Greetings
    if re.search(r'\b(hello|hi|hey|hola|greetings)\b', user_input):
        return "Hello! I am your AI assistant. How can I help you today?"
        
    # 2. Well-being check
    elif re.search(r'\b(how are you|how\'s it going|how do you do)\b', user_input):
        return "I'm doing great, thank you for asking! Ready to help you write some code."
        
    # 3. Time queries
    elif re.search(r'\b(time|date|day)\b', user_input):
        current_time = datetime.now().strftime("%H:%M:%S")
        current_date = datetime.now().strftime("%Y-%m-%d")
        return f"Today's date is {current_date} and the current system time is {current_time}."
        
    # 4. Identity/Purpose
    elif re.search(r'\b(who are you|your name|what do you do)\b', user_input):
        return "I am a rule-based AI chatbot built for my CodSoft internship task!"
        
    # 5. Help or Task related
    elif re.search(r'\b(help|support|assist)\b', user_input):
        return "Of course! Tell me what you need help with, and I'll do my best to match your query."
        
    # 6. Farewell
    elif re.search(r'\b(bye|goodbye|exit|see you)\b', user_input):
        return "Goodbye! Have a fantastic day ahead."
        
    # 7. Fallback for unmatched patterns
    else:
        return "I'm sorry, I didn't quite catch that. Could you please rephrase your question?"

def main():
    print("="*50)
    print("🤖 RULE-BASED INTERNSHIP CHATBOT INITIALIZED 🤖")
    print("Type 'exit' or 'bye' to end the conversation.")
    print("="*50)
    
    while True:
        try:
            user_msg = input("\nYou: ")
            if not user_msg:
                continue
                
            response = get_chatbot_response(user_msg)
            print(f"Chatbot: {response}")
            
            # Break condition if the user says goodbye
            if re.search(r'\b(bye|goodbye|exit)\b', user_msg.lower()):
                break
                
        except (KeyboardInterrupt, SystemExit):
            print("\nChatbot: Session terminated. Goodbye!")
            break

if __name__ == "__main__":
    main()

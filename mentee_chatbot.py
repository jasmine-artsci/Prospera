import os
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("API key not set")

# Configure Gemini API
genai.configure(api_key=api_key)
model = genai.GenerativeModel('models/gemini-1.5-flash')

career_bot_prompt = """
You are a helpful AI career mentor chatbot. You will ask the user 6–10 intelligent questions to
understand their career background.

Ask ONLY about:
- Education background
- Work experience
- Skills and certifications
- Career goals
- Strengths and interests
- Industries they’re interested in

Avoid personal or irrelevant questions.

Start with one clear question.

As the conversation continues, keep track of the user's responses.
When you feel you’ve gathered enough info, say:

"Okay! I think we are set to match your skills and interests to our mentors."

Then ask:
"Would you like to proceed with finding a mentor now?  
1. Match to mentor now  
2. I'm not ready, let's discuss more."

Wait for the user’s response before proceeding.
"""

chat = model.start_chat()
response = chat.send_message(career_bot_prompt)
print("Bot:", response.text)

print(response.text)

while True:
    user_input = input("You: ")

    if user_input.lower() in ['quit', 'exit']:
        break

    response = chat.send_message(user_input)
    print("Bot:", response.text)

    # Check if user wants to match now
    if "match to mentor" in user_input.lower():
        print("Proceeding to mentor matching page...")
        # trigger the next function, page, or UI component
        break
    elif "discuss more" in user_input.lower():
        print("Let's keep talking. Feel free to tell me more about your background!")

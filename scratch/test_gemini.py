import os
import google.generativeai as genai

api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
print(f"API Key present: {api_key is not None}")

# If we have an API key, let's list the models to verify access
if api_key:
    genai.configure(api_key=api_key)
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Hello! What is your name?")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error calling model: {e}")

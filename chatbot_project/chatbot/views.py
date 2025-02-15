import os
import google.generativeai as genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from dotenv import load_dotenv
from django.shortcuts import render

# Load API key from .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Ensure API key is provided
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in the environment variables.")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

@csrf_exempt
def chatbot_response(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message", "").strip()

            if not user_message:
                return JsonResponse({"error": "Message cannot be empty."}, status=400)

            # Initialize Gemini model
            model = genai.GenerativeModel("gemini-2.0-flash")
            
            # Generate response
            response = model.generate_content(user_message)
            
            if not hasattr(response, "text"):
                return JsonResponse({"error": "Invalid response from Gemini API."}, status=500)

            bot_message = response.text.strip()

            return JsonResponse({"response": bot_message})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=400)

# Render the homepage
def index(request):
    return render(request, 'index.html')  # Ensure index.html exists in templates

# Render the chatbot page
def chat_page(request):
    return render(request, 'chat.html')  # Ensure chat.html exists in templates

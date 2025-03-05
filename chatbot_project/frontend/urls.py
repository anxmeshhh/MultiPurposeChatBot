from django.urls import path
from .views import index, chat_page , signlogin

urlpatterns = [
    path("", signlogin, name="signlogin"),  # Signup/Login Page
    path("home/", index, name="index"),  # Homepage
    path("chat/", chat_page, name="chat_page"),  # Chatbot UI
    path("case/", signlogin, name="case"),  # Case Study
    
]

from django.urls import path
from .views import index, chat_page

urlpatterns = [
    path("", index, name="index"),  # Homepage
    path("chat/", chat_page, name="chat_page"),  # Chatbot UI
]

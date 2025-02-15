from django.contrib import admin
from django.urls import path, include
from frontend.views import index, chat_page  # ✅ Ensure correct import

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/chatbot/", include("chatbot.urls")),  # ✅ Include chatbot API URLs
    path("", index, name="index"),  # ✅ Homepage (index.html)
    path("chat/", chat_page, name="chat_page"),  # ✅ Chat Page (chat.html)
]

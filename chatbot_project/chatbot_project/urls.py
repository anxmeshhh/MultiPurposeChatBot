from django.contrib import admin
from django.urls import path, include
from frontend.views import index, chat_page,signlogin 
from frontend import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', views.signlogin, name='signlogin'),  
    path("home/api/chatbot/", include("chatbot.urls")),  #  chatbot API URLs
    path("home/", index, name="index"),  #  Homepage (index.html)
    path("chat/", chat_page, name="chat_page"),  #  Chat Page (chat.html)
    path("case/", signlogin, name="case"),  #  Case Studys
]

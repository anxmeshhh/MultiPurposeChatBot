from django.shortcuts import render

def index(request):
    return render(request, "index.html")

def chat_page(request):
    return render(request, "chat.html")

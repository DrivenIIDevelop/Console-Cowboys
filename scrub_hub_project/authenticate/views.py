from django.shortcuts import render

# Create your views here.
import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
# Create your views here.

def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        
        if username is None or password is None:
            return JsonResponse({"detail":"Please provide username and password"})
        user = authenticate(username=username, password=password)
        if user is None:
            return JsonResponse({"detail":"Invalid credentials"}, status=400)
        login(request, user)
        return JsonResponse({"detail": "Succesfully logged in!"})
    elif request.method == "GET":
        return render(request, 'authenticate/login.html')


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail":"You are not logged in!"}, status=400)
    logout(request)
    return JsonResponse({"detail":"Succesfully logged out!"})


@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})
    return JsonResponse({"isAuthenticated": True})

def dashboard_view(request):
    if not request.user.is_authenticated:
        # return JsonResponse({"isAuthenticated": False})
        return render(request, 'authenticate/login.html')
    context = { 'username': request.user.username }
    return render(request, 'authenticate/dashboard.html', context)

@ensure_csrf_cookie
def register_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")

        if not all([username, password, email]):
            return JsonResponse({"detail": "Missing information"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"detail": "Username already taken"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()

        return JsonResponse({"detail": "User successfully registered"}, status=201)
    elif request.method == "GET":
        return render(request, 'authenticate/register.html')
from django.shortcuts import render
from . models import CustomUser
import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
# from django.contrib.auth.models import User

# Create your views here.

def home_view(request):
    return render(request, 'authenticate/home.html')

@ensure_csrf_cookie
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        
        if email is None or password is None:
            return JsonResponse({"detail":"Please provide username and password"})
        user: CustomUser = authenticate(email=email, password=password)
        if user is None:
            return JsonResponse({"detail":"Invalid credentials"}, status=400)
        login(request, user)
        return JsonResponse({
            'id': user.id,
            'firstName': user.first_name,
            'lastName': user.last_name,
        })
    elif request.method == "GET":
        #Add condition for if already logged in then go to dashboard? Maybe might not need
        return render(request, 'authenticate/login.html')


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail":"You are not logged in!"}, status=400)
    logout(request)
    return JsonResponse({"detail":"Succesfully logged out!"})



@login_required(login_url="/authenticate/login/")
def dashboard_view(request):
    return render(request, 'authenticate/dashboard.html')

@ensure_csrf_cookie
def register_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        phone_number = data.get("phone_number")
        employee_id = data.get("employee_id")
        registration_code = data.get("registration_code")

        if not all([email, password, confirm_password, first_name, last_name, phone_number, employee_id, registration_code]):
            return JsonResponse({"detail": "Missing information"}, status=400)

        if password != confirm_password:
            return JsonResponse({"detail": "Passwords do not match!"}, status=400)
        
        if CustomUser.objects.filter(email=email).exists():
            return JsonResponse({"detail": "Username already taken"}, status=400)

        user = CustomUser.objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name, phone_number=phone_number, employee_id=employee_id, registration_code=registration_code)
        user.save()

        return JsonResponse({"detail": "User successfully registered"}, status=201)
    elif request.method == "GET":
        return render(request, 'authenticate/register.html')

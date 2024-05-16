from django.shortcuts import render
from . models import CustomUser
import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework.decorators import api_view

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
            'privateKey': user.private_key,
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
@api_view(['GET', 'POST']) # Required to have request.data
def register_view(request):
    if request.method == "POST":
        data: dict = {}
        expected_fields = [
            'first_name', 'last_name',
            'password', 'confirm_password',
            'phone_number', 'email',
            'employee_id', 'registration_code',
            'public_key', 'private_key',
        ]
        for field in expected_fields:
            data[field] = request.data.get(field)
            if data[field] is None:
                return JsonResponse({"detail": "Missing information"}, status=400)
            if type(data[field]) == InMemoryUploadedFile:
                data[field] = data[field].read()

        if data['password'] != data['confirm_password']:
            return JsonResponse({"detail": "Passwords do not match!"}, status=400)
        del data['confirm_password']

        if CustomUser.objects.filter(email=data['email']).exists():
            return JsonResponse({"detail": "Username already taken"}, status=400)

        user = CustomUser.objects.create_user(**data)
        user.save()

        return JsonResponse({"detail": "User successfully registered"}, status=201)
    elif request.method == "GET":
        return render(request, 'authenticate/register.html')

@api_view(['POST'])
def set_keys(request):
    user: CustomUser = request.user
    if not user.is_authenticated:
        return JsonResponse({"detail": "You are not logged in!"}, status=400)
    data: dict = {}
    expected_fields = [ 'public_key', 'private_key' ]
    for field in expected_fields:
        data[field] = request.data.get(field)
        if data[field] is None:
            return JsonResponse({"detail": "Missing information"}, status=400)
        if type(data[field]) == InMemoryUploadedFile:
            data[field] = data[field].read()

    user.public_key = data['public_key']
    user.private_key = data['private_key']
    user.save()
    return JsonResponse({"detail": "success"}, status=200)

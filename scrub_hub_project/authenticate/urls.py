from django.urls import path

from . import views

urlpatterns = [
	path('login/', views.login_view, name='authenticate-login'),
	path('logout/', views.logout_view, name='authenticate-logout'),
	path('dashboard/', views.dashboard_view, name='authenticate-dashboard'),
	path('register/', views.register_view, name='authenticate-register'),
	path('home/', views.home_view, name='authenticate-home'),
]
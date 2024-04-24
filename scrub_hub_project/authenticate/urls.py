from django.urls import path

from . import views

urlpatterns = [
	path('login/', views.login_view, name='authenticate-login'),
	path('logout/', views.logout_view, name='authenticate-logout'),
	path('session/', views.session_view, name='authenticate-session'),
	path('dashboard/', views.dashboard_view, name='authenticate-dashboard'),
	path('register/', views.register_view, name='authenticate-register'),
]
from django.urls import path

from . import views

urlpatterns = [
	path('<int:conversation_id>/', views.conversation, name='conversation'),
	path('', views.all_conversations, name='list_conversations'),
]

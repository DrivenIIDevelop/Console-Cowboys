from django.urls import path

from . import views

urlpatterns = [
	path('<int:conversation_id>/', views.conversation, name='conversation'),
	path('start/', views.make_conversation, name='start_conversation'),
	path('', views.all_conversations, name='list_conversations'),
	path('get-keys/', views.get_public_keys, name='get_public_keys'),
]

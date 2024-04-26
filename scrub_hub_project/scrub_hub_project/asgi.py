"""
ASGI config for scrub_hub_project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from . import urls

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "scrub_hub_project.settings")

application = ProtocolTypeRouter(
	{
		"http": get_asgi_application(),
		"websocket": AuthMiddlewareStack(URLRouter(urls.websocket_urlpatterns)),
	}
)

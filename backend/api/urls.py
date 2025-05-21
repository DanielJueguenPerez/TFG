from django.urls import path, include
from rest_framework import routers
from .views import RegistroAPIView

router = routers.DefaultRouter()

urlpatterns = [
    path('api/registro/', RegistroAPIView.as_view(), name='api-registro'),
]
from django.urls import path
from .views import *

urlpatterns = [
    path('api/registro/', RegistroAPIView.as_view(), name='api-registro'),
    path('api/login/', LoginAPIView.as_view(), name='api-login'),
    path('api/logout/', LogoutAPIView.as_view(), name='api-logout'),
    path('api/ver-perfil/', VerPerfilAPIView.as_view(), name='api-ver-perfil'),
    path ('api/editar-perfil/', EditarPerfilAPIView.as_view(), name='api-editar-perfil'),
]
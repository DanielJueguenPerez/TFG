from django.urls import path
from .views import *

urlpatterns = [
    path('api/registro/', RegistroAPIView.as_view(), name='api-registro'),
    path('api/login/', LoginAPIView.as_view(), name='api-login'),
    path('api/logout/', LogoutAPIView.as_view(), name='api-logout'),
    path('api/ver-perfil/', VerPerfilAPIView.as_view(), name='api-ver-perfil'),
    path('api/editar-perfil/', EditarPerfilAPIView.as_view(), name='api-editar-perfil'),
    path('api/grados/', VerGradosListAPIView.as_view(), name='api-ver-grados'),
    path('api/asignaturas/', BuscarAsignaturasListAPIView.as_view(), name='api-buscar-asignaturas'),
    path('api/grados/<int:id_grado>/', DestallesGradoRetrieveAPIView.as_view(), name='api-detalles-grado'),
    path('api/asignaturas/<int:id_asignatura>/', DestallesAsignaturaRetrieveAPIView.as_view(), name='api-detalles-asignatura'),
    path('api/comentarios/nuevo/<int:id_asignatura>/', CrearComentarioCreateAPIView.as_view(), name='api-crear-comentario'),
]
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
    path('api/comentarios/<int:id_asignatura>/', VerComentariosAsignaturaListAPIView.as_view(), name='api-listar-comentarios'),
    path('api/comentarios/<int:id_asignatura>/nuevo/', CrearComentarioCreateAPIView.as_view(), name='api-crear-comentario'),
    path('api/comentarios/editar/<int:id_comentario>/', EditarComentarioUpdateAPIView.as_view(), name='api-editar-comentario'),
    path('api/comentarios/eliminar/<int:id_comentario>/', EliminarComentarioDestroyAPIView.as_view(), name='api-eliminar-comentario'),
]
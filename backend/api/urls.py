from django.urls import path
from .views import *

urlpatterns = [
    path('api/usuario/registro/', RegistroAPIView.as_view(), name='api-registro'),
    path('api/usuario/login/', LoginAPIView.as_view(), name='api-login'),
    path('api/usuario/logout/', LogoutAPIView.as_view(), name='api-logout'),
    path('api/usuario/ver-perfil/', VerPerfilAPIView.as_view(), name='api-ver-perfil'),
    path('api/usuario/editar-perfil/', EditarPerfilAPIView.as_view(), name='api-editar-perfil'),
    path('api/usuario/cambiar-password/', CambiarPasswordAPIView.as_view(), name='api-cambiar-password'),
    path('api/usuario/comentarios/', VerComentariosPropiosListAPIView.as_view(), name='api-ver-comentarios-usuario'),
    path('api/grados/', VerGradosListAPIView.as_view(), name='api-ver-grados'),
    path('api/grados/<int:id_grado>/', DetallesGradoRetrieveAPIView.as_view(), name='api-detalles-grado'),
    path('api/asignaturas/', BuscarAsignaturasListAPIView.as_view(), name='api-buscar-asignaturas'),
    path('api/asignaturas/<int:id_asignatura>/', DetallesAsignaturaRetrieveAPIView.as_view(), name='api-detalles-asignatura'),
    path('api/comentarios/<int:id_asignatura>/', VerComentariosAsignaturaListAPIView.as_view(), name='api-listar-comentarios'),
    path('api/comentarios/<int:id_asignatura>/nuevo/', CrearComentarioCreateAPIView.as_view(), name='api-crear-comentario'),
    path('api/comentarios/ver/<int:id_comentario>/', VerComentarioRetrieveAPIView.as_view(), name='api-ver-comentario'),
    path('api/comentarios/editar/<int:id_comentario>/', EditarComentarioUpdateAPIView.as_view(), name='api-editar-comentario'),
    path('api/comentarios/eliminar/<int:id_comentario>/', EliminarComentarioDestroyAPIView.as_view(), name='api-eliminar-comentario'),
    path('api/favoritos/agregar/<int:id_asignatura>/', AgregarFavoritoCreateAPIView.as_view(), name='api-agregar-favorito'),
    path('api/favoritos/eliminar/<int:id_favorito>/', EliminarFavoritoDestroyAPIView.as_view(), name='api-eliminar-favorito'),
    path('api/favoritos/lista/', VerFavoritosListAPIView.as_view(), name='api-ver-favoritos'),
]
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import *

User = get_user_model()

class EliminarComentarioTests(APITestCase):
    def setUp(self):
        # Se crea una asignatura y un grado
        self.grado = Grado.objects.create(nombre='Grado en Física', url='http://ejemplo.com/fisica')
        self.asignatura = Asignatura.objects.create(nombre='Relatividad General', curso=4, id_grado=self.grado)
        # Se crean dos usuarios
        self.usuario1 = User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='98765432Z',
            password='pepe1234'
        )
        self.token1 = Token.objects.create(user=self.usuario1)
        self.usuario2 = User.objects.create_user(
            username='manolete',
            nombre='Manolo',
            apellidos='López',
            email='manolo@manolo.es',
            DNI='12345678A',
            password='manolo1234'
        )
        self.token2 = Token.objects.create(user=self.usuario2)
        # Se crean algunos comentarios de ambos usuarios
        self.comentariopepe = Comentario.objects.create(
            texto="Comentario de Pepe", id_usuario=self.usuario1, id_asignatura=self.asignatura)
        self.comentariomanolo = Comentario.objects.create(
            texto="Comentario de Manolo", id_usuario=self.usuario2, id_asignatura=self.asignatura)
        # Se define la URL
        self.url = f'/api/comentarios/eliminar/{self.comentariopepe.id_comentario}/'

    def test_eliminarcomentario_correcto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        comentarios = Comentario.objects.all().order_by('id_comentario')
        self.assertEqual(comentarios[0].texto, "Comentario de Pepe")
        resp = self.client.delete(self.url)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Comentario.objects.count(), 1)
        self.assertEqual(Comentario.objects.filter(id_comentario=self.comentariomanolo.id_comentario).exists(), True)
        
    def test_eliminarcomentario_ya_eliminado(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        self.client.delete(self.url)
        resp = self.client.delete(self.url)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_eliminarcomentario_no_token(self):
        resp = self.client.delete(self.url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resp.data, {"detail": "Authentication credentials were not provided."})
        
    def test_eliminarcomentario_usuario_no_creador(self):
        # Se usa el token de otro usuario que no es el creador del comentario
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token2.key)
        resp = self.client.delete(self.url)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(resp.data, {"detail": "No Comentario matches the given query."})
        
    def test_eliminarcomentario_comentario_no_existe(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        resp = self.client.delete('/api/comentarios/eliminar/40/')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(resp.data, {"detail": "No Comentario matches the given query."})
        
    def test_crearcomentario_solicitud_incorrecta(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED) 
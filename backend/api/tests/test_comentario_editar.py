from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import *

User = get_user_model()

class EditarComentarioTests(APITestCase):
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
        self.url = f'/api/comentarios/editar/{self.comentariopepe.id_comentario}/'

    def test_editarcomentario_correcto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        comentarios = Comentario.objects.all().order_by('id_comentario')
        # Se comprueba que el primer comentario es el de Pepe
        self.assertEqual(comentarios[0].texto, "Comentario de Pepe")
        # Se edita el comentario de Pepe
        resp = self.client.patch(self.url, {"texto": "Esto es un comentario"}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que sigue habiendo dos comenbtarios en la base de datos
        self.assertEqual(Comentario.objects.count(), 2)
        comentarios = Comentario.objects.all().order_by('id_comentario')
        # Comprobamos que el primer comentario ha sido editado correctamente
        self.assertEqual(comentarios[0].texto, "Esto es un comentario")
        self.assertEqual(comentarios[0].id_usuario, self.usuario1)   
        self.assertEqual(comentarios[0].id_asignatura, self.asignatura)

    def test_editarcomentario_no_token(self):
        # Se intenta editar un comentario sin token
        resp = self.client.patch(self.url, {"texto": "Esto es un comentario"}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        # Comprobamos que la respuesta es un error 401 (no autorizado)
        self.assertEqual(resp.data, {"detail": "Authentication credentials were not provided."})
        
    def test_editarcomentario_usuario_no_creador(self):
        # Se usa el token de otro usuario que no es el creador del comentario
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token2.key)
        resp = self.client.patch(self.url, {"texto": "Esto es un comentario"}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
        # Comprobamos que la respuesta es un error 404 (no encontrado) porque el usuario no es el creador del comentario
        self.assertEqual(resp.data, {"detail": "No Comentario matches the given query."})
        
    def test_editarcomentario_comentario_no_existe(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        # Se intenta editar un comentario que no existe
        resp = self.client.patch('/api/comentarios/editar/40/', {"texto": "Esto es un comentario"}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
        # Comprobamos que la respuesta es un error 404 (no encontrado)
        self.assertEqual(resp.data, {"detail": "No Comentario matches the given query."})
        
    def test_editarcomentario_sin_texto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        # Se intenta editar un comentario sin el campo texto
        resp = self.client.patch(self.url, {"texto": ""}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        # Comprobamos que el mensaje de error es el esperado
        self.assertIn('This field may not be blank.', str(resp.data)) 
        
    def test_crearcomentario_solicitud_incorrecta(self):
        # Se intenta hacer una solicitud GET a la URL de editar comentario
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
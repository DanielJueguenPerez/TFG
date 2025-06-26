from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from ..models import *

User = get_user_model()

class VerComentariosPropiosTests(APITestCase):
    def setUp(self):
        # Se crean asignaturas un grados
        self.grado = Grado.objects.create(nombre='Grado en Física', url='http://ejemplo.com/fisica')
        self.asignatura = Asignatura.objects.create(nombre='Relatividad General', curso=4, id_grado=self.grado)
        self.asignatura1 = Asignatura.objects.create(nombre='Cálculo', curso=1, id_grado=self.grado)
        self.asignatura2 = Asignatura.objects.create(nombre='Álgebra', curso=1, id_grado=self.grado)
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
        self.comentariopepe1= Comentario.objects.create(
            texto="Comentario de Pepe en Relatividad", id_usuario=self.usuario1, id_asignatura=self.asignatura)
        self.comentariopepe2 = Comentario.objects.create(
            texto="Comentario de Pepe en Relatividad 2", id_usuario=self.usuario1, id_asignatura=self.asignatura)
        self.comentariopepe3 = Comentario.objects.create(
            texto="Comentario de Pepe en Álgebra", id_usuario=self.usuario1, id_asignatura=self.asignatura2)
        self.comentariomanolo1 = Comentario.objects.create(
            texto="Comentario de Manolo en Relatividad", id_usuario=self.usuario2, id_asignatura=self.asignatura)
        # Se define la URL
        self.url = f'/api/usuario/comentarios/'

    def test_vercomentarios_propios_correcto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Se comprueba que los comentarios recibidos son los esperados
        comentarios = resp.data['results']
        self.assertEqual(len(comentarios), 3)
        self.assertEqual(comentarios[0]['texto'], "Comentario de Pepe en Relatividad")
        self.assertEqual(comentarios[1]['texto'], "Comentario de Pepe en Relatividad 2")
        self.assertEqual(comentarios[2]['texto'], "Comentario de Pepe en Álgebra")
        textos = [comentario['texto'] for comentario in comentarios]
        self.assertNotIn("Comentario de Manolo en Relatividad", textos)
        
    def test_vercomentarios_propios_no_token(self):
        # Hacemos una petición sin token
        resp = self.client.post(self.url, {"texto": "Esto es un comentario"}, format='json')
        # Comprobamos que la respuesta es un error 401 (sin autorización)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_vercomentarios_propios_token_incorrecto(self):
        # Hacemos una petición con un token incorrecto
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + 'EsteTokenNoEsValido')
        resp = self.client.post(self.url, {"texto": "Esto es un comentario"}, format='json')
        # Comprobamos que la respuesta es un error 401 (no autorizado) porque el token es incorrecto
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resp.data, {"detail": "Invalid token."})
        
    def test_vercomentarios_propios_sin_comentarios(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        # Borramos los comentarios del usuario1
        Comentario.objects.filter(id_usuario=self.usuario1).delete()
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que la respuesta es correcta y no hay comentarios
        self.assertEqual(resp.data['count'], 0)
        self.assertEqual(resp.data['results'], [])
        
    def test_vercomentarios_propios_solicitud_incorrecta(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        # Se intenta hacer una solicitud POST a la URL de ver comentarios de un usuario
        resp = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
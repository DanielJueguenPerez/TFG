from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from ..models import *

User = get_user_model()

class VerFavoritosTests(APITestCase):
    def setUp(self):
        # Se crean asignaturas y grados
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
        # Se crean algunos favoritos de ambos usuarios
        self.favoritopepe1 = Favorito.objects.create(
            id_usuario=self.usuario1, id_asignatura=self.asignatura)
        self.favoritopepe2 = Favorito.objects.create(
            id_usuario=self.usuario1, id_asignatura=self.asignatura1)
        self.favoritopepe3 = Favorito.objects.create(
            id_usuario=self.usuario1, id_asignatura=self.asignatura2)
        self.favoritomanolo1 = Favorito.objects.create(
            id_usuario=self.usuario2, id_asignatura=self.asignatura)
        self.favoritomanolo2 = Favorito.objects.create(
            id_usuario=self.usuario2, id_asignatura=self.asignatura1)
        self.favoritomanolo3 = Favorito.objects.create(
            id_usuario=self.usuario2, id_asignatura=self.asignatura2)
        # Se define la URL
        self.url1 = f'/api/favoritos/lista/{self.usuario1.id_usuario}/'
        self.url2 = f'/api/favoritos/lista/{self.usuario2.id_usuario}/'
        
    def test_verfavoritos_correcto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        resp = self.client.get(self.url1)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Se comprueba que los favoritos recibidos son los esperados
        self.assertEqual(resp.data['count'], 3)
        self.assertEqual(len(resp.data['results']), 3)
        self.assertEqual(resp.data['results'][0]['id_usuario'], self.usuario1.id_usuario)
        self.assertEqual(resp.data['results'][0]['id_asignatura'], self.asignatura.id_asignatura)
        self.assertEqual(resp.data['results'][1]['id_usuario'], self.usuario1.id_usuario)
        self.assertEqual(resp.data['results'][1]['id_asignatura'], self.asignatura1.id_asignatura)
        self.assertEqual(resp.data['results'][2]['id_usuario'], self.usuario1.id_usuario)
        self.assertEqual(resp.data['results'][2]['id_asignatura'], self.asignatura2.id_asignatura)
        
    def test_verfavoritos_otro_usuario(self):
        # Usuario 2 intenta ver los favoritos del usuario 1
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token2.key)
        resp = self.client.get(self.url1)
        # Comprobamos que la respuesta es un error 403 (prohibido) porque el usuario no tiene permiso
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("No tienes permiso para ver los favoritos de otro usuario.", str(resp.data))
        
    def test_verfavorito_no_token(self):
        resp = self.client.post(self.url1, {}, format='json')
        # Comprobamos que la respuesta es un error 401 (no autorizado) porque no se ha
        # proporcionado un token de autenticación
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resp.data, {"detail": "Authentication credentials were not provided."})
        
    def test_verfavorito_token_incorrecto(self):
        # Se intenta ver favoritos con un token incorrecto
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + 'EsteTokenNoEsValido')
        resp = self.client.post(self.url1, {""}, format='json')
        # Comprobamos que la respuesta es un error 401 (no autorizado) porque el token es incorrecto
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resp.data, {"detail": "Invalid token."})

    def test_verfavorito_usuario_sin_favoritos(self):
        Favorito.objects.all().delete()  # Borramos todos los favoritos
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        resp = self.client.get(self.url1)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que la respuesta indica que no hay favoritos
        self.assertEqual(resp.data['count'], 0)
        self

    def test_verfavoritos_solicitud_incorrecta(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        # Se intenta hacer una solicitud POST a la URL de ver comentarios de una asignatura
        resp = self.client.post(self.url1, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED) 
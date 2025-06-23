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
        # Se crea un usuario
        self.usuario = User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='98765432Z',
            password='pepe1234'
        )
        self.token = Token.objects.create(user=self.usuario)

        # Se crean algunos favoritos de ambos usuarios
        self.favoritopepe1 = Favorito.objects.create(
            id_usuario=self.usuario, id_asignatura=self.asignatura)
        self.favoritopepe2 = Favorito.objects.create(
            id_usuario=self.usuario, id_asignatura=self.asignatura1)
        self.favoritopepe3 = Favorito.objects.create(
            id_usuario=self.usuario, id_asignatura=self.asignatura2)

        # Se define la URL
        self.url = f'/api/favoritos/lista/'
        
    def test_verfavoritos_correcto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Se comprueba que los favoritos recibidos son los esperados
        asignaturas_ids = [favorito['id_asignatura'] for favorito in resp.data['results']]
        self.assertIn(self.asignatura.id_asignatura, asignaturas_ids)
        self.assertIn(self.asignatura1.id_asignatura, asignaturas_ids)
        self.assertIn(self.asignatura2.id_asignatura, asignaturas_ids) 
        
        
    def test_verfavorito_no_token(self):
        resp = self.client.get(self.url)
        # Comprobamos que la respuesta es un error 401 (no autorizado) porque no se ha
        # proporcionado un token de autenticación
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resp.data, {"detail": "Authentication credentials were not provided."})
        
    def test_verfavorito_token_incorrecto(self):
        # Se intenta ver favoritos con un token incorrecto
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + 'EsteTokenNoEsValido')
        resp = self.client.get(self.url)
        # Comprobamos que la respuesta es un error 401 (no autorizado) porque el token es incorrecto
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resp.data, {"detail": "Invalid token."})

    def test_verfavorito_usuario_sin_favoritos(self):
        Favorito.objects.all().delete()  # Borramos todos los favoritos
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que la respuesta indica que no hay favoritos
        self.assertEqual(resp.data['count'], 0)
        self.assertEqual(resp.data['results'], [])

    def test_verfavoritos_solicitud_incorrecta(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        # Se intenta hacer una solicitud POST a la URL de ver comentarios de una asignatura
        resp = self.client.post(self.url)
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED) 
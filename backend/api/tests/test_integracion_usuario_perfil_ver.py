from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()

class VerPerfilTests(APITestCase):
    def setUp(self):
        self.url = '/api/usuario/ver-perfil/'
        self.usuario = User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='98765432Z',
            password='pepe1234'
        )
        self.token = Token.objects.create(user=self.usuario)
        
    def test_verperfil_correcto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.get(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos la respuesta
        datos_esperados = {
            'username': self.usuario.username,
            'nombre': self.usuario.nombre,
            'apellidos': self.usuario.apellidos,
            'email': self.usuario.email,
            'DNI': self.usuario.DNI,
        }
        self.assertEqual(resp.data, datos_esperados)
        
    def test_verperfil_no_token(self):
        # Se intenta acceder al perfil sin token
        resp = self.client.get(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        # Comprobamos que la respuesta es un error 401 (no autorizado)
        self.assertEqual(resp.data, {"detail": "Authentication credentials were not provided."})
        
    def test_verperfil_token_incorrecto(self):
        # Se intenta acceder al perfil con un token incorrecto
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + 'EsteTokenNoEsValido')
        resp = self.client.get(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        # Comprobamos que la respuesta es un error 401 (no autorizado)
        self.assertEqual(resp.data, {"detail": "Invalid token."})

    def test_verperfil_datos_correctos(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.get(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que los campos devueltos son los correctos
        self.assertEqual(
            set(resp.data.keys()), {'username', 'nombre', 'apellidos', 'email', 'DNI'}
        )

    def test_verperfil_solicitud_incorrecta(self):
        # Se intenta hacer una solicitud POST a la URL de ver perfil
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED) 
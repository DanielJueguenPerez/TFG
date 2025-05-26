from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginTests(APITestCase):
    def setUp(self):
        self.url = '/api/usuario/login/'
        self.usuario = User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='98765432Z',
            password='pepe1234'
        )
        
    def test_login_correcto(self):
        # Se hace login con las credenciales correctas
        resp = self.client.post(self.url, {
            'username': 'pepito',
            'password': 'pepe1234'
        }, format='json')\
        # Se comprueba que la respuesta es correcta
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('token',resp.data)
        token = Token.objects.get(user=self.usuario)
        # Se comprueba que el token devuelto es el correcto
        self.assertEqual(resp.data['token'], token.key)
        
    def test_login_correcto_datos_devueltos(self):
        # Se hace login y se comprueba que los datos del usuario son correctos
        resp = self.client.post(self.url, {
            'username': 'pepito',
            'password': 'pepe1234'
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('user', resp.data)
        self.assertEqual(resp.data['user']['username'], 'pepito')
        self.assertEqual(resp.data['user']['email'], self.usuario.email)
        
    def test_login_campos_vacios(self):
        # Se intenta hacer login sin enviar los campos username y password
        resp = self.client.post(self.url,{}, format='json')
        # Se comprueba que la respuesta es un error 400 (bad request)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', resp.data)
        self.assertIn('password', resp.data)
    
    def test_login_username_incorrecto(self):
        # Se intenta hacer login con un username que no existe
        resp = self.client.post(self.url, {
            'username': 'Jaimito',
            'password': 'pepe1234'
        }, format='json')
        # Se comprueba que la respuesta es un error 400 (bad request)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', resp.data)

    def test_login_password_incorrecto(self):
        # Se intenta hacer login con un password incorrecto
        resp = self.client.post(self.url, {
            'username': 'pepito',
            'password': 'jaimito1234'
        }, format='json')
        # Se comprueba que la respuesta es un error 400 (bad request)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', resp.data)
        
    def test_login_token_no_duplicado(self):
        # Se hace login dos veces con el mismo usuario
        resp1 = self.client.post(self.url, {
            'username': 'pepito',
            'password': 'pepe1234'
        }, format='json')
        resp2 = self.client.post(self.url, {
            'username': 'pepito',
            'password': 'pepe1234'
        }, format='json')
        # Se comprueba que el token es el mismo, ya que es el mismo usuario
        self.assertEqual(resp1.data['token'], resp2.data['token'])
        # Se comprueba que solo hay un token para el usuario en la base de datos
        self.assertEqual(Token.objects.filter(user=self.usuario).count(), 1)
        
    def test_login_solicitud_incorrecta(self):
        # Se comprueba que no se puede enviar una solicitud GET
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
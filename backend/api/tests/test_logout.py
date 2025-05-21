from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()

class LogoutTests(APITestCase):
    def setUp(self):
        self.url = '/api/logout/'
        self.usuario = User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='98765432Z',
            password='pepe1234'
        )
        self.token = Token.objects.create(user=self.usuario)
    
    def test_logout_correcto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que el token se ha eliminado
        self.assertFalse(Token.objects.filter(user=self.usuario).exists())
        # Comprobamos la respuesta
        self.assertEqual(resp.data, {"Deslogueado con exito"})
    
    def test_logout_no_token(self):
        resp = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resp.data, {"detail": "Authentication credentials were not provided."})
        
    def test_logout_dos_veces(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        resp2 = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp2.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', resp2.data)
        
    def test_logout_solicitud_incorrecta(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.get(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)   
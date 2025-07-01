from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()

class CambiarPasswordTest(APITestCase):
    def setUp(self):
        self.url = '/api/usuario/cambiar-password/'
        self.usuario = User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='98765432Z',
            password='pepe1234'
        )
        self.token = Token.objects.create(user=self.usuario)
        
    def test_cambiarpassword_correcto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        # Se cambia la contraseña
        resp = self.client.patch(self.url,
            {
            'password_actual': 'pepe1234',
            'password_nuevo': 'nueva1234',
            'password_nuevo_2': 'nueva1234'
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Recuperamos el usuario de la base de datos y comprobamos que se han actualizado los campos
        self.usuario.refresh_from_db()
        self.assertTrue(self.usuario.check_password('nueva1234'))
        
    def test_cambiarpassword_sin_token(self):
        resp = self.client.patch(self.url,
            {
            'password_actual': 'pepe1234',
            'password_nuevo': 'nueva1234',
            'password_nuevo_2': 'nueva1234'
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cambiarpassword_token_invalido(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token incorrecto')
        resp = self.client.patch(self.url,
            {
            'password_actual': 'pepe1234',
            'password_nuevo': 'nueva1234',
            'password_nuevo_2': 'nueva1234'
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_cambiarpassword_actual_incorrecto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.patch(self.url,
            {
            'password_actual': 'pepe12341234',
            'password_nuevo': 'nueva1234',
            'password_nuevo_2': 'nueva1234'
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Contraseña actual incorrecta', str(resp.data))
        
    def test_cambiarpassword_actual_no_iguales(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.patch(self.url,
            {
            'password_actual': 'pepe12341234',
            'password_nuevo': 'nueva1234',
            'password_nuevo_2': 'nueva12341234'
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Las contraseñas no coinciden', str(resp.data))
        
    def test_cambiarpassword_demasiado_corta(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.patch(self.url,
            {
            'password_actual': 'pepe1234',
            'password_nuevo': 'nueva',
            'password_nuevo_2': 'nueva'
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Ensure this field has at least 8 characters.', str(resp.data))
        
    def test_cambiarpassword_campos_faltantes(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.patch(self.url,
            {
            'password_actual': 'pepe1234',
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password_nuevo', resp.data)
        self.assertIn('password_nuevo_2', resp.data)
        
    def test_ecambiarpassword_solicitud_incorrecta(self):
        # Se intenta hacer una solicitud POST a la URL de cambiar contraseña
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED) 
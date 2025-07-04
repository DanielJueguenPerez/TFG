from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()

class EditarPerfilTests(APITestCase):
    def setUp(self):
        self.url = '/api/usuario/editar-perfil/'
        self.usuario = User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='98765432Z',
            password='pepe1234'
        )
        self.token = Token.objects.create(user=self.usuario)
        
    def test_editarperfil_completo_correcto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        # Se edita el perfil con todos los campos
        resp = self.client.patch(self.url,
            {
                'username': 'periquito',
                'nombre': 'Perico',
                'apellidos': 'De los Palotes',
                'email': 'pericodelospalotes@hotmail.com',
                'DNI': '11111111Y',
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Recuperamos el usuario de la base de datos y comprobamos que se han actualizado los campos
        self.usuario.refresh_from_db()
        self.assertEqual(self.usuario.username, 'periquito')
        self.assertEqual(self.usuario.nombre, 'Perico')
        self.assertEqual(self.usuario.apellidos, 'De los Palotes')
        self.assertEqual(self.usuario.email, 'pericodelospalotes@hotmail.com')
        self.assertEqual(self.usuario.DNI, '11111111Y')
        
    def test_editarperfil_sin_token(self):
        # Se intenta editar el perfil sin token
        resp = self.client.patch(self.url,
            {
                'username': 'pepito'
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_editarperfil_token_incorrecto(self):
        # Se intenta editar el perfil con un token incorrecto
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + 'EsteTokenNoEsValido')
        resp = self.client.patch(self.url,
            {
                'username': 'pepito'
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resp.data, {"detail": "Invalid token."})
            
    def test_editarperfil_sin_campos(self):
        # Se intenta editar el perfil sin introducir ningun campo
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.patch(self.url,
            {
                
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        # Comprobamos que el mensaje de error es el esperado
        self.assertIn('Debes introducir al menos un campo', str(resp.data))
        
    
    def test_editarperfil_un_campo(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        # Se edita el perfil con un solo campo para comprobar que se actualiza correctamente
        resp = self.client.patch(self.url,
            {
                'nombre': 'Perico'
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Recuperamos el usuario de la base de datos y comprobamos que se ha actualizado el campo
        self.usuario.refresh_from_db()
        self.assertEqual(self.usuario.username, 'pepito')
        self.assertEqual(self.usuario.nombre, 'Perico')
        self.assertEqual(self.usuario.apellidos, 'Pérez')
        self.assertEqual(self.usuario.email, 'pepe@pepe.es')
        self.assertEqual(self.usuario.DNI, '98765432Z')

        
    def test_editarperfil_campo_desconocido(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        # Se intenta editar el perfil con un campo desconocido
        resp = self.client.patch(self.url,
            {
                'random': 'random'
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        # Comprobamos que el mensaje incluye el campo desconocido y que no es válido
        self.assertIn('random', resp.data)
        self.assertIn('no es válido.', str(resp.data))
        
    def test_editarperfil_email_invalido(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        # Se intenta editar el perfil con un email invalido
        resp = self.client.patch(self.url,
            {
                'email': 'asdasdasd',
            }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        # Comprobamos que el mensaje incluye el campo email y que no es un email válido
        self.assertIn('email', resp.data)
        self.assertIn('valid email', str(resp.data))
        
    def test_editarperfil_solicitud_incorrecta(self):
        # Se intenta hacer una solicitud POST a la URL de editar perfil
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED) 
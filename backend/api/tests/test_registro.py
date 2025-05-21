from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token


User = get_user_model()

class RegistroUsuarioTests(APITestCase):
    def setUp(self):
        self.url = '/api/registro/'
        self.datos_validos = {
            'username':'pepito',
            'nombre':'Pepe',
            'apellidos':'Pérez',
            'email':'pepe@pepe.es',
            'DNI':'12345678A',
            'password':'pepe1234',
            'password2':'pepe1234',
        }
        
    def test_registro_exito_token_creado(self):
        response = self.client.post(self.url, self.datos_validos)
        # Comprobar el estado http
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Comprobar si se devuelve el token en la respuesta
        self.assertIn('token', response.data)
        # Comprobar si el usuario se ha creado
        self.assertTrue(User.objects.filter(username='pepito').exists())
        # Comprobar si el token creado es el mimo que se ha almacenado
        user = User.objects.get(username='pepito')
        token = Token.objects.get(user=user)
        self.assertEqual(response.data['token'], token.key)
        
    def test_no_username(self):
        # Copia de los datos para no modificar los originales
        datos = self.datos_validos.copy()
        # Se elimina el campo username
        datos.pop('username')
        response = self.client.post(self.url, datos)
        # Se compruebba el estado http
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Se comprueba que la respuesta de error esta relacionada con el campo username
        self.assertIn('username', response.data)
        
    def test_no_nombre(self):
        # Copia de los datos para no modificar los originales
        datos = self.datos_validos.copy()
        # Se elimina el campo nombre
        datos.pop('nombre')
        response = self.client.post(self.url, datos)
        # Se compruebba el estado http
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Se comprueba que la respuesta de error esta relacionada con el campo nombre
        self.assertIn('nombre', response.data)
        
    def test_no_apellidos(self):
        # Copia de los datos para no modificar los originales
        datos = self.datos_validos.copy()
        # Se elimina el campo apellidos
        datos.pop('apellidos')
        response = self.client.post(self.url, datos)
        # Se compruebba el estado http
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Se comprueba que la respuesta de error esta relacionada con el campo apellidos
        self.assertIn('apellidos', response.data)
        
    def test_no_email(self):
        # Copia de los datos para no modificar los originales
        datos = self.datos_validos.copy()
        # Se elimina el campo email
        datos.pop('email')
        response = self.client.post(self.url, datos)
        # Se compruebba el estado http
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Se comprueba que la respuesta de error esta relacionada con el campo email
        self.assertIn('email', response.data)
        
    def test_no_DNI(self):
        # Copia de los datos para no modificar los originales
        datos = self.datos_validos.copy()
        # Se elimina el campo DNI
        datos.pop('DNI')
        response = self.client.post(self.url, datos)
        # Se compruebba el estado http
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Se comprueba que la respuesta de error esta relacionada con el campo DNI
        self.assertIn('DNI', response.data)
        
    def test_no_password(self):
        # Copia de los datos para no modificar los originales
        datos = self.datos_validos.copy()
        # Se elimina el campo password
        datos.pop('password')
        response = self.client.post(self.url, datos)
        # Se compruebba el estado http
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Se comprueba que la respuesta de error esta relacionada con el campo password
        self.assertIn('password', response.data)
        
    def test_email_invalido(self):
        # Copia de los datos para no modificar los originales
        datos = self.datos_validos.copy()
        # Se modifica el campo email
        datos['email']='random'
        response = self.client.post(self.url, datos)
        # Se compruebba el estado http
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Se comprueba que la respuesta de error esta relacionada con el campo email
        self.assertIn('email', response.data)
        
    def test_password_debil(self):
        # Copia de los datos para no modificar los originales
        datos = self.datos_validos.copy()
        # Se modifica el campo password y password2
        datos['password']='123'
        datos['password2']='123'
        response = self.client.post(self.url, datos)
        # Se compruebba el estado http
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Se comprueba que la respuesta de error esta relacionada con el campo password
        self.assertIn('password', response.data)
        
    def test_username_ya_existe(self):
        # Se crea un usuario con un username ya existente
        User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe1@pepe.es',
            DNI='12345670A',
            password='pepe1234'
        )
        response = self.client.post(self.url, self.datos_validos)
        # Se compruebba el estado http
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Se comprueba que la respuesta de error esta relacionada con el campo username
        self.assertIn('username', response.data)
    
    def test_email_ya_existe(self):
        # Se crea un usuario con un email ya existente
        User.objects.create_user(
            username='pepito1',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='12345670A',
            password='pepe1234'
        )
        response = self.client.post(self.url, self.datos_validos)
        # Se compruebba el estado http
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Se comprueba que la respuesta de error esta relacionada con el campo email
        self.assertIn('email', response.data)

    def test_DNI_ya_existe(self):
        # Se crea un usuario con un DNI ya existente
        User.objects.create_user(
            username='pepito1',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe1@pepe.es',
            DNI='12345678A',
            password='pepe1234'
        )
        response = self.client.post(self.url, self.datos_validos)
        # Se compruebba el estado http
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Se comprueba que la respuesta de error esta relacionada con el campo DNI
        self.assertIn('DNI', response.data)
        
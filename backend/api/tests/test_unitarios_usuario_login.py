from django.test import TestCase
from django.contrib.auth import get_user_model

from ..serializers import *

User = get_user_model()

class LoginSerializerTests(TestCase):
    def setUp(self):
        self.usuario = User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='12345678A',
            password='pepe1234',
        )
        self.datos_validos = {
            'username': 'pepito',  
            'password':'pepe1234',         
        }
        
    def test_login_serializer_valido(self):
        
        serializer = LoginSerializer(data=self.datos_validos)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data['user'], self.usuario)
        
    def test_login_serializer_usuario_incorrecto(self):
        
        datos = self.datos_validos.copy()
        datos['username'] = 'usuarioIncorrecto'
        serializer = LoginSerializer(data=datos)
        self.assertFalse(serializer.is_valid())
        self.assertIn('Usuario o contraseña incorrectos', str(serializer.errors['non_field_errors'][0]))
        
    def test_login_serializer_password_incorrecta(self):
        
        datos = self.datos_validos.copy()
        datos['password'] = 'passwordIncorrecto'
        serializer = LoginSerializer(data=datos)
        self.assertFalse(serializer.is_valid())
        self.assertIn('Usuario o contraseña incorrectos', str(serializer.errors['non_field_errors'][0]))
        
    def test_login_serializer_campos_faltantes(self):
        
        datos = self.datos_validos.copy()
        datos.pop('password')
        serializer = LoginSerializer(data=datos)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)
        
        datos = self.datos_validos.copy()
        datos.pop('username')
        serializer = LoginSerializer(data=datos)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)
from django.test import TestCase
from django.contrib.auth import get_user_model

from ..serializers import *

User = get_user_model()

class VerPerfilSerializerTests(TestCase):
    def setUp(self):
        self.datos_validos= {
            'username': 'pepito',
            'nombre': 'Pepe',
            'apellidos': 'Pérez',
            'email':'pepe@pepe.es',
            'DNI':'12345678A',
            'password':'pepe1234'
        }
      
    def test_ver_perfil_serializer_valido(self):
        
        serializer = VerPerfilSerializer(self.datos_validos)
        datos = serializer.data
        
        self.assertEqual(datos['username'], 'pepito')
        self.assertEqual(datos['nombre'], 'Pepe')
        self.assertEqual(datos['apellidos'], 'Pérez')
        self.assertEqual(datos['email'], 'pepe@pepe.es')
        self.assertEqual(datos['DNI'], '12345678A')
        
    def test_ver_perfil_serializer_no_password_ni_id(self):
        
        serializer = VerPerfilSerializer(self.datos_validos)
        datos = serializer.data
        
        self.assertNotIn('password', datos)
        self.assertNotIn('id_usuario', datos)
        self.assertEqual(set(datos.keys()), {'username', 'nombre', 'apellidos','email', 'DNI'})
        
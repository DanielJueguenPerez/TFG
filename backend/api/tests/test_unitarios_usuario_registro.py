from django.test import TestCase
from django.contrib.auth import get_user_model

from ..serializers import *

User = get_user_model()

class RegistroUsuarioSerializerTests(TestCase):
    def setUp(self):
        self.datos_validos= {
            'username': 'pepito',
            'nombre': 'Pepe',
            'apellidos': 'Pérez',
            'email':'pepe@pepe.es',
            'DNI':'12345678A',
            'password':'pepe1234',
            'password2':'pepe1234',
        }
        
    def test_registro_serializer_valido_datos_correctos(self):
        
        # Inicializamos el serializer con los datos válidos
        serializer = RegistroSerializer(data=self.datos_validos)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        
        # Llamamos al método save para crear el usuario
        user = serializer.save()
        
        # Verificamos que el usuario se ha creado correctamente
        self.assertTrue(User.objects.filter(username='pepito').exists())
        
        # Verificamos que el usuario tiene los datos correctos
        usuario_db = User.objects.get(username='pepito')
        self.assertEqual(usuario_db.username, 'pepito')
        self.assertEqual(usuario_db.nombre, 'Pepe')
        self.assertEqual(usuario_db.apellidos, 'Pérez')
        self.assertEqual(usuario_db.email, 'pepe@pepe.es')
        self.assertEqual(usuario_db.DNI, '12345678A')
        
        # Verificamos que la contraseña se ha guardado correctamente
        self.assertTrue(usuario_db.check_password('pepe1234'))
        
        # Verificamos que password2 no persiste como atributo
        self.assertFalse(hasattr(usuario_db, 'password2'))
        
    def test_registro_serializer_passwords_no_coinciden(self):
        
        datos = self.datos_validos.copy()
        datos['password2'] = 'manolo1234'
        serializer = RegistroSerializer(data=datos)
        self.assertFalse(serializer.is_valid())
        self.assertIn('Las contraseñas no coinciden', serializer.errors['non_field_errors'][0])
        
    def test_registro_serializer_password_corta(self):
        
        datos = self.datos_validos.copy()
        datos['password'] = 'pepe'
        serializer = RegistroSerializer(data=datos)
        self.assertFalse(serializer.is_valid())
        self.assertIn('Ensure this field has at least 8 characters.', serializer.errors['password'][0])
        
    def test_registro_serializer_campos_faltantes(self):
        
        datos = self.datos_validos.copy()
        # Eliminamos el campo username para simular un error
        datos.pop('username') 
        serializer = RegistroSerializer(data=datos)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)
        
    def test_registro_serializer_email_invalido(self):
        
        datos = self.datos_validos.copy()
        datos['email'] = 'pepe@pepe'
        serializer = RegistroSerializer(data=datos)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
        
    def test_registro_serializer_username_duplicado(self):
        
        #Primero creamos el usuario correcto
        serializer = RegistroSerializer(data=self.datos_validos)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()
        # Ahora intentamos crear otro usuario con el mismo username
        datos_duplicados = self.datos_validos.copy()
        datos_duplicados['email'] = 'manolo@manolo.es'
        serializer_duplicado = RegistroSerializer(data=datos_duplicados)
        self.assertFalse(serializer_duplicado.is_valid())
        # Intentamos guardar el serializer duplicado, lo cual dara un error
        with self.assertRaises(Exception):
            serializer_duplicado.save()
            
    def test_registro_serializer_no_password2(self):
        
        serializer = RegistroSerializer(data=self.datos_validos)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        datos_validos = serializer.validated_data
        self.assertNotIn('password2', datos_validos)
        # Password si debe aparecer
        self.assertIn('password', datos_validos)
        
    def test_registro_serializer_campos_largo(self):
        
        datos = self.datos_validos.copy()
        datos['username'] = 'a' * 151 # Excede el max_length de 150
        serializer = RegistroSerializer(data=datos)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)
        # Verificamos que el error es por longitud
        self.assertIn('Ensure this field has no more than 150 characters.', serializer.errors['username'][0])
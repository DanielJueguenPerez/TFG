from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

from ..serializers import *

User = get_user_model()

class CambiarPasswordSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='12345678A',
            password="contraseña123"
        )
        self.context = {"request": type("Request", (), {"user": self.user})}

    def test_cambiar_password_serializer_valido(self):
        datos = {
            "password_actual": "contraseña123",
            "password_nuevo": "123contraseña",
            "password_nuevo_2": "123contraseña"
        }
        
        # Inicializamos el serializer
        serializer = CambiarPasswordSerializer(data=datos, context=self.context)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        password_actualizada = serializer.save()
        self.assertTrue(password_actualizada.check_password("123contraseña"))
        
    def test_cambiar_password_serializer_actual_incorrecta(self):
        datos = {
            "password_actual": "contraseña123456",
            "password_nuevo": "123contraseña",
            "password_nuevo_2": "123contraseña"
        }
        
        # Inicializamos el serializer
        serializer = CambiarPasswordSerializer(data=datos, context=self.context)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Contraseña actual incorrecta", serializer.errors["error"][0])
        
    def test_cambiar_password_serializer_nuevas_no_iguales(self):
        datos = {
            "password_actual": "contraseña122",
            "password_nuevo": "123contraseña1",
            "password_nuevo_2": "123contraseña"
        }
        
        # Inicializamos el serializer
        serializer = CambiarPasswordSerializer(data=datos, context=self.context)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Las contraseñas no coinciden", serializer.errors["error"][0])
        
    def test_cambiar_password_serializer_demasiado_corta(self):
        datos = {
            "password_actual": "contraseña122",
            "password_nuevo": "123",
            "password_nuevo_2": "123"
        }
        
        # Inicializamos el serializer
        serializer = CambiarPasswordSerializer(data=datos, context=self.context)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Ensure this field has at least 8 characters.", serializer.errors["password_nuevo"][0])
        
    def test_cambiar_password_serializer_campos_faltantes(self):
        datos = {
            "password_actual": "contraseña122",
        }
        
        # Inicializamos el serializer
        serializer = CambiarPasswordSerializer(data=datos, context=self.context)
        self.assertFalse(serializer.is_valid())
        self.assertIn("password_nuevo", serializer.errors)
        self.assertIn("password_nuevo_2", serializer.errors)
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

from ..serializers import *

User = get_user_model()

class EditarPerfilSerializerTests(TestCase):
    def setUp(self):
        self.usuario = User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='12345678A',
            password='pepe1234',
        )
        self.usuario_editado = {
            'username': 'periquito',
            'nombre': 'Perico',
            'apellidos': 'De los Palotes',
            'email': 'pericodelospalotes@hotmail.com',
            'DNI': '11111111Y',
            'password': ''       
        }
        
    def test_editar_perfil_serializer_valido_sin_password(self):
        
        serializer = EditarPerfilSerializer(instance=self.usuario, data=self.usuario_editado)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        usuario_editado = serializer.save()
        
        self.assertEqual(usuario_editado.username, 'periquito')
        self.assertEqual(usuario_editado.nombre, 'Perico')
        self.assertEqual(usuario_editado.apellidos, 'De los Palotes')
        self.assertEqual(usuario_editado.email, 'pericodelospalotes@hotmail.com')
        self.assertEqual(usuario_editado.DNI, '11111111Y')
        self.assertTrue(usuario_editado.check_password('pepe1234'))
        
    def test_editar_perfil_serializer_valido_con_password(self):
        
        datos = self.usuario_editado.copy()
        datos['password'] = 'nuevapassword'
        serializer = EditarPerfilSerializer(instance=self.usuario, data=datos)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        usuario_editado = serializer.save()

        self.assertTrue(usuario_editado.check_password('nuevapassword'))
        
    def test_editar_perfil_serializer_campo_desconocido(self):
        
        datos = self.usuario_editado.copy()
        datos['campodesconocido'] = 'algo'
        serializer = EditarPerfilSerializer(instance=self.usuario, data=datos)
        with self.assertRaises(ValidationError) as excepcion:
            serializer.is_valid(raise_exception=True)
            
        self.assertIn("campodesconocido", str(excepcion.exception))
        self.assertIn("no es válido", str(excepcion.exception))
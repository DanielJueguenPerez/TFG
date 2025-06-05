from django.test import TestCase
from ..models import *
from ..serializers import *
from django.contrib.auth import get_user_model

User = get_user_model()

class TestComentarioSerializerTest(TestCase):
    def setUp(self):
        self.usuario= User.objects.create_user(
            username= 'pepito',
            nombre= 'Pepe',
            apellidos= 'Pérez',
            email='pepe@pepe.es',
            DNI='12345678A',
            password='pepe1234',
        )

        self.grado = Grado.objects.create(
            nombre='Grado en Ingeniería Informática',
            url='ingenieríainformatica.com'
        )

        self.asignatura = Asignatura.objects.create(
            nombre='Cálculo',
            curso=1,
            id_grado=self.grado
        )
        
        self.comentario = Comentario.objects.create(
            id_usuario = self.usuario,
            id_asignatura = self.asignatura,
            texto = 'Asignatura complicada'
        )
        
    def test_comentario_serializer_campos(self):
            
        serializer = ComentarioSerializer(self.comentario)
        datos = serializer.data
            
        self.assertEqual(datos['id_comentario'], self.comentario.id_comentario)
        self.assertEqual(datos['texto'], 'Asignatura complicada')
        self.assertIn('fecha', datos)
        self.assertIsInstance(datos['fecha'], str)
        
    def test_comentario_serializer_no_campos_incorrectos(self):
        
        serializer = ComentarioSerializer(self.comentario)
        datos = serializer.data
        
        campos = set(datos.keys())
        self.assertEqual(campos,{'id_comentario','texto','fecha'})
        self.assertNotIn('id_usuario',datos)
        self.assertNotIn('id_asignatura',datos)
        
    def test_comentario_serializer_texto_requerido(self):
        
        datos={}
        serializer = ComentarioSerializer(data=datos)
        self.assertFalse(serializer.is_valid())
        self.assertIn('texto', serializer.errors)
        self.assertIn('This field is required.', serializer.errors['texto'][0])
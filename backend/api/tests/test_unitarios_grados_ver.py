from django.test import TestCase
from ..models import Grado
from ..serializers import *

class VerGradosSerializerTests(TestCase):
    def setUp(self):
        self.grado = Grado.objects.create(
            nombre='Grado en Ingeniería Informática',
            url='ingenieríainformatica.com'
        )
    
    def test_ver_grados_serializer_valido(self):
        
        serializer = VerGradosSerializer(self.grado)
        datos = serializer.data
        
        self.assertEqual(datos['id_grado'], self.grado.id_grado)
        self.assertEqual(datos['nombre'], 'Grado en Ingeniería Informática')
        self.assertEqual(datos['url'], 'ingenieríainformatica.com')
        
    def test_ver_grados_serializer_no_campos_extra(self):
        
        serializer = VerGradosSerializer(self.grado)
        datos = serializer.data
        
        self.assertEqual(set(datos.keys()), {'id_grado','nombre','url'})
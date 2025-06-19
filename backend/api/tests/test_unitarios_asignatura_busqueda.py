from django.test import TestCase
from ..models import Grado, Asignatura
from ..serializers import *

class BuscarAsignaturasSerializerTests(TestCase):
    def setUp(self):
        self.grado = Grado.objects.create(
            nombre='Grado en Ingeniería Informática',
            url='ingenieríainformatica.com'
        )
        self.asignatura = Asignatura.objects.create(
            nombre='Cálculo',
            curso=1,
            id_grado=self.grado
        )
    
    def test_buscar_asignaturas_serializer_valido(self):
        
        serializer = BuscarAsignaturasSerializer(self.asignatura)
        datos = serializer.data
        
        self.assertEqual(datos['id_asignatura'], self.asignatura.id_asignatura)
        self.assertEqual(datos['nombre'], 'Cálculo')
        self.assertEqual(datos['curso'], 1)
        self.assertEqual(datos['id_grado'], self.asignatura.id_grado.id_grado)
        
    def test_buscar_asignaturas_serializer_no_campos_extra(self):
        
        serializer = BuscarAsignaturasSerializer(self.asignatura)
        datos = serializer.data
        
        self.assertEqual(set(datos.keys()), {'id_asignatura','nombre','curso', 'id_grado', 'nombre_grado'})
from django.test import TestCase
from ..models import Grado, Asignatura
from ..serializers import *

class DetallesGradoSerializerTest(TestCase):
    def setUp(self):
        self.grado = Grado.objects.create(
            nombre='Grado en Ingeniería Informática',
            url='ingenieríainformatica.com'
        )
        
        # Curso 1
        self.asignatura = Asignatura.objects.create(
            nombre='Cálculo',
            curso=1,
            id_grado=self.grado
        )
        self.asignatura = Asignatura.objects.create(
            nombre='Álgebra',
            curso=1,
            id_grado=self.grado
        )
        
        # Curso 2
        self.asignatura = Asignatura.objects.create(
            nombre='Estructura de Computadores',
            curso=2,
            id_grado=self.grado
        )
        self.asignatura = Asignatura.objects.create(
            nombre='Bases de datos',
            curso=2,
            id_grado=self.grado
        )
        
    def test_detalles_grado_serializer_datos(self):
        
        serializer = DetallesGradoSerializer(self.grado)
        datos = serializer.data
        
                
        self.assertEqual(datos['id_grado'], self.grado.id_grado)
        self.assertEqual(datos['nombre'], 'Grado en Ingeniería Informática')
        self.assertEqual(datos['url'], 'ingenieríainformatica.com')
        self.assertEqual(len(datos['asignaturas_cursos']),2)
        self.assertEqual(datos['asignaturas_cursos'][0]['curso'],1) #comprobamos que el primer bloque es del primer curso
        self.assertEqual(datos['asignaturas_cursos'][1]['curso'],2) #compromabos que el segundo bloque es del segundo curso
        
    def test_detalles_grado_serializer_asignaturas_agrupadas_por_curso_y_nombre(self):
        
        serializer = DetallesGradoSerializer(self.grado)
        datos = serializer.data
        
        cursos = datos['asignaturas_cursos']
        self.assertEqual(len(cursos),2)
        
        # Verificamos la estructura y el contenido
        # Guardamos el primer curso
        curso1 = next(curso for curso in cursos if curso['curso'] == 1)
        # Guardamos el segundo curso
        curso2 = next(curso for curso in cursos if curso['curso'] == 2)
        
        nombres1 = [asignatura['nombre'] for asignatura in curso1 ['asignaturas']]
        nombres2 = [asignatura['nombre'] for asignatura in curso2 ['asignaturas']]
        
        self.assertListEqual(sorted(nombres1), ['Cálculo', 'Álgebra'])
        self.assertListEqual(sorted(nombres2), ['Bases de datos', 'Estructura de Computadores'])
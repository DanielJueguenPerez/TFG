from django.test import TestCase
from ..models import *
from ..serializers import *

class DetallesAsignaturaSerializerTests(TestCase):
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
        
        #Creamos estadisticas para la asignatura
        EstadisticasAsignatura.objects.create(
            id_asignatura = self.asignatura,
            anioAcademico = 2022,
            num_matriculados = 100,
            aprobados = 60,
            suspensos = 30,
            no_presentados = 10    
        )
        
        EstadisticasAsignatura.objects.create(
            id_asignatura = self.asignatura,
            anioAcademico = 2023,
            num_matriculados = 200,
            aprobados = 110,
            suspensos = 60,
            no_presentados = 30    
        )
        
        EstadisticasAsignatura.objects.create(
            id_asignatura = self.asignatura,
            anioAcademico = 2024,
            num_matriculados = 180,
            aprobados = 90,
            suspensos = 50,
            no_presentados = 40   
        )
    
    def test_detalles_asignatura_serializer_datos(self):
        
        serializer = DetallesAsignaturaSerializer(self.asignatura)
        datos = serializer.data
        
        self.assertEqual(datos['id_asignatura'], self.asignatura.id_asignatura)
        self.assertEqual(datos['nombre'], 'Cálculo')
        self.assertEqual(datos['curso'], 1)
        self.assertEqual(len(datos['estadisticas_anios']),3)
        self.assertEqual(datos['estadisticas_anios'][0]['Año Academico'],2022) 
        self.assertEqual(datos['estadisticas_anios'][1]['Año Academico'],2023) 
        self.assertEqual(datos['estadisticas_anios'][2]['Año Academico'],2024) 
        
    def test_detalles_asignatura_serializer_estadisticas_agrupadas_por_anio(self):
        
        serializer = DetallesAsignaturaSerializer(self.asignatura)
        datos = serializer.data
        
        bloques = datos['estadisticas_anios']
        # Comprobamos que hay tres bloques, por los tres años académicos creados
        self.assertEqual(len(bloques),3)
        
        # Diccionario para facilitar el acceso a los datos
        anios = {bloque['Año Academico']: bloque['estadisticas'] for bloque in bloques}
        
        # Los tres años existen
        self.assertIn(2022, anios)
        self.assertIn(2023, anios)
        self.assertIn(2024, anios)
        
        # Verificamos los valores
        estadistica_2022 = anios[2022][0]
        self.assertEqual(estadistica_2022['num_matriculados'],100)
        self.assertEqual(estadistica_2022['aprobados'],60)
        self.assertEqual(estadistica_2022['suspensos'],30)
        self.assertEqual(estadistica_2022['no_presentados'],10)
        self.assertIn('id_estadisticasAsignatura', estadistica_2022)
        
        estadistica_2023 = anios[2023][0]
        self.assertEqual(estadistica_2023['num_matriculados'],200)
        self.assertEqual(estadistica_2023['aprobados'],110)
        self.assertEqual(estadistica_2023['suspensos'],60)
        self.assertEqual(estadistica_2023['no_presentados'],30)
        self.assertIn('id_estadisticasAsignatura', estadistica_2023)
        
        estadistica_2024 = anios[2024][0]
        self.assertEqual(estadistica_2024['num_matriculados'],180)
        self.assertEqual(estadistica_2024['aprobados'],90)
        self.assertEqual(estadistica_2024['suspensos'],50)
        self.assertEqual(estadistica_2024['no_presentados'],40)
        self.assertIn('id_estadisticasAsignatura', estadistica_2022)
        
    def test_detalles_asignatura_serializer_ordenado(self):
        
        serializer = DetallesAsignaturaSerializer(self.asignatura)
        datos = serializer.data

        bloques = datos['estadisticas_anios']
        
        anios = [bloque['Año Academico'] for bloque in bloques]
        self.assertEqual(anios,[2022,2023,2024])
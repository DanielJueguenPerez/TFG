from rest_framework.test import APITestCase
from rest_framework import status
from ..models import *

class DetallesAsignaturaTests(APITestCase):
    def setUp(self):
        # Se crea una asignatura y un grado
        self.grado = Grado.objects.create(nombre='Grado en Física', url='http://ejemplo.com/fisica')
        self.asignatura = Asignatura.objects.create(nombre='Relatividad General', curso=4, id_grado=self.grado)
        self.url = f'/api/asignaturas/{self.asignatura.id_asignatura}/'
        # Se crean algunas estadisticas
        EstadisticasAsignatura.objects.create(
            id_asignatura=self.asignatura, anioAcademico=2022, num_matriculados=300, aprobados=150, suspensos=100, no_presentados=50)
        EstadisticasAsignatura.objects.create(
            id_asignatura=self.asignatura, anioAcademico=2023, num_matriculados=450, aprobados=210, suspensos=170, no_presentados=70)
        EstadisticasAsignatura.objects.create(
            id_asignatura=self.asignatura, anioAcademico=2024, num_matriculados=298, aprobados=179, suspensos=78, no_presentados=41)
        EstadisticasAsignatura.objects.create(
            id_asignatura=self.asignatura, anioAcademico=2025, num_matriculados=345, aprobados=218, suspensos=98, no_presentados=29)

        
    def test_detallesgrado_get_sin_autenticación_correcto(self):
        resp = self.client.get(self.url)
        # Guardamos en aniosAcademicos los bloques de estadisticas por año academico (deberia de haber 4)
        aniosAcademicos = resp.data['estadisticas_anios']
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(aniosAcademicos), 4)
        # Comprobamos el orden de los años academicos
        self.assertEqual(aniosAcademicos[0]['Año Academico'], 2022)
        self.assertEqual(aniosAcademicos[1]['Año Academico'], 2023)
        self.assertEqual(aniosAcademicos[2]['Año Academico'], 2024)
        self.assertEqual(aniosAcademicos[3]['Año Academico'], 2025)
        # Comprobamos algunas de las estadisticas de cada año academico
        self.assertEqual(aniosAcademicos[0]['estadisticas'][0]['aprobados'], 150)
        self.assertEqual(aniosAcademicos[1]['estadisticas'][0]['num_matriculados'], 450)
        self.assertEqual(aniosAcademicos[2]['estadisticas'][0]['suspensos'], 78)
        self.assertEqual(aniosAcademicos[3]['estadisticas'][0]['no_presentados'], 29)

    
    def test_detallesgrado_campos_correctos(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que los campos devueltos son los correctos
        self.assertCountEqual(
            resp.data.keys(), ['id_asignatura','nombre','curso','estadisticas_anios']
        )
    
    def test_detallesasignatura_id_no_existe(self):
        # Se intenta acceder a una asignatura que no existe
        resp = self.client.get('/api/asignaturas/100000000/')
        # Se espera un error 404 con el mensaje de que no existe la asignatura
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(resp.data['detail'], 'No Asignatura matches the given query.')
        
    def test_detallesasignatura_id_no_numerico(self):
        # Se intenta acceder a una asignatura con un id no numerico
        resp = self.client.get('/api/asignaturas/id_incorrecto/')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_buscarasignaturas_solicitud_incorrecta(self):
        # Se intenta hacer una solicitud POST a la URL de detalles de asignatura
        resp = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED) 

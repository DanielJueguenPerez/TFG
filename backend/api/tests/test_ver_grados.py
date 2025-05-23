from rest_framework.test import APITestCase
from rest_framework import status
from ..models import Grado

class VerGradosTests(APITestCase):
    def setUp(self):
        self.url = '/api/grados/'
        Grado.objects.create(nombre='Grado en Matemáticas', url='http://ejemplo.com/matematicas')
        Grado.objects.create(nombre='Grado en Física', url='http://ejemplo.com/fisica')
        Grado.objects.create(nombre='Grado en Química', url='http://ejemplo.com/quimica')
        
    def test_vergrados_get_sin_autenticación_correcto_ordenado(self):
        resp = self.client.get(self.url)
        nombres = [grado['nombre'] for grado in resp.data['results']]
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(nombres, sorted(['Grado en Física', 'Grado en Matemáticas', 'Grado en Química']))
        
    def test_vergrados_campos_correctos(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertCountEqual(
            resp.data['results'][0].keys(), ['id_grado', 'nombre', 'url']
        )
        
    def test_vergrados_paginacion_pagina_1(self):
        # Se generan grados adicionales
        for i in range(4, 19):
            Grado.objects.create(nombre=f'Grado {i}', url=f'http://ejemplo.com/grado{i}')
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data['results']), 10)
        self.assertIsNotNone(resp.data.get('next'))
        self.assertIsNone(resp.data.get('previous'))
        
    def test_vergrados_paginacion_pagina_2(self):
        # Se generan grados adicionales
        for i in range(4, 20):
            Grado.objects.create(nombre=f'Grado {i}', url=f'http://ejemplo.com/grado{i}')
        resp = self.client.get(self.url+'?page=2')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Creamos 16 grados adicionales a los 3 iniciales, por lo que si la primera pagina tiene 10
        # la segunda deberia tener 9
        self.assertEqual(len(resp.data['results']), 9)
        self.assertIsNone(resp.data.get('next'))
        self.assertIsNotNone(resp.data.get('previous'))
        
    def test_vergrados_paginacion_pagina_invalida(self):
        resp = self.client.get(self.url+'?page=paginainvalida')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_vergrados_no_grados(self):
        Grado.objects.all().delete()
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['results'], [])
        
    def test_vergrados_solicitud_incorrecta(self):
        resp = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED) 

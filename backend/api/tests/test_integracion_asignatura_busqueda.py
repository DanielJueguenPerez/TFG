from rest_framework.test import APITestCase
from rest_framework import status
from ..models import *

class BuscarAsignaturasTests(APITestCase):
    def setUp(self):
        self.url = '/api/asignaturas/'
        # Se crean algunos grados
        self.grado1 = Grado.objects.create(nombre='Grado en Matemáticas', url='http://ejemplo.com/matematicas')
        self.grado2 = Grado.objects.create(nombre='Grado en Física', url='http://ejemplo.com/fisica')
        self.grado3 = Grado.objects.create(nombre='Grado en Química', url='http://ejemplo.com/quimica')
        # Se crean algunas asignaturas
        Asignatura.objects.create(nombre='Álgebra', curso=1, id_grado=self.grado1)
        Asignatura.objects.create(nombre='Cálculo', curso=1, id_grado=self.grado1)
        Asignatura.objects.create(nombre='Física Cuantica', curso=1, id_grado=self.grado2)
        Asignatura.objects.create(nombre='Relatividad General', curso=1, id_grado=self.grado2)
        Asignatura.objects.create(nombre='Geología', curso=1, id_grado=self.grado3)
        Asignatura.objects.create(nombre='Bioquímica', curso=1, id_grado=self.grado3)
        # Se generan asignaturas adicionales
        for i in range(7, 25):
            Asignatura.objects.create(nombre=f'Asignatura {i}', curso=(i%4)+1, id_grado_id=(i%3)+1)
        
    def test_buscarasignaturas_get_sin_autenticación_correcto(self):
        resp = self.client.get(self.url)
        # Guardamos en nombres los nombres de las asignaturas que devuelve la API
        nombres = [asignatura['nombre'] for asignatura in resp.data['results']]
        # Guardamos en nombres1 los nombres de las asignaturas que tenemos en la base de datos
        nombres1 = [asignatura.nombre for asignatura in Asignatura.objects.all()]
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comparamos los nombres de las asignaturas que devuelve la API con los nombres 
        # de las 10 primeras asignaturas ordenadas que tenemos en la base de datos
        self.assertEqual(nombres, sorted(nombres1)[:10])
        
    def test_buscarasignaturas_campos_correctos(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que la respuesta contiene los campos esperados
        self.assertCountEqual(
            resp.data['results'][0].keys(), ['id_asignatura', 'nombre', 'curso', 'id_grado', 'nombre_grado']
        )

    def test_buscarasignaturas_paginacion_pagina_1(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que la respuesta contiene 10 resultados
        self.assertEqual(len(resp.data['results']), 10)
        # Comprobamos que hay un campo 'next' y que no hay 'previous'
        self.assertIsNotNone(resp.data.get('next'))
        self.assertIsNone(resp.data.get('previous'))
        
    def test_buscarasignaturas_paginacion_pagina_2(self):
        resp = self.client.get(self.url+'?page=2')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que la respuesta contiene 10 resultados
        self.assertEqual(len(resp.data['results']), 10)

        self.assertIsNotNone(resp.data.get('next'))
        self.assertIsNotNone(resp.data.get('previous'))
        
    def test_buscarasignaturas_paginacion_pagina_3(self):
        resp = self.client.get(self.url+'?page=3')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que la respuesta contiene 4 resultados
        self.assertEqual(len(resp.data['results']), 4)
        # Comprobamos que no hay un campo 'next' y que hay 'previous'
        self.assertIsNone(resp.data.get('next'))
        self.assertIsNotNone(resp.data.get('previous'))

    def test_buscarasignaturas_paginacion_pagina_invalida(self):
        resp = self.client.get(self.url+'?page=paginainvalida')
        # Comprobamos que la respuesta es un error 404
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_buscarasignaturas_busqueda_keyword(self):
        resp = self.client.get(self.url+'?search=bioq')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que la respuesta contiene asignaturas que coinciden con la búsqueda
        self.assertIn('Bioquímica', [asignatura['nombre'] for asignatura in resp.data['results']])
        resp = self.client.get(self.url+'?search=Relatividad General')
        self.assertIn('Relatividad General', [asignatura['nombre'] for asignatura in resp.data['results']])
        
    def test_buscarasignaturas_busqueda_keyword_paginacion(self):
        resp = self.client.get(self.url+'?page=2&search=gnatura')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que la respuesta contiene asignaturas que coinciden con la búsqueda
        self.assertIn('Asignatura 21', [asignatura['nombre'] for asignatura in resp.data['results']])
        
    def test_buscarasignaturas_sin_resultados(self):
        resp = self.client.get(self.url+'?search=Educación plástica')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que la respuesta no contiene resultados
        self.assertIsNone(resp.data.get('next'))
        self.assertIsNone(resp.data.get('previous'))
        self.assertEqual(resp.data['results'], [])
        self.assertEqual(resp.data['count'], 0)
        
    def test_buscarasignaturas_solicitud_incorrecta(self):
        resp = self.client.post(self.url, {}, format='json')
        # Comprobamos que la respuesta es un error 405 (Método no permitido)
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED) 
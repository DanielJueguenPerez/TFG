from rest_framework.test import APITestCase
from rest_framework import status
from ..models import *

class DetallesGradoTests(APITestCase):
    def setUp(self):
        # Se crea un grado
        self.grado = Grado.objects.create(nombre='Grado en Física', url='http://ejemplo.com/fisica')
        self.url = f'/api/grados/{self.grado.id_grado}/'
        # Se crean algunas asignaturas
        Asignatura.objects.create(nombre='Álgebra', curso=1, id_grado=self.grado)
        Asignatura.objects.create(nombre='Cálculo', curso=1, id_grado=self.grado)
        Asignatura.objects.create(nombre='Álgebra 2', curso=2, id_grado=self.grado)
        Asignatura.objects.create(nombre='Cálculo 2', curso=2, id_grado=self.grado)
        Asignatura.objects.create(nombre='Física Cuantica', curso=3, id_grado=self.grado)
        Asignatura.objects.create(nombre='Relatividad General', curso=4, id_grado=self.grado)

        
    def test_detallesgrado_get_sin_autenticación_correcto(self):
        resp = self.client.get(self.url)
        # Guardamos en cursos los bloques de asignaturas por curso (deberia de haber 4)
        cursos = resp.data['asignaturas_cursos']
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(cursos), 4)
        # Comprobamos el orden de los cursos
        self.assertEqual(cursos[0]['curso'], 1)
        self.assertEqual(cursos[1]['curso'], 2)
        self.assertEqual(cursos[2]['curso'], 3)
        self.assertEqual(cursos[3]['curso'], 4)
        # Comprobamos las asignaturas de cada curso
        self.assertEqual(cursos[0]['asignaturas'][0]['nombre'], 'Cálculo')
        self.assertEqual(cursos[0]['asignaturas'][1]['nombre'], 'Álgebra')
        self.assertEqual(cursos[1]['asignaturas'][0]['nombre'], 'Cálculo 2')
        self.assertEqual(cursos[1]['asignaturas'][1]['nombre'], 'Álgebra 2')
        self.assertEqual(cursos[2]['asignaturas'][0]['nombre'], 'Física Cuantica')
        self.assertEqual(cursos[3]['asignaturas'][0]['nombre'], 'Relatividad General')
        
    def test_detallesgrado_campos_correctos(self):
        # Se accede a los detalles del grado y se comprueba que los campos son los correctos
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que los campos devueltos son los correctos
        self.assertCountEqual(
            resp.data.keys(), ['id_grado', 'nombre', 'url', 'asignaturas_cursos']
        )
    
    def test_detallesgrado_id_no_existe(self):
        # Se intenta acceder a un grado que no existe
        resp = self.client.get('/api/grados/100000000/')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
        # Se espera un error 404 con el mensaje de que no existe el grado
        self.assertEqual(resp.data['detail'], 'No Grado matches the given query.')
        
    def test_detallesgrado_id_no_numerico(self):
        # Se intenta acceder a un grado con un id no numerico
        resp = self.client.get('/api/grados/id_incorrecto/')
        # Se espera un error 404 porque el id no es numerico
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_buscarasignaturas_solicitud_incorrecta(self):
        # Se intenta hacer una solicitud POST a la URL de detalles del grado
        resp = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED) 
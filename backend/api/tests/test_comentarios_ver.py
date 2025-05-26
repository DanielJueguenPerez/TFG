from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from ..models import *

User = get_user_model()

class VerComentariosAsignaturaTests(APITestCase):
    def setUp(self):
        # Se crea una asignatura y un grado
        self.grado = Grado.objects.create(nombre='Grado en Física', url='http://ejemplo.com/fisica')
        self.asignatura = Asignatura.objects.create(nombre='Relatividad General', curso=4, id_grado=self.grado)
        self.asignatura1 = Asignatura.objects.create(nombre='Cálculo', curso=1, id_grado=self.grado)
        self.asignatura2 = Asignatura.objects.create(nombre='Álgebra', curso=1, id_grado=self.grado)
        # Se crean dos usuarios
        self.usuario1 = User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='98765432Z',
            password='pepe1234'
        )
        self.token1 = Token.objects.create(user=self.usuario1)
        self.usuario2 = User.objects.create_user(
            username='manolete',
            nombre='Manolo',
            apellidos='López',
            email='manolo@manolo.es',
            DNI='12345678A',
            password='manolo1234'
        )
        self.token2 = Token.objects.create(user=self.usuario2)
        # Se crean algunos comentarios de ambos usuarios
        self.comentariopepe = Comentario.objects.create(
            texto="Comentario de Pepe en Relatividad", id_usuario=self.usuario1, id_asignatura=self.asignatura)
        self.comentariopepe = Comentario.objects.create(
            texto="Comentario de Pepe en Relatividad 2", id_usuario=self.usuario1, id_asignatura=self.asignatura)
        self.comentariopepe = Comentario.objects.create(
            texto="Comentario de Pepe en Álgebra", id_usuario=self.usuario1, id_asignatura=self.asignatura2)
        self.comentariomanolo = Comentario.objects.create(
            texto="Comentario de Manolo en Relatividad", id_usuario=self.usuario2, id_asignatura=self.asignatura)
        self.comentariomanolo = Comentario.objects.create(
            texto="Comentario de Manolo en Relatividad 2", id_usuario=self.usuario2, id_asignatura=self.asignatura)
        self.comentariomanolo = Comentario.objects.create(
            texto="Comentario de Manolo en Relatividad 3", id_usuario=self.usuario2, id_asignatura=self.asignatura)
        # Se define la URL
        self.url = f'/api/comentarios/{self.asignatura.id_asignatura}/'
        self.url1 = f'/api/comentarios/{self.asignatura1.id_asignatura}/'
        
    def test_vercomentarios_correcto(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Se comprueba que los comentarios recibidos son los esperados
        comentarios = resp.data['results']
        self.assertEqual(len(comentarios), 5)
        self.assertEqual(comentarios[0]['texto'], "Comentario de Pepe en Relatividad")
        self.assertEqual(comentarios[0]['username'], "pepito")
        self.assertEqual(comentarios[1]['texto'], "Comentario de Pepe en Relatividad 2")
        self.assertEqual(comentarios[1]['username'], "pepito")
        self.assertEqual(comentarios[2]['texto'], "Comentario de Manolo en Relatividad")
        self.assertEqual(comentarios[2]['username'], "manolete")
        self.assertEqual(comentarios[3]['texto'], "Comentario de Manolo en Relatividad 2")
        self.assertEqual(comentarios[3]['username'], "manolete")
        self.assertEqual(comentarios[4]['texto'], "Comentario de Manolo en Relatividad 3")
        self.assertEqual(comentarios[4]['username'], "manolete")
        
    def test_vercomentarios_asignatura_no_existe(self):
        # Hacemos una petición a una asignatura que no existe
        resp = self.client.get('/api/comentarios/9999/')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
        # Comprobamos que la respuesta es un error 404 (no encontrado)
        self.assertEqual(resp.data, {"detail": "No Asignatura matches the given query."})
        
    def test_vercomentarios_asignatura_sin_comentarios(self):
        resp = self.client.get(self.url1)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que la respuesta es correcta y no hay comentarios
        self.assertEqual(resp.data['count'], 0)
        self.assertEqual(resp.data['results'], [])
        
    def test_vercomentarios_solo_asignatura_correcta(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        comentarios = [comentario['texto'] for comentario in resp.data['results']]
        # Comprobamos que solo se muestran los comentarios de la asignatura correcta
        self.assertIn("Comentario de Pepe en Relatividad", comentarios)
        self.assertIn("Comentario de Pepe en Relatividad 2", comentarios)
        self.assertIn("Comentario de Manolo en Relatividad", comentarios)
        self.assertIn("Comentario de Manolo en Relatividad 2", comentarios)
        self.assertIn("Comentario de Manolo en Relatividad 3", comentarios)
        self.assertNotIn("Comentario de Pepe en Álgebra", comentarios)
        self.assertEqual(len(comentarios), 5)
        
    def test_vercomentarios_cualquier_usuario(self):
        # Limpiamos cualquier tipo de credenciales
        self.client.credentials()
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK) 
        
    def test_vercomentarios_orden_correcto(self):
        # Limpiamos los comentarios
        Comentario.objects.all().delete()
        tiempo_actual = datetime.now()
        # Creamos comentarios con diferentes fechas
        Comentario.objects.create(texto="Comentario 1", id_usuario=self.usuario1, id_asignatura=self.asignatura, fecha=tiempo_actual)
        Comentario.objects.create(texto="Comentario 1", id_usuario=self.usuario1, id_asignatura=self.asignatura, fecha=tiempo_actual + timedelta(days=1))
        Comentario.objects.create(texto="Comentario 1", id_usuario=self.usuario1, id_asignatura=self.asignatura, fecha=tiempo_actual + timedelta(days=2))        
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Comprobamos que los comentarios están ordenados por fecha
        comentarios = [comentario['texto'] for comentario in resp.data['results']]
        self.assertEqual(comentarios, ["Comentario 1", "Comentario 1", "Comentario 1"])
        
    def test_vercomentarios_solicitud_incorrecta(self):
        # Se intenta hacer una solicitud POST a la URL de ver comentarios de una asignatura
        resp = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED) 
        

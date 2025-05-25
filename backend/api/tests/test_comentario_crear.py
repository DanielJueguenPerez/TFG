from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import *

User = get_user_model()

class DetallesAsignaturaTests(APITestCase):
    def setUp(self):
        # Se crea una asignatura y un grado
        self.grado = Grado.objects.create(nombre='Grado en Física', url='http://ejemplo.com/fisica')
        self.asignatura = Asignatura.objects.create(nombre='Relatividad General', curso=4, id_grado=self.grado)
        # Se define la URL
        self.url = f'/api/comentarios/{self.asignatura.id_asignatura}/nuevo/'
        # Se crea un usuario
        self.usuario = User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='98765432Z',
            password='pepe1234'
        )
        self.token = Token.objects.create(user=self.usuario)
        
    def test_crearcomentario_correcto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.post(self.url, {"texto": "Esto es un comentario"}, format='json')
        self.client.post(self.url, {"texto": "Esto es un comentario 2"}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comentario.objects.count(), 2)
        comentarios = Comentario.objects.all().order_by('id_comentario')
        self.assertEqual(comentarios[0].texto, "Esto es un comentario")
        self.assertEqual(comentarios[1].texto, "Esto es un comentario 2")
        self.assertEqual(comentarios[0].id_usuario, self.usuario)   
        self.assertEqual(comentarios[0].id_asignatura, self.asignatura)

    def test_crearcomentario_no_token(self):
        resp = self.client.post(self.url, {"texto": "Esto es un comentario"}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resp.data, {"detail": "Authentication credentials were not provided."})
    
    def test_crearcomentario_token_incorrecto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + 'EsteTokenNoEsValido')
        resp = self.client.post(self.url, {"texto": "Esto es un comentario"}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resp.data, {"detail": "Invalid token."})
        
    def test_crearcomentario_asignatura_no_existe(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.post('/api/comentarios/nuevo/0000/', {"texto": "Esto es un comentario"}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_crearcomentario_sin_texto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.post(self.url, {"texto": ""}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('This field may not be blank.', str(resp.data))
    
    def test_crearcomentario_sin_campo_texto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('This field is required.', str(resp.data))
        
    def test_crearcomentario_solicitud_incorrecta(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED) 
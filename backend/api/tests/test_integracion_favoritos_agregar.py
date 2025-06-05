from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import *

User = get_user_model()

class AgregarFavoritoTests(APITestCase):
    def setUp(self):
        # Se crea una asignatura y un grado
        self.grado = Grado.objects.create(nombre='Grado en Física', url='http://ejemplo.com/fisica')
        self.asignatura = Asignatura.objects.create(nombre='Relatividad General', curso=4, id_grado=self.grado)
        self.asignatura1 = Asignatura.objects.create(nombre='Cálculo', curso=1, id_grado=self.grado)
        # Se crea un usuarios
        self.usuario = User.objects.create_user(
            username='pepito',
            nombre='Pepe',
            apellidos='Pérez',
            email='pepe@pepe.es',
            DNI='98765432Z',
            password='pepe1234'
        )
        self.token = Token.objects.create(user=self.usuario)
        # Se define la URL
        self.url = f'/api/favoritos/agregar/{self.asignatura.id_asignatura}/'
        self.url1 = f'/api/favoritos/agregar/{self.asignatura1.id_asignatura}/'
        
    def test_agregarfavorito_correcto(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        # Se crean dos favoritos
        resp = self.client.post(self.url, {}, format='json')
        resp1 = self.client.post(self.url1, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        # Comprobamos que efectivamente hay dos favoritos en la base de datos
        self.assertEqual(Favorito.objects.count(), 2)
        # Recuperamos los favoritos
        favoritos = Favorito.objects.all().order_by('id_favorito')
        # comprobamos que los comentarios tienen el texto correcto y el usuario y asignatura correctos
        self.assertEqual(resp.data['username'], "pepito")
        self.assertEqual(resp1.data['username'], "pepito")
        self.assertEqual(resp.data['nombre_asignatura'],"Relatividad General")   
        self.assertEqual(resp1.data['nombre_asignatura'],"Cálculo")   
        
    def test_agregarfavorito_duplicado(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        # Se crean un favorito favoritos
        resp = self.client.post(self.url, {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        # Se intenta crear el mismo favorito de nuevo
        resp1 = self.client.post(self.url, {}, format='json')
        # Comprobamos que la respuesta es un error 400 (solicitud incorrecta) porque el favorito ya existe
        self.assertEqual(resp1.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("No puedes agregar la misma asignatura a favoritos dos veces", str(resp1.data))
        
    def test_agregarfavorito_no_token(self):
        resp = self.client.post(self.url, {}, format='json')
        # Comprobamos que la respuesta es un error 401 (no autorizado) porque no se ha
        # proporcionado un token de autenticación
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resp.data, {"detail": "Authentication credentials were not provided."})
        
    def test_agregarfavorito_token_incorrecto(self):
        # Se intenta crear un favorito con un token incorrecto
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + 'EsteTokenNoEsValido')
        resp = self.client.post(self.url, {""}, format='json')
        # Comprobamos que la respuesta es un error 401 (no autorizado) porque el token es incorrecto
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resp.data, {"detail": "Invalid token."})
        
    def test_agregarfavorito_asignatura_no_existe(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        # Se intenta crear un favorito para una asignatura que no existe
        resp = self.client.post('/api/favoritos/agregar/0000/', {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_agregarfavorito_solicitud_incorrecta(self):
        # Se intenta hacer una solicitud GET a la URL de crear comentario
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED) 
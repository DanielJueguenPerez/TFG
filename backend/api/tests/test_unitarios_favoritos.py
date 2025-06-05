from django.test import TestCase
from ..models import *
from ..serializers import *
from django.contrib.auth import get_user_model

User = get_user_model()

class TestFavoritoSerializerTest(TestCase):
    def setUp(self):
        self.usuario= User.objects.create_user(
            username= 'pepito',
            nombre= 'Pepe',
            apellidos= 'Pérez',
            email='pepe@pepe.es',
            DNI='12345678A',
            password='pepe1234',
        )

        self.grado = Grado.objects.create(
            nombre='Grado en Ingeniería Informática',
            url='ingenieríainformatica.com'
        )

        self.asignatura1 = Asignatura.objects.create(
            nombre='Cálculo',
            curso=1,
            id_grado=self.grado
        )
        
        self.asignatura2 = Asignatura.objects.create(
            nombre='Álgebra',
            curso=1,
            id_grado=self.grado
        )
        
        self.favorito1 = Favorito.objects.create(
            id_usuario=self.usuario,
            id_asignatura=self.asignatura1
        )
        
        self.favorito2 = Favorito.objects.create(
            id_usuario=self.usuario,
            id_asignatura=self.asignatura2
        )
        
    def test_favorito_serializer_campos(self):
        
        serializer = FavoritoSerializer(self.favorito1)
        datos = serializer.data
        
        self.assertEqual(datos['id_favorito'], self.favorito1.id_favorito)
        self.assertEqual(datos['id_asignatura'], self.asignatura1.id_asignatura)
        self.assertEqual(datos['nombre_asignatura'], 'Cálculo')
        self.assertEqual(datos['id_usuario'], self.usuario.id_usuario)
        self.assertEqual(datos['username'], 'pepito')

    def test_favorito_serializer_varios_favoritos(self):
        
        favoritos = [self.favorito1, self.favorito2]
        serializer = FavoritoSerializer(favoritos, many=True)
        datos = serializer.data
        
        self.assertEqual(len(datos), 2)
        
        datos_esperados = {
            self.asignatura1.id_asignatura: 'Cálculo',
            self.asignatura2.id_asignatura: 'Álgebra',
        }
        
        for favorito in datos:
            self.assertIn(favorito['id_asignatura'], datos_esperados)
            self.assertEqual(favorito['nombre_asignatura'], datos_esperados[favorito['id_asignatura']])
            self.assertEqual(favorito['id_usuario'],self.usuario.id_usuario)
            self.assertEqual(favorito['username'], 'pepito')

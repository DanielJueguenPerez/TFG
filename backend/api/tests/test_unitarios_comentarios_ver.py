from django.test import TestCase
from ..models import *
from ..serializers import *
from django.contrib.auth import get_user_model

User = get_user_model()

class TestVerComentariosAsignaturaSerializerTest(TestCase):
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

        self.asignatura = Asignatura.objects.create(
            nombre='Cálculo',
            curso=1,
            id_grado=self.grado
        )
        
        self.comentario1 = Comentario.objects.create(
            id_usuario = self.usuario,
            id_asignatura = self.asignatura,
            texto = 'Asignatura complicada'
        )
        
        self.comentario2 = Comentario.objects.create(
            id_usuario = self.usuario,
            id_asignatura = self.asignatura,
            texto = 'Asignatura facil'
        )
        
    def test_ver_comentarios_asignatura_serializer_varios_comentarios(self):
        
        comentarios = [self.comentario1, self.comentario2]
        serializer = VerComentariosAsignaturaSerializer(comentarios, many=True)
        datos = serializer.data
        
        self.assertEqual(len(datos),2)
        
        nombres_de_usuario = [nombreDeUsuario['username'] for nombreDeUsuario in datos]
        self.assertEqual(nombres_de_usuario, ['pepito','pepito'])
        
        ids= [iD['id_comentario'] for iD in datos]
        self.assertIn(self.comentario1.id_comentario,ids)
        self.assertIn(self.comentario2.id_comentario,ids)

from rest_framework import status, generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import get_object_or_404
from .serializers import *

# View para el registro de usuario
class RegistroAPIView(APIView):
    # Cualquier usuario puede registrarse, sin necesidad de token
    permission_classes = []
    authentication_classes = []
    
    # Sobreescribimos el metodo post para crear un nuevo usuario
    # y generar un token para el mismo
    def post (self, request):
        serializer = RegistroSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Se crea el token del usuario correspondiente y se guarda
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "user": RegistroSerializer(user).data,
                "token": token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
# View para el login de usuario
class LoginAPIView(APIView):
    # Cualquier usuario intentar hacer login, sin necesidad de token
    permission_classes = []
    authentication_classes = []
    
    # Sobreescribimos el metodo post para autenticar al usuario
    def post (self,request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            # Se recupera el token para devolverlo en la respuesta
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token" : token.key,
                "user":{
                    "username": user.username,
                    "email": user.email
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View para el logout de usuario
class LogoutAPIView(APIView):
    # Solo los usuarios autenticados pueden hacer logout
    permission_classes = [IsAuthenticated]
    
    # Sobreescribimos el metodo post para eliminar el token del usuario
    # y cerrar la sesión
    def post (self, request):
        user = request.user
        user.auth_token.delete()
        return Response({"Deslogueado con exito"}, status=status.HTTP_200_OK)

# View para ver y editar el perfil del usuario
class VerPerfilAPIView(APIView):
    # Solo los usuarios autenticados pueden ver su perfil
    permission_classes = [IsAuthenticated]
    # Sobreescribimos el metodo get para mostrar los datos del usuario
    def get (self, request):
        serializer = VerPerfilSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class EditarPerfilAPIView(APIView):
    # Solo los usuarios autenticados pueden editar su perfil
    permission_classes = [IsAuthenticated]
    
    # Sobreescribimos el metodo patch para editar los datos del usuario
    def patch (self, request):
        # Si el usuario no ha introducido ningun campo, se devuelve un error
        if not request.data:
            return Response(
                {"Debes introducir al menos un campo para actualizar."}, 
                status=status.HTTP_400_BAD_REQUEST)
        
        # Parametros:
        # request.user - El usuario que ha iniciado sesión
        # request.data - Los datos que se van a modificar
        # partial=True - Se permite modificar solo algunos campos (o todos)
        serializer = EditarPerfilSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"Perfil editado con exito"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View para ver los grados. Se usa una vista generica de tipo ListAPIView
class VerGradosListAPIView(generics.ListAPIView):
    # Se permite el acceso a cualquier usuario, sin necesidad de token
    permission_classes = []
    authentication_classes = []
    
    # Se recuperan todos los grados por orden alfabético
    queryset = Grado.objects.all().order_by('nombre')
    # Se utiliza el serializer para mostrar los datos
    serializer_class = VerGradosSerializer

# View para ver los grados de un usuario. Se usa una vista generica de tipo ListAPIView
class BuscarAsignaturasListAPIView(generics.ListAPIView):
    # Se permite el acceso a cualquier usuario, sin necesidad de token
    permission_classes = []
    authentication_classes = []
    
    # Se prepara el queryset para buscar asignaturas por nombre
    queryset = Asignatura.objects.all().order_by('nombre')
    # Se utiliza el serializer para mostrar los datos
    serializer_class = BuscarAsignaturasSerializer
    # Se crea el filtro para buscar por el criterio que ha introducido el usuario
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre']

# View para ver los detalles de un grado. Se usa una vista generica de tipo RetrieveAPIView
class DestallesGradoRetrieveAPIView(generics.RetrieveAPIView):
    # Se permite el acceso a cualquier usuario, sin necesidad de token
    permission_classes = []
    authentication_classes = []
    
    # Se prepara el queryset para buscar un grado por nombre
    queryset = Grado.objects.all().order_by('nombre')
    # Se utiliza el serializer para mostrar los datos
    serializer_class = DestallesGradoSerializer
    # Se establece el campo por el que se va a buscar el grado en la base de datos
    lookup_field = 'id_grado'

# View para ver los detalles de una asignatura. Se usa una vista generica de tipo RetrieveAPIView
class DestallesAsignaturaRetrieveAPIView(generics.RetrieveAPIView):
    # Se permite el acceso a cualquier usuario, sin necesidad de token
    permission_classes = []
    authentication_classes = []
    
    # Se prepara el queryset para buscar asignaturas por nombre
    queryset = Asignatura.objects.all().order_by('nombre')
    # Se utiliza el serializer para mostrar los datos
    serializer_class = DestallesAsignaturaSerializer
    # Se establece el campo por el que se va a buscar el grado en la base de datos
    lookup_field = 'id_asignatura'

# View para ver las estadisticas de una asignatura. Se usa una vista generica de tipo CreateAPIView
class CrearComentarioCreateAPIView(generics.CreateAPIView):
    # Solo los usuarios autenticados pueden crear comentarios
    permission_classes = [IsAuthenticated]
    serializer_class = ComentarioSerializer
    
    # Sobreescribimos el metodo perform_create para especificar el id de
    # la asignatura en la cual se hace el comentario, y el usuario que lo hace
    def perform_create(self, serializer):
        # Obtenemos el id de la asignatura de los parametros de la URL y
        # buscamos la asignatura correspondiente en la base de datos. Si no
        # se encuentra, se devuelve un error 404
        asignatura = get_object_or_404(Asignatura, id_asignatura=self.kwargs['id_asignatura'])
        serializer.save(id_usuario=self.request.user, id_asignatura=asignatura)

# View para ver los comentarios de una asignatura. Se usa una vista generica de tipo UpdateAPIView
class EditarComentarioUpdateAPIView(generics.UpdateAPIView):
    # Solo los usuarios autenticados pueden editar comentarios
    permission_classes = [IsAuthenticated]
    serializer_class = ComentarioSerializer
    lookup_field = 'id_comentario'
    
    # Sobreescribimos el metodo get_queryset para que solo el usuario que ha
    # creado el comentario pueda editarlo
    def get_queryset(self):
        return Comentario.objects.filter(id_usuario=self.request.user)

# View para eliminar un comentario de una asignatura. Se usa una vista generica de tipo DestroyAPIView
class EliminarComentarioDestroyAPIView(generics.DestroyAPIView):
    # Solo los usuarios autenticados pueden eliminar comentarios
    permission_classes = [IsAuthenticated]
    serializer_class = ComentarioSerializer
    lookup_field = 'id_comentario'
    
    # Sobreescribimos el metodo get_queryset para que solo el usuario que ha
    # creado el comentario pueda eliminarlo
    def get_queryset(self):
        return Comentario.objects.filter(id_usuario=self.request.user)
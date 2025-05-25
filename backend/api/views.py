from rest_framework import status, generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import get_object_or_404
from .serializers import *

class RegistroAPIView(APIView):
    # Cualquier usuario puede registrarse, sin necesidad de token
    permission_classes = []
    authentication_classes = []
    
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
        
class LoginAPIView(APIView):
    # Cualquier usuario intentar hacer login, sin necesidad de token
    permission_classes = []
    authentication_classes = []
    
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
    
class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    # Eliminamos el token del usuario de la base de datos
    def post (self, request):
        user = request.user
        user.auth_token.delete()
        return Response({"Deslogueado con exito"}, status=status.HTTP_200_OK)

class VerPerfilAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get (self, request):
        serializer = VerPerfilSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class EditarPerfilAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
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
    
class VerGradosListAPIView(generics.ListAPIView):
    # Se permite el acceso a cualquier usuario, sin necesidad de token
    permission_classes = []
    authentication_classes = []
    
    # Se recuperan todos los grados por orden alfabético
    queryset = Grado.objects.all().order_by('nombre')
    # Se utiliza el serializer para mostrar los datos
    serializer_class = VerGradosSerializer
    
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
    
class CrearComentarioCreateAPIView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ComentarioSerializer
    
    # Sobreescribimos el metodo perform_create para especificar el id de
    # la asignatura en la cual se hace el comentario, y el usuario que lo hace
    def perform_create(self, serializer):
        asignatura = get_object_or_404(Asignatura, id_asignatura=self.kwargs['id_asignatura'])
        serializer.save(id_usuario=self.request.user, id_asignatura=asignatura)
    
class EditarComentarioUpdateAPIView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ComentarioSerializer
    lookup_field = 'id_comentario'
    
    # Sobreescribimos el metodo get_queryset para que solo el usuario que ha
    # creado el comentario pueda editarlo
    def get_queryset(self):
        return Comentario.objects.filter(id_usuario=self.request.user)
    
class EliminarComentarioDestroyAPIView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ComentarioSerializer
    lookup_field = 'id_comentario'
    
    # Sobreescribimos el metodo get_queryset para que solo el usuario que ha
    # creado el comentario pueda eliminarlo
    def get_queryset(self):
        return Comentario.objects.filter(id_usuario=self.request.user)
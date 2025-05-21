from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializer import RegistroSerializer

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
        
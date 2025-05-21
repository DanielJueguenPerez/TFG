from rest_framework import serializers
from django.contrib.auth import get_user_model

# Usamos el modelo de usuario especificado en settings.py
User = get_user_model()

class RegistroSerializer(serializers.ModelSerializer):
    # Variables para realizar la confirmación de la contraseña
    password = serializers.CharField (write_only=True, min_length=8)
    password2 = serializers.CharField (write_only=True, label="Confirma tu contraseña")
    
    # Campos que se van a recibir del frontend
    class Meta:
        model = User
        fields = ['username','nombre','apellidos','email','DNI','password','password2']
        
    # Validación de las contraseñas    
    def validate(self,data):
        if data['password'] != data.pop['password2']:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return data
        
    # Creación del usuario    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            nombre=validated_data['nombre'],
            apellidos=validated_data['apellidos'],
            email=validated_data['email'],
            DNI=validated_data['DNI'],
        )
        return user
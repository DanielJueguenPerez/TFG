from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from .models import *

# Usamos el modelo de usuario especificado en settings.py
User = get_user_model()

class RegistroSerializer(serializers.ModelSerializer):
    # Variables para realizar la confirmación de la contraseña
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label="Confirma tu contraseña")
    
    # Campos que se van a recibir del frontend
    class Meta:
        model = User
        fields = ['username','nombre','apellidos','email','DNI','password','password2']
        
    # Validación de las contraseñas    
    def validate(self,data):
        if data['password'] != data.pop('password2'):
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

class LoginSerializer(serializers.Serializer):
    # Variables para realizar el login
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    #Validacion de los datos
    def validate(self, data):
        # Se comprueba si el usuario y contraseña son correctos
        user = authenticate(username=data['username'], password=data['password'])
        # Si no lo son, se lanza una excepción
        if user is None:
            raise serializers.ValidationError("Usuario o contraseña incorrectos")
        # Si son correctos se devuelve el usuario
        data['user'] = user
        return data
    
class VerPerfilSerializer(serializers.ModelSerializer):
    # Campos a mostrar
    class Meta:
        model = User
        fields = ['username','nombre','apellidos','email','DNI']
        
class EditarPerfilSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ('username','nombre','apellidos','email','DNI','password')
        
    # Metodo para validar que, por cualquier circunstancia, no lleguen campos
    # desconocidos al serializer    
    def to_internal_value(self,data):
        # Comparamos los datos recibidos con los campos del serializer
        campos_desconocidos = set(data.keys()) - set(self.fields.keys())
        # Si hay campos desconocidos, se lanza un error indicando cual
        if campos_desconocidos:
            raise serializers.ValidationError(
                {campo: f"El campo '{campo}' no es válido." for campo in campos_desconocidos}
            )
        # Se llama al validador original para que valide los campos
        return super().to_internal_value(data)
    
    # Parametros: 
    # Instance - referencia al objeto del model que se va a actualizar
    # validated_data - datos validados que se van a actualizar 
    def update(self, instance, validated_data):
        # Quitamos el password para actualizarlo con set_password, que
        # hashea el password automaticamente
        password = validated_data.pop('password', None)
        
        # Con un bucle for recorremos los datos validados y los asignamos
        # para actualizarlos
        for variable, valor in validated_data.items():
            setattr(instance, variable, valor)
            
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance
    
class VerGradosSerializer(serializers.ModelSerializer):
    # Campos a mostrar
    class Meta:
        model = Grado
        fields = ['id_grado','nombre','url']
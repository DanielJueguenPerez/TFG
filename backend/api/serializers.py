import math
from django.db.models import Avg
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from .models import Grado, Asignatura, EstadisticasAsignatura, Comentario, Favorito

# Usamos el modelo de usuario especificado en settings.py
User = get_user_model()

# Serializer para la funcionalidad de registro
class RegistroSerializer(serializers.ModelSerializer):
    # Variables para realizar la confirmación de la contraseña
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label="Confirma tu contraseña")
    
    username = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Este nombre de usuario ya está en uso."
            )
        ]
    )
    DNI = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Este DNI ya está registrado."
            )
        ]
    )
    email = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Este email ya está en uso."
            )
        ]
    )
    
    # Campos que se van a recibir del frontend
    class Meta:
        model = User
        fields = ['username','nombre','apellidos','email','DNI','password','password2']
        
    # Sobreescribimos el metodo validate para comprobar que las contraseñas coinciden 
    def validate(self,data):
        # Comprobamos que los passwords coinciden y quitamos el campo password2
        # de los datos validados. Si no coinciden, se lanza una excepción
        if data['password'] != data.pop('password2'):
            raise serializers.ValidationError({
                'error': 'Las contraseñas no coinciden.'
            })
        return data
        
    # Método para validar el formato del DNI, se deja comentado por comodidad
    #def validate_DNI(self, value):
    #    dni_formato = r'^\d{8}[A-Z]$'
    #    if not re.match(dni_formato, value):
    #        raise serializers.ValidationError("Formato del DNI incorrecto (8 números y una letra mayuscula).")
    #    
    #    letras = "TRWAGMYFPDXBNJZSQVHLCKE"
    #    numero = int(value[:8])
    #    letra_correcta = letras[numero%23]
    #    
    #    if value [-1] != letra_correcta:
    #        raise serializers.ValidationError("Letra del DNI incorrecta.")
    #    return value

        
    # Sobreescribimos el metodo create para crear un nuevo usuario   
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

# Serializer para la funcionalidad de login
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
            raise serializers.ValidationError({
                'error': 'Usuario o contraseña incorrectos.'
            })
        # Si son correctos se devuelve el usuario
        data['user'] = user
        return data
    
# Serializer para la funcionalidad de ver el perfil
class VerPerfilSerializer(serializers.ModelSerializer):
    # Campos a mostrar
    class Meta:
        model = User
        fields = ['username','nombre','apellidos','email','DNI']

# Serializer para la funcionalidad de editar el perfil
class EditarPerfilSerializer(serializers.ModelSerializer):    
    username = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Este nombre de usuario ya está en uso."
            )
        ]
    )
    DNI = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Este DNI ya está registrado."
            )
        ]
    )
    email = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Este email ya está en uso."
            )
        ]
    )
    class Meta:
        model = User
        fields = ('username','nombre','apellidos','email','DNI')
        
    # Sobreescribimos el metodo to_internal_value para validar que, por cualquier
    # circunstancia, no lleguen camposdesconocidos al serializer    
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
        
    # Método para validar el formato del DNI, se deja comentado por comodidad
    #def validate_DNI(self, value):
    #   dni_formato = r'^\d{8}[A-Z]$'
    #    if not re.match(dni_formato, value):
    #        raise serializers.ValidationError("Formato del DNI incorrecto (8 números y una letra mayuscula).")
    #    
    #    letras = "TRWAGMYFPDXBNJZSQVHLCKE"
    #    numero = int(value[:8])
    #    letra_correcta = letras[numero%23]
    #    
    #    if value [-1] != letra_correcta:
    #        raise serializers.ValidationError("Letra del DNI incorrecta.")
    #    return value
    
    # Sobreescribimos el metodo update para actualizar los datos del usuario
    # Parametros: 
    # Instance - referencia al objeto del model que se va a actualizar
    # validated_data - datos validados que se van a actualizar 
    def update(self, instance, validated_data):
        # Con un bucle for recorremos los datos validados y los asignamos
        # para actualizarlos
        for variable, valor in validated_data.items():
            setattr(instance, variable, valor)
            
        instance.save()
        return instance
    
class CambiarPasswordSerializer(serializers.Serializer):
    # Variables para realizar la confirmación de la contraseña
    password_actual = serializers.CharField(required=True)
    password_nuevo = serializers.CharField(write_only=True, min_length=8)
    password_nuevo_2 = serializers.CharField(write_only=True, label="Confirma tu contraseña")    
    
    # Sobreescribimos el metodo validate para comprobar que las contraseñas coinciden , y que
    # la contraseña antigua es la correcta
    def validate(self,data):
        user = self.context['request'].user
        # Comprobamos que los passwords nuevos coinciden
        if data['password_nuevo'] != data['password_nuevo_2']:
            raise serializers.ValidationError({
                'error': 'Las contraseñas no coinciden.'
            })
        
        if not user.check_password(data['password_actual']):
            raise serializers.ValidationError({
                'error': 'Contraseña actual incorrecta.'
            })
        
        return data
    
    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['password_nuevo'])
        user.save()
        
        return user
        

# Serializer para la funcionalidad de ver grados
class VerGradosSerializer(serializers.ModelSerializer):
    # Campos a mostrar
    class Meta:
        model = Grado
        fields = ['id_grado','nombre','url']

# Serializer para la funcionalidad de busqueda de asignaturas
class BuscarAsignaturasSerializer(serializers.ModelSerializer):
    nombre_grado = serializers.CharField(source='id_grado.nombre', read_only=True)
    # Campos a mostrar
    class Meta:
        model = Asignatura
        fields = ['id_asignatura','nombre','curso','id_grado', 'nombre_grado']

# Serializer usado para la funcionalidad de ver detalles de un grado
class AsignaturasGradoSerializer(serializers.ModelSerializer):
    # Campos a mostrar
    class Meta:
        model = Asignatura
        fields = ['id_asignatura','nombre']

# Serializer para la funcionalidad de ver detalles de un grado
class DetallesGradoSerializer(serializers.ModelSerializer):
    # Variable definida para mostrar las asignaturas de cada curso. Al 
    # invocar a get_asignaturas_cursos, se asigna automaticamente el valor
    # de la funcion a la variable, debido a que es un SerializerMethodField
    asignaturas_cursos = serializers.SerializerMethodField()
    
    class Meta:
        model = Grado
        fields = ['id_grado','nombre','url','asignaturas_cursos']
        
    def get_asignaturas_cursos(self, grado):
        # Se filtran las asignaturas por el grado que se ha pasado como
        # parametro y se ordenan por curso y nombre
        asignaturas = Asignatura.objects.filter(id_grado=grado).order_by('curso','nombre')
        
        # Se crea un diccionario para almacenar las asignaturas por curso
        ordenadas = {}
        
        # Por cada asignatura en asignaturas, se mira el curso. Si no existe se añade en ordenadas
        # y se devuelve una lista vacia a la cual se hace append de los datos de la asignatura.
        # De esta forma se van añadiendo las asignaturas a la lista de su curso correspondiente
        for asignatura in asignaturas:
            ordenadas.setdefault(asignatura.curso, []).append(AsignaturasGradoSerializer(asignatura).data)
        
        # Se recorre ordenadas y se crea un diccionario que contiene el curso y la
        # lista de asignaturas asociada a ese curso
        return[
            {'curso': curso, 'asignaturas': asignaturas}
            for curso, asignaturas in ordenadas.items()
        ]
        
        
# Serializer usado para ver los detalles de una asignatura
class EstadisticasAsignaturaSerializer(serializers.ModelSerializer):
    # Campos a mostrar
    class Meta:
        model = EstadisticasAsignatura
        fields = ['id_estadisticasAsignatura','num_matriculados','aprobados','suspensos','no_presentados']

# Serializer para ver los detalles de una asignatura
class DetallesAsignaturaSerializer(serializers.ModelSerializer):
    # Variable definida para mostrar las estadisticas de cada año academico para
    # cada asignatura. Al invocar a get_estadisticas_anios, se asigna automaticamente el valor
    # de la funcion a la variable, debido a que es un SerializerMethodField
    estadisticas_anios = serializers.SerializerMethodField()
    media_estadisticas = serializers.SerializerMethodField()
    nombre_grado = serializers.CharField(source='id_grado.nombre', read_only=True)
    
    class Meta:
        model = Asignatura
        fields = ['id_asignatura','nombre','curso','id_grado','nombre_grado','estadisticas_anios', 'media_estadisticas']
        
    def get_estadisticas_anios(self, asignatura):
        # Se filtran las estadisticas por la asignatura que se ha pasado como
        # parametro y se ordenan por año academico, excluyendo aquellas que no
        # tengan matriculados
        filtrado = EstadisticasAsignatura.objects.filter(id_asignatura=asignatura,
                    num_matriculados__gt=0).order_by('anioAcademico')

        # Se crea un diccionario para almacenar las estadisticas por año academico
        estadisticas_por_anio = {}
        
        # Por cada estadistica en estadisticas, se mira el año academico. Si no existe se añade en
        # estadisticas_por_anio y se devuelve una lista vacia a la cual se hace append de las estadisticas
        # de ese año. De esta forma se van añadiendo las estadisticas a la lista de su 
        # año academico correspondiente
        for estadistica in filtrado:
            estadisticas_por_anio.setdefault(estadistica.anioAcademico, []).append(
                EstadisticasAsignaturaSerializer(estadistica).data)
        
        # Se recorre estadisticas_por_anio y se crea un diccionario que contiene el 
        # año academico y la lista de estadisticas asociada a ese año academico
        lista_completa = [           
            {'Año Academico': anioAcademico, 'estadisticas': estadisticas}
            for anioAcademico, estadisticas in estadisticas_por_anio.items()
        ]
        
        return lista_completa[-3:]
    
    # Calculamos las medias de las estadisticas y las devolvemos en el JSON para ser tratadas
    # en el frontend
    def get_media_estadisticas(self, asignatura):
        medias = EstadisticasAsignatura.objects.filter(id_asignatura=asignatura).aggregate(
            num_matriculados=Avg('num_matriculados'),
            aprobados=Avg('aprobados'),
            suspensos=Avg('suspensos'),
            no_presentados=Avg('no_presentados'),
        )

        return{
            'num_matriculados': math.ceil(medias['num_matriculados']) if medias['num_matriculados'] is not None else None,
            'aprobados': math.ceil(medias['aprobados']) if medias['aprobados'] is not None else None,
            'suspensos': math.ceil(medias['suspensos']) if medias['suspensos'] is not None else None,
            'no_presentados': math.ceil(medias['no_presentados']) if medias['no_presentados'] is not None else None,
        }
        
# Serializer para la funcionalidad de crear, editar y eliminar
class ComentarioSerializer(serializers.ModelSerializer):
    # Campos necesarios
    class Meta:
        model = Comentario
        fields = ['id_comentario', 'texto', 'fecha']
        
# Serializer para la funcionalidad de ver comentarios propios
class VerComentariosPropiosSerializer(serializers.ModelSerializer):
    id_asignatura = serializers.IntegerField(source='id_asignatura.id_asignatura', read_only=True)
    nombre_asignatura = serializers.CharField(source='id_asignatura.nombre', read_only=True)
    id_grado = serializers.IntegerField(source='id_asignatura.id_grado.id_grado', read_only=True)
    nombre_grado = serializers.CharField(source='id_asignatura.id_grado.nombre', read_only=True)
    
    class Meta:
        model = Comentario
        fields = ['id_comentario', 'id_asignatura', 'nombre_asignatura', 'id_grado', 'nombre_grado', 'texto', 'fecha']
        
# Serializer para la funcionalidad de ver los comentarios de una asignatura
class VerComentariosAsignaturaSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='id_usuario.username', read_only=True)
    
    class Meta:
        model = Comentario
        fields = ['id_comentario', 'id_usuario', 'username', 'texto', 'fecha']
        
# Serializer para la funcionalidad de agregar, borrar y ver favoritos
class FavoritoSerializer(serializers.ModelSerializer):
    nombre_asignatura = serializers.CharField(source='id_asignatura.nombre', read_only=True)
    id_asignatura = serializers.IntegerField(source='id_asignatura.id_asignatura', read_only=True)
    username = serializers.CharField(source='id_usuario.username', read_only=True)
    id_usuario = serializers.IntegerField(source='id_usuario.id_usuario', read_only=True)
    #Campos necesarios
    class Meta:
        model = Favorito
        fields = ['id_favorito','id_asignatura', 'nombre_asignatura','id_usuario' ,'username']
from django.db import models

# Create your models here.
class Grado(models.Model):
    id_grado = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    url = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Asignatura(models.Model):
    id_asignatura = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    curso = models.PositiveSmallIntegerField()
    id_grado = models.ForeignKey(Grado, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre

class EstadisticasAsignatura(models.Model):
    id_estadisticasAsignatura = models.AutoField(primary_key=True)
    id_asignatura = models.ForeignKey(Asignatura, on_delete=models.CASCADE)
    anioAcademico = models.PositiveIntegerField()
    num_matriculados = models.PositiveIntegerField()
    aprobados = models.PositiveIntegerField()
    suspensos = models.PositiveIntegerField()
    no_presentados = models.PositiveIntegerField()
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['id_asignatura', 'anioAcademico'], name='PK_estadistica')
        ]
        verbose_name_plural = 'Estadísticas de asignaturas'

    def __str__(self):
        return f"{self.id_asignatura.nombre} ({self.anioAcademico})"

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    DNI = models.CharField(max_length=9, unique=True)
    nombre_usuario = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.nombre} {self.apellidos}"
    
class Comentario(models.Model):
    id_comentario = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    id_asignatura = models.ForeignKey(Asignatura, on_delete=models.CASCADE)
    texto = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comentario de {self.id_usuario.nombre_usuario} en {self.id_asignatura.nombre}"

class Favorito(models.Model):
    id_favorito = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    id_asignatura = models.ForeignKey(Asignatura, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['id_asignatura', 'id_usuario'], name='PK_favorito')
        ]

    def __str__(self):
        return f"Favorito de {self.id_usuario.nombre_usuario} en {self.id_asignatura.nombre}"

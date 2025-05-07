from django.contrib import admin
from .models import Grado, Asignatura, EstadisticasAsignatura, Usuario, Comentario, Favorito
# Register your models here.
admin.site.register(Grado)
admin.site.register(Asignatura)
admin.site.register(EstadisticasAsignatura)
admin.site.register(Usuario)
admin.site.register(Comentario)
admin.site.register(Favorito)
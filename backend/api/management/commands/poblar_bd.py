from django.core.management.base import BaseCommand
import json
from pathlib import Path
from api.models import Grado, EstadisticasAsignatura, Asignatura

class Command(BaseCommand):    
    def handle(self, *args, **kwargs):
        
        # Ruta del JSON con los datos scrapeados
        json_file_path = Path(__file__).resolve().parents[3] / "scraping" / "resultados_grados.json"
        self.stdout.write(f"Usando archivo: {json_file_path}")

        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            grados_data = json.load(json_file)
            
        # Estructura de bucles para recorrer el JSON y poblar la base de datos
        for grado in grados_data:
            # Crear o actualizar el grado
            grado_obj, _ = Grado.objects.get_or_create(
                nombre=grado['nombre_grado'],
                url=grado['url'],
            )
            # Se recorre cada resultado del grado
            for resultado in grado['resultados']:
                # Extraer el año académico del resultado (se coge el segundo
                # elemento de la cadena 'año', el cual corresponde al año en el
                # que finaliza el curso académico
                anio = int(resultado['año'].split('/')[1])
                # Se recorre cada curso del resultado
                for curso in resultado['cursos']:
                    # Se guarda el nombre del curso y se extrae el número del curso
                    curso_nombre = curso['curso']
                    curso_num = int(curso['curso'][0])
                    # Se recorre cada asignatura del curso
                    for asignatura in curso['asignaturas']:
                        # Se crea o actualiza la asignatura con el nombre, curso y grado
                        asignatura_obj, _ = Asignatura.objects.get_or_create(
                            nombre=asignatura['asignatura'],
                            curso=curso_num,
                            id_grado=grado_obj,
                        )
                        # Se crea o actualiza las estadísticas de la asignatura
                        # con el año académico y los datos de aprobados, suspensos,
                        # no presentados y matriculados totales
                        EstadisticasAsignatura.objects.update_or_create(
                            id_asignatura=asignatura_obj,
                            anioAcademico=anio,
                            defaults={
                                'aprobados': asignatura['aprobados'],
                                'suspensos': asignatura['suspensos'],
                                'no_presentados': asignatura['no presentados'],
                                'num_matriculados': asignatura['matriculados totales'],
                            }
                        )
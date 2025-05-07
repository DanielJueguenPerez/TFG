import json
from pathlib import Path
from api.models import Grado, EstadisticasAsignatura, Asignatura

# Ruta del JSON con los datos scrapeados
json_file_path = Path("../scraping/resultados_grados.json")

with open(json_file_path, 'r', encoding='utf-8') as json_file:
    grados_data = json.load(json_file)
    
for grado in grados_data:
    # Crear o actualizar el grado
    grado_obj, _ = Grado.objects.get_or_create(
        nombre=grado['nombre_grado'],
        url=grado['url'],
    )
    
    for resultado in grado['resultados']:
        anio = int(resultado['año'].split('/')[1])
        
        for curso in resultado['cursos']:
            curso_nombre = curso['curso']
            curso_num = int(curso['curso'][0])
            
            for asignatura in curso['asignaturas']:
                asignatura_obj, _ = Asignatura.objects.get_or_create(
                    nombre=asignatura['asignatura'],
                    curso=curso_num,
                    id_grado=grado_obj,
                )
                
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
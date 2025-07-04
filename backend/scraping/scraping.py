import requests
from bs4 import BeautifulSoup
import json
import re
import os

# Establecemos la url de la página web
url = "https://estudos.udc.es/es/StudyAtUdc"

# Establecemos el user-agent para evitar el bloqueo por parte del servidor
headers = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"}

# Hacemos la petición a la página web
res = requests.get(url, headers=headers)
res.raise_for_status()  

# Creamos la soup para comenzar el scraping
soup = BeautifulSoup(res.text, "html.parser")

# Lista donde se almacenarán los enlaces de los grados
grados_list = []

# Iterar sobre cada tarjeta de grado
for card in soup.find_all('div', class_='card card-study'):
    title = card.find('h2')
    # Filtrar solo los grados, excluyendo másteres y otros programas
    if title and 'Grado' in title.text:
        results = card.find('a', string='Resultados')
        # De cada grado, extraemos el enlace de los resultados
        if results and results['href']:
            link_results = results['href']
            # Verificar si el título contiene "Ferrol"
            small_tag = title.find('small')
            # Campo para controlar si el grado se imparte en Ferrol, se le asigna
            # True si el texto "Ferrol" está presente en el pequeño tag
            ferrol = small_tag and "Ferrol" in small_tag.text  
            # Guardar el enlace y la info de Ferrol en grados_list
            grados_list.append({
                'link_results': link_results,
                # Campo para controlar si el grado se imparte en Ferrol
                'ferrol': ferrol 
            })
            
# Cargamos los datos del archivo JSON si ya existe
archivo_previo = 'resultados_grados.json'
if os.path.exists(archivo_previo):
    with open(archivo_previo, 'r', encoding='utf-8') as prev:
        datos_previos = json.load(prev)
else:
    datos_previos = []

# Diccionario donde se guardan los grados existentes para acceder rapidamente a su nombre
grados_existentes = {grado["nombre_grado"]: grado for grado in datos_previos}

# Iterar sobre cada enlace de los grados
for grado in grados_list:
    link = grado["link_results"]

    # Hacer una petición a la página de resultados de cada grado
    try:
        res = requests.get(link, headers=headers)
        # Lanza una excepción si hay un error en la petición
        res.raise_for_status()
        # Crear una soup para el scraping de la página de resultados
        soup = BeautifulSoup(res.text, "html.parser")

        # Extraer el nombre del grado desde <h1>
        degree_title = soup.find('h1')
        # Si no se encuentra el título, asignar un valor por defecto
        degree_name = degree_title.text.strip() if degree_title else "Desconocido"
        
        # Se comprueba si el valor del diccionario correspondiente a "ferrol" es True
        # y se añade "(Ferrol)" al nombre del grado si es el caso
        if grado["ferrol"]:
            degree_name += " (Ferrol)"
            
        print(f"Scraping: {degree_name}")

        # Diccionario para almacenar los datos de cada grado
        degree_info = {
            "nombre_grado": degree_name,
            "url": link,
            "resultados": []
        }

        # Buscar todas las pestañas de años disponibles
        for tab in soup.select('ul.nav-tabs li a'):
            year = tab.text.strip()

            # Filtrar solo los años con el formato correcto (ejemplo: 2023/2024)
            # para evitar que se pasen años inválidos o formatos incorrectos
            if not re.match(r'^\d{4}/\d{4}$', year):
                continue

            # Extraer el id del tab
            tab_id = tab.get('href').replace('#', '')

            # Buscar el div correspondiente a ese año
            div_year = soup.find('div', id=tab_id)
            if not div_year:
                continue

            # Diccionario para almacenar los datos del año
            year_data = {
                "año": year,
                "cursos": []
            }

            # Buscar todos los cursos dentro del año
            for course in div_year.find_all('div', class_='span5'):
                # Extraer el nombre del curso desde <h3>
                course_name = course.find('h3')
                # Si no se encuentra el nombre del curso, asignar un valor por defecto
                course_name = course_name.text.strip() if course_name else "Curso Desconocido"

                # Filtrar solo los cursos que realmente son niveles académicos (ejemplo: "1º Curso", "2º Curso")
                # para evitar incluir otros elementos que no sean cursos
                if not re.match(r'^\d+º Curso$', course_name):
                    continue

                # Diccionario para almacenar los datos del curso
                course_data = {
                    "curso": course_name,
                    "asignaturas": []
                }

                # Buscar asignaturas dentro del curso
                for subject in course.find_all('dt'):
                    subject_name = subject.text.strip()

                    # Buscar el bloque de resultados correspondiente
                    results_dd = subject.find_next_sibling('dd')
                    if not results_dd:
                        continue

                    # Extraer valores de los elementos HTML y convertirlos a enteros
                    aprobados = results_dd.find('div', class_='bar-success')
                    suspensos = results_dd.find('div', class_='bar-warning')
                    no_presentados = results_dd.find('div', class_='bar-info')

                    # Si el elemento existe, extraer el texto y convertir a entero; si no, asignar 0
                    aprobados = int(aprobados.text.strip()) if aprobados and aprobados.text.strip().isdigit() else 0
                    suspensos = int(suspensos.text.strip()) if suspensos and suspensos.text.strip().isdigit() else 0
                    no_presentados = int(no_presentados.text.strip()) if no_presentados and no_presentados.text.strip().isdigit() else 0

                    # Calcular el total de matriculados
                    matriculados_totales = aprobados + suspensos + no_presentados

                    # Crear diccionario con la información de la asignatura
                    subject_data = {
                        "asignatura": subject_name,
                        "aprobados": aprobados,
                        "suspensos": suspensos,
                        "no presentados": no_presentados,
                        "matriculados totales": matriculados_totales
                    }

                    # Se hace append de la asignatura al curso
                    course_data["asignaturas"].append(subject_data)
            
                year_data["cursos"].append(course_data)
                
            # Se hace append del año al diccionario de resultados del grado
            # Solo guardar años que tengan al menos un curso válido
            if year_data["cursos"]:
                degree_info["resultados"].append(year_data)

        if degree_info["resultados"]:
            nombre = degree_info["nombre_grado"]
            # Se verifica si el grado ya estaba en los grados existentes
            if nombre in grados_existentes:
                # Se guarda el grado existente para modificarlo con cursos nuevos
                grado_existente = grados_existentes[nombre]
                #Se guardan los años existentes en el grado
                años_existentes = {a["año"] for a in grado_existente["resultados"]}
                # Se recorren los años screapeados y se comprueba si hay alguno nuevo
                for año_nuevo in degree_info["resultados"]:
                    if año_nuevo["año"] not in años_existentes:
                        # Si el año que se esta comprobando no estaba, se añade
                        grado_existente["resultados"].append(año_nuevo)
            else:
                # Si el grado no existia en la base de datos, se añade entero
                grados_existentes[nombre] = degree_info

    # Si ocurre un error al acceder a la página, se captura la excepción
    except requests.exceptions.RequestException as e:
        print(f"Error al acceder a {link}: {e}")

# Se guardan los resultados en un Json
with open('resultados_grados.json', 'w', encoding='utf-8') as json_file:
    json.dump(list(grados_existentes.values()), json_file, ensure_ascii=False, indent=4)
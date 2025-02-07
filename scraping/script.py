import requests
from bs4 import BeautifulSoup
import json
import re

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
    # Filtrar solo los grados
    if title and 'Grado' in title.text:
        results = card.find('a', string='Resultados')
        # De cada grado, extraemos el enlace de los resultados
        if results and results['href']:
            link_results = results['href']
            # Verificar si el título contiene "Ferrol"
            small_tag = title.find('small')
            # Campo para controlar si el grado se imparte en Ferrol
            ferrol = small_tag and "Ferrol" in small_tag.text  
            # Guardar el enlace y la info de Ferrol en grados_list
            grados_list.append({
                'link_results': link_results,
                'ferrol': ferrol 
            })

# Lista donde se almacenarán los datos extraídos
final_results = []

# Iterar sobre cada enlace de los grados
for grado in grados_list:
    link = grado["link_results"]
    print(f"Scraping: {link}")

    # Hacer una petición a la página de resultados de cada grado
    try:
        res = requests.get(link, headers=headers)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")

        # Extraer el nombre del grado desde <h1>
        degree_title = soup.find('h1')
        degree_name = degree_title.text.strip() if degree_title else "Desconocido"
        
        # Se añade Ferrol al titulo del grado si este se imparte en Ferrol
        if grado["ferrol"]:
            degree_name += " (Ferrol)"

        # Diccionario para almacenar los datos de cada grado
        degree_info = {
            "nombre_grado": degree_name,
            "url": link,
            "results": []
        }

        # Buscar todas las pestañas de años disponibles
        for tab in soup.select('ul.nav-tabs li a'):
            year = tab.text.strip()

            # Filtrar solo los años con el formato correcto (ejemplo: 2023/2024)
            if not re.match(r'^\d{4}/\d{4}$', year):
                continue

            tab_id = tab.get('href').replace('#', '')

            # Buscar el div correspondiente a ese año
            div_year = soup.find('div', id=tab_id)
            if not div_year:
                continue

            year_data = {
                "año": year,
                "cursos": []
            }

            # Buscar todos los cursos dentro del año
            for course in div_year.find_all('div', class_='span5'):
                degree_name = course.find('h3')
                degree_name = degree_name.text.strip() if degree_name else "Curso Desconocido"

                # Filtrar solo los cursos que realmente son niveles académicos (ejemplo: "1º Curso", "2º Curso")
                if not re.match(r'^\d+º Curso$', degree_name):
                    continue

                course_data = {
                    "nombre_curso": degree_name,
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
                        "nombre_asignatura": subject_name,
                        "aprobados": aprobados,
                        "suspensos": suspensos,
                        "no presentados": no_presentados,
                        "matriculados totales": matriculados_totales
                    }

                    course_data["asignaturas"].append(subject_data)

                year_data["cursos"].append(course_data)

            # Solo guardar años que tengan al menos un curso válido
            if year_data["cursos"]:
                degree_info["results"].append(year_data)

        # Solo guardar grados que tengan resultados válidos
        if degree_info["results"]:
            final_results.append(degree_info)

    except requests.exceptions.RequestException as e:
        print(f"Error al acceder a {link}: {e}")

# Se guardan los resultados en un Json
with open('resultados_grados.json', 'w', encoding='utf-8') as json_file:
    json.dump(final_results, json_file, ensure_ascii=False, indent=4)
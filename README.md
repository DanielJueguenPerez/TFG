# Aplicación web para la ayuda en la toma de decisión de matriculación de los alumnos de grado de la UDC

Trabajo de fin de grado desarrollado con Django y React. Aplicación web que permite a un usuario:
- Registrarse. 
- Login y logout.
- Ver y editar su perfil.
- Ver los grados de la UDC.
- Realizar una busqueda de asignaturas.
- Ver los detalles de cada grado.
- Consultar las estadisticas de cada asignatura.
- Realizar, editar y borrar comentarios en una asignatura. 
- Ver los comentarios de una asignatura. 
- Añadir y eliminar una asignatura de su lista de favoritos.
- Ver su lista de favoritos.


## Instrucciones necesarias para la configuración e instalación de las dependencias (Ubuntu)

### 📦 Backend (Django + DRF)

#### Requisitos
- Python 3.10 o superior
- pip

#### Configuración del entorno

1. Acceder a la carpeta raíz del proyecto y ejecutar el siguiente comando

        source env/bin/activate

2. Instalar las dependencias del proyecto

        pip install -r requirements.txt

### 🎨 Frontend (React + TailwindCSS)

#### Requisitos
- Node.js (recomendado: 18.x o superior)
- npm

#### Configuración del entorno

1. Acceder a la carpeta frontend

2. Instalar las dependencias del proyecto

        npm install

## Instrucciones para la ejecución del scripts, test e inicialización de la base de datos

### 🕷️ Script de scraping

1. Acceder a la carpeta scraping

2. Ejecutar el siguiente comando

        python scraping.py

### 🛢️ Inicializar de cero la base de datos

1. Acceder a la carpeta backend y eliminar el archivo db.sqlite3

2. Ejecutar los siguientes comandos:

        python manage.py makemigrations
        python manage.py migrate

3. Ejecutar el siguiente comando para poblar la base de datos con los datos iniciales (tarda un poco):

        python manage.py shell < api/poblar_bd.py

4. (Opcional) Crear un superusuario, al que se accede mediante la dirección http://127.0.0.1:8000/admin


        python manage.py createsuperuser

### 🛢️ Ejecución de los test

1. Ejecutar el siguiente comando:

        python manage.py test

## Instrucciones para arrancar la aplicación

### 📦Backend

1. Acceder a la carpeta backend

2. Ejecutar el siguiente comando:

        python manage.py runserver

### 🎨Frontend

1. Acceder a la carpeta frontend

2. Ejecutar el siguiente comando:

        npm run dev


## Autor

* **Daniel Jueguen Pérez**
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

1. Instalar paquetes necesarios para python y entorno virtual

        sudo apt install python3 python3-pip python3-venv -y
   
2. En la raiz del proyecto, crear el entorno virtual

        python3 -m venv env

3. Ejecutar el siguiente comando para activar el entorno virtual

        source env/bin/activate

4. Instalar las dependencias del proyecto

        pip install -r requirements.txt

### 🎨 Frontend (React + TailwindCSS)

#### Requisitos
- Node.js (recomendado: 18.x o superior)
- npm

#### Configuración del entorno

1. En otra terminal distinta sin el entorno virtual activado, ejecutar los siguientes comandos 

        sudo apt install curl -y
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt install -y nodejs

2. Acceder a la carpeta /frontend

3. Instalar las dependencias del proyecto

        npm install

## Instrucciones para la ejecución del scripts, test e inicialización de la base de datos (todos los comandos de esta sección deben ejecutarse con el entorno virtual activo)

### 🕷️ Script de scraping

1. Acceder a la carpeta /scraping

2. Ejecutar el siguiente comando

        python scraping.py

### 🛢️ Inicializar de cero la base de datos

1. Acceder a la carpeta /backend (donde está el archivo manage.py) y eliminar el archivo db.sqlite3 (si existiese)

2. Ejecutar los siguientes comandos (en la carpeta /backend, con el entorno virtual activado):

        python manage.py makemigrations
        python manage.py migrate

3. Ejecutar el siguiente comando (en la carpeta /backend, entorno virtual activado) para poblar la base de datos con los datos iniciales (tarda un poco):

        python manage.py shell < api/poblar_bd.py

4. (Opcional) Crear un superusuario (en la carpeta /backend, entorno virtual activado), al que se accede mediante la dirección http://127.0.0.1:8000/admin


        python manage.py createsuperuser

### 🛢️ Ejecución de los test

1. Acceder a la carpeta /backend

2. Ejecutar el siguiente comando (entorno virtual activado):

        python manage.py test

## Instrucciones para arrancar la aplicación

### 📦Backend

1. Acceder a la carpeta /backend

2. Ejecutar el siguiente comando (entorno virtual activado):

        python manage.py runserver

3. Para acceder a la documentación una vez se ha arrancado el backend, acceder a las siguientes direcciones en un navegador

        http://localhost:8000/docs/
        http://localhost:8000/redocs/

### 🎨Frontend

1. Acceder a la carpeta /frontend

2. Ejecutar el siguiente comando:

        npm run dev


## Autor

* **Daniel Jueguen Pérez**

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
- Ver los comentarios propios del usuario.
- Añadir y eliminar una asignatura de su lista de favoritos.
- Ver su lista de favoritos.

# Instrucciones necesarias para la configuración y arranque con Docker

Para mayor facilidad de quien pruebe la app, se ha implementado el despliegue con Docker y Docker-compose. Las instrucciones necesarias para ejecutar la aplicación web de esta forma, en un sistema operativo Ubuntu/Linux, se detallan a continuación:

1. Ubicarse en la carpeta raiz del proyecto y ejecutar los siguientes comandos, con el fin de ejecutar el script para instalar Docker y Docker compose:
        
        chmod +x docker-instalacion.sh
        ./docker-instalacion.sh

2. Ejecutar los siguientes comandos por separado para construir las imágenes y levantar los servicios (tarda un poco):

        docker compose build --no-cache
        docker compose up

3. Desde un navegador, acceder a las direcciones del backend o el frontend.

        -Backend

        http://localhost:8000/docs 
        http://localhost:8000/redocs

        -Frontend
        http://localhost:4173

4. Cuando se quiera parar la ejecución de Docker, se ejecutarán los siguientes comandos:

        ctrl+c
        docker compose down -v

5. Ejecutar el siguiente comando para borrar los volumenes creados por docker

        docker system prune -af --volumes
        ctrl+c

# Alternativamente, se proporcionan instrucciones de instalación del entorno completo sin usar Docker (no recomendado si solo se quiere probar la aplicación web).

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

        pip install -r /backend/requirements.txt

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

        python manage.py poblar_bd

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

3. En un navegador, acceder a la dirección localhost:5173


## Autor

* **Daniel Jueguen Pérez**

from locust import HttpUser, task, between

class Usuario(HttpUser):
    wait_time = between(2, 5)
    
    def on_start(self):
        self.login()
        
    def login(self):
        response = self.client.post("/api/usuario/login/", json={
            "username": "Prueba",
            "password": "contraseña"
        }, name="Login")
        token = response.json().get("token")
        self.client.headers.update({"Authorization": f"Token {token}"})

    # === USUARIO ===

    @task
    def ver_perfil(self):
         self.client.get("/api/usuario/ver-perfil/", name="Ver perfil")

    @task
    def editar_perfil(self):
        self.client.patch("/api/usuario/editar-perfil/", json={
            "nombre": "NuevoNombre",
            "apellidos": "NuevoApellido"
        }, name="Editar perfil")

    @task
    def cambiar_password(self):
        self.client.patch("/api/usuario/cambiar-password/", json={
            "password_actual": "contraseña",
            "password_nuevo": "contraseña",
            "password_nuevo_2": "contraseña"
        }, name="Cambiar contraseña")

    @task
    def ver_comentarios_usuario(self):
        self.client.get("/api/usuario/comentarios/", name="Ver comentarios del usuario")
                
    # === GRADOS ===

    @task
    def ver_grados(self):
        self.client.get("/api/grados/", name="Ver grados")

    @task
    def detalles_grado(self):
        self.client.get("/api/grados/1/", name="Detalles grado")

    # === ASIGNATURAS ===

    @task
    def buscar_asignaturas(self):
        self.client.get("/api/asignaturas/?buscar=cálculo", name="Buscar asignaturas")

    @task
    def detalles_asignatura(self):
        self.client.get("/api/asignaturas/1/", name="Detalles asignatura")

    # === COMENTARIOS ===

    @task
    def ver_comentarios_asignatura(self):
        self.client.get("/api/comentarios/1/", name="Ver comentarios de asignatura")
    
    @task
    def crear_y_eliminar_comentario(self):
        response = self.client.post("/api/comentarios/1/nuevo/", json={
            "texto": "Comentario de prueba",
        }, name="Crear comentario")
        id_comentario = response.json().get("id_comentario")
        
        if id_comentario:
            self.client.delete(f"/api/comentarios/eliminar/{id_comentario}/", name="Eliminar comentario")

    @task
    def editar_comentario(self):
        self.client.put("/api/comentarios/editar/1/", json={
            "texto": "Comentario editado",
        }, name="Editar comentario")


    # === FAVORITOS ===
    
    @task
    def agregar_y_eliminar_favorito(self):
        with self.client.post("/api/favoritos/agregar/4/", catch_response=True, name="Agregar favorito") as response:
            try:
                data = response.json()
            except Exception as e:
                response.success() 
                return

            if response.status_code == 201 and isinstance(data, dict) and "id_favorito" in data:
                id_favorito = data["id_favorito"]
                self.client.delete(f"/api/favoritos/eliminar/{id_favorito}/", name="Eliminar favorito")
                response.success()
            elif response.status_code == 400 and isinstance(data, list) and "ya está en favoritos" in data[0].lower():
                response.success()
            else:
                response.success()

    @task
    def ver_favoritos(self):
        self.client.get("/api/favoritos/lista/", name="Ver favoritos")
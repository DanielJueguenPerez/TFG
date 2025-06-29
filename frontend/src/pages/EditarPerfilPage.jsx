import { useNavigate } from "react-router-dom";
import FormularioInput from "../components/FormularioInput";
import { verPerfilUsuario, editarPerfilUsuario } from "../api/auth";
import { useEffect, useState } from "react";
import fondoUsuario from "../assets/usuario.png";

export default function EditarPerfilPage() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState(null);

  const camposPerfil = [
    { nombre: "username", tipo: "text", etiqueta: "Nombre de usuario" },
    { nombre: "password", tipo: "password", etiqueta: "Contraseña" },
    { nombre: "email", tipo: "email", etiqueta: "Correo electrónico" },
    { nombre: "nombre", tipo: "text", etiqueta: "Nombre" },
    { nombre: "apellidos", tipo: "text", etiqueta: "Apellidos" },
    { nombre: "DNI", tipo: "text", etiqueta: "DNI" },
  ];

  useEffect(() => {
    const recuperarPerfil = async () => {
      try {
        const data = await verPerfilUsuario();
        setPerfil(data);
      } catch (err) {
        console.error("Error al obtener los datos de perfil:", err);
        setError("No se ha podido recuperar los datos de perfil");
      }
    };
    recuperarPerfil();
  }, []);

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  if (!perfil) {
    return <p className="text-center mt-10">Cargando perfil...</p>;
  }

  const handleEditar = async (datos) => {
    try {
      const data = await editarPerfilUsuario(datos);
      alert("Datos editados con éxito");
      navigate("/usuario/ver-perfil");
    } catch (error) {
      console.error("Error al editar: ", error);

      if (error.response && error.response.data) {
        const errores = error.response.data;

        const mensaje = Object.entries(errores)
          .map(([campo, mensajes]) => {
            if (Array.isArray(mensajes)) {
              return `${campo}: ${mensajes.join(", ")}`;
            }
            return `${campo}: ${mensajes}`;
          })
          .join("\n");
        alert(`No se pudo editar los datos:\n\n${mensaje}`);
      } else {
        alert("Error desconocido al editar los datos");
      }
    }
  };

  return (
    <div className="relative min-h-screen pt-16 overflow-hidden">
      <img
        src={fondoUsuario}
        alt=""
        className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-0 pointer-events-none"
      />

      <div className="relative z-10 max-w-md mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 to-pink-500
                hover:from-pink-500 hover:to-purple-500 bg-clip-text text-transparent">
          Modifica tus datos de perfil
        </h2>
        <FormularioInput
          campos={camposPerfil}
          textoBoton="Guardar"
          valoresIniciales={perfil}
          onSubmit={handleEditar}
          validarTodos={false}
          onCancel={() => navigate("/usuario/ver-perfil")}
        />
      </div>
    </div>
  );
}

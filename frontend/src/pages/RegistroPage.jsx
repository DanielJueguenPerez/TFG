import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import FormularioInput from "../components/FormularioInput";
import { registroUsuario } from "../api/auth";
import { useUser } from "../context/UserContext";
import fondoUsuario from "../assets/usuario.png";
import toast from "react-hot-toast";
import TransicionAnimada from "../components/TransicionAnimada";

export default function RegistroPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const location = useLocation();
  const [mensajeNarrador, setMensajeNarrador] = useState("");

  const camposRegistro = [
    {
      nombre: "username",
      tipo: "text",
      etiqueta: "Nombre de usuario",
      requerido: true,
    },
    {
      nombre: "password",
      tipo: "password",
      etiqueta: "Contraseña",
      requerido: true,
    },
    {
      nombre: "password2",
      tipo: "password",
      etiqueta: "Confirmar contraseña",
      requerido: true,
    },
    {
      nombre: "email",
      tipo: "email",
      etiqueta: "Correo electrónico",
      requerido: true,
    },
    { nombre: "nombre", tipo: "text", etiqueta: "Nombre", requerido: true },
    {
      nombre: "apellidos",
      tipo: "text",
      etiqueta: "Apellidos",
      requerido: true,
    },
    { nombre: "DNI", tipo: "text", etiqueta: "DNI", requerido: true },
  ];

  const handleRegistro = async (datos) => {
    try {
      const data = await registroUsuario(datos);
      localStorage.setItem("token", data.token);
      login(data.token, data.user);
      toast.success("Usuario registrado con éxito");
      setMensajeNarrador("Usuario registrado con éxito");
      navigate("/");
    } catch (error) {
      console.error("Error al registrar: ", error);

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
        toast.error(`No se pudo completar el registro:\n\n${mensaje}`);
        setMensajeNarrador(`Error: ${mensaje}`);
      } else {
        toast.error("Error desconocido al registrarse");
        setMensajeNarrador(`Error: ${mensaje}`);
      }
    }
  };

  return (
    <TransicionAnimada animationKey={location.pathname}>
      <div className="relative min-h-screen pt-16 overflow-hidden pb-14">
        <img
          src={fondoUsuario}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-0 pointer-events-none"
        />

        <div className="relative z-10 max-w-md mx-auto mt-10 px-4">
          <h1
            className="text-2xl font-bold text-center mb-6 bg-gradient-to-r 
              from-purple-500 to-pink-500 
              bg-clip-text text-transparent 
              hover:from-pink-500 hover:to-purple-500 
              transition-colors"
          >
            Regístrate
          </h1>
          <FormularioInput
            campos={camposRegistro}
            textoBoton="Registrarse"
            onSubmit={handleRegistro}
          />
        </div>
      </div>
      <div className="sr-only" role="alert" aria-live="assertive">
        {mensajeNarrador}
      </div>
    </TransicionAnimada>
  );
}

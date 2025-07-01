import { useNavigate, useLocation } from "react-router-dom";
import FormularioInput from "../components/FormularioInput";
import { cambiarPassword } from "../api/auth";
import { useState } from "react";
import fondoUsuario from "../assets/usuario.png";
import toast from "react-hot-toast";
import TransicionAnimada from "../components/TransicionAnimada";


export default function CambiarPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const camposPassword = [
    { nombre: "password_actual", tipo: "password", etiqueta: "Contraseña actual", requerido: true  },
    { nombre: "password_nuevo", tipo: "password", etiqueta: "Contraseña nueva", requerido: true  },
    { nombre: "password_nuevo_2", tipo: "password", etiqueta: "Confirmar contraseña nueva", requerido: true  },
  ];


  const handleCambiarPassword = async (datos) => {
    try {
      await cambiarPassword(datos);
      toast.success("Contraseña cambiada con éxito");
      navigate("/usuario/ver-perfil");
    } catch (error) {
      console.error("Error al cambiar contraseña: ", error);

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
        toast.error(`No se pudo cambiar la contraseña:\n\n${mensaje}`);
      } else {
        toast.error("Error desconocido al cambiar la contraseña");
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
          <h2
            className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 to-pink-500
                hover:from-pink-500 hover:to-purple-500 bg-clip-text text-transparent"
          >
            Cambia tu contraseña
          </h2>
          <FormularioInput
            campos={camposPassword}
            textoBoton="Guardar"
            onSubmit={handleCambiarPassword}
            onCancel={() => navigate("/usuario/ver-perfil")}
          />
        </div>
      </div>
    </TransicionAnimada>
  );
}
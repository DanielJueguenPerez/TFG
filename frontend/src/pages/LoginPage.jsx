import { useNavigate, Link } from "react-router-dom";
import FormularioInput from "../components/FormularioInput";
import { loginUsuario } from "../api/auth";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();

  const camposLogin = [
    { nombre: "username", tipo: "text", etiqueta: "Nombre de usuario" },
    { nombre: "password", tipo: "password", etiqueta: "Contraseña" },
  ];

  const handleLogin = async (datos) => {
    console.log("Enviando datos de login:", datos);
    try {
      const data = await loginUsuario(datos);
      login(data.token, data.user);
      alert("Inicio de sesión exitoso");
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);

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
        alert(`No se pudo iniciar sesión:\n\n${mensaje}`);
      } else {
        alert("Error desconocido al iniciar sesión");
      }
    }
  };

  return (
    <div className="pt-16">
      <div className="max-w-md mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>
        <FormularioInput
          campos={camposLogin}
          textoBoton="Iniciar sesión"
          onSubmit={handleLogin}
        />
        <hr className="my-6 border-t border-gray-300" />
      </div>
      <p className="text-center text-sm text-gray-600">
        ¿No estás registrad@?{" "}
        <Link to="/usuario/registro" className="text-blue-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}

import { useNavigate, Link, useLocation } from "react-router-dom";
import FormularioInput from "../components/FormularioInput";
import { loginUsuario } from "../api/auth";
import { useUser } from "../context/UserContext";
import fondoUsuario from "../assets/usuario.png";
import toast from "react-hot-toast";
import TransicionAnimada from "../components/TransicionAnimada";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const location = useLocation();
  const [mensajeNarrador, setMensajeNarrador] = useState("");

  const camposLogin = [
    { nombre: "username", tipo: "text", etiqueta: "Nombre de usuario" },
    { nombre: "password", tipo: "password", etiqueta: "Contraseña" },
  ];

  const handleLogin = async (datos) => {
    console.log("Enviando datos de login:", datos);
    try {
      const data = await loginUsuario(datos);
      login(data.token, data.user);
      toast.success("Sesión iniciada");
      setMensajeNarrador("Sesión iniciada correctamente");
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
        toast.error(`No se pudo iniciar sesión:\n\n${mensaje}`);
        setMensajeNarrador(`Error: ${mensaje}`);
      } else {
        toast.error("Error desconocido al iniciar sesión");
        setMensajeNarrador("Error desconocido al iniciar sesión");
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
          <div className="max-w-md mx-auto mt-10 px-4">
            <h1
              className="text-2xl font-bold text-center mb-6 bg-gradient-to-r 
              from-purple-500 to-pink-500 
              bg-clip-text text-transparent 
              hover:from-pink-500 hover:to-purple-500 
              transition-colors"
            >
              Iniciar sesión
            </h1>
            <FormularioInput
              campos={camposLogin}
              textoBoton="Iniciar sesión"
              onSubmit={handleLogin}
            />
            <hr className="my-6 border-t border-purple-400" />
          </div>
          <p className="text-center text-sm text-gray-600">
            ¿No estás registrad@?{" "}
            <Link
              to="/usuario/registro"
              className="
              bg-gradient-to-br from-purple-600 to-blue-500
              bg-clip-text text-transparent
              hover:underline
              font-medium
            "
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
      <div className="sr-only" role="alert" aria-live="assertive">
        {mensajeNarrador}
      </div>
    </TransicionAnimada>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logopeque.png";
import toast from "react-hot-toast";

export default function Header() {
  // Variables para controlar el estado del usuario y el menú hamburguesa
  const navigate = useNavigate();
  const { nombreUsuario, logout } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const landingPage = location.pathname === "/";

  // Opciones para el menú hamburguesa
  const opciones = [
    { to: "/grados", label: "🎓 Ver grados" },
    { to: "/asignaturas", label: "📚 Buscar asignaturas" },
    { to: "/usuario/comentarios", label: "💬 Mis comentarios" },
    { to: "/favoritos/lista", label: "⭐ Lista de favoritos" },
  ];

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <>
      <header className="w-full h-16 flex justify-between items-center p-4 bg-transparent text-white absolute top-0 left-0 z-50">
        {/* Logo de la Web, que es un link a la Landing Page */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
        </Link>

        {/* Se muestra el nombre de usuario y un boton para salir, solo visible si el usuario está logueado */}

        <nav className="flex items-center gap-4 relative">
          {/* Hola, usuario (si está logueado) */}
          {nombreUsuario && (
            <span className={`${landingPage ? "text-white" : "text-gray-700"}`}>
              Hola,{" "}
              <Link
                to="/usuario/ver-perfil"
                className="
                  bg-gradient-to-r from-purple-500 to-pink-500
                hover:from-pink-500 hover:to-purple-500
                  bg-clip-text text-transparent
                  hover:underline
                  font-medium
                "
              >
                {nombreUsuario}
              </Link>
            </span>
          )}

          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 focus:outline-none ${
              landingPage ? "text-white" : "text-gray-600"
            }`}
            aria-label="Toggle menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </nav>
      </header>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white text-gray-800 shadow-lg z-50 p-4 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {" "}
        <div className="flex justify-end">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col mt-4 gap-2">
          {opciones.map((opt) => (
            <Link
              key={opt.to}
              to={
                (opt.to === "/favoritos/lista" ||
                  opt.to === "/usuario/comentarios") &&
                !nombreUsuario
                  ? "/usuario/login"
                  : opt.to
              }
              className="px-4 py-2 hover:bg-gray-100 transition text-sm rounded"
              onClick={() => setIsSidebarOpen(false)}
            >
              {opt.label}
            </Link>
          ))}

          {!nombreUsuario && (
            <div className="border-t border-gray-200 mt-2 pt-2 flex gap-2 justify-center">
              <Link
                to="/usuario/registro"
                onClick={() => setIsSidebarOpen(false)}
                className="
                  inline-flex              
                  p-[2px]                   
                  rounded-full              
                  bg-gradient-to-r from-purple-500 to-pink-500
                  focus:outline-none focus:ring-4 focus:ring-purple-200
                  min-w-[120px]
                  group                     
                "
              >
                <span
                  className="
                    w-full h-full 
                    flex items-center justify-center
                    bg-white          
                    text-sm font-medium
                    py-2 px-4
                    rounded-full
                    text-gray-900
                    transition-all duration-200 ease-in-out
                    group-hover:bg-transparent 
                    group-hover:text-white
                  "
                >
                  Registrarse
                </span>
              </Link>
              <Link
                to="/usuario/login"
                onClick={() => setIsSidebarOpen(false)}
                className="
                  inline-flex items-center justify-center
                  text-white
                  bg-gradient-to-r from-purple-500 to-pink-500
                  hover:from-pink-500 hover:to-purple-500
                  focus:outline-none focus:ring-4 focus:ring-purple-200
                  font-medium text-sm
                  py-2 px-4
                  rounded-full
                  transition
                  min-w-[120px]
                  text-center
                "
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
          {nombreUsuario && (
            <div className="mt-4 pt-2 border-t border-gray-200 flex justify-center">
              <button
                onClick={() => {
                  logout();
                  toast.success("¡Hasta pronto! 👋");
                  setIsSidebarOpen(false);
                  navigate("/");
                }}
                className="
                text-white
                  bg-gradient-to-br from-purple-600 to-blue-500
                  hover:bg-gradient-to-bl
                  focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800
                  font-semibold
                  py-2 px-4
                  text-sm
                  rounded-full
                  text-center
                  transition
                "
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

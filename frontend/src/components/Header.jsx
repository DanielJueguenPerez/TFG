import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logopeque.png";

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
                className="hover:underline text-blue-400"
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
                className="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white font-semibold px-4 py-2 text-sm border border-blue-500 hover:border-transparent rounded-full transition min-w-[120px] text-center"
                onClick={() => setIsSidebarOpen(false)}
              >
                Registrarse
              </Link>
              <Link
                to="/usuario/login"
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 text-sm rounded-full transition min-w-[120px] text-center"
                onClick={() => setIsSidebarOpen(false)}
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
          {/* Nombre de usuario y botón de salir*/}
          {nombreUsuario && (
            <div className="mt-4 pt-2 border-t border-gray-200 flex justify-center">
              <button
                onClick={() => {
                  logout();
                  setIsSidebarOpen(false);
                  navigate("/");
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 text-sm rounded-full text-center transition"
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

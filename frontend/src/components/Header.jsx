import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logopeque.png";

export default function Header() {
  // Variables para controlar el estado del usuario y el menú hamburguesa
  const navigate = useNavigate();
  const { nombreUsuario, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  // Opciones para el menú hamburguesa
  const opciones = [
    { to: "/grados", label: "🎓 Ver grados" },
    { to: "/asignaturas", label: "📚 Buscar asignaturas" },
    { to: "/usuario/comentarios", label: "💬 Mis comentarios" },
    { to: "/favoritos/lista", label: "⭐ Lista de favoritos" },
  ];

  return (
    <header className="w-full h-16 flex justify-between items-center p-4 border-b border-gray-300 shadow-sm">
      {/* Logo de la Web, que es un link a la Landing Page */}
      <Link to="/" className="flex items-center">
        <img src={logo} alt="Logo" className="h-16 w-auto" />
      </Link>

      {/* Botones de registro e inicio de sesión, solo visibles si el usuario no está logueado. Configurado */}
      {/* solo para ser visible en pantallas grandes (hidden sm:flex)*/}
      <nav className="flex items-center gap-2 relative">
        {!nombreUsuario && (
          <div className="hidden sm:flex gap-2">
            <Link
              to="/usuario/registro"
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-3 border border-blue-500 hover:border-transparent rounded-full"
            >
              Registrarse
            </Link>
            <Link
              to="/usuario/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full
                        "
            >
              Iniciar Sesión
            </Link>
          </div>
        )}

        {/* Se muestra el nombre de usuario y un boton para salir, solo visible si el usuario está logueado */}
        {nombreUsuario && (
          <>
            <span>
              Hola,{" "}
              <Link
                to="/usuario/ver-perfil"
                className="text-blue-400 hover:underline"
              >
                {" "}
                {nombreUsuario}
              </Link>
            </span>
          </>
        )}

        {/* Menú hamburguesa, que cambia su icono dependiendo de si está pulsado o no */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
        {/* Opciones que muestra el menú hamburguesa */}
        {menuOpen && (
          <div className="absolute top-full right-0 mt-2 w-52 bg-white border rounded shadow-lg z-10 p-2">
            <div className="flex flex-col">
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
                  className="px-4 py-2 hover:bg-gray-100 transition text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  {opt.label}
                </Link>
              ))}

              {/* Configuración especial para pantallas pequeñas. Como los botones de inicio de sesión y registro están */}
              {/* ocultos en estas pantallas, se introducen dentro del propio menú hamburguesa. Solo se muestran dentro */}
              {/* del menú hamburguesa en pantallas pequeñas (sm:hidden) */}
              {/* Botones de inicio de sesion y registro */}
              {!nombreUsuario && (
                <div className="flex flex-row sm:hidden border-t border-gray-200 mt-2 pt-2 justify-center gap-2">
                  <Link
                    to="/usuario/registro"
                    className="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white text-xs font-medium py-1 px-2 
                        border border-blue-500 hover:border-transparent rounded-full text-center transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                  <Link
                    to="/usuario/login"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-2 text-xs rounded-full text-center transition"
                    onClick={() => setMenuOpen(false)}
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
                      setMenuOpen(false);
                      navigate('/');
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 text-sm rounded-full text-center transition"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

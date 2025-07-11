import ListaPaginada from "../components/ListaPaginada";
import { verComentariosPropios } from "../api/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import fondoComentarios from "../assets/comentarios.png";
import TransicionAnimada from "../components/TransicionAnimada";


export default function VerComentariosPropios() {
  const navigate = useNavigate();
  const location = useLocation();

  const recuperarComentarios = (url) => verComentariosPropios(url);

  const renderComentario = (comentario) => {
    return (
      <li key={comentario.id_comentario} className="relative p-4 bg-white/20">
        <Link
          to={`/comentarios/editar/${comentario.id_comentario}`}
          className="absolute top-2 right-2 text-sm text-blue-600 hover:underline"
        >
          Editar
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg font-semibold mb-2">{comentario.texto}</p>
            <p className="text-sm text-gray-600">
              En{" "}
              <Link
                to={`/asignaturas/${comentario.id_asignatura}`}
                className="text-blue-600 hover:underline"
              >
                {comentario.nombre_asignatura}
              </Link>
              ,{" "}
              <Link
                to={`/grados/${comentario.id_grado}`}
                className="text-blue-600 hover:underline"
              >
                {comentario.nombre_grado}
              </Link>
              , {new Date(comentario.fecha).toLocaleString()}
            </p>
          </div>
        </div>
      </li>
    );
  };

  return (
    <TransicionAnimada animationKey={location.pathname}>
      <div className="relative min-h-screen pt-16 overflow-hidden">
        <img
          src={fondoComentarios}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-0 pointer-events-none"
        />

        <div className="relative z-10 max-w-xl mx-auto mt-10 px-4">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500
                hover:from-pink-500 hover:to-purple-500 bg-clip-text text-transparent"
          >
            ← Volver atrás
          </button>

          <h1 className="text-2xl font-bold text-center mb-6">
            <span aria-hidden="true">💬</span>
            <span
              className="
              bg-gradient-to-r 
              from-purple-500 to-pink-500 
              bg-clip-text text-transparent 
              hover:from-pink-500 hover:to-purple-500 
              transition-colors
            "
            >
              Tus comentarios{" "}
            </span>
            <span aria-hidden="true">💬</span>
          </h1>
          <ListaPaginada
            recuperarDatos={recuperarComentarios}
            renderItem={renderComentario}
            urlInicial={null}
          />
        </div>
      </div>
    </TransicionAnimada>
  );
}

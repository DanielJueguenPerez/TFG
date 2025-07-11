import ListaPaginada from "../components/ListaPaginada";
import { verFavoritos } from "../api/favoritos";
import { Link, useNavigate, useLocation } from "react-router-dom";
import fondoFavoritos from "../assets/favoritos.png";
import TransicionAnimada from "../components/TransicionAnimada";

export default function VerListaFavoritosPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const renderAsignatura = (favorito) => {
    return (
      <li key={favorito.id_favorito} className="p-4 border-b bg-white/20">
        <Link
          to={`/asignaturas/${favorito.id_asignatura}`}
          className="text-blue-600 hover:underline"
        >
          {favorito.nombre_asignatura}
        </Link>
      </li>
    );
  };

  return (
    <TransicionAnimada animationKey={location.pathname}>
      <div className="relative min-h-screen pt-16 overflow-hidden">
        <img
          src={fondoFavoritos}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-0 pointer-events-none"
        />

        <div className="relative z-10 max-w-xl mx-auto mt-10 px-4">
          {" "}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500
                hover:from-pink-500 hover:to-purple-500 bg-clip-text text-transparent"
          >
            ← Volver atrás
          </button>
          <h1 className="text-2xl font-bold text-center mb-6">
            <span aria-hidden="true">⭐</span>
            <span
              className="
              bg-gradient-to-r 
              from-purple-500 to-pink-500 
              bg-clip-text text-transparent 
              hover:from-pink-500 hover:to-purple-500 
              transition-colors
            "
            >
              Tu lista de asignaturas favoritas
            </span>
            <span aria-hidden="true">⭐</span>
          </h1>
          <ListaPaginada
            recuperarDatos={verFavoritos}
            renderItem={renderAsignatura}
            urlInicial={null}
          />
        </div>
      </div>
    </TransicionAnimada>
  );
}

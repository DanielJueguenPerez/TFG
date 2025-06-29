import ListaPaginada from "../components/ListaPaginada";
import { verFavoritos } from "../api/favoritos";
import { Link, useNavigate } from "react-router-dom";
import fondoFavoritos from "../assets/favoritos.png";

export default function VerListaFavoritosPage() {
  const navigate = useNavigate();

  const recuperarFavoritos = async (pagina) => {
    const data = await verFavoritos(pagina);
    return {
      results: data.results,
      count: data.count,
    };
  };

  const renderAsignatura = (favorito) => {
    return (
      <li key={favorito.id_favorito} className="p-4 border-b">
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
          className="mb-4 text-sm text-blue-600"
        >
          ← Volver atrás
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">
          ⭐ Tu lista de asignaturas favoritas ⭐
        </h2>
        <ListaPaginada
          recuperarDatos={recuperarFavoritos}
          renderItem={renderAsignatura}
        />
      </div>
    </div>
  );
}

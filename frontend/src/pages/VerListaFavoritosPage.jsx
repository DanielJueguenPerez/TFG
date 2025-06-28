import ListaPaginada from "../components/ListaPaginada";
import { verFavoritos } from "../api/favoritos";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="max-w-2xl mx-auto mt-10 px-4 pt-16">
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
  );
}

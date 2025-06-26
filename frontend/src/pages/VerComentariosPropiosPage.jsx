import ListaPaginada from "../components/ListaPaginada";
import { verComentariosPropios } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

export default function VerComentariosPropios() {
  const navigate = useNavigate();

  const recuperarComentarios = (pagina) => verComentariosPropios(pagina);

  const renderComentario = (comentario) => {
    return (
      <li key={comentario.id_comentario} className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg mb-2">{comentario.texto}</p>
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
    <div className="max-w-2xl mx-auto mt-10 px-2">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600"
      >
        ← Volver atrás
      </button>
      <h2 className="text-2xl font-bold text-center mb-6">💬 Tus comentarios 💬</h2>
      <ListaPaginada
        recuperarDatos={recuperarComentarios}
        renderItem={renderComentario}
      />
    </div>
  );
}

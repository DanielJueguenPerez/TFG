import { verComentarios } from "../api/comentarios";
import { verDetallesAsignatura } from "../api/asignaturas";
import ListaPaginada from "../components/ListaPaginada";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function VerComentariosPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, estaLogueado } = useUser();
  const [asignatura, setAsignatura] = useState("");

  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const data = await verDetallesAsignatura(id);
        setAsignatura(data);
      } catch (error) {
        console.error("Error al obtener el nombre de la asignatura");
      }
    };
    cargarNombre();
  }, [id]);

  const recuperarComentarios = (pagina) => verComentarios(id, pagina);

  const renderComentario = (comentario) => {
    return (
      <li key={comentario.id_comentario} className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg mb-2">{comentario.texto}</p>
            <p className="text-sm text-gray-600 font-semibold">
              <span className="font-semibold text-black">
                {comentario.username}
              </span>
              , {new Date(comentario.fecha).toLocaleString()}
            </p>
          </div>
          {user?.id === comentario.id_usuario && (
            <Link
              to={`/comentarios/editar/${comentario.id_comentario}`}
              className="text-blue-600 hover:underline text-sm"
            >
              Editar
            </Link>
          )}
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
      <h2 className=" text-2xl font-bold text-center mb-6">
        Comentarios de{" "}
        <span className="text-blue-700">{asignatura.nombre}</span>
      </h2>
      <div className="flex justify-center gap-4 mb-8">
        {estaLogueado && (
          <button
            onClick={() =>
              navigate(`/comentarios/nuevo/${asignatura.id_asignatura}`)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Publicar comentario
          </button>
        )}
      </div>
      <ListaPaginada
        recuperarDatos={recuperarComentarios}
        renderItem={renderComentario}
      />
    </div>
  );
}

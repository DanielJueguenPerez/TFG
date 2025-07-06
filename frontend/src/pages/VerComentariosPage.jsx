import { verComentarios } from "../api/comentarios";
import { verDetallesAsignatura } from "../api/asignaturas";
import ListaPaginada from "../components/ListaPaginada";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import fondoComentarios from "../assets/comentarios.png";
import TransicionAnimada from "../components/TransicionAnimada";

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

  const recuperarComentarios = (url) => verComentarios(id, url);

  const renderComentario = (comentario) => {
    return (
      <li key={comentario.id_comentario} className="p-4 bg-white/20">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg font-semibold mb-2">{comentario.texto}</p>
            <p className="text-sm text-gray-600 font-semibold">
              <span className="font-medium text-black">
                {comentario.username}
              </span>
              , {new Date(comentario.fecha).toLocaleString()}
            </p>
          </div>
          {user?.username === comentario.username && (
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
    <TransicionAnimada animationKey={id}>
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
          <h2
            className=" text-2xl font-bold text-center mb-6 bg-gradient-to-r 
              from-purple-500 to-pink-500 
              bg-clip-text text-transparent 
              hover:from-pink-500 hover:to-purple-500 
              transition-colors"
          >
            Comentarios de{" "}
            <span className="text-purple-600">{asignatura.nombre}</span>
          </h2>
          <div className="flex justify-center gap-4 mb-8">
            {estaLogueado && (
              <button
                onClick={() =>
                  navigate(`/comentarios/nuevo/${asignatura.id_asignatura}`)
                }
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
                Publicar comentario
              </button>
            )}
          </div>
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

import { useParams, useNavigate } from "react-router-dom";
import ComentarioInput from "../components/ComentarioInput";
import { crearComentario } from "../api/comentarios";
import fondoComentarios from "../assets/comentarios.png";

export default function CrearComentarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleCrear = async (texto) => {
    try {
      await crearComentario(id, texto);
      navigate(-1);
    } catch (error) {
      console.error("Error al crear el comentario:", error);
    }
  };

  return (
    <div className="relative min-h-screen pt-16 overflow-hidden">
      <img
        src={fondoComentarios}
        alt=""
        className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-0 pointer-events-none"
      />

      <div className="relative z-10 max-w-xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          Publicar comentario
        </h2>
        <ComentarioInput
          textoBoton="Publicar"
          onSubmit={handleCrear}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
}

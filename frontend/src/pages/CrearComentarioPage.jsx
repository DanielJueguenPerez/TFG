import { useParams, useNavigate } from "react-router-dom";
import ComentarioInput from "../components/ComentarioInput";
import { crearComentario } from "../api/comentarios";

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
    <div className="max-w-xl mx-auto mt-10 px-4 pt-16">
      <h2 className="text-2xl font-bold text-center mb-6">
        Publicar comentario
      </h2>
      <ComentarioInput
        textoBoton="Publicar"
        onSubmit={handleCrear}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}

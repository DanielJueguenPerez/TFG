import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import ComentarioInput from "../components/ComentarioInput";
import { crearComentario } from "../api/comentarios";
import fondoComentarios from "../assets/comentarios.png";
import toast from "react-hot-toast";
import TransicionAnimada from "../components/TransicionAnimada";

export default function CrearComentarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mensajeNarrador, setMensajeNarrador] = useState("");

  const handleCrear = async (texto) => {
    try {
      await crearComentario(id, texto);
      toast.success("Comentario creado con éxito");
      setMensajeNarrador("Comentario creado con éxito");
      navigate(-1);
    } catch (error) {
      toast.error("Error al crear el comentario");
      setMensajeNarrador("Error al crear el comentario");
    }
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
          <h1
            className="text-2xl font-bold text-center mb-6 bg-gradient-to-r 
              from-purple-500 to-pink-500 
              bg-clip-text text-transparent 
              hover:from-pink-500 hover:to-purple-500 
              transition-colors"
          >
            Publicar comentario
          </h1>
          <ComentarioInput
            textoBoton="Publicar"
            onSubmit={handleCrear}
            onCancel={() => navigate(-1)}
          />
        </div>
      </div>
      <div className="sr-only" role="alert" aria-live="assertive">
        {mensajeNarrador}
      </div>
    </TransicionAnimada>
  );
}

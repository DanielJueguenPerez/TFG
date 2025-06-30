import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ComentarioInput from "../components/ComentarioInput";
import {
  verComentario,
  editarComentario,
  eliminarComentario,
} from "../api/comentarios";
import fondoComentarios from "../assets/comentarios.png";
import toast from "react-hot-toast";
import TransicionAnimada from "../components/TransicionAnimada";

export default function EditarComentarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [textoInicial, setTextoInicial] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const recuperarComentario = async () => {
      try {
        const data = await verComentario(id);
        setTextoInicial(data.texto);
      } catch (error) {
        console.error("Error al recuperar el comentario");
        setTextoInicial("");
      }
      setCargando(false);
    };
    recuperarComentario();
  }, [id]);

  const handleEditar = async (nuevoTexto) => {
    try {
      await editarComentario(id, nuevoTexto);
      toast.success("Comentario editado correctamente ✅");
      navigate(-1);
    } catch (error) {
      toast.error("Error al editar el comentario");
      alert("Error al editar el comentario");
    }
  };

  const handleBorrar = async () => {
    if (
      !window.confirm("¿Estás seguro de que quieres borrar este comentario?")
    ) {
      return;
    }
    try {
      await eliminarComentario(id);
      toast.success("Comentario borrado correctamente 🔴");
      navigate(-1);
    } catch (error) {
      toast.error("Error al borrar el comentario");
      alert("Error al borrar el comentario");
    }
  };

  if (cargando) {
    return <p className="text-center mt-10">Cargando comentario...</p>;
  }

  return (
    <TransicionAnimada animationKey={id}>
      <div className="relative min-h-screen pt-16 overflow-hidden">
        <img
          src={fondoComentarios}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-0 pointer-events-none"
        />

        <div className="relative z-10 max-w-xl mx-auto mt-10 px-4">
          <h2
            className="text-2xl font-bold text-center mb-6 bg-gradient-to-r 
              from-purple-500 to-pink-500 
              bg-clip-text text-transparent 
              hover:from-pink-500 hover:to-purple-500 
              transition-colors"
          >
            Editar Comentario
          </h2>
          <ComentarioInput
            textoInicial={textoInicial}
            onSubmit={handleEditar}
            onDelete={handleBorrar}
            textoBoton="Guardar cambios"
            onCancel={() => navigate(-1)}
          />
        </div>
      </div>
    </TransicionAnimada>
  );
}

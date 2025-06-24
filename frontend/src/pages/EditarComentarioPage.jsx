import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ComentarioInput from "../components/ComentarioInput";
import { verComentario, editarComentario, eliminarComentario } from "../api/comentarios";

export default function EditarComentarioPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [textoInicial, setTextoInicial] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const recuperarComentario = async () => {
            try {
                const data= await verComentario(id);
                setTextoInicial(data.texto);    
            } catch (error) {
                console.error("Error al recuperar el comentario");
                setTextoInicial('');
            } setCargando(false);
        };
        recuperarComentario();
    }, [id]);

    const handleEditar = async (nuevoTexto) => {
        try {
            await editarComentario(id, nuevoTexto);
            alert("Comentario editado correctamente");
            navigate(-1);
        } catch (error) {
            console.error("Error al editar el comentario");
            alert("Error al editar el comentario");
        }
    };

    const handleBorrar = async () => {
        if (!window.confirm('¿Estás seguro de que quieres borrar este comentario?')) {
            return;
        }   
        try {
            await eliminarComentario(id);
            alert("Comentario borrado correctamente");
            navigate(-1);
        } catch (error) {
            console.error("Error al borrar el comentario");
            alert("Error al borrar el comentario");
        }
    };

    if (cargando) {
        return <p className="text-center mt-10">Cargando comentario...</p>
    }

    return(
      <div className="max-w-xl mx-auto px-4 mt-10">
        <h2 className="text-2xl font-bold text-center mb-6">
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
    );
}
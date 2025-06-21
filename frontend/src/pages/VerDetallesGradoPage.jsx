import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verDetallesGrado } from '../api/grados';

export default function VerDetallesGradoPage () {
    const { id } = useParams();
    const navigate = useNavigate();
    const [grado, setGrado] = useState(null);
    const [cursosDesplegados, setCursosDesplegados] = useState([]);

    useEffect (() => {
        const recuperarGrado = async () => {
            try{
                const data = await verDetallesGrado(id);
                setGrado(data);
            } catch (error) {
                console.error("Error al cargar el grado.")
            }
        };
        recuperarGrado();
    }, [id]);

    const toggleCurso = (curso) => {
        setCursosDesplegados((abiertosPrevios) =>
            abiertosPrevios.includes(curso) ? abiertosPrevios.filter((c) => c!== curso) : [...abiertosPrevios, curso]
        );
    };

    if (!grado) return <p className="text-center mt-10">Cargando grado...</p>

    return(
        <div className="max-w-3xl mx-auto mt-10 px-4">
            <button 
                onClick={() => navigate(-1)}
                className="mb-4 text-sm text-blue-600"
            >
                ← Volver atrás
            </button>
            <h2 className="text-2xl font-bold text-center mb-2">{grado.nombre}</h2>
            <p className="text-center text-blue-600 mb-6">
                <a href={grado.url} target="_blank" rel="noopener noreferrer" className="underline">
                    Ver en la web oficial
                </a>
            </p>

            {grado.asignaturas_cursos.map((bloque) => (
                <div key={bloque.curso} className="mb-4 border rounded">
                    <button 
                        onClick={() => toggleCurso(bloque.curso)}
                        className="w-full text-left px-4 py-2 bg-gray-100 font-semibold hover:bg-gray-200"
                    >
                        Curso {bloque.curso}
                    </button>

                    {cursosDesplegados.includes(bloque.curso) && (
                        <ul className="px-6 py-2 list-disc">
                            {bloque.asignaturas.map((asig) => (
                                <li key={asig.id_asignatura} className="py-1">
                                    {asig.nombre}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}
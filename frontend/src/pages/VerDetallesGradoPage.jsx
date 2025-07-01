import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { verDetallesGrado } from "../api/grados";
import fondoGrados from "../assets/grados.png";
import TransicionAnimada from "../components/TransicionAnimada";

export default function VerDetallesGradoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grado, setGrado] = useState(null);
  const [cursosDesplegados, setCursosDesplegados] = useState([]);

  useEffect(() => {
    const recuperarGrado = async () => {
      try {
        const data = await verDetallesGrado(id);
        setGrado(data);
      } catch (error) {
        console.error("Error al cargar el grado.");
      }
    };
    recuperarGrado();
  }, [id]);

  const toggleCurso = (curso) => {
    setCursosDesplegados((abiertosPrevios) =>
      abiertosPrevios.includes(curso)
        ? abiertosPrevios.filter((c) => c !== curso)
        : [...abiertosPrevios, curso]
    );
  };

  if (!grado) return null;

  return (
    <TransicionAnimada animationKey={id}>
      <div className="relative min-h-screen pt-16 overflow-hidden pb-14">
        <img
          src={fondoGrados}
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
            className="text-2xl font-bold text-center mb-2 bg-gradient-to-r 
              from-purple-500 to-pink-500 
              bg-clip-text text-transparent 
              hover:from-pink-500 hover:to-purple-500 
              transition-colors"
          >
            {grado.nombre}
          </h2>
          <p className="text-center text-blue-600 mb-6">
            <a
              href={grado.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Ver en la web oficial
            </a>
          </p>

          {grado.asignaturas_cursos.map((bloque) => (
            <div key={bloque.curso} className="mb-4 border rounded">
              <button
                onClick={() => toggleCurso(bloque.curso)}
                className="w-full text-left px-4 py-2 bg-white/40 font-semibold hover:bg-white/50"
              >
                Curso {bloque.curso}
              </button>

              {cursosDesplegados.includes(bloque.curso) && (
                <ul className="px-6 py-2 list-disc bg-white/10">
                  {bloque.asignaturas.map((asig) => (
                    <li key={asig.id_asignatura} className="py-1">
                      <Link
                        to={`/asignaturas/${asig.id_asignatura}`}
                        className="text-blue-600 hover:underline"
                      >
                        {asig.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </TransicionAnimada>
  );
}

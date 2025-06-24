import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verDetallesAsignatura } from "../api/asignaturas";
import EstadisticasGrafica from "../components/EstadisticasGrafica";
import { Star } from "lucide-react";
import { useFavoritos } from "../context/FavoritosContext";
import { useUser } from "../context/UserContext";

export default function VerDetallesAsignaturaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asignatura, setAsignatura] = useState(null);
  const { esFavorita, toggleFavorito } = useFavoritos();
  const { estaLogueado } = useUser();

  useEffect(() => {
    const recuperarAsignatura = async () => {
      try {
        const data = await verDetallesAsignatura(id);
        setAsignatura(data);
      } catch (error) {
        console.error("Error al cargar la asignatura.");
      }
    };
    recuperarAsignatura();
  }, [id]);

  if (!asignatura)
    return <p className="text-center mt-10">Cargando asignatura...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600"
      >
        ← Volver atrás
      </button>

      <h2 className="text-3xl font-bold text-center mb-2">
        {asignatura.nombre}

        {estaLogueado && (
          <button
            onClick={() => {
              toggleFavorito(asignatura.id_asignatura);
            }}
          >
            <Star
              fill={esFavorita(asignatura.id_asignatura) ? "gold" : "none"}
              stroke="gold"
              className="w-7 h-7 transition-all duration-200"
            />
          </button>
        )}
      </h2>

      <p className="text-center text-gray-600 mb-6">
        {asignatura.nombre_grado}
      </p>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => navigate(`/comentarios/${asignatura.id_asignatura}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Ver comentarios
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-6">
        {asignatura.estadisticas_anios.map((anio) => (
          <EstadisticasGrafica
            key={anio["Año Academico"]}
            año={anio["Año Academico"]}
            datos={anio.estadisticas[0]}
          />
        ))}
      </div>
    </div>
  );
}

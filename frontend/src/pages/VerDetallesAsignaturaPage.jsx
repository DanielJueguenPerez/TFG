import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verDetallesAsignatura } from "../api/asignaturas";
import EstadisticasGrafica from "../components/EstadisticasGrafica";
import { Star } from "lucide-react";
import { useFavoritos } from "../context/FavoritosContext";
import { useUser } from "../context/UserContext";
import fondoAsignaturas from "../assets/asignaturas.png";
import TransicionAnimada from "../components/TransicionAnimada";

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

  if (!asignatura) return null;

  return (
    <TransicionAnimada animationKey={id}>
      <div className="relative min-h-screen pt-16 overflow-hidden pb-14">
        <img
          src={fondoAsignaturas}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-0 pointer-events-none"
        />
        <div className="relative z-10 max-w-4xl mx-auto mt-10 px-4">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500
                hover:from-pink-500 hover:to-purple-500 bg-clip-text text-transparent"
          >
            ← Volver atrás
          </button>

          <h1
            className="text-3xl font-bold text-center mb-2 bg-gradient-to-r 
              from-purple-500 to-pink-500 
              bg-clip-text text-transparent 
              hover:from-pink-500 hover:to-purple-500 
              transition-colors"
          >
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
          </h1>

          <p className="text-center text-gray-700 mb-6">
            {asignatura.nombre_grado}
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() =>
                navigate(`/comentarios/${asignatura.id_asignatura}`)
              }
              className="
                  inline-flex items-center justify-center
                  text-white
                  bg-gradient-to-r from-purple-500 to-pink-500
                  hover:from-pink-500 hover:to-purple-500
                  focus:outline-none focus:ring-4 focus:ring-purple-800
                  font-medium text-sm
                  py-2 px-4
                  rounded-full
                  transition
                  min-w-[120px]
                  text-center
                "
            >
              Ver comentarios
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-20">
            <EstadisticasGrafica
              key="media-total"
              titulo="Media de todos los años"
              datos={asignatura.media_estadisticas}
            />
            {asignatura.estadisticas_anios.map((anio) => (
              <EstadisticasGrafica
                key={anio["Año Academico"]}
                año={anio["Año Academico"]}
                datos={anio.estadisticas[0]}
              />
            ))}
          </div>
        </div>
      </div>
    </TransicionAnimada>
  );
}

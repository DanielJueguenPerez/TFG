import { useState } from "react";
import ListaPaginada from "../components/ListaPaginada";
import { buscarAsignaturas } from "../api/asignaturas";
import { Link, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useFavoritos } from "../context/FavoritosContext";
import { useUser } from "../context/UserContext";
import fondoAsignaturas from "../assets/asignaturas.png";

export default function BuscarAsignaturasPage() {
  const [valorInput, setValorInput] = useState("");
  const [clave, setClave] = useState("");
  const { esFavorita, toggleFavorito } = useFavoritos();
  const { estaLogueado } = useUser();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setValorInput(e.target.value);
  };

  const handlePulsarEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setClave(valorInput.trim());
    }
  };
  const recuperarAsignaturas = (pagina) => buscarAsignaturas(pagina, clave);

  const renderAsignatura = (asignatura) => {
    return (
      <li key={asignatura.id_asignatura} className="p-4 border-b bg-white/20">
        <div className="flex items-center justify-between">
          <Link
            to={`/asignaturas/${asignatura.id_asignatura}`}
            className="text-blue-600 hover:underline"
          >
            {asignatura.nombre}
          </Link>

          {estaLogueado && (
            <button
              onClick={() => toggleFavorito(asignatura.id_asignatura)}
              className="ml-4"
            >
              <Star
                fill={esFavorita(asignatura.id_asignatura) ? "gold" : "none"}
                stroke="gold"
                className="w-7 h-7 transition-all duration-200"
              />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500">{asignatura.nombre_grado}</p>
      </li>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      <img
        src={fondoAsignaturas}
        alt=""
        className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-0 pointer-events-none"
      />
      <div className="relative z-10 max-w-2xl mx-auto mt-10 px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500
                hover:from-pink-500 hover:to-purple-500 bg-clip-text text-transparent"
        >
          ← Volver atrás
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">
          <span aria-hidden="true">📚</span>
          <span
            className="
              bg-gradient-to-r 
              from-purple-500 to-pink-500 
              bg-clip-text text-transparent 
              hover:from-pink-500 hover:to-purple-500 
              transition-colors
            "
          >
            Buscar asignaturas
          </span>
          <span aria-hidden="true">📚</span>
        </h2>
        <input
          type="text"
          value={valorInput}
          onChange={handleInputChange}
          onKeyDown={handlePulsarEnter}
          placeholder="Buscar asignatura..."
          className="w-full border px-3 py-2 mb-6 rounded-md"
        />

        {clave !== "" && (
          <ListaPaginada
            recuperarDatos={recuperarAsignaturas}
            renderItem={renderAsignatura}
            claveBusqueda={clave}
          />
        )}
      </div>
    </div>
  );
}

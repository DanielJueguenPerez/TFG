import { useState } from "react";
import ListaPaginada from "../components/ListaPaginada";
import { buscarAsignaturas } from "../api/asignaturas";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useFavoritos } from "../context/FavoritosContext";
import { useUser } from "../context/UserContext";

export default function BuscarAsignaturasPage() {
  const [valorInput, setValorInput] = useState("");
  const [clave, setClave] = useState("");
  const { esFavorita, toggleFavorito } = useFavoritos();
  const { estaLogueado } = useUser();

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
      <li key={asignatura.id_asignatura} className="p-4 border-b">
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
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600"
      >
        ← Volver atrás
      </button>
      <h2 className="text-2xl font-bold text-center mb-6">
        📚 Buscar asignaturas 📚
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
  );
}

import { verGrados } from "../api/grados";
import ListaPaginada from "../components/ListaPaginada";
import { Link, useNavigate } from "react-router-dom";
import fondoGrados from "../assets/grados.png";

export default function VerGradosPage() {
  const navigate = useNavigate();

  const renderGrado = (grado) => (
    <li key={grado.id_grado} className="p-4 border-b bg-white/20">
      <Link
        to={`/grados/${grado.id_grado}`}
        className="text-blue-600 hover:underline"
      >
        {grado.nombre}
      </Link>
    </li>
  );

  return (
    <div className="relative min-h-screen pt-16 overflow-hidden">
      <img
        src={fondoGrados}
        alt=""
        className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-0 pointer-events-none"
      />

      <div className="relative z-10 max-w-xl mx-auto mt-10 px-4">
        {" "}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500
                hover:from-pink-500 hover:to-purple-500 bg-clip-text text-transparent"
        >
          ← Volver atrás
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">
          <span aria-hidden="true">🎓</span>
          <span
            className="
              bg-gradient-to-r 
              from-purple-500 to-pink-500 
              bg-clip-text text-transparent 
              hover:from-pink-500 hover:to-purple-500 
              transition-colors
            "
          >
            Grados disponibles
          </span>
          <span aria-hidden="true">🎓</span>
        </h2>
        <ListaPaginada recuperarDatos={verGrados} renderItem={renderGrado} />
      </div>
    </div>
  );
}

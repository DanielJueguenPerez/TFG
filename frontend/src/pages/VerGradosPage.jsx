import { verGrados } from "../api/grados";
import ListaPaginada from "../components/ListaPaginada";
import { Link, useNavigate } from "react-router-dom";

export default function VerGradosPage() {
  const navigate = useNavigate();

  const renderGrado = (grado) => (
    <li key={grado.id_grado} className="p-4 border-b">
      <Link
        to={`/grados/${grado.id_grado}`}
        className="text-blue-600 hover:underline"
      >
        {grado.nombre}
      </Link>
    </li>
  );

  return (
    <div className="max-w-2xl mx-auto mt-10 px-2 pt-16">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600"
      >
        ← Volver atrás
      </button>
      <h2 className=" text-2xl font-bold text-center mb-6">
        🎓 Grados disponibles 🎓
      </h2>
      <ListaPaginada recuperarDatos={verGrados} renderItem={renderGrado} />
    </div>
  );
}

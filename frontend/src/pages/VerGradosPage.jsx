import { verGrados } from '../api/grados';
import ListaPaginada from '../components/ListaPaginada';
import { Link } from 'react-router-dom';

export default function VerGradosPage() {
    const renderGrado = (grado) => (
        <li key={grado.id} className="p-4 border-b">
            <Link to={`/grados/${grado.id}`} className="text-blue-600 hover:underline">
                {grado.nombre}
            </Link>
        </li>
    );

    return (
        <div className="max-w-2xl mx-auto mt-10 px-2">
            <h2 className=" text-2xl font-bold text-center mb-6">Grados disponibles</h2>
            <ListaPaginada
                recuperarDatos={verGrados}
                renderItem={renderGrado}
            />
        </div>
    );
}
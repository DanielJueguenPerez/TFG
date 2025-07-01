import { useEffect, useState } from "react";
import { verPerfilUsuario } from "../api/auth";
import { Link } from "react-router-dom";
import fondoUsuario from "../assets/usuario.png";
import TransicionAnimada from "../components/TransicionAnimada";
import { useLocation } from "react-router-dom";

export default function VerPerfilPage() {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const recuperarPerfil = async () => {
      try {
        const data = await verPerfilUsuario();
        setPerfil(data);
      } catch (err) {
        console.error("Error al obtener los datos de perfil:", err);
        setError("No se ha podido recuperar los datos de perfil");
      }
    };
    recuperarPerfil();
  }, []);

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  if (!perfil) {
    return <p className="text-center mt-10">Cargando perfil...</p>;
  }

  return (
    <TransicionAnimada animationKey={location.pathname}>
      <div className="relative min-h-screen pt-16 overflow-hidden pb-14">
        <img
          src={fondoUsuario}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-0 pointer-events-none"
        />

        <div className="relative z-10 max-w-xl mx-auto mt-10 px-4">
          {" "}
          <div className="bg-white/50 overflow-hidden shadow rounded-lg border max-w-md mx-auto mt-10">
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <Item label="Nombre de usuario" valor={perfil.username} />
                <Item label="Email" valor={perfil.email} />
                <Item label="Nombre" valor={perfil.nombre} />
                <Item label="Apellidos" valor={perfil.apellidos} />
                <Item label="DNI" valor={perfil.DNI} />
              </dl>
            </div>
          </div>
          <div className="max-w-md mx-auto mt-6 flex justify-center gap-4">
            <Link
              to="/usuario/editar-perfil"
              className="
              block w-2/4 mx-auto
              text-white
              bg-gradient-to-r from-purple-500 to-pink-500
              hover:from-pink-500 hover:to-purple-500
              focus:outline-none focus:ring-4 focus:ring-purple-200
              font-medium rounded-full text-sm
              px-5 py-2.5
              transition
              text-center
            "
            >
              Editar datos de perfil
            </Link>
              <Link
              to="/usuario/cambiar-password"
              className="
              block w-2/4 mx-auto
              text-white
              bg-gradient-to-r from-purple-500 to-pink-500
              hover:from-pink-500 hover:to-purple-500
              focus:outline-none focus:ring-4 focus:ring-purple-200
              font-medium rounded-full text-sm
              px-5 py-2.5
              transition
              text-center
            "
            >
              Cambiar contraseña
            </Link>
          </div>
        </div>
      </div>
    </TransicionAnimada>
  );
}

function Item({ label, valor }) {
  return (
    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {valor}
      </dd>
    </div>
  );
}

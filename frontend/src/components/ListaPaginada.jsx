import { useEffect, useState } from "react";

export default function ListaPaginada({
  recuperarDatos,
  renderItem,
  claveBusqueda = "",
  urlInicial = null,
}) {
  const [items, setItems] = useState([]);
  const [urlActual, setUrlActual] = useState(urlInicial);
  const [urlNext, setUrlNext] = useState(null);
  const [urlPrev, setUrlPrev] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const data = await recuperarDatos(urlActual);
        setItems(data.results);
        setUrlNext(data.next);
        setUrlPrev(data.previous);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setCargando(false);
      }
    };

    // Sólo resetea la paginación cuando haya un término de búsqueda y
    // urlActual sea null (es decir, una nueva búsqueda)
    if (claveBusqueda && urlActual === null) {
      setItems([]);
      setUrlNext(null);
      setUrlPrev(null);
    }
    cargarDatos();
  }, [urlActual, claveBusqueda]);


  return (
    <div className="pb-14">
      {cargando ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <ul className="border border-purple-500 rounded divide-y divide-purple-500 bg-transparent">
          {items.map(renderItem)}
        </ul>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setUrlActual(urlPrev)}
          disabled={!urlPrev}
          className="text-white px-3 py-1 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br 
          focus:outline-none focus:ring-4 focus:ring-pink-800 rounded-full disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => setUrlActual(urlNext)}
          disabled={!urlNext}
          className="text-white px-3 py-1 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br 
          focus:outline-none focus:ring-4 focus:ring-pink-800 rounded-full disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

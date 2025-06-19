import { useEffect, useState } from "react";

export default function ListaPaginada({
  recuperarDatos,
  renderItem,
  claveBusqueda = "",
}) {
  const [items, setItems] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setPagina(1);
  }, [claveBusqueda]);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const data = await recuperarDatos(pagina);
        setItems(data.results);
        setTotalPaginas(Math.ceil(data.count / 10));
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [pagina, claveBusqueda]);

  return (
    <div>
      {cargando ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <ul className="border rounded divide-y">{items.map(renderItem)}</ul>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
          disabled={pagina === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="self-center">
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={pagina === totalPaginas}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

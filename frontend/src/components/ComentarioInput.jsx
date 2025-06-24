import { useState } from "react";

export default function ComentarioInput({
  textoInicial = "",
  textoBoton = "Publicar",
  onSubmit,
  onCancel,
  onDelete,
}) {
  const [texto, setTexto] = useState(textoInicial);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setTexto(e.target.value);
    if (error) setError(""); // Limpiar error al cambiar el texto
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }
    onSubmit(texto.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        name="comentario"
        id="comentario"
        value={texto}
        onChange={handleChange}
        rows={4}
        className="w-full border border-gray-300 rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
        placeholder="Escribe tu comentario..."
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {textoBoton}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        </div>
        <div>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Borrar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

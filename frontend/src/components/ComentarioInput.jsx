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
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }
    onSubmit(texto.trim());
  };

  const baseBtn = `inline-flex items-center justify-center
                    text-white font-medium text-sm
                    px-4 py-2.5 rounded-full
                    transition text-center`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        name="comentario"
        id="comentario"
        value={texto}
        onChange={handleChange}
        rows={4}
        aria-invalid={!!error}
        aria-describedby={error ? "comentario-error" : undefined}
        className="w-full border border-gray-300 rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
        placeholder="Escribe tu comentario..."
      />
      {error && <p id="comentario-error" className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between items-center mt-2 w-full">
        <div className="flex gap-2">
          <button
            type="submit"
            className={`${baseBtn}
            bg-gradient-to-r from-purple-500 to-pink-500
            hover:from-pink-500 hover:to-purple-500
            focus:outline-none focus:ring-4 focus:ring-purple-800
          `}
          >
            {textoBoton}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={`${baseBtn}
              bg-gradient-to-br from-purple-600 to-blue-500
              hover:bg-gradient-to-bl
              focus:outline-none focus:ring-4 focus:ring-pink-400
            `}
          >
            Cancelar
          </button>
        </div>
        <div className="ml-10">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className={`${baseBtn}
              text-sm px-4 py-2 sm:text-sm sm:px-4 sm:py-2
                bg-gradient-to-r from-red-400 via-red-500
                 to-red-600 hover:bg-gradient-to-br focus:ring-4 
                 focus:outline-none focus:ring-red-800
            `}
            >
              Borrar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

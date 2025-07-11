import { useState } from "react";

export default function FormularioInput({
  campos,
  textoBoton,
  valoresIniciales = {},
  onSubmit,
  onCancel,
}) {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    setValores({
      ...valores,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    campos.forEach((campo) => {
      const valor = valores[campo.nombre];
      if (campo.requerido && (!valor || valor.trim() === "")) {
        errors[campo.nombre] = "Este campo es obligatorio";
      }

      if (
        campo.nombre === "email" &&
        valor &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
      ) {
        errors[campo.nombre] = "Correo electrónico no válido";
      }

      if (campo.nombre === "password" && valor && valor.length < 8) {
        errors[campo.nombre] = "La contraseña debe tener al menos 8 caracteres";
      }

      if (campo.nombre === "password2" && valor !== valores.password2) {
        errors[campo.nombre] = "Las contraseñas no coinciden";
      }
    });

    if (Object.keys(errors).length > 0) {
      setErrores(errors);
      return;
    }
    setErrores({});
    onSubmit(valores);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {campos.map((campo) => (
        <div key={campo.nombre}>
          <label
            htmlFor={campo.nombre}
            className="block text-sm font-medium text-gray-700"
          >
            {campo.etiqueta}
          </label>
          <input
            type={campo.tipo}
            name={campo.nombre}
            id={campo.nombre}
            value={valores[campo.nombre] || ""}
            onChange={handleChange}
            aria-invalid={!!errores[campo.nombre]}
            aria-describedby={
              errores[campo.nombre] ? `${campo.nombre}-error` : undefined
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errores[campo.nombre] && (
            <p id={`${campo.nombre}-error`} className="text-red-500 text-sm">
              {errores[campo.nombre]}
            </p>
          )}
        </div>
      ))}
      <div className="flex gap-4 w-full mt-4">
        <button
          type="submit"
          className={`
            ${onCancel ? "w-1/2" : "w-2/3 mx-auto"}
            text-white
            bg-gradient-to-r from-purple-500 to-pink-500
            hover:from-pink-500 hover:to-purple-500
            focus:outline-none focus:ring-4 focus:ring-purple-800
            font-medium rounded-full text-sm
            px-5 py-2.5
            transition
            text-center
          `}
        >
          {textoBoton}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="
                w-1/2 mx-auto
                text-white
                bg-gradient-to-br from-purple-600 to-blue-500
                hover:bg-gradient-to-bl
                focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-pink-400
                font-medium rounded-full text-sm
                px-5 py-2.5
                text-center
                transition
              "
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

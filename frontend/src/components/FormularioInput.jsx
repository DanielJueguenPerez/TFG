import { useState } from 'react';

export default function FormularioInput({
    campos,
    textoBoton,
    valoresIniciales = {},
    onSubmit
}) {
        const [valores, setValores] = useState(valoresIniciales);
        const [errores, setErrores] = useState({});

        const handleChange = (e) => {
            setValores({
                ...valores,
                [e.target.name]: e.target.value,
            });
        }


    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};

        campos.forEach(campo => {
            if (!valores[campo.nombre] || valores[campo.nombre].trim()=== ''){
                errors[campo.nombre] = 'Este campo es obligatorio';
            }
        })

        if (!valores.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email)) {
            errors.email = 'Correo electrónico no válido';
        }

        if (valores.password && valores.password.length < 8){
            errors.password = 'La contraseña debe tener al menos 8 caracteres'
        }

        if (valores.password && valores.password2 && valores.password !== valores.password2){
            errors.password2 = 'Las contraseñas no coinciden'
        }

        if (Object.keys(errors).length > 0){
            setErrores(errors);
            return;
        }

        setErrores({});
        onSubmit(valores);
    };

    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {campos.map((campo) => 
                <div key={campo.nombre}>
                    <label htmlFor={campo.nombre} className="block text-sm font-medium text-gray-700">
                        {campo.etiqueta}
                    </label>
                    <input
                        type={campo.tipo}
                        name={campo.nombre}
                        id={campo.nombre}
                        value={valores[campo.nombre] || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={campo.requerido ?? true}
                    />
                    {errores[campo.nombre] && (
                        <p className='text-red-500 text-sm'>{errores[campo.nombre]}</p>
                    )}
                </div>
            )}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                {textoBoton}
            </button>
        </form>
    );
}
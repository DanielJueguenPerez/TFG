import { useNavigate } from 'react-router-dom';
import FormularioInput from '../components/FormularioInput';
import { registroUsuario } from '../api/auth'
import { useUser } from '../context/UserContext';

export default function RegistroPage() {
    const navigate = useNavigate();
    const { login } = useUser();

    const camposRegistro = [
        {nombre: 'username', tipo: 'text', etiqueta: 'Nombre de usuario'},
        {nombre: 'password', tipo: 'password', etiqueta: 'Contraseña'},
        {nombre: 'password2', tipo: 'password', etiqueta: 'Confirmar contraseña'},
        {nombre: 'email', tipo: 'email', etiqueta: 'Correo electrónico'},
        {nombre: 'nombre', tipo: 'text', etiqueta: 'Nombre'},
        {nombre: 'apellidos', tipo: 'text', etiqueta: 'Apellidos'},
        {nombre: 'DNI', tipo: 'text', etiqueta: 'DNI'},
    ];

    const handleRegistro = async (datos) => {
        try {
            const data = await registroUsuario(datos);
            localStorage.setItem('token', data.token);
            login(data.token, data.user.username);
            alert('Registro exitoso');
            navigate ('/');
        } catch (error){
            console.error('Error al registrar: ', error);
            
            if (error.response && error.response.data){
                const errores = error.response.data;

                const mensaje = Object.entries(errores).map(([campo, mensajes]) => {
                    if(Array.isArray(mensajes)) {
                        return `${campo}: ${mensajes.join(', ')}`;
                    }
                    return `${campo}: ${mensajes}`;
                })
                .join('\n')
                alert(`No se pudo completar el registro:\n\n${mensaje}`);
            } else {
                alert('Error desconocido al registrarse');
            }
        }
    };

    return(
        <div className="max-w-md mx-auto mt-10 px-4">
            <h2 className="text-2xl font-bold text-center mb-6">Regístrate</h2>
            <FormularioInput
                campos={camposRegistro}
                textoBoton="Registrarse"
                onSubmit={handleRegistro}
            />
        </div>
    );
}
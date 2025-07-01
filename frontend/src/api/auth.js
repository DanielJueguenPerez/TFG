import axiosAuthenticate from '../utils/axiosAuthenticate';
import axiosPublic from '../utils/axiosPublic';

export const registroUsuario = async (datos) => {
    const response = await axiosPublic.post('/usuario/registro/', datos);
    return response.data;
}

export const loginUsuario = async(datos) => {
    const response = await axiosPublic.post('/usuario/login/', datos);
    return response.data;
}

export const logoutUsuario = async () => {
    await axiosAuthenticate.post('/usuario/logout/');
}

export const verPerfilUsuario = async () => {
    const response = await axiosAuthenticate.get('/usuario/ver-perfil/');
    return response.data;
}

export const editarPerfilUsuario = async (datos) => {
    const response = await axiosAuthenticate.patch('/usuario/editar-perfil/', datos);
    return response.data;
}

export const cambiarPassword = async (datos) => {
    const response = await axiosAuthenticate.patch('/usuario/cambiar-password/', datos);
    return response.data;
}

export const verComentariosPropios = async (pagina = 1) => {
    const response = await axiosAuthenticate.get(`/usuario/comentarios/?page=${pagina}`);
    return response.data;
}
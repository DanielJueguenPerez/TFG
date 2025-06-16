import axiosInstance from '../utils/axiosInstance'

export const registroUsuario = async (datos) => {
    const response = await axiosInstance.post('/usuario/registro/', datos);
    return response.data;
}

export const loginUsuario = async(datos) => {
    const response = await axiosInstance.post('/usuario/login/', datos);
    return response.data;
}

export const logoutUsuario = async () => {
    await axiosInstance.post('/usuario/logout/');
}
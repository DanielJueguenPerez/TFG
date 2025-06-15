import axiosInstance from '../utils/axiosInstance'

export const registroUsuario = async (datos) => {
    const response = await axiosInstance.post('/usuario/registro/', datos);
    return response.data;
}
import axiosInstance from '../utils/axiosInstance'

export const buscarAsignaturas = async (pagina = 1, clave = '') => {
    const response = await axiosInstance.get('/asignaturas', {
        params: {page: pagina, search: clave},
    });
    return response.data
};
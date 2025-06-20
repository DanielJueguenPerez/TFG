import axiosPublic from '../utils/axiosPublic'

export const buscarAsignaturas = async (pagina = 1, clave = '') => {
    const response = await axiosPublic.get('/asignaturas', {
        params: {page: pagina, search: clave},
    });
    return response.data
};
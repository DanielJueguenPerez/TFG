import axiosPublic from '../utils/axiosPublic'

export const verGrados = async (pagina = 1) => {
    const response = await axiosPublic.get(`/grados/?page=${pagina}`);
    return response.data;
}
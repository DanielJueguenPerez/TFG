import axiosInstance from '../utils/axiosInstance'

export const verGrados = async (pagina = 1) => {
    const response = await axiosInstance.get(`/grados/?page=${pagina}`);
    return response.data;
}
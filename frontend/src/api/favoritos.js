import axiosAuthenticate from '../utils/axiosAuthenticate';

export const verFavoritos = async (pagina = 1) => {
    const response = await axiosAuthenticate.get(`/favoritos/lista/?page=${pagina}`);
    return response.data;
}

export const agregarFavorito = async (id_asignatura) => {
    const response = await axiosAuthenticate.post(`/favoritos/agregar/${id_asignatura}/`);
    return response.data;
}

export const eliminarFavorito = async (id_favorito) => {
    return await axiosAuthenticate.delete(`/favoritos/eliminar/${id_favorito}/`);
}   
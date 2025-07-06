import axiosAuthenticate from "../utils/axiosAuthenticate";

export const verFavoritos = async (url = null) => {
  const baseUrl = "/favoritos/lista/";

  const response = await axiosAuthenticate.get(url || baseUrl);
  return {
    results: response.data.results,
    next: response.data.next,
    previous: response.data.previous,
    count: response.data.count,
  };
};

export const agregarFavorito = async (id_asignatura) => {
  const response = await axiosAuthenticate.post(
    `/favoritos/agregar/${id_asignatura}/`
  );
  return response.data;
};

export const eliminarFavorito = async (id_favorito) => {
  return await axiosAuthenticate.delete(`/favoritos/eliminar/${id_favorito}/`);
};

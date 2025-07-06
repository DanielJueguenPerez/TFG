import axiosPublic from "../utils/axiosPublic";

export const buscarAsignaturas = async (url = null, clave = '') => {
  const baseUrl = '/asignaturas/';

  const response = await axiosPublic.get(url || baseUrl, {
    params: url ? {} : { search: clave },
  });
  return {
    results: response.data.results,
    next: response.data.next,
    previous: response.data.previous,
    count: response.data.count,
  };
};

export const verDetallesAsignatura = async (id) => {
  const response = await axiosPublic.get(`/asignaturas/${id}`);
  return response.data;
};

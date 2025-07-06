import axiosAuthenticate from "../utils/axiosAuthenticate";
import axiosPublic from "../utils/axiosPublic";

export const crearComentario = async (id_asignatura, texto) => {
  const response = await axiosAuthenticate.post(
    `/comentarios/${id_asignatura}/nuevo/`,
    { texto }
  );
  return response.data;
};

export const verComentarios = async (id_asignatura, url = null) => {
  const baseUrl = `/comentarios/${id_asignatura}/`;

  const response = await axiosPublic.get(url || baseUrl);

  return {
    results: response.data.results,
    next: response.data.next,
    previous: response.data.previous,
    count: response.data.count,
  };
};

export const editarComentario = async (id_comentario, texto) => {
  const response = await axiosAuthenticate.put(
    `/comentarios/editar/${id_comentario}/`,
    { texto }
  );
  return response.data;
};

export const eliminarComentario = async (id_comentario) => {
  const response = await axiosAuthenticate.delete(
    `/comentarios/eliminar/${id_comentario}/`
  );
  return response.data;
};

export const verComentario = async (id_comentario) => {
  const response = await axiosAuthenticate.get(
    `/comentarios/ver/${id_comentario}/`
  );
  return response.data;
};

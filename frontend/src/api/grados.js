import axiosPublic from "../utils/axiosPublic";

export const verGrados = async (url = null) => {
  const baseUrl = "/grados/";

  const response = await axiosPublic.get(url || baseUrl);
  return {
    results: response.data.results,
    next: response.data.next,
    previous: response.data.previous,
    count: response.data.count,
  };
};

export const verDetallesGrado = async (id) => {
  const response = await axiosPublic.get(`/grados/${id}`);
  return response.data;
};

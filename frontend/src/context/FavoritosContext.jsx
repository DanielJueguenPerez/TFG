import { createContext, useContext, useState, useEffect } from "react";
import {
  verFavoritos,
  agregarFavorito,
  eliminarFavorito,
} from "../api/favoritos";
import { useUser } from "./UserContext";

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const { estaLogueado } = useUser();

  useEffect(() => {
    const cargarFavoritos = async () => {
      if (!estaLogueado) return;

      try {
        const data = await verFavoritos();
        setFavoritos(data);
      } catch (error) {
        console.error("Error al cargar los favoritos", error);
      }
    };

    cargarFavoritos();
  }, [estaLogueado]);

  const esFavorita = (id_asignatura) =>
    favoritos.some(
      (favorito) => favorito?.id_asignatura === id_asignatura
    );

  const toggleFavorito = async (id_asignatura) => {
    const favorito = favoritos.find(
      (fav) => fav.id_asignatura === id_asignatura
    );

    try {
      if (favorito) {
        await eliminarFavorito(favorito.id_favorito);
        setFavoritos((prev) =>
          prev.filter((fav) => fav.id_asignatura !== id_asignatura)
        );
      } else {
        const nuevoFavorito = await agregarFavorito(id_asignatura);
        if (nuevoFavorito?.id_asignatura) {
          setFavoritos((prev) => [...prev, nuevoFavorito]);
        } else {
          console.error("Favorito inválido al agregar", nuevoFavorito);
        }
      }
    } catch (error) {
      console.error("Error al agregar/eliminar favorito", error);
    }
  };

  return (
    <FavoritosContext.Provider
      value={{ favoritos, esFavorita, toggleFavorito }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => useContext(FavoritosContext);

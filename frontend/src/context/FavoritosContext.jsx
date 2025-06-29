import { createContext, useContext, useState, useEffect } from "react";
import {
  verFavoritos,
  agregarFavorito,
  eliminarFavorito,
} from "../api/favoritos";
import { useUser } from "./UserContext";
import toast from 'react-hot-toast'

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const { estaLogueado } = useUser();

  useEffect(() => {
    if (!estaLogueado) {
      setFavoritos([]);
      return;
    }

    const cargarFavoritos = async () => {
      try {
        let pagina = 1;
        let todos = [];

        while (true) {
          const data = await verFavoritos(pagina);
          todos = todos.concat(data.results);
          if(!data.next) break;
          pagina++;
        }
        setFavoritos(todos);
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      }
    };

    cargarFavoritos();
  }, [estaLogueado]);

  const esFavorita = (id_asignatura) =>
    Array.isArray(favoritos) &&
    favoritos.some(
      (favorito) => favorito.id_asignatura === id_asignatura
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
        toast.success("Asignatura eliminada de favoritos 🔴")
      } else {
        const nuevoFavorito = await agregarFavorito(id_asignatura);
        if (nuevoFavorito?.id_asignatura) {
          setFavoritos((prev) => [...prev, nuevoFavorito]);
        }
        toast.success("Asignatura añadida a favoritos ✅")
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

import { createContext, useContext, useState } from "react";
import { logoutUsuario } from "../api/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  )
  const [nombreUsuario, setNombreUsuario] = useState(
    localStorage.getItem("nombreUsuario") || null
  );

  const estaLogueado = !!token;

  const login = (newToken, userInfo) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userInfo))
    localStorage.setItem("nombreUsuario", userInfo.username);
    setToken(newToken);
    setUser(userInfo);
    setNombreUsuario(userInfo.username);
  };

  const logout = async () => {
    try {
      await logoutUsuario();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("nombreUsuario");
    setToken(null);
    setUser(null);
    setNombreUsuario(null);
  };

  return (
    <UserContext.Provider
      value={{ token, user, nombreUsuario, login, logout, estaLogueado }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

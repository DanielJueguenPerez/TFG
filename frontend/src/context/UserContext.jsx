import { createContext, useContext, useState } from "react";
import { logoutUsuario } from "../api/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  )

  const estaLogueado = !!token;

  const login = (newToken, userInfo) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userInfo))
    setToken(newToken);
    setUser(userInfo);
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
  };

  return (
    <UserContext.Provider
      value={{ token, user, login, logout, estaLogueado }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

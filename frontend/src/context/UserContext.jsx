import { createContext, useContext, useEffect, useState} from 'react';
import { logoutUsuario } from '../api/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [nombreUsuario, setNombreUsuario] = useState(localStorage.getItem('nombreUsuario') || null);

    const login = (newToken, nombre) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('nombreUsuario', nombre);
        setToken(newToken);
        setNombreUsuario(nombre);
    };

    const logout = async () => {
        try {
            await logoutUsuario();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('nombreUsuario');
        setToken(null);
        setNombreUsuario(null);
    };

    return(
        <UserContext.Provider value={{token, nombreUsuario, login, logout}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
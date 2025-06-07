import { createContext, useContext, useEffect, useState} from 'react';

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

    const logout = () => {
        localStorage.remoteItem('token');
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


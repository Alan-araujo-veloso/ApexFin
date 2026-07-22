import { createContext,useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface AuthContextType {
    user: { logged: boolean } | null;
    login: (email: string, password: string) => Promise<void> ;
    logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<{ logged: boolean } | null>(null);

    useEffect (() =>{
        const token = localStorage.getItem('token');
        if (token) {
            setUser({logged: true });
        }
    }, []);

   const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login',{email, password});
  localStorage.setItem('token', response.data.token);
  setUser({ logged: true });
};

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    
    );
}


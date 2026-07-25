import { createContext,useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface UserData {
    name: string;
    email: string;
    logged: boolean;
}
interface AuthContextType {
    user: UserData | null;
    login: (email: string, password: string) => Promise<void> ;
    logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState< UserData | null>(null);

    useEffect (() =>{
        const token = localStorage.getItem('token');
        const savedName = localStorage.getItem('userName');
        const savedEmail = localStorage.getItem('userEmail');
        
        if (token) {
            setUser({
                name: savedName || 'Usuário',
                email: savedEmail || '',
                logged: true
            });
        }
    }, []);

   const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login',{email, password});
  
  const { token, user } = response.data;
const userName = user?.name;

  localStorage.setItem('token', token);
  if (userName) {
    localStorage.setItem('userName', userName);
  }

  setUser({
    name: userName || 'Usuário',
    email: email,
    logged: true 
    });
};
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setUser(null);
}

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    
    );
}


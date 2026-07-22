import { useState, useContext, ChangeEvent } from 'react'; 
import { AuthContext } from '../contexts/Authcontext';
import "../../style.css";
import {useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const { login } = useContext(AuthContext);

const handleLogin = async () => {
    try {
        await login(email, password);
        alert('Login realizado com sucesso!');
        navigate('/dashboard');
    } catch (error) {
alert('Erro ao realizar login. Verifique suas credenciais.');
    }
    };

    return (
        <div className='Login-container'>
        <h1>Login</h1>

<input
type="email"
placeholder="Seu email"
value={email}
onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Sua senha"
value={password}
onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
/>

<button onClick={handleLogin}> Entrar</button>
        </div>
    );
}
import React, { useState, useContext, type ChangeEvent } from 'react';
import { AuthContext } from '../contexts/Authcontext';
import "../../style.css";
import {useNavigate } from 'react-router-dom';
import axios from 'axios';

export function Login() {
const navigate = useNavigate();
const [isRegistering,setIsRegistering] = useState(false);
const [name, setName] = useState('')
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const[error, setError] = useState('');
const[successMessage, setSuccessMessage] = useState('');
const [loading, setLoading] = useState(false);

const { login } = useContext(AuthContext);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleLoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);


    try {
        if (isRegistering) {
            //cadastro rota
            await axios.post(`${API_URL}/auth/register`, { name, email, password });
        setSuccessMessage('Conta criada com sucesso! Faça o login.');
        setIsRegistering(false);
        setPassword('');
        } else {
            // rota login
            await login(email, password);

            
        navigate('/dashboard');
    } 
}catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao processar a solicitação. Verifique suas credenciais.');
    } finally {
        setLoading(false);
    }
    };

    return (
        <div className='Login-container'>
            <div className="login-card">
        <h1>{isRegistering ? 'Criar Conta' : 'Login'}</h1>

{error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}> {error}</div>}
{successMessage && <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

<form onSubmit={handleLoSubmit} style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
{isRegistering && (
    <input
    type="text"
    placeholder="Seu nome completo"
    value={name}
    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
required={isRegistering}
/>
)}
<input
type="email"
placeholder="Seu email"
value={email}
onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
required
/>

<input
type="password"
placeholder="Sua senha"
value={password}
onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
required
/>

<button type="submit" className="login-btn" disabled={loading}>
    {loading ? 'Carregando...' : (isRegistering ? 'Cadastrar' : 'Entrar')}
</button>
</form>

<div style={{ marginTop: '15px', textAlign: 'center' }}>
    <button
    onClick={() => {
        setIsRegistering(!isRegistering);
        setError('');
        setSuccessMessage('');
    }}
    style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'white'}}
>
    {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Crie agora'}
    </button>
    </div>
    </div>
</div>
    );
}

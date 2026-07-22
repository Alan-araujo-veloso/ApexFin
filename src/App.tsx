import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

export default function App() {

    return (
        <BrowserRouter>
    <div className="App">
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        </div>
        </BrowserRouter>
    
    );
}
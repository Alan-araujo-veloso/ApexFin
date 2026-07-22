"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = Login;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Authcontext_1 = require("../contexts/Authcontext");
require("../../style.css");
const react_router_dom_1 = require("react-router-dom");
function Login() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const { login } = (0, react_1.useContext)(Authcontext_1.AuthContext);
    const handleLogin = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield login(email, password);
            alert('Login realizado com sucesso!');
            navigate('/dashboard');
        }
        catch (error) {
            alert('Erro ao realizar login. Verifique suas credenciais.');
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: 'Login-container', children: [(0, jsx_runtime_1.jsx)("h1", { children: "Login" }), (0, jsx_runtime_1.jsx)("input", { type: "email", placeholder: "Seu email", value: email, onChange: (e) => setEmail(e.target.value) }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Sua senha", value: password, onChange: (e) => setPassword(e.target.value) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleLogin, children: " Entrar" })] }));
}

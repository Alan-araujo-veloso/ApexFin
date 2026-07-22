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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthContext = void 0;
exports.AuthProvider = AuthProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const api_1 = __importDefault(require("../services/api"));
exports.AuthContext = (0, react_1.createContext)({});
function AuthProvider({ children }) {
    const [user, setUser] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ logged: true });
        }
    }, []);
    const login = (email, password) => __awaiter(this, void 0, void 0, function* () {
        const response = yield api_1.default.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        setUser({ logged: true });
    });
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };
    return ((0, jsx_runtime_1.jsx)(exports.AuthContext.Provider, { value: { user, login, logout }, children: children }));
}

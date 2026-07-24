"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = Dashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const api_1 = __importDefault(require("../services/api"));
function Dashboard() {
    const [transactions, setTransactions] = (0, react_1.useState)([]);
    const [description, setDescription] = (0, react_1.useState)("");
    const [amount, setAmount] = (0, react_1.useState)("");
    const [type, setType] = (0, react_1.useState)("income");
    async function loadTransactions() {
        try {
            const response = await api_1.default.get('transactions');
            setTransactions(response.data.transactions || response.data || []);
        }
        catch (error) {
            console.error("Erro ao carregar:", error);
        }
    }
    (0, react_1.useEffect)(() => {
        const token = localStorage.getItem("token");
        if (token) {
            loadTransactions();
        }
    }, []);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const progress = Math.min(Math.round((balance > 0 ? balance / 5000 * 100 : 0)), 100);
    async function handleAdd(e) {
        e.preventDefault();
        try {
            await api_1.default.post('transactions', {
                description: description,
                amount: Number(amount),
                type: type
            });
            setDescription("");
            setAmount("");
            loadTransactions();
        }
        catch (error) {
            console.error("Erro detalhado:", error.response?.data || error);
            alert("Erro ao salvar: " + (error.response?.data?.message || error.message));
        }
    }
    async function deleteTransaction(id) {
        if (confirm('Tem certeza que deseja apagar esta transação?')) {
            try {
                await api_1.default.delete(`transactions/${id}`);
                loadTransactions();
            }
            catch (error) {
                console.error("Erro ao deletar:", error);
            }
        }
    }
    return ((0, jsx_runtime_1.jsxs)("main", { className: "app-container", children: [(0, jsx_runtime_1.jsxs)("header", { className: "app-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "user-info", children: [(0, jsx_runtime_1.jsx)("span", { children: "Ol\u00E1, bem vindo de volta" }), (0, jsx_runtime_1.jsx)("h2", { children: "Alan Gabriel" })] }), (0, jsx_runtime_1.jsx)("div", { className: "user-avatar", children: "A" })] }), (0, jsx_runtime_1.jsxs)("section", { className: "balance-card", children: [(0, jsx_runtime_1.jsx)("p", { className: "card-label", children: "Saldo Total Dispon\u00EDvel" }), (0, jsx_runtime_1.jsxs)("h1", { className: "card-value", children: ["R$ ", balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "card-stats", children: [(0, jsx_runtime_1.jsxs)("div", { className: "stat-item income", children: [(0, jsx_runtime_1.jsx)("span", { children: " \u25B2Entradas " }), (0, jsx_runtime_1.jsxs)("p", { children: [" R$ ", totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 }), " "] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-item expense", children: [(0, jsx_runtime_1.jsx)("span", { children: " \u25BCSa\u00EDdas " }), (0, jsx_runtime_1.jsxs)("p", { children: [" R$ ", totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 }), " "] })] })] })] }), (0, jsx_runtime_1.jsxs)("section", { className: "goals-section", children: [(0, jsx_runtime_1.jsx)("h3", { children: " Minhas Metas" }), (0, jsx_runtime_1.jsxs)("div", { className: "goal-item", children: [(0, jsx_runtime_1.jsxs)("div", { className: "goal-info", children: [(0, jsx_runtime_1.jsx)("span", { children: " Reserva de Emerg\u00EAncia" }), (0, jsx_runtime_1.jsxs)("div", { id: "goal-percentage", children: [progress, "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "progress-bar-bg", children: (0, jsx_runtime_1.jsx)("div", { className: "progress-bar-fil", style: { width: `${progress}%` } }) })] })] }), (0, jsx_runtime_1.jsxs)("section", { className: "transaction-form-section", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Nova Transa\u00E7\u00E3o" }), (0, jsx_runtime_1.jsxs)("form", { id: "transaction-form", onSubmit: handleAdd, children: [(0, jsx_runtime_1.jsx)("input", { type: "text", id: "desc", value: description, onChange: e => setDescription(e.target.value), placeholder: "Ex: Sal\u00E1rio...", required: true }), (0, jsx_runtime_1.jsx)("input", { type: "number", id: "amount", value: amount, onChange: e => setAmount(e.target.value), step: "0.01", placeholder: "valor (R$)", required: true }), (0, jsx_runtime_1.jsxs)("select", { id: "type", value: type, onChange: e => setType(e.target.value), children: [(0, jsx_runtime_1.jsx)("option", { value: "income", children: " Entrada (Ganho) " }), (0, jsx_runtime_1.jsx)("option", { value: "expense", children: " Sa\u00EDda (Gasto) " })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", children: " Adicionar Registro " })] })] }), (0, jsx_runtime_1.jsxs)("section", { className: "history-section", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Hist\u00F3rico de Atividades" }), (0, jsx_runtime_1.jsx)("ul", { className: "transaction-list", id: "transaction-list-container", children: transactions.map((t) => ((0, jsx_runtime_1.jsxs)("li", { className: "transaction-item", style: { borderLeftColor: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }, children: [(0, jsx_runtime_1.jsx)("span", { children: t.description.charAt(0).toUpperCase() + t.description.slice(1) }), (0, jsx_runtime_1.jsxs)("div", { className: "transaction-values", children: [(0, jsx_runtime_1.jsxs)("strong", { className: t.type === 'income' ? 'text-success' : 'text-danger', children: [t.type === 'income' ? '+' : '-', " R$ ", t.amount.toFixed(2)] }), (0, jsx_runtime_1.jsx)("button", { className: "delete-btn", onClick: () => deleteTransaction(t._id), children: "\u274C" })] })] }, t._id))) })] }), (0, jsx_runtime_1.jsx)("footer", { className: "app-footer", children: (0, jsx_runtime_1.jsx)("p", { children: "\u00A9 2026 Alan Gabriel. Todos os direitos reservados." }) })] }));
}

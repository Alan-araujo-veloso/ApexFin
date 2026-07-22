import { useState, useEffect, FormEvent } from "react";
import {useNavigate } from "react-router"
import api from "../services/api";

export function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  async function loadTransactions() {
    try { 
      const response = await api.get('transactions');
      setTransactions(response.data.transactions || response.data || []);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
    loadTransactions();
   }
   }, []);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const progress = Math.min(Math.round((balance > 0 ? balance / 5000 * 100 : 0)), 100);

 async function handleAdd(e: FormEvent) {
    e.preventDefault();

    try {
      await api.post('transactions', {
        description: description,
          amount: Number(amount),
           type: type
        });
      
      setDescription("");
      setAmount("");
      loadTransactions();
    } catch (error: any ) {
      console.error("Erro detalhado:", error.response?.data || error);
      alert("Erro ao salvar: " + (error.response?.data?.message || error.message));
    }
  }

  async function deleteTransaction(id: string) {
    if (confirm('Tem certeza que deseja apagar esta transação?')) {
      try {
        await api.delete(`transactions/${id}`);
        loadTransactions();
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  }

  return (
    <main className="app-container">
      <header className="app-header">
        <div className="user-info">
          <span>Olá, bem vindo de volta</span>
          <h2>Alan Gabriel</h2>
        </div>
        <div className="user-avatar">A</div>
      </header>

      <section className="balance-card">
        <p className="card-label">Saldo Total Disponível</p>
        <h1 className="card-value">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h1>
        <div className="card-stats">
          <div className="stat-item income">
            <span> ▲Entradas </span>
            <p> R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} </p>
          </div>
          <div className="stat-item expense">
            <span> ▼Saídas </span>
            <p> R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} </p>
          </div>
        </div>
      </section>

      <section className="goals-section">
        <h3> Minhas Metas</h3>
        <div className="goal-item">
          <div className="goal-info">
            <span> Reserva de Emergência</span>
            <div id="goal-percentage">{progress}%</div>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fil" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </section>

      <section className="transaction-form-section">
        <h3>Nova Transação</h3>
        <form id="transaction-form" onSubmit={handleAdd}>
          <input type="text" id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Salário..." required />
          <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} step="0.01" placeholder="valor (R$)" required />
          <select id="type" value={type} onChange={e => setType(e.target.value)}>
            <option value="income"> Entrada (Ganho) </option>
            <option value="expense"> Saída (Gasto) </option>
          </select>
          <button type="submit"> Adicionar Registro </button>
        </form>
      </section>

      <section className="history-section">
        <h3>Histórico de Atividades</h3>
        <ul className="transaction-list" id="transaction-list-container">
          {transactions.map((t) => (
            <li key={t._id} className="transaction-item" style={{ borderLeftColor: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
              <span>{t.description.charAt(0).toUpperCase() + t.description.slice(1)}</span>
              <div className="transaction-values">
                <strong className={t.type === 'income' ? 'text-success' : 'text-danger'}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                </strong>
                <button className="delete-btn" onClick={() => deleteTransaction(t._id)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="app-footer">
        <p>&copy; 2026 Alan Gabriel. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
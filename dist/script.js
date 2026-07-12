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
let transactions = [];
const FINANCIAL_GOAL = 5000;
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocalhost
    ? 'http://localhost:5000/api/transactions'
    : 'https://apexfin-backend.onrender.com/api/transactions';
const successSound = new Audio('./dist/audio/click.mp3');
const balanceElement = document.getElementById('total-balance');
const incomeElement = document.getElementById('total-income');
const expenseElement = document.getElementById('total-expense');
const formElement = document.getElementById('transaction-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const listContainer = document.getElementById('transaction-list-container');
const goalProgressBarFill = document.getElementById('goal-progress');
const goalPercentageElement = document.getElementById('goal-percentage');
function updateBalances() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, cur) => acc + cur.amount, 0);
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, cur) => acc + cur.amount, 0);
    const currentBalance = totalIncome - totalExpense;
    balanceElement.textContent = currentBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    incomeElement.textContent = totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    expenseElement.textContent = totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    updateGoalProgress(currentBalance);
}
function updateGoalProgress(currentBalance) {
    const positiveBalance = currentBalance < 0 ? 0 : currentBalance;
    let percentage = Math.round((positiveBalance / FINANCIAL_GOAL) * 100);
    if (percentage > 100)
        percentage = 100;
    goalPercentageElement.textContent = `${percentage}%`;
    goalProgressBarFill.style.width = `${percentage}%`;
}
function renderTransactions() {
    listContainer.innerHTML = '';
    transactions.forEach((transaction) => {
        const li = document.createElement('li');
        li.classList.add('transaction-item');
        const descricaoFormatada = transaction.description.charAt(0).toUpperCase() + transaction.description.slice(1).toLowerCase();
        const FormattedAmount = transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if (transaction.type === 'income') {
            li.style.borderLeftColor = 'var(--success)';
            li.innerHTML = `
    <span>${descricaoFormatada}</span> 
    <div style="display: flex; align-items: center; gap: 12px;">
    <strong style="color: var(--success)">+ ${FormattedAmount}</strong>
<button class="delete-btn" style="background: none; border: none; cursor: pointer;" onclick="deleteTransaction('${transaction._id}')">❌</button>
    </div>
    `;
        }
        else {
            li.style.borderLeftColor = 'var(--danger)';
            li.innerHTML = `
    <span>${descricaoFormatada}</span>
     <div style="display: flex; align-items: center; gap: 12px;">
    <strong style="color: var(--danger)">- ${FormattedAmount}</strong>
     <button class="delete-btn" style="background: none; border: none; cursor: pointer;" onclick="deleteTransaction('${transaction._id}')>"❌</button>
    </div>
    `;
        }
        listContainer.appendChild(li);
    });
}
window.deleteTransaction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (confirm('Tem ceerteza que deseja apagar essa transação?')) {
        try {
            const response = yield fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                yield loadTransactions();
            }
            else {
                alert('Erro ao deletar a transação no servidor.');
            }
        }
        catch (error) {
            alert('Falha na comunicação com o banco de dados.');
        }
    }
});
formElement.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const transactionData = {
        description: descInput.value.trim(),
        amount: parseFloat(amountInput.value),
        type: typeSelect.value
    };
    try {
        const response = yield fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        });
        if (response.ok) {
            try {
                successSound.currentTime = 0;
                yield successSound.play();
            }
            catch (audioError) {
                console.log('Navegador barrou o som ou o caminho mudou na vercel:', audioError);
            }
            yield loadTransactions();
            formElement.reset();
        }
    }
    catch (error) {
        alert('Falha na comunicação de rede com o banco de dados.');
    }
}));
renderTransactions();
updateBalances();
formElement.reset();
function loadTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(API_URL);
            const data = yield response.json();
            if (Array.isArray(data)) {
                transactions = data;
            }
            else if (data && Array.isArray(data.transactions)) {
                transactions = data.transactions;
            }
            else if (data && Array.isArray(data.data)) {
                transactions = data.data;
            }
            else {
                transactions = [];
            }
            renderTransactions();
            updateBalances();
        }
        catch (error) {
            console.error('Erro ao conectar com o MongoDB:', error);
        }
    });
}
loadTransactions();

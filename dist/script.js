"use strict";
/**
* Project: ApexFix - Finanças e Metas
* Author: Alan Gabriel
* Repository: https://github.com/Alan-araujo-veloso
* Copyright © 2026. All rights reserved.
*/
let transactions = [];
const FINANCIAL_GOAL = 5000;
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
        const FormattedAmount = transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if (transaction.type === 'income') {
            li.style.borderLeftColor = 'var(--success)';
            li.innerHTML = `<span>${transaction.description}</span> <strong style="color: var(--success)">+ ${FormattedAmount}</strong>`;
        }
        else {
            li.style.borderLeftColor = 'var(--danger)';
            li.innerHTML = `<span>${transaction.description}</span> <strong style="color: var(--danger)"> ${FormattedAmount}</strong>`;
        }
        listContainer.appendChild(li);
    });
}
formElement.addEventListener('submit', (event) => {
    event.preventDefault();
    const newTransaction = {
        id: Date.now(),
        description: descInput.value.trim(),
        amount: parseFloat(amountInput.value),
        type: typeSelect.value
    };
    transactions.unshift(newTransaction);
    renderTransactions();
    updateBalances();
    formElement.reset();
});

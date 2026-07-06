interface Transaction {
    _id?: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
}

let transactions: Transaction[] = [];

const FINANCIAL_GOAL: number = 5000;
const API_URL = 'https://apexfin-backend.onrender.com/api/transactions';

const balanceElement = document.getElementById('total-balance') as HTMLHeadingElement;
const incomeElement = document.getElementById('total-income') as HTMLParagraphElement;
const expenseElement = document.getElementById('total-expense') as HTMLParagraphElement;
const formElement = document.getElementById('transaction-form') as HTMLFormElement;
const descInput = document.getElementById('desc') as HTMLInputElement;
const amountInput = document.getElementById('amount') as HTMLInputElement;
const typeSelect = document.getElementById('type') as HTMLSelectElement;
const listContainer = document.getElementById('transaction-list-container') as HTMLDataListElement;
const goalProgressBarFill = document.getElementById('goal-progress') as HTMLDivElement;
const goalPercentageElement = document.getElementById('goal-percentage') as HTMLDivElement;

function updateBalances(): void {
    const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, cur) => acc + cur.amount, 0) 
    const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, cur) => acc + cur.amount, 0)
 
    const currentBalance = totalIncome - totalExpense;
balanceElement.textContent = currentBalance.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

incomeElement.textContent = totalIncome.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

expenseElement.textContent = totalExpense.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

updateGoalProgress(currentBalance);
}

function updateGoalProgress(currentBalance: number): void {
    const positiveBalance = currentBalance < 0 ? 0 : currentBalance;

    let percentage = Math.round((positiveBalance / FINANCIAL_GOAL) * 100);
if (percentage > 100) percentage = 100;

goalPercentageElement.textContent = `${percentage}%`;
goalProgressBarFill.style.width = `${percentage}%`;
}

function renderTransactions(): void {
listContainer.innerHTML = '';
transactions.forEach((transaction) => {
const li = document.createElement('li');
li.classList.add('transaction-item');

const FormattedAmount = transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});

if (transaction.type === 'income') {
    li.style.borderLeftColor = 'var(--success)';
    li.innerHTML = `<span>${transaction.description}</span> <strong style="color: var(--success)">+ ${FormattedAmount}</strong>`; 
}  

else {
    li.style.borderLeftColor =  'var(--danger)';
    li.innerHTML = `<span>${transaction.description}</span> <strong style="color: var(--danger)"> ${FormattedAmount}</strong>`;
}

listContainer.appendChild(li);
});
}

formElement.addEventListener('submit', async (event: SubmitEvent) => {
    event.preventDefault();

    const transactionData = {

        description: descInput.value.trim(),
        amount: parseFloat(amountInput.value),
        type: typeSelect.value as 'income' | 'expense'
};
try {
    const response = await fetch(API_URL, {
        method: 'POST',
      headers: {
'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionData)
      });
      if (response.ok) {
        await loadTransactions();
        formElement.reset();
      }
    }
      catch (error) {
        alert('Falha na comunicação de rede com o banco de dados.');
      }
    });

renderTransactions();
updateBalances();

formElement.reset();

async function loadTransactions(): Promise<void> {
    try {
        const response = await fetch(API_URL);
        transactions = await response.json();

        renderTransactions();
        updateBalances();
    } catch (error) {
        console.error('Erro ao conectar com o MongoDB:', error);

    }
    }
    loadTransactions();


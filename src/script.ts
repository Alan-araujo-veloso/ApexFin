interface Transaction {
    _id?: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
}

let transactions: Transaction[] = [];

const FINANCIAL_GOAL: number = 5000;

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_URL = isLocalhost
? 'http://localhost:5000/api/transactions'
: 'https://apexfin-backend.onrender.com/api/transactions';

const successSound = new Audio('./dist/audio/click.mp3');

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

const descricaoFormatada = transaction.description.charAt(0).toUpperCase() + transaction.description.slice(1).toLowerCase();
const FormattedAmount = transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});

const isIncome = transaction.type === 'income';
if (transaction.type === 'income'){
li.style.borderLeftColor = isIncome ? 'var(--success)' : 'var(--danger)';

li.innerHTML = `
<span>${descricaoFormatada}</span>
<div class="transaction-values">
    <strong class="${isIncome ? 'text-success' : 'text-danger'}">
${isIncome ? '+' : '-'} ${FormattedAmount}
    </strong>
<button class="delete-btn" onclick="deleteTransaction('${transaction._id}')">❌</button>
</div>
`;
} else {
li.style.borderLeftColor =  'var(--danger)';
li.innerHTML = `
<span>${descricaoFormatada}</span>
<div class="transaction-values">
    <strong class="text-danger">- ${FormattedAmount}</strong>
<button class="delete-btn" onclick="deleteTransaction('${transaction._id}')">❌</button>

</div>
`;
}

listContainer.appendChild(li);
});
}

(window as any).deleteTransaction = async (id: string): Promise<void> => {
    if(confirm('Tem certeza que deseja apagar essa transação?')) {
try {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        await loadTransactions();
    } else {
        alert('Erro ao deletar a transação no servidor.');
    }
} catch (error) {
    alert('Falha na comunicação com o banco de dados.');
}
    }
};

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
        try {
        successSound.currentTime = 0;
  await successSound.play();
  } catch (audioError) {
    console.log('Navegador barrou o som ou o caminho mudou na vercel:', audioError);
  }
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
        const data = await response.json();

        if (Array.isArray(data)) {
transactions = data;
        } else if (data && Array.isArray(data.transactions)) {
         transactions = data.transactions;   
        } else if (data && Array.isArray(data.data)) {
            transactions = data.data;
        } else {
            transactions =[];
        }
        
        renderTransactions();
        updateBalances();
    } catch (error) {
        console.error('Erro ao conectar com o MongoDB:', error);

    }
    }
    loadTransactions();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker ativo!', reg))
        .catch(err => console.log('Erro ao registrar SW:', err));
    });
}

const Modal = {
    open() {
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')

    },
    close() {
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Transaction = {
    all: [{

        description: 'Luz',
        amount: -50001,
        date: '23/01/2021'
    },
    {

        description: 'Criação Site',
        amount: 500000,
        date: '23/01/2021'
    },
    {

        description: 'Internet',
        amount: -20012,
        date: '23/01/2021'
    },
    {

        description: 'App',
        amount: 200000,
        date: '23/01/2021'
    }
    ],

    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },
    incomes() { //soma das entradas
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income;
    },

    expenses() {//soma das Saidas
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense;
    },

    total() {       //Total das transactions
        return Transaction.incomes() + Transaction.expenses();
    }

}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),//selecionando o tbory

    addTransaction(transaction, index) { //criando o tr e adicionando o transaction formatada
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction) {//formantando transaction
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount)

        const html = ` 

            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td> <img src="./assets/minus.svg" alt="remover itens"></td>

        `
        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay') //pegando o elemento do <p> income display
            .innerHTML = Utils.formatCurrency(Transaction.incomes()) //substituindo o html pela soma das entradas
        document
            .getElementById('expenseDisplay') //pegando o elemento do <p> expense display
            .innerHTML = Utils.formatCurrency(Transaction.expenses()) //substituindo o html pela soma das entradas
        document
            .getElementById('totalDisplay') //pegando o elemento do <p> total display
            .innerHTML = Utils.formatCurrency(Transaction.total()) //substituindo o html pela soma das entradas


    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {  //formantando valores
    formatAmount(value) {
        console.log(value)
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "" //colocando sinal negativo

        value = String(value).replace(/\D/g, "")//usando /\D/ tiro tudo que não é numero da string

        value = Number(value) / 100 //transformando em formato de dinheiro.

        value = value.toLocaleString("pt-BR", { //formata em BRL
            style: "currency",
            currency: "BRL"
        });
        return signal + value //retorna o valor no formato de real e com o sinal 
    }


}
const Form = {
    description: document.querySelector('input#description'),//linkando os dados do html junto ao JS
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateFields() {
        
       // const { description, amount, date } = Form.getValues()

      //  if (description.trim() === "" ||
       //     amount.trim() === "" ||
       //     date.trim() === "") {
        //    throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)
    },

    submit(event) {
        event.preventDefault()

        try {
            // AbrirForm.validateFields()//valida os dados do formulario
            Form.formatValues()
        } catch (error) {
            alert(error.message)
        }



    }
}

const App = {
    init() {
        Transaction.all.forEach(transaction => { //para cada transaction criada ele insere na tabela
            DOM.addTransaction(transaction)
        })
        DOM.updateBalance() //atualizando os Display de controle


    },

    reload() {
        DOM.clearTransactions()
        App.init()
    },
}
App.init()

Transaction.remove(2)
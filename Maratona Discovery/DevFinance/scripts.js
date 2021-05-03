const Modal = {//abre e fecha o formulario 
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

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []//pegando o valor da trasactions e salvo no storage
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transaction", JSON.stringify(transactions));//json transforma as transactions(array) em string 
    },

}

const Transaction = {//trata as transaçoes
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)//remove a trasaction da lista 1 elemento pelo index

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

const DOM = {//trata os documents dentro do html
    transactionsContainer: document.querySelector('#data-table tbody'),//selecionando o tbory

    addTransaction(transaction, index) { //criando o tr e adicionando o transaction formatada
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction, index) {//formantando transaction
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount)

        const html = ` 

            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td> <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação"></td>

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
        value = Number(value) * 100

        return value
    },
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
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
    description: document.querySelector('input#description'),
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
        const { description, amount, date } = Form.getValues()

        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()//validar os campos

            const transaction = Form.formatValues()  //formatar os dados para salvar

            Transaction.add(transaction)//salvar os dados

            Form.clearFields()

            Modal.close()

        } catch (error) {
            alert(error.message)
        }
    }
}



const App = { //funcionalidades do aplicativo
    init() {//inicia a aplicaçao
        Transaction.all.forEach((transaction, index) => { //para cada transaction criada ele insere na tabela
            DOM.addTransaction(transaction, index)
        })
        DOM.updateBalance() //atualizando os Display de controle

        Storage.set(Transaction.all)// atualizando o local storage
    },

    reload() {// recarrega a aplicação
        DOM.clearTransactions()
        App.init()
    },
}
App.init()

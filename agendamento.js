
const links = document.querySelector('.toggle-Links');

function showMenu() {
    links.classList.toggle('active')
}


//Agendamentos:

class Agendamento {
    constructor(nome, data, telefone) {
        this.nome = nome;
        this.data = data;
        this.telefone = telefone;
    }

    validarAgendamento() {
        for (let i in this) {
            if (this[i] === undefined || this[i] === "") {
                return false;
            }
        }
        return true;
    }
}

function agendar() {
    let nome = document.getElementById('nomeag').value;
    let data = document.getElementById('dataag').value;
    let telefone = document.getElementById('telefoneag').value;

    const agendamento1 = new Agendamento(nome, data, telefone);
    if (agendamento1.validarAgendamento()) {
        // criar item no banco 
        database1.createDatabaseItem(agendamento1);
    }

    mostrarAgendamentos()
}



function getNextId() {
    const nextId = localStorage.getItem('id');
    return parseInt(nextId) + 1;
}

function mostrarAgendamentos(agendamentos = Array()) {
    if(agendamentos.length === 0){
        agendamentos = database1.carregarAgendamento();
    }

    console.log('Agendamentos a serem exibidos:', agendamentos);
    const listaAgendamento = document.getElementById('showAg');

    listaAgendamento.innerHTML = ''

    agendamentos.forEach((t) => {
        const row = listaAgendamento.insertRow();

        row.insertCell(0).innerHTML = t.nome;
        row.insertCell(1).innerHTML = t.data;
        row.insertCell(2).innerHTML = t.telefone;

        const btn = document.createElement('button');
        btn.className = 'delete'
        btn.id = t.id;
        btn.innerHTML = 'Cancelar'
        btn.onclick = () => {
            const id = t.id;
            database1.cancelarAgenda(id)
            window.location.reload()
        }

        row.insertCell(3).append(btn)

        const btnEdit = document.createElement('button');
        btnEdit.className = 'edit'
        btnEdit.id = t.id;
        btnEdit.innerHTML='Editar'
        btnEdit.onclick = () =>{
            const id = t.id;
            editarAgenda(id)
        }

        row.insertCell(4).append(btnEdit)



        const divShow = document.createElement('div');
        divShow.className = "divShow";
        const shownome = document.createElement('p');
        shownome.className = "shownome"
        shownome.innerHTML = `${t.nome}`
        const showData = document.createElement('p');
        showData.className = 'showData'
        showData.innerHTML = `${t.data}`
        const showtel = document.createElement('p');
        showtel.className = 'showTel'
        showtel.innerHTML = `${t.telefone}`
        const title = document.createElement('h3')
        title.className = 'showtitle'
        title.innerHTML = 'Agendamentos'
        const linha = document.createElement('hr')




        const main = document.querySelector('main')
        main.appendChild(divShow);

        divShow.prepend(title)
        divShow.appendChild(shownome)
        divShow.appendChild(showData)
        divShow.appendChild(showtel)
        divShow.appendChild(btn)
        divShow.appendChild(btnEdit)
        divShow.appendChild(linha)

    })
}


function editarAgenda(id){
    const div = document.createElement('div');
    div.className = 'div-editar'
    const inputNome = document.createElement('input')
    inputNome.className = 'nomeagalt'
    inputNome.type = 'text';
    inputNome.placeholder = 'Nome'
    inputNome.id = 'nomeAlt'

    const inputData = document.createElement('input')
    inputData.className = 'dataagalt'
    inputData.type = 'datetime-local'
    inputData.id = 'dataAlt'

    const inputTelefone = document.createElement('input')
    inputTelefone.className = 'telefoneagalt'
    inputTelefone.type = 'text'
    inputTelefone.placeholder = '999999999'
    inputTelefone.id = 'telefoneAlt'

    const btnConcluir = document.createElement('button')
    btnConcluir.className = 'edit2'
    btnConcluir.innerHTML = 'Alterar'
    btnConcluir.onclick = () => {

        let nome = document.getElementById('nomeAlt').value;
        let data = document.getElementById('dataAlt').value;
        let telefone = document.getElementById('telefoneAlt').value;

        let alteracao = {nome, data, telefone};
        database1.editarAgendamento(id, alteracao);
        window.location.reload()
    }

    div.appendChild(inputNome);
    div.appendChild(inputData);
    div.appendChild(inputTelefone);
    div.appendChild(btnConcluir)

    const main = document.querySelector('main');
    main.appendChild(div)
}


function procurarAgendamentos() {
    const nome = document.getElementById('nomeag').value;
    const data = document.getElementById('dataag').value;
    const telefone = document.getElementById('telefoneag').value;

    const agendamento2 = new Agendamento(nome, data, telefone);
    const listAgendamento = database1.buscarAgendamentos(agendamento2);
    mostrarAgendamentos(listAgendamento);
}


class Database {

    constructor() {
        const id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }

    }



    carregarAgendamento() {
        const agendamentos = Array()

        const id = parseInt(localStorage.getItem('id'));

        for (let i = 0; i <= id; i++) {
            const agendamento = JSON.parse(localStorage.getItem(i));

            if (agendamento === null) {
                continue;
            }

            agendamento.id = i;
            agendamentos.push(agendamento);
        }

        return agendamentos;
    }

    createDatabaseItem(agendamento) {
        const id = getNextId();
        localStorage.setItem(id, JSON.stringify(agendamento));
        localStorage.setItem('id', id)
    }


    buscarAgendamentos(agendamento){
        const filteredAgendamentos = Array();

        filteredAgendamentos = this.carregarAgendamento();

        if(agendamento.nome != ''){
            filteredAgendamentos = filteredAgendamentos.filter(t => t.nome === agendamento.nome)
        }
        if(agendamento.data != ''){
            filteredAgendamentos = filteredAgendamentos.filter(t => t.data === agendamento.data)
        }
        if(agendamento.telefone != ''){
            filteredAgendamentos = filteredAgendamentos.filter(t => t.telefone === agendamento.telefone)
        }

        return filteredAgendamentos
    }

    cancelarAgenda(id){
        localStorage.removeItem(id)
    }

    editarAgendamento(id, alteracao){
        let agendamento = JSON.parse(localStorage.getItem(id))

        if(agendamento){
            agendamento.nome = alteracao.nome||agendamento.nome
            agendamento.data = alteracao.data||agendamento.data
            agendamento.telefone = alteracao.telefone||agendamento.telefone
        }

        localStorage.setItem(id, JSON.stringify(agendamento));
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if(document.body.contains(document.getElementById('showAg'))){
        mostrarAgendamentos()
    }

});

const database1 = new Database();
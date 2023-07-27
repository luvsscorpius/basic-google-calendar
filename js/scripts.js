// Criando a classe evento para deixar o calendario interativo
class Evento {
    constructor() {
        this.eventsByDate = {};
    }

    // Método para adicionar eventos
    addEvent(date, title, color) {
        const dateString = date.toDateString();
        if (!this.eventsByDate[dateString]) {
            this.eventsByDate[dateString] = [];
        }
        this.eventsByDate[dateString].push({ title, color, date });
    }

    // Método para separar os eventos por data
    getEventsByDate(date) {
        const dateString = date.toDateString();
        return this.eventsByDate[dateString] || [];
    }

    //Método para atualizar o evento 
    updateEvent(oldDate, oldTitle, oldColor, newDate, newTitle, newColor) {
        // precisamos verificar se o evento existe na lista
        // Transformando a data em string
        const oldDateString = oldDate.toDateString()
        if (this.eventsByDate[oldDateString]) {
            // Agora se o método existir precisamos encontrar o index do método
            const oldEventIndex = this.eventsByDate[oldDateString].findIndex(event => {
                return event.title === oldTitle && event.color === oldColor
            })

            // se o evento foi encontrado, atualize com as novas informações
            // se for -1 um isso significa que o evento antigo não foi encontrado na lista
            if (oldEventIndex !== -1) {
                this.eventsByDate[oldDateString][oldEventIndex].title = newTitle;
                this.eventsByDate[oldDateString][oldEventIndex].color = newColor;
                this.eventsByDate[oldDateString][oldEventIndex].date = newDate;
            } else {
                // caso o evento não seja encontrado na lista
                console.log("Evento não encontrado na lista.");
            }
        }
    }

    // Método para deletar eventos da lista
    deleteEvent(date, title, color) {
        // transformando a data em string
        const dateString = date.toDateString()

        // Verificar se o evento existe
        if (this.eventsByDate[dateString]) {
            // Depois de verificar se existe, precisamos achar o evento especifico
            const eventIndex = this.eventsByDate[dateString].findIndex(event => {
                return event.title === title && event.color === color
            })
            // se o eventIndex for diferente de -1 faça
            if (eventIndex !== -1) {
                // o método splice remove o evento do array
                this.eventsByDate[dateString].splice(eventIndex, 1)
            } else {
                // Caso o evento não seja encontrado
                console.log('Evento não encontrado na lista.')
            }
        }
    }
}

// Váriavel global para pegar o mês atual
let currentMonth = new Date().getMonth()
// Váriavel global para pegar o ano atual
let currentYear = new Date().getFullYear()

// Pegando a cor selecionada
const eventColorSelect = document.querySelector("#eventColor");
const selectedOption = document.querySelector(".selected-option");

// Evento de escuta para ver qual cor foi escolhida ou trocada
eventColorSelect.addEventListener("change", () => {
    const color = eventColorSelect.value;
    selectedOption.style.backgroundColor = color;
});

// Instanciado novo evento
const eventManager = new Evento()

// Pegando o botão de salvar
const btnSalvar = document.querySelector('#btnSalvar')

btnSalvar.addEventListener('click', () => {
    // Pegando título, cor e data do formulário
    const title = document.querySelector('#eventTitle').value
    const color = document.querySelector('#eventColor').value
    const date = new Date(document.querySelector('#eventTime').value);
    // Adiciona o novo evento à lista de eventos para a data selecionada
    eventManager.addEvent(date, title, color);

    // Atualiza o mês e o ano correntes
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();

    // Atualiza o calendário com os novos eventos
    generateCalendar(currentMonth, currentYear, eventManager);
})

// Pegando o corpo do calendário (tabela) e o span onde ficará o nome do mês atual e ano atual
const calendarBody = document.querySelector('.calendar-body')
const monthYearText = document.querySelector('#month-year')

// Pegando os span/buttons para ver o próximo mês e mês anterior
const previousMonth = document.querySelector('#previousMonth')
const nextMonth = document.querySelector('#nextMonth')

// Função para gerar o calendário
const generateCalendar = (month, year, eventManager) => {
    // Pega o primeiro dia do mês
    const firstDay = new Date(year, month, 1).getDay()

    // Pega o ultimo dia do mês
    const lastDay = new Date(year, month + 1, 0).getDate()

    // Pegando a data atual (número do dia atual do mês)
    const today = new Date().getDate()

    // Limpa o corpo da tabela
    calendarBody.innerHTML = ''

    // Adiiona o mes e o ano no h2
    monthYearText.textContent = `${getMonthName(month)} ${year}`

    // iniciando uma variavel com 1
    let date = 1

    // Se week for menor do que 6, instancie um ate chegar em 5
    for (let week = 0; week < 6; week++) {
        const row = document.createElement('tr') // Criando uma linha

        // Se day for menor do que 7, instancie ate chegar em 6
        for (let day = 0; day < 7; day++) {
            const cell = document.createElement('td') // criando celula
            const cellDay = document.createElement('p') // criando um paragrafo onde ficara os dias
            cell.setAttribute('data-target', '#ExemploModalCentralizado') // adicionando um atributo (data-target) para a célula, para quando eu clicar na celula ele abra o modal
            cell.setAttribute('data-toggle', 'modal') // adicionando outro atributo (data-togle), para quando eu clicar na celula ele abra o modal
            cell.classList.add('cellCalendar') // Adicionando uma classe na celula
            cell.appendChild(cellDay) // Adicionando o paragrafo como filho da celula

            // Evento de clique na celula
            cell.addEventListener('click', () => {
                // Pegando a data da celula clicada, com ano, mês e transformando o conteudo da celula em número
                const clickedDate = new Date(year, month, parseInt(cell.textContent));

                // Pegando o evento clicado, se existir
                const clickedEventItem = event.target.closest('.event-item')
                if (clickedEventItem) {

                    cell.setAttribute('data-target', '#modalEdicao') // Adicionando o mesmo atributo para abrir o modal de edição
                    cell.setAttribute('data-toggle', 'modal')

                    // Pegando o titulo, cor e data do evento clicado
                    const title = clickedEventItem.dataset.eventTitle
                    const color = clickedEventItem.dataset.eventColor
                    const adjustedDate = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
                    const dateString = adjustedDate.toISOString().slice(0, 16); // Formate a data para 'YYYY-MM-DDTHH:mm'

                    // Pegando o input do modal de edição
                    const titleInput = document.querySelector('#eventTitleEdicao')
                    const colorInput = document.querySelector('#eventColorEdicao')
                    const dateInput = document.querySelector('#eventTimeEdicao')

                    // adicionando os valores do evento clicado nos inputs do modal de edição
                    titleInput.value = title
                    colorInput.value = color
                    dateInput.value = dateString;

                    //Pegando o botão de salvar edição
                    const btnSalvarEdicao = document.querySelector('#btnSalvarEdicao')

                    // Evento de clique
                    btnSalvarEdicao.addEventListener('click', () => {

                        // Criando constantes para ter novo titulo, cor e data
                        // O titulo, cor e data que estiver no input (mesmo se for alterado) vão ser adicionados as contantes
                        const newTitle = titleInput.value
                        const newColor = colorInput.value
                        const newDate = new Date(dateInput.value)

                        // Precisamos obter o título e a cor do evento clicado que estao armazenados no dataset
                        const oldTitle = clickedEventItem.dataset.eventTitle
                        const oldColor = clickedEventItem.dataset.eventColor

                        // Precisamos mandar atualizar agora
                        // Enviando a data clicada, titulo antigo, cor antiga, a nova data, novo titulo e nova cor para a constante eventManager que instancia novo evento e depois para o método updateEvent com os parâmetros do método
                        eventManager.updateEvent(clickedDate, oldTitle, oldColor, newDate, newTitle, newColor);

                        // E por fim precisamos atualizar o calendário
                        generateCalendar(currentMonth, currentYear, eventManager)
                    })

                    // Capturando o botão de deletar
                    const btnDelete = document.querySelector('#btnDelete')

                    // Evento de clique
                    btnDelete.addEventListener('click', () => {

                        // Pegando as informações a serem deletadas (foram salvas no dataset)
                        const dateToDelete = new Date(clickedEventItem.dataset.eventDate); // Converter a data de volta para objeto Date
                        const titleToDelete = clickedEventItem.dataset.eventTitle
                        const colorToDelete = clickedEventItem.dataset.eventColor

                        // Enviando para a constante que instancia o novo evento, e depois para o método deleteEvent
                        eventManager.deleteEvent(dateToDelete, titleToDelete, colorToDelete)

                        // Atualiza o calendário novamente
                        generateCalendar(currentMonth, currentYear, eventManager)
                    })

                    // Se não tiver clicado em nenhum evento ele abre o modal de adicionar evento
                } else {
                    // Mostrando no modal a data clicada
                    // Ajuste o mês adicionando +1, pois em JavaScript, os meses são indexados de 0 a 11
                    const adjustedDate = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
                    const dateString = adjustedDate.toISOString().slice(0, 16); // Formate a data para 'YYYY-MM-DDTHH:mm'
                    document.getElementById('eventTime').value = dateString;

                    // O título em branco 
                    const title = document.querySelector('#eventTitle')
                    title.value = ""
                }
            })

            // se ainda nao chegou no primeiro dia do mes ou ja passou do ultimo dia a celular fica vazia
            if ((week === 0 && day < firstDay) || (date > lastDay)) {
                cell.textContent = '' // Limpando a celula
            } else {
                cellDay.textContent = date // Adiciona no a cada paragrafo a data

                // Cria o elemento para mostrar os eventManager
                const eventElement = document.createElement('div');
                eventElement.classList.add('event-container'); // Adicionando classe
                eventElement.classList.add('celulas') // Adicionando classe

                // Verifica se há eventos para a data atual
                const currentDate = new Date(year, month, date);
                const eventsForDate = eventManager.getEventsByDate(currentDate);

                // Verifica se o dia atual pertence ao mês atual antes de adicionar a classe 'cellDay'
                if (month === currentMonth && year === currentYear) {
                    // Comparação para adicionar a classe 'cellDay' para o dia atual
                    // Para resolver o bug de estar adicionando a mesma classe para todos os dias iguais ao today e não somente ao dia atual do mês atual, transformamos o conteudo do cellDay em um número e comparamos com a today (o número atual do mes) e depois comparamos o mês com o mes atual. Se não batesse a gente tiraria a classe cellDay e se o mes e o ano não fossem iguais ao mes e ano atual também tirariamos.
                    if (parseInt(cellDay.textContent) === today && month === new Date().getMonth()) {
                        cellDay.classList.add('cellDay'); // Adiciona a classe cellDay para a data
                    } else { // Se não remove a classe
                        cellDay.classList.remove('cellDay');
                    }
                } else {
                    cellDay.classList.remove('cellDay');
                }

                // Mostra os eventos na célula de cada data
                eventsForDate.forEach(event => {
                    // Cria uma div para cada evento
                    const eventItem = document.createElement('div');
                    eventItem.classList.add('event-item'); // Adiciona a classe para cada div

                    // Coloca a cor de fundo escolhida pelo usuário
                    eventItem.style.backgroundColor = event.color
                    // Coloca o titulo adicionado pelo usuário com negrito
                    eventItem.innerHTML = `<strong>${event.title}</strong>`;

                    // Armazenar as informações do evento como atributos de dados
                    eventItem.dataset.eventTitle = event.title
                    eventItem.dataset.eventColor = event.color
                    eventItem.dataset.eventDate = event.date.toISOString(); // Adiciona o atributo eventDate

                    // Adiciona o eventItem como filho de eventElement
                    eventElement.appendChild(eventItem);
                });

                // Adiciona o elemento de eventos à célula
                cell.appendChild(eventElement);

                // Incrementa o contador de dias
                date++;

            }
            // Adiciona as celulas as linhas
            row.appendChild(cell)
        }
        // Adiciona as linhas ao corpo do calendário (tabela)
        calendarBody.appendChild(row)
    }

}

// Função para obter o dia atual do mês corrente
const getCurrentDay = () => {
    const currentDate = new Date();
    return currentDate.getDate();
};

// Criando uma constante para os nomes dos meses
const getMonthName = (month) => {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    // retorna o mes para a função generateCalendar
    return monthNames[month]
}

// Chamando as funções
getMonthName()
generateCalendar(currentMonth, currentYear, eventManager)

// Evento de escuta ao clicar no botao de mes anterior
previousMonth.addEventListener('click', () => {
    // Tira um mês ao ser clicado
    currentMonth--
    // Se o mes atual for menor do que 0, ele atualiza a variável para 11 (penultmo mes)
    if (currentMonth < 0) {
        currentMonth = 11
        // Tira um ano
        currentYear--
    }
    today = getCurrentDay(); // Atualiza o dia atual do mês corrente
    //Atualiza o calendário
    generateCalendar(currentMonth, currentYear, eventManager)
})

// Evento de escuta ao clicar no botao de próximo mes
nextMonth.addEventListener('click', () => {
    // Adiciona mais um ao mes atual
    currentMonth++
    // Se mês atual for maior que 11 (no caso 12) ele atualiza a variável para 0
    if (currentMonth > 11) {
        currentMonth = 0
        // E adiciona mais 1 ao ano atual
        currentYear++
    }
    today = getCurrentDay(); // Atualiza o dia atual do mês corrente
    // Atualiza o calendario
    generateCalendar(currentMonth, currentYear, eventManager)
})
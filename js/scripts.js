class Evento {
    constructor() {
        this.eventsByDate = {};
    }

    addEvent(date, title, color) {
        const dateString = date.toDateString();
        if (!this.eventsByDate[dateString]) {
            this.eventsByDate[dateString] = [];
        }
        this.eventsByDate[dateString].push({ title, color });
    }

    getEventsByDate(date) {
        const dateString = date.toDateString();
        return this.eventsByDate[dateString] || [];
    }
}

let currentMonth = new Date().getMonth()
console.log(currentMonth)
let currentYear = new Date().getFullYear()

const eventColorSelect = document.getElementById("eventColor");
const selectedOption = document.getElementById("selectedOption");

eventColorSelect.addEventListener("change", () => {
    const color = eventColorSelect.value;
    selectedOption.style.backgroundColor = color;
});

const eventManager = new Evento()

const btnSalvar = document.querySelector('#btnSalvar')

btnSalvar.addEventListener('click', () => {
    console.log('teste')
    const title = document.querySelector('#eventTitle').value
    const color = document.querySelector('#eventColor').value
    const date = new Date(document.getElementById('eventTime').value);
    // Adiciona o novo evento à lista de eventos para a data selecionada
    eventManager.addEvent(date, title, color);

    // Atualiza o mês e o ano correntes
    currentMonth = date.getMonth();
    currentYear = date.getFullYear();

    // Atualiza o calendário com os novos eventos
    generateCalendar(currentMonth, currentYear, eventManager);
})

const calendarBody = document.querySelector('.calendar-body')
const monthYearText = document.querySelector('#month-year')

const previousMonth = document.querySelector('#previousMonth')
const nextMonth = document.querySelector('#nextMonth')

const generateCalendar = (month, year, eventManager) => {
    // Pega o primeiro dia do mês
    const firstDay = new Date(year, month, 1).getDay()

    // Pega o ultimo dia do mês
    const lastDay = new Date(year, month + 1, 0).getDate()

    // Transforma a data em string
    const today = new Date().toDateString()

    // Limpa o corpo da tabela
    calendarBody.innerHTML = ''

    // Adiiona o mes e o ano no h2
    monthYearText.textContent = `${getMonthName(month)} ${year}`

    // iniciando uma variavel com 1
    let date = 1
    dayOfTheWeek = firstDay

    for (let week = 0; week < 6; week++) {
        const row = document.createElement('tr') // Criando uma linha

        for (let day = 0; day < 7; day++) {
            const cell = document.createElement('td') // criando celula
            cell.setAttribute('data-target', '#ExemploModalCentralizado')
            cell.setAttribute('data-toggle', 'modal')
            cell.classList.add('day-cell')
            cell.addEventListener('click', () => {
                const clickedDate = new Date(year, month, parseInt(cell.textContent));
                // Ajuste o mês adicionando +1, pois em JavaScript, os meses são indexados de 0 a 11
                const adjustedDate = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
                const dateString = adjustedDate.toISOString().slice(0, 16); // Formate a data para 'YYYY-MM-DDTHH:mm'
                document.getElementById('eventTime').value = dateString;

                const title = document.querySelector('#eventTitle')
                title.value = ""
            })

            // se ainda nao chegou no primeiro dia do mes ou ja passou do ultimo dia a celular fica vazia
            if ((week === 0 && day < firstDay) || (date > lastDay)) {
                cell.textContent = '' // Limpando a celula
            } else {
                cell.textContent = date

                // Cria o elemento para mostrar os eventManager
                const eventElement = document.createElement('div');
                eventElement.classList.add('event-container');
                eventElement.classList.add('celulas')

                // Verifica se há eventos para a data atual
                const currentDate = new Date(year, month, date);
                const eventsForDate = eventManager.getEventsByDate(currentDate);

                // Mostra os eventos na célula
                eventsForDate.forEach(event => {
                    const eventItem = document.createElement('div');
                    eventItem.classList.add('event-item');
                    eventItem.style.backgroundColor = event.color
                    eventItem.innerHTML = `<strong>${event.title}</strong>`;
                    eventElement.appendChild(eventItem);
                });

                // Adiciona o elemento de eventManager à célula
                cell.appendChild(eventElement);
                date++;
            }
            row.appendChild(cell)
        }
        calendarBody.appendChild(row)
    }

}

// Criando uma constante para os nomes dos meses
const getMonthName = (month) => {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    // retorna o mes para a função generateCalendar
    return monthNames[month]
}

getMonthName()
generateCalendar(currentMonth, currentYear, eventManager)

previousMonth.addEventListener('click', () => {
    currentMonth--
    if (currentMonth < 0) {
        currentMonth = 11
        currentYear--
    }
    generateCalendar(currentMonth, currentYear, eventManager)
})

nextMonth.addEventListener('click', () => {
    currentMonth++
    if (currentMonth > 11) {
        currentMonth = 0
        currentYear++
    }
    generateCalendar(currentMonth, currentYear, eventManager)
})
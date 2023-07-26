class Evento {
    constructor() {
        this.eventsByDate = {};
    }

    addEvent(date, title, color) {
        const dateString = date.toDateString();
        if (!this.eventsByDate[dateString]) {
            this.eventsByDate[dateString] = [];
        }
        this.eventsByDate[dateString].push({ title, color, date });
    }

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

            console.log(oldEventIndex)

            // se o evento foi encontrado, atualize com as novas informações
            // se for -1 um isso significa que o evento antigo não foi encontrado na lista
            if (oldEventIndex !== -1) {
                this.eventsByDate[oldDateString][oldEventIndex].title = newTitle;
                this.eventsByDate[oldDateString][oldEventIndex].color = newColor;
                this.eventsByDate[oldDateString][oldEventIndex].date = newDate;
            } else {
                console.log("Evento não encontrado na lista.");
            }
        }
    }

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
                console.log('Evento não encontrado na lista.')
            }
        }
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
    const date = new Date(document.querySelector('#eventTime').value);
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
    const today = new Date().getDate()
    console.log(today)
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
            const cellDay = document.createElement('p')
            cell.setAttribute('data-target', '#ExemploModalCentralizado')
            cell.setAttribute('data-toggle', 'modal')
            cell.classList.add('cellCalendar')
            cell.appendChild(cellDay)
            cell.addEventListener('click', () => {
                const clickedDate = new Date(year, month, parseInt(cell.textContent));

                const clickedEventItem = event.target.closest('.event-item')
                if (clickedEventItem) {

                    console.log('ha eventos')
                    cell.setAttribute('data-target', '#modalEdicao')
                    cell.setAttribute('data-toggle', 'modal')
                    const title = clickedEventItem.dataset.eventTitle
                    const color = clickedEventItem.dataset.eventColor
                    const adjustedDate = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
                    const dateString = adjustedDate.toISOString().slice(0, 16); // Formate a data para 'YYYY-MM-DDTHH:mm'

                    const titleInput = document.querySelector('#eventTitleEdicao')
                    const colorInput = document.querySelector('#eventColorEdicao')
                    const dateInput = document.querySelector('#eventTimeEdicao')

                    titleInput.value = title
                    colorInput.value = color
                    dateInput.value = dateString;

                    const btnSalvarEdicao = document.querySelector('#btnSalvarEdicao')

                    btnSalvarEdicao.addEventListener('click', () => {

                        const newTitle = titleInput.value
                        const newColor = colorInput.value
                        const newDate = new Date(dateInput.value)

                        // Precisamos obter o título e a cor do evento clicado que estao armazenados no dataset
                        const oldTitle = clickedEventItem.dataset.eventTitle
                        const oldColor = clickedEventItem.dataset.eventColor

                        // Precisamos mandar atualizar agora
                        eventManager.updateEvent(clickedDate, oldTitle, oldColor, newDate, newTitle, newColor);

                        // E por fim precisamos atualizar o calendário
                        generateCalendar(currentMonth, currentYear, eventManager)
                    })

                    const btnDelete = document.querySelector('#btnDelete')

                    btnDelete.addEventListener('click', () => {
                        console.log('Apaguei')

                        const dateToDelete = new Date(clickedEventItem.dataset.eventDate); // Converter a data de volta para objeto Date
                        const titleToDelete = clickedEventItem.dataset.eventTitle
                        const colorToDelete = clickedEventItem.dataset.eventColor

                        eventManager.deleteEvent(dateToDelete, titleToDelete, colorToDelete)

                        generateCalendar(currentMonth, currentYear, eventManager)
                    })


                } else {
                    // Ajuste o mês adicionando +1, pois em JavaScript, os meses são indexados de 0 a 11
                    const adjustedDate = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
                    const dateString = adjustedDate.toISOString().slice(0, 16); // Formate a data para 'YYYY-MM-DDTHH:mm'
                    document.getElementById('eventTime').value = dateString;

                    const title = document.querySelector('#eventTitle')
                    title.value = ""
                }
            })

            // se ainda nao chegou no primeiro dia do mes ou ja passou do ultimo dia a celular fica vazia
            if ((week === 0 && day < firstDay) || (date > lastDay)) {
                cell.textContent = '' // Limpando a celula
            } else {
                cellDay.textContent = date

                if (date === today) {
                    cellDay.classList.add('cellDay')
                }

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

                    // Armazenar as informações do evento como atributos de dados
                    eventItem.dataset.eventTitle = event.title
                    eventItem.dataset.eventColor = event.color
                    eventItem.dataset.eventDate = event.date.toISOString(); // Adiciona o atributo eventDate

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
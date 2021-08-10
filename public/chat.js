const socket = io();


// DOM
let message = document.getElementById('message');
let username = document.getElementById('username');
let send = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');

// emitir mensaje
    send.addEventListener('click', () => {
        socket.emit('client:message', {
            username: username.value,
            message: message.value
    })})


socket.on('server:message', (data) => {
    let time = new Date();
    output.innerHTML += `
    <div class="
    rounded-b-md
    flex flex-col 
    max-w-2xl
    break-all
    object-left
    ">
        <div class="
        px-8 py-3
        rounded-t-md
        flex flex-row 
        max-w-2xl
        space-x-2
        ">
            <p class="font-bold text-gray-900">${data.username}</p>
            <p class="italic text-gray-700">${time.getDay()} / ${time.getMonth()} / ${time.getFullYear()} - ${time.getHours()}:${time.getMinutes()}</p>
        </div>
        <p class="px-8 text-gray-900">${data.message}</p>
    </div>`;
    actions.innerHTML = ''
    // Esto es para hacer scroll
    scroll(0, 999999999999999);
});


// Emitir typing
message.addEventListener('keypress', () => { socket.emit('client:typing', username.value) })

socket.on('server:typing', (data) => {
    actions.innerHTML = `
    <p class="italic text-gray-700">${data} está escribiendo...</p>`
})

// Otros trastes


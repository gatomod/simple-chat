const path = require('path');
const express = require('express');
const app = express();

// Configuración
app.set('port', process.env.PORT || 3001);

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar server
const server = app.listen(app.set('port'), () => {
    console.log('Server en puerto ' + app.set('port'));
});

// Configurar socket io
const socketIO = require('socket.io');
const io = socketIO(server);

// websockets
io.on('connection', (socket) => {
    console.log('Nueva conexión: ' + socket.id);

    // Recibir mensaje y enviar
    socket.on('client:message', (data) => {
        console.log(data.username, 'socket: ', socket.id)
        
        if (data.message.startsWith('/kick')) {
            let cmd = data.message.split(' ');
            const sockets = io.fetchSockets();

            io.sockets.emit('server:message', data);
            io.sockets.emit('server:message', {username: 'CHAT [ Bot ]', message: `${cmd[1]} ha sido expulsado`});
            sockets.clients[cmd[1]].send({ event: 'disconnect' });
            sockets.clients[cmd[1]].connection.end();
            
        } else {
            io.sockets.emit('server:message', data);
        }
        
    });

    // Typeando
    socket.on('client:typing', (data) => {
        socket.broadcast.emit('server:typing', data);
    });
});

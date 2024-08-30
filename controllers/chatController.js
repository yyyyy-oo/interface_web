const socketIo = require('socket.io');

const setupSocketIo = (server) => {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('message', (msg) => {
            console.log('Message received: ' + msg);
            io.emit('message', msg);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}

module.exports = { setupSocketIo };
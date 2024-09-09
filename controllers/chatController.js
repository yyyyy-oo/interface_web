const socketIo = require('socket.io');

const setupSocketIo = (server, sessionMiddleware) => {
    const io = socketIo(server);

    // Socket.IO에서 세션을 사용하기 위한 미들웨어 설정
    io.use((socket, next) => {
        sessionMiddleware(socket.request, {}, next);
    });

    io.on('connection', (socket) => {
        console.log(`connection: ${io.engine.clientsCount}`);

        // 세션에서 유저 id 가져오기
        const session = socket.request.session;
        const sessionId = session.user.id;  // 세션에 저장된 id를 사용

        socket.on('message', (data) => {
            try {
                const receivedData = JSON.parse(data);

                // 세션에 저장된 id 사용
                if (!sessionId || !receivedData.message) throw new Error();
                console.log(`[${sessionId}] ${receivedData.message}`);
                const jsonMessage = { id: sessionId, message: receivedData.message };
                io.emit('message', JSON.stringify(jsonMessage));
            } catch (error) {
                console.error('Wrong Format');
            }
        });

        socket.on('disconnect', () => {
            console.log(`connection: ${io.engine.clientsCount}`);
        });
    });
};

module.exports = { setupSocketIo };
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
const token = require('../modules/token');

const setupSocketIo = (server) => {
    const io = socketIo(server);

    // 쿠키 가져오기
    io.use((socket, next) => cookieParser()(socket.request, socket.request.res || {}, next));

    // 클라이언트 연결
    io.on('connection', (socket) => {
        try {
            const cookies = socket.request.cookies;
            const userid = token.decodeAccess(cookies.token).id;
            if (!userid) throw new Error('Wrong Token');

            console.log('Chat In:', userid);

            // 방 참여
            socket.on('joinRoom', (roomCode) => socket.join(roomCode));

            // 메세지 왔을때
            socket.on('message', (data) => {
                try {
                    const { message, room } = JSON.parse(data);
                    if (!message) throw new Error('Invalid message format');

                    io.to(room).emit('message', JSON.stringify({ id: userid, message }));
                } catch (error) {
                    console.error('Error processing message:', error.message);
                    socket.emit('error', { message: 'Invalid message format' });
                }
            });

            // 방 떠나기
            socket.on('leaveRoom', (roomCode) => socket.leave(roomCode));

            // 연결 끊어질때
            socket.on('disconnect', () => console.log('Chat Out:', userid));
        } catch (error) {
            console.error('Error during connection:', error.message);
            socket.emit('error', { message: 'Authentication error' });
        }
    });
};

module.exports = { setupSocketIo };

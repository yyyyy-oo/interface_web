const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
const token = require('../modules/token');

const { mySQL } = require('../modules/connectDB');

const setupSocketIo = (server) => {
    const io = socketIo(server);

    // 쿠키 가져오기
    io.use((socket, next) => cookieParser()(socket.request, socket.request.res || {}, next));

    // 클라이언트 연결
    io.on('connection', (socket) => {
        try {
            const cookies = socket.request.cookies;
            const userid = token.decode(cookies.token).id;
            if (!userid) throw new Error('Wrong Token');

            console.log('Chat In:', userid);

            // 방 참여
            socket.on('joinRoom', (roomcode) => {
                socket.join(roomcode);
                socket.roomcode = roomcode; // roomcode 저장
            });

            // 메세지 왔을때
            socket.on('message', async (data) => {
                try {
                    const { message } = JSON.parse(data);
                    if (!message) throw new Error('Invalid message format');

                    const roomcode = socket.roomcode;
                    await mySQL('INSERT INTO chat_message (roomcode, user, message, chatdate) VALUES (?, ?, ?, now())', [roomcode, userid, message]);
                    io.to(roomcode).emit('message', JSON.stringify({ user: userid, message: message })); // roomcode에만 전달
                } catch (error) {
                    console.error('Error processing message:', error.message);
                    socket.emit('error', { message: 'Invalid message format' });
                }
            });

            // 방 떠나기
            socket.on('leaveRoom', (roomcode) => {
                socket.leave(roomcode);
                delete socket.roomcode;
            });

            // 연결 끊어질때
            socket.on('disconnect', () => console.log('Chat Out:', userid));
        } catch (error) {
            console.error('Error during connection:', error.message);
            socket.emit('error', { message: 'Authentication error' });
        }
    });
};

const loadMessage = async (req, res) => {
    try {
        const roomcode = req.params.roomcode;
        const dbResult = await mySQL('SELECT user, message FROM chat_message WHERE roomcode = ?', [roomcode]);
        if (dbResult) {
            console.log('Message loaded:', roomcode);
            return res.status(200).json(dbResult);
        }

        console.warn('Roomcode Not Found:', roomcode);
        return res.status(404).json({ message: 'Roomcode Not Found' });
    } catch (error) {
        console.error('[loadMessage]', error);
        return res.status(500).json({ message: 'Message Load Failed' });
    }
};

module.exports = { setupSocketIo, loadMessage };

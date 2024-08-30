// const { Server } = require('socket.io');

// // Socket.IO 서버를 설정하는 함수
// function setupSocketIO(httpServer) {
//   const io = new Server(httpServer); // 전달된 HTTP 서버로 Socket.IO 초기화

//   io.on('connection', (socket) => {
//     console.log(`connection: ${io.engine.clientsCount}`);

//     socket.on('message', (data) => {
//       try {
//         const receivedData = JSON.parse(data);
//         if (!receivedData.id || !receivedData.message) throw new Error();
//         console.log(`[${receivedData.id}] ${receivedData.message}`);
//         io.emit('message', receivedData);
//       } catch (error) {
//         console.error('Wrong Format');
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log(`connection: ${io.engine.clientsCount}`);
//     });
//   });
// }

// module.exports = setupSocketIO; 

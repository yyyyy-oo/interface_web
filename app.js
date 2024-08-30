require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));


// 사용자 설정
const port = process.env.PORT;
const cookie_secret = process.env.COOKIE_SECRET;

//세션 설정
app.use(cookieParser(cookie_secret));
app.use(session({
  secret: cookie_secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false // HTTPS를 사용할 때는 true로 설정
  },
}));

// Swagger 설정
const swaggerFile = require('./swagger/swagger-output.json');
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 라우트 설정
fs.readdirSync(path.join(__dirname, 'routes'))
  .filter(file => file.endsWith('.js'))
  .forEach(file => app.use('/', require(`./routes/${file}`)));


app.get('/', (req, res) => { res.render('Main') });

// 소켓 이벤트 처리
io.on('connection', (socket) => {
  console.log('A user connected');

  // 클라이언트로부터 'message' 이벤트를 받았을 때
  socket.on('message', (msg) => {
    console.log('Message received: ' + msg);
    // 모든 클라이언트에 메시지 전송
    io.emit('message', msg);
  });

  // 클라이언트가 연결을 끊었을 때
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// 서버 포트 설정
server.listen(port, () => { console.log('Port Open:', port) });

// io.on('connection', (socket) => {
//   console.log(`connection: ${io.engine.clientsCount}`);

//   socket.on('message', (data) => {
//     try {
//       const receivedData = JSON.parse(data);
//       if (!receivedData.id || !receivedData.message) throw new Error();
//       console.log(`[${receivedData.id}] ${receivedData.message}`);
//       io.emit('message', receivedData);
//     } catch (error) {
//       console.error('Wrong Format');
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log(`connection: ${io.engine.clientsCount}`);
//   });
// });

// ngrok 설정
const ngrokCommand = 'ngrok http --domain=driving-steadily-leopard.ngrok-free.app ' + port;
exec(ngrokCommand, (error, stdout, stderr) => {
  if (error) { return console.error(`Error executing ngrok: ${error}`) };
  if (stderr) { return console.error(`ngrok stderr: ${stderr}`) };
  console.log('Ngrok Connected');
});
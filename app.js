require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec } = require('child_process');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);
app.use(cookieParser());

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());

// 사용자 설정
const port = process.env.PORT;

// Socket IO 설정
const { setupSocketIo } = require('./controllers/chatController');
setupSocketIo(server);

// Swagger 설정
const swaggerFile = require('./swagger/swagger-output.json');
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 라우트 설정
fs.readdirSync(path.join(__dirname, 'routes'))
  .filter(file => file.endsWith('.js') && file !== 'auth.js')
  .forEach(file => app.use('/', require(`./routes/${file}`)));

// 경로 설정
app.get('/', (req, res) => { res.render('Main') });
app.use((req, res, next) => { res.status(404).render('NotFound') });

// 서버 포트 설정
server.listen(port, () => { console.log('Port Open:', port) });

// ngrok 설정
const ngrokCommand = 'ngrok http --domain=driving-steadily-leopard.ngrok-free.app ' + port;
exec(ngrokCommand, (error, stdout, stderr) => {
  if (error) { return console.error(`Error executing ngrok: ${error}`) };
  if (stderr) { return console.error(`ngrok stderr: ${stderr}`) };
  console.log('Ngrok Connected');
});
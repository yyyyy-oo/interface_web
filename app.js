const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const ngrok = require('ngrok');

require('dotenv').config();
const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));


// 사용자 설정
const port = 3000;
const cookie_secret = "interface518";

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
const todoRoutes = require('./routes/todoRoutes');
app.use('/', todoRoutes);
const accRoutes = require('./routes/accRoutes');
app.use('/', accRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);


app.get('/', (req, res) => { res.render('Main') });
app.use((req, res) => { res.status(404).render('NotFound') });
app.listen(port, async () => {
  const url = await ngrok.connect({ addr: port, authtoken: process.env.NGROK_TOKEN });
  app.use(cors({ origin: url, credentials: true }));
  console.log('ngrok tunnel opened:', url);
});

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());



// 사용자 설정
const port = 3000;
const COOKIE_SECRET = "password1234";


// 사용자 설정 but 건들x
const swaggerFile = require('./swagger/swagger-output.json');
app.use(cookieParser(COOKIE_SECRET));
app.use(session({
  secret: COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // Ms * 초 * 분 * 시간
    httpOnly: true,
    secure: false // HTTPS를 사용할 때는 true로 설정
  },
}));



// 라우팅 설정
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');

app.get('/', (req, res) => {
  res.render('Main');
});
app.use('/', todoRoutes);
app.use('/', authRoutes);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`Port Open: ${port}`);
});
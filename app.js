const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));



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


// Swagger 설정
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 라우트 설정
const todoRoutes = require('./routes/todoRoutes');
app.use('/', todoRoutes);
const accRoutes = require('./routes/accRoutes');
app.use('/', accRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);


app.get('/', (req, res) => { res.render('Main') });

app.listen(port, () => { console.log(`Port Open: ${port}`) });
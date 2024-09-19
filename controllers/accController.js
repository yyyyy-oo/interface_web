const { mySQL } = require('../modules/connectDB');
const { hashPassword } = require('../modules/hashing');
const token = require('../modules/token');

// 중복 아이디 체크
const checkDuplicate = async (req, res) => {
  try {
    const [dbResult] = await mySQL('SELECT id FROM userdata WHERE id = ?', [req.query.id]);
    if (dbResult) {
      console.warn('Duplicate ID:', dbResult.id);
      return res.status(409).json({ message: 'Duplicate ID' });
    }

    return res.status(200).json({ message: 'Not duplicate' });
  } catch (error) {
    console.error('[loadTodoList]', error);
    return res.status(500).json({ message: 'checkDuplicate Failed' });
  }
};

// 계정 생성
const createAccount = async (req, res) => {
  try {
    const { id, pw, username, birthdate, phone, email } = req.body;
    const { salt, hashedPassword } = hashPassword(pw);

    const sql = 'INSERT INTO userdata (id, pw, salt, username, birthdate, phone, email, regDate) VALUES (?, ?, ?, ?, ?, ?, ?, now())';
    await mySQL(sql, [id, hashedPassword, salt, username, birthdate, phone, email]);
    console.log('Register Success:', id);
    return res.status(201).json({ message: 'Register Success' });
  } catch (error) {
    console.error('[createAccount]', error);
    return res.status(500).json({ message: 'Register Failed' });
  }
};

// 마이페이지 로드
const loadUserInfo = async (req, res) => {
  try {
    const id = token.decode(req.cookies.token).id;

    const sql = 'SELECT username, birthdate, phone, email, regDate FROM userdata WHERE id = ?';
    const [dbResult] = await mySQL(sql, [id]);
    console.log('Load UserInfo Success:', id);
    return res.status(200).json(dbResult);
  } catch (error) {
    console.error('[loadUserInfo]', error);
    return res.status(500).json({ message: 'Load UserInfo Failed' });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { username, birthdate, phone, email } = req.body;
    const id = token.decode(req.cookies.token).id;

    const sql = 'UPDATE userdata SET username = ?, birthdate = ?, phone = ?, email = ? WHERE id = ?';
    await mySQL(sql, [username, birthdate, phone, email, id]);
    console.log('Update UserInfo Success:', id);
    return res.status(200).json({ message: 'Update UserInfo Success' });
  } catch (error) {
    console.error('[updateUserInfo]', error);
    return res.status(500).json({ message: 'Update UserInfo Failed' });
  }
};

module.exports = { checkDuplicate, createAccount, loadUserInfo, updateUserInfo };

